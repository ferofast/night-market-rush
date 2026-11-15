// Night Market Rush — world.js
// One job: the game state and its rules. No drawing, no DOM.
// Every mutating function returns a list of event names for sound/feedback.

import { DISHES, NIGHTS, TOTAL_NIGHTS, START_REP, BASE_SLOTS, MAX_SLOTS, UPGRADES, TIP_BASE } from './config.js';
import { makeRng } from './random.js';

const SKINS = ['#f2c89b', '#e8b07e', '#c98d5f', '#8a5a3b', '#f7d7b0'];
const SHIRTS = ['#e2483d', '#3d7de2', '#57b25e', '#f2a541', '#9b59d0', '#2bb3a3'];
const HATS = ['cap', 'band', 'beanie', 'none'];

let nextCustomerId = 1;

export function customerSlots(state) {
  return BASE_SLOTS + (state.upgrades.counter || 0);
}

export function cookMsFor(state, dish) {
  return dish.cookMs * Math.pow(0.7, state.upgrades.stove || 0);
}

export function patienceDrainFor(state) {
  return Math.pow(0.7, state.upgrades.charm || 0);
}

export function createWorld(seed) {
  return {
    seed,
    rng: makeRng(seed),
    screen: 'title',
    night: 1,
    coins: 0,
    rep: START_REP,
    served: 0,
    quota: NIGHTS[0].quota,
    customers: [],
    stations: DISHES.map((d) => ({ dishId: d.id, state: 'idle', progressMs: 0, cookMs: d.cookMs })),
    upgrades: { stove: 0, counter: 0, charm: 0, wok: 0 },
    spawnTimerMs: 900,
    popups: [],
    stars: 0,
    repAtNightStart: START_REP,
    nightCoins: 0,
    nightServed: 0,
    totalServed: 0,
    totalCoins: 0,
    elapsedMs: 0,
    message: '',
  };
}

export function dishById(id) {
  return DISHES.find((d) => d.id === id);
}

function freeSlot(state) {
  const used = new Set(state.customers.map((c) => c.slot));
  for (let i = 0; i < customerSlots(state); i++) {
    if (!used.has(i)) return i;
  }
  return -1;
}

function spawnCustomer(state) {
  const slot = freeSlot(state);
  if (slot < 0) return false;
  const night = NIGHTS[state.night - 1];
  const dish = state.rng.pick(DISHES);
  state.customers.push({
    id: nextCustomerId++,
    slot,
    dishId: dish.id,
    patienceMs: night.patienceMs,
    patienceMax: night.patienceMs,
    skin: state.rng.pick(SKINS),
    shirt: state.rng.pick(SHIRTS),
    hat: state.rng.pick(HATS),
    bobPhase: state.rng.next() * Math.PI * 2,
    angry: false,
  });
  return true;
}

export function startRun(state) {
  state.screen = 'playing';
  state.night = 1;
  state.coins = 0;
  state.rep = START_REP;
  state.upgrades = { stove: 0, counter: 0, charm: 0, wok: 0 };
  state.totalServed = 0;
  state.totalCoins = 0;
  startNight(state, 1);
  return ['start'];
}

export function startNight(state, n) {
  const night = NIGHTS[n - 1];
  state.night = n;
  state.screen = 'playing';
  state.served = 0;
  state.quota = night.quota;
  state.customers = [];
  state.stations = DISHES.map((d) => ({ dishId: d.id, state: 'idle', progressMs: 0, cookMs: d.cookMs }));
  state.spawnTimerMs = 700;
  state.repAtNightStart = state.rep;
  state.nightCoins = 0;
  state.nightServed = 0;
  state.popups = [];
  state.message = night.rush;
}

export function startCooking(state, dishIndex) {
  const station = state.stations[dishIndex];
  if (!station || station.state !== 'idle') return [];
  const dish = dishById(station.dishId);
  station.state = 'cooking';
  station.progressMs = 0;
  station.cookMs = cookMsFor(state, dish);
  return ['sizzle'];
}

export function serveReady(state, dishIndex) {
  const station = state.stations[dishIndex];
  if (!station || station.state !== 'ready') return [];
  const dish = dishById(station.dishId);
  const idx = state.customers.findIndex((c) => c.dishId === dish.id);
  if (idx < 0) {
    state.message = 'No one ordered ' + dish.name + ' right now.';
    return ['nobody'];
  }
  const customer = state.customers[idx];
  const frac = customer.patienceMs / customer.patienceMax;
  let earned = dish.price;
  let tipped = false;
  if (frac > 0.5) {
    const tip = Math.round(TIP_BASE * (state.upgrades.wok ? 1.5 : 1));
    earned += tip;
    tipped = true;
  }
  state.customers.splice(idx, 1);
  station.state = 'idle';
  station.progressMs = 0;
  state.coins += earned;
  state.nightCoins += earned;
  state.totalCoins += earned;
  state.served += 1;
  state.nightServed += 1;
  state.totalServed += 1;
  state.popups.push({ x: 480, y: 300, text: '+' + earned + ' coins' + (tipped ? ' (tip!)' : ''), lifeMs: 1200, maxMs: 1200, color: '#ffc93c' });
  return ['coin', 'serve'];
}

export function buyUpgrade(state, id) {
  const def = UPGRADES.find((u) => u.id === id);
  if (!def) return [];
  const level = state.upgrades[id] || 0;
  if (level >= def.max) return [];
  const cost = def.costs[level];
  if (state.coins < cost) {
    state.message = 'Not enough coins for ' + def.name + '.';
    return ['nobody'];
  }
  state.coins -= cost;
  state.upgrades[id] = level + 1;
  return ['coin', 'buy'];
}

export function nextNight(state) {
  if (state.night >= TOTAL_NIGHTS) {
    state.screen = 'win';
    return ['fanfare'];
  }
  startNight(state, state.night + 1);
  return ['start'];
}

export function update(state, dtMs) {
  const events = [];
  if (state.screen !== 'playing') return events;
  state.elapsedMs += dtMs;
  const night = NIGHTS[state.night - 1];

  for (const popup of state.popups) popup.lifeMs -= dtMs;
  state.popups = state.popups.filter((p) => p.lifeMs > 0);

  // Spawn customers while the night still needs more served.
  state.spawnTimerMs -= dtMs;
  if (state.spawnTimerMs <= 0) {
    const need = state.quota - state.served - state.customers.length;
    if (need > 0 && spawnCustomer(state)) events.push('arrive');
    state.spawnTimerMs = night.spawnMs * (0.85 + state.rng.next() * 0.3);
  }

  // Cooking progress.
  for (const station of state.stations) {
    if (station.state === 'cooking') {
      station.progressMs += dtMs;
      if (station.progressMs >= station.cookMs) {
        station.state = 'ready';
        events.push('ding');
      }
    }
  }

  // Patience drains; an empty meter loses a heart.
  const drain = patienceDrainFor(state);
  for (let i = state.customers.length - 1; i >= 0; i--) {
    const c = state.customers[i];
    c.patienceMs -= dtMs * drain;
    if (c.patienceMs <= c.patienceMax * 0.25) c.angry = true;
    if (c.patienceMs <= 0) {
      state.customers.splice(i, 1);
      state.rep -= 1;
      state.popups.push({ x: 480, y: 250, text: 'Walked away! -1 heart', lifeMs: 1400, maxMs: 1400, color: '#ff7a6b' });
      events.push('angry');
    }
  }

  if (state.rep <= 0) {
    state.rep = 0;
    state.screen = 'lose';
    events.push('lose');
    return events;
  }

  if (state.served >= state.quota) {
    const lost = state.repAtNightStart - state.rep;
    state.stars = lost <= 0 ? 3 : lost === 1 ? 2 : 1;
    state.screen = 'upgrade';
    events.push('fanfare');
  }
  return events;
}
