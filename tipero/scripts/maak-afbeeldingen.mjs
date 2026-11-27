/**
 * Maakt de OG-afbeeldingen, icons en productafbeeldingen opnieuw aan.
 *
 *   npm run afbeeldingen
 *
 * Wat het doet:
 *  1. start `astro dev` (de sjablonen in src/pages/merkbeelden bestaan alleen in dev),
 *  2. maakt met Playwright (Chromium) een screenshot van elk sjabloon,
 *  3. comprimeert de PNG's met sharp en schrijft ze naar public/.
 *
 * Eenmalig nodig: `npm install --no-save playwright` en `npx playwright install chromium`.
 */
import { execSync, spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const poort = 4329;
const basis = `http://localhost:${poort}`;
const beelden = JSON.parse(await readFile(resolve(root, 'scripts/merkbeelden.json'), 'utf8'));

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  // Geen lokale installatie? Probeer een globale installatie van Playwright.
  try {
    const globaal = execSync('npm root -g', { encoding: 'utf8' }).trim();
    ({ chromium } = createRequire(resolve(globaal, 'noop.js'))('playwright'));
  } catch {
    /* niet gevonden */
  }
}
if (!chromium) {
  console.error(
    '\nPlaywright is niet gevonden. Installeer het eenmalig met:\n\n  npm install --no-save playwright\n  npx playwright install chromium\n',
  );
  process.exit(1);
}

// 1. Dev-server starten
const server = spawn('npx', ['astro', 'dev', '--port', String(poort)], { cwd: root, stdio: 'ignore' });
const stop = () => server.kill('SIGTERM');
process.on('exit', stop);

async function wachtOpServer(pogingen = 60) {
  for (let i = 0; i < pogingen; i++) {
    try {
      const res = await fetch(`${basis}/merkbeelden/${beelden[0].id}`);
      if (res.ok) return;
    } catch {
      /* nog niet klaar */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('De dev-server start niet.');
}

/** Bouwt een .ico-bestand van PNG-afbeeldingen (PNG-in-ICO, door alle moderne browsers ondersteund). */
function maakIco(pngs) {
  const kop = Buffer.alloc(6);
  kop.writeUInt16LE(0, 0);
  kop.writeUInt16LE(1, 2);
  kop.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const items = pngs.map(({ grootte, data }) => {
    const item = Buffer.alloc(16);
    item.writeUInt8(grootte >= 256 ? 0 : grootte, 0);
    item.writeUInt8(grootte >= 256 ? 0 : grootte, 1);
    item.writeUInt8(0, 2);
    item.writeUInt8(0, 3);
    item.writeUInt16LE(1, 4);
    item.writeUInt16LE(32, 6);
    item.writeUInt32LE(data.length, 8);
    item.writeUInt32LE(offset, 12);
    offset += data.length;
    return item;
  });
  return Buffer.concat([kop, ...items, ...pngs.map((p) => p.data)]);
}

try {
  await wachtOpServer();
  const browser = await chromium.launch();

  for (const beeld of beelden) {
    const page = await browser.newPage({
      viewport: { width: beeld.breedte, height: beeld.hoogte },
      deviceScaleFactor: beeld.ico ? 4 : 1,
      reducedMotion: 'reduce',
    });
    await page.goto(`${basis}/merkbeelden/${beeld.id}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const ruw = await page.screenshot({ omitBackground: Boolean(beeld.transparant) });
    await page.close();

    const uit = resolve(root, beeld.uit);
    await mkdir(dirname(uit), { recursive: true });

    if (beeld.ico) {
      const formaten = [16, 32, 48];
      const pngs = await Promise.all(
        formaten.map(async (grootte) => ({
          grootte,
          data: await sharp(ruw).resize(grootte, grootte).png({ compressionLevel: 9 }).toBuffer(),
        })),
      );
      await writeFile(uit, maakIco(pngs));
    } else {
      const png = await sharp(ruw).png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 }).toBuffer();
      await writeFile(uit, png);
    }
    console.log(`✓ ${beeld.uit}`);
  }

  await browser.close();
} finally {
  stop();
}
