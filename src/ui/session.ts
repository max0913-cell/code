import { makeRng } from '../core/rng';
import { LETTERS, LEVEL_NAMES, type Level, type Question, type SubtestId } from '../core/types';
import { type Mode, addHistory } from '../storage';
import { subtestById } from '../subtests/registry';
import { formatTime, h, setTitle } from './dom';
import { fitFigures } from './figscale';

export interface PartConfig {
  subtest: SubtestId;
  level: Level;
  count: number;
  /** Tijdslimiet in seconden, of null voor geen tijd. */
  seconds: number | null;
  /** Vaste vragen (voor "fouten opnieuw oefenen"). */
  preset?: Question[];
}

export interface SessionConfig {
  mode: Mode;
  title: string;
  parts: PartConfig[];
  /** Herhaalronde: telt niet mee in de voortgang. */
  retry?: boolean;
}

export interface AnswerRecord {
  q: Question;
  chosen: number[];
  timeMs: number;
  /** In de oefenmodus: is de vraag nagekeken? */
  checked: boolean;
}

export interface PartResult {
  subtest: SubtestId;
  level: Level;
  records: AnswerRecord[];
  ms: number;
  seconds: number | null;
  timedOut: boolean;
}

export interface SessionResult {
  config: SessionConfig;
  parts: PartResult[];
  finishedAt: number;
}

export const isCorrect = (r: AnswerRecord): boolean =>
  r.chosen.length === r.q.correct.length && r.chosen.slice().sort((a, b) => a - b).every((c, i) => c === r.q.correct[i]);

export const app: { session: Session | null; lastResult: SessionResult | null; lastConfig: SessionConfig | null } = {
  session: null,
  lastResult: null,
  lastConfig: null,
};

/** Maak alle vragen voor een deel, zonder herhaling binnen de ronde. */
export function buildQuestions(part: PartConfig, seed?: number): Question[] {
  if (part.preset) return part.preset.slice();
  const def = subtestById(part.subtest);
  if (!def) throw new Error(`Onbekende subtest ${part.subtest}`);
  const r = makeRng(seed);
  const used = new Set<string>();
  const out: Question[] = [];
  for (let i = 0; i < part.count; i++) {
    const q = def.make(part.level, r, used);
    if (used.has(q.key)) break; // vragenbank op: stop liever dan herhalen
    used.add(q.key);
    out.push(q);
  }
  return out;
}

export class Session {
  readonly config: SessionConfig;
  private partIndex = 0;
  private questions: Question[] = [];
  private records: AnswerRecord[] = [];
  private index = 0;
  private partStart = 0;
  private qStart = 0;
  private timerId: number | null = null;
  private results: PartResult[] = [];
  private root: HTMLElement | null = null;
  private keyHandler = (e: KeyboardEvent) => this.onKey(e);
  private inIntro = false;
  private finished = false;

  constructor(config: SessionConfig) {
    this.config = config;
  }

  get mode(): Mode {
    return this.config.mode;
  }
  private get part(): PartConfig {
    return this.config.parts[this.partIndex];
  }
  private get def() {
    return subtestById(this.part.subtest)!;
  }

  mount(root: HTMLElement): void {
    this.root = root;
    document.addEventListener('keydown', this.keyHandler);
    if (this.questions.length === 0 && !this.inIntro) this.startPart(0);
    else this.render();
  }

  dispose(): void {
    document.removeEventListener('keydown', this.keyHandler);
    this.stopTimer();
    this.root = null;
  }

  private startPart(i: number): void {
    this.partIndex = i;
    this.questions = buildQuestions(this.part);
    this.records = this.questions.map((q) => ({ q, chosen: [], timeMs: 0, checked: false }));
    this.index = 0;
    // Bij de examensimulatie en bij meerdere delen eerst een introscherm.
    if (this.mode === 'examen') {
      this.inIntro = true;
      this.renderIntro();
      return;
    }
    this.beginQuestions();
  }

  private beginQuestions(): void {
    this.inIntro = false;
    this.partStart = performance.now();
    this.qStart = performance.now();
    if (this.part.seconds && this.mode !== 'oefen') this.startTimer();
    this.render();
  }

  // ---------- timer ----------
  private remainingMs(): number {
    if (!this.part.seconds) return Infinity;
    return this.part.seconds * 1000 - (performance.now() - this.partStart);
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerId = window.setInterval(() => {
      const rem = this.remainingMs();
      const el = this.root?.querySelector<HTMLElement>('.timer');
      if (el) {
        el.textContent = formatTime(rem);
        el.classList.toggle('low', rem < 60000);
      }
      if (rem <= 0) this.finishPart(true);
    }, 250);
  }

  private stopTimer(): void {
    if (this.timerId !== null) window.clearInterval(this.timerId);
    this.timerId = null;
  }

  private bankTime(): void {
    const now = performance.now();
    const rec = this.records[this.index];
    if (rec && !(this.mode === 'oefen' && rec.checked)) rec.timeMs += now - this.qStart;
    this.qStart = now;
  }

  // ---------- acties ----------
  private choose(i: number): void {
    const rec = this.records[this.index];
    if (!rec || i >= rec.q.options.length) return;
    if (this.mode === 'oefen' && rec.checked) return;
    const need = rec.q.correct.length;
    if (need === 1) {
      rec.chosen = [i];
      if (this.mode === 'oefen') {
        this.check();
        return;
      }
    } else if (rec.chosen.includes(i)) {
      rec.chosen = rec.chosen.filter((c) => c !== i);
    } else {
      rec.chosen = [...rec.chosen, i];
      if (rec.chosen.length > need) rec.chosen.shift();
    }
    this.render(false);
  }

  private check(): void {
    const rec = this.records[this.index];
    if (rec.chosen.length !== rec.q.correct.length) return;
    this.bankTime();
    rec.checked = true;
    this.render(false);
    this.root?.querySelector<HTMLElement>('[data-next]')?.focus();
  }

  private go(delta: number): void {
    const next = this.index + delta;
    if (next < 0) return;
    if (next >= this.questions.length) {
      if (this.mode === 'oefen') this.finishPart(false);
      return;
    }
    this.bankTime();
    this.index = next;
    this.render();
  }

  private jump(i: number): void {
    if (i === this.index) return;
    this.bankTime();
    this.index = i;
    this.render();
  }

  private submit(): void {
    const open = this.records.filter((r) => r.chosen.length !== r.q.correct.length).length;
    if (open > 0 && !window.confirm(`Je hebt nog ${open} ${open === 1 ? 'vraag' : 'vragen'} niet (helemaal) beantwoord. Toch inleveren?`)) return;
    this.finishPart(false);
  }

  stopPractice(): void {
    const answered = this.records.filter((r) => r.checked).length;
    if (answered === 0) {
      this.dispose();
      app.session = null;
      location.hash = '#/';
      return;
    }
    this.records = this.records.filter((r) => r.checked);
    this.finishPart(false, true);
  }

  private finishPart(timedOut: boolean, stopAll = false): void {
    if (this.finished) return;
    this.stopTimer();
    if (this.mode !== 'oefen') this.bankTime();
    const records = this.mode === 'oefen' ? this.records.filter((r) => r.checked) : this.records;
    this.results.push({
      subtest: this.part.subtest,
      level: this.part.level,
      records,
      ms: records.reduce((s, r) => s + r.timeMs, 0),
      seconds: this.mode === 'oefen' ? null : this.part.seconds,
      timedOut,
    });
    if (!stopAll && this.partIndex + 1 < this.config.parts.length) {
      this.startPart(this.partIndex + 1);
      return;
    }
    this.finishSession();
  }

  private finishSession(): void {
    this.finished = true;
    const result: SessionResult = { config: this.config, parts: this.results, finishedAt: Date.now() };
    app.lastResult = result;
    if (!this.config.retry) {
      addHistory(
        result.parts
          .filter((p) => p.records.length > 0)
          .map((p) => ({
            t: result.finishedAt,
            subtest: p.subtest,
            level: p.level,
            mode: this.config.mode,
            score: p.records.filter(isCorrect).length,
            total: p.records.length,
            ms: Math.round(p.ms),
          })),
      );
    }
    this.dispose();
    app.session = null;
    location.hash = '#/resultaat';
  }

  // ---------- toetsenbord ----------
  private onKey(e: KeyboardEvent): void {
    if (!this.root || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
    if (this.inIntro) return;
    const key = e.key.toLowerCase();
    const li = LETTERS.indexOf(key);
    const ni = '123456'.indexOf(key);
    const idx = li >= 0 ? li : ni;
    if (idx >= 0) {
      e.preventDefault();
      this.choose(idx);
      return;
    }
    const rec = this.records[this.index];
    if (!rec) return;
    if (key === 'enter') {
      if (t && (t.tagName === 'BUTTON' || t.tagName === 'A' || t.tagName === 'SUMMARY')) return;
      e.preventDefault();
      if (this.mode === 'oefen') {
        if (rec.checked) this.go(1);
        else this.check();
      } else if (this.index < this.questions.length - 1) this.go(1);
    } else if (this.mode !== 'oefen' && key === 'arrowright') {
      e.preventDefault();
      this.go(1);
    } else if (this.mode !== 'oefen' && key === 'arrowleft') {
      e.preventDefault();
      this.go(-1);
    }
  }

  // ---------- weergave ----------
  private renderIntro(): void {
    if (!this.root) return;
    const def = this.def;
    setTitle(this.config.title);
    this.root.replaceChildren(
      h('div', { class: 'card stack' },
        h('p', { class: 'q-meta' }, `Deel ${this.partIndex + 1} van ${this.config.parts.length}`),
        h('h1', { tabindex: '-1', id: 'intro-title' }, def.name),
        h('p', null, def.description),
        h('p', null, `${this.questions.length} vragen · ${this.part.seconds ? `${Math.round(this.part.seconds / 60)} minuten` : 'geen tijdslimiet'} · niveau ${LEVEL_NAMES[this.part.level].toLowerCase()}`),
        h('p', { class: 'muted small' }, 'De tijd start zodra je op de knop drukt. Je kunt binnen dit deel terugbladeren en antwoorden aanpassen.'),
        h('button', { class: 'btn btn-primary btn-block', onclick: () => this.beginQuestions() }, `Start ${def.name.toLowerCase()}`),
      ),
    );
    this.root.querySelector<HTMLElement>('#intro-title')?.focus();
  }

  private render(moveFocus = true): void {
    if (!this.root) return;
    if (this.inIntro) {
      this.renderIntro();
      return;
    }
    const rec = this.records[this.index];
    if (!rec) return;
    const active = document.activeElement as HTMLElement | null;
    const focusedOption = active?.dataset.i !== undefined && this.root.contains(active) ? Number(active.dataset.i) : -1;
    const q = rec.q;
    const def = this.def;
    const total = this.questions.length;
    const practice = this.mode === 'oefen';
    setTitle(`${def.name} · vraag ${this.index + 1}`);

    // kop
    const head = h('div', { class: 'session-head' },
      h('div', { class: 'title' }, this.mode === 'examen' ? `Examen · ${def.name}` : def.name),
      !practice && this.part.seconds ? h('div', { class: 'timer', role: 'timer', 'aria-label': 'Resterende tijd' }, formatTime(this.remainingMs())) : null,
      practice
        ? h('button', { class: 'icon-btn', onclick: () => this.stopPractice() }, 'Stoppen')
        : h('button', { class: 'icon-btn', onclick: () => this.submit() }, 'Inleveren'),
    );
    const done = practice ? this.records.filter((r) => r.checked).length : this.records.filter((r) => r.chosen.length === r.q.correct.length).length;
    const progress = h('div', { class: 'progress', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-valuenow': String(done), 'aria-label': 'Voortgang' },
      h('div', { style: `width:${(100 * done) / Math.max(1, total)}%` }));

    const score = practice ? this.records.filter((r) => r.checked && isCorrect(r)).length : 0;
    const meta = h('div', { class: 'q-meta' },
      `Vraag ${this.index + 1} van ${total} · ${LEVEL_NAMES[q.level]}${practice && done > 0 ? ` · ${score} van ${done} goed` : ''}${q.correct.length === 2 ? ' · kies 2 antwoorden' : ''}`);
    const instruction = h('div', { class: 'q-instruction', tabindex: '-1', id: 'q-instruction' }, q.instruction);
    const prompt = q.promptHtml ? h('div', { class: 'prompt', html: q.promptHtml }) : null;

    // opties
    const showFeedback = practice && rec.checked;
    const n = q.options.length;
    const shortText = q.optionStyle === 'text' && q.options.every((o) => o.label.length <= 8);
    const optionsEl = h('div', {
      class: `options ${q.optionStyle} n${n}${shortText ? ' short' : ''}`,
      role: 'group',
      'aria-label': q.correct.length === 2 ? 'Antwoordopties, kies er 2' : 'Antwoordopties',
    });
    q.options.forEach((o, i) => {
      const selected = rec.chosen.includes(i);
      let cls = `opt${q.optionStyle === 'figure' ? ' figure-opt' : ''}`;
      if (showFeedback) {
        if (q.correct.includes(i)) cls += ' correct';
        else if (selected) cls += ' wrong';
      }
      const btn = h('button', {
        class: cls,
        type: 'button',
        'aria-pressed': selected ? 'true' : 'false',
        'aria-label': `Optie ${LETTERS[i]}: ${o.label}${showFeedback && q.correct.includes(i) ? ' (goed antwoord)' : ''}`,
        disabled: showFeedback,
        'data-i': String(i),
        onclick: () => this.choose(i),
      }, h('span', { class: 'letter', 'aria-hidden': 'true' }, LETTERS[i]), h('span', { class: 'opt-body', html: o.html }));
      optionsEl.append(btn);
    });

    // feedback / acties
    const live = h('div', { 'aria-live': 'polite' });
    const actions = h('div', { class: 'actions' });
    if (practice) {
      if (showFeedback) {
        const ok = isCorrect(rec);
        const right = q.correct.map((c) => LETTERS[c]).join(' en ');
        live.append(
          h('div', { class: `feedback ${ok ? 'good' : 'bad'}` },
            h('strong', null, ok ? 'Goed!' : `Helaas. Het goede antwoord is ${right}.`),
            h('div', { html: q.explanationHtml }),
          ),
        );
        const last = this.index === total - 1;
        actions.append(h('button', { class: 'btn btn-primary btn-block', 'data-next': '1', onclick: () => this.go(1) }, last ? 'Bekijk je resultaat' : 'Volgende vraag'));
      } else if (q.correct.length === 2) {
        actions.append(
          h('button', {
            class: 'btn btn-primary btn-block',
            disabled: rec.chosen.length !== 2,
            onclick: () => this.check(),
          }, rec.chosen.length === 2 ? 'Controleer' : `Kies nog ${2 - rec.chosen.length}`),
        );
      }
    } else {
      actions.classList.add('two');
      actions.append(
        h('button', { class: 'btn', disabled: this.index === 0, onclick: () => this.go(-1) }, '← Vorige'),
        this.index < total - 1
          ? h('button', { class: 'btn btn-primary', onclick: () => this.go(1) }, 'Volgende →')
          : h('button', { class: 'btn btn-primary', onclick: () => this.submit() }, this.partIndex + 1 < this.config.parts.length ? 'Volgend deel' : 'Inleveren'),
      );
    }

    let navigator: HTMLElement | null = null;
    if (!practice) {
      navigator = h('nav', { class: 'navigator', 'aria-label': 'Ga naar vraag' });
      this.records.forEach((r, i) => {
        const answered = r.chosen.length === r.q.correct.length;
        navigator!.append(h('button', {
          type: 'button',
          class: answered ? 'answered' : '',
          'aria-current': i === this.index ? 'true' : 'false',
          'aria-label': `Vraag ${i + 1}${answered ? ', beantwoord' : ''}`,
          onclick: () => this.jump(i),
        }, String(i + 1)));
      });
    }

    const help = h('p', { class: 'kbd-help' },
      practice
        ? 'Toetsenbord: a t/m f (of 1 t/m 6) kiest een antwoord, Enter gaat verder.'
        : 'Toetsenbord: a t/m f (of 1 t/m 6) kiest een antwoord, pijltjes ← → bladeren.');

    this.root.replaceChildren(h('div', { class: 'card', 'data-scale-group': '1' }, head, progress, meta, instruction, prompt, optionsEl, live, actions, navigator, help));
    fitFigures(this.root);
    if (moveFocus) this.root.querySelector<HTMLElement>('#q-instruction')?.focus({ preventScroll: false });
    else if (focusedOption >= 0) {
      const btn = this.root.querySelector<HTMLButtonElement>(`[data-i="${focusedOption}"]`);
      if (btn && !btn.disabled) btn.focus();
    }
  }
}

export function startSession(config: SessionConfig): void {
  app.session?.dispose();
  app.lastConfig = config;
  app.session = new Session(config);
  location.hash = '#/sessie';
}
