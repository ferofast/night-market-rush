// Night Market Rush — main.ts
// One job: hand the game in. Copies game/ and screenshots/ from this
// repository to the output directory and writes dossier.json with
// buildDossier from vendor/makefun-game.ts, exactly as the kit asks.
// Runs twice with identical bytes: no timestamps, no randomness here.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 48 * 1024 * 1024,
  game_path_max_bytes: 1000,
};

function countEntries(dir: string): number {
  let n = 0;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    n += 1;
    if (statSync(p).isDirectory()) n += countEntries(p);
  }
  return n;
}

function main(): void {
  const root = dirname(fileURLToPath(import.meta.url));
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  const gameDir = join(root, 'game');
  const shotsDir = join(root, 'screenshots');
  if (!existsSync(gameDir)) throw new Error('main.ts: no game/ directory beside main.ts');
  if (!existsSync(shotsDir)) throw new Error('main.ts: no screenshots/ directory beside main.ts');

  // The grader mounts the output directory as a volume: removing the
  // directory itself fails (EBUSY on the mount point). Clean only its
  // contents instead, never the directory.
  mkdirSync(outDir, { recursive: true });
  for (const name of readdirSync(outDir)) {
    rmSync(join(outDir, name), { recursive: true, force: true });
  }
  mkdirSync(join(outDir, 'game'), { recursive: true });
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
  cpSync(gameDir, join(outDir, 'game'), { recursive: true });
  cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });

  const dossier = buildDossier(outDir, CAPS);
  writeFileSync(join(outDir, 'dossier.json'), dossier);

  const gameEntries = countEntries(join(outDir, 'game'));
  const shotFiles = readdirSync(join(outDir, 'screenshots')).filter((f) => !f.startsWith('.'));
  if (shotFiles.length < 3 || shotFiles.length > 4) {
    throw new Error(`main.ts: expected 3-4 screenshots, found ${shotFiles.length}`);
  }
  console.log(`night-market-rush: game entries=${gameEntries} screenshots=${shotFiles.length} dossier_bytes=${dossier.length}`);
}

main();
