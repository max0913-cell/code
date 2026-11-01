import { makeRng } from '../src/core/rng';
import { LEVELS } from '../src/core/types';
import { FLAG_BASES, type FlagBase, flagPoints, oddOneOut } from '../src/subtests/exclusie/model';
import { ALL_FEATURES, RULES } from '../src/subtests/exclusie/rules';
import { checkExclusie, exclusieToQuestion, generateExclusie } from '../src/subtests/exclusie/generator';

const N_PER_LEVEL = 2500;

/** Vergelijk twee puntverzamelingen na verschuiven naar het zwaartepunt. */
function sameShape(a: [number, number][], b: [number, number][]): boolean {
  const norm = (ps: [number, number][]) => {
    const cx = ps.reduce((s, p) => s + p[0], 0) / ps.length;
    const cy = ps.reduce((s, p) => s + p[1], 0) / ps.length;
    return ps.map(([x, y]) => `${(x - cx).toFixed(4)},${(y - cy).toFixed(4)}`.replace(/-0\.0000/g, '0.0000')).sort().join('|');
  };
  return norm(a) === norm(b);
}

describe('Exclusie', () => {
  it('heeft minstens 8 regels per niveau', () => {
    for (const level of LEVELS) expect(RULES[level].length).toBeGreaterThanOrEqual(8);
  });

  it('oddOneOut vindt precies één afwijker', () => {
    expect(oddOneOut(['a', 'a', 'b', 'a', 'a'])).toBe(2);
    expect(oddOneOut(['a', 'a', 'b', 'b', 'a'])).toBe(-1);
    expect(oddOneOut(['a', 'a', 'a', 'a', 'a'])).toBe(-1);
  });

  it('de gespiegelde-figuren zijn echt niet symmetrisch (gespiegeld ≠ gedraaid)', () => {
    for (const base of Object.keys(FLAG_BASES) as FlagBase[]) {
      const mirrored = flagPoints(base, 0, true);
      for (let rot = 0; rot < 360; rot += 45) {
        expect(sameShape(flagPoints(base, rot, false), mirrored)).toBe(false);
        if (rot > 0) expect(sameShape(flagPoints(base, rot, false), flagPoints(base, 0, false))).toBe(false);
      }
    }
  });

  for (const level of LEVELS) {
    it(`elke regel levert geldige opgaven (${level})`, () => {
      const r = makeRng(31);
      for (const rule of RULES[level]) for (let i = 0; i < 40; i++) expect(generateExclusie(level, r, rule.id).rule.id).toBe(rule.id);
    });

    it(`${N_PER_LEVEL} opgaven: precies 1 afwijker en geen andere eigenschap wijst iets anders aan (${level})`, () => {
      const r = makeRng(4242 + level.length);
      const seen = new Set<string>();
      for (let i = 0; i < N_PER_LEVEL; i++) {
        const it = generateExclusie(level, r);
        seen.add(it.rule.id);
        expect(checkExclusie(it.rule, it.figs, it.odd)).toEqual([]);
        // onafhankelijk: de regel zelf geeft 4 dezelfde en 1 andere waarde, en de andere is de afwijker
        const vals = ALL_FEATURES[it.rule.feature](it.figs);
        const oddVal = vals[it.odd];
        expect(vals.filter((v) => v === oddVal).length).toBe(1);
        expect(new Set(vals.filter((_, j) => j !== it.odd)).size).toBe(1);
        // geen enkele eigenschap wijst een andere figuur aan
        for (const fn of Object.values(ALL_FEATURES)) {
          const j = oddOneOut(fn(it.figs));
          expect(j === -1 || j === it.odd).toBe(true);
        }
        const q = exclusieToQuestion(it, level);
        expect(q.options.length).toBe(5);
        expect(q.correct).toEqual([it.odd]);
        expect(q.explanationHtml.length).toBeGreaterThan(20);
        for (const o of q.options) {
          expect(o.html.startsWith('<svg')).toBe(true);
          expect(o.html).toContain('aria-label=');
          expect(o.label.length).toBeGreaterThan(3);
        }
      }
      expect(seen.size).toBe(RULES[level].length);
    });
  }
});
