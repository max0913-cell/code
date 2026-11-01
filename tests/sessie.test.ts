import { LEVELS } from '../src/core/types';
import { SUBTESTS } from '../src/subtests/registry';
import { buildQuestions } from '../src/ui/session';

describe('Ronde-opbouw', () => {
  it('er zijn 4 hoofdsubtests en 3 extra subtests', () => {
    expect(SUBTESTS.filter((s) => !s.extra).map((s) => s.id)).toEqual(['analogieen', 'rekenen', 'exclusie', 'componenten']);
    expect(SUBTESTS.filter((s) => s.extra).map((s) => s.id).sort()).toEqual(['reeksen', 'spiegel', 'woordrelaties']);
  });

  for (const st of SUBTESTS) {
    it(`geen herhaling binnen een ronde van 40 vragen: ${st.name}`, () => {
      for (const level of LEVELS) {
        for (let seed = 1; seed <= 5; seed++) {
          const qs = buildQuestions({ subtest: st.id, level, count: 40, seconds: null }, seed * 97);
          expect(qs.length).toBe(40);
          expect(new Set(qs.map((q) => q.key)).size).toBe(40);
          for (const q of qs) {
            expect(q.subtest).toBe(st.id);
            expect(q.level).toBe(level);
            expect(q.correct.length).toBe(st.select);
            expect(q.options.length).toBe(st.select === 2 && st.id !== 'woordrelaties' ? 6 : 5);
            expect(q.explanationHtml.length).toBeGreaterThan(10);
          }
        }
      }
    });
  }
});
