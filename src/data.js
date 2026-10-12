// data.js — everything that talks to Firestore lives here.
// Components never call Firestore directly; they use these hooks and functions.
// That keeps the screens simple and puts all database logic in one place.
//
// Data model in Firestore:
//   lists/{listId}                  -> { name, createdAt }
//   lists/{listId}/entries/{name}   -> { name, bought, addedAt }   (items on that list)
//   items/{name}                    -> { name }                     (catalog of every item ever added)
//
// Items and entries use the normalized name as their document id ("milk").
// That makes duplicates impossible: writing "milk" twice hits the same document.

import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

// ---------- Helpers ----------

// Cleans up any name the user types:
// trim, lowercase, collapse repeated spaces, and replace "/" (not allowed in ids).
// Example: "  Oat   MILK " -> "oat milk"
export const normalize = (text) =>
  text.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\//g, '-');

// Turns a Firestore snapshot into a plain array: [{ id, ...fields }]
const toArray = (snapshot) => snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

// Logs listener errors (e.g. "permission-denied" if security rules block you)
const logError = (where) => (error) => console.error(`Firestore error in ${where}:`, error);

// ---------- Live data hooks ----------
// Each hook opens a real-time listener (onSnapshot). Whenever data changes —
// on THIS device or your partner's — Firestore calls us with the fresh data,
// we put it in state, and React re-renders. The function returned from
// useEffect stops the listener when the component disappears.

// All lists, oldest first
export function useLists() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'lists'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snap) => setLists(toArray(snap)), logError('lists'));
    return unsubscribe;
  }, []);

  return lists;
}

// The entries (items) of one list
export function useEntries(listId) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const ref = collection(db, 'lists', listId, 'entries');
    const unsubscribe = onSnapshot(ref, (snap) => setEntries(toArray(snap)), logError('entries'));
    return unsubscribe;
  }, [listId]); // re-subscribe if a different list is opened

  return entries;
}

// Every item name ever added (for autocomplete), alphabetical
export function useCatalog() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    const ref = collection(db, 'items');
    const unsubscribe = onSnapshot(
      ref,
      (snap) => setNames(snap.docs.map((d) => d.id).sort()),
      logError('catalog')
    );
    return unsubscribe;
  }, []);

  return names;
}

// ---------- Write functions ----------
// We don't wait for these in the UI: Firestore shows changes locally right away
// and syncs to the server in the background (this also works with bad signal).

// Create a new list. addDoc generates a random id for us.
export async function addList(rawName) {
  const name = normalize(rawName);
  if (!name) return;
  await addDoc(collection(db, 'lists'), { name, createdAt: Date.now() });
}

// Delete a list AND its entries.
// Firestore does NOT delete subcollections automatically, so we delete each
// entry first, then the list — all in one batch (all-or-nothing).
export async function deleteList(listId) {
  const entries = await getDocs(collection(db, 'lists', listId, 'entries'));
  const batch = writeBatch(db);
  entries.forEach((entry) => batch.delete(entry.ref));
  batch.delete(doc(db, 'lists', listId));
  await batch.commit();
}

// Add an item to a list, reusing it if it already exists:
// - new name                        -> entry created, name added to catalog
// - already on the list, bought     -> unticked, moves back up
// - already on the list, not bought -> stays (no duplicate)
// { merge: true } means "create if missing, otherwise update these fields".
export async function addItem(listId, rawName) {
  const name = normalize(rawName);
  if (!name) return;

  const batch = writeBatch(db);
  batch.set(doc(db, 'items', name), { name }, { merge: true });
  batch.set(
    doc(db, 'lists', listId, 'entries', name),
    { name, bought: false, addedAt: Date.now() },
    { merge: true }
  );
  await batch.commit();
}

// Tick / untick an entry as bought
export async function toggleBought(listId, entry) {
  await updateDoc(doc(db, 'lists', listId, 'entries', entry.id), { bought: !entry.bought });
}

// Remove an entry from a list (the name stays in the catalog)
export async function deleteItem(listId, entryId) {
  await deleteDoc(doc(db, 'lists', listId, 'entries', entryId));
}
