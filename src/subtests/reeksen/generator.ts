import { F, Frac } from '../../core/fraction';
import type { Rng } from '../../core/rng';
import type { Level, Question } from '../../core/types';

export interface ReeksItem {
  type: string;
  /** Getoonde getallen. */
  terms: number[];
  answer: number;
  options: number[];
  explanation: string;
}

interface Built {
  /** Volledige reeks: getoonde termen + het antwoord als laatste. */
  seq: number[];
  explain: (shown: number[], answer: number) => string;
  /** Typische denkfouten als afleiders. */
  traps?: number[];
}
type Maker = (r: Rng) => Built | null;

export const fmtNum = (n: number): string => (n < 0 ? `−${-n}` : String(n));
const list = (xs: number[]): string => xs.map(fmtNum).join(', ');
const signed = (n: number): string => (n < 0 ? `− ${-n}` : `+ ${n}`);
const diffs = (xs: number[]): number[] => xs.slice(1).map((x, i) => x - xs[i]);
const range = (n: number, f: (i: number) => number): number[] => Array.from({ length: n }, (_, i) => f(i));
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61];

// ---------- regeltypes ----------
const makkelijk: Record<string, Maker> = {
  erbij: (r) => {
    const a = r.int(1, 40);
    const d = r.int(2, 9);
    return { seq: range(6, (i) => a + i * d), explain: (s, A) => `Er komt steeds ${d} bij: ${s[s.length - 1]} + ${d} = ${A}.` };
  },
  eraf: (r) => {
    const a = r.int(60, 99);
    const d = r.int(3, 9);
    return { seq: range(6, (i) => a - i * d), explain: (s, A) => `Er gaat steeds ${d} af: ${s[s.length - 1]} − ${d} = ${A}.` };
  },
  verdubbelen: (r) => {
    const a = r.int(1, 7);
    return { seq: range(6, (i) => a * 2 ** i), explain: (s, A) => `Elk getal is het dubbele van het vorige: ${s[s.length - 1]} × 2 = ${A}.` };
  },
  keer_drie: (r) => {
    const a = r.int(1, 3);
    return { seq: range(6, (i) => a * 3 ** i), explain: (s, A) => `Elk getal is 3 keer het vorige: ${s[s.length - 1]} × 3 = ${A}.` };
  },
  halveren: (r) => {
    const k = r.int(1, 9);
    return { seq: range(6, (i) => k * 2 ** (5 - i)), explain: (s, A) => `Elk getal is de helft van het vorige: ${s[s.length - 1]} : 2 = ${A}.` };
  },
  kwadraten: (r) => {
    const n0 = r.int(1, 6);
    return {
      seq: range(6, (i) => (n0 + i) ** 2),
      explain: (_s, A) => `Dit zijn kwadraten: ${n0} × ${n0}, ${n0 + 1} × ${n0 + 1}, enzovoort. Het volgende is ${n0 + 5} × ${n0 + 5} = ${A}.`,
    };
  },
  verschil_plus_een: (r) => {
    const a = r.int(1, 20);
    const d0 = r.int(1, 3);
    const seq = [a];
    for (let i = 0; i < 5; i++) seq.push(seq[i] + d0 + i);
    return {
      seq,
      explain: (s, A) => `De verschillen zijn ${list(diffs(s))}: elke keer 1 meer. Het volgende verschil is ${A - s[s.length - 1]}: ${s[s.length - 1]} + ${A - s[s.length - 1]} = ${A}.`,
    };
  },
  om_en_om: (r) => {
    const a = r.int(1, 20);
    const p = r.int(3, 9);
    const q = r.int(1, p - 1);
    const seq = [a];
    for (let i = 0; i < 5; i++) seq.push(seq[i] + (i % 2 === 0 ? p : -q));
    return {
      seq,
      explain: (s, A) => `Om en om komt er ${p} bij en gaat er ${q} af. Nu is +${p} aan de beurt: ${s[s.length - 1]} + ${p} = ${A}.`,
      traps: [seq[4] - q],
    };
  },
};

const examen: Record<string, Maker> = {
  verschil_groeit: (r) => {
    const a = r.int(1, 20);
    const d0 = r.int(1, 6);
    const c = r.int(2, 4);
    const seq = [a];
    for (let i = 0; i < 6; i++) seq.push(seq[i] + d0 + i * c);
    return {
      seq,
      explain: (s, A) => `De verschillen zijn ${list(diffs(s))}: elke keer ${c} meer. Het volgende verschil is ${A - s[s.length - 1]}: ${s[s.length - 1]} + ${A - s[s.length - 1]} = ${A}.`,
    };
  },
  twee_reeksen: (r) => {
    const a = r.int(1, 20);
    const d1 = r.int(2, 6);
    const b = r.int(35, 70);
    const d2 = r.int(2, 6);
    const n = r.pick([7, 8]);
    const seq = range(n, (i) => (i % 2 === 0 ? a + (i / 2) * d1 : b - ((i - 1) / 2) * d2));
    const answerOdd = (n - 1) % 2 === 1;
    return {
      seq,
      explain: (s, A) => {
        const ev = s.filter((_, i) => i % 2 === 0);
        const od = s.filter((_, i) => i % 2 === 1);
        return `Er lopen twee reeksen door elkaar. Op de oneven plaatsen: ${list(ev)} (steeds +${d1}). Op de even plaatsen: ${list(od)} (steeds −${d2}). Het volgende getal hoort bij de ${answerOdd ? 'tweede' : 'eerste'} reeks: ${answerOdd ? `${od[od.length - 1]} − ${d2}` : `${ev[ev.length - 1]} + ${d1}`} = ${A}.`;
      },
      traps: [answerOdd ? seq[n - 2] + d1 : seq[n - 2] - d2, seq[n - 2] - d2],
    };
  },
  dubbel_plus: (r) => {
    const a = r.int(1, 6);
    const c = r.pick([1, -1, 2, 3]);
    if (a === 1 && c === -1) return null;
    const seq = [a];
    for (let i = 0; i < 6; i++) seq.push(seq[i] * 2 + c);
    return {
      seq,
      explain: (s, A) => `Elk getal is het vorige × 2 ${signed(c)}: ${s[s.length - 1]} × 2 ${signed(c)} = ${A}.`,
      traps: [seq[5] * 2],
    };
  },
  fibonacci: (r) => {
    const a = r.int(1, 6);
    const b = r.int(1, 8);
    const seq = [a, b];
    for (let i = 2; i < 7; i++) seq.push(seq[i - 1] + seq[i - 2]);
    return { seq, explain: (s, A) => `Elk getal is de som van de twee getallen ervoor: ${s[s.length - 2]} + ${s[s.length - 1]} = ${A}.` };
  },
  keer_en_plus: (r) => {
    const a = r.int(1, 6);
    const k = r.pick([2, 3]);
    const c = r.pick([1, 2, 3, 4, 5, -1, -2]);
    const mulFirst = r.chance(0.5);
    const seq = [a];
    for (let i = 0; i < 6; i++) seq.push((i % 2 === 0) === mulFirst ? seq[i] * k : seq[i] + c);
    if (seq.some((x) => x <= 0)) return null;
    const nextMul = (6 % 2 === 0) === mulFirst;
    return {
      seq,
      explain: (s, A) => `Om en om × ${k} en ${signed(c)}. Nu is ${nextMul ? `× ${k}` : signed(c)} aan de beurt: ${s[s.length - 1]} ${nextMul ? `× ${k}` : signed(c)} = ${A}.`,
      traps: [nextMul ? seq[5] + c : seq[5] * k],
    };
  },
  kwadraat_plus: (r) => {
    if (r.chance(0.3)) {
      const n0 = r.int(1, 3);
      return { seq: range(6, (i) => (n0 + i) ** 3), explain: (_s, A) => `Dit zijn derdemachten: ${n0}³ = ${n0 ** 3}, ${n0 + 1}³ = ${(n0 + 1) ** 3}, enzovoort. Het volgende is ${n0 + 5}³ = ${A}.` };
    }
    const n0 = r.int(1, 5);
    const c = r.pick([1, 2, 3, 4, 5, -1, -2]);
    return {
      seq: range(6, (i) => (n0 + i) ** 2 + c),
      explain: (_s, A) => `Elk getal is een kwadraat ${signed(c)}: ${n0}² ${signed(c)}, ${n0 + 1}² ${signed(c)}, enzovoort. Het volgende is ${n0 + 5}² ${signed(c)} = ${(n0 + 5) ** 2} ${signed(c)} = ${A}.`,
      traps: [(n0 + 5) ** 2],
    };
  },
  verschil_verdubbelt: (r) => {
    const a = r.int(1, 20);
    const d0 = r.int(1, 3);
    const seq = [a];
    for (let i = 0; i < 6; i++) seq.push(seq[i] + d0 * 2 ** i);
    return {
      seq,
      explain: (s, A) => `De verschillen zijn ${list(diffs(s))}: ze verdubbelen steeds. Het volgende verschil is ${A - s[s.length - 1]}: ${s[s.length - 1]} + ${A - s[s.length - 1]} = ${A}.`,
    };
  },
  tekenwissel: (r) => {
    const a = r.int(1, 5);
    const k = r.pick([-2, -3]);
    const n = k === -3 ? 6 : 7;
    return {
      seq: range(n, (i) => a * k ** i),
      explain: (s, A) => `Elk getal is het vorige × ${fmtNum(k)}: het teken wisselt steeds. ${fmtNum(s[s.length - 1])} × ${fmtNum(k)} = ${fmtNum(A)}.`,
    };
  },
  n_keer_n_plus_1: (r) => {
    const n0 = r.int(1, 5);
    return {
      seq: range(6, (i) => (n0 + i) * (n0 + i + 1)),
      explain: (_s, A) => `${n0} × ${n0 + 1}, ${n0 + 1} × ${n0 + 2}, ${n0 + 2} × ${n0 + 3}, ... Het volgende is ${n0 + 5} × ${n0 + 6} = ${A}. Je kunt ook zien dat de verschillen steeds 2 groter worden.`,
    };
  },
  priemgetallen: (r) => {
    const s0 = r.int(0, 6);
    return {
      seq: PRIMES.slice(s0, s0 + 7),
      explain: (s, A) => `Dit zijn priemgetallen (alleen deelbaar door 1 en zichzelf). Het eerstvolgende priemgetal na ${s[s.length - 1]} is ${A}.`,
    };
  },
};

const moeilijk: Record<string, Maker> = {
  verschil_keer_drie: (r) => {
    const a = r.int(1, 20);
    const d0 = r.int(1, 2);
    const seq = [a];
    for (let i = 0; i < 6; i++) seq.push(seq[i] + d0 * 3 ** i);
    return {
      seq,
      explain: (s, A) => `De verschillen zijn ${list(diffs(s))}: elke keer × 3. Het volgende verschil is ${A - s[s.length - 1]}: ${s[s.length - 1]} + ${A - s[s.length - 1]} = ${A}.`,
    };
  },
  derde_orde: (r) => {
    const a = r.int(1, 10);
    let d = r.int(1, 5);
    let e = r.int(1, 4);
    const f = r.int(1, 3);
    const seq = [a];
    for (let i = 0; i < 6; i++) {
      seq.push(seq[i] + d);
      d += e;
      e += f;
    }
    return {
      seq,
      explain: (s, A) => {
        const d1 = diffs([...s, A]);
        const d2 = diffs(d1);
        return `De verschillen zijn ${list(diffs(s))}. De verschillen daartussen zijn ${list(d2.slice(0, -1))}: die worden steeds ${f} groter. Dus het volgende verschil is ${d1[d1.length - 1]} en ${s[s.length - 1]} + ${d1[d1.length - 1]} = ${A}.`;
      },
    };
  },
  twee_reeksen_gemengd: (r) => {
    const a = r.int(1, 5);
    const b = r.int(20, 60);
    const st = r.pick([3, 4, 5, 6, 7, -3, -4, -5]);
    const n = r.pick([7, 8]);
    const seq = range(n, (i) => (i % 2 === 0 ? a * 2 ** (i / 2) : b + ((i - 1) / 2) * st));
    if (seq.some((x) => x <= 0)) return null;
    const answerOdd = (n - 1) % 2 === 1;
    return {
      seq,
      explain: (s, A) => {
        const ev = s.filter((_, i) => i % 2 === 0);
        const od = s.filter((_, i) => i % 2 === 1);
        return `Twee reeksen door elkaar. Oneven plaatsen: ${list(ev)} (steeds × 2). Even plaatsen: ${list(od)} (steeds ${signed(st)}). Het volgende getal hoort bij de ${answerOdd ? 'tweede' : 'eerste'} reeks: ${answerOdd ? `${od[od.length - 1]} ${signed(st)}` : `${ev[ev.length - 1]} × 2`} = ${A}.`;
      },
      traps: [answerOdd ? seq[n - 2] * 2 : seq[n - 2] + st],
    };
  },
  factor_stijgt: (r) => {
    const a = r.int(1, 4);
    const m0 = r.pick([1, 2]);
    const seq = [a];
    for (let i = 0; i < 5; i++) seq.push(seq[i] * (m0 + i));
    return {
      seq,
      explain: (s, A) => `Je vermenigvuldigt steeds met een getal dat 1 groter wordt: × ${m0}, × ${m0 + 1}, × ${m0 + 2}, ... Nu: ${s[s.length - 1]} × ${m0 + 4} = ${A}.`,
      traps: [seq[4] * (m0 + 3)],
    };
  },
  tribonacci: (r) => {
    const seq = [r.int(1, 4), r.int(1, 4), r.int(1, 5)];
    for (let i = 3; i < 7; i++) seq.push(seq[i - 1] + seq[i - 2] + seq[i - 3]);
    return {
      seq,
      explain: (s, A) => `Elk getal is de som van de drie getallen ervoor: ${s[s.length - 3]} + ${s[s.length - 2]} + ${s[s.length - 1]} = ${A}.`,
      traps: [seq[5] + seq[4]],
    };
  },
  verschillen_priem: (r) => {
    const a = r.int(1, 20);
    const p0 = r.int(0, 3);
    const seq = [a];
    for (let i = 0; i < 6; i++) seq.push(seq[i] + PRIMES[p0 + i]);
    return {
      seq,
      explain: (s, A) => `De verschillen zijn ${list(diffs(s))}: de priemgetallen op volgorde. Het volgende priemgetal is ${A - s[s.length - 1]}: ${s[s.length - 1]} + ${A - s[s.length - 1]} = ${A}.`,
    };
  },
  dubbel_plus_oplopend: (r) => {
    const a = r.int(1, 5);
    const seq = [a];
    for (let i = 0; i < 6; i++) seq.push(seq[i] * 2 + (i + 1));
    return {
      seq,
      explain: (s, A) => `Steeds × 2 en dan + 1, + 2, + 3, enzovoort. Nu: ${s[s.length - 1]} × 2 + 6 = ${A}.`,
      traps: [seq[5] * 2 + 5, seq[5] * 2],
    };
  },
  kwadraten_teken: (r) => {
    const n0 = r.int(1, 4);
    const s0 = r.pick([1, -1]);
    const seq = range(7, (i) => s0 * (i % 2 === 0 ? 1 : -1) * (n0 + i) ** 2);
    return {
      seq,
      explain: (_s, A) => `Kwadraten (${n0}², ${n0 + 1}², ${n0 + 2}², ...) waarbij het teken steeds wisselt. Het volgende is ${A < 0 ? '−' : ''}${n0 + 6}² = ${fmtNum(A)}.`,
      traps: [-seq[6]],
    };
  },
  halveren_en_erbij: (r) => {
    const c = r.pick([2, 4, 6, 8, 10, 12]);
    let x = 2 * r.int(15, 60);
    const seq = [x];
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        if (x % 2 !== 0) return null;
        x = x / 2;
      } else x += c;
      seq.push(x);
    }
    return {
      seq,
      explain: (s, A) => `Om en om : 2 en + ${c}. Nu is : 2 aan de beurt: ${s[s.length - 1]} : 2 = ${A}.`,
      traps: [seq[5] + c],
    };
  },
};

export const REEKS_TYPES: Record<Level, Record<string, Maker>> = { makkelijk, examen, moeilijk };

// ---------- andere regels die een reeks zou kunnen volgen (ambiguïteitscheck) ----------
const isInt = (f: Frac): boolean => f.isInt();
const toNum = (f: Frac): number => Number(f.n);
const allEq = (xs: Frac[]): boolean => xs.every((x) => x.eq(xs[0]));

function fitArith(t: number[]): number | null {
  if (t.length < 3) return null;
  const d = diffs(t);
  return d.every((x) => x === d[0]) ? t[t.length - 1] + d[0] : null;
}
function fitGeom(t: number[]): number | null {
  if (t.length < 3 || t[0] === 0) return null;
  const r = F(t[1], t[0]);
  for (let i = 1; i < t.length; i++) if (!F(t[i - 1]).mul(r).eq(F(t[i]))) return null;
  const next = F(t[t.length - 1]).mul(r);
  return isInt(next) ? toNum(next) : null;
}
function fitPoly(t: number[], order: number): number | null {
  let rows = [t];
  for (let k = 0; k < order; k++) rows.push(diffs(rows[rows.length - 1]));
  const top = rows[rows.length - 1];
  if (top.length < 2 || !top.every((x) => x === top[0])) return null;
  // extrapoleer: tel de laatste waarden van elke rij op
  return rows.reduce((s, row) => s + row[row.length - 1], 0);
}
function fitAffine(t: number[]): number | null {
  if (t.length < 4 || t[1] === t[0]) return null;
  const p = F(t[2] - t[1], t[1] - t[0]);
  const q = F(t[1]).sub(p.mul(F(t[0])));
  for (let i = 1; i < t.length; i++) if (!p.mul(F(t[i - 1])).add(q).eq(F(t[i]))) return null;
  const next = p.mul(F(t[t.length - 1])).add(q);
  return isInt(next) ? toNum(next) : null;
}
function fitRec2(t: number[]): number | null {
  if (t.length < 5) return null;
  const det = t[1] * t[1] - t[0] * t[2];
  if (det === 0) return null;
  // t2 = α t1 + β t0 ; t3 = α t2 + β t1
  const alpha = F(t[2] * t[1] - t[3] * t[0], det);
  const beta = F(t[3] * t[1] - t[2] * t[2], det);
  for (let i = 2; i < t.length; i++) if (!alpha.mul(F(t[i - 1])).add(beta.mul(F(t[i - 2]))).eq(F(t[i]))) return null;
  const next = alpha.mul(F(t[t.length - 1])).add(beta.mul(F(t[t.length - 2])));
  return isInt(next) ? toNum(next) : null;
}
function fitTrib(t: number[]): number | null {
  if (t.length < 5) return null;
  for (let i = 3; i < t.length; i++) if (t[i] !== t[i - 1] + t[i - 2] + t[i - 3]) return null;
  return t[t.length - 1] + t[t.length - 2] + t[t.length - 3];
}
function fitInterleave(t: number[]): number[] {
  if (t.length < 6) return [];
  const ev = t.filter((_, i) => i % 2 === 0);
  const od = t.filter((_, i) => i % 2 === 1);
  const sub = t.length % 2 === 0 ? ev : od;
  return [fitArith(sub), fitGeom(sub), fitPoly(sub, 2)].filter((x): x is number => x !== null).filter(() => {
    const other = t.length % 2 === 0 ? od : ev;
    return fitArith(other) !== null || fitGeom(other) !== null || (other.length >= 4 && fitPoly(other, 2) !== null);
  });
}
function fitAltOps(t: number[]): number[] {
  if (t.length < 5) return [];
  const out: number[] = [];
  const parity = (t.length - 1) % 2;
  const pairs = (par: number) => t.slice(0, -1).map((x, i) => [x, t[i + 1], i] as const).filter(([, , i]) => i % 2 === par);
  const ops = (par: number) => {
    const ps = pairs(par);
    if (ps.length < 2) return { add: null as number | null, mul: null as Frac | null };
    const add = ps.every(([a, b]) => b - a === ps[0][1] - ps[0][0]) ? ps[0][1] - ps[0][0] : null;
    let mul: Frac | null = null;
    if (ps.every(([a]) => a !== 0)) {
      const k = F(ps[0][1], ps[0][0]);
      if (ps.every(([a, b]) => F(a).mul(k).eq(F(b)))) mul = k;
    }
    return { add, mul };
  };
  const mine = ops(parity);
  const other = ops(1 - parity);
  if (other.add === null && other.mul === null) return [];
  const last = t[t.length - 1];
  if (mine.add !== null) out.push(last + mine.add);
  if (mine.mul !== null) {
    const v = F(last).mul(mine.mul);
    if (isInt(v)) out.push(toNum(v));
  }
  return out;
}
function fitDiffGeom(t: number[]): number | null {
  if (t.length < 5) return null;
  const nd = fitGeom(diffs(t));
  return nd === null ? null : t[t.length - 1] + nd;
}
function fitDiffAffine(t: number[]): number | null {
  if (t.length < 6) return null;
  const nd = fitAffine(diffs(t));
  return nd === null ? null : t[t.length - 1] + nd;
}
function fitRatioArith(t: number[]): number | null {
  if (t.length < 5 || t.some((x) => x === 0)) return null;
  const rs = t.slice(1).map((x, i) => F(x, t[i]));
  const ds = rs.slice(1).map((x, i) => x.sub(rs[i]));
  if (!allEq(ds)) return null;
  const next = F(t[t.length - 1]).mul(rs[rs.length - 1].add(ds[0]));
  return isInt(next) ? toNum(next) : null;
}
function fitFib(t: number[]): number | null {
  if (t.length < 4) return null;
  for (let i = 2; i < t.length; i++) if (t[i] !== t[i - 1] + t[i - 2]) return null;
  return t[t.length - 1] + t[t.length - 2];
}

/** Alle voorspellingen van alle "redelijke" regels die op de getoonde getallen passen. */
export function alternativePredictions(t: number[]): number[] {
  const single = [fitArith(t), fitGeom(t), fitPoly(t, 2), fitPoly(t, 3), fitAffine(t), fitRec2(t), fitTrib(t), fitFib(t), fitDiffGeom(t), fitDiffAffine(t), fitRatioArith(t)];
  return [...single.filter((x): x is number => x !== null), ...fitInterleave(t), ...fitAltOps(t)];
}

// ---------- opties en controle ----------
const MAX_ABS = 100000;

export function generateReeks(level: Level, r: Rng, type?: string): ReeksItem {
  const makers = REEKS_TYPES[level];
  const names = Object.keys(makers);
  for (let attempt = 0; attempt < 500; attempt++) {
    const t = type ?? r.pick(names);
    const b = makers[t](r);
    if (!b) continue;
    const terms = b.seq.slice(0, -1);
    const answer = b.seq[b.seq.length - 1];
    const alt = alternativePredictions(terms);
    const last = terms[terms.length - 1];
    const ld = last - terms[terms.length - 2];
    const step = Math.max(2, Math.round(Math.abs(answer - last) / 4));
    const cands = [
      ...(b.traps ?? []),
      last + ld,
      answer + 1,
      answer - 1,
      answer + 2,
      answer - 2,
      answer + step,
      answer - step,
      answer + 10,
      answer - 10,
      2 * answer - last,
    ];
    const opts: number[] = [];
    for (const c of [...(b.traps ?? []), ...r.shuffle(cands)]) {
      if (opts.length >= 4) break;
      if (!Number.isSafeInteger(c) || Math.abs(c) >= MAX_ABS || c === answer || opts.includes(c) || alt.some((p) => p === c && p !== answer)) continue;
      if (answer > 0 && c <= 0 && terms.every((x) => x > 0)) continue;
      opts.push(c);
    }
    if (opts.length < 4) continue;
    const item: ReeksItem = { type: t, terms, answer, options: r.shuffle([answer, ...opts]), explanation: `<p>${b.explain(terms, answer)}</p>` };
    if (checkReeksItem(item).length === 0) return item;
  }
  throw new Error(`Kon geen cijferreeks maken (${level})`);
}

export function checkReeksItem(it: ReeksItem): string[] {
  const errs: string[] = [];
  if (it.options.length !== 5) errs.push('niet 5 opties');
  if (new Set(it.options).size !== it.options.length) errs.push('dubbele opties');
  if (it.options.filter((o) => o === it.answer).length !== 1) errs.push('antwoord niet precies 1 keer');
  if ([...it.terms, ...it.options].some((x) => !Number.isSafeInteger(x) || Math.abs(x) >= MAX_ABS)) errs.push('getal te groot of geen geheel getal');
  if (it.terms.length < 5) errs.push('te weinig termen');
  for (const p of alternativePredictions(it.terms)) {
    if (p !== it.answer && it.options.includes(p)) errs.push(`andere regel geeft optie ${p}`);
  }
  if (!it.explanation || it.explanation.length < 10) errs.push('geen uitleg');
  return errs;
}

export function reeksToQuestion(it: ReeksItem, level: Level): Question {
  const text = `${it.terms.map(fmtNum).join(', ')}, ?`;
  return {
    key: `${it.type}|${text}`,
    subtest: 'reeksen',
    level,
    type: it.type,
    instruction: 'Welk getal komt hierna?',
    promptHtml: `<div class="seq" aria-label="Reeks: ${text.replace('?', 'vraagteken')}">${it.terms.map((x) => `<span>${fmtNum(x)}</span>`).join('<span aria-hidden="true">,</span>')}<span aria-hidden="true">,</span><span class="blank">?</span></div>`,
    promptLabel: text,
    options: it.options.map((o) => ({ html: `<span class="num">${fmtNum(o)}</span>`, label: fmtNum(o) })),
    correct: [it.options.indexOf(it.answer)],
    explanationHtml: it.explanation,
    optionStyle: 'text',
  };
}
