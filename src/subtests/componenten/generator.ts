import type { Rng } from '../../core/rng';
import {
  HALF_MASKS,
  type Shape,
  bbox,
  canon,
  cellMasks,
  cellsToShape,
  congruent,
  connected,
  dec,
  enc,
  hasHole,
  neighbors,
  normalize,
  rotate,
  validCells,
} from '../../core/trigrid';
import type { Level } from '../../core/types';
import { canTile, solve } from './solver';

export type DistractorKind = 'oppervlakte' | 'hokje' | 'hoek' | 'half' | 'anders';

export interface CompItem {
  level: Level;
  /** De stukken zoals ze getoond worden. */
  pieces: Shape[];
  /** Zes opties, zoals ze getoond worden (al gedraaid). */
  options: Shape[];
  correct: number[];
  /** Per optie: hoe de afleider is ontstaan (null bij goede opties). */
  reasons: (DistractorKind | null)[];
}

interface LevelCfg {
  pieces: [number, number];
  cells: [number, number];
  maxDim: number;
  halves: [number, number];
  diagonalSplit: number;
  minPieceTris: number;
  rotatePieces: boolean;
}

const CFG: Record<Level, LevelCfg> = {
  makkelijk: { pieces: [2, 2], cells: [4, 6], maxDim: 4, halves: [0, 0], diagonalSplit: 0, minPieceTris: 8, rotatePieces: false },
  examen: { pieces: [2, 3], cells: [5, 8], maxDim: 5, halves: [0, 2], diagonalSplit: 0.35, minPieceTris: 6, rotatePieces: false },
  moeilijk: { pieces: [3, 4], cells: [7, 10], maxDim: 5, halves: [1, 3], diagonalSplit: 0.6, minPieceTris: 4, rotatePieces: true },
};

export const okShape = (s: Shape, maxDim: number): boolean => {
  if (s.length === 0 || !connected(s) || !validCells(s) || hasHole(s)) return false;
  const b = bbox(s);
  return b.w <= maxDim && b.h <= maxDim;
};

// ---------- basisvorm ----------
export function polyomino(r: Rng, n: number, maxDim: number): [number, number][] | null {
  const cells: [number, number][] = [[0, 0]];
  const has = (x: number, y: number) => cells.some(([a, b]) => a === x && b === y);
  while (cells.length < n) {
    const cand: { x: number; y: number; w: number }[] = [];
    for (const [x, y] of cells)
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (has(nx, ny) || cand.some((c) => c.x === nx && c.y === ny)) continue;
        const xs = [...cells.map((c) => c[0]), nx];
        const ys = [...cells.map((c) => c[1]), ny];
        if (Math.max(...xs) - Math.min(...xs) + 1 > maxDim || Math.max(...ys) - Math.min(...ys) + 1 > maxDim) continue;
        const adj = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ].filter(([a, b]) => has(nx + a, ny + b)).length;
        cand.push({ x: nx, y: ny, w: adj * adj });
      }
    if (cand.length === 0) return null;
    const tot = cand.reduce((s, c) => s + c.w, 0);
    let pick = r.next() * tot;
    const c = cand.find((c) => (pick -= c.w) < 0) ?? cand[cand.length - 1];
    cells.push([c.x, c.y]);
  }
  return cells;
}

/** Zijden van een hokje: 0 boven, 1 rechts, 2 onder, 3 links; buur-hokje aan die kant. */
const SIDE: [number, number][] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export function cutCorner(r: Rng, s: Shape): Shape | null {
  const set = new Set(s);
  const masks = cellMasks(s);
  const opts: number[][] = [];
  for (const [key, m] of masks) {
    if (m !== 0b1111) continue;
    const [x, y] = key.split(',').map(Number);
    for (let a = 0; a < 4; a++) {
      const b = (a + 1) % 4;
      const exposed = [a, b].every((side) => !set.has(enc(x + SIDE[side][0], y + SIDE[side][1], (side + 2) % 4)));
      if (exposed) opts.push([enc(x, y, a), enc(x, y, b)]);
    }
  }
  for (const rem of r.shuffle(opts)) {
    const next = s.filter((k) => !rem.includes(k));
    if (connected(next) && !hasHole(next)) return next;
  }
  return null;
}

export function addHalf(r: Rng, s: Shape, maxDim: number): Shape | null {
  const set = new Set(s);
  const masks = cellMasks(s);
  const opts: number[][] = [];
  const seen = new Set<string>();
  for (const k of s) {
    const [x, y] = dec(k);
    for (const [dx, dy] of SIDE) {
      const nx = x + dx;
      const ny = y + dy;
      const key = `${nx},${ny}`;
      if (masks.has(key) || seen.has(key)) continue;
      seen.add(key);
      for (let a = 0; a < 4; a++) {
        const b = (a + 1) % 4;
        const touches = [a, b].some((side) => set.has(enc(nx + SIDE[side][0], ny + SIDE[side][1], (side + 2) % 4)));
        if (touches) opts.push([enc(nx, ny, a), enc(nx, ny, b)]);
      }
    }
  }
  for (const add of r.shuffle(opts)) {
    const next = [...s, ...add].sort((a, b) => a - b);
    if (okShape(next, maxDim)) return next;
  }
  return null;
}

function completeHalf(r: Rng, s: Shape, maxDim: number): Shape | null {
  const masks = cellMasks(s);
  const halves = [...masks.entries()].filter(([, m]) => HALF_MASKS.includes(m));
  for (const [key, m] of r.shuffle(halves)) {
    const [x, y] = key.split(',').map(Number);
    const add = [0, 1, 2, 3].filter((q) => !(m & (1 << q))).map((q) => enc(x, y, q));
    const next = [...s, ...add].sort((a, b) => a - b);
    if (okShape(next, maxDim)) return next;
  }
  return null;
}

// ---------- knippen ----------
function splitPieces(r: Rng, s: Shape, k: number, cfg: LevelCfg): Shape[] | null {
  const masks = [...cellMasks(s).entries()].map(([key, m]) => ({ key, m, tris: [0, 1, 2, 3].filter((q) => m & (1 << q)).map((q) => enc(Number(key.split(',')[0]), Number(key.split(',')[1]), q)) }));
  if (masks.length < k) return null;
  const owner = new Map<number, number>(); // driehoekje → stuk
  const unitOf = new Map<number, number>();
  masks.forEach((u, i) => u.tris.forEach((t) => unitOf.set(t, i)));
  const unitOwner = new Array<number>(masks.length).fill(-1);
  const seeds = r.sample(
    masks.map((_, i) => i),
    k,
  );
  seeds.forEach((u, p) => (unitOwner[u] = p));
  const adjUnits = (u: number) => [...new Set(masks[u].tris.flatMap(neighbors).map((n) => unitOf.get(n)).filter((x): x is number => x !== undefined && x !== u))];
  let guard = 0;
  while (unitOwner.includes(-1) && guard++ < 500) {
    const sizes = Array.from({ length: k }, (_, p) => unitOwner.filter((o) => o === p).length);
    const order = r.shuffle(Array.from({ length: k }, (_, p) => p)).sort((a, b) => sizes[a] - sizes[b]);
    let grown = false;
    for (const p of order) {
      const frontier = unitOwner.map((o, u) => (o === p ? adjUnits(u) : [])).flat().filter((u) => unitOwner[u] === -1);
      if (frontier.length) {
        unitOwner[r.pick(frontier)] = p;
        grown = true;
        break;
      }
    }
    if (!grown) return null;
  }
  masks.forEach((u, i) => u.tris.forEach((t) => owner.set(t, unitOwner[i])));

  // soms een heel hokje diagonaal verdelen over twee stukken
  if (r.chance(cfg.diagonalSplit)) {
    const fulls = r.shuffle(masks.filter((u) => u.m === 0b1111));
    for (const u of fulls) {
      const [x, y] = u.key.split(',').map(Number);
      const a = owner.get(u.tris[0])!;
      for (let side = 0; side < 4; side++) {
        const nb = owner.get(enc(x + SIDE[side][0], y + SIDE[side][1], (side + 2) % 4));
        if (nb === undefined || nb === a) continue;
        const other = r.chance(0.5) ? (side + 1) % 4 : (side + 3) % 4;
        const give = [enc(x, y, side), enc(x, y, other)];
        const trial = new Map(owner);
        give.forEach((t) => trial.set(t, nb));
        const pa = s.filter((t) => trial.get(t) === a);
        const pb = s.filter((t) => trial.get(t) === nb);
        if (connected(pa) && connected(pb)) {
          give.forEach((t) => owner.set(t, nb));
          break;
        }
      }
      if (owner.get(u.tris[0]) !== owner.get(u.tris[2])) break;
    }
  }

  const pieces = Array.from({ length: k }, (_, p) => s.filter((t) => owner.get(t) === p));
  if (pieces.some((p) => p.length < cfg.minPieceTris || !connected(p) || !validCells(p) || hasHole(p))) return null;
  return pieces.map(normalize);
}

// ---------- tweede goede figuur: dezelfde stukken anders gelegd ----------
function assemble(r: Rng, pieces: Shape[], maxDim: number): Shape | null {
  const order = r.shuffle(pieces.map((_, i) => i));
  let cur = new Set(rotate(pieces[order[0]], r.int(0, 3)));
  for (const pi of order.slice(1)) {
    const o = rotate(pieces[pi], r.int(0, 3));
    const cands = new Map<number, number>();
    for (const t of cur) {
      for (const n of neighbors(t)) {
        if (cur.has(n)) continue;
        for (const p of o) {
          if ((p & 3) !== (n & 3)) continue;
          const delta = n - p;
          if (cands.has(delta)) continue;
          const placed = o.map((k) => k + delta);
          if (placed.some((k) => cur.has(k))) continue;
          const contact = placed.reduce((s, k) => s + neighbors(k).filter((m) => cur.has(m)).length, 0);
          cands.set(delta, contact);
        }
      }
    }
    if (cands.size === 0) return null;
    const list = [...cands.entries()].sort((a, b) => b[1] - a[1]);
    const top = list.slice(0, Math.max(3, Math.ceil(list.length / 3)));
    const [delta] = r.pick(top);
    for (const k of o) cur.add(k + delta);
  }
  const s = normalize([...cur]);
  return okShape(s, maxDim) ? s : null;
}

// ---------- afleiders ----------
function moveCell(r: Rng, s: Shape, maxDim: number): Shape | null {
  const masks = cellMasks(s);
  const fulls = r.shuffle([...masks.entries()].filter(([, m]) => m === 0b1111).map(([k]) => k.split(',').map(Number) as [number, number]));
  for (const [x, y] of fulls.slice(0, 6)) {
    const rem = s.filter((k) => {
      const [a, b] = dec(k);
      return a !== x || b !== y;
    });
    if (!connected(rem) || hasHole(rem)) continue;
    const remMasks = cellMasks(rem);
    const spots: [number, number][] = [];
    for (const key of remMasks.keys()) {
      const [a, b] = key.split(',').map(Number);
      for (let side = 0; side < 4; side++) {
        const nx = a + SIDE[side][0];
        const ny = b + SIDE[side][1];
        if ((nx === x && ny === y) || remMasks.has(`${nx},${ny}`)) continue;
        if (rem.includes(enc(a, b, side))) spots.push([nx, ny]);
      }
    }
    for (const [nx, ny] of r.shuffle(spots)) {
      const next = normalize([...rem, ...[0, 1, 2, 3].map((q) => enc(nx, ny, q))]);
      if (okShape(next, maxDim)) return next;
    }
  }
  return null;
}

function moveCorner(r: Rng, s: Shape, maxDim: number): Shape | null {
  const cut = cutCorner(r, s);
  if (!cut) return null;
  const grown = r.chance(0.5) ? addHalf(r, cut, maxDim) ?? completeHalf(r, cut, maxDim) : completeHalf(r, cut, maxDim) ?? addHalf(r, cut, maxDim);
  return grown ? normalize(grown) : null;
}

function flipHalf(r: Rng, s: Shape, maxDim: number): Shape | null {
  const masks = cellMasks(s);
  const halves = r.shuffle([...masks.entries()].filter(([, m]) => HALF_MASKS.includes(m)));
  for (const [key, m] of halves) {
    const [x, y] = key.split(',').map(Number);
    const rest = s.filter((k) => {
      const [a, b] = dec(k);
      return a !== x || b !== y;
    });
    for (const nm of r.shuffle(HALF_MASKS.filter((h) => h !== m))) {
      const next = normalize([...rest, ...[0, 1, 2, 3].filter((q) => nm & (1 << q)).map((q) => enc(x, y, q))]);
      if (okShape(next, maxDim)) return next;
    }
  }
  return null;
}

function changeArea(r: Rng, s: Shape, maxDim: number): Shape | null {
  if (r.chance(0.5)) {
    const masks = cellMasks(s);
    for (const key of r.shuffle([...masks.keys()])) {
      const [x, y] = key.split(',').map(Number);
      const rem = normalize(
        s.filter((k) => {
          const [a, b] = dec(k);
          return a !== x || b !== y;
        }),
      );
      if (okShape(rem, maxDim)) return rem;
    }
    return null;
  }
  const masks = cellMasks(s);
  for (const key of r.shuffle([...masks.keys()])) {
    const [a, b] = key.split(',').map(Number);
    for (let side = 0; side < 4; side++) {
      const nx = a + SIDE[side][0];
      const ny = b + SIDE[side][1];
      if (masks.has(`${nx},${ny}`) || !s.includes(enc(a, b, side))) continue;
      const next = normalize([...s, ...[0, 1, 2, 3].map((q) => enc(nx, ny, q))]);
      if (okShape(next, maxDim)) return next;
    }
  }
  return null;
}

// ---------- samenstellen en controleren ----------
export function checkComponenten(it: CompItem): string[] {
  const errs: string[] = [];
  if (it.options.length !== 6) errs.push('niet 6 opties');
  for (const p of it.pieces) if (!connected(p) || !validCells(p) || hasHole(p)) errs.push('ongeldig stuk');
  for (const o of it.options) if (!connected(o) || !validCells(o) || hasHole(o)) errs.push('ongeldige optie');
  const canons = it.options.map(canon);
  if (new Set(canons).size !== canons.length) errs.push('twee opties zijn dezelfde vorm');
  const solvable: number[] = [];
  it.options.forEach((o, i) => {
    const plain = canTile(o, it.pieces, false);
    const mirrored = canTile(o, it.pieces, true);
    if (plain !== mirrored) errs.push(`optie ${i}: uitkomst verschilt met en zonder spiegelen`);
    if (mirrored) solvable.push(i);
  });
  if (solvable.length !== 2) errs.push(`${solvable.length} opties zijn te maken`);
  if (solvable.join(',') !== it.correct.join(',')) errs.push('goede antwoorden kloppen niet');
  return errs;
}

export function generateComponenten(level: Level, r: Rng): CompItem {
  const cfg = CFG[level];
  for (let attempt = 0; attempt < 400; attempt++) {
    const k = r.int(cfg.pieces[0], cfg.pieces[1]);
    const cells = polyomino(r, r.int(cfg.cells[0], cfg.cells[1]), cfg.maxDim);
    if (!cells) continue;
    let s1: Shape | null = cellsToShape(cells);
    const nh = r.int(cfg.halves[0], cfg.halves[1]);
    for (let i = 0; i < nh && s1; i++) s1 = r.chance(0.5) ? cutCorner(r, s1) : addHalf(r, s1, cfg.maxDim);
    if (!s1 || !okShape(s1, cfg.maxDim)) continue;
    s1 = normalize(s1);
    const pieces = splitPieces(r, s1, k, cfg);
    if (!pieces) continue;
    // stukken mogen niet allemaal hetzelfde 1 hokje zijn e.d.: minstens één stuk van 2+ hokjes
    if (pieces.every((p) => p.length <= 4)) continue;

    let s2: Shape | null = null;
    for (let t = 0; t < 40 && !s2; t++) {
      const cand = assemble(r, pieces, cfg.maxDim);
      if (cand && !congruent(cand, s1)) s2 = cand;
    }
    if (!s2) continue;

    const correct = [s1, s2];
    const distractors: { s: Shape; why: DistractorKind }[] = [];
    const all = () => [...correct, ...distractors.map((d) => d.s)];
    for (let t = 0; t < 60 && distractors.length < 4; t++) {
      const src = r.pick(correct);
      let cand: Shape | null = null;
      let why: DistractorKind = 'hokje';
      const roll = r.next();
      if (level === 'makkelijk') {
        if (roll < 0.5) {
          cand = changeArea(r, src, cfg.maxDim + 1);
          why = 'oppervlakte';
        } else cand = moveCell(r, src, cfg.maxDim);
      } else if (level === 'examen') {
        if (roll < 0.45) cand = moveCell(r, src, cfg.maxDim);
        else if (roll < 0.75) {
          cand = moveCorner(r, src, cfg.maxDim);
          why = 'hoek';
        } else {
          cand = flipHalf(r, src, cfg.maxDim) ?? moveCell(r, src, cfg.maxDim);
          why = cand && cand.length === src.length ? 'half' : 'hokje';
        }
        if (cand && r.chance(0.3)) {
          const twice = moveCell(r, cand, cfg.maxDim);
          if (twice) {
            cand = twice;
            why = 'anders';
          }
        }
      } else {
        if (roll < 0.4) cand = moveCell(r, src, cfg.maxDim);
        else if (roll < 0.8) {
          cand = moveCorner(r, src, cfg.maxDim);
          why = 'hoek';
        } else {
          cand = flipHalf(r, src, cfg.maxDim);
          why = 'half';
        }
      }
      if (!cand) continue;
      if (all().some((o) => congruent(o, cand!))) continue;
      if (canTile(cand, pieces, true)) continue;
      distractors.push({ s: cand, why });
    }
    if (distractors.length < 4) continue;

    const shown = [
      { s: s1, why: null as DistractorKind | null },
      { s: s2, why: null as DistractorKind | null },
      ...distractors.map((d) => ({ s: d.s, why: d.why as DistractorKind | null })),
    ];
    const order = r.shuffle(shown);
    const options = order.map((o) => rotate(o.s, r.int(0, 3)));
    const shownPieces = cfg.rotatePieces ? pieces.map((p) => rotate(p, r.int(1, 3))) : pieces;
    const item: CompItem = {
      level,
      pieces: shownPieces,
      options,
      correct: order.map((o, i) => (o.why === null ? i : -1)).filter((i) => i >= 0),
      reasons: order.map((o) => o.why),
    };
    if (checkComponenten(item).length === 0) return item;
  }
  throw new Error(`Kon geen componenten-opgave maken (${level})`);
}

/** Plaatsing van de stukken in een goede optie (voor de uitleg). */
export const solutionFor = (it: CompItem, i: number): Shape[] | null => solve(it.options[i], it.pieces, false);

