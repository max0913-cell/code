import { D, F, Frac, fracHtml, fracRawHtml, lcm } from '../../core/fraction';
import type { Rng } from '../../core/rng';
import type { Level, Question } from '../../core/types';
import {
  countUnknowns,
  type Equation,
  type Fmt,
  formatValue,
  numbersIn,
  num,
  op,
  pct,
  renderEquation,
  satisfies,
  unk,
} from './expr';

export interface RekenItem {
  type: string;
  eq: Equation;
  answer: Frac;
  fmt: Fmt;
  options: Frac[];
  explanation: string;
}

type Maker = (r: Rng) => RekenItem | null;

// ---------- hulpfuncties ----------
const dec = (n: number | bigint, p: number): Frac => Frac.dec(n, p);
const N = (f: Frac): string => f.toDecimal();
const B = (f: Frac): string => fracHtml(f);
const p10 = (k: number): Frac => F(10 ** k);

function nonRound(r: Rng, lo: number, hi: number): number {
  for (;;) {
    const v = r.int(lo, hi);
    if (v % 10 !== 0) return v;
  }
}

/** 0,4 → 0,44 ; 0,03 → 0,033 : een afleider die er bijna hetzelfde uitziet. */
export function nearDigits(x: Frac): Frac | null {
  if (!x.isTerminating()) return null;
  const p = x.places();
  const digits = x.mul(p10(p)).n;
  const last = digits % 10n;
  if (last === 0n) return null;
  return dec(digits * 10n + last, p + 1);
}

/** "a : b = a·10^k : b·10^k" zodat de deler een geheel getal wordt. */
function shift(a: Frac, b: Frac): string {
  const k = b.places();
  if (k === 0) return `${N(a)} : ${N(b)}`;
  const m = p10(k);
  return `${N(a)} : ${N(b)} = ${N(a.mul(m))} : ${N(b.mul(m))}`;
}

interface PickCfg {
  fmt: Fmt;
  maxPlaces?: number;
  maxDen?: number;
}

function validOption(v: Frac | null, cfg: PickCfg): v is Frac {
  if (!v || !v.isPos()) return false;
  if (cfg.fmt === 'dec') {
    if (!v.isTerminating() || v.places() > (cfg.maxPlaces ?? 6)) return false;
    if (v.cmp(F(100000)) >= 0) return false;
  } else {
    if (v.d > BigInt(cfg.maxDen ?? 144) || v.n > 999n) return false;
  }
  return true;
}

/**
 * Kies 4 afleiders: eerst uit de "typische fouten" (primary), dan uit reserves.
 * Alle opties zijn positief, verschillend en goed weer te geven.
 */
function pickOptions(
  r: Rng,
  answer: Frac,
  cfg: PickCfg,
  primary: (Frac | null)[],
  secondary: (Frac | null)[] = [],
): Frac[] | null {
  const chosen: Frac[] = [];
  const take = (list: (Frac | null)[]) => {
    for (const v of list) {
      if (chosen.length >= 4) return;
      if (validOption(v, cfg) && !v.eq(answer) && !chosen.some((c) => c.eq(v))) chosen.push(v);
    }
  };
  take(r.shuffle(primary));
  take(r.shuffle(secondary));
  const generic =
    cfg.fmt === 'dec'
      ? [answer.mul(F(10)), answer.div(F(10)), answer.add(F(1)), answer.sub(F(1)), answer.mul(F(2)), answer.div(F(2))]
      : [
          answer.add(F(1, answer.d)),
          answer.sub(F(1, answer.d)),
          answer.mul(F(2)),
          answer.div(F(2)),
          answer.inv(),
          Frac.of(answer.n + 1n, answer.d + 1n),
        ];
  take(r.shuffle(generic));
  if (chosen.length < 4) return null;
  return r.shuffle([answer, ...chosen]);
}

const mk = (type: string, eq: Equation, answer: Frac, fmt: Fmt, options: Frac[] | null, explanation: string): RekenItem | null =>
  options ? { type, eq, answer, fmt, options, explanation } : null;

const I = (n: number): Frac => F(n);

// ---------- MAKKELIJK ----------
const makkelijk: Record<string, Maker> = {
  optellen: (r) => {
    const a = r.int(12, 68);
    const x = r.int(11, 79);
    const c = a + x;
    const ans = I(x);
    const eq = { lhs: op('+', num(I(a)), unk()), rhs: num(I(c)) };
    return mk('optellen', eq, ans, 'dec',
      pickOptions(r, ans, { fmt: 'dec' }, [I(x + 10), I(x - 10), I(x + 1), I(x - 1)], [I(x + 2), I(x - 2), I(x + 9), I(x - 9)]),
      `<p>Reken terug: ${c} − ${a} = ${x}.</p><p>Controle: ${a} + ${x} = ${c}.</p>`);
  },
  aftrekken: (r) => {
    const a = r.int(45, 160);
    const b = r.int(12, a - 15);
    const ans = I(a - b);
    const eq = { lhs: op('−', num(I(a)), num(I(b))), rhs: unk() };
    const t = b - (b % 10);
    const tip = b % 10 === 0 || t === 0 ? '' : ` Handig: eerst ${a} − ${t} = ${a - t}, dan nog − ${b % 10} = ${a - b}.`;
    return mk('aftrekken', eq, ans, 'dec',
      pickOptions(r, ans, { fmt: 'dec' }, [I(a - b + 10), I(a - b - 10), I(a - b + 1), I(a - b - 1)], [I(a - b + 2), I(a - b - 2)]),
      `<p>${a} − ${b} = ${a - b}.${tip}</p>`);
  },
  vermenigvuldigen: (r) => {
    const a = r.int(3, 9);
    const b = nonRound(r, 12, 29);
    const ans = I(a * b);
    const t = b - (b % 10);
    const u = b % 10;
    const eq = { lhs: op('×', num(I(a)), num(I(b))), rhs: unk() };
    return mk('vermenigvuldigen', eq, ans, 'dec',
      pickOptions(r, ans, { fmt: 'dec' }, [I(a * b + a), I(a * b - a), I(a * b + 10), I(a * b - 10)], [I(a * b + 1), I(a * b - 1)]),
      `<p>Splits ${b} in ${t} + ${u}: ${a} × ${t} = ${a * t} en ${a} × ${u} = ${a * u}. Samen ${a * b}.</p>`);
  },
  ontbrekende_factor: (r) => {
    const a = r.int(3, 12);
    const x = r.int(3, 12);
    const c = a * x;
    const ans = I(x);
    const eq = { lhs: op('×', num(I(a)), unk()), rhs: num(I(c)) };
    return mk('ontbrekende_factor', eq, ans, 'dec',
      pickOptions(r, ans, { fmt: 'dec' }, [I(x + 1), I(x - 1), I(c - a), I(x + 2)], [I(x - 2), I(x + 3)]),
      `<p>${c} : ${a} = ${x}, want ${a} × ${x} = ${c}.</p>`);
  },
  delen: (r) => {
    const a = r.int(3, 9);
    const q = r.int(6, 25);
    const c = a * q;
    const ans = I(q);
    const eq = { lhs: op(':', num(I(c)), num(I(a))), rhs: unk() };
    return mk('delen', eq, ans, 'dec',
      pickOptions(r, ans, { fmt: 'dec' }, [I(q + 1), I(q - 1), I(q + 10), I(q - 10)], [I(q + 2), I(q - 2)]),
      `<p>${a} × ${q} = ${c}, dus ${c} : ${a} = ${q}.</p>`);
  },
  decimaal_keer_geheel: (r) => {
    const choices: { f: string; m: number; lo: number; hi: number; ex: (n: number, a: string) => string }[] = [
      { f: '0,5', m: 2, lo: 6, hi: 60, ex: (n, a) => `0,5 × ${n} is de helft van ${n}: ${a}.` },
      { f: '0,25', m: 4, lo: 3, hi: 30, ex: (n, a) => `0,25 is een kwart, dus ${n} : 4 = ${a}.` },
      { f: '0,1', m: 1, lo: 11, hi: 99, ex: (n, a) => `0,1 × ${n} is ${n} gedeeld door 10: ${a}.` },
      { f: '0,2', m: 5, lo: 3, hi: 20, ex: (n, a) => `0,2 is een vijfde, dus ${n} : 5 = ${a}.` },
      { f: '1,5', m: 2, lo: 6, hi: 40, ex: (n, a) => `1,5 × ${n} = ${n} + de helft van ${n} = ${n} + ${n / 2} = ${a}.` },
      { f: '2,5', m: 2, lo: 4, hi: 30, ex: (n, a) => `2,5 × ${n} = 2 × ${n} + de helft van ${n} = ${2 * n} + ${n / 2} = ${a}.` },
      { f: '0,75', m: 4, lo: 3, hi: 25, ex: (n, a) => `0,75 is drie kwart: ${n} : 4 = ${n / 4}, en 3 × ${n / 4} = ${a}.` },
    ];
    const ch = r.pick(choices);
    const n = ch.m * r.int(ch.lo, ch.hi);
    const f = D(ch.f);
    const ans = f.mul(I(n));
    const eq = r.chance(0.5)
      ? { lhs: op('×', num(f), num(I(n))), rhs: unk() }
      : { lhs: op('×', num(I(n)), num(f)), rhs: unk() };
    return mk('decimaal_keer_geheel', eq, ans, 'dec',
      pickOptions(r, ans, { fmt: 'dec' }, [ans.mul(I(10)), ans.div(I(10)), ans.mul(I(2)), ans.div(I(2))], [ans.add(I(1)), ans.sub(I(1))]),
      `<p>${ch.ex(n, N(ans))}</p>`);
  },
  decimalen_optellen: (r) => {
    const ai = r.int(1, 9);
    const at = r.int(1, 9);
    const bi = r.int(1, 9);
    const bt = r.int(1, 9);
    const a = dec(ai * 10 + at, 1);
    const b = dec(bi * 10 + bt, 1);
    const ans = a.add(b);
    const tenth = D('0,1');
    const eq = { lhs: op('+', num(a), num(b)), rhs: unk() };
    return mk('decimalen_optellen', eq, ans, 'dec',
      pickOptions(r, ans, { fmt: 'dec' }, [ans.add(I(1)), ans.sub(I(1)), ans.add(tenth), ans.sub(tenth)], [ans.add(tenth.mul(I(2))), ans.sub(tenth.mul(I(2)))]),
      `<p>Hele getallen: ${ai} + ${bi} = ${ai + bi}. Tienden: 0,${at} + 0,${bt} = ${N(dec(at + bt, 1))}. Samen ${N(ans)}.</p>`);
  },
  procent_simpel: (r) => {
    const p = r.pick([10, 20, 25, 50, 75]);
    const X = 20 * r.int(2, 20);
    const ans = F(p * X, 100);
    const others = [10, 20, 25, 50, 75].filter((q) => q !== p).map((q) => F(q * X, 100));
    const eq = { lhs: pct(num(I(p)), num(I(X))), rhs: unk() };
    const ex: Record<number, string> = {
      10: `10% is ${X} : 10 = ${N(ans)}.`,
      20: `10% is ${X} : 10 = ${X / 10}, dus 20% is 2 × ${X / 10} = ${N(ans)}.`,
      25: `25% is een kwart: ${X} : 4 = ${N(ans)}.`,
      50: `50% is de helft: ${X} : 2 = ${N(ans)}.`,
      75: `25% is ${X} : 4 = ${X / 4}, dus 75% is 3 × ${X / 4} = ${N(ans)}.`,
    };
    return mk('procent_simpel', eq, ans, 'dec',
      pickOptions(r, ans, { fmt: 'dec' }, [...others, ans.mul(I(10))]),
      `<p>${ex[p]}</p>`);
  },
  breuk_zelfde_noemer: (r) => {
    const d = r.int(4, 9);
    const b = r.int(1, d - 2);
    const t = r.int(b + 1, d - 1);
    const ans = F(t - b, d);
    const eq = { lhs: op('+', unk('frac'), num(F(b, d), 'frac')), rhs: num(F(t, d), 'frac') };
    const reduced = ans.d !== BigInt(d) ? ` = ${B(ans)}` : '';
    return mk('breuk_zelfde_noemer', eq, ans, 'frac',
      pickOptions(r, ans, { fmt: 'frac' }, [F(t + b, d), F(b, d), F(t - b + 1, d), F(t - b - 1, d)], [F(t, d)]),
      `<p>De noemers zijn gelijk, dus trek alleen de tellers af: ${fracRawHtml(t, d)} − ${fracRawHtml(b, d)} = ${fracRawHtml(t - b, d)}${reduced}.</p>`);
  },
  ontbrekend_deeltal: (r) => {
    const a = r.int(2, 9);
    const q = r.int(5, 15);
    const ans = I(a * q);
    const eq = { lhs: op(':', unk(), num(I(a))), rhs: num(I(q)) };
    return mk('ontbrekend_deeltal', eq, ans, 'dec',
      pickOptions(r, ans, { fmt: 'dec' }, [I(a * q + a), I(a * q - a), I(a * q + 10), I(q + a)], [I(a * q + 1), I(a * q - 1)]),
      `<p>Reken terug: ${q} × ${a} = ${a * q}. Controle: ${a * q} : ${a} = ${q}.</p>`);
  },
};

// ---------- EXAMEN ----------
const DIGS = [2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 25];
const commaShifts = (x: Frac): Frac[] => [x.mul(I(10)), x.div(I(10)), x.mul(I(100)), x.div(I(100))];

function fracSubExplain(s: Frac, y: Frac, x: Frac, sign: '−' | '+'): string {
  const L = lcm(s.d, y.d);
  const S = s.n * (L / s.d);
  const Y = y.n * (L / y.d);
  const R = sign === '−' ? S - Y : S + Y;
  const end = Frac.of(R, L).eq(x) && (x.d !== L || x.n !== R) ? ` = ${B(x)}` : '';
  return `${B(s)} ${sign} ${B(y)} = ${fracRawHtml(S, L)} ${sign} ${fracRawHtml(Y, L)} = ${fracRawHtml(R, L)}${end}`;
}

function pctExplain(p: number, X: Frac, ans: Frac): string {
  if (p % 10 === 0) {
    const t = X.div(I(10));
    return `10% van ${N(X)} is ${N(t)}, dus ${p}% is ${p / 10} × ${N(t)} = ${N(ans)}.`;
  }
  if (p % 5 === 0) {
    const t = X.div(I(10));
    const h = t.div(I(2));
    const tens = (p - 5) / 10;
    return `10% van ${N(X)} is ${N(t)} en 5% is de helft daarvan: ${N(h)}. ${p}% = ${tens} × ${N(t)} + ${N(h)} = ${N(ans)}.`;
  }
  const u = X.div(I(100));
  return `1% van ${N(X)} is ${N(u)}, dus ${p}% is ${p} × ${N(u)} = ${N(ans)}.`;
}

const examen: Record<string, Maker> = {
  komma_factor: (r) => {
    const a = dec(nonRound(r, 2, 99), r.int(1, 2));
    const x = dec(r.pick(DIGS), r.int(1, 2));
    const c = a.mul(x);
    if (c.places() > 5) return null;
    const eq = { lhs: op('×', num(a), unk()), rhs: num(c) };
    return mk('komma_factor', eq, x, 'dec', pickOptions(r, x, { fmt: 'dec' }, commaShifts(x)),
      `<p>Het ontbrekende getal is ${N(c)} : ${N(a)}. Maak de deler een geheel getal: ${shift(c, a)} = ${N(x)}.</p><p>Controle: ${N(a)} × ${N(x)} = ${N(c)}.</p>`);
  },
  delen_door_komma: (r) => {
    const q = r.chance(0.6) ? I(r.int(3, 40)) : dec(nonRound(r, 11, 99), 1);
    const b = dec(r.pick(DIGS), r.int(1, 2));
    const a = q.mul(b);
    if (a.places() > 4) return null;
    const eq = { lhs: op(':', num(a), num(b)), rhs: unk() };
    return mk('delen_door_komma', eq, q, 'dec', pickOptions(r, q, { fmt: 'dec' }, commaShifts(q)),
      `<p>Vermenigvuldig beide getallen met hetzelfde getal, zodat de deler geheel wordt: ${shift(a, b)} = ${N(q)}.</p>`);
  },
  breuk_ontbrekend: (r) => {
    const dens = [2, 3, 4, 5, 6, 8, 10, 12];
    const bq = r.pick(dens);
    let dq = r.pick(dens);
    while (dq === bq) dq = r.pick(dens);
    const x = F(r.int(1, bq - 1), bq);
    const y = F(r.int(1, dq - 1), dq);
    const s = x.add(y);
    if (s.d > 60n) return null;
    const L = lcm(s.d, y.d);
    const naive = s.n > y.n && s.d > y.d ? Frac.of(s.n - y.n, s.d - y.d) : null;
    const eq = { lhs: op('+', unk('frac'), num(y, 'frac')), rhs: num(s, 'frac') };
    return mk('breuk_ontbrekend', eq, x, 'frac',
      pickOptions(r, x, { fmt: 'frac' }, [naive, s.add(y), y, x.add(Frac.of(1n, L)), x.sub(Frac.of(1n, L))]),
      `<p>Reken terug: ${fracSubExplain(s, y, x, '−')}.</p><p>Maak eerst de noemers gelijk, dan pas aftrekken.</p>`);
  },
  procent_van: (r) => {
    const p = r.pick([5, 12, 15, 35, 45, 55, 65, 85, 120, 150]);
    const X = I(20 * r.int(2, 40));
    const ans = X.mul(F(p, 100));
    if (ans.places() > 1) return null;
    const eq = { lhs: pct(num(I(p)), num(X)), rhs: unk() };
    return mk('procent_van', eq, ans, 'dec',
      pickOptions(r, ans, { fmt: 'dec' }, [ans.mul(I(10)), ans.div(I(10)), X.mul(F(p + 5, 100)), X.mul(F(p - 5, 100))]),
      `<p>${pctExplain(p, X, ans)}</p>`);
  },
  komma_product: (r) => {
    const a = dec(r.pick([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18]), r.int(1, 2));
    const b = dec(r.int(2, 9), r.int(1, 3));
    const pa = a.places();
    const pb = b.places();
    if (pa + pb > 4) return null;
    const ans = a.mul(b);
    const A = a.mul(p10(pa)).n;
    const Bn = b.mul(p10(pb)).n;
    const eq = { lhs: op('×', num(a), num(b)), rhs: unk() };
    return mk('komma_product', eq, ans, 'dec', pickOptions(r, ans, { fmt: 'dec' }, commaShifts(ans)),
      `<p>Reken eerst zonder komma's: ${A} × ${Bn} = ${A * Bn}. Samen staan er ${pa + pb} cijfers achter de komma, dus ${N(ans)}.</p>`);
  },
  onbekend_deeltal: (r) => {
    const b = dec(r.int(2, 9), r.int(1, 2));
    const q = r.chance(0.6) ? I(r.int(3, 30)) : dec(nonRound(r, 11, 99), 1);
    const ans = q.mul(b);
    if (ans.places() > 3) return null;
    const eq = { lhs: op(':', unk(), num(b)), rhs: num(q) };
    return mk('onbekend_deeltal', eq, ans, 'dec',
      pickOptions(r, ans, { fmt: 'dec' }, [q.div(b), ans.mul(I(10)), ans.div(I(10)), ans.mul(I(100))]),
      `<p>Reken terug: ${N(q)} × ${N(b)} = ${N(ans)}.</p><p>Controle: ${shift(ans, b)} = ${N(q)}.</p>`);
  },
  breuk_keer_deel: (r) => {
    const q = r.int(2, 9);
    const p = r.int(1, q - 1);
    const s = r.int(2, 9);
    const t = r.int(1, s - 1);
    const A = F(p, q);
    const Bf = F(t, s);
    const o = r.pick(['×', ':'] as const);
    const ans = o === '×' ? A.mul(Bf) : A.div(Bf);
    if (ans.d > 81n || ans.n > 81n) return null;
    const eq = { lhs: op(o, num(A, 'frac'), num(Bf, 'frac')), rhs: unk('frac') };
    if (o === '×') {
      const raw = fracRawHtml(A.n * Bf.n, A.d * Bf.d);
      return mk('breuk_keer_deel', eq, ans, 'frac',
        pickOptions(r, ans, { fmt: 'frac' }, [A.div(Bf), F(p + t, q + s), A.add(Bf), A.sub(Bf)]),
        `<p>Teller × teller en noemer × noemer: ${B(A)} × ${B(Bf)} = ${raw}${A.mul(Bf).d !== A.d * Bf.d ? ` = ${B(ans)}` : ''}.</p>`);
    }
    const raw = fracRawHtml(A.n * Bf.d, A.d * Bf.n);
    return mk('breuk_keer_deel', eq, ans, 'frac',
      pickOptions(r, ans, { fmt: 'frac' }, [A.mul(Bf), ans.inv(), A.add(Bf), A.sub(Bf)]),
      `<p>Delen door een breuk is vermenigvuldigen met het omgekeerde: ${B(A)} × ${B(Bf.inv())} = ${raw}${ans.d !== A.d * Bf.n || ans.n !== A.n * Bf.d ? ` = ${B(ans)}` : ''}.</p>`);
  },
  procent_geheel: (r) => {
    const p = r.pick([20, 25, 30, 40, 60, 75, 15, 35]);
    const X = I(20 * r.int(2, 30));
    const y = X.mul(F(p, 100));
    if (y.places() > 1) return null;
    const eq = { lhs: pct(num(I(p)), unk()), rhs: num(y) };
    const u = y.div(I(p));
    const ex = 100 % p === 0
      ? `${p}% is 1/${100 / p} deel. Het geheel is dus ${100 / p} × ${N(y)} = ${N(X)}.`
      : `${p}% is ${N(y)}, dus 1% is ${N(y)} : ${p} = ${N(u)} en 100% is ${N(X)}.`;
    return mk('procent_geheel', eq, X, 'dec',
      pickOptions(r, X, { fmt: 'dec' }, [y.mul(F(p, 100)), X.mul(I(10)), X.div(I(10)), y.mul(I(2))]),
      `<p>${ex}</p>`);
  },
  breuk_aftrekken: (r) => {
    const dens = [2, 3, 4, 5, 6, 8, 10, 12];
    const sd = r.pick(dens);
    let yd = r.pick(dens);
    while (yd === sd) yd = r.pick(dens);
    const s = F(r.int(1, sd - 1), sd);
    const y = F(r.int(1, yd - 1), yd);
    const x = s.add(y);
    if (x.d > 60n) return null;
    const L = lcm(s.d, y.d);
    const eq = { lhs: op('−', unk('frac'), num(y, 'frac')), rhs: num(s, 'frac') };
    return mk('breuk_aftrekken', eq, x, 'frac',
      pickOptions(r, x, { fmt: 'frac' }, [s.sub(y), Frac.of(s.n + y.n, s.d + y.d), x.add(Frac.of(1n, L)), x.sub(Frac.of(1n, L))], [s, y]),
      `<p>Reken terug door op te tellen: ${fracSubExplain(s, y, x, '+')}.</p>`);
  },
  komma_deler: (r) => {
    const ans = r.chance(0.5) ? I(r.int(2, 9)) : dec(r.int(2, 9), r.int(1, 2));
    const q = r.chance(0.3) ? I(r.int(2, 9)) : dec(r.int(2, 9), r.int(1, 2));
    const a = ans.mul(q);
    if (a.places() > 3) return null;
    const eq = { lhs: op(':', num(a), unk()), rhs: num(q) };
    return mk('komma_deler', eq, ans, 'dec',
      pickOptions(r, ans, { fmt: 'dec' }, [ans.mul(I(10)), ans.div(I(10)), a.mul(q), q.div(a)]),
      `<p>Het ontbrekende getal is ${shift(a, q)} = ${N(ans)}.</p><p>Controle: ${N(a)} : ${N(ans)} = ${N(q)}.</p>`);
  },
};

// ---------- MOEILIJK ----------
const moeilijk: Record<string, Maker> = {
  twee_stappen_plus: (r) => {
    const a = dec(r.int(2, 9), 1);
    const b = dec(r.int(2, 9), r.int(1, 2));
    const x = dec(nonRound(r, 1, 99), r.int(2, 3));
    const p = a.mul(b);
    const c = p.add(x);
    if (c.places() > 4) return null;
    const eq = { lhs: op('+', op('×', num(a), num(b)), unk()), rhs: num(c) };
    return mk('twee_stappen_plus', eq, x, 'dec',
      pickOptions(r, x, { fmt: 'dec' }, [x.mul(I(10)), x.div(I(10)), c.sub(p.mul(I(10))), c.add(p), nearDigits(x)]),
      `<p>Eerst de vermenigvuldiging: ${N(a)} × ${N(b)} = ${N(p)}.</p><p>Dan: ${N(c)} − ${N(p)} = ${N(x)}.</p>`);
  },
  twee_stappen_min: (r) => {
    const q = r.int(5, 40);
    const b = dec(r.int(2, 9), r.int(1, 2));
    const a = I(q).mul(b);
    if (a.places() > 3) return null;
    const x = dec(nonRound(r, 11, q * 10 - 1), 1);
    const c = I(q).sub(x);
    if (!c.isPos()) return null;
    const eq = { lhs: op('−', op(':', num(a), num(b)), unk()), rhs: num(c) };
    return mk('twee_stappen_min', eq, x, 'dec',
      pickOptions(r, x, { fmt: 'dec' }, [x.mul(I(10)), x.div(I(10)), I(q).add(c), I(q * 10).sub(c), I(q).div(I(10)).sub(c)]),
      `<p>Eerst de deling: ${shift(a, b)} = ${q}.</p><p>Dan: ${q} − ... = ${N(c)}, dus ... = ${q} − ${N(c)} = ${N(x)}.</p>`);
  },
  klein_delen: (r) => {
    const q = dec(r.pick(DIGS), r.int(1, 3));
    const b = dec(r.pick(DIGS), r.int(2, 3));
    const a = q.mul(b);
    if (a.places() > 6 || a.places() < 3) return null;
    const eq = { lhs: op(':', num(a), num(b)), rhs: unk() };
    return mk('klein_delen', eq, q, 'dec',
      pickOptions(r, q, { fmt: 'dec' }, [q.mul(I(10)), q.div(I(10)), nearDigits(q), q.mul(I(100)), q.div(I(100))]),
      `<p>Schuif bij beide getallen de komma evenveel plaatsen op: ${shift(a, b)} = ${N(q)}.</p>`);
  },
  klein_factor: (r) => {
    const a = dec(r.pick(DIGS), r.int(2, 3));
    const x = dec(r.int(2, 9), r.int(2, 3));
    const c = a.mul(x);
    if (c.places() > 6) return null;
    const eq = { lhs: op('×', num(a), unk()), rhs: num(c) };
    return mk('klein_factor', eq, x, 'dec',
      pickOptions(r, x, { fmt: 'dec' }, [x.mul(I(10)), x.div(I(10)), nearDigits(x), x.div(I(100)), x.mul(I(100))]),
      `<p>Het ontbrekende getal is ${shift(c, a)} = ${N(x)}.</p><p>Controle: ${N(a)} × ${N(x)} = ${N(c)}.</p>`);
  },
  breuk_en_decimaal: (r) => {
    const q = r.pick([3, 4, 5, 6, 8, 12, 20]);
    const x = F(r.int(1, q - 1), q);
    const z = D(r.pick(['0,1', '0,2', '0,25', '0,3', '0,4', '0,5', '0,6', '0,75', '0,125', '0,375', '0,05', '0,15', '0,625']));
    const o = r.pick(['+', '−'] as const);
    const ans = o === '+' ? x.add(z) : x.sub(z);
    if (!ans.isPos() || ans.d > 120n) return null;
    const flip = o === '+' && r.chance(0.5);
    const eq = flip
      ? { lhs: op('+', num(z), num(x, 'frac')), rhs: unk('frac') }
      : { lhs: op(o, num(x, 'frac'), num(z)), rhs: unk('frac') };
    const L = lcm(x.d, z.d);
    const X = x.n * (L / x.d);
    const Z = z.n * (L / z.d);
    const R = o === '+' ? X + Z : X - Z;
    const end = ans.d !== L ? ` = ${B(ans)}` : '';
    return mk('breuk_en_decimaal', eq, ans, 'frac',
      pickOptions(r, ans, { fmt: 'frac' }, [ans.add(Frac.of(1n, ans.d)), ans.sub(Frac.of(1n, ans.d)), o === '+' ? x.add(z.div(I(10))) : x.sub(z.div(I(10))), o === '+' ? x.sub(z) : x.add(z)]),
      `<p>Schrijf ${N(z)} als breuk: ${B(z)}.</p><p>${B(x)} ${o} ${B(z)} = ${fracRawHtml(X, L)} ${o} ${fracRawHtml(Z, L)} = ${fracRawHtml(R, L)}${end}.</p>`);
  },
  decimaal_keer_breuk: (r) => {
    const a = D(r.pick(['0,25', '0,4', '0,5', '0,75', '1,25', '0,2', '0,6', '0,8', '1,5']));
    const x = dec(nonRound(r, 1, 19), r.int(1, 2));
    const f = a.mul(x);
    if (f.isInt() || f.d > 100n) return null;
    const eq = { lhs: op('×', num(a), unk()), rhs: num(f, 'frac') };
    return mk('decimaal_keer_breuk', eq, x, 'dec',
      pickOptions(r, x, { fmt: 'dec' }, [x.mul(I(10)), x.div(I(10)), a.div(f), nearDigits(x)]),
      `<p>${N(a)} = ${B(a)}. Het ontbrekende getal is ${B(f)} : ${B(a)} = ${B(f)} × ${B(a.inv())} = ${B(x)} = ${N(x)}.</p>`);
  },
  procent_van_procent: (r) => {
    const set = [10, 20, 25, 40, 50, 60, 75, 5, 15];
    const p = r.pick(set);
    let q = r.pick(set);
    while (q === p) q = r.pick(set);
    const X = I(100 * r.int(2, 30));
    const t = X.mul(F(q, 100));
    const ans = t.mul(F(p, 100));
    if (ans.places() > 2) return null;
    const eq = { lhs: pct(num(I(p)), pct(num(I(q)), num(X))), rhs: unk() };
    return mk('procent_van_procent', eq, ans, 'dec',
      pickOptions(r, ans, { fmt: 'dec' }, [X.mul(F(p + q, 100)), ans.mul(I(10)), ans.div(I(10)), X.mul(F(Math.abs(p - q), 100))]),
      `<p>Werk van rechts naar links. Eerst ${q}% van ${N(X)} = ${N(t)}.</p><p>Dan ${p}% van ${N(t)} = ${N(ans)}.</p>`);
  },
  onbekend_procent: (r) => {
    const a = r.chance(0.5) ? dec(r.int(2, 9), 1) : I(r.pick([4, 8, 12, 16, 20, 25, 40, 60, 80]));
    const p = D(r.pick(['2,5', '7,5', '12,5', '15', '35', '62,5', '0,5', '150', '37,5', '17,5', '4']));
    const c = p.mul(F(1, 100)).mul(a);
    if (c.places() > 4) return null;
    const ratio = c.div(a);
    const eq = { lhs: pct(unk(), num(a)), rhs: num(c) };
    return mk('onbekend_procent', eq, p, 'dec',
      pickOptions(r, p, { fmt: 'dec' }, [p.mul(I(10)), p.div(I(10)), nearDigits(p), a.div(c)]),
      `<p>Welk deel is ${N(c)} van ${N(a)}? ${N(c)} : ${N(a)} = ${N(ratio)}.</p><p>Als percentage: ${N(ratio)} × 100 = ${N(p)}%.</p>`);
  },
  breuk_twee_stappen: (r) => {
    const q = r.int(2, 6);
    const pq = F(r.int(1, q - 1), q);
    const x = r.chance(0.4) ? I(r.int(1, 4)) : F(r.int(1, 5), r.pick([2, 3, 4, 6]));
    const sd = r.pick([2, 3, 4, 6, 8]);
    const rs = F(r.int(1, sd - 1), sd);
    const t = pq.mul(x).sub(rs);
    if (!t.isPos() || t.d > 48n) return null;
    const w = t.add(rs);
    const eq = { lhs: op('−', op('×', num(pq, 'frac'), unk('frac')), num(rs, 'frac')), rhs: num(t, 'frac') };
    const minus = t.sub(rs);
    return mk('breuk_twee_stappen', eq, x, 'frac',
      pickOptions(r, x, { fmt: 'frac' }, [minus.isPos() ? minus.div(pq) : null, w.mul(pq), w, x.inv()]),
      `<p>Eerst ${B(rs)} terugtellen: ${B(t)} + ${B(rs)} = ${B(w)}.</p><p>Dan delen door ${B(pq)}: ${B(w)} × ${B(pq.inv())} = ${B(x)}.</p>`);
  },
  procent_gemengd: (r) => {
    const P = r.pick([125, 150, 120, 80, 175, 250, 40, 60]);
    const x = dec(nonRound(r, 11, 99), 2);
    const f = F(P, 100);
    const c = f.mul(x);
    if (c.places() > 4) return null;
    const wrong = P > 100 ? c.sub(c.mul(F(P - 100, 100))) : c.add(c.mul(F(100 - P, 100)));
    const eq = { lhs: pct(num(I(P)), unk()), rhs: num(c) };
    return mk('procent_gemengd', eq, x, 'dec',
      pickOptions(r, x, { fmt: 'dec' }, [c.mul(f), x.mul(I(10)), x.div(I(10)), wrong]),
      `<p>${P}% = ${B(f)}. Het ontbrekende getal is ${N(c)} : ${B(f)} = ${N(c)} × ${B(f.inv())} = ${N(x)}.</p><p>Let op: ${P > 100 ? `${P - 100}% van ${N(c)} aftrekken` : `${100 - P}% van ${N(c)} optellen`} geeft niet het goede antwoord.</p>`);
  },
  dichte_afleiders: (r) => {
    const b = D(r.pick(['0,25', '0,05', '0,125', '0,04', '0,2', '0,5', '0,8', '1,25', '0,02']));
    const x = r.chance(0.5) ? dec(r.int(2, 9), r.int(1, 2)) : dec(nonRound(r, 11, 99), r.int(1, 2));
    const c = x.div(b);
    if (!c.isTerminating() || c.places() > 3) return null;
    const eq = { lhs: op(':', unk(), num(b)), rhs: num(c) };
    return mk('dichte_afleiders', eq, x, 'dec',
      pickOptions(r, x, { fmt: 'dec' }, [x.mul(I(10)), x.div(I(10)), nearDigits(x), c.div(b)]),
      `<p>Reken terug: ${N(c)} × ${N(b)} = ${N(x)}.</p><p>Controle: ${shift(x, b)} = ${N(c)}.</p>`);
  },
};

export const REKEN_TYPES: Record<Level, Record<string, Maker>> = { makkelijk, examen, moeilijk };


export function generateRekenen(level: Level, r: Rng, type?: string): RekenItem {
  const makers = REKEN_TYPES[level];
  const names = Object.keys(makers);
  for (let attempt = 0; attempt < 500; attempt++) {
    const t = type ?? r.pick(names);
    const it = makers[t](r);
    if (it && checkRekenItem(it).length === 0) return it;
  }
  throw new Error(`Kon geen rekenopgave maken (${level})`);
}

/** Alle correctheidschecks voor een rekenopgave. Geeft een lijst met fouten terug (leeg = goed). */
export function checkRekenItem(it: RekenItem): string[] {
  const errs: string[] = [];
  if (it.options.length !== 5) errs.push('niet 5 opties');
  if (countUnknowns(it.eq.lhs) + countUnknowns(it.eq.rhs) !== 1) errs.push('niet precies 1 onbekende');
  const nCorrect = it.options.filter((o) => satisfies(it.eq, o)).length;
  if (nCorrect !== 1) errs.push(`${nCorrect} opties kloppen`);
  if (!satisfies(it.eq, it.answer)) errs.push('antwoord klopt niet');
  if (it.options.filter((o) => o.eq(it.answer)).length !== 1) errs.push('antwoord niet precies 1 keer in opties');
  for (let i = 0; i < it.options.length; i++)
    for (let j = i + 1; j < it.options.length; j++) if (it.options[i].eq(it.options[j])) errs.push('dubbele optie');
  const shown = it.options.map((o) => (it.fmt === 'dec' && o.isTerminating() ? o.toDecimal() : o.toFracText()));
  if (new Set(shown).size !== shown.length) errs.push('dubbele weergave');
  for (const o of it.options) {
    if (!o.isPos()) errs.push('niet-positieve optie');
    if (it.fmt === 'dec' && (!o.isTerminating() || o.places() > 6)) errs.push(`optie ${o} niet als decimaal te schrijven`);
  }
  for (const n of [...numbersIn(it.eq.lhs), ...numbersIn(it.eq.rhs)]) {
    if (n.fmt === 'dec' && !n.v.isTerminating()) errs.push(`getal ${n.v} niet als decimaal te schrijven`);
    if (n.v.n < 0n) errs.push('negatief getal in som');
  }
  if (!it.explanation || it.explanation.length < 10) errs.push('geen uitleg');
  return errs;
}

export function rekenToQuestion(it: RekenItem, level: Level): Question {
  const text = renderEquation(it.eq, false);
  return {
    key: `${it.type}|${text}`,
    subtest: 'rekenen',
    level,
    type: it.type,
    instruction: 'Welk getal hoort op de puntjes? Reken uit zonder rekenmachine.',
    promptHtml: `<div class="sum" aria-label="${text.replace('...', 'puntjes')}">${renderEquation(it.eq, true)}</div>`,
    promptLabel: text,
    options: it.options.map((o) => ({
      html: `<span class="num">${formatValue(o, it.fmt, true)}</span>`,
      label: formatValue(o, it.fmt, false),
    })),
    correct: [it.options.findIndex((o) => o.eq(it.answer))],
    explanationHtml: it.explanation,
    optionStyle: 'text',
  };
}
