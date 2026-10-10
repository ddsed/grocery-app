// ListsScreen.jsx — the overview screen.
// Shows all shopping lists, lets you create a new one, open one, or delete one.
// It holds NO list data itself: everything comes in as props from App.jsx,
// and every change is sent back up through the on... functions.

import { useState } from 'react';

export default function ListsScreen({ lists, onAddList, onOpenList, onDeleteList }) {
  // What's currently typed in the "new list" box.
  // This is a "controlled input": React state is the single source of truth
  // for the input's value.
  const [name, setName] = useState('');

  // Runs when the form is submitted (Add button or Enter key)
  function handleSubmit(e) {
    e.preventDefault(); // stop the browser from reloading the page
    if (!name.trim()) return; // ignore empty input
    onAddList(name); // App.jsx normalizes it (lowercase, trim, ...)
    setName(''); // clear the box for the next list
  }

  // Ask for confirmation before deleting, so a mis-tap doesn't wipe a list
  function handleDelete(list) {
    if (window.confirm(`Delete "${list.name}"?`)) {
      onDeleteList(list.id);
    }
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

      {/* Empty state, shown only when there are no lists */}
      {lists.length === 0 && <p className="empty">Wow, can't believe we have it all. Hvem med toilet paper?</p>}

      {/* One row per list. `key` helps React track rows between renders. */}
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            {/* Tapping the name opens the list */}
            <button className="list-link" onClick={() => onOpenList(list.id)}>
              <span>{list.name}</span>
              {/* Count of items not bought yet */}
              <span className="count">
                {list.items.filter((item) => !item.bought).length} left
              </span>
            </button>

            {/* Delete button for the whole list */}
            <button
              className="delete"
              onClick={() => handleDelete(list)}
              aria-label={`Delete ${list.name}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
