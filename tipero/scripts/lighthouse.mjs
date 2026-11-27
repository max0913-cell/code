/**
 * Draait Lighthouse (mobiel) op alle pagina's van de gebouwde site.
 *
 *   npm run build
 *   npm run lighthouse
 *
 * Gebruikt `npx lighthouse` en de Chrome/Chromium op je computer.
 * Staat Chrome op een andere plek? Zet dan CHROME_PATH, bijvoorbeeld:
 *   CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run lighthouse
 * De volledige rapporten komen in lighthouse-rapporten/ (niet in git).
 */
import { execFile } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { startServer } from './statische-server.mjs';

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const poort = 4330;
const basis = `http://127.0.0.1:${poort}`;
const rapporten = join(root, 'lighthouse-rapporten');
await mkdir(rapporten, { recursive: true });

const sitemap = await readFile(join(root, 'dist', 'sitemap-0.xml'), 'utf8');
const paden = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
// Pagina's die bewust niet geïndexeerd worden: daar telt de SEO-score niet mee.
const noindex = new Set(['/404', '/bedankt']);
paden.push(...noindex);

const server = await startServer(join(root, 'dist'), poort);

const categorieen = ['performance', 'accessibility', 'best-practices', 'seo'];
const namen = { performance: 'Prestaties', accessibility: 'Toegankelijk', 'best-practices': 'Best practices', seo: 'SEO' };
const resultaten = [];
let teLaag = 0;

for (const pad of paden) {
  const bestand = join(rapporten, `${pad === '/' ? 'home' : pad.slice(1).replace(/\//g, '-')}.json`);
  await run(
    'npx',
    [
      '--yes',
      'lighthouse@13.6.0',
      `${basis}${pad}`,
      `--only-categories=${categorieen.join(',')}`,
      '--output=json',
      `--output-path=${bestand}`,
      '--quiet',
      '--chrome-flags=--headless=new --no-sandbox --no-proxy-server',
    ],
    { cwd: root, maxBuffer: 50 * 1024 * 1024 },
  );
  const rapport = JSON.parse(await readFile(bestand, 'utf8'));
  const scores = Object.fromEntries(categorieen.map((c) => [c, Math.round(rapport.categories[c].score * 100)]));
  const lcp = rapport.audits['largest-contentful-paint']?.displayValue ?? '';
  const cls = rapport.audits['cumulative-layout-shift']?.displayValue ?? '';
  resultaten.push({ pad, ...scores, lcp, cls });
  if (categorieen.some((c) => scores[c] < 95 && !(c === 'seo' && noindex.has(pad)))) teLaag++;

  // Laat zien welke audits niet slaagden (voor categorieën onder de 100).
  for (const c of categorieen) {
    if (scores[c] === 100 || (c === 'seo' && noindex.has(pad))) continue;
    const mislukt = rapport.categories[c].auditRefs
      .map((ref) => rapport.audits[ref.id])
      .filter((a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'manual');
    for (const a of mislukt) console.log(`   ${pad} · ${namen[c]}: ${a.title} (${a.displayValue ?? a.score})`);
  }
}

server.close();

console.log('\nLighthouse (mobiel)\n');
console.log('Pagina'.padEnd(24) + categorieen.map((c) => namen[c].padStart(15)).join('') + '      LCP     CLS');
for (const r of resultaten) {
  console.log(
    r.pad.padEnd(24) + categorieen.map((c) => String(r[c]).padStart(15)).join('') + String(r.lcp).padStart(9) + String(r.cls).padStart(8),
  );
}
console.log(`\n(SEO van ${[...noindex].join(' en ')} telt niet mee: die pagina's zijn bewust noindex.)`);
console.log(teLaag ? `\n✗ ${teLaag} pagina('s) scoren ergens onder de 95.` : '\n✓ Alle pagina\'s scoren 95+ op alle vier de onderdelen.');
process.exit(teLaag ? 1 : 0);
