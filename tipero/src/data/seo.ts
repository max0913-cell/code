/**
 * ─────────────────────────────────────────────────────────────
 *  SEO-TEKSTEN PER PAGINA
 * ─────────────────────────────────────────────────────────────
 *  titel:        verschijnt als blauwe link in Google. Max. ±60 tekens.
 *  omschrijving: het grijze stukje tekst eronder. Max. ±155 tekens.
 *  ogAfbeelding: afbeelding bij delen op WhatsApp, Facebook, LinkedIn (1200×630, in public/og/).
 *
 *  Controleer de lengtes met `npm run check:seo`.
 */
import { prijzen } from './bedrijf';
import { formatPrijs } from '../lib/format';

export interface PaginaSeo {
  titel: string;
  omschrijving: string;
  ogAfbeelding?: string;
  /** true = niet laten indexeren door Google (en niet in de sitemap). */
  noindex?: boolean;
}

const vanaf = formatPrijs(prijzen.standaard);

export const seo = {
  '/': {
    titel: 'Google review standaard met NFC voor je zaak | Tipero',
    omschrijving:
      'Meer Google-reviews voor je zaak in de regio Rotterdam. Klanten tikken met hun telefoon op de NFC-standaard op je toonbank. Ik stel alles voor je in.',
    ogAfbeelding: '/og/tipero.png',
  },
  '/producten': {
    titel: 'NFC-standaards voor reviews, menu en socials | Tipero',
    omschrijving:
      'Reviewstand, QR-code menu standaard of socials-stand: kies wat bij je zaak past. In het Tipero-ontwerp of in je eigen huisstijl met logo en QR-code.',
    ogAfbeelding: '/og/producten.png',
  },
  '/hoe-het-werkt': {
    titel: 'Zo werkt een NFC review standaard | Tipero',
    omschrijving:
      'Ik kom langs, zoek de juiste link op, programmeer de NFC-chip en test alles ter plekke. Je klant tikt of scant en staat direct op de juiste pagina.',
    ogAfbeelding: '/og/hoe-het-werkt.png',
  },
  '/prijzen': {
    titel: `Prijzen NFC review standaard, vanaf ${vanaf} | Tipero`,
    omschrijving: `Een NFC-standaard voor je toonbank vanaf ${vanaf}. In je eigen huisstijl ${formatPrijs(prijzen.huisstijl)}, set review + menu ${formatPrijs(prijzen.set)}. Langskomen en instellen inbegrepen.`,
    ogAfbeelding: '/og/prijzen.png',
  },
  '/werkgebied': {
    titel: 'NFC review standaard in de regio Rotterdam | Tipero',
    omschrijving:
      'Tipero komt langs bij ondernemers in Rotterdam en omgeving. Ik zoek de juiste link op, programmeer je NFC-standaard en test hem ter plekke.',
    ogAfbeelding: '/og/werkgebied.png',
  },
  '/over': {
    titel: 'Over Tipero: student-ondernemer uit de regio Rotterdam',
    omschrijving:
      'Tipero is opgericht door een student-ondernemer uit de regio Rotterdam. Ik help lokale zaken aan meer Google-reviews: persoonlijk en zonder gedoe.',
    ogAfbeelding: '/og/tipero.png',
  },
  '/contact': {
    titel: 'Contact: vraag je NFC-standaard aan | Tipero',
    omschrijving:
      'Stuur een WhatsApp, mail of vul het formulier in. Ik kom langs in de regio Rotterdam en stel je NFC-standaard ter plekke voor je in.',
    ogAfbeelding: '/og/tipero.png',
  },
  '/veelgestelde-vragen': {
    titel: 'Veelgestelde vragen over NFC-standaards | Tipero',
    omschrijving:
      'Werkt het op iPhone en Android? Heb je een app nodig? Mag dit van Google? Antwoorden op de meest gestelde vragen over de NFC review standaard.',
    ogAfbeelding: '/og/veelgestelde-vragen.png',
  },
  '/privacy': {
    titel: 'Privacyverklaring | Tipero',
    omschrijving:
      'Hoe Tipero met je gegevens omgaat: geen trackingcookies en alleen wat nodig is om je vraag te beantwoorden. Lees hier de volledige privacyverklaring.',
  },
  '/bedankt': {
    titel: 'Bedankt voor je bericht | Tipero',
    omschrijving: 'Je bericht is verstuurd. Ik neem zo snel mogelijk contact met je op.',
    noindex: true,
  },
  '/404': {
    titel: 'Pagina niet gevonden | Tipero',
    omschrijving: 'Deze pagina bestaat niet (meer). Ga terug naar de homepage van Tipero.',
    noindex: true,
  },
} satisfies Record<string, PaginaSeo>;

export type SeoPad = keyof typeof seo;
