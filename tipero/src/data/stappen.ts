/**
 * ─────────────────────────────────────────────────────────────
 *  HOE HET WERKT
 * ─────────────────────────────────────────────────────────────
 *  `kort`: de drie stappen op de homepage.
 *  `uitgebreid`: het hele traject op de pagina /hoe-het-werkt.
 */
import type { IconName } from '../lib/icons';

export interface Stap {
  titel: string;
  tekst: string;
  icoon: IconName;
}

export const stappenKort: Stap[] = [
  {
    titel: 'Ik kom langs',
    tekst: 'We kiezen samen wat de stand moet doen: reviews, je menu of je socials. Ik zoek de juiste link voor je op.',
    icoon: 'pin',
  },
  {
    titel: 'Ik stel alles in',
    tekst: 'Ik programmeer de NFC-chip, maak de QR-code en test de stand ter plekke met een iPhone én een Android.',
    icoon: 'sliders',
  },
  {
    titel: 'Je klanten tikken',
    tekst: 'De stand staat op je toonbank. Klanten tikken of scannen en staan direct op de juiste pagina. Jij hoeft niets te doen.',
    icoon: 'phone',
  },
];

export const stappenUitgebreid: Stap[] = [
  {
    titel: 'Je neemt contact op',
    tekst: 'Via WhatsApp, mail of het formulier. Vertel kort wat voor zaak je hebt en wat je zoekt. Weet je het nog niet precies? Geen probleem, daar kom ik voor langs.',
    icoon: 'whatsapp',
  },
  {
    titel: 'We spreken een moment af',
    tekst: 'Ik kom naar je zaak, op een moment dat het jou uitkomt. Even rustig, of tussen twee klanten door.',
    icoon: 'calendar',
  },
  {
    titel: 'Ik zoek de juiste link op',
    tekst: 'Voor een reviewstand is dat de link die direct het reviewvenster van jouw zaak opent. Voor een menu- of socials-stand de pagina die jij wilt laten zien.',
    icoon: 'link',
  },
  {
    titel: 'Ik programmeer en test de stand',
    tekst: 'Ik zet de link op de NFC-chip en controleer de QR-code. Daarna testen we samen met een iPhone én een Android-telefoon of alles goed opent.',
    icoon: 'sliders',
  },
  {
    titel: 'De stand staat op je toonbank',
    tekst: 'We zoeken samen de beste plek, meestal bij de kassa. Vanaf nu tikken je klanten zelf. Jij hoeft er niets meer voor te doen.',
    icoon: 'store',
  },
  {
    titel: 'Iets veranderen? Even appen',
    tekst: 'Nieuwe link, nieuw menu of een vraag? Stuur een berichtje en ik help je verder.',
    icoon: 'heart',
  },
];

/** Wat de klant van de zaak beleeft. */
export const klantStappen: Stap[] = [
  {
    titel: 'Tikken of scannen',
    tekst: 'Je klant houdt de telefoon bij het tikpunt, of scant de QR-code met de camera.',
    icoon: 'phone',
  },
  {
    titel: 'Melding verschijnt',
    tekst: 'Op het scherm verschijnt meteen een melding of link. Eén keer tikken om te openen.',
    icoon: 'bolt',
  },
  {
    titel: 'Op de juiste pagina',
    tekst: 'Het reviewvenster, je menu of je profiel staat open. Geen app, geen zoekwerk.',
    icoon: 'check',
  },
];
