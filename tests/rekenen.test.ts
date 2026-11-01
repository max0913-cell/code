import { makeRng } from '../src/core/rng';
import { LEVELS } from '../src/core/types';
import { satisfies, renderEquation } from '../src/subtests/rekenen/expr';
import { REKEN_TYPES, checkRekenItem, generateRekenen, nearDigits, rekenToQuestion } from '../src/subtests/rekenen/generator';
import { D } from '../src/core/fraction';

const N_PER_LEVEL = 4000;

describe('Rekenvaardigheid', () => {
  it('heeft minstens 8 somtypes per niveau', () => {
    for (const level of LEVELS) expect(Object.keys(REKEN_TYPES[level]).length).toBeGreaterThanOrEqual(8);
  });

  it('nearDigits maakt afleiders die erop lijken', () => {
    expect(nearDigits(D('0,4'))!.toDecimal()).toBe('0,44');
    expect(nearDigits(D('0,03'))!.toDecimal()).toBe('0,033');
  });

  for (const level of LEVELS) {
    it(`elk somtype werkt (${level})`, () => {
      const r = makeRng(7);
      for (const type of Object.keys(REKEN_TYPES[level])) {
        for (let i = 0; i < 200; i++) {
          const it = generateRekenen(level, r, type);
          expect(it.type).toBe(type);
        }
      }
    });

    it(`${N_PER_LEVEL} opgaven zijn correct (${level})`, () => {
      const r = makeRng(1234 + level.length);
      const types = new Set<string>();
      for (let i = 0; i < N_PER_LEVEL; i++) {
        const it = generateRekenen(level, r);
        types.add(it.type);
        const errs = checkRekenItem(it);
        if (errs.length) throw new Error(`${renderEquation(it.eq, false)}: ${errs.join(', ')}`);
        // onafhankelijke controle: precies 1 optie maakt de som kloppend
        const ok = it.options.filter((o) => satisfies(it.eq, o));
        expect(ok.length).toBe(1);
        // weergave: alle opties verschillend, met komma
        const q = rekenToQuestion(it, level);
        expect(new Set(q.options.map((o) => o.label)).size).toBe(5);
        expect(q.options.some((o) => o.label.includes('.'))).toBe(false);
        expect(q.correct.length).toBe(1);
        expect(satisfies(it.eq, it.options[q.correct[0]])).toBe(true);
        expect(q.explanationHtml.length).toBeGreaterThan(10);
      }
      expect(types.size).toBe(Object.keys(REKEN_TYPES[level]).length);
    });
  }
});
