/**
 * ─────────────────────────────────────────────────────────────
 *  WERKGEBIED
 * ─────────────────────────────────────────────────────────────
 *  Hoe het werkgebied op de site en in de structured data
 *  (areaServed) voor Google heet.
 */
export const werkgebied = {
  /** In lopende tekst: "in de regio Rotterdam". */
  naam: 'regio Rotterdam',
  /** Aan het begin van een zin of als kop. */
  Naam: 'Regio Rotterdam',
  /** Korte omschrijving, bv. in de footer. */
  kort: 'Rotterdam en omgeving',

  /** Voor Google (structured data). */
  areaServed: [
    { type: 'City', naam: 'Rotterdam' },
    { type: 'AdministrativeArea', naam: 'Regio Rotterdam' },
  ],
} as const;
