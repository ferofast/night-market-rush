// Night Market Rush — shots.js
// One job: deterministic staged scenes for screenshots (?shot=<scene>&seed=<n>).
// A staged scene is frozen: the main loop renders it once at a fixed time
// and sets window.__shotReady, so headless renders are identical every run.

import { SHOT_SEED } from './config.js';
import { createWorld, startRun, cookMsFor, dishById } from './world.js';

export function shotParams() {
  const q = new URLSearchParams(window.location.search);
  return { shot: q.get('shot') || '', seed: Number(q.get('seed') || SHOT_SEED) };
}

function stagedCustomer(slot, dishId, frac, skin, shirt, hat) {
  const dish = dishById(dishId);
  void dish;
  const max = 26000;
  return {
    id: 100 + slot,
    slot,
    dishId,
    patienceMs: Math.round(max * frac),
    patienceMax: max,
    skin,
    shirt,
    hat,
    bobPhase: slot * 1.3,
    angry: frac <= 0.25,
  };
}

export function stageShot(name, seed) {
  const state = createWorld(seed);
  if (name === 'play') {
    startRun(state);
    state.night = 2;
    state.quota = 8;
    state.served = 5;
    state.coins = 128;
    state.rep = 4;
    state.totalServed = 11;
    state.totalCoins = 128;
    state.customers = [
      stagedCustomer(0, 'satay', 0.82, '#f2c89b', '#e2483d', 'cap'),
      stagedCustomer(1, 'noodles', 0.46, '#e8b07e', '#3d7de2', 'band'),
      stagedCustomer(2, 'tea', 0.18, '#c98d5f', '#57b25e', 'beanie'),
    ];
    const satay = dishById('satay');
    const noodles = dishById('noodles');
    const tea = dishById('tea');
    state.stations[0] = { dishId: 'satay', state: 'cooking', progressMs: Math.round(cookMsFor(state, satay) * 0.6), cookMs: cookMsFor(state, satay) };
    state.stations[1] = { dishId: 'noodles', state: 'ready', progressMs: cookMsFor(state, noodles), cookMs: cookMsFor(state, noodles) };
    state.stations[2] = { dishId: 'dumpling', state: 'idle', progressMs: 0, cookMs: cookMsFor(state, dishById('dumpling')) };
    state.stations[3] = { dishId: 'tea', state: 'cooking', progressMs: Math.round(cookMsFor(state, tea) * 0.25), cookMs: cookMsFor(state, tea) };
    state.popups = [{ x: 480, y: 300, text: '+10 coins (tip!)', lifeMs: 900, maxMs: 1200, color: '#ffc93c' }];
    state.message = '';
    state.screen = 'playing';
  } else if (name === 'upgrade') {
    startRun(state);
    state.screen = 'upgrade';
    state.night = 2;
    state.stars = 3;
    state.nightServed = 8;
    state.nightCoins = 96;
    state.coins = 132;
    state.rep = 5;
    state.upgrades = { stove: 1, counter: 0, charm: 0, wok: 0 };
    state.totalServed = 14;
    state.totalCoins = 132;
  } else if (name === 'win') {
    startRun(state);
    state.screen = 'win';
    state.night = 5;
    state.coins = 486;
    state.rep = 4;
    state.totalServed = 50;
    state.totalCoins = 486;
  } else if (name === 'lose') {
    startRun(state);
    state.screen = 'lose';
    state.night = 3;
    state.coins = 210;
    state.rep = 0;
    state.totalServed = 24;
    state.totalCoins = 210;
  } else {
    state.screen = 'title';
  }
  return state;
}
