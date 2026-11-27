/**
 * Valideert de structured data (JSON-LD) van elke pagina tegen het
 * schema.org-vocabulaire, offline, met de typedefinities van `schema-dts`
 * (van Google). Onbekende types, onbekende eigenschappen en verkeerde
 * waardetypes geven een fout.
 *
 *   npm run controleer:schema        (na `npm run build`)
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const cache = join(root, 'node_modules', '.cache', 'schema-controle');
await mkdir(cache, { recursive: true });

const bestanden = (await readdir(dist)).filter((f) => f.endsWith('.html'));
let ts = "import type { Graph } from 'schema-dts';\n\n";
let aantal = 0;

for (const bestand of bestanden) {
  const html = await readFile(join(dist, bestand), 'utf8');
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const json = JSON.parse(m[1]);
    const naam = bestand.replace(/\W/g, '_');
    ts += `// ${bestand}\nexport const pagina_${naam}_${aantal++}: Graph = ${JSON.stringify(json, null, 2)};\n\n`;
  }
}

const tsBestand = join(cache, 'controle.ts');
await writeFile(tsBestand, ts);
await writeFile(
  join(cache, 'tsconfig.json'),
  JSON.stringify({
    compilerOptions: {
      strict: true,
      noEmit: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      target: 'es2022',
      skipLibCheck: true,
      typeRoots: [],
      types: [],
    },
    files: ['controle.ts'],
  }),
);

try {
  execFileSync(join(root, 'node_modules', '.bin', 'tsc'), ['-p', join(cache, 'tsconfig.json')], { stdio: 'pipe' });
  console.log(`✓ ${aantal} JSON-LD-blokken uit ${bestanden.length} pagina's kloppen met het schema.org-vocabulaire.`);
} catch (e) {
  console.log(String(e.stdout || e.message));
  console.log(`✗ Fouten in de structured data (zie hierboven, bestand: ${tsBestand}).`);
  process.exit(1);
}
