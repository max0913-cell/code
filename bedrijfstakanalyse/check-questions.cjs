#!/usr/bin/env node
/*
 * Controle van de vragenbank en flashcards.
 * Gebruik:  node check-questions.cjs   (vanuit deze map of met pad)
 * Stopt met exitcode 1 als er fouten zijn.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dir = __dirname;
// Net als in de browser: `window` is het globale object, dus window.QUESTIONS === QUESTIONS
const ctx = {};
ctx.window = ctx;
vm.createContext(ctx);
for (const file of ['questions.js', 'flashcards.js']) {
  const code = fs.readFileSync(path.join(dir, file), 'utf8');
  vm.runInContext(code, ctx, { filename: file });
}

const Q = ctx.QUESTIONS;
const F = ctx.FLASHCARDS;
const errors = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);

if (!Array.isArray(Q)) { console.error('window.QUESTIONS is geen array'); process.exit(1); }

// Officiële antwoordsleutels van de slides (letter A–D, in de oorspronkelijke optievolgorde)
const sleutel = {
  'slides week 2': 'ACBCDBC',          // geen officiële sleutel; 4 en 7 onbevestigd
  'slides week 3': 'BDABDDBBBC',
  'slides week 4': 'BCADADBCDACBCD'
};
const gevondenSlides = { 'slides week 2': new Set(), 'slides week 3': new Set(), 'slides week 4': new Set() };

const ids = new Set();
const teksten = new Map();
const perWeek = { 1: 0, 2: 0, 3: 0, 4: 0 };
const perBron = { slides: 0, zelfgemaakt: 0 };
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9à-ÿ]+/g, ' ').trim();

for (const q of Q) {
  const id = q && q.id ? q.id : '(zonder id)';
  if (!q.id || typeof q.id !== 'string') err(id, 'geen geldig id');
  if (ids.has(q.id)) err(id, 'dubbel id');
  ids.add(q.id);

  if (![1, 2, 3, 4].includes(q.week)) err(id, `ongeldige week "${q.week}"`);
  else perWeek[q.week]++;
  if (q.id && q.week && !q.id.startsWith(`w${q.week}-`)) err(id, 'id past niet bij week');

  if (!q.onderwerp || !String(q.onderwerp).trim()) err(id, 'geen onderwerp');
  if (!q.vraag || String(q.vraag).trim().length < 10) err(id, 'geen (of te korte) vraagtekst');

  if (!Array.isArray(q.opties) || q.opties.length !== 4) err(id, 'niet precies 4 opties');
  else {
    if (q.opties.some(o => !o || !String(o).trim())) err(id, 'lege optie');
    if (new Set(q.opties.map(norm)).size !== 4) err(id, 'opties niet uniek');
    if (q.opties.some(o => /^[A-D][.)]\s/.test(o))) err(id, 'optie begint met een letter (A./B.)');
  }
  if (!Number.isInteger(q.antwoord) || q.antwoord < 0 || q.antwoord > 3) err(id, `ongeldig antwoord "${q.antwoord}"`);

  if (!q.uitleg || String(q.uitleg).trim().length < 40) err(id, 'geen (of te korte) uitleg');
  if (!q.hint || !String(q.hint).trim()) err(id, 'geen hint');

  if (!['slides', 'zelfgemaakt'].includes(q.bron)) err(id, `ongeldige bron "${q.bron}"`);
  else perBron[q.bron]++;

  if (q.onbevestigd && q.bron !== 'slides') err(id, 'onbevestigd mag alleen bij slides-vragen');

  if (q.bron === 'slides') {
    const m = /^Tentamenvraag (\d+), (slides week [234])$/.exec(q.bronDetail || '');
    if (!m) err(id, 'slides-vraag zonder geldig bronDetail');
    else {
      const nr = Number(m[1]);
      const set = m[2];
      const letter = sleutel[set][nr - 1];
      if (!letter) err(id, `onbekend vraagnummer ${nr} in ${set}`);
      else if ('ABCD'[q.antwoord] !== letter) err(id, `antwoord ${'ABCD'[q.antwoord]} wijkt af van sleutel ${letter}`);
      if (gevondenSlides[set].has(nr)) err(id, `${set} vraag ${nr} komt dubbel voor`);
      gevondenSlides[set].add(nr);
      const moetOnbevestigd = set === 'slides week 2' && (nr === 4 || nr === 7);
      if (!!q.onbevestigd !== moetOnbevestigd) err(id, moetOnbevestigd ? 'moet als onbevestigd gemarkeerd zijn' : 'staat onterecht op onbevestigd');
    }
  }

  const t = norm(q.vraag);
  if (teksten.has(t)) err(id, `zelfde vraagtekst als ${teksten.get(t)}`);
  teksten.set(t, q.id);
}

// Alle officiële vragen aanwezig?
for (const [set, s] of Object.entries(sleutel)) {
  for (let i = 1; i <= s.length; i++) if (!gevondenSlides[set].has(i)) errors.push(`ontbreekt: Tentamenvraag ${i}, ${set}`);
}
for (const w of [1, 2, 3, 4]) if (perWeek[w] < 25) errors.push(`week ${w} heeft maar ${perWeek[w]} vragen (minimaal 25)`);

// Flashcards
if (!Array.isArray(F)) errors.push('window.FLASHCARDS is geen array');
else {
  const fIds = new Set();
  const fPerWeek = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const f of F) {
    const id = f.id || '(flashcard zonder id)';
    if (fIds.has(f.id)) err(id, 'dubbele flashcard-id');
    fIds.add(f.id);
    if (![1, 2, 3, 4].includes(f.week)) err(id, 'ongeldige week');
    else fPerWeek[f.week]++;
    for (const k of ['begrip', 'uitleg', 'voorbeeld']) if (!f[k] || !String(f[k]).trim()) err(id, `flashcard zonder ${k}`);
  }
  for (const w of [1, 2, 3, 4]) if (fPerWeek[w] < 8) errors.push(`flashcards week ${w}: maar ${fPerWeek[w]}`);
  console.log(`Flashcards: ${F.length} (week 1: ${fPerWeek[1]}, week 2: ${fPerWeek[2]}, week 3: ${fPerWeek[3]}, week 4: ${fPerWeek[4]})`);
}

// Verdeling juiste antwoord-positie (alleen informatief: bij het oefenen wordt toch geschud)
const pos = [0, 0, 0, 0];
Q.forEach(q => { if (Number.isInteger(q.antwoord)) pos[q.antwoord]++; });

console.log(`Vragen: ${Q.length} (week 1: ${perWeek[1]}, week 2: ${perWeek[2]}, week 3: ${perWeek[3]}, week 4: ${perWeek[4]})`);
console.log(`Bron: slides ${perBron.slides}, zelfgemaakt ${perBron.zelfgemaakt}`);
console.log(`Juiste antwoord in bestand op positie A/B/C/D: ${pos.join(' / ')}`);

if (errors.length) {
  console.error(`\n${errors.length} fout(en):`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}
console.log('\nAlles in orde.');
