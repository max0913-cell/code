import './styles.css';
import { load, save, type Theme } from './storage';
import { h } from './ui/dom';
import { renderHome } from './ui/home';
import { renderProgress } from './ui/progress';
import { renderResults } from './ui/results';
import { installFigureScaling } from './ui/figscale';
import { app } from './ui/session';
import { renderExamSetup, renderSetup } from './ui/setup';

const THEME_LABEL: Record<Theme, string> = { auto: 'Thema: auto', light: 'Thema: licht', dark: 'Thema: donker' };
const NEXT_THEME: Record<Theme, Theme> = { auto: 'light', light: 'dark', dark: 'auto' };

function applyTheme(t: Theme): void {
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

function topbar(): HTMLElement {
  const theme = load().theme;
  const themeBtn = h('button', {
    class: 'icon-btn',
    type: 'button',
    'aria-label': `${THEME_LABEL[theme]}. Klik om te wisselen.`,
    onclick: () => {
      const next = NEXT_THEME[load().theme];
      save((s) => (s.theme = next));
      applyTheme(next);
      themeBtn.textContent = THEME_LABEL[next].replace('Thema: ', '');
      themeBtn.setAttribute('aria-label', `${THEME_LABEL[next]}. Klik om te wisselen.`);
    },
  }, THEME_LABEL[theme].replace('Thema: ', ''));
  const mark = h('span', { class: 'brand-mark', 'aria-hidden': 'true', html: '<svg width="18" height="18" viewBox="0 0 32 32"><path d="M9 23V9l14 14V9" stroke="white" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' });
  return h('header', { class: 'topbar' },
    h('div', { class: 'topbar-inner' },
      h('a', { class: 'brand', href: '#/' }, mark, h('span', null, 'NOA-oefenen')),
      h('a', { class: 'icon-btn', href: '#/voortgang', style: 'display:grid;place-items:center;text-decoration:none' }, 'Voortgang'),
      themeBtn,
    ));
}

const root = document.getElementById('app')!;
const main = h('main', { id: 'main', tabindex: '-1' });
root.append(topbar(), main);
applyTheme(load().theme);
installFigureScaling();

let lastRoute = '';

function route(): void {
  const hash = location.hash || '#/';
  const sessionRoute = hash === '#/sessie';
  if (!sessionRoute && app.session) {
    // De sessie is verlaten (bijvoorbeeld met de terugknop): timers stoppen.
    app.session.dispose();
    app.session = null;
  }
  let m: RegExpMatchArray | null;
  if (sessionRoute) {
    if (!app.session) {
      location.replace('#/');
      return;
    }
    app.session.mount(main);
  } else if ((m = hash.match(/^#\/start\/(\w+)\/(oefen|toets)$/))) {
    renderSetup(main, m[1], m[2] as 'oefen' | 'toets');
  } else if (hash === '#/examen') {
    renderExamSetup(main);
  } else if (hash === '#/resultaat') {
    renderResults(main);
  } else if (hash === '#/voortgang') {
    renderProgress(main);
  } else {
    renderHome(main);
  }
  if (hash !== lastRoute) {
    window.scrollTo(0, 0);
    if (!sessionRoute && hash !== '#/resultaat') main.focus({ preventScroll: true });
  }
  lastRoute = hash;
}

window.addEventListener('hashchange', route);
route();
