// Night Market Rush — audio.js
// One job: tiny WebAudio bleeps (no audio files, nothing fetched).
// Everything is guarded: headless browsers and muted tabs never throw.

let ctx = null;
let muted = false;

function ensureCtx() {
  if (ctx) return ctx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  } catch (e) {
    ctx = null;
  }
  return ctx;
}

function tone(freq, durMs, type, vol, whenMs) {
  const ac = ensureCtx();
  if (!ac || muted) return;
  try {
    const t0 = ac.currentTime + (whenMs || 0) / 1000;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + durMs / 1000 + 0.05);
  } catch (e) {
    /* sound is garnish, never fatal */
  }
}

export const audio = {
  unlock() {
    const ac = ensureCtx();
    if (ac && ac.state === 'suspended') ac.resume().catch(() => {});
  },
  toggleMute() {
    muted = !muted;
    return muted;
  },
  isMuted() {
    return muted;
  },
  click() {
    tone(660, 70, 'triangle', 0.08);
  },
  sizzle() {
    tone(220, 180, 'sawtooth', 0.05);
    tone(330, 140, 'sawtooth', 0.04, 60);
  },
  ding() {
    tone(880, 160, 'sine', 0.12);
    tone(1318, 220, 'sine', 0.09, 90);
  },
  coin() {
    tone(988, 90, 'square', 0.06);
    tone(1319, 160, 'square', 0.06, 80);
  },
  angry() {
    tone(180, 260, 'sawtooth', 0.09);
    tone(140, 300, 'sawtooth', 0.08, 120);
  },
  fanfare() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 220, 'triangle', 0.11, i * 130));
  },
  lose() {
    [392, 330, 262, 196].forEach((f, i) => tone(f, 260, 'triangle', 0.1, i * 150));
  },
};
