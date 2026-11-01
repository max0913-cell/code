import { makeRng } from '../src/core/rng';
import { LEVELS } from '../src/core/types';
import { area, canon, cellsToShape, congruent, connected, enc, hasHole, mirror, normalize, rot90, rotate, validCells } from '../src/core/trigrid';
import { canTile, solve } from '../src/subtests/componenten/solver';
import { checkComponenten, generateComponenten } from '../src/subtests/componenten/generator';
import { compToQuestion } from '../src/subtests/componenten/render';

const N_PER_LEVEL = 2000;

describe('Driehoekjesrooster', () => {
  it('vier keer draaien geeft dezelfde vorm terug', () => {
    const L = cellsToShape([[0, 0], [0, 1], [0, 2], [1, 2]]);
    expect(rotate(L, 4)).toEqual(normalize(L));
    expect(rot90(rot90(rot90(rot90(L))))).toEqual(normalize(L));
    expect(mirror(mirror(L))).toEqual(normalize(L));
  });
  it('herkent gelijke vormen en spiegelbeelden', () => {
    const L = cellsToShape([[0, 0], [0, 1], [0, 2], [1, 2]]);
    const J = cellsToShape([[1, 0], [1, 1], [1, 2], [0, 2]]);
    expect(congruent(L, J)).toBe(true); // gelijk mét spiegelen
    expect(canon(L)).toBe(canon(mirror(L)));
  });
  it('herkent gaten', () => {
    const ring = cellsToShape([[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]]);
    expect(hasHole(ring)).toBe(true);
    expect(hasHole(cellsToShape([[0, 0], [1, 0]]))).toBe(false);
  });
  it('accepteert alleen hele en halve hokjes', () => {
    expect(validCells([enc(0, 0, 0), enc(0, 0, 1)])).toBe(true);
    expect(validCells([enc(0, 0, 0), enc(0, 0, 2)])).toBe(false);
  });
});

describe('Solver', () => {
  it('legt een 2×2 vierkant met twee balkjes', () => {
    const sq = cellsToShape([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const bar = cellsToShape([[0, 0], [1, 0]]);
    expect(canTile(sq, [bar, bar], false)).toBe(true);
    expect(canTile(sq, [bar], false)).toBe(false);
  });
  it('gebruikt halve hokjes: een vierkant uit twee driehoeken', () => {
    const sq = cellsToShape([[0, 0]]);
    const t1 = [enc(0, 0, 0), enc(0, 0, 1)];
    expect(canTile(sq, [t1, t1], false)).toBe(true);
  });
  it('maakt verschil tussen spiegelen en niet spiegelen', () => {
    // een rechthoek van 3 × 2 uit twee L-stukken; de plaatsing dekt precies de doelvorm
    const L3 = cellsToShape([[0, 0], [0, 1], [1, 1]]);
    const target = cellsToShape([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]);
    expect(canTile(target, [L3, L3], false)).toBe(true);
    const placement = solve(target, [L3, L3], false)!;
    expect(placement.flat().sort((a, b) => a - b)).toEqual(normalize(target));
  });
});

describe('Componenten', () => {
  for (const level of LEVELS) {
    it(`${N_PER_LEVEL} opgaven: precies 2 van de 6 te maken, met én zonder spiegelen (${level})`, () => {
      const r = makeRng(808 + level.length);
      const pieceCounts = new Set<number>();
      for (let i = 0; i < N_PER_LEVEL; i++) {
        const it = generateComponenten(level, r);
        pieceCounts.add(it.pieces.length);
        expect(checkComponenten(it)).toEqual([]);
        // onafhankelijk opnieuw tellen
        const plain = it.options.map((o) => canTile(o, it.pieces, false));
        const mir = it.options.map((o) => canTile(o, it.pieces, true));
        expect(plain).toEqual(mir);
        expect(plain.filter(Boolean).length).toBe(2);
        expect(it.correct).toEqual(plain.map((v, j) => (v ? j : -1)).filter((j) => j >= 0));
        for (const o of it.options) {
          expect(connected(o) && validCells(o) && !hasHole(o)).toBe(true);
        }
        // afleiders hebben op examen- en moeilijk niveau dezelfde oppervlakte
        const total = it.pieces.reduce((s, p) => s + area(p), 0);
        if (level !== 'makkelijk') for (const o of it.options) expect(area(o)).toBe(total);
        const q = compToQuestion(it);
        expect(q.options.length).toBe(6);
        expect(q.correct.length).toBe(2);
        expect(q.explanationHtml).toContain('solution');
      }
      if (level === 'makkelijk') expect([...pieceCounts]).toEqual([2]);
      if (level === 'examen') expect([...pieceCounts].every((k) => k >= 2 && k <= 3)).toBe(true);
      if (level === 'moeilijk') expect([...pieceCounts].every((k) => k >= 3 && k <= 4)).toBe(true);
    });
  }
});
