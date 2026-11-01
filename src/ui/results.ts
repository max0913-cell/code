import { LETTERS, LEVEL_NAMES, type Question } from '../core/types';
import { subtestById } from '../subtests/registry';
import { disclaimer } from './home';
import { formatSeconds, formatTime, h, setTitle } from './dom';
import { fitFigures } from './figscale';
import { type AnswerRecord, type PartConfig, type PartResult, app, isCorrect, startSession } from './session';

const pctText = (a: number, b: number) => (b === 0 ? '–' : `${Math.round((100 * a) / b)}%`);

function stat(value: string, label: string): HTMLElement {
  return h('div', { class: 'stat' }, h('div', { class: 'v' }, value), h('div', { class: 'l' }, label));
}

function reviewOptions(q: Question, chosen: number[]): HTMLElement {
  const wrap = h('div', { class: `review-options ${q.optionStyle === 'figure' ? 'figure' : ''}` });
  q.options.forEach((o, i) => {
    let cls = `opt${q.optionStyle === 'figure' ? ' figure-opt' : ''}`;
    if (q.correct.includes(i)) cls += ' correct';
    else if (chosen.includes(i)) cls += ' wrong';
    const tags = [q.correct.includes(i) ? 'goed antwoord' : '', chosen.includes(i) ? 'jouw keuze' : ''].filter(Boolean).join(', ');
    wrap.append(
      h('div', { class: cls, role: 'img', 'aria-label': `Optie ${LETTERS[i]}: ${o.label}${tags ? ` (${tags})` : ''}` },
        h('span', { class: 'letter', 'aria-hidden': 'true' }, LETTERS[i]),
        h('span', { class: 'opt-body', html: o.html, 'aria-hidden': 'true' })),
    );
  });
  return wrap;
}

function reviewItem(rec: AnswerRecord, n: number): HTMLElement {
  const ok = isCorrect(rec);
  const skipped = rec.chosen.length === 0;
  const q = rec.q;
  const yours = skipped ? 'niet beantwoord' : rec.chosen.slice().sort().map((c) => LETTERS[c]).join(' en ');
  const right = q.correct.map((c) => LETTERS[c]).join(' en ');
  const short = q.promptLabel.length > 60 ? `${q.promptLabel.slice(0, 57)}…` : q.promptLabel;
  return h('details', { class: 'review-item', open: !ok },
    h('summary', null,
      h('span', { class: `mark ${ok ? 'good' : skipped ? 'skip' : 'bad'}`, 'aria-hidden': 'true' }, ok ? '✓' : skipped ? '–' : '✗'),
      h('span', { class: 'sr-only' }, ok ? 'Goed: ' : skipped ? 'Niet beantwoord: ' : 'Fout: '),
      h('span', { style: 'flex:1' }, `Vraag ${n}`, h('span', { class: 'muted small' }, ` · ${short}`)),
      h('span', { class: 'muted small' }, formatSeconds(rec.timeMs)),
    ),
    h('div', { class: 'body', 'data-scale-group': '1' },
      h('p', { class: 'q-instruction' }, q.instruction),
      q.promptHtml ? h('div', { class: 'prompt', html: q.promptHtml }) : null,
      reviewOptions(q, rec.chosen),
      h('p', null, h('strong', null, 'Jouw antwoord: '), yours, ' · ', h('strong', null, 'Goed: '), right),
      h('div', { class: 'feedback' }, h('strong', null, 'Uitleg'), h('div', { html: q.explanationHtml })),
    ),
  );
}

function partSummaryTable(parts: PartResult[]): HTMLElement {
  const rows = parts.map((p) => {
    const good = p.records.filter(isCorrect).length;
    const n = p.records.length;
    return h('tr', null,
      h('td', null, subtestById(p.subtest)?.name ?? p.subtest),
      h('td', null, `${good}/${n}`),
      h('td', null, pctText(good, n)),
      h('td', null, `${formatTime(p.ms)}${p.timedOut ? ' (tijd op)' : ''}`),
      h('td', null, n ? formatSeconds(p.ms / n) : '–'),
    );
  });
  return h('div', { class: 'table-wrap' },
    h('table', null,
      h('caption', { class: 'sr-only' }, 'Overzicht per subtest'),
      h('thead', null, h('tr', null, h('th', null, 'Subtest'), h('th', null, 'Score'), h('th', null, '%'), h('th', null, 'Tijd'), h('th', null, 'Per vraag'))),
      h('tbody', null, ...rows)));
}

export function renderResults(main: HTMLElement): void {
  const res = app.lastResult;
  setTitle('Resultaat');
  if (!res) {
    main.replaceChildren(h('div', { class: 'card empty' }, h('p', null, 'Er is nog geen resultaat om te laten zien.'), h('a', { class: 'btn btn-primary', href: '#/' }, 'Naar start')));
    return;
  }
  const all = res.parts.flatMap((p) => p.records);
  const good = all.filter(isCorrect).length;
  const totalMs = res.parts.reduce((s, p) => s + p.ms, 0);
  const wrong = all.filter((r) => !isCorrect(r));
  const timedOut = res.parts.some((p) => p.timedOut);

  const retry = () => {
    const groups = new Map<string, PartConfig>();
    for (const p of res.parts) {
      const qs = p.records.filter((r) => !isCorrect(r)).map((r) => r.q);
      if (qs.length === 0) continue;
      const key = `${p.subtest}|${p.level}`;
      const g = groups.get(key);
      if (g) g.preset!.push(...qs);
      else groups.set(key, { subtest: p.subtest, level: p.level, count: qs.length, seconds: null, preset: qs });
    }
    for (const g of groups.values()) g.count = g.preset!.length;
    startSession({ mode: 'oefen', title: 'Fouten opnieuw oefenen', parts: [...groups.values()], retry: true });
  };
  const again = () => {
    const c = res.config;
    startSession({ ...c, parts: c.parts.map((p) => ({ ...p, preset: c.retry ? p.preset : undefined })) });
  };

  const head = h('section', { class: 'card' },
    h('p', { class: 'q-meta' }, res.config.title + (res.config.retry ? ' (telt niet mee in je voortgang)' : '')),
    h('h1', { tabindex: '-1', id: 'res-title' }, 'Je resultaat'),
    h('div', { class: 'score-big' }, `${good} / ${all.length}`),
    h('p', { class: 'muted' }, `${pctText(good, all.length)} goed${timedOut ? ' · de tijd was op' : ''}`),
    h('div', { class: 'stats' },
      stat(formatTime(totalMs), 'totale tijd'),
      stat(all.length ? formatSeconds(totalMs / all.length) : '–', 'gemiddeld per vraag'),
      stat(String(wrong.length), 'fout of niet beantwoord'),
      res.parts.length === 1 ? stat(LEVEL_NAMES[res.parts[0].level], 'niveau') : null,
    ),
    h('div', { class: 'actions' },
      wrong.length > 0 ? h('button', { class: 'btn btn-primary btn-block', onclick: retry }, `Fouten opnieuw oefenen (${wrong.length})`) : h('p', { class: 'feedback good' }, h('strong', null, 'Alles goed. Knap!')),
      h('div', { class: 'btn-row' },
        h('button', { class: 'btn', onclick: again }, res.config.retry ? 'Nog eens' : 'Nieuwe ronde'),
        h('a', { class: 'btn', href: '#/' }, 'Naar start'),
      ),
      h('a', { class: 'btn', href: '#/voortgang' }, 'Bekijk je voortgang'),
    ),
  );

  const sections: HTMLElement[] = [head];
  if (res.parts.length > 1) sections.push(h('section', { class: 'card' }, h('h2', null, 'Per subtest'), partSummaryTable(res.parts)));

  for (const p of res.parts) {
    if (p.records.length === 0) continue;
    const def = subtestById(p.subtest);
    sections.push(
      h('section', { class: 'card' },
        h('h2', null, res.parts.length > 1 ? `${def?.name ?? p.subtest}: alle vragen` : 'Alle vragen'),
        h('p', { class: 'muted small' }, 'Fouten staan open, goede antwoorden kun je openklikken. Rechts zie je hoe lang je over elke vraag deed.'),
        ...p.records.map((r, i) => reviewItem(r, i + 1)),
      ),
    );
  }
  main.replaceChildren(...sections, disclaimer());
  fitFigures(main);
  main.querySelector<HTMLElement>('#res-title')?.focus();
}
