/**
 * Schrijf een HTML-pagina met voorbeeldopgaven voor visuele controle.
 * Gebruik: npm run voorbeelden:html -- <subtest|alles> <uitvoer.html> [aantal per niveau]
 */
import { makeRng } from '../src/core/rng';
import { LEVELS, LEVEL_NAMES, LETTERS } from '../src/core/types';
import { SUBTESTS } from '../src/subtests/registry';

declare const process: { argv: string[] };
declare function require(m: string): { readFileSync(p: string, e: string): string; writeFileSync(p: string, d: string): void };
const fs = require('fs');

const which = process.argv[2] ?? 'alles';
const out = process.argv[3] ?? 'voorbeelden.html';
const count = Number(process.argv[4] ?? 3);
const css = fs.readFileSync('src/styles.css', 'utf8');
const list = which === 'alles' ? SUBTESTS : SUBTESTS.filter((s) => s.id === which);

let body = `<h1>Voorbeeldopgaven</h1><p class="muted">${count} opgaven per niveau per subtest, met het goede antwoord groen gemarkeerd en de uitleg eronder.</p>`;
body += `<nav class="card"><ul class="links">${list.map((s) => `<li><a href="#${s.id}">${s.name}</a>${s.extra ? ' <span class="badge">extra</span>' : ''}</li>`).join('')}</ul></nav>`;
for (const st of list) {
  body += `<h2 id="${st.id}" style="margin-top:32px">${st.name}${st.extra ? ' <span class="badge">extra: misschien niet op de selectiedag</span>' : ''}</h2>`;
  for (const level of LEVELS) {
    body += `<h3 style="margin-top:16px">${LEVEL_NAMES[level]}</h3>`;
    const r = makeRng(2027 + level.length * 31 + st.id.length);
    const used = new Set<string>();
    for (let i = 0; i < count; i++) {
      const q = st.make(level, r, used);
      used.add(q.key);
      body += `<div class="card" data-scale-group="1"><div class="q-meta">${LEVEL_NAMES[level]} · voorbeeld ${i + 1} · goed: ${q.correct.map((c) => LETTERS[c]).join(' en ')}</div><div class="q-instruction">${q.instruction}</div>${q.promptHtml ? `<div class="prompt">${q.promptHtml}</div>` : ''}<div class="options ${q.optionStyle} n${q.options.length}${q.optionStyle === 'text' && q.options.every((o) => o.label.length <= 8) ? ' short' : ''}">${q.options
        .map((o, j) => `<div class="opt ${q.optionStyle === 'figure' ? 'figure-opt' : ''} ${q.correct.includes(j) ? 'correct' : ''}"><span class="letter">${LETTERS[j]}</span><span class="opt-body">${o.html}</span></div>`)
        .join('')}</div><div class="feedback"><strong>Uitleg</strong>${q.explanationHtml}</div></div>`;
    }
  }
}
// zelfde schaal voor figuren die je met elkaar vergelijkt (zoals in de app)
const fit = `<script>function fit(){document.querySelectorAll('[data-scale-group]').forEach(function(g){var s=[].slice.call(g.querySelectorAll('svg[data-u]'));if(!s.length)return;s.forEach(function(x){x.style.width=''});var u=30;s.forEach(function(x){var p=x.parentElement,cs=getComputedStyle(p),a=p.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);if(a>0)u=Math.min(u,a/Number(x.getAttribute('data-u')))});s.forEach(function(x){x.style.width=(u*Number(x.getAttribute('data-u'))).toFixed(1)+'px'})})}window.addEventListener('load',fit);window.addEventListener('resize',fit);</script>`;
fs.writeFileSync(
  out,
  `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Voorbeeldopgaven NOA-oefenen</title><style>${css}</style></head><body><main>${body}</main>${fit}</body></html>`,
);
