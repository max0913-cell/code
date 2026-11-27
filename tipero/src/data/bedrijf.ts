/**
 * ─────────────────────────────────────────────────────────────
 *  BEDRIJFSGEGEVENS EN PRIJZEN: alles op één plek
 * ─────────────────────────────────────────────────────────────
 *  Pas hier je gegevens aan. De hele site (teksten, knoppen,
 *  structured data voor Google) gebruikt deze waarden automatisch.
 *
 *  Placeholders staan tussen [vierkante haken]. Zolang een
 *  placeholder er nog staat, wordt die gegevenswaarde niet in
 *  de WhatsApp-/mailknoppen of in de structured data gebruikt.
 *  Met `npm run placeholders` zie je welke er nog over zijn.
 */

export const bedrijf = {
  naam: 'Tipero',

  /** Je domein, zonder / aan het eind. Wordt gebruikt voor canonical-URL's, sitemap en Open Graph. */
  url: 'https://www.tipero.nl',

  /** Korte slogan (o.a. voor de structured data). */
  slogan: 'Eén tik op de toonbank, een nieuwe review.',

  /** Algemene omschrijving (o.a. voor de structured data). */
  omschrijving:
    'Tipero levert NFC-standaards met QR-code voor op de toonbank van lokale ondernemers in de regio Rotterdam. Klanten tikken met hun telefoon en komen direct op je Google-reviewpagina, je menu of je socials. Tipero komt langs, stelt alles in en test de stand ter plekke.',

  /** Je eigen naam, zoals die op de Over-pagina en in de privacyverklaring komt. */
  eigenaar: '[jouw naam]',

  contact: {
    /** Bijvoorbeeld 'hallo@tipero.nl' */
    email: '[jouw e-mail]',
    /** Je 06-nummer, bijvoorbeeld '06 12345678'. Wordt automatisch omgezet naar een wa.me-link. */
    whatsapp: '[06-nummer]',
    /** Tekst die alvast in WhatsApp klaarstaat als iemand op de knop drukt. */
    whatsappBericht: 'Hoi Tipero! Ik heb interesse in een NFC-standaard voor mijn zaak.',
    /** Laat leeg ('') zolang je nog geen KvK-nummer hebt: dan wordt het nergens getoond. */
    kvk: '',
    /** Laat leeg als je (nog) geen btw-nummer op de site wilt tonen. */
    btw: '',
    /** Hoe snel je meestal reageert. Wordt bij de contactopties getoond. */
    reactietijd: 'Meestal reageer ik dezelfde dag.',
  },

  /** Socials van Tipero zelf. Laat leeg ('') als je ze niet hebt. */
  socials: {
    instagram: '',
    tiktok: '',
    linkedin: '',
  },

  /**
   * Contactformulier.
   * - 'netlify'   → werkt automatisch als de site op Netlify staat (Netlify Forms).
   * - 'formspree' → vul hieronder je Formspree-formulier-ID in (bv. 'xayzabcd').
   */
  formulier: {
    aanbieder: 'netlify' as 'netlify' | 'formspree',
    formspreeId: '',
  },

  /** Levertijd, zoals die in de FAQ en op de prijzenpagina staat. */
  levertijd: '[binnen X werkdagen]',

  /**
   * Toon placeholder-blokken (zoals "[testimonial volgt]" en "[foto volgt]") op de site?
   * Zet op `false` als je live wilt gaan voordat je ze hebt ingevuld: de blokken
   * worden dan verborgen. Losse placeholders in lopende tekst blijven wel staan.
   */
  toonPlaceholders: true,
} as const;

/**
 * ─────────────────────────────────────────────────────────────
 *  PRIJZEN
 * ─────────────────────────────────────────────────────────────
 *  Bedragen in euro's, met een punt als decimaalteken (29.95).
 *  Op de site worden ze automatisch als "€ 29,95" getoond.
 */
export const prijzen = {
  /** Eén stand in het standaard Tipero-ontwerp (zwart/geel). */
  standaard: 29.95,
  /** Eén stand in je eigen huisstijl, met je logo en QR-code. */
  huisstijl: 39.95,
  /** Set: reviewstand + menustand, in het standaard-ontwerp. */
  set: 49.95,

  /** Zijn de prijzen eenmalig (geen abonnement)? */
  eenmalig: true,
  /** Btw-vermelding onder de prijzen, bv. 'Prijzen zijn inclusief btw.' */
  btwTekst: '[Prijzen zijn incl./excl. btw.]',
  /** Wat er bij de prijs inzit. Wordt op de prijzenpagina en bij de prijskaarten getoond. */
  inbegrepen: [
    'Langskomen in de regio Rotterdam',
    'De juiste link voor je opzoeken',
    'NFC-chip programmeren en QR-code maken',
    'Ter plekke testen met iPhone en Android',
  ],
} as const;
