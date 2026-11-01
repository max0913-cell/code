import { LEVELS, LEVEL_NAMES, type Level, type SubtestId } from '../core/types';
import { type HistoryEntry, clearAll, load, storageAvailable } from '../storage';
import { SUBTESTS, subtestById } from '../subtests/registry';
import { disclaimer } from './home';
import { formatDate, formatTime, h, nodes, setTitle } from './dom';

const MODE_NAMES = { oefen: 'oefenen', toets: 'toets', examen: 'examen' } as const;
const SERIES_VAR: Record<Level, string> = { makkelijk: 'var(--chart-1)', examen: 'var(--chart-2)', moeilijk: 'var(--chart-3)' };
/** Extra codering naast kleur: elk niveau een eigen markervorm. */
const MARKER: Record<Level, 'circle' | 'square' | 'triangle'> = { makkelijk: 'circle', examen: 'square', moeilijk: 'triangle' };

const SVGNS = 'http://www.w3.org/2000/svg';
function s<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

function marker(kind: 'circle' | 'square' | 'triangle', x: number, y: number, color: string): SVGElement {
  const common = { fill: color, stroke: 'var(--surface)', 'stroke-width': 2 };
  if (kind === 'circle') return s('circle', { cx: x, cy: y, r: 4.5, ...common });
  if (kind === 'square') return s('rect', { x: x - 4.5, y: y - 4.5, width: 9, height: 9, rx: 1.5, ...common });
  return s('path', { d: `M${x} ${y - 5.5} L${x + 5.5} ${y + 4} L${x - 5.5} ${y + 4} Z`, ...common });
}

/** Lijngrafiek: score (%) per poging, één lijn per niveau. Met kruisdraad en tooltip. */
function chart(entries: HistoryEntry[]): HTMLElement {
  // Breedte afgestemd op het scherm, zodat de labels op een telefoon leesbaar blijven.
  const W = Math.round(Math.min(640, Math.max(300, (document.getElementById('main')?.clientWidth ?? 640) - 66)));
  const H = Math.round(Math.min(260, Math.max(200, W * 0.55)));
  const m = { l: 42, r: 14, t: 14, b: 28 };
  const series = LEVELS.map((l) => ({ level: l, pts: entries.filter((e) => e.level === l) })).filter((x) => x.pts.length > 0);
  const maxN = Math.max(2, ...series.map((x) => x.pts.length));
  const xs = (i: number) => m.l + ((W - m.l - m.r) * i) / (maxN - 1);
  const ys = (p: number) => m.t + (H - m.t - m.b) * (1 - p);

  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart', role: 'img' });
  const summary = series.map((x) => {
    const last = x.pts[x.pts.length - 1];
    return `${LEVEL_NAMES[x.level]}: ${x.pts.length} pogingen, laatste ${Math.round((100 * last.score) / last.total)}%`;
  });
  svg.setAttribute('aria-label', `Scores per poging. ${summary.join('. ')}. De tabel hieronder bevat alle getallen.`);

  for (const p of [0, 0.25, 0.5, 0.75, 1]) {
    svg.append(s('line', { x1: m.l, x2: W - m.r, y1: ys(p), y2: ys(p), class: 'grid' }));
    const t = s('text', { x: m.l - 8, y: ys(p) + 4, 'text-anchor': 'end' });
    t.textContent = `${p * 100}%`;
    svg.append(t);
  }
  const step = Math.max(1, Math.ceil(maxN / Math.max(4, Math.floor(W / 70))));
  for (let i = 0; i < maxN; i += step) {
    const t = s('text', { x: xs(i), y: H - 10, 'text-anchor': 'middle' });
    t.textContent = String(i + 1);
    svg.append(t);
  }

  for (const x of series) {
    const color = SERIES_VAR[x.level];
    if (x.pts.length > 1) {
      const d = x.pts.map((e, i) => `${i === 0 ? 'M' : 'L'}${xs(i).toFixed(1)} ${ys(e.score / e.total).toFixed(1)}`).join(' ');
      svg.append(s('path', { d, fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    }
    x.pts.forEach((e, i) => svg.append(marker(MARKER[x.level], xs(i), ys(e.score / e.total), color)));
  }

  // kruisdraad + tooltip
  const cross = s('line', { x1: 0, x2: 0, y1: m.t, y2: H - m.b, stroke: 'var(--muted)', 'stroke-width': 1, 'stroke-dasharray': '3 3', visibility: 'hidden' });
  svg.append(cross);
  const wrap = h('div', { style: 'position:relative' });
  const tip = h('div', {
    style: 'position:absolute;pointer-events:none;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:8px 10px;font-size:0.85rem;box-shadow:var(--shadow);visibility:hidden;min-width:150px;z-index:2',
    'aria-hidden': 'true',
  });
  const hit = s('rect', { x: m.l - 10, y: 0, width: W - m.l - m.r + 20, height: H, fill: 'transparent' });
  svg.append(hit);
  const move = (ev: PointerEvent) => {
    const box = svg.getBoundingClientRect();
    const px = ((ev.clientX - box.left) / box.width) * W;
    const i = Math.max(0, Math.min(maxN - 1, Math.round(((px - m.l) / (W - m.l - m.r)) * (maxN - 1))));
    const rows = series.filter((x) => x.pts[i]).map((x) => {
      const e = x.pts[i];
      return `<div style="display:flex;gap:6px;align-items:center"><span style="width:10px;height:3px;background:${SERIES_VAR[x.level]};display:inline-block;border-radius:2px"></span><span style="color:var(--text)">${LEVEL_NAMES[x.level]}: <strong>${e.score}/${e.total}</strong> (${Math.round((100 * e.score) / e.total)}%)</span></div><div style="color:var(--muted);margin:0 0 4px 16px">${formatDate(e.t)} · ${MODE_NAMES[e.mode]}</div>`;
    });
    if (rows.length === 0) return;
    cross.setAttribute('x1', String(xs(i)));
    cross.setAttribute('x2', String(xs(i)));
    cross.setAttribute('visibility', 'visible');
    tip.innerHTML = `<div style="color:var(--muted);margin-bottom:4px">Poging ${i + 1}</div>${rows.join('')}`;
    tip.style.visibility = 'visible';
    const left = (xs(i) / W) * box.width;
    tip.style.left = `${Math.min(Math.max(0, left - 80), box.width - 170)}px`;
    tip.style.top = '4px';
  };
  const leave = () => {
    cross.setAttribute('visibility', 'hidden');
    tip.style.visibility = 'hidden';
  };
  svg.addEventListener('pointermove', move);
  svg.addEventListener('pointerdown', move);
  svg.addEventListener('pointerleave', leave);
  wrap.append(svg, tip);

  const legend = h('div', { class: 'legend-inline', 'aria-hidden': 'true' },
    ...series.map((x) => h('span', { style: `--c:${SERIES_VAR[x.level]}` }, `${LEVEL_NAMES[x.level]} (${{ circle: '●', square: '■', triangle: '▲' }[MARKER[x.level]]})`)));
  return h('div', null, legend, wrap, h('p', { class: 'muted small', style: 'margin:4px 0 0' }, 'Horizontaal: je pogingen per niveau (1 = de eerste). Verticaal: je score.'));
}

function overviewTable(hist: HistoryEntry[]): HTMLElement {
  const cell = (id: SubtestId, l: Level) => {
    const e = hist.filter((x) => x.subtest === id && x.level === l);
    if (e.length === 0) return h('td', { class: 'muted' }, '–');
    const last = e[e.length - 1];
    return h('td', null, `${Math.round((100 * last.score) / last.total)}%`, h('span', { class: 'muted small' }, ` (${e.length}×)`));
  };
  return h('div', { class: 'table-wrap' },
    h('table', null,
      h('caption', { class: 'sr-only' }, 'Laatste score per subtest en niveau'),
      h('thead', null, h('tr', null, h('th', null, 'Subtest'), ...LEVELS.map((l) => h('th', null, LEVEL_NAMES[l])))),
      h('tbody', null, ...SUBTESTS.map((d) => h('tr', null, h('td', null, d.name), ...LEVELS.map((l) => cell(d.id, l)))))));
}

export function renderProgress(main: HTMLElement, selected?: string): void {
  setTitle('Voortgang');
  const hist = load().history;
  const current = (selected && subtestById(selected) ? selected : (hist[hist.length - 1]?.subtest ?? SUBTESTS[0].id)) as SubtestId;

  const select = h('select', { id: 'pick', onchange: (e: Event) => renderProgress(main, (e.target as HTMLSelectElement).value) },
    ...SUBTESTS.map((d) => h('option', { value: d.id, selected: d.id === current }, d.name)));

  const entries = hist.filter((e) => e.subtest === current);
  const detail = h('section', { class: 'card' },
    h('h2', null, 'Scores over tijd'),
    h('div', { class: 'field' }, h('label', { for: 'pick' }, 'Subtest'), select),
    entries.length === 0
      ? h('p', { class: 'empty' }, 'Nog geen resultaten voor deze subtest. Maak een oefenronde of toets, dan verschijnt hier je grafiek.')
      : chart(entries),
    entries.length > 0
      ? h('details', { style: 'margin-top:12px' },
          h('summary', { style: 'cursor:pointer;min-height:44px;display:flex;align-items:center' }, 'Toon als tabel'),
          h('div', { class: 'table-wrap' },
            h('table', null,
              h('thead', null, h('tr', null, h('th', null, 'Datum'), h('th', null, 'Niveau'), h('th', null, 'Modus'), h('th', null, 'Score'), h('th', null, '%'), h('th', null, 'Tijd'))),
              h('tbody', null, ...entries.slice().reverse().slice(0, 200).map((e) =>
                h('tr', null, h('td', null, formatDate(e.t)), h('td', null, LEVEL_NAMES[e.level]), h('td', null, MODE_NAMES[e.mode]), h('td', null, `${e.score}/${e.total}`), h('td', null, `${Math.round((100 * e.score) / e.total)}%`), h('td', null, formatTime(e.ms)))))))) : null,
  );

  const wipe = () => {
    if (!window.confirm('Weet je zeker dat je al je resultaten en instellingen wilt wissen? Dit kun je niet ongedaan maken.')) return;
    clearAll();
    renderProgress(main);
  };

  main.replaceChildren(...nodes(
    h('h1', null, 'Je voortgang'),
    storageAvailable() ? null : h('p', { class: 'notice' }, 'Je browser staat opslaan niet toe (bijvoorbeeld in een privévenster). Je resultaten verdwijnen als je de pagina sluit.'),
    detail,
    h('section', { class: 'card' }, h('h2', null, 'Overzicht'), h('p', { class: 'muted small' }, 'Laatste score per subtest en niveau, met tussen haakjes het aantal keer.'), overviewTable(hist)),
    h('section', { class: 'card' },
      h('h2', null, 'Alles wissen'),
      h('p', { class: 'muted small' }, `Er ${hist.length === 1 ? 'is 1 resultaat' : `zijn ${hist.length} resultaten`} opgeslagen op dit apparaat.`),
      h('button', { class: 'btn btn-danger btn-block', onclick: wipe }, 'Wis al mijn resultaten'),
    ),
    disclaimer(),
  ));
}
