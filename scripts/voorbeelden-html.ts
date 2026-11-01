/** Schrijf een HTML-pagina met voorbeeldopgaven (alle niveaus) voor visuele controle. */
import { makeRng } from '../src/core/rng';
import { LEVELS, LETTERS, type SubtestId } from '../src/core/types';
import { SUBTESTS } from '../src/subtests/registry';

declare const process: { argv: string[] };
declare function require(m: string): { readFileSync(p: string, e: string): string; writeFileSync(p: string, d: string): void };
const fs = require('fs');

const id = process.argv[2] as SubtestId;
const out = process.argv[3];
const count = Number(process.argv[4] ?? 3);
const st = SUBTESTS.find((s) => s.id === id)!;
const css = fs.readFileSync('src/styles.css', 'utf8');
let body = `<h1>${st.name}</h1>`;
for (const level of LEVELS) {
  body += `<h2>${level}</h2>`;
  const r = makeRng(77 + level.length);
  const used = new Set<string>();
  for (let i = 0; i < count; i++) {
    const q = st.make(level, r, used);
    used.add(q.key);
    body += `<div class="card"><div class="q-meta">${i + 1}. [${q.type}] goed: ${q.correct.map((c) => LETTERS[c]).join(' en ')}</div><div class="q-instruction">${q.instruction}</div>${q.promptHtml ? `<div class="prompt">${q.promptHtml}</div>` : ''}<div class="options ${q.optionStyle} n${q.options.length}">${q.options
      .map((o, j) => `<div class="opt ${q.optionStyle === 'figure' ? 'figure-opt' : ''} ${q.correct.includes(j) ? 'correct' : ''}"><span class="letter">${LETTERS[j]}</span><span class="opt-body">${o.html}</span></div>`)
      .join('')}</div><div class="feedback">${q.explanationHtml}</div></div>`;
  }
}
fs.writeFileSync(out, `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body><main>${body}</main></body></html>`);
