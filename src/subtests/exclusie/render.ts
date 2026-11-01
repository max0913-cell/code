import { svgOpen } from '../../core/svg';
import { type El, type Fig, FLAG_BASES, type Flag, type FlagBase, NAME, type Shape, lineAngle, rotatePt, shapePoints, sizeClass } from './model';

const n = (v: number) => (Math.round(v * 10) / 10).toString();
const cls = (fill: 'white' | 'black') => (fill === 'black' ? 'k' : 'w');

function shapeSvg(s: Shape): string {
  if (s.kind === 'circle') return `<circle cx="${n(s.x)}" cy="${n(s.y)}" r="${n(s.r * 0.86)}" class="${cls(s.fill)}"/>`;
  return `<polygon points="${shapePoints(s).map(([x, y]) => `${n(x)},${n(y)}`).join(' ')}" class="${cls(s.fill)}"/>`;
}

function flagSvg(f: Flag): string {
  const g = FLAG_BASES[f.base];
  const S = 34;
  const tr = ([x, y]: [number, number]): [number, number] => {
    const [rx, ry] = rotatePt([f.mirror ? -x : x, y], f.rot);
    return [50 + rx * S, 50 + ry * S];
  };
  const parts: string[] = [];
  for (const c of g.circles.filter((c) => c.r > 0.5)) {
    const [x, y] = tr(c.c);
    parts.push(`<circle cx="${n(x)}" cy="${n(y)}" r="${n(c.r * S)}" class="${cls(c.fill)}"/>`);
  }
  for (const p of g.polys) parts.push(`<polygon points="${p.pts.map(tr).map(([x, y]) => `${n(x)},${n(y)}`).join(' ')}" class="${cls(p.fill)}"/>`);
  for (const [a, b] of g.lines) {
    const [x1, y1] = tr(a);
    const [x2, y2] = tr(b);
    parts.push(`<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" class="ln"/>`);
  }
  for (const c of g.circles.filter((c) => c.r <= 0.5)) {
    const [x, y] = tr(c.c);
    parts.push(`<circle cx="${n(x)}" cy="${n(y)}" r="${n(c.r * S)}" class="${cls(c.fill)}"/>`);
  }
  return parts.join('');
}

function elSvg(e: El): string {
  switch (e.t) {
    case 'shape':
      return shapeSvg(e);
    case 'dot':
      return `<circle cx="${n(e.x)}" cy="${n(e.y)}" r="${n(e.r)}" class="${cls(e.fill)}"/>`;
    case 'line':
      return `<line x1="${n(e.x1)}" y1="${n(e.y1)}" x2="${n(e.x2)}" y2="${n(e.y2)}" class="ln"/>`;
    case 'arrow': {
      const a = (e.dir * Math.PI) / 180;
      const ux = Math.sin(a);
      const uy = -Math.cos(a);
      const tipX = e.x + (ux * e.len) / 2;
      const tipY = e.y + (uy * e.len) / 2;
      const head = 12;
      const bx = tipX - ux * head;
      const by = tipY - uy * head;
      const w = 5.5;
      return `<line x1="${n(e.x - (ux * e.len) / 2)}" y1="${n(e.y - (uy * e.len) / 2)}" x2="${n(bx)}" y2="${n(by)}" class="ln"/><polygon points="${n(tipX)},${n(tipY)} ${n(bx - uy * w)},${n(by + ux * w)} ${n(bx + uy * w)},${n(by - ux * w)}" class="k"/>`;
    }
    case 'grid':
      return e.cells.map((v, i) => `<rect x="${10 + (i % 3) * 28}" y="${10 + Math.floor(i / 3) * 28}" width="24" height="24" class="${v ? 'k' : 'w'}"/>`).join('');
    case 'flag':
      return flagSvg(e);
  }
}

const POS = ['linksboven', 'boven', 'rechtsboven', 'links', 'midden', 'rechts', 'linksonder', 'onder', 'rechtsonder'];
const DIR8 = ['boven', 'rechtsboven', 'rechts', 'rechtsonder', 'onder', 'linksonder', 'links', 'linksboven'];
const dirName = (deg: number) => DIR8[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
const kleur = (f: 'white' | 'black') => (f === 'black' ? 'zwart' : 'wit');
const FLAG_NAME: Record<FlagBase, string> = { wijzer: 'cirkel met wijzer en stip', vlag: 'stok met vlag', laars: 'L-vorm', haak: 'stok met haakje en stip' };

/** Beschrijving in woorden, voor schermlezers. */
export function describeFig(f: Fig): string {
  const parts: string[] = [];
  const shapes = f.els.filter((e): e is Shape => e.t === 'shape');
  const sizes = new Set(shapes.map((s) => sizeClass(s.r)));
  const groups = new Map<string, number>();
  for (const s of shapes) {
    const size = s.role === 'main' && shapes.length === 1 ? (s.r >= 28 ? ', groot' : ', klein') : s.role === 'inner' ? ', klein, binnenin' : sizes.size > 1 && s.role === 'item' ? (s.r > 10 ? ', groot' : ', klein') : '';
    const key = `${NAME[s.kind][0]} (${kleur(s.fill)}${size})`;
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  for (const [k, c] of groups) parts.push(c > 1 ? `${c} × ${k}` : k);
  const dots = f.els.filter((e) => e.t === 'dot');
  if (dots.length) {
    const b = dots.filter((d) => d.t === 'dot' && d.fill === 'black').length;
    const w = dots.length - b;
    if (b) parts.push(`${b} zwarte ${b === 1 ? 'stip' : 'stippen'}`);
    if (w) parts.push(`${w} witte ${w === 1 ? 'stip' : 'stippen'}`);
  }
  const lines = f.els.filter((e) => e.t === 'line');
  if (lines.length) {
    const desc = lines.map((l) => {
      const a = lineAngle(l as Extract<El, { t: 'line' }>);
      return a === 0 ? 'horizontaal' : a === 90 ? 'verticaal' : `schuin ${a}°`;
    });
    parts.push(`${lines.length} lijnen: ${desc.join(', ')}`);
  }
  for (const e of f.els) {
    if (e.t === 'arrow') parts.push(`pijl naar ${dirName(e.dir)}`);
    if (e.t === 'grid') parts.push(`raster van 3 bij 3, zwarte vakjes: ${e.cells.map((v, i) => (v ? POS[i] : '')).filter(Boolean).join(', ')}`);
    if (e.t === 'flag') parts.push(`${FLAG_NAME[e.base]}, punt naar ${dirName(e.rot)}, ${e.mirror ? 'linksom' : 'rechtsom'} uitgevoerd`);
  }
  return parts.join('; ');
}

export function figSvg(f: Fig, label: string): string {
  return `${svgOpen('0 0 100 100', label)}${f.els.map(elSvg).join('')}</svg>`;
}


