// stickers.js — item name -> custom sticker image.
// Images are imported (not linked by path) so Vite adds the /grocery-app/ base path.
// Keys must be lowercase, like all item names.

import toiletPaper from './assets/stickers/toilet-paper.webp';
import wine from './assets/stickers/wine.webp';
import chocolate from './assets/stickers/chocolate.webp';
import chips from './assets/stickers/chips.webp';

const STICKERS = {
  'toilet paper': toiletPaper,
  wine: wine,
  chocolate: chocolate,
  chips: chips
  // add more here, e.g. 'coffee': coffeeSticker,
};

// Returns the sticker image for a (normalized) item name, or null
export const findSticker = (name) => STICKERS[name] ?? null;