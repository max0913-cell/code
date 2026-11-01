/**
 * Figuurmodel voor exclusie. Een figuur is een lijst elementen in een vak van 100 × 100.
 * Alles wat je ziet staat in dit model, zodat regels en controles op de echte figuur werken.
 */
export type Kind = 'circle' | 'triangle' | 'square' | 'rect' | 'diamond' | 'trapezoid' | 'parallelogram' | 'pentagon' | 'hexagon';
export type Fill = 'white' | 'black';

export interface Shape {
  t: 'shape';
  kind: Kind;
  x: number;
  y: number;
  r: number;
  rot: number;
  fill: Fill;
  role: 'main' | 'inner' | 'item';
}
export interface Dot {
  t: 'dot';
  x: number;
  y: number;
  r: number;
  fill: Fill;
}
export interface Line {
  t: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
export interface Arrow {
  t: 'arrow';
  x: number;
  y: number;
  len: number;
  /** Richting in graden: 0 = omhoog, met de klok mee. */
  dir: number;
}
export interface Grid {
  t: 'grid';
  /** 9 vakjes, rij voor rij; 1 = zwart. */
  cells: number[];
}
export interface Flag {
  t: 'flag';
  base: FlagBase;
  rot: number;
  mirror: boolean;
}
export type FlagBase = 'wijzer' | 'vlag' | 'laars' | 'haak';
export type El = Shape | Dot | Line | Arrow | Grid | Flag;
export interface Fig {
  els: El[];
}

export const CORNERS: Record<Kind, number> = {
  circle: 0,
  triangle: 3,
  square: 4,
  rect: 4,
  diamond: 4,
  trapezoid: 4,
  parallelogram: 4,
  pentagon: 5,
  hexagon: 6,
};
/** Draaisymmetrie in graden (na zoveel graden ziet de vorm er weer hetzelfde uit). */
export const PERIOD: Record<Kind, number> = {
  circle: 1,
  triangle: 120,
  square: 90,
  rect: 180,
  diamond: 180,
  trapezoid: 360,
  parallelogram: 180,
  pentagon: 72,
  hexagon: 60,
};
export const NAME: Record<Kind, [string, string]> = {
  circle: ['cirkel', 'cirkels'],
  triangle: ['driehoek', 'driehoeken'],
  square: ['vierkant', 'vierkanten'],
  rect: ['rechthoek', 'rechthoeken'],
  diamond: ['ruit', 'ruiten'],
  trapezoid: ['trapezium', 'trapeziums'],
  parallelogram: ['parallellogram', 'parallellogrammen'],
  pentagon: ['vijfhoek', 'vijfhoeken'],
  hexagon: ['zeshoek', 'zeshoeken'],
};
export const QUADS: Kind[] = ['square', 'rect', 'diamond', 'trapezoid', 'parallelogram'];
export const POLYS: Kind[] = ['triangle', 'square', 'rect', 'diamond', 'trapezoid', 'parallelogram', 'pentagon', 'hexagon'];
/** Vormen die op klein formaat goed van elkaar te onderscheiden zijn. */
export const SMALL_KINDS: Kind[] = ['circle', 'triangle', 'square'];

type Pt = [number, number];

const UNIT: Record<Exclude<Kind, 'circle'>, Pt[]> = {
  triangle: [0, 120, 240].map((a) => [Math.sin((a * Math.PI) / 180), -Math.cos((a * Math.PI) / 180)] as Pt),
  square: [
    [-0.72, -0.72],
    [0.72, -0.72],
    [0.72, 0.72],
    [-0.72, 0.72],
  ],
  rect: [
    [-0.95, -0.52],
    [0.95, -0.52],
    [0.95, 0.52],
    [-0.95, 0.52],
  ],
  diamond: [
    [0, -1],
    [0.6, 0],
    [0, 1],
    [-0.6, 0],
  ],
  trapezoid: [
    [-0.5, -0.58],
    [0.5, -0.58],
    [0.95, 0.58],
    [-0.95, 0.58],
  ],
  parallelogram: [
    [-0.45, -0.55],
    [0.95, -0.55],
    [0.45, 0.55],
    [-0.95, 0.55],
  ],
  pentagon: [0, 72, 144, 216, 288].map((a) => [Math.sin((a * Math.PI) / 180), -Math.cos((a * Math.PI) / 180)] as Pt),
  hexagon: [0, 60, 120, 180, 240, 300].map((a) => [Math.sin((a * Math.PI) / 180), -Math.cos((a * Math.PI) / 180)] as Pt),
};

export function rotatePt([x, y]: Pt, deg: number): Pt {
  const a = (deg * Math.PI) / 180;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
}

export function shapePoints(s: Pick<Shape, 'kind' | 'x' | 'y' | 'r' | 'rot'>): Pt[] {
  if (s.kind === 'circle') return [];
  return UNIT[s.kind].map((p) => {
    const [x, y] = rotatePt(p, s.rot);
    return [s.x + x * s.r, s.y + y * s.r] as Pt;
  });
}

/** Afstand van een punt tot de rand van een vorm; positief = binnen. */
export function insideDistance(s: Shape, px: number, py: number): number {
  if (s.kind === 'circle') return s.r * 0.86 - Math.hypot(px - s.x, py - s.y);
  const pts = shapePoints(s);
  let inside = false;
  let minD = Infinity;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
    minD = Math.min(minD, segDist(px, py, xi, yi, xj, yj));
  }
  return inside ? minD : -minD;
}

export function segDist(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

export function segmentsIntersect(a: Line, b: Line): boolean {
  const o = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) => Math.sign((bx - ax) * (cy - ay) - (by - ay) * (cx - ax));
  const d1 = o(a.x1, a.y1, a.x2, a.y2, b.x1, b.y1);
  const d2 = o(a.x1, a.y1, a.x2, a.y2, b.x2, b.y2);
  const d3 = o(b.x1, b.y1, b.x2, b.y2, a.x1, a.y1);
  const d4 = o(b.x1, b.y1, b.x2, b.y2, a.x2, a.y2);
  return d1 !== d2 && d3 !== d4;
}

export const lineAngle = (l: Line): number => {
  const a = (Math.atan2(l.y2 - l.y1, l.x2 - l.x1) * 180) / Math.PI;
  return ((Math.round(a) % 180) + 180) % 180;
};

// ---------- raster ----------
export const cell = (g: number[], r: number, c: number): number => g[r * 3 + c];
export const gridSym = {
  v: (g: number[]) => [0, 1, 2].every((r) => cell(g, r, 0) === cell(g, r, 2)),
  h: (g: number[]) => [0, 1, 2].every((c) => cell(g, 0, c) === cell(g, 2, c)),
  d: (g: number[]) => [0, 1, 2].every((r) => [0, 1, 2].every((c) => cell(g, r, c) === cell(g, c, r))),
  a: (g: number[]) => [0, 1, 2].every((r) => [0, 1, 2].every((c) => cell(g, r, c) === cell(g, 2 - c, 2 - r))),
  r180: (g: number[]) => [0, 1, 2].every((r) => [0, 1, 2].every((c) => cell(g, r, c) === cell(g, 2 - r, 2 - c))),
  r90: (g: number[]) => [0, 1, 2].every((r) => [0, 1, 2].every((c) => cell(g, r, c) === cell(g, 2 - c, r))),
};
export const anyMirror = (g: number[]): boolean => gridSym.v(g) || gridSym.h(g) || gridSym.d(g) || gridSym.a(g);

export function gridConnected(g: number[]): boolean {
  const black = g.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
  if (black.length === 0) return false;
  const seen = new Set([black[0]]);
  const stack = [black[0]];
  while (stack.length) {
    const i = stack.pop()!;
    const r = Math.floor(i / 3);
    const c = i % 3;
    for (const [dr, dc] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const rr = r + dr;
      const cc = c + dc;
      if (rr < 0 || rr > 2 || cc < 0 || cc > 2) continue;
      const j = rr * 3 + cc;
      if (g[j] && !seen.has(j)) {
        seen.add(j);
        stack.push(j);
      }
    }
  }
  return seen.size === black.length;
}

// ---------- vlag-figuren (voor gedraaid/gespiegeld) ----------
export interface FlagGeom {
  lines: [Pt, Pt][];
  polys: { pts: Pt[]; fill: Fill }[];
  circles: { c: Pt; r: number; fill: Fill }[];
}

export const FLAG_BASES: Record<FlagBase, FlagGeom> = {
  wijzer: {
    circles: [
      { c: [0, 0], r: 0.9, fill: 'white' },
      { c: [0.62 * Math.sin((50 * Math.PI) / 180), -0.62 * Math.cos((50 * Math.PI) / 180)], r: 0.13, fill: 'black' },
    ],
    lines: [[[0, 0], [0, -0.8]]],
    polys: [],
  },
  vlag: {
    lines: [
      [
        [0, -0.9],
        [0, 0.9],
      ],
    ],
    polys: [
      {
        pts: [
          [0, -0.9],
          [0.75, -0.62],
          [0, -0.32],
        ],
        fill: 'black',
      },
    ],
    circles: [],
  },
  laars: {
    lines: [],
    polys: [
      {
        pts: [
          [-0.45, -0.9],
          [0.05, -0.9],
          [0.05, 0.4],
          [0.6, 0.4],
          [0.6, 0.9],
          [-0.45, 0.9],
        ],
        fill: 'white',
      },
    ],
    circles: [],
  },
  haak: {
    lines: [
      [
        [0, 0.85],
        [0, -0.85],
      ],
      [
        [0, -0.85],
        [0.45, -0.4],
      ],
    ],
    polys: [],
    circles: [{ c: [0, 0.85], r: 0.12, fill: 'black' }],
  },
};

/** Alle punten van een vlag na spiegelen en draaien (om symmetrie te testen). */
export function flagPoints(base: FlagBase, rot: number, mirror: boolean): Pt[] {
  const g = FLAG_BASES[base];
  const pts: Pt[] = [...g.lines.flat(), ...g.polys.flatMap((p) => p.pts), ...g.circles.map((c) => c.c)];
  return pts.map(([x, y]) => rotatePt([mirror ? -x : x, y], rot));
}

// ---------- eigenschappen ----------
const shapes = (f: Fig) => f.els.filter((e): e is Shape => e.t === 'shape');
const dots = (f: Fig) => f.els.filter((e): e is Dot => e.t === 'dot');
const lines = (f: Fig) => f.els.filter((e): e is Line => e.t === 'line');
const arrow = (f: Fig) => f.els.find((e): e is Arrow => e.t === 'arrow');
const grid = (f: Fig) => f.els.find((e): e is Grid => e.t === 'grid');
const flag = (f: Fig) => f.els.find((e): e is Flag => e.t === 'flag');
/** De hoofdfiguur: de vorm met rol 'main', of de enige vorm. Bij losse figuurtjes is er geen hoofdfiguur. */
export const mainShape = (f: Fig): Shape | undefined => {
  const ss = shapes(f);
  return ss.find((s) => s.role === 'main') ?? (ss.length === 1 ? ss[0] : undefined);
};
const inner = (f: Fig) => shapes(f).find((s) => s.role === 'inner');
export const sizeClass = (r: number): string => (r >= 28 ? 'L' : r >= 18 ? 'M' : r >= 10 ? 'S' : 'XS');
export const normRot = (s: Shape): number => (s.kind === 'circle' ? 0 : ((Math.round(s.rot) % PERIOD[s.kind]) + PERIOD[s.kind]) % PERIOD[s.kind]);

export type Feature = (f: Fig) => string | null;

/**
 * Simpele eigenschappen. Voor elke opgave controleren we dat geen van deze eigenschappen
 * een andere figuur als afwijker aanwijst dan de bedoelde.
 */
export const FEATURES: Record<string, Feature> = {
  aantal: (f) => String(f.els.filter((e) => e.t !== 'grid').length),
  aantalZwart: (f) => String(f.els.filter((e) => (e.t === 'shape' || e.t === 'dot') && e.fill === 'black').length),
  aantalWit: (f) => String(f.els.filter((e) => (e.t === 'shape' || e.t === 'dot') && e.fill === 'white').length),
  aantalVormen: (f) => String(shapes(f).length),
  aantalStippen: (f) => String(dots(f).length),
  aantalLijnen: (f) => String(lines(f).length),
  pariteit: (f) => String(f.els.filter((e) => e.t !== 'grid').length % 2),
  vorm: (f) => mainShape(f)?.kind ?? null,
  vulling: (f) => mainShape(f)?.fill ?? null,
  grootte: (f) => (mainShape(f) ? sizeClass(mainShape(f)!.r) : null),
  draaiing: (f) => (mainShape(f) ? String(normRot(mainShape(f)!)) : null),
  hoekenHoofd: (f) => (mainShape(f) ? String(CORNERS[mainShape(f)!.kind]) : null),
  hoekenTotaal: (f) => (shapes(f).length ? String(shapes(f).reduce((s, x) => s + CORNERS[x.kind], 0)) : null),
  vormenSet: (f) => (shapes(f).length ? shapes(f).map((s) => s.kind).sort().join(',') : null),
  aantalSoorten: (f) => (shapes(f).length ? String(new Set(shapes(f).map((s) => s.kind)).size) : null),
  gebogen: (f) => (shapes(f).length ? String(shapes(f).some((s) => s.kind === 'circle')) : null),
  groottes: (f) => (shapes(f).length ? shapes(f).map((s) => sizeClass(s.r)).sort().join(',') : null),
  allesZelfdeKleur: (f) => {
    const fills = [...shapes(f), ...dots(f)].map((s) => s.fill);
    return fills.length ? String(new Set(fills).size === 1) : null;
  },
  zwartMinWit: (f) => {
    const sd = [...shapes(f), ...dots(f)];
    return sd.length ? String(sd.filter((s) => s.fill === 'black').length - sd.filter((s) => s.fill === 'white').length) : null;
  },
  pijlRichting: (f) => (arrow(f) ? String(arrow(f)!.dir) : null),
  pijlGrootte: (f) => (arrow(f) ? (arrow(f)!.len >= 40 ? 'L' : 'S') : null),
  zwarteVakjes: (f) => (grid(f) ? String(grid(f)!.cells.reduce((a, b) => a + b, 0)) : null),
  spiegelsymmetrisch: (f) => (grid(f) ? String(anyMirror(grid(f)!.cells)) : null),
  puntsymmetrisch: (f) => (grid(f) ? String(gridSym.r180(grid(f)!.cells)) : null),
  aaneengesloten: (f) => (grid(f) ? String(gridConnected(grid(f)!.cells)) : null),
  gespiegeld: (f) => (flag(f) ? String(flag(f)!.mirror) : null),
  vlagDraaiing: (f) => (flag(f) ? String(((flag(f)!.rot % 360) + 360) % 360) : null),
  binnenGelijkAanBuiten: (f) => {
    const i = inner(f);
    const m = shapes(f).find((s) => s.role === 'main');
    return i && m ? String(i.kind === m.kind) : null;
  },
  binnenMinBuitenHoeken: (f) => {
    const i = inner(f);
    const m = shapes(f).find((s) => s.role === 'main');
    return i && m ? String(CORNERS[i.kind] - CORNERS[m.kind]) : null;
  },
  stippenBinnen: (f) => {
    const m = shapes(f).find((s) => s.role === 'main');
    return m && dots(f).length ? String(dots(f).every((d) => insideDistance(m, d.x, d.y) > 0)) : null;
  },
  stippenMinHoeken: (f) => {
    const m = shapes(f).find((s) => s.role === 'main');
    return m && dots(f).length ? String(dots(f).length - CORNERS[m.kind]) : null;
  },
  evenwijdig: (f) => (lines(f).length >= 2 ? String(new Set(lines(f).map(lineAngle)).size === 1) : null),
};

/**
 * Kijk of een rij waarden één afwijker heeft: vier dezelfde en één andere.
 * Geeft de index van de afwijker terug, of -1.
 */
export function oddOneOut(values: (string | null)[]): number {
  if (values.length !== 5 || values.some((v) => v === null)) return -1;
  for (let i = 0; i < 5; i++) {
    const others = values.filter((_, j) => j !== i);
    if (others.every((v) => v === others[0]) && values[i] !== others[0]) return i;
  }
  return -1;
}
