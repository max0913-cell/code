import { svgOpen } from '../../core/svg';
import { area, bbox, formatArea, triPoints } from '../../core/trigrid';
import { LETTERS, type Question } from '../../core/types';
import { shapeBody } from '../componenten/render';
import type { MirrorFig, SpiegelItem, Variant } from './generator';

const n = (v: number) => (Math.round(v * 1000) / 1000).toString();

function radius(f: MirrorFig): number {
  const b = bbox(f.tris);
  const cx = b.w / 2;
  const cy = b.h / 2;
  let r = 0;
  for (const k of f.tris) for (const [x, y] of triPoints(k)) r = Math.max(r, Math.hypot(x - b.minX - cx, y - b.minY - cy));
  return r;
}

function figTile(f: MirrorFig, v: Variant, size: number, label: string): string {
  const b = bbox(f.tris);
  const body = shapeBody(f.tris, 0, 0) + f.dots.map(([x, y]) => `<circle cx="${n(x + 0.5)}" cy="${n(y + 0.5)}" r="0.2" class="k" style="stroke-width:0.04"/>`).join('');
  const tr = `translate(${n(size / 2)} ${n(size / 2)}) rotate(${v.rot}) scale(${v.mirrored ? -1 : 1} 1) translate(${n(-b.w / 2)} ${n(-b.h / 2)})`;
  return svgOpen(`0 0 ${n(size)} ${n(size)}`, label).replace('<svg ', `<svg data-u="${n(size)}" `) + `<g transform="${tr}">${body}</g></svg>`;
}

const describeVariant = (v: Variant): string => {
  const turn = v.rot === 0 ? '' : `${v.rot}° met de klok mee gedraaid`;
  if (v.mirrored) return v.rot === 0 ? 'alleen gespiegeld' : `gespiegeld en ${turn}`;
  return v.rot === 0 ? 'niet gedraaid: precies dezelfde stand' : `alleen ${turn}`;
};

export function spiegelToQuestion(it: SpiegelItem): Question {
  const size = 2 * radius(it.fig) + 0.6;
  const b = bbox(it.fig.tris);
  const base = `figuur van ${formatArea(area(it.fig.tris))} hokjes${it.fig.dots.length ? ' met een stip' : ''}`;
  const right = it.correct.map((i) => LETTERS[i]);
  const list = it.variants.map((v, i) => `<li><strong>${LETTERS[i]}</strong>: ${describeVariant(v)}${v.mirrored ? ' (goed)' : ''}</li>`).join('');
  const explanation = `<p><strong>${right[0]}</strong> en <strong>${right[1]}</strong> zijn gespiegeld. De andere vier zijn alleen gedraaid: als je ze terugdraait, liggen ze precies op de figuur bovenaan.</p><ul class="reasons">${list}</ul><p>Tip: kies één opvallend deel (een uitsteeksel, een schuine kant of de stip) en kijk of het met de klok mee of tegen de klok in naast de rest ligt. Draaien verandert dat niet, spiegelen wel.</p>`;
  return {
    key: `spiegel|${it.fig.tris.join('.')}|${it.fig.dots.join('.')}|${it.variants.map((v) => `${v.mirrored ? 'm' : 'p'}${v.rot}`).join(',')}`,
    subtest: 'spiegel',
    level: it.level,
    type: it.type,
    instruction: 'Welke 2 figuren zijn gespiegeld (en misschien ook gedraaid)? De andere 4 zijn alleen gedraaid.',
    promptHtml: `<div class="pieces mirror-src">${figTile(it.fig, { mirrored: false, rot: 0 }, Math.max(b.w, b.h) + 0.6, `Voorbeeld: ${base}`)}</div>`,
    promptLabel: `Spiegelbeeld van een ${base}`,
    options: it.variants.map((v, i) => ({ html: figTile(it.fig, v, size, `Figuur ${LETTERS[i]}: dezelfde figuur in een andere stand`), label: `figuur ${LETTERS[i]}` })),
    correct: it.correct,
    explanationHtml: explanation,
    optionStyle: 'figure',
  };
}
