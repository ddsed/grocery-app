// ListScreen.jsx — the detail screen for ONE shopping list.
// Lets you add items (with autocomplete from the catalog),
// tick them as bought, and delete them.
// Like ListsScreen, it holds no list data itself: it gets everything via
// props from App.jsx and reports changes back through the on... functions.

import { useState } from 'react';

export default function ListScreen({
  list, // the open list: { id, name, items: [...] }
  catalog, // every item name ever added, for autocomplete
  onBack, // go back to the overview
  onAddItem, // add (or reuse) an item by name
  onToggleBought, // tick / untick an item by id
  onDeleteItem, // remove an item by id
}) {
  // What's currently typed in the "add item" box (controlled input)
  const [name, setName] = useState('');

  // Runs when the form is submitted (Add button or Enter key)
  function handleSubmit(e) {
    e.preventDefault(); // stop the browser from reloading the page
    if (!name.trim()) return; // ignore empty input
    onAddItem(name); // App.jsx normalizes it and handles duplicates
    setName(''); // clear the box for the next item
  }

  // Sort so unbought items come first and bought ones sink to the bottom.
  // In JavaScript, true - false = 1 and false - true = -1, so this works on booleans.
  // [...list.items] makes a copy first, because sort() would otherwise
  // change the original array (and we never change state directly).
  const sortedItems = [...list.items].sort((a, b) => a.bought - b.bought);

  return (
    <main>
      {/* Back to the overview */}
      <button className="back" onClick={onBack}>
        ← Lists
      </button>

      <h1>{list.name}</h1>

      {/* Form to add an item.
          list="item-suggestions" connects the input to the <datalist> below,
          so the browser suggests names you've used before.
          autoCapitalize="none" stops phone keyboards capitalizing the first letter. */}
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="add item, e.g. milk"
          list="item-suggestions"
          autoCapitalize="none"
        />
        <datalist id="item-suggestions">
          {catalog.map((itemName) => (
            <option key={itemName} value={itemName} />
          ))}
        </datalist>
        <button type="submit">Add</button>
      </form>

      {/* Empty state, shown only when the list has no items */}
      {list.items.length === 0 && <p className="empty">This list is empty. Add an item above.</p>}

      {/* One row per item. The "bought" class adds the strike-through styling. */}
      <ul>
        {sortedItems.map((item) => (
          <li key={item.id} className={item.bought ? 'bought' : ''}>
            {/* Wrapping the checkbox AND the name in a <label> makes the
                whole row text tappable, not just the small checkbox */}
            <label>
              <input
                type="checkbox"
                checked={item.bought}
                onChange={() => onToggleBought(item.id)}
              />
              {item.name}
            </label>

            {/* Delete button for this item */}
            <button
              className="delete"
              onClick={() => onDeleteItem(item.id)}
              aria-label={`Delete ${item.name}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
