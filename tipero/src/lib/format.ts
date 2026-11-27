import { bedrijf } from '../data/bedrijf';

/** Herkent placeholders zoals "[jouw e-mail]". */
export const isPlaceholder = (value: string): boolean => /\[[^\]]+\]/.test(value);

const euro = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

/** 29.95 → "€ 29,95" (met een vaste spatie, zodat bedrag en teken bij elkaar blijven). */
export const formatPrijs = (bedrag: number): string => euro.format(bedrag);

/** 29.95 → "29.95" (voor structured data). */
export const prijsVoorSchema = (bedrag: number): string => bedrag.toFixed(2);

/** "06 12 34 56 78" → "31612345678", of null als het geen geldig 06-nummer is. */
export function internationaalNummer(nummer: string): string | null {
  if (isPlaceholder(nummer)) return null;
  const cijfers = nummer.replace(/[^\d+]/g, '');
  let nl: string;
  if (cijfers.startsWith('+31')) nl = cijfers.slice(3);
  else if (cijfers.startsWith('0031')) nl = cijfers.slice(4);
  else if (cijfers.startsWith('0')) nl = cijfers.slice(1);
  else return null;
  return /^6\d{8}$/.test(nl) ? `31${nl}` : null;
}

/** wa.me-link met vooraf ingevuld bericht, of null zolang het nummer nog een placeholder is. */
export function whatsappUrl(bericht: string = bedrijf.contact.whatsappBericht): string | null {
  const nummer = internationaalNummer(bedrijf.contact.whatsapp);
  if (!nummer) return null;
  return `https://wa.me/${nummer}?text=${encodeURIComponent(bericht)}`;
}

/** Telefoonnummer in internationaal formaat voor structured data (+31612345678). */
export function telefoonVoorSchema(): string | null {
  const nummer = internationaalNummer(bedrijf.contact.whatsapp);
  return nummer ? `+${nummer}` : null;
}

/** Geldig e-mailadres, of null zolang het nog een placeholder is. */
export function geldigEmail(): string | null {
  const email = bedrijf.contact.email.trim();
  return !isPlaceholder(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

/** Absolute URL op basis van het domein uit bedrijf.ts. */
export const absoluteUrl = (pad: string): string => new URL(pad, `${bedrijf.url}/`).href;

/**
 * Nette, canonieke URL voor een pagina.
 * Astro geeft bij build.format 'file' paden als "/prijzen.html" en "/index.html";
 * die maken we "/prijzen" en "/".
 */
export function canoniekPad(pathname: string): string {
  let pad = pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
  if (pad.length > 1) pad = pad.replace(/\/$/, '');
  return pad || '/';
}
