// App.jsx — the "brain" of the app.
// It holds all the data (lists, items, item catalog), the functions that
// change that data, and decides which screen to show.
// From Evening 3, the data moves from useState into Firestore.

import './firebase'; // connects to Firebase (not used yet; Evening 3 will use it)
import { useState } from 'react';
import ListsScreen from './ListsScreen';
import ListScreen from './ListScreen';

// ---------- Helpers ----------

// Creates a simple unique id for new lists.
// Items don't need this: their (normalized) name is their id.
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// Cleans up any name the user types:
// - trims spaces at both ends
// - forces lowercase
// - collapses repeated spaces into one
// - replaces "/" with "-" (Firestore document ids can't contain "/")
// Example: "  Oat   MILK " -> "oat milk"
const normalize = (text) =>
  text.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\//g, '-');

export default function App() {
  // ---------- State (the app's data) ----------

  // All shopping lists. Shape:
  // [{ id: 'abc', name: 'weekly shop', items: [{ id: 'milk', name: 'milk', bought: false }] }]
  const [lists, setLists] = useState([]);

  // Every item name ever added, across all lists. Powers autocomplete.
  // Deleting an item from a list does NOT remove it from here.
  const [catalog, setCatalog] = useState([]);

  // Which list is open. null = show the overview of all lists.
  const [openListId, setOpenListId] = useState(null);

  // ---------- List actions ----------

  // Create a new list. Empty names (or only spaces) are ignored.
  function addList(rawName) {
    const name = normalize(rawName);
    if (!name) return;
    setLists([...lists, { id: newId(), name, items: [] }]);
  }

  // Delete a whole list, including its items.
  // filter() keeps every list EXCEPT the one with this id.
  function deleteList(listId) {
    setLists(lists.filter((list) => list.id !== listId));
  }

  // ---------- Item actions ----------

  // Helper: change the items of ONE list and leave all other lists untouched.
  // `changeItems` receives that list's current items and returns the new array.
  // We always build NEW arrays/objects (map, filter, ...spread) instead of
  // editing existing ones — that's how React notices the change and re-renders.
  function updateItems(listId, changeItems) {
    setLists(
      lists.map((list) =>
        list.id === listId ? { ...list, items: changeItems(list.items) } : list
      )
    );
  }

  // Add an item to a list, reusing it if it already exists:
  // - new name                          -> added to the list (and to the catalog)
  // - already in the list, bought       -> unticked, moves back to the top
  // - already in the list, not bought   -> no change (no duplicates)
  function addItem(listId, rawName) {
    const name = normalize(rawName);
    if (!name) return;

    // Remember the name for autocomplete if we haven't seen it before
    if (!catalog.includes(name)) setCatalog([...catalog, name]);

    updateItems(listId, (items) => {
      const exists = items.some((item) => item.name === name);

      if (exists) {
        // Reuse the existing item: make sure it's unticked
        return items.map((item) =>
          item.name === name ? { ...item, bought: false } : item
        );
      }

      // Brand new for this list. The name doubles as the id,
      // which makes duplicates impossible.
      return [...items, { id: name, name, bought: false }];
    });
  }

  // Tick / untick an item as bought (flips true <-> false)
  function toggleBought(listId, itemId) {
    updateItems(listId, (items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, bought: !item.bought } : item
      )
    );
  }

  // Remove an item from a list (it stays in the catalog for autocomplete)
  function deleteItem(listId, itemId) {
    updateItems(listId, (items) => items.filter((item) => item.id !== itemId));
  }

  // ---------- Which screen to show ----------

  // Find the open list. undefined if no list is open (or it was just deleted).
  const openList = lists.find((list) => list.id === openListId);

  // A list is open -> show its detail screen.
  // The arrow functions "pre-fill" the list id, so ListScreen only has to
  // pass item information back up.
  if (openList) {
    return (
      <ListScreen
        list={openList}
        catalog={catalog}
        onBack={() => setOpenListId(null)}
        onAddItem={(name) => addItem(openList.id, name)}
        onToggleBought={(itemId) => toggleBought(openList.id, itemId)}
        onDeleteItem={(itemId) => deleteItem(openList.id, itemId)}
      />
    );
  }

  // No list open -> show the overview of all lists
  return (
    <ListsScreen
      lists={lists}
      onAddList={addList}
      onOpenList={setOpenListId}
      onDeleteList={deleteList}
    />
  );
}
