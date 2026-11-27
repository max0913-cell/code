/**
 * ─────────────────────────────────────────────────────────────
 *  WERKGEBIED
 * ─────────────────────────────────────────────────────────────
 *  Deze plaatsen staan op /werkgebied, op het schematische kaartje
 *  en in de structured data (areaServed) voor Google.
 *  lat/lon zijn alleen voor de positie op het kaartje.
 */

export interface Plaats {
  naam: string;
  /** Zoals in de structured data: een stad/dorp of een groter gebied. */
  type: 'City' | 'AdministrativeArea';
  regio: 'Krimpenerwaard' | 'Krimpen aan den IJssel' | 'Rotterdam';
  lat: number;
  lon: number;
  /** Korte regel op de werkgebied-pagina. */
  tekst: string;
  /** Uitgelicht = met naam op het kaartje en bovenaan de lijst. */
  uitgelicht?: boolean;
}

export const plaatsen: Plaats[] = [
  {
    naam: 'Lekkerkerk',
    type: 'City',
    regio: 'Krimpenerwaard',
    lat: 51.899,
    lon: 4.683,
    tekst: 'Mijn thuisbasis. Hier ben ik het snelst bij je.',
    uitgelicht: true,
  },
  {
    naam: 'Krimpen aan de Lek',
    type: 'City',
    regio: 'Krimpenerwaard',
    lat: 51.893,
    lon: 4.629,
    tekst: 'Buurdorp van Lekkerkerk, dus zo langs.',
  },
  {
    naam: 'Krimpen aan den IJssel',
    type: 'City',
    regio: 'Krimpen aan den IJssel',
    lat: 51.917,
    lon: 4.596,
    tekst: 'Waar de Hollandse IJssel in de Nieuwe Maas uitkomt.',
    uitgelicht: true,
  },
  {
    naam: 'Ouderkerk aan den IJssel',
    type: 'City',
    regio: 'Krimpenerwaard',
    lat: 51.934,
    lon: 4.636,
    tekst: 'Aan de Hollandse IJssel, vlak bij Krimpen.',
    uitgelicht: true,
  },
  {
    naam: 'Gouderak',
    type: 'City',
    regio: 'Krimpenerwaard',
    lat: 51.984,
    lon: 4.679,
    tekst: 'Ook langs de Hollandse IJssel, richting Gouda.',
  },
  {
    naam: 'Berkenwoude',
    type: 'City',
    regio: 'Krimpenerwaard',
    lat: 51.944,
    lon: 4.708,
    tekst: 'Midden in de polder van de Krimpenerwaard.',
  },
  {
    naam: 'Bergambacht',
    type: 'City',
    regio: 'Krimpenerwaard',
    lat: 51.933,
    lon: 4.786,
    tekst: 'In het hart van de Krimpenerwaard.',
  },
  {
    naam: 'Stolwijk',
    type: 'City',
    regio: 'Krimpenerwaard',
    lat: 51.972,
    lon: 4.772,
    tekst: 'Het noorden van de Krimpenerwaard.',
  },
  {
    naam: 'Haastrecht',
    type: 'City',
    regio: 'Krimpenerwaard',
    lat: 52.002,
    lon: 4.778,
    tekst: 'Aan de rand van de Krimpenerwaard.',
  },
  {
    naam: 'Ammerstol',
    type: 'City',
    regio: 'Krimpenerwaard',
    lat: 51.927,
    lon: 4.808,
    tekst: 'Aan de Lek, tussen Bergambacht en Schoonhoven.',
  },
  {
    naam: 'Schoonhoven',
    type: 'City',
    regio: 'Krimpenerwaard',
    lat: 51.947,
    lon: 4.849,
    tekst: 'De Zilverstad aan de Lek.',
    uitgelicht: true,
  },
  {
    naam: 'Rotterdam-Oost',
    type: 'AdministrativeArea',
    regio: 'Rotterdam',
    lat: 51.935,
    lon: 4.535,
    tekst: 'Onder andere Kralingen en Prins Alexander.',
    uitgelicht: true,
  },
];

/** Het grotere gebied (ook voor de structured data). */
export const gebieden = [{ naam: 'Krimpenerwaard', type: 'AdministrativeArea' as const }];

/** Rivieren op het schematische kaartje (globale ligging, niet op schaal). */
export const rivieren = [
  {
    naam: 'Lek',
    punten: [
      [51.962, 4.9],
      [51.945, 4.852],
      [51.926, 4.812],
      [51.918, 4.77],
      [51.903, 4.72],
      [51.893, 4.683],
      [51.887, 4.64],
      [51.885, 4.625],
    ],
  },
  {
    naam: 'Nieuwe Maas',
    punten: [
      [51.885, 4.625],
      [51.9, 4.605],
      [51.912, 4.585],
      [51.912, 4.55],
      [51.906, 4.515],
      [51.905, 4.49],
    ],
  },
  {
    naam: 'Hollandse IJssel',
    punten: [
      [52.012, 4.705],
      [51.995, 4.69],
      [51.982, 4.673],
      [51.955, 4.652],
      [51.934, 4.627],
      [51.922, 4.606],
      [51.912, 4.585],
    ],
  },
] as const;
