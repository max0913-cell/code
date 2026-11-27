/**
 * ─────────────────────────────────────────────────────────────
 *  OVER TIPERO
 * ─────────────────────────────────────────────────────────────
 *  Je eigen verhaal. Vervang de teksten tussen [vierkante haken].
 *  Een foto zet je in src/assets/over/ (zie LEESMIJ.md daar).
 */
import type { IconName } from '../lib/icons';

export const over = {
  intro:
    'Student-ondernemer uit de regio Rotterdam en oprichter van Tipero. Ik help lokale zaken aan meer Google-reviews, met een stand op de toonbank die ik persoonlijk voor je regel.',

  /** Alt-tekst van je foto. */
  fotoAlt: '[Jouw naam] van Tipero',

  verhaalTitel: 'Waarom ik Tipero ben begonnen',
  verhaal: [
    '[Vertel hier wie je bent: hoe oud je bent, wat je studeert en waar je woont.]',
    '[Vertel hoe je op het idee kwam. Wat zag je bij ondernemers in de buurt? Waarom vind je reviews belangrijk?]',
    '[Vertel wat je ondernemers wilt bieden en waarom je het persoonlijk aanpakt.]',
  ],

  waardenTitel: 'Waar Tipero voor staat',
  waarden: [
    {
      icoon: 'pin',
      titel: 'Lokaal',
      tekst: 'Ik help ondernemers in de regio Rotterdam. Je weet precies bij wie je terechtkunt.',
    },
    {
      icoon: 'user',
      titel: 'Persoonlijk',
      tekst: 'Geen ticketsysteem of callcenter. Je hebt contact met mij, van je eerste vraag tot de laatste test.',
    },
    {
      icoon: 'bolt',
      titel: 'Snel',
      tekst: 'Korte lijnen: een appje is genoeg. Ik kom langs en regel het.',
    },
    {
      icoon: 'shield',
      titel: 'Eerlijk',
      tekst: 'Geen beloftes over aantallen reviews en geen trucjes. De stand werkt volgens de regels van Google.',
    },
  ] satisfies { icoon: IconName; titel: string; tekst: string }[],
};
