// emojis.js — matches item names to emoji, and creates random "rain drops".
// Edit the EMOJI map freely: keys must be lowercase (like all item names).

// Item name -> emoji. Use the singular form; plurals are handled automatically
// ("apples" -> "apple", "tomatoes" -> "tomato"). Irregular plurals are listed separately.
const EMOJI = {
  // fruit
  apple: '🍎', pear: '🍐', banana: '🍌', orange: '🍊', lemon: '🍋',
  grape: '🍇', strawberry: '🍓', strawberries: '🍓', blueberry: '🫐',
  blueberries: '🫐', cherry: '🍒', cherries: '🍒', peach: '🍑', mango: '🥭',
  pineapple: '🍍', watermelon: '🍉', melon: '🍈', kiwi: '🥝', coconut: '🥥',
  // vegetables
  avocado: '🥑', tomato: '🍅', potato: '🥔', carrot: '🥕', corn: '🌽',
  pepper: '🫑', chili: '🌶️', cucumber: '🥒', broccoli: '🥦', lettuce: '🥬',
  salad: '🥗', garlic: '🧄', onion: '🧅', mushroom: '🍄', eggplant: '🍆',
  // bakery
  bread: '🍞', baguette: '🥖', croissant: '🥐', bagel: '🥯', pancake: '🥞',
  waffle: '🧇',
  // dairy & eggs
  milk: '🥛', cheese: '🧀', butter: '🧈', egg: '🥚',
  // meat & fish
  chicken: '🍗', meat: '🥩', steak: '🥩', bacon: '🥓', fish: '🐟', shrimp: '🦐',
  // pantry
  rice: '🍚', pasta: '🍝', noodles: '🍜', pizza: '🍕', honey: '🍯', salt: '🧂',
  peanut: '🥜', chocolate: '🍫', cookie: '🍪', cake: '🍰', candy: '🍬',
  'ice cream': '🍦',
  // drinks
  coffee: '☕', tea: '🍵', juice: '🧃', beer: '🍺', wine: '🍷', water: '💧',
  // household
  'toilet paper': '🧻', soap: '🧼', sponge: '🧽', toothbrush: '🪥',
};

// Finds an emoji for an item name, or returns null if there's none.
// Tries, in order:
//   1. the whole name             "toilet paper" -> 🧻
//   2. each word, last word first "oat milk"     -> 🥛 (the last word is usually the thing)
// and for each, also the singular ("apples" -> "apple", "tomatoes" -> "tomato").
export function findEmoji(name) {
  const candidates = [name, ...name.split(' ').reverse()];
  for (const word of candidates) {
    for (const form of [word, word.replace(/es$/, ''), word.replace(/s$/, '')]) {
      if (EMOJI[form]) return EMOJI[form];
    }
  }
  return null;
}

// Creates random settings for each falling emoji.
// Called from a click handler (not during rendering), because random values
// must not be generated while React renders.
export function makeDrops(count = 30) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100, // % from the left edge of the screen
    delay: Math.random() * 0.8, // seconds before this drop starts falling
    duration: 1.2 + Math.random(), // seconds to fall from top to bottom
    size: 20 + Math.random() * 24, // font size in px
  }));
}

// How long the rain stays on screen (ms): longest delay + longest fall + margin
export const RAIN_DURATION = 3200;
