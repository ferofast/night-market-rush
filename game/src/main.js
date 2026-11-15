// Night Market Rush — main.js
// One job: boot the game, run the loop, and wire events to sound.
// Shot mode (?shot=...) renders one frozen frame at a fixed time and
// raises window.__shotReady for headless screenshots.

import { VIEW } from './config.js';
import { createWorld, update } from './world.js';
import { drawScene } from './render.js';
import { attachInput } from './input.js';
import { shotParams, stageShot } from './shots.js';
import { audio } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = VIEW.width;
canvas.height = VIEW.height;

window.__shotReady = false;
window.addEventListener('error', (e) => {
  document.title = 'ERROR: ' + (e.message || 'unknown');
});

const { shot, seed } = shotParams();
const state = shot ? stageShot(shot, seed) : createWorld((Date.now() % 2147483647) | 0);
const mouse = { x: -1, y: -1 };

function playEvents(events) {
  for (const ev of events) {
    if (ev === 'sizzle') audio.sizzle();
    else if (ev === 'ding') audio.ding();
    else if (ev === 'coin') audio.coin();
    else if (ev === 'angry') audio.angry();
    else if (ev === 'fanfare') audio.fanfare();
    else if (ev === 'lose') audio.lose();
    else if (ev === 'click') audio.click();
  }
}

attachInput(canvas, state, playEvents, () => mouse);

if (shot) {
  // Frozen scene: one deterministic frame, then signal readiness.
  drawScene(ctx, state, 1200, mouse);
  requestAnimationFrame(() => {
    drawScene(ctx, state, 1200, mouse);
    window.__shotReady = true;
  });
} else {
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(100, now - last);
    last = now;
    const events = update(state, dt);
    playEvents(events);
    drawScene(ctx, state, now, mouse);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
