export type Level = 'makkelijk' | 'examen' | 'moeilijk';
export const LEVELS: readonly Level[] = ['makkelijk', 'examen', 'moeilijk'];
export const LEVEL_NAMES: Record<Level, string> = {
  makkelijk: 'Makkelijk',
  examen: 'Examen',
  moeilijk: 'Moeilijk',
};

export type SubtestId =
  | 'analogieen'
  | 'rekenen'
  | 'exclusie'
  | 'componenten'
  | 'reeksen'
  | 'woordrelaties'
  | 'spiegel';

export interface Option {
  /** HTML voor de knop (tekst, breuk of SVG). */
  html: string;
  /** Platte tekst voor aria-labels en het resultatenoverzicht. */
  label: string;
}

export interface Question {
  /** Unieke sleutel binnen subtest en niveau, voor "geen herhaling binnen een ronde". */
  key: string;
  subtest: SubtestId;
  level: Level;
  /** Som- of regeltype, voor variatie en tests. */
  type: string;
  /** Korte instructie boven de vraag. */
  instruction: string;
  promptHtml: string;
  promptLabel: string;
  options: Option[];
  /** Indices van de goede opties, oplopend gesorteerd. */
  correct: number[];
  explanationHtml: string;
  /** Opties als figuren (grotere tegels) of als tekst. */
  optionStyle: 'text' | 'figure';
}

export const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];
