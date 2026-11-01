import { escapeHtml } from '../ui/dom';
import type { Rng } from '../core/rng';
import { LETTERS, type Level, type Question } from '../core/types';
import { EXAMEN } from './analogieen/examen';
import { MAKKELIJK } from './analogieen/makkelijk';
import { MOEILIJK } from './analogieen/moeilijk';
import type { AnalogieItem } from './analogieen/types';
import { REL_EXAMEN, REL_MAKKELIJK, REL_MOEILIJK, type RelatieItem } from './woordrelaties/banks';

export const ANALOGIE_BANK: Record<Level, AnalogieItem[]> = { makkelijk: MAKKELIJK, examen: EXAMEN, moeilijk: MOEILIJK };
export const RELATIE_BANK: Record<Level, RelatieItem[]> = { makkelijk: REL_MAKKELIJK, examen: REL_EXAMEN, moeilijk: REL_MOEILIJK };

/** Kies een vraag die nog niet in deze ronde is geweest (als alles op is: een willekeurige). */
function pickIndex(n: number, prefix: string, r: Rng, used: Set<string>): number {
  const free = Array.from({ length: n }, (_, i) => i).filter((i) => !used.has(`${prefix}${i}`));
  return free.length ? r.pick(free) : r.int(0, n - 1);
}

export function analogieQuestion(level: Level, i: number, r: Rng): Question {
  const [a, b, c, ans, dis, uitleg] = ANALOGIE_BANK[level][i];
  const options = r.shuffle([ans, ...dis]);
  const e = escapeHtml;
  return {
    key: `ana|${level}|${i}`,
    subtest: 'analogieen',
    level,
    type: 'analogie',
    instruction: 'Welk woord hoort op de plaats van het vraagteken? Het verband tussen de eerste twee woorden is hetzelfde als tussen de laatste twee.',
    promptHtml: `<div class="analogy" aria-label="${e(a)} staat tot ${e(b)} zoals ${e(c)} staat tot vraagteken">${e(a)}<span class="eq">–</span>${e(b)}<span class="eq">=</span>${e(c)}<span class="eq">–</span><span class="blank">?</span></div>`,
    promptLabel: `${a} – ${b} = ${c} – ?`,
    options: options.map((o) => ({ html: e(o), label: o })),
    correct: [options.indexOf(ans)],
    explanationHtml: `<p>${e(uitleg)}</p>`,
    optionStyle: 'text',
  };
}

export function relatieQuestion(level: Level, i: number, r: Rng): Question {
  const [w1, w2, soort, fillers, uitleg] = RELATIE_BANK[level][i];
  const words = r.shuffle([w1, w2, ...fillers]);
  const e = escapeHtml;
  const correct = [words.indexOf(w1), words.indexOf(w2)].sort((x, y) => x - y);
  const rest = words.filter((w) => w !== w1 && w !== w2);
  return {
    key: `rel|${level}|${i}`,
    subtest: 'woordrelaties',
    level,
    type: soort === 'syn' ? 'synoniem' : 'tegenstelling',
    instruction: 'Welke 2 woorden betekenen ongeveer hetzelfde, of juist het tegenovergestelde?',
    promptHtml: '',
    promptLabel: words.join(', '),
    options: words.map((w) => ({ html: e(w), label: w })),
    correct,
    explanationHtml: `<p><strong>${e(w1)}</strong> en <strong>${e(w2)}</strong> (${LETTERS[correct[0]]} en ${LETTERS[correct[1]]}): ${e(uitleg)}</p><p>${e(rest.join(', '))} vormen met geen ander woord zo'n paar.</p>`,
    optionStyle: 'text',
  };
}

export const makeAnalogie = (level: Level, r: Rng, used: Set<string>): Question =>
  analogieQuestion(level, pickIndex(ANALOGIE_BANK[level].length, `ana|${level}|`, r, used), r);
export const makeRelatie = (level: Level, r: Rng, used: Set<string>): Question =>
  relatieQuestion(level, pickIndex(RELATIE_BANK[level].length, `rel|${level}|`, r, used), r);
