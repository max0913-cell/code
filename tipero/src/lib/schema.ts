/**
 * Structured data (JSON-LD) voor Google.
 * Alles wordt opgebouwd uit de databestanden, zodat prijzen en
 * contactgegevens altijd overeenkomen met wat er op de pagina staat.
 */
import { bedrijf, prijzen } from '../data/bedrijf';
import { plaatsen, gebieden } from '../data/werkgebied';
import { producten } from '../data/producten';
import type { FaqItem } from '../data/faq';
import { absoluteUrl, formatPrijs, geldigEmail, isPlaceholder, prijsVoorSchema, telefoonVoorSchema } from './format';

type Node = Record<string, unknown>;

export const ids = {
  organisatie: absoluteUrl('/#organisatie'),
  website: absoluteUrl('/#website'),
  logo: absoluteUrl('/#logo'),
};

export interface Kruimel {
  naam: string;
  href: string;
}

const areaServed = () => [
  ...plaatsen.map((p) => ({ '@type': p.type, name: p.naam })),
  ...gebieden.map((g) => ({ '@type': g.type, name: g.naam })),
];

/** De onderneming: een service-area business, dus zonder adres. */
export function organisatie(): Node {
  const email = geldigEmail();
  const telefoon = telefoonVoorSchema();
  const sameAs = Object.values(bedrijf.socials).filter((u) => u.trim() !== '');

  const node: Node = {
    '@type': 'LocalBusiness',
    '@id': ids.organisatie,
    name: bedrijf.naam,
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      '@id': ids.logo,
      url: absoluteUrl('/logo-512.png'),
      contentUrl: absoluteUrl('/logo-512.png'),
      width: 512,
      height: 512,
      caption: bedrijf.naam,
    },
    image: { '@id': ids.logo },
    description: bedrijf.omschrijving,
    slogan: bedrijf.slogan,
    areaServed: areaServed(),
    priceRange: `${formatPrijs(prijzen.standaard)} - ${formatPrijs(prijzen.set)}`,
    currenciesAccepted: 'EUR',
    knowsAbout: ['NFC', 'QR-codes', 'Google-reviews', 'Lokale marketing'],
    knowsLanguage: 'nl',
  };

  if (email) node['email'] = email;
  if (telefoon) node['telephone'] = telefoon;
  if (email || telefoon) {
    node['contactPoint'] = {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['nl'],
      areaServed: 'NL',
      ...(email ? { email } : {}),
      ...(telefoon ? { telephone: telefoon } : {}),
    };
  }
  if (!isPlaceholder(bedrijf.eigenaar)) {
    node['founder'] = { '@type': 'Person', name: bedrijf.eigenaar };
  }
  if (bedrijf.contact.kvk.trim()) {
    node['identifier'] = { '@type': 'PropertyValue', propertyID: 'KvK-nummer', value: bedrijf.contact.kvk.trim() };
  }
  if (bedrijf.contact.btw.trim()) node['vatID'] = bedrijf.contact.btw.trim();
  if (sameAs.length) node['sameAs'] = sameAs;
  return node;
}

export function website(): Node {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: absoluteUrl('/'),
    name: bedrijf.naam,
    description: bedrijf.slogan,
    inLanguage: 'nl-NL',
    publisher: { '@id': ids.organisatie },
  };
}

export function webpagina(opties: {
  url: string;
  naam: string;
  omschrijving: string;
  afbeelding: string;
  heeftKruimelpad: boolean;
  type?: string;
}): Node {
  return {
    '@type': opties.type ?? 'WebPage',
    '@id': `${opties.url}#webpagina`,
    url: opties.url,
    name: opties.naam,
    description: opties.omschrijving,
    inLanguage: 'nl-NL',
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.organisatie },
    primaryImageOfPage: { '@type': 'ImageObject', url: opties.afbeelding },
    ...(opties.heeftKruimelpad ? { breadcrumb: { '@id': `${opties.url}#kruimelpad` } } : {}),
  };
}

export function kruimelpad(url: string, kruimels: Kruimel[]): Node {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#kruimelpad`,
    itemListElement: kruimels.map((k, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: k.naam,
      item: absoluteUrl(k.href),
    })),
  };
}

const aanbieding = (naam: string, bedrag: number, url: string): Node => ({
  '@type': 'Offer',
  name: naam,
  price: prijsVoorSchema(bedrag),
  priceCurrency: 'EUR',
  availability: 'https://schema.org/InStock',
  itemCondition: 'https://schema.org/NewCondition',
  url,
  seller: { '@id': ids.organisatie },
  areaServed: areaServed(),
});

/** Product + Offer voor alle standen en de set. */
export function productNodes(): Node[] {
  const prijsUrl = absoluteUrl('/prijzen');
  const merk = { '@type': 'Brand', name: bedrijf.naam };

  const losse = producten.map((p) => ({
    '@type': 'Product',
    '@id': absoluteUrl(`/producten#product-${p.id}`),
    name: p.volledigeNaam,
    description: p.kort,
    category: 'NFC-standaard',
    brand: merk,
    image: absoluteUrl(`/images/producten/${p.id}.png`),
    url: absoluteUrl(`/producten#${p.id}`),
    offers: [
      aanbieding(`${p.naam} in het Tipero-ontwerp`, prijzen.standaard, prijsUrl),
      aanbieding(`${p.naam} in je eigen huisstijl`, prijzen.huisstijl, prijsUrl),
    ],
  }));

  const set = {
    '@type': 'Product',
    '@id': absoluteUrl('/producten#product-set'),
    name: 'Set: reviewstand en menustand met NFC',
    description: 'Een reviewstand en een menustand samen, in het Tipero-ontwerp. Voor zaken waar klanten ook wachten of bestellen.',
    category: 'NFC-standaard',
    brand: merk,
    image: absoluteUrl('/images/producten/set.png'),
    url: absoluteUrl('/prijzen#set'),
    offers: aanbieding('Set reviewstand + menustand', prijzen.set, prijsUrl),
  };

  return [...losse, set];
}

export function faqPagina(url: string, vragen: FaqItem[]): Node {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    isPartOf: { '@id': `${url}#webpagina` },
    inLanguage: 'nl-NL',
    mainEntity: vragen.map((v) => ({
      '@type': 'Question',
      name: v.vraag,
      acceptedAnswer: { '@type': 'Answer', text: v.antwoord.join(' ') },
    })),
  };
}

/** Een dienst voor een specifieke branche (branchepagina's). */
export function dienst(opties: { url: string; naam: string; omschrijving: string; doelgroep: string }): Node {
  return {
    '@type': 'Service',
    '@id': `${opties.url}#dienst`,
    name: opties.naam,
    description: opties.omschrijving,
    serviceType: 'NFC-standaard voor Google-reviews, menu en socials',
    provider: { '@id': ids.organisatie },
    areaServed: areaServed(),
    audience: { '@type': 'BusinessAudience', audienceType: opties.doelgroep },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: prijsVoorSchema(prijzen.standaard),
      highPrice: prijsVoorSchema(prijzen.set),
      offerCount: 3,
      url: absoluteUrl('/prijzen'),
    },
  };
}
