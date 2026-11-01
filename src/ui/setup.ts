import { LEVEL_NAMES, type Level } from '../core/types';
import { load, save, type Mode } from '../storage';
import { subtestById } from '../subtests/registry';
import { disclaimer, levelPicker } from './home';
import { h, nodes, setTitle } from './dom';
import { startSession } from './session';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function numberField(id: string, label: string, value: number, min: number, max: number, hint?: string): HTMLElement {
  return h('div', { class: 'field' },
    h('label', { for: id }, label),
    h('input', { id, type: 'number', inputmode: 'numeric', min: String(min), max: String(max), value: String(value), required: true }),
    hint ? h('span', { class: 'muted small' }, hint) : null,
  );
}

const readNum = (root: HTMLElement, id: string, fallback: number, lo: number, hi: number): number => {
  const v = Number((root.querySelector(`#${id}`) as HTMLInputElement | null)?.value);
  return Number.isFinite(v) && v > 0 ? clamp(Math.round(v), lo, hi) : fallback;
};

export const TIME_NOTICE = 'De echte tijdslimieten van de NOA-test zijn niet bekend. De standaardtijd hier is een schatting: pas hem gerust aan.';

export function renderSetup(main: HTMLElement, subtestId: string, mode: Mode): void {
  const def = subtestById(subtestId);
  if (!def || mode === 'examen') {
    location.hash = '#/';
    return;
  }
  const st = load();
  let level: Level = st.level;
  const timer = st.timers[def.id] ?? { count: def.defaultCount, minutes: def.defaultMinutes };
  setTitle(`${def.name} · ${mode === 'oefen' ? 'oefenen' : 'toets'}`);

  const form = h('form', { class: 'card stack', novalidate: true });
  form.append(...nodes(
    h('p', { class: 'q-meta' }, mode === 'oefen' ? 'Oefenmodus: je ziet na elke vraag meteen of het goed is, met uitleg.' : 'Toetsmodus: met tijdslimiet. Je ziet pas aan het eind wat goed en fout is.'),
    h('h1', null, def.name),
    def.extra ? h('p', null, h('span', { class: 'badge' }, 'extra: misschien niet op de selectiedag')) : null,
    h('p', null, def.description),
    h('h2', null, 'Niveau'),
    levelPicker(level, (l) => {
      level = l;
      save((s) => (s.level = l));
    }, 'niveau-setup'),
  ));
  if (mode === 'oefen') {
    form.append(numberField('count', 'Aantal vragen', st.practiceCount, 1, 60));
  } else {
    form.append(
      numberField('count', 'Aantal vragen', timer.count, 1, 60),
      numberField('minutes', 'Tijd voor deze subtest (minuten)', timer.minutes, 1, 120),
      h('p', { class: 'notice' }, TIME_NOTICE),
    );
  }
  form.append(h('button', { class: 'btn btn-primary btn-block', type: 'submit' }, mode === 'oefen' ? 'Start oefenen' : 'Start toets'));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const count = readNum(form, 'count', mode === 'oefen' ? st.practiceCount : timer.count, 1, 60);
    if (mode === 'oefen') {
      save((s) => (s.practiceCount = count));
      startSession({ mode, title: `${def.name} · oefenen`, parts: [{ subtest: def.id, level, count, seconds: null }] });
    } else {
      const minutes = readNum(form, 'minutes', timer.minutes, 1, 120);
      save((s) => (s.timers[def.id] = { count, minutes }));
      startSession({ mode, title: `${def.name} · toets`, parts: [{ subtest: def.id, level, count, seconds: minutes * 60 }] });
    }
  });
  main.replaceChildren(h('p', null, h('a', { href: '#/' }, '← Terug naar start')), form, disclaimer());
}

export const EXAM_ORDER = ['analogieen', 'rekenen', 'exclusie', 'componenten'] as const;

export function renderExamSetup(main: HTMLElement): void {
  setTitle('Examensimulatie');
  const st = load();
  const defs = EXAM_ORDER.map((id) => subtestById(id)).filter((d): d is NonNullable<typeof d> => !!d);
  const form = h('form', { class: 'card stack', novalidate: true });
  form.append(
    h('h1', null, 'Examensimulatie'),
    h('p', null, `De ${defs.length} hoofdsubtests achter elkaar, op niveau ${LEVEL_NAMES.examen.toLowerCase()}. Elke subtest heeft een eigen tijdslimiet. Binnen een subtest kun je terugbladeren; na het inleveren ga je door naar de volgende.`),
    h('p', { class: 'notice' }, TIME_NOTICE),
  );
  defs.forEach((d, i) => {
    const t = st.timers[d.id] ?? { count: d.defaultCount, minutes: d.defaultMinutes };
    form.append(
      h('fieldset', { class: 'card', style: 'margin:0' },
        h('legend', { style: 'font-weight:700;padding:0 4px' }, `${i + 1}. ${d.name}`),
        h('div', { class: 'btn-row' },
          numberField(`count-${d.id}`, 'Vragen', t.count, 1, 60),
          numberField(`min-${d.id}`, 'Minuten', t.minutes, 1, 120),
        ),
      ),
    );
  });
  form.append(h('button', { class: 'btn btn-primary btn-block', type: 'submit' }, 'Start examensimulatie'));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const parts = defs.map((d) => {
      const t = st.timers[d.id] ?? { count: d.defaultCount, minutes: d.defaultMinutes };
      const count = readNum(form, `count-${d.id}`, t.count, 1, 60);
      const minutes = readNum(form, `min-${d.id}`, t.minutes, 1, 120);
      save((s) => (s.timers[d.id] = { count, minutes }));
      return { subtest: d.id, level: 'examen' as Level, count, seconds: minutes * 60 };
    });
    startSession({ mode: 'examen', title: 'Examensimulatie', parts });
  });
  main.replaceChildren(h('p', null, h('a', { href: '#/' }, '← Terug naar start')), form, disclaimer());
}

