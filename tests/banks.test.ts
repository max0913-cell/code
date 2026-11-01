import { makeRng } from '../src/core/rng';
import { LEVELS } from '../src/core/types';
import { ANALOGIE_BANK, RELATIE_BANK, analogieQuestion, makeAnalogie, makeRelatie, relatieQuestion } from '../src/subtests/banks';

const norm = (w: string) => w.trim().toLowerCase();

describe('Vragenbank woordanalogieën', () => {
  for (const level of LEVELS) {
    const bank = ANALOGIE_BANK[level];
    it(`heeft minstens 100 vragen (${level})`, () => expect(bank.length).toBeGreaterThanOrEqual(100));
    it(`elke vraag is geldig (${level})`, () => {
      const errors: string[] = [];
      bank.forEach(([a, b, c, ans, dis, uitleg], i) => {
        const id = `${level} #${i + 1} (${a} – ${b} = ${c} – ${ans})`;
        const opts = [ans, ...dis].map(norm);
        if (dis.length !== 4) errors.push(`${id}: niet 4 afleiders`);
        if (new Set(opts).size !== 5) errors.push(`${id}: opties niet uniek`);
        if ([a, b, c, ans, ...dis].some((w) => !w || w !== w.trim())) errors.push(`${id}: leeg woord of spaties`);
        if (opts.includes(norm(c))) errors.push(`${id}: het derde woord staat tussen de opties`);
        if (!uitleg || uitleg.length < 20) errors.push(`${id}: geen uitleg`);
        if (!norm(uitleg).includes(norm(ans))) errors.push(`${id}: uitleg noemt het antwoord niet`);
      });
      expect(errors).toEqual([]);
    });
  }
  it('heeft geen dubbele vragen (ook niet tussen niveaus)', () => {
    const keys = LEVELS.flatMap((l) => ANALOGIE_BANK[l].map(([a, b, c]) => `${norm(a)}|${norm(b)}|${norm(c)}`));
    const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
    expect(dup).toEqual([]);
  });
  it('maakt vragen met precies 1 goed antwoord en 5 opties', () => {
    const r = makeRng(3);
    for (const level of LEVELS)
      ANALOGIE_BANK[level].forEach((item, i) => {
        const q = analogieQuestion(level, i, r);
        expect(q.options.length).toBe(5);
        expect(q.correct.length).toBe(1);
        expect(q.options[q.correct[0]].label).toBe(item[3]);
      });
  });
  it('herhaalt geen vragen binnen een ronde', () => {
    const r = makeRng(4);
    for (const level of LEVELS) {
      const used = new Set<string>();
      for (let i = 0; i < ANALOGIE_BANK[level].length; i++) {
        const q = makeAnalogie(level, r, used);
        expect(used.has(q.key)).toBe(false);
        used.add(q.key);
      }
    }
  });
});

describe('Vragenbank woordrelaties', () => {
  // Alle paren die ergens als synoniem of tegenstelling gelden.
  const allPairs = new Set(LEVELS.flatMap((l) => RELATIE_BANK[l].map(([a, b]) => [norm(a), norm(b)].sort().join('|'))));
  for (const level of LEVELS) {
    const bank = RELATIE_BANK[level];
    it(`heeft minstens 60 vragen (${level})`, () => expect(bank.length).toBeGreaterThanOrEqual(60));
    it(`elke vraag is geldig en heeft maar 1 paar (${level})`, () => {
      const errors: string[] = [];
      bank.forEach(([a, b, soort, fillers, uitleg], i) => {
        const id = `${level} #${i + 1} (${a}/${b})`;
        const words = [a, b, ...fillers].map(norm);
        if (fillers.length !== 3) errors.push(`${id}: niet 3 andere woorden`);
        if (new Set(words).size !== 5) errors.push(`${id}: woorden niet uniek`);
        if (soort !== 'syn' && soort !== 'ant') errors.push(`${id}: onbekende soort`);
        if (!uitleg || !norm(uitleg).includes(norm(a)) || !norm(uitleg).includes(norm(b))) errors.push(`${id}: uitleg noemt het paar niet`);
        // geen ander tweetal in deze set mag elders als paar voorkomen
        for (let x = 0; x < 5; x++)
          for (let y = x + 1; y < 5; y++) {
            if (x === 0 && y === 1) continue;
            const key = [words[x], words[y]].sort().join('|');
            if (allPairs.has(key)) errors.push(`${id}: ook ${words[x]}/${words[y]} is een paar`);
          }
      });
      expect(errors).toEqual([]);
    });
  }
  it('heeft geen dubbele paren', () => {
    const keys = LEVELS.flatMap((l) => RELATIE_BANK[l].map(([a, b]) => [norm(a), norm(b)].sort().join('|')));
    expect(keys.filter((k, i) => keys.indexOf(k) !== i)).toEqual([]);
  });
  it('maakt vragen met precies 2 goede antwoorden', () => {
    const r = makeRng(5);
    for (const level of LEVELS)
      RELATIE_BANK[level].forEach((item, i) => {
        const q = relatieQuestion(level, i, r);
        expect(q.options.length).toBe(5);
        expect(q.correct.length).toBe(2);
        expect(q.correct.map((c) => q.options[c].label).sort()).toEqual([item[0], item[1]].sort());
      });
  });
  it('herhaalt geen vragen binnen een ronde', () => {
    const r = makeRng(6);
    for (const level of LEVELS) {
      const used = new Set<string>();
      for (let i = 0; i < RELATIE_BANK[level].length; i++) {
        const q = makeRelatie(level, r, used);
        expect(used.has(q.key)).toBe(false);
        used.add(q.key);
      }
    }
  });
});
