import type { Rng } from '../../core/rng';
import { LETTERS, type Level } from '../../core/types';
import {
  type Arrow,
  CORNERS,
  type Dot,
  FEATURES,
  type Fig,
  type Fill,
  FLAG_BASES,
  type FlagBase,
  type Kind,
  type Line,
  NAME,
  PERIOD,
  QUADS,
  SMALL_KINDS,
  type Shape,
  anyMirror,
  gridConnected,
  gridSym,
  insideDistance,
  segmentsIntersect,
  sizeClass,
} from './model';

// ---------- eigenschappen die meerdere figuren vergelijken of richting gebruiken ----------
const shapesOf = (f: Fig) => f.els.filter((e): e is Shape => e.t === 'shape');
const dirTo = (x1: number, y1: number, x2: number, y2: number): number =>
  ((Math.round((Math.atan2(x2 - x1, -(y2 - y1)) * 180) / Math.PI) % 360) + 360) % 360;

function mappingFeature(figs: Fig[], key: (s: Shape) => string): (string | null)[] {
  const all = figs.flatMap((f, i) => shapesOf(f).map((s) => ({ s, i })));
  const keys = [...new Set(all.map((x) => key(x.s)))];
  // Alleen zinvol als minstens twee soorten elk in minstens twee figuren voorkomen.
  const spread = keys.filter((k) => new Set(all.filter((x) => key(x.s) === k).map((x) => x.i)).size >= 2);
  if (spread.length < 2) return figs.map(() => null);
  const major = new Map<string, Fill>();
  for (const k of keys) {
    const fills = all.filter((x) => key(x.s) === k).map((x) => x.s.fill);
    const b = fills.filter((f) => f === 'black').length;
    const w = fills.length - b;
    if (b === w) return figs.map(() => null);
    major.set(k, b > w ? 'black' : 'white');
  }
  return figs.map((f) => (shapesOf(f).length ? String(shapesOf(f).every((s) => major.get(key(s)) === s.fill)) : null));
}

/** Alle eigenschappen, als functie op de vijf figuren tegelijk. */
export const ALL_FEATURES: Record<string, (figs: Fig[]) => (string | null)[]> = {
  ...Object.fromEntries(Object.entries(FEATURES).map(([k, f]) => [k, (figs: Fig[]) => figs.map(f)])),
  vormBepaaltKleur: (figs) => mappingFeature(figs, (s) => s.kind),
  grootteBepaaltKleur: (figs) => mappingFeature(figs, (s) => sizeClass(s.r)),
  pijlNaarZwart: (figs) =>
    figs.map((f) => {
      const a = f.els.find((e): e is Arrow => e.t === 'arrow');
      const d = f.els.find((e): e is Dot => e.t === 'dot' && e.fill === 'black');
      return a && d ? String(dirTo(a.x, a.y, d.x, d.y) === a.dir) : null;
    }),
  pijlNaarMeesteHoeken: (figs) =>
    figs.map((f) => {
      const a = f.els.find((e): e is Arrow => e.t === 'arrow');
      const ss = shapesOf(f);
      if (!a || ss.length < 2) return null;
      const target = ss.find((s) => dirTo(a.x, a.y, s.x, s.y) === a.dir);
      const max = Math.max(...ss.map((s) => CORNERS[s.kind]));
      return target ? String(CORNERS[target.kind] === max) : 'false';
    }),
  aantalIsHoeken: (figs) =>
    figs.map((f) => {
      const ss = shapesOf(f);
      if (ss.length === 0 || f.els.length !== ss.length) return null;
      return String(new Set(ss.map((s) => s.kind)).size === 1 && ss.length === CORNERS[ss[0].kind]);
    }),
};

// ---------- hulpfuncties voor het maken van figuren ----------
const SLOTS: [number, number][] = [22, 50, 78].flatMap((y) => [22, 50, 78].map((x) => [x, y] as [number, number]));
const ROTS = [0, 15, 30, 45, 60, 75];
const fills = (r: Rng): Fill => (r.chance(0.5) ? 'black' : 'white');
const otherFill = (f: Fill): Fill => (f === 'black' ? 'white' : 'black');

function rotFor(r: Rng, kind: Kind): number {
  if (kind === 'circle') return 0;
  const options = ROTS.filter((x) => x % PERIOD[kind] !== 0 || x === 0).filter((x) => !(kind === 'square' && x === 45));
  return r.pick(options);
}

function single(kind: Kind, fill: Fill, rad: number, rot: number): Fig {
  return { els: [{ t: 'shape', kind, x: 50, y: 50, r: rad, rot, fill, role: 'main' }] };
}

function items(r: Rng, list: { kind: Kind; fill: Fill; r?: number }[]): Fig {
  const slots = r.sample(SLOTS, list.length);
  return {
    els: list.map((it, i) => ({
      t: 'shape' as const,
      kind: it.kind,
      x: slots[i][0],
      y: slots[i][1],
      r: it.r ?? (it.kind === 'triangle' ? 11.5 : 10),
      rot: 0,
      fill: it.fill,
      role: 'item' as const,
    })),
  };
}

function placeDots(r: Rng, main: Shape, n: number, outside = 0): Dot[] | null {
  const dots: Dot[] = [];
  const ok = (x: number, y: number) => dots.every((d) => Math.hypot(d.x - x, d.y - y) >= 13);
  for (let tries = 0; tries < 600 && dots.length < n - outside; tries++) {
    const x = r.int(14, 86);
    const y = r.int(14, 86);
    if (insideDistance(main, x, y) >= 8 && ok(x, y)) dots.push({ t: 'dot', x, y, r: 4.5, fill: 'black' });
  }
  if (dots.length < n - outside) return null;
  const corners = r.shuffle<[number, number]>([
    [10, 10],
    [90, 10],
    [10, 90],
    [90, 90],
  ]);
  for (const [x, y] of corners) {
    if (dots.length >= n) break;
    if (insideDistance(main, x, y) <= -6 && ok(x, y)) dots.push({ t: 'dot', x, y, r: 4.5, fill: 'black' });
  }
  return dots.length === n ? dots : null;
}

export const L = (idx: number[]): string => {
  const ls = idx.map((i) => LETTERS[i]);
  return ls.length > 1 ? `${ls.slice(0, -1).join(', ')} en ${ls[ls.length - 1]}` : ls[0];
};
const others = (odd: number) => [0, 1, 2, 3, 4].filter((i) => i !== odd);
const kleur = (f: Fill) => (f === 'black' ? 'zwart' : 'wit');
const DIR_NAME: Record<number, string> = { 0: 'boven', 45: 'rechtsboven', 90: 'rechts', 135: 'rechtsonder', 180: 'onder', 225: 'linksonder', 270: 'links', 315: 'linksboven' };

export interface Rule {
  id: string;
  level: Level;
  /** De eigenschap die de afwijker aanwijst. */
  feature: string;
  /** Andere eigenschappen die logisch uit de regel volgen en dezelfde afwijker mogen aanwijzen. */
  allowed: string[];
  gen(r: Rng, odd: number): Fig[] | null;
  explain(figs: Fig[], odd: number): string;
}

const kindsOf = (f: Fig) => shapesOf(f).map((s) => s.kind);
const countOf = (f: Fig) => f.els.length;

// ---------- MAKKELIJK ----------
const makkelijk: Rule[] = [
  {
    id: 'vorm',
    level: 'makkelijk',
    feature: 'vorm',
    allowed: ['hoekenHoofd', 'hoekenTotaal', 'vormenSet', 'gebogen', 'draaiing'],
    gen: (r, odd) => {
      const [k1, k2] = r.sample<Kind>(['circle', 'triangle', 'square', 'pentagon', 'hexagon'], 2);
      return [0, 1, 2, 3, 4].map((i) => {
        const k = i === odd ? k2 : k1;
        return single(k, fills(r), r.pick([24, 34]), rotFor(r, k));
      });
    },
    explain: (f, odd) => `Bij ${L(others(odd))} zie je steeds een ${NAME[kindsOf(f[others(odd)[0]])[0]][0]}. Figuur ${LETTERS[odd]} is een ${NAME[kindsOf(f[odd])[0]][0]}.`,
  },
  {
    id: 'aantal',
    level: 'makkelijk',
    feature: 'aantal',
    allowed: ['aantalVormen', 'aantalZwart', 'aantalWit', 'hoekenTotaal', 'pariteit', 'vormenSet', 'groottes', 'zwartMinWit'],
    gen: (r, odd) => {
      const n = r.int(3, 6);
      const n2 = n + r.pick([-1, 1]);
      return [0, 1, 2, 3, 4].map((i) => {
        const k = r.pick(SMALL_KINDS);
        const fl = fills(r);
        return items(r, Array.from({ length: i === odd ? n2 : n }, () => ({ kind: k, fill: fl })));
      });
    },
    explain: (f, odd) => `Bij ${L(others(odd))} staan steeds ${countOf(f[others(odd)[0]])} figuurtjes. Bij ${LETTERS[odd]} staan er ${countOf(f[odd])}.`,
  },
  {
    id: 'vulling',
    level: 'makkelijk',
    feature: 'vulling',
    allowed: ['aantalZwart', 'aantalWit', 'zwartMinWit', 'grootteBepaaltKleur', 'vormBepaaltKleur'],
    gen: (r, odd) => {
      const fl = fills(r);
      const ks = r.sample<Kind>(['triangle', 'square', 'pentagon', 'hexagon', 'rect', 'diamond', 'trapezoid'], 5);
      return ks.map((k, i) => single(k, i === odd ? otherFill(fl) : fl, r.pick([24, 34]), rotFor(r, k)));
    },
    explain: (f, odd) => {
      const fl = shapesOf(f[others(odd)[0]])[0].fill;
      return `Bij ${L(others(odd))} is de figuur ${kleur(fl)}. Figuur ${LETTERS[odd]} is ${kleur(otherFill(fl))}. De vorm maakt niet uit.`;
    },
  },
  {
    id: 'gebogen',
    level: 'makkelijk',
    feature: 'gebogen',
    allowed: ['hoekenHoofd', 'hoekenTotaal'],
    gen: (r, odd) => {
      const ks = r.sample<Kind>(['triangle', 'square', 'pentagon', 'hexagon', 'rect', 'diamond'], 4);
      let j = 0;
      return [0, 1, 2, 3, 4].map((i) => {
        const k = i === odd ? 'circle' : ks[j++];
        return single(k, fills(r), r.pick([24, 34]), rotFor(r, k));
      });
    },
    explain: (_f, odd) => `De figuren ${L(others(odd))} hebben alleen rechte zijden. Figuur ${LETTERS[odd]} is een cirkel: die heeft een gebogen rand.`,
  },
  {
    id: 'grootte',
    level: 'makkelijk',
    feature: 'grootte',
    allowed: ['groottes'],
    gen: (r, odd) => {
      const big = r.chance(0.5);
      const ks = r.sample<Kind>(['triangle', 'square', 'pentagon', 'hexagon', 'rect', 'diamond', 'trapezoid'], 5);
      return ks.map((k, i) => single(k, fills(r), (i === odd) === big ? 17 : 36, rotFor(r, k)));
    },
    explain: (f, odd) => {
      const big = shapesOf(f[odd])[0].r < 20;
      return `Bij ${L(others(odd))} is de figuur ${big ? 'groot' : 'klein'}. Figuur ${LETTERS[odd]} is ${big ? 'klein' : 'groot'}. Vorm en kleur maken niet uit.`;
    },
  },
  {
    id: 'vierhoeken',
    level: 'makkelijk',
    feature: 'hoekenHoofd',
    allowed: ['hoekenTotaal'],
    gen: (r, odd) => {
      const qs = r.sample(QUADS, 4);
      const ok = r.pick<Kind>(['triangle', 'pentagon', 'hexagon']);
      let j = 0;
      return [0, 1, 2, 3, 4].map((i) => {
        const k = i === odd ? ok : qs[j++];
        return single(k, fills(r), r.pick([26, 34]), rotFor(r, k));
      });
    },
    explain: (f, odd) => `De figuren ${L(others(odd))} hebben allemaal vier hoeken (ook al zijn het verschillende vormen). Figuur ${LETTERS[odd]} heeft er ${CORNERS[kindsOf(f[odd])[0]]}.`,
  },
  {
    id: 'zelfde_vormen',
    level: 'makkelijk',
    feature: 'aantalSoorten',
    allowed: ['vormenSet', 'hoekenTotaal', 'allesZelfdeKleur'],
    gen: (r, odd) =>
      [0, 1, 2, 3, 4].map((i) => {
        const k = r.pick(SMALL_KINDS);
        const n = r.int(3, 5);
        const fl = fills(r);
        const list = Array.from({ length: n }, () => ({ kind: k, fill: fl }));
        if (i === odd) list[0] = { kind: r.pick(SMALL_KINDS.filter((x) => x !== k)), fill: fl };
        return items(r, list);
      }),
    explain: (f, odd) => {
      const ks = kindsOf(f[odd]);
      const counts = new Map<Kind, number>();
      ks.forEach((k) => counts.set(k, (counts.get(k) ?? 0) + 1));
      const minority = [...counts.entries()].sort((a, b) => a[1] - b[1])[0][0];
      return `Bij ${L(others(odd))} hebben alle figuurtjes dezelfde vorm. Bij ${LETTERS[odd]} niet: daar staat een ${NAME[minority][0]} tussen.`;
    },
  },
  {
    id: 'binnen_gelijk',
    level: 'makkelijk',
    feature: 'binnenGelijkAanBuiten',
    allowed: ['aantalSoorten', 'vormenSet', 'hoekenTotaal', 'binnenMinBuitenHoeken'],
    gen: (r, odd) => {
      const ks = r.sample<Kind>(['triangle', 'square', 'pentagon', 'hexagon', 'diamond'], 5);
      return ks.map((k, i) => {
        const ik = i === odd ? r.pick(['triangle', 'square', 'pentagon', 'hexagon'].filter((x) => x !== k) as Kind[]) : k;
        const rot = rotFor(r, k);
        return {
          els: [
            { t: 'shape', kind: k, x: 50, y: 50, r: 40, rot, fill: 'white', role: 'main' },
            { t: 'shape', kind: ik, x: 50, y: 50, r: 14, rot, fill: fills(r), role: 'inner' },
          ],
        } as Fig;
      });
    },
    explain: (f, odd) => {
      const [o, i] = kindsOf(f[odd]);
      return `Bij ${L(others(odd))} heeft de kleine figuur dezelfde vorm als de grote. Bij ${LETTERS[odd]} niet: een ${NAME[i][0]} in een ${NAME[o][0]}.`;
    },
  },
  {
    id: 'pijl_richting',
    level: 'makkelijk',
    feature: 'pijlRichting',
    allowed: [],
    gen: (r, odd) => {
      const [d1, d2] = r.sample([0, 90, 180, 270], 2);
      return [0, 1, 2, 3, 4].map((i) => ({
        els: [{ t: 'arrow', x: 50 + r.int(-10, 10), y: 50 + r.int(-10, 10), len: r.pick([30, 44, 56]), dir: i === odd ? d2 : d1 } as Arrow],
      }));
    },
    explain: (f, odd) => {
      const a = (x: Fig) => (x.els[0] as Arrow).dir;
      return `Bij ${L(others(odd))} wijst de pijl naar ${DIR_NAME[a(f[others(odd)[0]])]}. Bij ${LETTERS[odd]} wijst de pijl naar ${DIR_NAME[a(f[odd])]}.`;
    },
  },
];

// ---------- EXAMEN ----------
function randomGrid(r: Rng, n: number): number[] {
  const g = Array(9).fill(0);
  for (const i of r.sample([0, 1, 2, 3, 4, 5, 6, 7, 8], n)) g[i] = 1;
  return g;
}
function gridWhere(r: Rng, lo: number, hi: number, pred: (g: number[]) => boolean): number[] | null {
  for (let t = 0; t < 400; t++) {
    const g = randomGrid(r, r.int(lo, hi));
    if (pred(g)) return g;
  }
  return null;
}
const gridFig = (cells: number[]): Fig => ({ els: [{ t: 'grid', cells }] });

function parallelLines(r: Rng, angle: number, n: number): Line[] | null {
  const a = (angle * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const nx = -dy;
  const ny = dx;
  const offsets = n === 3 ? [-20, 0, 20] : [-27, -9, 9, 27];
  const out: Line[] = [];
  for (const o of offsets) {
    const len = r.int(34, 60);
    const sh = r.int(-6, 6);
    const cx = 50 + o * nx + sh * dx;
    const cy = 50 + o * ny + sh * dy;
    const l: Line = { t: 'line', x1: cx - (dx * len) / 2, y1: cy - (dy * len) / 2, x2: cx + (dx * len) / 2, y2: cy + (dy * len) / 2 };
    if ([l.x1, l.y1, l.x2, l.y2].some((v) => v < 8 || v > 92)) return null;
    out.push(l);
  }
  return out;
}

function rotateLine(l: Line, deg: number): Line {
  const cx = (l.x1 + l.x2) / 2;
  const cy = (l.y1 + l.y2) / 2;
  const a = (deg * Math.PI) / 180;
  const rot = (x: number, y: number): [number, number] => [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)];
  const [x1, y1] = rot(l.x1, l.y1);
  const [x2, y2] = rot(l.x2, l.y2);
  return { t: 'line', x1, y1, x2, y2 };
}

const RING = (k: number, rad = 37): [number, number] => [50 + rad * Math.sin((k * 45 * Math.PI) / 180), 50 - rad * Math.cos((k * 45 * Math.PI) / 180)];

const FLAG_HINT: Record<FlagBase, string> = {
  wijzer: 'Kijk waar de stip zit ten opzichte van de wijzer: bij de andere met de klok mee, bij de afwijker tegen de klok in.',
  vlag: 'Houd de stok rechtop met de vlag boven: bij de andere wappert de vlag dan naar rechts, bij de afwijker naar links.',
  laars: 'Draai de figuur rechtop: bij de andere wijst de voet naar rechts, bij de afwijker naar links.',
  haak: 'Zet de stip onderaan: bij de andere wijst het haakje naar rechts, bij de afwijker naar links.',
};

const examen: Rule[] = [
  {
    id: 'even_aantal',
    level: 'examen',
    feature: 'pariteit',
    allowed: [],
    gen: (r, odd) => {
      const evens = r.shuffle([2, 4, 6, 8]);
      let j = 0;
      return [0, 1, 2, 3, 4].map((i) => {
        const n = i === odd ? r.pick([3, 5, 7]) : evens[j++];
        return items(r, Array.from({ length: n }, () => ({ kind: r.pick(SMALL_KINDS), fill: fills(r) })));
      });
    },
    explain: (f, odd) => `Tel de figuurtjes. Bij ${L(others(odd))} is het aantal even (${others(odd).map((i) => countOf(f[i])).join(', ')}). Bij ${LETTERS[odd]} zijn het er ${countOf(f[odd])}: een oneven aantal.`,
  },
  {
    id: 'gespiegeld',
    level: 'examen',
    feature: 'gespiegeld',
    allowed: [],
    gen: (r, odd) => {
      const base = r.pick(Object.keys(FLAG_BASES) as FlagBase[]);
      const rots = r.sample([0, 45, 90, 135, 180, 225, 270, 315], 5);
      return rots.map((rot, i) => ({ els: [{ t: 'flag', base, rot, mirror: i === odd }] }) as Fig);
    },
    explain: (f, odd) => {
      const base = (f[0].els[0] as { base: FlagBase }).base;
      return `De figuren ${L(others(odd))} zijn dezelfde figuur, alleen gedraaid. Figuur ${LETTERS[odd]} is gespiegeld: die kun je niet zo draaien dat hij op de andere lijkt. ${FLAG_HINT[base]}`;
    },
  },
  {
    id: 'zwart_is_wit',
    level: 'examen',
    feature: 'zwartMinWit',
    allowed: [],
    gen: (r, odd) => {
      const ps = r.shuffle([1, 2, 3, 4]);
      let j = 0;
      return [0, 1, 2, 3, 4].map((i) => {
        let b: number;
        let w: number;
        if (i === odd) [b, w] = r.pick([[3, 1], [1, 3], [4, 2], [2, 4], [5, 3], [3, 5]]);
        else b = w = ps[j++];
        const list = [...Array.from({ length: b }, () => ({ kind: r.pick(SMALL_KINDS), fill: 'black' as Fill })), ...Array.from({ length: w }, () => ({ kind: r.pick(SMALL_KINDS), fill: 'white' as Fill }))];
        return items(r, list);
      });
    },
    explain: (f, odd) => {
      const b = shapesOf(f[odd]).filter((s) => s.fill === 'black').length;
      return `Bij ${L(others(odd))} zijn er evenveel zwarte als witte figuurtjes. Bij ${LETTERS[odd]} zijn er ${b} zwart en ${countOf(f[odd]) - b} wit.`;
    },
  },
  {
    id: 'evenwijdig',
    level: 'examen',
    feature: 'evenwijdig',
    allowed: [],
    gen: (r, odd) => {
      const angles = r.sample([0, 30, 45, 60, 90, 120, 135, 150], 5);
      const n = r.pick([3, 4]);
      const figs: Fig[] = [];
      for (let i = 0; i < 5; i++) {
        const ls = parallelLines(r, angles[i], n);
        if (!ls) return null;
        if (i === odd) {
          const k = r.int(0, n - 1);
          const turned = rotateLine(ls[k], r.pick([35, 45, 60, 90, -35, -45, -60]));
          if ([turned.x1, turned.y1, turned.x2, turned.y2].some((v) => v < 6 || v > 94)) return null;
          if (ls.some((l, j) => j !== k && segmentsIntersect(l, turned))) return null;
          ls[k] = turned;
        }
        figs.push({ els: ls });
      }
      return figs;
    },
    explain: (_f, odd) => `Bij ${L(others(odd))} lopen alle lijnen evenwijdig: in dezelfde richting. Bij ${LETTERS[odd]} staat één lijn schuin ten opzichte van de andere.`,
  },
  {
    id: 'symmetrisch',
    level: 'examen',
    feature: 'spiegelsymmetrisch',
    allowed: ['puntsymmetrisch'],
    gen: (r, odd) => {
      const figs: Fig[] = [];
      for (let i = 0; i < 5; i++) {
        const g = i === odd
          ? gridWhere(r, 3, 6, (x) => !anyMirror(x) && !gridSym.r180(x))
          : gridWhere(r, 3, 6, (x) => (gridSym.v(x) || gridSym.h(x)) && !gridSym.r90(x));
        if (!g) return null;
        figs.push(gridFig(g));
      }
      return figs;
    },
    explain: (_f, odd) => `De figuren ${L(others(odd))} zijn spiegelsymmetrisch: je kunt er een spiegellijn door trekken, zodat de ene helft het spiegelbeeld van de andere is. Figuur ${LETTERS[odd]} heeft geen spiegellijn.`,
  },
  {
    id: 'aaneengesloten',
    level: 'examen',
    feature: 'aaneengesloten',
    allowed: [],
    gen: (r, odd) => {
      const figs: Fig[] = [];
      for (let i = 0; i < 5; i++) {
        const g = gridWhere(r, 3, 5, (x) => gridConnected(x) !== (i === odd));
        if (!g) return null;
        figs.push(gridFig(g));
      }
      return figs;
    },
    explain: (_f, odd) => `Bij ${L(others(odd))} raken alle zwarte vakjes elkaar met een zijde: ze vormen één geheel. Bij ${LETTERS[odd]} ligt minstens één zwart vakje los (hooguit met een hoekpunt tegen de andere aan).`,
  },
  {
    id: 'pijl_naar_zwart',
    level: 'examen',
    feature: 'pijlNaarZwart',
    allowed: [],
    gen: (r, odd) =>
      [0, 1, 2, 3, 4].map((i) => {
        const [kb, kw] = r.sample([0, 1, 2, 3, 4, 5, 6, 7], 2);
        const [bx, by] = RING(kb);
        const [wx, wy] = RING(kw);
        return {
          els: [
            { t: 'arrow', x: 50, y: 50, len: 36, dir: (i === odd ? kw : kb) * 45 },
            { t: 'dot', x: bx, y: by, r: 6.5, fill: 'black' },
            { t: 'dot', x: wx, y: wy, r: 6.5, fill: 'white' },
          ],
        } as Fig;
      }),
    explain: (_f, odd) => `Bij ${L(others(odd))} wijst de pijl naar de zwarte stip. Bij ${LETTERS[odd]} wijst de pijl naar de witte stip.`,
  },
  {
    id: 'stippen_binnen',
    level: 'examen',
    feature: 'stippenBinnen',
    allowed: [],
    gen: (r, odd) => {
      const ks = r.sample<Kind>(['triangle', 'square', 'pentagon', 'hexagon', 'diamond', 'rect'], 5);
      const figs: Fig[] = [];
      for (let i = 0; i < 5; i++) {
        const main: Shape = { t: 'shape', kind: ks[i], x: 50, y: ks[i] === 'triangle' ? 56 : 50, r: ks[i] === 'triangle' ? 44 : ks[i] === 'diamond' ? 40 : 34, rot: 0, fill: 'white', role: 'main' };
        const ds = placeDots(r, main, r.int(3, 5), i === odd ? 1 : 0);
        if (!ds) return null;
        figs.push({ els: [main, ...ds] });
      }
      return figs;
    },
    explain: (_f, odd) => `Bij ${L(others(odd))} liggen alle stippen binnen de grote figuur. Bij ${LETTERS[odd]} ligt één stip erbuiten.`,
  },
];

// ---------- MOEILIJK ----------
const BY_CORNERS: Record<number, Kind[]> = { 3: ['triangle'], 4: ['square', 'diamond', 'trapezoid'], 5: ['pentagon'], 6: ['hexagon'] };

const moeilijk: Rule[] = [
  {
    id: 'stippen_hoeken',
    level: 'moeilijk',
    feature: 'stippenMinHoeken',
    allowed: [],
    gen: (r, odd) => {
      const delta = r.pick([-1, 0, 1]);
      const cs = r.shuffle([3, 4, 5, 6, r.pick([3, 4, 5, 6])]);
      if (new Set(cs).size < 3) return null;
      const figs: Fig[] = [];
      for (let i = 0; i < 5; i++) {
        const k = r.pick(BY_CORNERS[cs[i]]);
        const main: Shape = { t: 'shape', kind: k, x: 50, y: k === 'triangle' ? 56 : 50, r: k === 'triangle' ? 46 : 42, rot: 0, fill: 'white', role: 'main' };
        let n = cs[i] + delta;
        if (i === odd) n += r.pick([-1, 1]);
        if (n < 1 || n > 7) return null;
        const ds = placeDots(r, main, n);
        if (!ds) return null;
        figs.push({ els: [main, ...ds] });
      }
      return figs;
    },
    explain: (f, odd) => {
      const delta = f[others(odd)[0]].els.length - 1 - CORNERS[shapesOf(f[others(odd)[0]])[0].kind];
      const rule = delta === 0 ? 'zijn er evenveel stippen als hoeken' : delta < 0 ? 'is het aantal stippen één minder dan het aantal hoeken' : 'is het aantal stippen één meer dan het aantal hoeken';
      const oc = CORNERS[shapesOf(f[odd])[0].kind];
      const od = f[odd].els.length - 1;
      return `Bij ${L(others(odd))} ${rule}. Bij ${LETTERS[odd]} niet: ${oc} hoeken en ${od} ${od === 1 ? 'stip' : 'stippen'}.`;
    },
  },
  {
    id: 'binnen_hoek_meer',
    level: 'moeilijk',
    feature: 'binnenMinBuitenHoeken',
    allowed: [],
    gen: (r, odd) => {
      const outs = r.shuffle([3, 4, 5, r.pick([3, 4, 5]), r.pick([3, 4, 5])]);
      return outs.map((oc, i) => {
        let ic = oc + 1;
        if (i === odd) ic = r.pick([oc - 1, oc + 2].filter((x) => x >= 3 && x <= 6));
        const ok = r.pick(BY_CORNERS[oc]);
        const ik = r.pick(BY_CORNERS[ic].filter((x) => x !== 'trapezoid'));
        return {
          els: [
            { t: 'shape', kind: ok, x: 50, y: ok === 'triangle' ? 56 : 50, r: ok === 'triangle' ? 46 : 40, rot: 0, fill: 'white', role: 'main' },
            { t: 'shape', kind: ik, x: 50, y: ok === 'triangle' ? 60 : 50, r: 13, rot: 0, fill: fills(r), role: 'inner' },
          ],
        } as Fig;
      });
    },
    explain: (f, odd) => {
      const [o, i] = kindsOf(f[odd]);
      return `Bij ${L(others(odd))} heeft de binnenfiguur één hoek meer dan de buitenfiguur (bijvoorbeeld een vierkant in een driehoek). Bij ${LETTERS[odd]} heeft de buitenfiguur ${CORNERS[o]} hoeken en de binnenfiguur ${CORNERS[i]}.`;
    },
  },
  {
    id: 'vorm_bepaalt_kleur',
    level: 'moeilijk',
    feature: 'vormBepaaltKleur',
    allowed: [],
    gen: (r, odd) => {
      const [k1, k2] = r.sample(SMALL_KINDS, 2);
      const f1 = fills(r);
      const map = (k: Kind): Fill => (k === k1 ? f1 : otherFill(f1));
      return [0, 1, 2, 3, 4].map((i) => {
        const n = r.int(3, 5);
        const list = Array.from({ length: n }, (_, j) => {
          const k = j === 0 ? k1 : j === 1 ? k2 : r.pick([k1, k2]);
          return { kind: k, fill: map(k) };
        });
        if (i === odd) {
          const j = r.int(0, n - 1);
          list[j] = { ...list[j], fill: otherFill(list[j].fill) };
        }
        return items(r, list);
      });
    },
    explain: (f, odd) => {
      const all = others(odd).flatMap((i) => shapesOf(f[i]));
      const kinds = [...new Set(all.map((s) => s.kind))];
      const desc = kinds.map((k) => `alle ${NAME[k][1]} ${kleur(all.find((s) => s.kind === k)!.fill)}`).join(' en ');
      const bad = shapesOf(f[odd]).find((s) => all.find((a) => a.kind === s.kind)!.fill !== s.fill)!;
      return `Twee eigenschappen horen bij elkaar: de vorm bepaalt de kleur. Bij ${L(others(odd))} zijn ${desc}. Bij ${LETTERS[odd]} is er een ${NAME[bad.kind][0]} ${kleur(bad.fill)}.`;
    },
  },
  {
    id: 'zwart_een_meer',
    level: 'moeilijk',
    feature: 'zwartMinWit',
    allowed: [],
    gen: (r, odd) => {
      const ws = r.shuffle([1, 2, 3, 4]);
      let j = 0;
      return [0, 1, 2, 3, 4].map((i) => {
        const w0 = i === odd ? r.int(1, 3) : ws[j++];
        const [b, w] = i === odd ? [w0, w0 + 1] : [w0 + 1, w0];
        const list = [...Array.from({ length: b }, () => ({ kind: r.pick(SMALL_KINDS), fill: 'black' as Fill })), ...Array.from({ length: w }, () => ({ kind: r.pick(SMALL_KINDS), fill: 'white' as Fill }))];
        return items(r, list);
      });
    },
    explain: (f, odd) => {
      const b = shapesOf(f[odd]).filter((s) => s.fill === 'black').length;
      return `Bij ${L(others(odd))} is er steeds precies één zwart figuurtje meer dan wit. Bij ${LETTERS[odd]} is het andersom: ${b} zwart en ${countOf(f[odd]) - b} wit.`;
    },
  },
  {
    id: 'som_hoeken',
    level: 'moeilijk',
    feature: 'hoekenTotaal',
    allowed: [],
    gen: (r, odd) => {
      const T = r.pick([11, 12, 13]);
      const combos = (target: number): number[][] => {
        const out: number[][] = [];
        const rec = (start: number, left: number, acc: number[]) => {
          if (left === 0 && acc.length >= 2) out.push(acc);
          if (acc.length >= 4) return;
          for (let c = start; c <= 6; c++) if (c <= left) rec(c, left - c, [...acc, c]);
        };
        rec(3, target, []);
        return out;
      };
      const good = r.shuffle(combos(T));
      const bad = combos(T + r.pick([-1, 1]));
      if (good.length < 3 || bad.length === 0) return null;
      let j = 0;
      return [0, 1, 2, 3, 4].map((i) => {
        const combo = i === odd ? r.pick(bad) : good[j++ % good.length];
        const fl = fills(r);
        return items(r, r.shuffle(combo).map((c) => ({ kind: r.pick(BY_CORNERS[c].filter((k) => k !== 'trapezoid')), fill: fl, r: 12 })));
      });
    },
    explain: (f, odd) => {
      const sum = (x: Fig) => shapesOf(x).reduce((s, sh) => s + CORNERS[sh.kind], 0);
      const parts = (x: Fig) => shapesOf(x).map((s) => CORNERS[s.kind]).join(' + ');
      const ex = f[others(odd)[0]];
      return `Tel alle hoeken bij elkaar op. Bij ${L(others(odd))} kom je steeds op ${sum(ex)} uit (bij ${LETTERS[others(odd)[0]]}: ${parts(ex)}). Bij ${LETTERS[odd]}: ${parts(f[odd])} = ${sum(f[odd])}.`;
    },
  },
  {
    id: 'pijl_meeste_hoeken',
    level: 'moeilijk',
    feature: 'pijlNaarMeesteHoeken',
    allowed: [],
    gen: (r, odd) =>
      [0, 1, 2, 3, 4].map((i) => {
        const pos = r.sample([0, 2, 4, 6], 3);
        const ks = r.sample<Kind>(['circle', 'triangle', 'square', 'pentagon', 'hexagon'], 3);
        const ss: Shape[] = pos.map((p, j) => {
          const [x, y] = RING(p, 35);
          return { t: 'shape', kind: ks[j], x, y, r: 11, rot: 0, fill: 'white', role: 'item' };
        });
        const maxJ = ks.map((k) => CORNERS[k]).indexOf(Math.max(...ks.map((k) => CORNERS[k])));
        const target = i === odd ? r.pick([0, 1, 2].filter((j) => j !== maxJ)) : maxJ;
        return { els: [{ t: 'arrow', x: 50, y: 50, len: 30, dir: pos[target] * 45 } as Arrow, ...ss] };
      }),
    explain: (f, odd) => {
      const ss = shapesOf(f[odd]);
      const a = f[odd].els[0] as Arrow;
      const t = ss.find((s) => dirTo(50, 50, s.x, s.y) === a.dir)!;
      const max = ss.reduce((m, s) => (CORNERS[s.kind] > CORNERS[m.kind] ? s : m));
      return `Bij ${L(others(odd))} wijst de pijl naar de figuur met de meeste hoeken. Bij ${LETTERS[odd]} wijst de pijl naar de ${NAME[t.kind][0]}, maar de ${NAME[max.kind][0]} heeft meer hoeken.`;
    },
  },
  {
    id: 'puntsymmetrisch',
    level: 'moeilijk',
    feature: 'puntsymmetrisch',
    allowed: ['spiegelsymmetrisch'],
    gen: (r, odd) => {
      const figs: Fig[] = [];
      for (let i = 0; i < 5; i++) {
        const g = i === odd
          ? gridWhere(r, 3, 6, (x) => anyMirror(x) && !gridSym.r180(x))
          : gridWhere(r, 3, 7, (x) => gridSym.r180(x) && !anyMirror(x));
        if (!g) return null;
        figs.push(gridFig(g));
      }
      return figs;
    },
    explain: (_f, odd) => `De figuren ${L(others(odd))} zien er precies hetzelfde uit als je ze een halve slag (180°) draait: ze zijn puntsymmetrisch. Figuur ${LETTERS[odd]} niet. Let op: ${LETTERS[odd]} heeft wel een spiegellijn, maar dat is een andere soort symmetrie.`,
  },
  {
    id: 'aantal_is_hoeken',
    level: 'moeilijk',
    feature: 'aantalIsHoeken',
    allowed: [],
    gen: (r, odd) => {
      const ns = r.shuffle([3, 4, 5, 6]);
      let j = 0;
      const kindFor = (c: number): Kind => (c === 3 ? 'triangle' : c === 4 ? 'square' : c === 5 ? 'pentagon' : 'hexagon');
      return [0, 1, 2, 3, 4].map((i) => {
        let n: number;
        let c: number;
        if (i === odd) {
          n = r.int(3, 6);
          c = r.pick([3, 4, 5, 6].filter((x) => x !== n));
        } else n = c = ns[j++];
        const fl = fills(r);
        return items(r, Array.from({ length: n }, () => ({ kind: kindFor(c), fill: fl, r: 11.5 })));
      });
    },
    explain: (f, odd) => {
      const ss = shapesOf(f[odd]);
      return `Bij ${L(others(odd))} is het aantal figuurtjes gelijk aan het aantal hoeken van elk figuurtje (bijvoorbeeld 3 driehoeken of 5 vijfhoeken). Bij ${LETTERS[odd]} staan ${ss.length} ${NAME[ss[0].kind][1]}.`;
    },
  },
  {
    id: 'grootte_bepaalt_kleur',
    level: 'moeilijk',
    feature: 'grootteBepaaltKleur',
    allowed: [],
    gen: (r, odd) => {
      const bigFill = fills(r);
      return [0, 1, 2, 3, 4].map((i) => {
        const n = r.int(3, 5);
        const list = Array.from({ length: n }, (_, j) => {
          const big = j === 0 ? true : j === 1 ? false : r.chance(0.5);
          return { kind: r.pick(SMALL_KINDS), fill: big ? bigFill : otherFill(bigFill), r: big ? 13 : 7 };
        });
        if (i === odd) {
          const j = r.int(0, n - 1);
          list[j] = { ...list[j], fill: otherFill(list[j].fill) };
        }
        return items(r, list);
      });
    },
    explain: (f, odd) => {
      const all = others(odd).flatMap((i) => shapesOf(f[i]));
      const bigFill = all.find((s) => s.r > 10)!.fill;
      const bad = shapesOf(f[odd]).find((s) => (s.r > 10 ? bigFill : otherFill(bigFill)) !== s.fill)!;
      return `De grootte bepaalt de kleur. Bij ${L(others(odd))} zijn alle grote figuurtjes ${kleur(bigFill)} en alle kleine ${kleur(otherFill(bigFill))}. Bij ${LETTERS[odd]} is een ${bad.r > 10 ? 'groot' : 'klein'} figuurtje ${kleur(bad.fill)}.`;
    },
  },
];

export const RULES: Record<Level, Rule[]> = { makkelijk, examen, moeilijk };

