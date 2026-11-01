import { LEVELS, LEVEL_NAMES, type Level } from '../core/types';
import { load, save } from '../storage';
import { SUBTESTS, type SubtestDef } from '../subtests/registry';
import { h, setTitle } from './dom';

export const LEVEL_HELP: Record<Level, string> = {
  makkelijk: 'Onder examenniveau: om de vraagvorm te leren.',
  examen: 'Zo dicht mogelijk bij het echte niveau (hbo/wo).',
  moeilijk: 'Boven examenniveau: om te overtrainen.',
};

export const OFFICIAL_LINKS: { href: string; text: string }[] = [
  { href: 'https://www.eur.nl/erasmusmc/onderwijs/decentrale-selectie/verdiep-je-de-toelating-opleiding-en-selectie', text: 'Erasmus MC: verdiep je in de toelating, opleiding en selectie' },
  { href: 'https://www.eur.nl/erasmusmc/media/2026-09-eurreglementselectie2027-2028', text: 'Reglement selectie 2027-2028' },
  { href: 'https://eur.nl/erasmusmc/media/125011', text: 'NOA-testvoorbeelden (officieel)' },
  { href: 'https://eur.nl/erasmusmc/media/125009', text: 'Slides coachingswebinar 2025' },
  { href: 'https://assess.ly/en/noa/', text: 'Gratis oefentest van NOA (assess.ly)' },
];

export function levelPicker(current: Level, onChange: (l: Level) => void, name = 'niveau'): HTMLElement {
  const help = h('p', { class: 'level-help muted small', 'aria-live': 'polite' }, LEVEL_HELP[current]);
  const fs = h('fieldset', { class: 'seg' }, h('legend', { class: 'sr-only' }, 'Kies je niveau'));
  for (const l of LEVELS) {
    const input = h('input', {
      type: 'radio',
      name,
      value: l,
      checked: l === current,
      onchange: () => {
        help.textContent = LEVEL_HELP[l];
        onChange(l);
      },
    });
    fs.append(h('label', null, input, h('span', null, LEVEL_NAMES[l])));
  }
  return h('div', null, fs, help);
}

function statLine(def: SubtestDef, level: Level): string {
  const hist = load().history.filter((e) => e.subtest === def.id && e.level === level);
  if (hist.length === 0) return `Nog niet geoefend op ${LEVEL_NAMES[level].toLowerCase()}.`;
  const last = hist[hist.length - 1];
  const best = Math.max(...hist.map((e) => e.score / e.total));
  return `${hist.length}× gedaan · laatste ${last.score}/${last.total} · beste ${Math.round(best * 100)}%`;
}

function subtestCard(def: SubtestDef, level: Level): HTMLElement {
  return h('article', { class: 'card subtest-card' },
    h('h3', null, def.name, def.extra ? h('span', { class: 'badge' }, 'extra: misschien niet op de selectiedag') : h('span', { class: 'badge badge-main' }, 'hoofdsubtest')),
    h('p', { class: 'muted small', style: 'margin:0' }, def.description),
    h('p', { class: 'stat-line', style: 'margin:0', 'data-stat': def.id }, statLine(def, level)),
    h('div', { class: 'btn-row' },
      h('a', { class: 'btn btn-primary', href: `#/start/${def.id}/oefen` }, 'Oefenen'),
      h('a', { class: 'btn', href: `#/start/${def.id}/toets` }, 'Toets met tijd'),
    ),
  );
}

export function renderHome(main: HTMLElement): void {
  setTitle('');
  const st = load();
  const main4 = SUBTESTS.filter((s) => !s.extra);
  const extra = SUBTESTS.filter((s) => s.extra);
  const mainGrid = h('div', { class: 'subtests' }, ...main4.map((d) => subtestCard(d, st.level)));
  const extraGrid = h('div', { class: 'subtests' }, ...extra.map((d) => subtestCard(d, st.level)));

  const picker = levelPicker(st.level, (l) => {
    save((s) => (s.level = l));
    for (const d of SUBTESTS) {
      const el = main.querySelector(`[data-stat="${d.id}"]`);
      if (el) el.textContent = statLine(d, l);
    }
  });

  main.replaceChildren(
    h('section', { class: 'hero' },
      h('h1', null, 'Oefenen voor de NOA-capaciteitentest'),
      h('p', null, 'Voor de decentrale selectie Geneeskunde van het Erasmus MC, studiejaar 2027-2028. Elke subtest op drie niveaus, met uitleg bij elk antwoord. Rekenen en de figuurtests maken elke ronde nieuwe opgaven.'),
    ),
    h('section', { class: 'card', 'aria-labelledby': 'lvl-h' },
      h('h2', { id: 'lvl-h' }, 'Kies je niveau'),
      picker,
    ),
    h('section', { 'aria-labelledby': 'main-h' },
      h('h2', { id: 'main-h' }, 'Hoofdsubtests'),
      h('p', { class: 'muted small' }, 'In de selectieronde van 2025 had de capaciteitentest deze vier subtests. Voor 2027 kan dat anders zijn.'),
      mainGrid,
    ),
    h('section', { class: 'card', 'aria-labelledby': 'exam-h', style: 'margin-top:16px' },
      h('h2', { id: 'exam-h' }, 'Examensimulatie'),
      h('p', null, 'De vier hoofdsubtests achter elkaar op examenniveau, elk met een eigen tijdslimiet. Aan het eind zie je een overzicht per subtest.'),
      h('a', { class: 'btn btn-primary btn-block', href: '#/examen' }, 'Start examensimulatie'),
    ),
    h('section', { 'aria-labelledby': 'extra-h' },
      h('h2', { id: 'extra-h' }, 'Extra subtests'),
      h('p', { class: 'muted small' }, 'NOA gebruikt deze subtests in vergelijkbare capaciteitentests. Ze zitten misschien niet in de test op de selectiedag, maar zijn goede extra training.'),
      extraGrid,
    ),
    h('section', { class: 'card', 'aria-labelledby': 'dag-h', style: 'margin-top:16px' },
      h('h2', { id: 'dag-h' }, 'De selectie in het kort'),
      h('ul', { class: 'dates' },
        h('li', null, h('div', { class: 'date-chip' }, '15 jan', h('small', null, '2027')),
          h('div', null, h('strong', null, 'Aanmelden via Studielink'), h('br'), h('span', { class: 'muted small' }, 'Uiterlijk 15 januari 2027.'))),
        h('li', null, h('div', { class: 'date-chip' }, '5 feb', h('small', null, '12:00 uur')),
          h('div', null, h('strong', null, 'E-module en voorbereidingsopdracht inleveren'), h('br'), h('span', { class: 'muted small' }, 'Uiterlijk 5 februari 2027 om 12:00 uur.'))),
        h('li', null, h('div', { class: 'date-chip' }, '1 week', h('small', null, 'ervoor')),
          h('div', null, h('strong', null, 'Kennisclip voor de theorietoets'), h('br'), h('span', { class: 'muted small' }, 'Je krijgt de kennisclip (ongeveer 45 minuten) een week voor de selectiedag.'))),
        h('li', null, h('div', { class: 'date-chip' }, '6 mrt', h('small', null, 'zaterdag')),
          h('div', null, h('strong', null, 'Selectiedag op Campus Woudestein'), h('br'), h('span', { class: 'muted small' }, 'Zaterdag 6 maart 2027.'))),
      ),
      h('h3', { style: 'margin-top:16px' }, 'Onderdelen van de selectiedag'),
      h('ul', { class: 'links' },
        h('li', null, h('strong', null, 'NOA-capaciteitentest'), ': de test waar deze site voor is. In 2025 met woordanalogieën, rekenvaardigheid, exclusie en componenten.'),
        h('li', null, h('strong', null, 'Theorietoets'), ': over de kennisclip van ongeveer 45 minuten die je een week van tevoren krijgt.'),
        h('li', null, h('strong', null, 'CGO-toets'), ': een toets over casusgestuurd onderwijs.'),
      ),
      h('p', { class: 'notice', style: 'margin-top:12px' }, 'Controleer alle data en eisen altijd op de site van het Erasmus MC. Die informatie gaat voor.'),
    ),
    h('section', { class: 'card', 'aria-labelledby': 'links-h' },
      h('h2', { id: 'links-h' }, 'Officieel materiaal'),
      h('ul', { class: 'links' }, ...OFFICIAL_LINKS.map((l) => h('li', null, h('a', { href: l.href, target: '_blank', rel: 'noopener noreferrer' }, l.text)))),
    ),
    disclaimer(),
  );
}

export function disclaimer(): HTMLElement {
  return h('footer', { class: 'disclaimer' },
    h('p', null, h('strong', null, 'Disclaimer. '),
      'Deze site is niet verbonden aan het Erasmus MC of aan NOA. Alle opgaven zijn zelf gemaakt, in hetzelfde format als de echte test, en komen niet uit officiële voorbeelden of betaalde oefensites. Controleer data altijd op de site van het Erasmus MC.'),
    h('p', null, 'Je resultaten worden alleen op dit apparaat bewaard (in je browser), niet op een server.'),
  );
}
