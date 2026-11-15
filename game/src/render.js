// Night Market Rush — render.js
// One job: everything the player sees, drawn on one canvas.
// Layout is fixed at 960x540; buttonsFor() is the single source of
// truth for clickable rects (input.js hit-tests against it).

import { VIEW, PALETTE, DISHES, NIGHTS, TOTAL_NIGHTS, UPGRADES } from './config.js';
import { dishById, customerSlots } from './world.js';

export function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function star(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(ang) * rad;
    const py = y + Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function heart(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.9);
  ctx.bezierCurveTo(x - s * 1.2, y, x - s * 0.6, y - s, x, y - s * 0.25);
  ctx.bezierCurveTo(x + s * 0.6, y - s, x + s * 1.2, y, x, y + s * 0.9);
  ctx.fill();
}

function coin(ctx, x, y, r) {
  ctx.fillStyle = PALETTE.goldDark;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.gold;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.82, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#a86f00';
  ctx.font = `bold ${Math.round(r * 1.1)}px Trebuchet MS, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('C', x, y + 1);
}

export function slotX(i, count) {
  const span = 560;
  const cx = VIEW.width / 2;
  if (count === 1) return cx;
  return cx - span / 2 + (i * span) / (count - 1);
}

export function stationRect(i) {
  const w = 212;
  const gap = 16;
  const total = 4 * w + 3 * gap;
  const x0 = (VIEW.width - total) / 2;
  return { x: x0 + i * (w + gap), y: 356, w, h: 142 };
}

export function drawDishIcon(ctx, dishId, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  if (dishId === 'satay') {
    ctx.strokeStyle = '#d9b380';
    ctx.lineWidth = s * 0.07;
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, s * 0.42);
    ctx.lineTo(s * 0.5, -s * 0.42);
    ctx.stroke();
    const cubes = [[-0.26, 0.2], [0, -0.02], [0.26, -0.24]];
    for (const [cx, cy] of cubes) {
      ctx.fillStyle = '#a5641f';
      rr(ctx, (cx - 0.17) * s, (cy - 0.15) * s, s * 0.34, s * 0.3, s * 0.06);
      ctx.fill();
      ctx.fillStyle = '#c98a3a';
      rr(ctx, (cx - 0.17) * s, (cy - 0.15) * s, s * 0.34, s * 0.12, s * 0.05);
      ctx.fill();
    }
  } else if (dishId === 'noodles') {
    ctx.fillStyle = '#d9392b';
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, -s * 0.05);
    ctx.quadraticCurveTo(0, s * 0.62, s * 0.5, -s * 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f7d774';
    ctx.lineWidth = s * 0.08;
    ctx.lineCap = 'round';
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * s * 0.26 - s * 0.12, -s * 0.08);
      ctx.quadraticCurveTo(i * s * 0.26, -s * 0.28, i * s * 0.26 + s * 0.12, -s * 0.08);
      ctx.stroke();
    }
    ctx.strokeStyle = '#8a5a3b';
    ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    ctx.moveTo(s * 0.18, -s * 0.5);
    ctx.lineTo(s * 0.42, -s * 0.05);
    ctx.moveTo(s * 0.3, -s * 0.5);
    ctx.lineTo(s * 0.52, -s * 0.02);
    ctx.stroke();
  } else if (dishId === 'dumpling') {
    ctx.fillStyle = '#f7f1de';
    ctx.beginPath();
    ctx.moveTo(-s * 0.48, s * 0.18);
    ctx.quadraticCurveTo(0, -s * 0.62, s * 0.48, s * 0.18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d9c9a3';
    ctx.lineWidth = s * 0.05;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * s * 0.2, -s * 0.28);
      ctx.quadraticCurveTo(i * s * 0.2 + s * 0.08, -s * 0.05, i * s * 0.2, s * 0.12);
      ctx.stroke();
    }
  } else if (dishId === 'tea') {
    ctx.fillStyle = '#e8a13c';
    ctx.beginPath();
    ctx.moveTo(-s * 0.32, -s * 0.3);
    ctx.lineTo(s * 0.32, -s * 0.3);
    ctx.lineTo(s * 0.24, s * 0.42);
    ctx.lineTo(-s * 0.24, s * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#a86f00';
    ctx.lineWidth = s * 0.06;
    ctx.beginPath();
    ctx.arc(s * 0.36, s * 0.05, s * 0.16, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    ctx.moveTo(-s * 0.1, -s * 0.34);
    ctx.quadraticCurveTo(-s * 0.2, -s * 0.5, -s * 0.08, -s * 0.62);
    ctx.stroke();
    ctx.strokeStyle = '#e2483d';
    ctx.lineWidth = s * 0.06;
    ctx.beginPath();
    ctx.moveTo(s * 0.05, -s * 0.62);
    ctx.lineTo(s * 0.18, -s * 0.28);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBackground(ctx, timeMs) {
  const g = ctx.createLinearGradient(0, 0, 0, VIEW.height);
  g.addColorStop(0, PALETTE.skyTop);
  g.addColorStop(0.55, PALETTE.skyMid);
  g.addColorStop(1, PALETTE.skyBottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  // Stars (fixed pseudo-random dots).
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 46; i++) {
    const sx = (i * 197.3) % VIEW.width;
    const sy = (i * 89.7) % 150;
    const tw = 0.5 + 0.5 * Math.sin(timeMs / 700 + i);
    ctx.globalAlpha = 0.35 + 0.5 * tw;
    ctx.fillRect(sx, sy, 2, 2);
  }
  ctx.globalAlpha = 1;
  // Moon.
  ctx.fillStyle = '#ffeec2';
  ctx.beginPath();
  ctx.arc(842, 62, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f2d894';
  ctx.beginPath();
  ctx.arc(832, 56, 7, 0, Math.PI * 2);
  ctx.arc(852, 70, 5, 0, Math.PI * 2);
  ctx.fill();
  // Distant stall silhouettes.
  ctx.fillStyle = '#241338';
  ctx.fillRect(0, 118, 150, 60);
  ctx.fillRect(810, 128, 150, 50);
  ctx.beginPath();
  ctx.moveTo(0, 118);
  ctx.lineTo(75, 92);
  ctx.lineTo(150, 118);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(810, 128);
  ctx.lineTo(885, 104);
  ctx.lineTo(960, 128);
  ctx.closePath();
  ctx.fill();
  // String lights.
  for (let row = 0; row < 2; row++) {
    const y0 = 96 + row * 26;
    ctx.strokeStyle = 'rgba(40,20,40,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y0 - 26);
    ctx.quadraticCurveTo(VIEW.width / 2, y0 + 26, VIEW.width, y0 - 26);
    ctx.stroke();
    const colors = ['#ffc93c', '#ff7a6b', '#7ae0a3', '#ffd166'];
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      const bx = t * VIEW.width;
      const by = (1 - t) * (1 - t) * (y0 - 26) + 2 * (1 - t) * t * (y0 + 26) + t * t * (y0 - 26);
      ctx.fillStyle = colors[(i + row) % colors.length];
      ctx.beginPath();
      ctx.arc(bx, by + 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,220,120,0.25)';
      ctx.beginPath();
      ctx.arc(bx, by + 6, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawAwning(ctx) {
  const y = 54;
  const h = 40;
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = i % 2 === 0 ? PALETTE.awningRed : PALETTE.awningCream;
    ctx.fillRect(i * 80, y, 80, h);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, y + h - 6, VIEW.width, 6);
  // Hanging lanterns.
  for (const lx of [90, 480, 870]) {
    ctx.strokeStyle = '#2b1a12';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx, y + h);
    ctx.lineTo(lx, y + h + 12);
    ctx.stroke();
    ctx.fillStyle = '#e2483d';
    ctx.beginPath();
    ctx.ellipse(lx, y + h + 26, 15, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffc93c';
    ctx.beginPath();
    ctx.ellipse(lx, y + h + 26, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCounter(ctx) {
  ctx.fillStyle = PALETTE.woodDark;
  ctx.fillRect(0, 300, VIEW.width, 56);
  ctx.fillStyle = PALETTE.wood;
  for (let i = 0; i < 8; i++) {
    ctx.fillRect(i * 120 + 3, 306, 114, 44);
  }
  ctx.fillStyle = PALETTE.counterTop;
  ctx.fillRect(0, 300, VIEW.width, 10);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(0, 300, VIEW.width, 3);
}

function drawCustomer(ctx, c, x, timeMs) {
  const bob = Math.sin(timeMs / 380 + c.bobPhase) * 2.5;
  const feetY = 302 + bob * 0.3;
  const bodyY = feetY - 58;
  // Body.
  ctx.fillStyle = c.shirt;
  rr(ctx, x - 26, bodyY, 52, 58, 14);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  rr(ctx, x - 26, bodyY, 52, 12, 10);
  ctx.fill();
  // Head.
  ctx.fillStyle = c.skin;
  ctx.beginPath();
  ctx.arc(x, bodyY - 18, 22, 0, Math.PI * 2);
  ctx.fill();
  // Hat.
  if (c.hat === 'cap') {
    ctx.fillStyle = '#d9392b';
    ctx.beginPath();
    ctx.arc(x, bodyY - 22, 22, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(x - 22, bodyY - 24, 46, 6);
  } else if (c.hat === 'band') {
    ctx.fillStyle = '#ffc93c';
    ctx.fillRect(x - 21, bodyY - 36, 42, 8);
  } else if (c.hat === 'beanie') {
    ctx.fillStyle = '#3d7de2';
    ctx.beginPath();
    ctx.arc(x, bodyY - 24, 21, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, bodyY - 44, 6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#2b1a12';
    ctx.beginPath();
    ctx.arc(x, bodyY - 26, 20, Math.PI * 1.05, Math.PI * 1.95);
    ctx.fill();
  }
  // Face.
  ctx.fillStyle = '#2b1a12';
  const eyeY = bodyY - 18 + bob * 0.2;
  if (c.angry) {
    ctx.strokeStyle = '#2b1a12';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 12, eyeY - 6);
    ctx.lineTo(x - 4, eyeY - 2);
    ctx.moveTo(x + 12, eyeY - 6);
    ctx.lineTo(x + 4, eyeY - 2);
    ctx.stroke();
    ctx.strokeStyle = '#7a1f16';
    ctx.beginPath();
    ctx.moveTo(x - 14, eyeY - 16);
    ctx.quadraticCurveTo(x - 18, eyeY - 26, x - 12, eyeY - 30);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(x - 8, eyeY, 2.6, 0, Math.PI * 2);
    ctx.arc(x + 8, eyeY, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2b1a12';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, eyeY + 4, 7, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  // Order bubble.
  const bx = x - 42;
  const by = 118;
  ctx.fillStyle = '#fffdf6';
  rr(ctx, bx, by, 84, 52, 12);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 8, by + 52);
  ctx.lineTo(x + 8, by + 52);
  ctx.lineTo(x, by + 64);
  ctx.closePath();
  ctx.fill();
  drawDishIcon(ctx, c.dishId, x, by + 24, 40);
  // Patience bar.
  const frac = Math.max(0, c.patienceMs / c.patienceMax);
  const barW = 72;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  rr(ctx, x - barW / 2, by + 52 - 8, barW, 7, 3);
  ctx.fill();
  ctx.fillStyle = frac > 0.5 ? '#57b25e' : frac > 0.25 ? '#f2a541' : '#e2483d';
  if (frac > 0.02) {
    rr(ctx, x - barW / 2, by + 52 - 8, barW * frac, 7, 3);
    ctx.fill();
  }
}

function drawStation(ctx, state, i, timeMs, mouse) {
  const station = state.stations[i];
  const dish = dishById(station.dishId);
  const r = stationRect(i);
  const hover = mouse && mouse.x >= r.x && mouse.x <= r.x + r.w && mouse.y >= r.y && mouse.y <= r.y + r.h;
  ctx.fillStyle = hover ? '#3d2b63' : '#2c1d4e';
  rr(ctx, r.x, r.y, r.w, r.h, 14);
  ctx.fill();
  ctx.strokeStyle = station.state === 'ready' ? PALETTE.gold : 'rgba(255,255,255,0.16)';
  ctx.lineWidth = station.state === 'ready' ? 3 : 1.5;
  rr(ctx, r.x + 1, r.y + 1, r.w - 2, r.h - 2, 13);
  ctx.stroke();
  // Stove ring.
  const cx = r.x + 52;
  const cy = r.y + 58;
  ctx.fillStyle = '#1b1140';
  ctx.beginPath();
  ctx.arc(cx, cy, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5a3d8a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 36, 0, Math.PI * 2);
  ctx.stroke();
  if (station.state === 'cooking') {
    const frac = Math.min(1, station.progressMs / station.cookMs);
    ctx.strokeStyle = '#ff9a3c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 30, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
    ctx.stroke();
    drawDishIcon(ctx, dish.id, cx, cy, 40);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff6e3';
    ctx.font = 'bold 15px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.ceil((station.cookMs - station.progressMs) / 1000) + 's', cx, cy);
  } else if (station.state === 'ready') {
    const pulse = 1 + 0.08 * Math.sin(timeMs / 160);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(pulse, pulse);
    drawDishIcon(ctx, dish.id, 0, 0, 46);
    ctx.restore();
  } else {
    ctx.globalAlpha = 0.55;
    drawDishIcon(ctx, dish.id, cx, cy, 40);
    ctx.globalAlpha = 1;
  }
  // Label + price + key.
  ctx.fillStyle = '#fff6e3';
  ctx.font = 'bold 17px Trebuchet MS, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(dish.name, r.x + 100, r.y + 44);
  ctx.fillStyle = PALETTE.gold;
  ctx.font = 'bold 15px Trebuchet MS, sans-serif';
  ctx.fillText(dish.price + ' coins', r.x + 100, r.y + 68);
  ctx.fillStyle = 'rgba(255,246,227,0.65)';
  ctx.font = '13px Trebuchet MS, sans-serif';
  ctx.fillText('key ' + (i + 1) + ' · ' + Math.round(dish.cookMs / 1000) + 's cook', r.x + 100, r.y + 90);
  ctx.fillStyle = station.state === 'idle' ? '#9fe8a8' : station.state === 'ready' ? PALETTE.gold : 'rgba(255,246,227,0.55)';
  ctx.font = 'bold 13px Trebuchet MS, sans-serif';
  ctx.fillText(station.state === 'idle' ? 'Click to cook' : station.state === 'cooking' ? 'Cooking…' : 'Serve it!', r.x + 100, r.y + 114);
}

function drawHud(ctx, state) {
  ctx.fillStyle = 'rgba(16,8,36,0.92)';
  ctx.fillRect(0, 0, VIEW.width, 54);
  ctx.fillStyle = '#fff6e3';
  ctx.font = 'bold 20px Trebuchet MS, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Night ' + state.night + ' / ' + TOTAL_NIGHTS, 16, 28);
  coin(ctx, 178, 28, 11);
  ctx.fillStyle = PALETTE.gold;
  ctx.font = 'bold 20px Trebuchet MS, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(String(state.coins), 196, 28);
  for (let i = 0; i < 5; i++) {
    heart(ctx, 268 + i * 26, 28, 9, i < state.rep ? '#ff5d73' : 'rgba(255,255,255,0.18)');
  }
  // Quota progress.
  const qx = 420;
  const qw = 300;
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  rr(ctx, qx, 18, qw, 18, 9);
  ctx.fill();
  const qfrac = Math.min(1, state.served / state.quota);
  ctx.fillStyle = '#57b25e';
  if (qfrac > 0) {
    rr(ctx, qx, 18, qw * qfrac, 18, 9);
    ctx.fill();
  }
  ctx.fillStyle = '#fff6e3';
  ctx.font = 'bold 14px Trebuchet MS, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Served ' + state.served + ' / ' + state.quota, qx + qw / 2, 27);
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,246,227,0.75)';
  ctx.font = '13px Trebuchet MS, sans-serif';
  ctx.fillText('M: sound', VIEW.width - 16, 28);
  ctx.textAlign = 'left';
}

function drawPopups(ctx, state) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const p of state.popups) {
    const frac = p.lifeMs / p.maxMs;
    ctx.globalAlpha = Math.min(1, frac * 1.6);
    ctx.fillStyle = p.color;
    ctx.font = 'bold 22px Trebuchet MS, sans-serif';
    ctx.fillText(p.text, p.x, p.y - (1 - frac) * 34);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
}

function drawButton(ctx, b, hover) {
  ctx.fillStyle = b.disabled ? 'rgba(120,110,140,0.6)' : hover ? '#ffd95e' : PALETTE.gold;
  rr(ctx, b.x, b.y, b.w, b.h, 12);
  ctx.fill();
  ctx.fillStyle = '#2b1a12';
  ctx.font = 'bold ' + (b.big ? 24 : 18) + 'px Trebuchet MS, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2 - (b.sub ? 8 : 0));
  if (b.sub) {
    ctx.font = '13px Trebuchet MS, sans-serif';
    ctx.fillStyle = 'rgba(43,26,18,0.75)';
    ctx.fillText(b.sub, b.x + b.w / 2, b.y + b.h / 2 + 14);
  }
  ctx.textAlign = 'left';
}

export function buttonsFor(state) {
  const cx = VIEW.width / 2;
  if (state.screen === 'title') {
    return [{ id: 'start', label: 'Start Night 1', sub: 'or press Enter', x: cx - 130, y: 396, w: 260, h: 62, big: true }];
  }
  if (state.screen === 'upgrade') {
    const list = UPGRADES.map((u, i) => {
      const level = state.upgrades[u.id] || 0;
      const cost = level < u.max ? u.costs[level] : null;
      return {
        id: 'buy:' + u.id,
        label: u.name + (level > 0 ? ' ★'.repeat(level) : ''),
        sub: cost === null ? 'MAXED OUT' : u.desc + ' — ' + cost + ' coins',
        x: 92 + i * 200,
        y: 268,
        w: 184,
        h: 74,
        disabled: cost === null || state.coins < cost,
      };
    });
    list.push({ id: 'next', label: state.night >= TOTAL_NIGHTS ? 'Finish!' : 'Start Night ' + (state.night + 1), sub: NIGHTS[Math.min(state.night, TOTAL_NIGHTS - 1)].rush, x: cx - 130, y: 372, w: 260, h: 58, big: true });
    return list;
  }
  if (state.screen === 'win' || state.screen === 'lose') {
    return [{ id: 'again', label: state.screen === 'win' ? 'Play Again' : 'Try Again', sub: 'or press Enter', x: cx - 130, y: 400, w: 260, h: 62, big: true }];
  }
  return [];
}

function drawPanel(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(16,8,36,0.72)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  ctx.fillStyle = '#2c1d4e';
  rr(ctx, x, y, w, h, 18);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,201,60,0.5)';
  ctx.lineWidth = 2;
  rr(ctx, x, y, w, h, 18);
  ctx.stroke();
}

function drawTitle(ctx, state, timeMs, mouse) {
  drawBackground(ctx, timeMs);
  ctx.fillStyle = 'rgba(16,8,36,0.45)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  drawAwning(ctx);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = PALETTE.gold;
  ctx.font = 'bold 64px Trebuchet MS, sans-serif';
  ctx.fillText('NIGHT MARKET', VIEW.width / 2, 150);
  ctx.fillStyle = '#fff6e3';
  ctx.font = 'bold 64px Trebuchet MS, sans-serif';
  ctx.fillText('RUSH', VIEW.width / 2, 214);
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 20px Trebuchet MS, sans-serif';
  ctx.fillText('Run the busiest food stall on the street.', VIEW.width / 2, 268);
  ctx.fillStyle = '#fff6e3';
  ctx.font = '18px Trebuchet MS, sans-serif';
  ctx.fillText('Cook · Serve · Survive 5 nights — upgrades between nights, restart any time.', VIEW.width / 2, 300);
  ctx.font = '16px Trebuchet MS, sans-serif';
  ctx.fillStyle = 'rgba(255,246,227,0.85)';
  ctx.fillText('1. Click a stove to cook   2. Click a READY dish to serve   3. Don\'t let patience run out!', VIEW.width / 2, 336);
  const btn = buttonsFor(state)[0];
  const hover = mouse && mouse.x >= btn.x && mouse.x <= btn.x + btn.w && mouse.y >= btn.y && mouse.y <= btn.y + btn.h;
  drawButton(ctx, btn, hover);
  ctx.fillStyle = 'rgba(255,246,227,0.6)';
  ctx.font = '13px Trebuchet MS, sans-serif';
  ctx.fillText('A complete game: goal, rules, score, win, lose and restart — all on screen.', VIEW.width / 2, 486);
  ctx.textAlign = 'left';
}

function drawPlaying(ctx, state, timeMs, mouse) {
  drawBackground(ctx, timeMs);
  drawAwning(ctx);
  const count = customerSlots(state);
  for (const c of state.customers) {
    drawCustomer(ctx, c, slotX(c.slot, count), timeMs);
  }
  drawCounter(ctx);
  for (let i = 0; i < 4; i++) drawStation(ctx, state, i, timeMs, mouse);
  drawHud(ctx, state);
  if (state.message) {
    ctx.fillStyle = 'rgba(16,8,36,0.85)';
    ctx.font = '15px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    const w = ctx.measureText(state.message).width + 28;
    rr(ctx, VIEW.width / 2 - w / 2, 508, w, 26, 13);
    ctx.fill();
    ctx.fillStyle = '#fff6e3';
    ctx.fillText(state.message, VIEW.width / 2, 521);
    ctx.textAlign = 'left';
  }
  drawPopups(ctx, state);
}

function drawUpgrade(ctx, state, timeMs, mouse) {
  drawBackground(ctx, timeMs);
  drawAwning(ctx);
  drawCounter(ctx);
  drawPanel(ctx, 60, 88, 840, 372);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = PALETTE.gold;
  ctx.font = 'bold 34px Trebuchet MS, sans-serif';
  ctx.fillText('Night ' + state.night + ' complete!', VIEW.width / 2, 132);
  for (let i = 0; i < 3; i++) {
    star(ctx, VIEW.width / 2 - 52 + i * 52, 176, 20, i < state.stars ? PALETTE.gold : 'rgba(255,255,255,0.2)');
  }
  ctx.fillStyle = '#fff6e3';
  ctx.font = '18px Trebuchet MS, sans-serif';
  ctx.fillText('Served ' + state.nightServed + ' customers · earned ' + state.nightCoins + ' coins · ' + state.coins + ' in the till', VIEW.width / 2, 214);
  ctx.fillStyle = 'rgba(255,246,227,0.8)';
  ctx.font = 'bold 17px Trebuchet MS, sans-serif';
  ctx.fillText('Spend coins on upgrades, then open the next night:', VIEW.width / 2, 244);
  const btns = buttonsFor(state);
  for (const b of btns) {
    const hover = !b.disabled && mouse && mouse.x >= b.x && mouse.x <= b.x + b.w && mouse.y >= b.y && mouse.y <= b.y + b.h;
    if (b.id === 'next') {
      drawButton(ctx, b, hover);
      continue;
    }
    ctx.fillStyle = b.disabled ? 'rgba(120,110,140,0.55)' : hover ? '#3d2b63' : '#241640';
    rr(ctx, b.x, b.y, b.w, b.h, 12);
    ctx.fill();
    ctx.strokeStyle = b.disabled ? 'rgba(255,255,255,0.12)' : 'rgba(255,201,60,0.55)';
    ctx.lineWidth = 1.5;
    rr(ctx, b.x, b.y, b.w, b.h, 12);
    ctx.stroke();
    ctx.fillStyle = b.disabled ? 'rgba(255,246,227,0.45)' : '#fff6e3';
    ctx.font = 'bold 15px Trebuchet MS, sans-serif';
    ctx.fillText(b.label, b.x + b.w / 2, b.y + 26);
    ctx.font = '12.5px Trebuchet MS, sans-serif';
    ctx.fillStyle = b.disabled ? 'rgba(255,246,227,0.4)' : 'rgba(255,246,227,0.8)';
    const words = (b.sub || '').split(' — ');
    ctx.fillText(words[0] || '', b.x + b.w / 2, b.y + 46);
    if (words[1]) {
      ctx.fillStyle = PALETTE.gold;
      ctx.font = 'bold 13px Trebuchet MS, sans-serif';
      ctx.fillText(words[1], b.x + b.w / 2, b.y + 63);
    }
  }
  ctx.textAlign = 'left';
}

function drawEnd(ctx, state, timeMs, mouse) {
  drawBackground(ctx, timeMs);
  drawAwning(ctx);
  drawCounter(ctx);
  drawPanel(ctx, 130, 84, 700, 380);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (state.screen === 'win') {
    ctx.fillStyle = PALETTE.gold;
    ctx.font = 'bold 44px Trebuchet MS, sans-serif';
    ctx.fillText('YOU DID IT!', VIEW.width / 2, 140);
    for (let i = 0; i < 5; i++) {
      star(ctx, VIEW.width / 2 - 104 + i * 52, 196, 22, PALETTE.gold);
    }
    ctx.fillStyle = '#fff6e3';
    ctx.font = '20px Trebuchet MS, sans-serif';
    ctx.fillText('Five nights survived — the stall is the talk of the market.', VIEW.width / 2, 240);
    ctx.font = 'bold 22px Trebuchet MS, sans-serif';
    ctx.fillStyle = PALETTE.gold;
    ctx.fillText(state.totalCoins + ' coins earned · ' + state.totalServed + ' customers served', VIEW.width / 2, 282);
    ctx.fillStyle = 'rgba(255,246,227,0.85)';
    ctx.font = '17px Trebuchet MS, sans-serif';
    ctx.fillText('Hearts left: ' + state.rep + ' / 5 — a flawless run keeps all five.', VIEW.width / 2, 318);
  } else {
    ctx.fillStyle = '#ff7a6b';
    ctx.font = 'bold 40px Trebuchet MS, sans-serif';
    ctx.fillText('OUT OF HEARTS…', VIEW.width / 2, 140);
    ctx.fillStyle = '#fff6e3';
    ctx.font = '20px Trebuchet MS, sans-serif';
    ctx.fillText('Too many customers walked away on night ' + state.night + '.', VIEW.width / 2, 200);
    ctx.font = 'bold 22px Trebuchet MS, sans-serif';
    ctx.fillStyle = PALETTE.gold;
    ctx.fillText(state.totalCoins + ' coins earned · ' + state.totalServed + ' customers served', VIEW.width / 2, 246);
    ctx.fillStyle = 'rgba(255,246,227,0.85)';
    ctx.font = '17px Trebuchet MS, sans-serif';
    ctx.fillText('Tip: cook early, serve fast, and buy the Calm Charm.', VIEW.width / 2, 286);
  }
  const btn = buttonsFor(state)[0];
  const hover = mouse && mouse.x >= btn.x && mouse.x <= btn.x + btn.w && mouse.y >= btn.y && mouse.y <= btn.y + btn.h;
  drawButton(ctx, btn, hover);
  ctx.textAlign = 'left';
}

export function drawScene(ctx, state, timeMs, mouse) {
  ctx.clearRect(0, 0, VIEW.width, VIEW.height);
  if (state.screen === 'title') drawTitle(ctx, state, timeMs, mouse);
  else if (state.screen === 'playing') drawPlaying(ctx, state, timeMs, mouse);
  else if (state.screen === 'upgrade') drawUpgrade(ctx, state, timeMs, mouse);
  else drawEnd(ctx, state, timeMs, mouse);
}
