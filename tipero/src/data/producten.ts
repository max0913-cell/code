/**
 * ─────────────────────────────────────────────────────────────
 *  PRODUCTEN
 * ─────────────────────────────────────────────────────────────
 *  De drie soorten standen. Prijzen staan in bedrijf.ts.
 */
import type { StandSoort } from '../lib/types';
import type { IconName } from '../lib/icons';

export interface Product {
  id: StandSoort;
  /** Korte naam, bv. in menu's en kaarten. */
  naam: string;
  /** Naam voor Google (structured data) en koppen. */
  volledigeNaam: string;
  /** De tekst die op de stand staat. */
  standTekst: string;
  icoon: IconName;
  /** Waar de stand naartoe linkt. */
  linktNaar: string;
  /** Eén of twee zinnen voor kaarten. */
  kort: string;
  /** Alinea's voor de productenpagina. */
  uitleg: string[];
  kenmerken: string[];
  /** Ideaal voor... */
  idealeVoor: string;
}

export const producten: Product[] = [
  {
    id: 'review',
    naam: 'Reviewstand',
    volledigeNaam: 'Google reviewstand met NFC en QR-code',
    standTekst: 'Laat een review achter!',
    icoon: 'star',
    linktNaar: 'je Google-reviewpagina',
    kort: 'Klanten tikken en staan direct op je Google-reviewpagina. Zo vraag je iedere klant om een review, zonder dat je het steeds zelf hoeft te doen.',
    uitleg: [
      'Reviews zijn vaak het eerste wat mensen van je zaak zien, in Google of Google Maps. Hoe meer recente reviews, hoe completer het beeld voor nieuwe klanten.',
      'Met de reviewstand op je toonbank hoeft je klant niets te zoeken. Tikken of scannen, en het reviewvenster van jouw zaak staat open. Hoe minder stappen, hoe groter de kans dat iemand de review ook echt schrijft.',
    ],
    kenmerken: [
      'Opent direct het reviewvenster van jouw zaak',
      'Werkt met NFC én met de QR-code',
      'Voor iedere klant, zonder beloning: volgens de regels van Google',
      'Ik zoek je reviewlink op en test hem ter plekke',
    ],
    idealeVoor: 'Elke zaak met een toonbank of kassa',
  },
  {
    id: 'menu',
    naam: 'Menustand',
    volledigeNaam: 'Menustand met NFC en QR-code',
    standTekst: 'Bekijk ons menu!',
    icoon: 'book',
    linktNaar: 'je menu, prijslijst of assortiment',
    kort: 'Je menu, prijslijst of assortiment meteen op de telefoon van je klant. Handig bij een rij, op tafel of bij de wachtplek.',
    uitleg: [
      'Wie staat te wachten, kijkt graag alvast wat er op het menu staat. Met de menustand opent je menu met één tik, of met de camera via de QR-code.',
      'De stand kan wijzen naar een pdf, een pagina op je website of een online bestelpagina. Pas je je menu of prijzen online aan, dan ziet je klant meteen de nieuwe versie. De stand zelf blijft gewoon staan.',
    ],
    kenmerken: [
      'Link naar je menu, prijslijst, assortiment of bestelpagina',
      'Klanten kiezen alvast terwijl ze wachten',
      'Werkt met NFC én met de QR-code',
      'Nieuw menu op dezelfde link? Dan hoeft er niets te veranderen',
    ],
    idealeVoor: 'Zaken met een menu, prijslijst of assortiment',
  },
  {
    id: 'socials',
    naam: 'Socials-stand',
    volledigeNaam: 'Socials-stand met NFC en QR-code',
    standTekst: 'Volg ons op Instagram!',
    icoon: 'instagram',
    linktNaar: 'je Instagram, TikTok of Linktree',
    kort: 'Laat klanten je volgen op Instagram of TikTok, of stuur ze naar je Linktree met al je links op één plek.',
    uitleg: [
      'Volgers zijn klanten die je later opnieuw bereikt: met nieuwe producten, acties of een kijkje achter de schermen. Maar bijna niemand zoekt uit zichzelf je account op.',
      'Met de socials-stand staat je klant met één tik op je profiel. Heb je meerdere kanalen? Dan kan de stand naar je Linktree of een vergelijkbare linkpagina gaan.',
    ],
    kenmerken: [
      'Instagram, TikTok, Facebook of Linktree',
      'Direct naar je profiel, niet naar een zoekscherm',
      'Werkt met NFC én met de QR-code',
      'Goed te combineren met een reviewstand',
    ],
    idealeVoor: 'Zaken die hun werk of producten online laten zien',
  },
];

export const productById = (id: StandSoort): Product => {
  const product = producten.find((p) => p.id === id);
  if (!product) throw new Error(`Onbekend product: ${id}`);
  return product;
};

/** De twee uitvoeringen. */
export const uitvoeringen = {
  standaard: {
    naam: 'Standaard',
    titel: 'Tipero-ontwerp',
    omschrijving: 'Strak zwart met geel, met de tekst die bij de stand hoort en een QR-code.',
    kenmerken: ['Zwart/geel Tipero-ontwerp', 'Duidelijk tikpunt en QR-code', 'Snel klaar'],
  },
  huisstijl: {
    naam: 'Eigen huisstijl',
    titel: 'In jouw huisstijl',
    omschrijving: 'Met je eigen logo, kleuren en QR-code. De stand past dan precies bij je zaak.',
    kenmerken: ['Je eigen logo en kleuren', 'Eigen tekst op de stand', 'QR-code in jouw stijl'],
  },
} as const;
