import { makeRng } from '../src/core/rng';
import { LEVELS } from '../src/core/types';
import { cellsToShape } from '../src/core/trigrid';
import { checkSpiegel, generateSpiegel, isAsymmetric, variantPoints } from '../src/subtests/spiegel/generator';
import { spiegelToQuestion } from '../src/subtests/spiegel/render';

const N_PER_LEVEL = 3000;

describe('Spiegelbeelden', () => {
  it('herkent symmetrische figuren', () => {
    const T = cellsToShape([[0, 0], [1, 0], [2, 0], [1, 1]]); // T: spiegelsymmetrisch
    const S = cellsToShape([[1, 0], [2, 0], [0, 1], [1, 1]]); // S: draaisymmetrisch (180°)
    const L = cellsToShape([[0, 0], [0, 1], [0, 2], [1, 2]]); // L: geen symmetrie
    expect(isAsymmetric({ tris: T, dots: [] })).toBe(false);
    expect(isAsymmetric({ tris: S, dots: [] })).toBe(false);
    expect(isAsymmetric({ tris: L, dots: [] })).toBe(true);
    // een stip kan een symmetrische figuur asymmetrisch maken
    const sq = cellsToShape([[0, 0], [1, 0], [0, 1], [1, 1], [2, 0]]);
    expect(isAsymmetric({ tris: sq, dots: [[0, 1]] })).toBe(true);
  });

  for (const level of LEVELS) {
    it(`${N_PER_LEVEL} opgaven: asymmetrische figuur, 6 verschillende varianten, precies 2 gespiegeld (${level})`, () => {
      const r = makeRng(9090 + level.length);
      for (let i = 0; i < N_PER_LEVEL; i++) {
        const it = generateSpiegel(level, r);
        expect(checkSpiegel(it)).toEqual([]);
        expect(isAsymmetric(it.fig)).toBe(true);
        const keys = it.variants.map((v) => variantPoints(it.fig, v).join('|'));
        expect(new Set(keys).size).toBe(6);
        expect(it.variants.filter((v) => v.mirrored).length).toBe(2);
        // gespiegelde varianten zijn met geen enkele draaiing van het origineel te maken
        const rotations = [0, 45, 90, 135, 180, 225, 270, 315].map((rot) => variantPoints(it.fig, { mirrored: false, rot }).join('|'));
        it.variants.forEach((v, j) => expect(rotations.includes(keys[j])).toBe(!v.mirrored));
        if (level === 'makkelijk') expect(it.variants.every((v) => v.rot % 90 === 0)).toBe(true);
        const q = spiegelToQuestion(it);
        expect(q.options.length).toBe(6);
        expect(q.correct).toEqual(it.correct);
      }
    });
  }
});
