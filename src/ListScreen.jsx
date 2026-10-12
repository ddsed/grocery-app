// ListScreen.jsx — one list's items, live from Firestore.
// Add items (with autocomplete), tick them as bought, delete them.

import { useRef, useState } from 'react';
import { useEntries, useCatalog, addItem, toggleBought, deleteItem } from './data';
import EmojiRain from './EmojiRain';
import { findEmoji, makeDrops, RAIN_DURATION } from './emojis';
import Sticker from './Sticker';
import { findSticker } from './stickers';
import { normalize } from './data';

export default function ListScreen({ list, onBack }) {
  // Live data: this list's entries, and every item name ever used
  const entries = useEntries(list.id);
  const catalog = useCatalog();

  // What's typed in the "add item" box (controlled input)
  const [name, setName] = useState('');

  // The current emoji rain: { id, emoji, drops }, or null when it's not raining
  const [rain, setRain] = useState(null);

  // Remembers the "stop raining" timer, so a new rain can cancel the old one
  const rainTimer = useRef(null);

  // The current sticker: { id, src }, or null when none is showing
  const [sticker, setSticker] = useState(null);
  const stickerTimer = useRef(null);

  // Show a sticker for 2 seconds; a new one replaces the old one
  function showSticker(src) {
    setSticker({ id: Date.now(), src });
    clearTimeout(stickerTimer.current);
    stickerTimer.current = setTimeout(() => setSticker(null), 2000);
  }

  // Tick / untick, and start a rain when an item is ticked as bought
  function handleToggle(entry) {
    toggleBought(list.id, entry);

    // Only celebrate when ticking ON, not when unticking
    if (entry.bought) return;

    const emoji = findEmoji(entry.name);
    if (!emoji) return; // no matching emoji -> no rain

    // New id restarts the animation even if it's already raining
    setRain({ id: Date.now(), emoji, drops: makeDrops() });

    // Stop the rain after it has finished falling
    clearTimeout(rainTimer.current);
    rainTimer.current = setTimeout(() => setRain(null), RAIN_DURATION);
  }

  function handleSubmit(e) {
    e.preventDefault(); // stop the page from reloading
    if (!name.trim()) return; // ignore empty input

    // Custom sticker for this item? "Toilet  Paper" -> "toilet paper" -> sticker
    const stickerSrc = findSticker(normalize(name));
    if (stickerSrc) showSticker(stickerSrc);

    addItem(list.id, name); // data.js normalizes and handles duplicates
    setName(''); // clear right away; no need to wait for the server
  }

  // Order: unbought first, bought at the bottom; within each group, oldest first.
  // [...entries] copies the array, because sort() changes the array it's given.
  // true - false = 1, so subtracting booleans pushes bought items down.
  const sorted = [...entries].sort(
    (a, b) => a.bought - b.bought || a.addedAt - b.addedAt
  );

  return (
    <main>
      {/* Back to the overview */}
      <button className="back" onClick={onBack}>
        ← Lists
      </button>

      <h1>{list.name}</h1>

      {/* Form to add an item.
          list="item-suggestions" links the input to the <datalist> below,
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

      {/* Wrapper so the sticker can be positioned over the top of the list */}
      <div className="list-area">
        {/* Sticker; key restarts the animation for each new sticker */}
        {sticker && <Sticker key={sticker.id} src={sticker.src} />}

        {/* Empty state */}
        {entries.length === 0 && <p className="empty">This list is empty. Add an item above.</p>}

        {/* One row per item; "bought" class adds the strike-through */}
        <ul>
          {sorted.map((entry) => (
            <li key={entry.id} className={entry.bought ? 'bought' : ''}>
              {/* The label makes the whole name tappable, not just the checkbox */}
              <label>
                <input
                  type="checkbox"
                  checked={entry.bought}
                  onChange={() => handleToggle(entry)}
                />
                {entry.name}
              </label>

              {/* Remove this item from the list (it stays in autocomplete) */}
              <button
                className="delete"
                onClick={() => deleteItem(list.id, entry.id)}
                aria-label={`Delete ${entry.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Emoji rain overlay; key makes React restart it for each new rain */}
      {rain && <EmojiRain key={rain.id} emoji={rain.emoji} drops={rain.drops} />}
    </main>
  );
}