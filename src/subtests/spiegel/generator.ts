import type { Rng } from '../../core/rng';
import { type Shape, bbox, cellMasks, cellsToShape, dec, enc, normalize, triPoints } from '../../core/trigrid';
import type { Level } from '../../core/types';
import { addHalf, cutCorner, okShape, polyomino } from '../componenten/generator';

/** Een figuur: driehoekjes plus eventueel stippen (op het midden van een heel hokje). */
export interface MirrorFig {
  tris: Shape;
  dots: [number, number][];
}

export interface Variant {
  mirrored: boolean;
  /** Draaiing in graden, met de klok mee. */
  rot: number;
}

export interface SpiegelItem {
  level: Level;
  fig: MirrorFig;
  variants: Variant[];
  correct: number[];
  type: string;
}

// ---------- symmetrie ----------
function transform(f: MirrorFig, op: 'rot' | 'mir'): MirrorFig {
  const tris =
    op === 'rot'
      ? f.tris.map((k) => {
          const [x, y, q] = dec(k);
          return enc(-y - 1, x, (q + 1) % 4);
        })
      : f.tris.map((k) => {
          const [x, y, q] = dec(k);
          return enc(-x - 1, y, q === 1 ? 3 : q === 3 ? 1 : q);
        });
  const dots = f.dots.map(([x, y]) => (op === 'rot' ? [-y - 1, x] : [-x - 1, y]) as [number, number]);
  return normFig({ tris, dots });
}

export function normFig(f: MirrorFig): MirrorFig {
  const b = bbox(f.tris);
  const tris = normalize(f.tris);
  const dots = f.dots.map(([x, y]) => [x - b.minX, y - b.minY] as [number, number]).sort((a, c) => a[1] - c[1] || a[0] - c[0]);
  return { tris, dots };
}

const figKey = (f: MirrorFig): string => `${f.tris.join(',')}|${f.dots.map((d) => d.join(':')).join(',')}`;

/** De 7 niet-triviale symmetrieën van het vierkant (3 draaiingen, 4 spiegelingen), toegepast op de figuur. */
export function symmetries(f: MirrorFig): string[] {
  const base = normFig(f);
  const out: string[] = [];
  let cur = base;
  for (let i = 0; i < 3; i++) {
    cur = transform(cur, 'rot');
    out.push(figKey(cur));
  }
  let m = transform(base, 'mir');
  for (let i = 0; i < 4; i++) {
    out.push(figKey(m));
    m = transform(m, 'rot');
  }
  return out;
}

/** Heeft de figuur géén enkele draai- of spiegelsymmetrie? */
export function isAsymmetric(f: MirrorFig): boolean {
  const key = figKey(normFig(f));
  return symmetries(f).every((k) => k !== key);
}

// ---------- maken ----------
interface Cfg {
  cells: [number, number];
  halves: [number, number];
  dots: [number, number];
  step: 90 | 45;
  nearSym: number;
}
const CFG: Record<Level, Cfg> = {
  makkelijk: { cells: [4, 5], halves: [0, 0], dots: [0, 0], step: 90, nearSym: 0 },
  examen: { cells: [5, 7], halves: [0, 1], dots: [0, 0], step: 45, nearSym: 0 },
  moeilijk: { cells: [6, 8], halves: [1, 2], dots: [0, 1], step: 45, nearSym: 0.5 },
};

/** Linkerhelft plus spiegelbeeld: een figuur mét spiegelas, die daarna een klein beetje verstoord wordt. */
function symmetricBase(r: Rng): Shape | null {
  const half = polyomino(r, r.int(3, 4), 3);
  if (!half) return null;
  const cells = new Map<string, [number, number]>();
  const maxX = Math.max(...half.map((c) => c[0]));
  for (const [x, y] of half) {
    cells.set(`${x},${y}`, [x, y]);
    const mx = 2 * maxX + 1 - x;
    cells.set(`${mx},${y}`, [mx, y]);
  }
  return cellsToShape([...cells.values()]);
}

export function generateSpiegel(level: Level, r: Rng): SpiegelItem {
  const cfg = CFG[level];
  for (let attempt = 0; attempt < 500; attempt++) {
    let tris: Shape | null;
    const near = r.chance(cfg.nearSym);
    if (near) tris = symmetricBase(r);
    else {
      const cells = polyomino(r, r.int(cfg.cells[0], cfg.cells[1]), 4);
      tris = cells ? cellsToShape(cells) : null;
    }
    if (!tris) continue;
    const nh = r.int(cfg.halves[0], cfg.halves[1]);
    for (let i = 0; i < nh && tris; i++) tris = r.chance(0.5) ? cutCorner(r, tris) : addHalf(r, tris, 5);
    if (!tris || !okShape(tris, 5)) continue;
    const fulls = [...cellMasks(tris).entries()].filter(([, m]) => m === 0b1111).map(([k]) => k.split(',').map(Number) as [number, number]);
    const nd = r.int(cfg.dots[0], cfg.dots[1]);
    const dots = r.sample(fulls, Math.min(nd, fulls.length));
    const fig = normFig({ tris, dots });
    if (!isAsymmetric(fig)) continue;
    const type = near ? (dots.length ? 'bijna_symmetrisch_stip' : 'bijna_symmetrisch') : dots.length ? 'vorm_met_stip' : nh > 0 ? 'vorm_met_halve_hokjes' : 'vorm';

    const angles = cfg.step === 90 ? [0, 90, 180, 270] : [0, 45, 90, 135, 180, 225, 270, 315];
    const plainAngles = cfg.step === 90 ? r.shuffle(angles) : r.sample(angles.filter((a) => a !== 0), 4);
    const mirAngles = r.sample(angles, 2);
    const vs: Variant[] = [...plainAngles.map((rot) => ({ mirrored: false, rot })), ...mirAngles.map((rot) => ({ mirrored: true, rot }))];
    const variants = r.shuffle(vs);
    const item: SpiegelItem = { level, fig, variants, correct: variants.map((v, i) => (v.mirrored ? i : -1)).filter((i) => i >= 0), type };
    if (checkSpiegel(item).length === 0) return item;
  }
  throw new Error(`Kon geen spiegelbeeld-opgave maken (${level})`);
}

// ---------- geometrie voor controle ----------
/** Alle driehoekjes en stippen na spiegelen en draaien rond het midden (afgerond), als vergelijkbare sleutel. */
export function variantPoints(f: MirrorFig, v: Variant): string[] {
  const b = bbox(f.tris);
  const cx = b.w / 2;
  const cy = b.h / 2;
  const a = (v.rot * Math.PI) / 180;
  const tf = (x: number, y: number): string => {
    let px = x - cx;
    const py = y - cy;
    if (v.mirrored) px = -px;
    const rx = px * Math.cos(a) - py * Math.sin(a);
    const ry = px * Math.sin(a) + py * Math.cos(a);
    return `${rx.toFixed(5)},${ry.toFixed(5)}`.replace(/-0\.00000/g, '0.00000');
  };
  const pts = new Set<string>();
  for (const k of f.tris)
    pts.add(
      `T${triPoints(k)
        .map(([x, y]) => tf(x, y))
        .sort()
        .join(';')}`,
    );
  for (const [x, y] of f.dots) pts.add(`D${tf(x + 0.5, y + 0.5)}`);
  return [...pts].sort();
}

export function checkSpiegel(it: SpiegelItem): string[] {
  const errs: string[] = [];
  if (!isAsymmetric(it.fig)) errs.push('figuur is symmetrisch');
  if (it.variants.length !== 6) errs.push('niet 6 varianten');
  const keys = it.variants.map((v) => variantPoints(it.fig, v).join('|'));
  if (new Set(keys).size !== 6) errs.push('twee varianten zien er hetzelfde uit');
  const mirroredIdx = it.variants.map((v, i) => (v.mirrored ? i : -1)).filter((i) => i >= 0);
  if (mirroredIdx.length !== 2) errs.push('niet precies 2 gespiegelde varianten');
  if (mirroredIdx.join(',') !== it.correct.join(',')) errs.push('goede antwoorden kloppen niet');
  // geen gespiegelde variant mag er hetzelfde uitzien als een draaiing van het origineel
  const plainKeys = new Set([0, 45, 90, 135, 180, 225, 270, 315].map((rot) => variantPoints(it.fig, { mirrored: false, rot }).join('|')));
  for (const i of mirroredIdx) if (plainKeys.has(keys[i])) errs.push('gespiegelde variant is ook een draaiing');
  return errs;
}
