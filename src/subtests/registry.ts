import type { Rng } from '../core/rng';
import type { Level, Question, SubtestId } from '../core/types';
import { makeAnalogie, makeRelatie } from './banks';
import { generateRekenen, rekenToQuestion } from './rekenen/generator';
import { generateReeks, reeksToQuestion } from './reeksen/generator';
import { exclusieToQuestion, generateExclusie } from './exclusie/generator';
import { generateComponenten } from './componenten/generator';
import { compToQuestion } from './componenten/render';
import { generateSpiegel } from './spiegel/generator';
import { spiegelToQuestion } from './spiegel/render';

export interface SubtestDef {
  id: SubtestId;
  name: string;
  /** Korte uitleg van de vraagvorm. */
  description: string;
  /** Extra subtest: misschien niet op de selectiedag. */
  extra: boolean;
  /** Hoeveel opties de kandidaat moet kiezen. */
  select: 1 | 2;
  /** Standaard aantal vragen en minuten in de toetsmodus (de echte tijden zijn niet bekend). */
  defaultCount: number;
  defaultMinutes: number;
  /** Maak een nieuwe opgave die niet in `used` voorkomt. */
  make(level: Level, r: Rng, used: Set<string>): Question;
}

/** Probeer een generator een paar keer tot er een opgave uitkomt die nog niet gebruikt is. */
export function fresh(gen: () => Question, used: Set<string>, tries = 200): Question {
  let q = gen();
  for (let i = 0; i < tries && used.has(q.key); i++) q = gen();
  return q;
}

export const SUBTESTS: SubtestDef[] = [
  {
    id: 'analogieen',
    name: 'Woordanalogieën',
    description: 'Vind het woord dat op dezelfde manier bij het derde woord hoort als het tweede bij het eerste.',
    extra: false,
    select: 1,
    defaultCount: 20,
    defaultMinutes: 8,
    make: makeAnalogie,
  },
  {
    id: 'rekenen',
    name: 'Rekenvaardigheid',
    description: 'Hoofdrekenen zonder rekenmachine: vul het ontbrekende getal in.',
    extra: false,
    select: 1,
    defaultCount: 20,
    defaultMinutes: 10,
    make: (level, r, used) => fresh(() => rekenToQuestion(generateRekenen(level, r), level), used),
  },
  {
    id: 'exclusie',
    name: 'Exclusie',
    description: 'Vijf figuren: vier volgen dezelfde regel, één niet. Welke hoort er niet bij?',
    extra: false,
    select: 1,
    defaultCount: 20,
    defaultMinutes: 10,
    make: (level, r, used) => fresh(() => exclusieToQuestion(generateExclusie(level, r), level), used),
  },
  {
    id: 'componenten',
    name: 'Componenten',
    description: 'Een figuur is in stukken geknipt. Met welke 2 van de 6 figuren kun je precies alle stukken samen maken?',
    extra: false,
    select: 2,
    defaultCount: 15,
    defaultMinutes: 10,
    make: (level, r, used) => fresh(() => compToQuestion(generateComponenten(level, r)), used),
  },
  {
    id: 'reeksen',
    name: 'Cijferreeksen',
    description: 'Ontdek de regel in een reeks getallen en kies het getal dat erna komt.',
    extra: true,
    select: 1,
    defaultCount: 20,
    defaultMinutes: 10,
    make: (level, r, used) => fresh(() => reeksToQuestion(generateReeks(level, r), level), used),
  },
  {
    id: 'woordrelaties',
    name: 'Woordrelaties',
    description: 'Kies uit vijf woorden de twee die ongeveer hetzelfde of juist het tegenovergestelde betekenen.',
    extra: true,
    select: 2,
    defaultCount: 20,
    defaultMinutes: 8,
    make: makeRelatie,
  },
  {
    id: 'spiegel',
    name: 'Spiegelbeelden',
    description: 'Bovenaan staat een figuur. Welke 2 van de 6 figuren zijn gespiegeld? De andere zijn alleen gedraaid.',
    extra: true,
    select: 2,
    defaultCount: 15,
    defaultMinutes: 8,
    make: (level, r, used) => fresh(() => spiegelToQuestion(generateSpiegel(level, r)), used),
  },
];

export const subtestById = (id: string): SubtestDef | undefined => SUBTESTS.find((s) => s.id === id);
