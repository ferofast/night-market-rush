// Night Market Rush — input.js
// One job: turn mouse, touch and keyboard input into game actions.
// Hit-testing reuses render.js's buttonsFor() and stationRect() so the
// clickable areas are exactly the drawn ones.

import { buttonsFor, stationRect } from './render.js';
import { startRun, startCooking, serveReady, buyUpgrade, nextNight } from './world.js';
import { audio } from './audio.js';

function canvasPos(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}

function handleAction(state, id) {
  audio.unlock();
  if (id === 'start') return startRun(state);
  if (id === 'again') return startRun(state);
  if (id === 'next') return nextNight(state);
  if (id.startsWith('buy:')) return buyUpgrade(state, id.slice(4));
  return [];
}

export function attachInput(canvas, state, onEvents, getMouse) {
  function clickAt(pos) {
    let events = [];
    const btns = buttonsFor(state);
    for (const b of btns) {
      if (!b.disabled && pos.x >= b.x && pos.x <= b.x + b.w && pos.y >= b.y && pos.y <= b.y + b.h) {
        events = handleAction(state, b.id);
        audio.click();
        onEvents(events);
        return;
      }
    }
    if (state.screen === 'playing') {
      for (let i = 0; i < 4; i++) {
        const r = stationRect(i);
        if (pos.x >= r.x && pos.x <= r.x + r.w && pos.y >= r.y && pos.y <= r.y + r.h) {
          const station = state.stations[i];
          events = station.state === 'ready' ? serveReady(state, i) : startCooking(state, i);
          onEvents(events);
          return;
        }
      }
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    clickAt(canvasPos(canvas, e.clientX, e.clientY));
  });
  canvas.addEventListener('pointermove', (e) => {
    const mouse = getMouse();
    const p = canvasPos(canvas, e.clientX, e.clientY);
    mouse.x = p.x;
    mouse.y = p.y;
  });

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const key = e.key.toLowerCase();
    if (key === 'm') {
      const muted = audio.toggleMute();
      state.message = muted ? 'Sound off.' : 'Sound on.';
      return;
    }
    if (key === 'enter' || key === ' ') {
      e.preventDefault();
      let events = [];
      if (state.screen === 'title' || state.screen === 'win' || state.screen === 'lose') {
        events = startRun(state);
      } else if (state.screen === 'upgrade') {
        events = nextNight(state);
      }
      audio.click();
      onEvents(events);
      return;
    }
    if (state.screen === 'playing' && ['1', '2', '3', '4'].includes(key)) {
      const i = Number(key) - 1;
      const station = state.stations[i];
      const events = station.state === 'ready' ? serveReady(state, i) : startCooking(state, i);
      onEvents(events);
    }
  });
}
