import type { Level, SubtestId } from './core/types';

export type Mode = 'oefen' | 'toets' | 'examen';
export type Theme = 'auto' | 'light' | 'dark';

export interface HistoryEntry {
  /** Tijdstip (ms sinds 1970). */
  t: number;
  subtest: SubtestId;
  level: Level;
  mode: Mode;
  score: number;
  total: number;
  /** Totale tijd in ms. */
  ms: number;
}

export interface TimerSetting {
  count: number;
  minutes: number;
}

export interface Stored {
  v: 1;
  theme: Theme;
  level: Level;
  timers: Partial<Record<SubtestId, TimerSetting>>;
  practiceCount: number;
  history: HistoryEntry[];
}

const KEY = 'noa-oefenen-v1';
const MAX_HISTORY = 2000;

const defaults = (): Stored => ({ v: 1, theme: 'auto', level: 'examen', timers: {}, practiceCount: 10, history: [] });

let memory: Stored | null = null;

/** Lees de opgeslagen gegevens. Werkt ook als localStorage geblokkeerd is (privévenster). */
export function load(): Stored {
  if (memory) return memory;
  let data = defaults();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Stored>;
      if (parsed && parsed.v === 1) {
        data = {
          ...data,
          ...parsed,
          timers: { ...(parsed.timers ?? {}) },
          history: Array.isArray(parsed.history) ? parsed.history.filter(validEntry) : [],
        };
      }
    }
  } catch {
    /* geen toegang tot localStorage: we werken alleen in het geheugen */
  }
  memory = data;
  return data;
}

function validEntry(e: unknown): e is HistoryEntry {
  const x = e as HistoryEntry;
  return !!x && typeof x.t === 'number' && typeof x.score === 'number' && typeof x.total === 'number' && x.total > 0;
}

export function save(update: (s: Stored) => void): void {
  const s = load();
  update(s);
  if (s.history.length > MAX_HISTORY) s.history = s.history.slice(-MAX_HISTORY);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* opslaan mislukt (vol of geblokkeerd): de gegevens blijven in het geheugen */
  }
}

export function addHistory(entries: HistoryEntry[]): void {
  if (entries.length === 0) return;
  save((s) => s.history.push(...entries));
}

export function clearAll(): void {
  memory = defaults();
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* niets te wissen */
  }
}

/** Kan de browser gegevens bewaren? (voor een melding op de voortgangspagina) */
export function storageAvailable(): boolean {
  try {
    const k = `${KEY}-test`;
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}
