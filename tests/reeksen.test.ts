import { makeRng } from '../src/core/rng';
import { LEVELS } from '../src/core/types';
import { REEKS_TYPES, alternativePredictions, checkReeksItem, generateReeks, reeksToQuestion } from '../src/subtests/reeksen/generator';

const N_PER_LEVEL = 4000;

describe('Cijferreeksen', () => {
  it('heeft minstens 8 regeltypes per niveau', () => {
    for (const level of LEVELS) expect(Object.keys(REEKS_TYPES[level]).length).toBeGreaterThanOrEqual(8);
  });

  it('herkent bekende regels', () => {
    expect(alternativePredictions([2, 4, 6, 8, 10])).toContain(12);
    expect(alternativePredictions([3, 6, 12, 24, 48])).toContain(96);
    expect(alternativePredictions([1, 4, 9, 16, 25])).toContain(36);
    expect(alternativePredictions([1, 1, 2, 3, 5, 8])).toContain(13);
    expect(alternativePredictions([1, 10, 3, 8, 5, 6])).toContain(7);
  });

  for (const level of LEVELS) {
    it(`elk regeltype werkt (${level})`, () => {
      const r = makeRng(99);
      for (const type of Object.keys(REEKS_TYPES[level])) {
        for (let i = 0; i < 100; i++) expect(generateReeks(level, r, type).type).toBe(type);
      }
    });

    it(`${N_PER_LEVEL} reeksen hebben precies 1 verdedigbaar antwoord (${level})`, () => {
      const r = makeRng(555 + level.length);
      const types = new Set<string>();
      for (let i = 0; i < N_PER_LEVEL; i++) {
        const it = generateReeks(level, r);
        types.add(it.type);
        const errs = checkReeksItem(it);
        if (errs.length) throw new Error(`${it.terms.join(', ')} → ${it.answer}: ${errs.join(', ')}`);
        // geen enkele andere passende regel wijst een andere optie aan
        for (const p of alternativePredictions(it.terms)) if (p !== it.answer) expect(it.options).not.toContain(p);
        const q = reeksToQuestion(it, level);
        expect(new Set(q.options.map((o) => o.label)).size).toBe(5);
        expect(q.options[q.correct[0]].label.replace('−', '-')).toBe(String(it.answer));
      }
      expect(types.size).toBe(Object.keys(REEKS_TYPES[level]).length);
    });
  }
});
