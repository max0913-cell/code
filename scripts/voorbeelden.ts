/** Print voorbeeldopgaven per subtest en niveau: `npm run voorbeelden -- rekenen` */
import { makeRng } from '../src/core/rng';
import { LEVELS, LETTERS, type Question, type SubtestId } from '../src/core/types';
import { SUBTESTS } from '../src/subtests/registry';

declare const process: { argv: string[] };

const strip = (h: string): string =>
  h
    .replace(/<span class="frac"[^>]*><span class="frac-n">([^<]*)<\/span><span class="frac-d">([^<]*)<\/span><\/span>/g, '$1/$2')
    .replace(/<\/p>\s*<p>/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, '[figuur]')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

const only = process.argv[2] as SubtestId | undefined;
const count = Number(process.argv[3] ?? 3);
for (const st of SUBTESTS) {
  if (only && st.id !== only) continue;
  console.log(`\n=== ${st.name} ===`);
  for (const level of LEVELS) {
    console.log(`\n-- ${level} --`);
    const r = makeRng(2027 + level.length);
    const used = new Set<string>();
    for (let i = 0; i < count; i++) {
      const q: Question = st.make(level, r, used);
      used.add(q.key);
      const opts = q.options.map((o, j) => `${LETTERS[j]}) ${o.label}`).join('   ');
      console.log(`${i + 1}. ${q.promptLabel}\n   ${opts}\n   Goed: ${q.correct.map((c) => LETTERS[c]).join(' en ')}  [${q.type}]\n   Uitleg: ${strip(q.explanationHtml)}`);
    }
  }
}
