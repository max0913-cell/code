/**
 * Rooster van hokjes, elk hokje verdeeld in 4 driehoekjes door de twee diagonalen:
 * q = 0 (boven), 1 (rechts), 2 (onder), 3 (links).
 * Een heel hokje = 4 driehoekjes, een half hokje = 2 naast elkaar liggende driehoekjes.
 * Draaien (per 90°) en spiegelen zijn op dit rooster exact.
 *
 * Een driehoekje wordt opgeslagen als één getal: ((y + 32) * 64 + (x + 32)) * 4 + q.
 * Sorteren op dat getal = sorteren op (y, x, q), en verschuiven = een getal optellen.
 */
export type Shape = number[];

const OFF = 32;
const W = 64;

export const enc = (x: number, y: number, q: number): number => ((y + OFF) * W + (x + OFF)) * 4 + q;
export const dec = (k: number): [number, number, number] => {
  const c = k >> 2;
  return [(c % W) - OFF, Math.floor(c / W) - OFF, k & 3];
};
export const shiftKey = (dx: number, dy: number): number => (dy * W + dx) * 4;

const sortU = (xs: number[]): number[] => [...new Set(xs)].sort((a, b) => a - b);

export function normalize(s: Shape): Shape {
  if (s.length === 0) return [];
  let minX = Infinity;
  let minY = Infinity;
  for (const k of s) {
    const [x, y] = dec(k);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
  }
  return sortU(s.map((k) => k + shiftKey(-minX, -minY)));
}

/** Draai 90° met de klok mee (y wijst naar beneden). */
export function rot90(s: Shape): Shape {
  return normalize(
    s.map((k) => {
      const [x, y, q] = dec(k);
      return enc(-y - 1, x, (q + 1) % 4);
    }),
  );
}

/** Spiegel links-rechts. */
export function mirror(s: Shape): Shape {
  return normalize(
    s.map((k) => {
      const [x, y, q] = dec(k);
      return enc(-x - 1, y, q === 1 ? 3 : q === 3 ? 1 : q);
    }),
  );
}

export function rotate(s: Shape, times: number): Shape {
  let out = normalize(s);
  for (let i = 0; i < ((times % 4) + 4) % 4; i++) out = rot90(out);
  return out;
}

/** Alle verschillende standen: 4 draaiingen, en met spiegelen 8. */
export function orientations(s: Shape, withMirror: boolean): Shape[] {
  const out: Shape[] = [];
  const seen = new Set<string>();
  let cur = normalize(s);
  for (const m of withMirror ? [false, true] : [false]) {
    let o = m ? mirror(cur) : cur;
    for (let i = 0; i < 4; i++) {
      const key = o.join(',');
      if (!seen.has(key)) {
        seen.add(key);
        out.push(o);
      }
      o = rot90(o);
    }
    cur = normalize(s);
  }
  return out;
}

/** Vaste vorm-sleutel, gelijk voor alle draaiingen en spiegelingen. */
export function canon(s: Shape): string {
  return orientations(s, true)
    .map((o) => o.join(','))
    .sort()[0];
}
export const congruent = (a: Shape, b: Shape): boolean => a.length === b.length && canon(a) === canon(b);

export function neighbors(k: number): number[] {
  const [x, y, q] = dec(k);
  const inCell = [enc(x, y, (q + 1) % 4), enc(x, y, (q + 3) % 4)];
  const across = q === 0 ? enc(x, y - 1, 2) : q === 1 ? enc(x + 1, y, 3) : q === 2 ? enc(x, y + 1, 0) : enc(x - 1, y, 1);
  return [...inCell, across];
}

export function connected(s: Shape): boolean {
  if (s.length === 0) return false;
  const set = new Set(s);
  const seen = new Set([s[0]]);
  const stack = [s[0]];
  while (stack.length) {
    const k = stack.pop()!;
    for (const n of neighbors(k)) {
      if (set.has(n) && !seen.has(n)) {
        seen.add(n);
        stack.push(n);
      }
    }
  }
  return seen.size === set.size;
}

export function bbox(s: Shape): { minX: number; minY: number; maxX: number; maxY: number; w: number; h: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const k of s) {
    const [x, y] = dec(k);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/** Heeft de vorm een gat (een stuk binnenin dat niet bij de buitenkant hoort)? */
export function hasHole(s: Shape): boolean {
  const set = new Set(s);
  const b = bbox(s);
  const inBox = (k: number) => {
    const [x, y] = dec(k);
    return x >= b.minX - 1 && x <= b.maxX + 1 && y >= b.minY - 1 && y <= b.maxY + 1;
  };
  const start = enc(b.minX - 1, b.minY - 1, 0);
  const seen = new Set([start]);
  const stack = [start];
  while (stack.length) {
    const k = stack.pop()!;
    for (const n of neighbors(k)) {
      if (!set.has(n) && !seen.has(n) && inBox(n)) {
        seen.add(n);
        stack.push(n);
      }
    }
  }
  const total = (b.w + 2) * (b.h + 2) * 4;
  return seen.size + set.size !== total;
}

/** Per hokje: welke driehoekjes (bitmasker). */
export function cellMasks(s: Shape): Map<string, number> {
  const m = new Map<string, number>();
  for (const k of s) {
    const [x, y, q] = dec(k);
    const key = `${x},${y}`;
    m.set(key, (m.get(key) ?? 0) | (1 << q));
  }
  return m;
}

/** Toegestane hokjes: leeg, heel, of een half hokje (twee naast elkaar liggende driehoekjes). */
export const HALF_MASKS = [0b0011, 0b0110, 0b1100, 0b1001];
export function validCells(s: Shape): boolean {
  for (const v of cellMasks(s).values()) if (v !== 0b1111 && !HALF_MASKS.includes(v)) return false;
  return true;
}

export const fullCell = (x: number, y: number): number[] => [0, 1, 2, 3].map((q) => enc(x, y, q));
export const cellsToShape = (cells: [number, number][]): Shape => sortU(cells.flatMap(([x, y]) => fullCell(x, y)));

/** Oppervlakte in hokjes (kan op ,5 eindigen). */
export const area = (s: Shape): number => s.length / 4;

export function formatArea(a: number): string {
  const whole = Math.floor(a);
  return a % 1 === 0 ? String(a) : whole === 0 ? '½' : `${whole}½`;
}

/** Hoekpunten van een driehoekje (in hokje-eenheden). */
export function triPoints(k: number): [number, number][] {
  const [x, y, q] = dec(k);
  const c: [number, number] = [x + 0.5, y + 0.5];
  const TL: [number, number] = [x, y];
  const TR: [number, number] = [x + 1, y];
  const BR: [number, number] = [x + 1, y + 1];
  const BL: [number, number] = [x, y + 1];
  return q === 0 ? [TL, TR, c] : q === 1 ? [TR, BR, c] : q === 2 ? [BR, BL, c] : [BL, TL, c];
}

/** Randlijnen van een vorm: zijden van driehoekjes die niet gedeeld worden. */
export function boundarySegments(s: Shape): [[number, number], [number, number]][] {
  const count = new Map<string, { a: [number, number]; b: [number, number]; n: number }>();
  for (const k of s) {
    const p = triPoints(k);
    for (let i = 0; i < 3; i++) {
      const a = p[i];
      const b = p[(i + 1) % 3];
      const key = [a, b]
        .map(([x, y]) => `${x * 2},${y * 2}`)
        .sort()
        .join('|');
      const e = count.get(key);
      if (e) e.n++;
      else count.set(key, { a, b, n: 1 });
    }
  }
  return [...count.values()].filter((e) => e.n === 1).map((e) => [e.a, e.b]);
}
