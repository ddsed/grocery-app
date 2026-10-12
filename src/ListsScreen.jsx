// ListsScreen.jsx — the overview screen.
// Shows all lists live from Firestore, lets you create, open, and delete lists,
// and sign out.

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useLists, useEntries, addList, deleteList } from './data';

export default function ListsScreen({ user, onOpenList }) {
  // Live list of all lists (updates when your partner adds/deletes one)
  const lists = useLists();

  // What's typed in the "new list" box (controlled input)
  const [name, setName] = useState('');

  // Runs on Add button or Enter key
  function handleSubmit(e) {
    e.preventDefault(); // stop the page from reloading
    if (!name.trim()) return; // ignore empty input
    addList(name); // data.js normalizes and saves it
    setName(''); // clear right away; no need to wait for the server
  }

  return (
    <main>
      <h1>D&D Groceries</h1>

      {/* Form to create a new list.
          autoCapitalize="none" stops phone keyboards capitalizing the first letter. */}
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="new list, e.g. snacks for snackish mood"
          autoCapitalize="none"
        />
        <button type="submit">Add</button>
      </form>

      {/* Empty state */}
      {lists.length === 0 && <p className="empty">Wow, we are adults who managed not to forget anything!</p>}

      {/* One row per list */}
      <ul>
        {lists.map((list) => (
          <ListRow key={list.id} list={list} onOpen={() => onOpenList(list)} />
        ))}
      </ul>

      {/* Who's signed in + sign out */}
      <p className="signed-in">
        Signed in as {user.email}{' '}
        <button className="back" onClick={() => signOut(auth)}>
          Sign out
        </button>
      </p>
    </main>
  );
}

// One row on the overview. It's its own component so each row can subscribe
// to its own list's entries and show a live "X left" count.
function ListRow({ list, onOpen }) {
  const entries = useEntries(list.id);
  const left = entries.filter((entry) => !entry.bought).length;

  // Ask before deleting, so a mis-tap doesn't wipe a list for both of you
  function handleDelete() {
    if (window.confirm(`Delete "${list.name}"?`)) deleteList(list.id);
  }

  return (
    <li>
      {/* Tapping the name opens the list */}
      <button className="list-link" onClick={onOpen}>
        <span>{list.name}</span>
        <span className="count">{left} left</span>
      </button>

      {/* Delete the whole list */}
      <button className="delete" onClick={handleDelete} aria-label={`Delete ${list.name}`}>
        ✕
      </button>
    </li>
  );
}
