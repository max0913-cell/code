import { svgOpen } from '../../core/svg';
import { type Shape, area, bbox, boundarySegments, formatArea, triPoints } from '../../core/trigrid';
import { LETTERS, type Question } from '../../core/types';
import { type CompItem, type DistractorKind, solutionFor } from './generator';

const n = (v: number) => (Math.round(v * 1000) / 1000).toString();

/** Teken een vorm (in hokje-eenheden) met de linkerbovenhoek op (ox, oy). */
export function shapeBody(s: Shape, ox: number, oy: number, fillClass = 'pc'): string {
  const b = bbox(s);
  const tris = s
    .map((k) => {
      const pts = triPoints(k).map(([x, y]) => `${n(x - b.minX + ox)},${n(y - b.minY + oy)}`);
      return `<polygon points="${pts.join(' ')}"/>`;
    })
    .join('');
  const outline = boundarySegments(s)
    .map(([a, c]) => `M${n(a[0] - b.minX + ox)} ${n(a[1] - b.minY + oy)}L${n(c[0] - b.minX + ox)} ${n(c[1] - b.minY + oy)}`)
    .join('');
  return `<g class="${fillClass}">${tris}</g><path class="ol" d="${outline}"/>`;
}

/** Een tegel met één vorm, gecentreerd, op een vaste schaal (size = zijde in hokjes). */
export function shapeTile(s: Shape, size: number, label: string): string {
  const b = bbox(s);
  const pad = 0.4;
  const vb = size + 2 * pad;
  const ox = pad + (size - b.w) / 2;
  const oy = pad + (size - b.h) / 2;
  return svgOpen(`0 0 ${n(vb)} ${n(vb)}`, label).replace('<svg ', `<svg data-u="${n(vb)}" `) + shapeBody(s, ox, oy) + '</svg>';
}

/** Alle stukken naast elkaar (met regels als het te breed wordt). */
export function piecesSvg(pieces: Shape[], label: string, maxRow = 14): string {
  const gap = 1;
  const pad = 0.4;
  let x = 0;
  let y = 0;
  let rowH = 0;
  let maxW = 0;
  const placed: { s: Shape; x: number; y: number }[] = [];
  for (const p of pieces) {
    const b = bbox(p);
    if (x > 0 && x + b.w > maxRow) {
      x = 0;
      y += rowH + gap;
      rowH = 0;
    }
    placed.push({ s: p, x, y });
    x += b.w + gap;
    rowH = Math.max(rowH, b.h);
    maxW = Math.max(maxW, x - gap);
  }
  const w = maxW + 2 * pad;
  const h = y + rowH + 2 * pad;
  const body = placed.map((p) => shapeBody(p.s, p.x + pad, p.y + pad)).join('');
  return svgOpen(`0 0 ${n(w)} ${n(h)}`, label).replace('<svg ', `<svg data-u="${n(w)}" `) + body + '</svg>';
}

/** Oplossing: de stukken in verschillende kleuren in de figuur. */
function solutionSvg(target: Shape, placement: Shape[], label: string): string {
  const b = bbox(target);
  const pad = 0.3;
  const parts = placement
    .map((p, i) => {
      const tris = p
        .map((k) => `<polygon points="${triPoints(k).map(([x, y]) => `${n(x - b.minX + pad)},${n(y - b.minY + pad)}`).join(' ')}"/>`)
        .join('');
      const ol = boundarySegments(p)
        .map(([a, c]) => `M${n(a[0] - b.minX + pad)} ${n(a[1] - b.minY + pad)}L${n(c[0] - b.minX + pad)} ${n(c[1] - b.minY + pad)}`)
        .join('');
      return `<g class="p${i % 4}">${tris}</g><path class="ol thin" d="${ol}"/>`;
    })
    .join('');
  const w = b.w + 2 * pad;
  const h = b.h + 2 * pad;
  return `<svg class="fig solution" viewBox="0 0 ${n(w)} ${n(h)}" role="img" aria-label="${label}" style="width:${Math.round(w * 22)}px">${parts}</svg>`;
}

const describe = (s: Shape): string => {
  const b = bbox(s);
  return `figuur van ${formatArea(area(s))} hokjes, ${b.w} breed en ${b.h} hoog`;
};

const LIST = (ls: string[]): string => (ls.length > 1 ? `${ls.slice(0, -1).join(', ')} en ${ls[ls.length - 1]}` : ls[0]);

function reasonsHtml(it: CompItem, total: string): string {
  const out: string[] = [];
  const by = (k: DistractorKind) => it.options.map((o, i) => ({ o, i })).filter((x) => it.reasons[x.i] === k);
  const fig = (xs: { i: number }[]) => `${xs.length > 1 ? 'Figuren' : 'Figuur'} ${LIST(xs.map((x) => LETTERS[x.i]))}`;
  const opp = by('oppervlakte');
  if (opp.length) {
    const groups = new Map<number, number[]>();
    for (const x of opp) groups.set(area(x.o), [...(groups.get(area(x.o)) ?? []), x.i]);
    const parts = [...groups.entries()].map(([a, is], j) => `${j === 0 ? (is.length > 1 ? 'Figuren' : 'Figuur') : is.length > 1 ? 'figuren' : 'figuur'} ${LIST(is.map((i) => LETTERS[i]))} ${is.length > 1 ? 'zijn' : 'is'} ${formatArea(a)} hokjes groot`);
    out.push(`${LIST(parts)}, maar de stukken samen zijn ${total} hokjes. Dat kan dus nooit.`);
  }
  const same = (xs: { i: number }[]) => (xs.length > 1 ? 'zijn' : 'is');
  const hok = by('hokje');
  if (hok.length) out.push(`${fig(hok)} ${same(hok)} even groot als de stukken samen, maar er zit één hokje op een andere plek dan bij een goede figuur. Dan passen de stukken niet meer.`);
  const hoek = by('hoek');
  if (hoek.length) out.push(`${fig(hoek)} ${hoek.length > 1 ? 'lijken' : 'lijkt'} op een goede figuur, maar er zit een half hokje (een schuine hoek) op een andere plek. Daardoor passen de stukken niet.`);
  const half = by('half');
  if (half.length) out.push(`${fig(half)} ${half.length > 1 ? 'lijken' : 'lijkt'} op een goede figuur, maar één schuine kant loopt de andere kant op. Daardoor passen de stukken niet.`);
  const anders = by('anders');
  if (anders.length) out.push(`${fig(anders)} ${same(anders)} even groot als de stukken samen, maar de vorm klopt niet: de stukken passen er niet in zonder over elkaar te liggen of een gat te laten.`);
  return out.map((x) => `<li>${x}</li>`).join('');
}

export function compToQuestion(it: CompItem): Question {
  const size = Math.max(...it.options.map((o) => Math.max(bbox(o).w, bbox(o).h)));
  const total = formatArea(it.pieces.reduce((s, p) => s + area(p), 0));
  const piecesLabel = `Stukken: ${it.pieces.map((p) => `${formatArea(area(p))} hokje${area(p) === 1 ? '' : 's'}`).join(', ')}`;
  const sols = it.correct.map((i) => {
    const pl = solutionFor(it, i)!;
    return `<figure class="sol"><figcaption>${LETTERS[i]}</figcaption>${solutionSvg(it.options[i], pl, `Oplossing voor ${LETTERS[i]}`)}</figure>`;
  });
  const wrong = reasonsHtml(it, total);
  const explanation = `<p>Je kunt <strong>${LETTERS[it.correct[0]]}</strong> en <strong>${LETTERS[it.correct[1]]}</strong> maken. De stukken zijn samen ${total} hokjes groot. Zo passen ze:</p><div class="sols">${sols.join('')}</div><ul class="reasons">${wrong}</ul>`;
  const key = `comp|${it.pieces.map((p) => p.join('.')).join('/')}|${it.options.map((o) => o.join('.')).join('/')}`;
  return {
    key,
    subtest: 'componenten',
    level: it.level,
    type: `${it.pieces.length}_stukken`,
    instruction: 'Met welke 2 figuren kun je precies alle stukken samen maken? Draaien mag, overlappen niet, en er mag geen gat overblijven.',
    promptHtml: `<div class="pieces" data-scale-part>${piecesSvg(it.pieces, piecesLabel)}</div>`,
    promptLabel: piecesLabel,
    options: it.options.map((o, i) => ({ html: shapeTile(o, size, `Figuur ${LETTERS[i]}: ${describe(o)}`), label: describe(o) })),
    correct: it.correct,
    explanationHtml: explanation,
    optionStyle: 'figure',
  };
}

