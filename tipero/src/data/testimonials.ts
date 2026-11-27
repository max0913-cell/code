/**
 * ─────────────────────────────────────────────────────────────
 *  ERVARINGEN VAN KLANTEN
 * ─────────────────────────────────────────────────────────────
 *  Zet hier alleen échte ervaringen neer, met toestemming van de klant.
 *  Zolang deze lijst leeg is, toont de site placeholders
 *  (zie `toonPlaceholders` in bedrijf.ts).
 *
 *  Voorbeeld:
 *  {
 *    tekst: 'Wat de klant zei...',
 *    naam: 'Voornaam',
 *    zaak: 'Naam van de zaak',
 *    plaats: 'Lekkerkerk',
 *  },
 */
export interface Testimonial {
  tekst: string;
  naam: string;
  zaak: string;
  plaats: string;
}

export const testimonials: Testimonial[] = [];
