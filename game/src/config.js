// Night Market Rush — config.js
// One job: every tunable number of the game in one place.
// Canvas is 960x540. All times are milliseconds.

export const VIEW = { width: 960, height: 540 };

export const PALETTE = {
  skyTop: '#1b1140',
  skyMid: '#3b1d5e',
  skyBottom: '#57294f',
  awningRed: '#d9392b',
  awningCream: '#ffe9c4',
  woodDark: '#7a4a21',
  wood: '#a06a33',
  woodLight: '#c98f4e',
  counterTop: '#e8b06a',
  gold: '#ffc93c',
  goldDark: '#e09e00',
  cream: '#fff6e3',
  ink: '#2b1a12',
  leaf: '#57b25e',
  chili: '#e2483d',
};

export const DISHES = [
  { id: 'satay', name: 'Satay', price: 8, cookMs: 3000, color: '#b5762e', blurb: 'Skewers on the grill' },
  { id: 'noodles', name: 'Noodles', price: 10, cookMs: 4000, color: '#e8a13c', blurb: 'Wok-tossed, extra chili' },
  { id: 'dumpling', name: 'Dumpling', price: 12, cookMs: 5000, color: '#f2ead8', blurb: 'Steamed, six pleats' },
  { id: 'tea', name: 'Iced Tea', price: 6, cookMs: 2000, color: '#c98a3a', blurb: 'Sweet, poured high' },
];

export const NIGHTS = [
  { quota: 6, spawnMs: 4200, patienceMs: 30000, rush: 'A calm first night.' },
  { quota: 8, spawnMs: 3800, patienceMs: 28000, rush: 'Word is spreading…' },
  { quota: 10, spawnMs: 3400, patienceMs: 26000, rush: 'The crowd is hungry!' },
  { quota: 12, spawnMs: 3000, patienceMs: 24000, rush: 'Friday-night rush!' },
  { quota: 14, spawnMs: 2600, patienceMs: 22000, rush: 'Festival night — hold on!' },
];

export const TOTAL_NIGHTS = NIGHTS.length;
export const START_REP = 5; // hearts; lose the run at 0
export const BASE_SLOTS = 3;
export const MAX_SLOTS = 4;

export const UPGRADES = [
  { id: 'stove', name: 'Turbo Stove', desc: 'Cook 30% faster', costs: [40, 70], max: 2, icon: 'flame' },
  { id: 'counter', name: 'Extra Counter', desc: '+1 customer slot', costs: [50], max: 1, icon: 'plus' },
  { id: 'charm', name: 'Calm Charm', desc: 'Patience drains 30% slower', costs: [45, 80], max: 2, icon: 'heart' },
  { id: 'wok', name: 'Golden Wok', desc: 'Tips worth 50% more', costs: [60], max: 1, icon: 'coin' },
];

export const TIP_BASE = 2; // coins for serving with over half patience left
export const SHOT_SEED = 7;
