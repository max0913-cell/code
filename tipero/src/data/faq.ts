/**
 * ─────────────────────────────────────────────────────────────
 *  VEELGESTELDE VRAGEN
 * ─────────────────────────────────────────────────────────────
 *  Elke vraag heeft een `id` (voor links als /veelgestelde-vragen#google)
 *  en een antwoord als lijst met alinea's. Links mogen als
 *  { tekst, href } worden toegevoegd.
 *  De vragen met `opHome: true` staan ook op de homepage.
 */
import { bedrijf, prijzen } from './bedrijf';
import { formatPrijs } from '../lib/format';

export interface FaqItem {
  id: string;
  vraag: string;
  antwoord: string[];
  link?: { tekst: string; href: string };
  opHome?: boolean;
}

export interface FaqCategorie {
  titel: string;
  vragen: FaqItem[];
}

export const faq: FaqCategorie[] = [
  {
    titel: 'Telefoons en techniek',
    vragen: [
      {
        id: 'iphone-android',
        vraag: 'Werkt het met iPhone en Android?',
        antwoord: [
          'Ja. Vrijwel alle moderne iPhones en Android-telefoons kunnen NFC lezen. Vanaf de iPhone XS werkt het automatisch: je klant houdt de bovenkant van de telefoon bij de stand en krijgt een melding om de pagina te openen.',
          'Bij Android moet NFC aan staan. Bij de meeste toestellen is dat standaard zo. Het scherm moet wel ontgrendeld zijn.',
        ],
        opHome: true,
      },
      {
        id: 'app',
        vraag: 'Heb ik of mijn klant een app nodig?',
        antwoord: [
          'Nee. Jij niet en je klant ook niet. De stand werkt met de ingebouwde NFC-lezer en de camera van de telefoon. Er hoeft niets te worden geïnstalleerd.',
        ],
        opHome: true,
      },
      {
        id: 'geen-nfc',
        vraag: 'Wat als iemand geen NFC heeft?',
        antwoord: [
          'Op iedere stand staat ook een QR-code. Klanten met een oudere telefoon, of bij wie NFC uit staat, scannen die gewoon met hun camera. Ze komen dan op precies dezelfde pagina.',
        ],
        opHome: true,
      },
      {
        id: 'wat-is-nfc',
        vraag: 'Hoe werkt NFC eigenlijk?',
        antwoord: [
          'NFC is dezelfde techniek als contactloos betalen. In de stand zit een kleine chip zonder batterij. Houdt een klant de telefoon erbij, dan geeft de chip een link door en opent de telefoon die link in de browser.',
          'Er gaat niets de andere kant op: de stand leest niets van de telefoon uit.',
        ],
      },
      {
        id: 'waar-tikken',
        vraag: 'Waar moet je klant met de telefoon tikken?',
        antwoord: [
          'Op het tikpunt op de stand. Bij een iPhone zit de NFC-lezer aan de bovenkant, bij de camera. Bij de meeste Android-telefoons zit hij ongeveer in het midden van de achterkant.',
        ],
      },
    ],
  },
  {
    titel: 'Reviews en de regels van Google',
    vragen: [
      {
        id: 'google',
        vraag: 'Mag dit van Google?',
        antwoord: [
          'Ja. Google staat toe dat je klanten vraagt om een review. Wat níet mag: iets geven in ruil voor een review (zoals korting of een gratis kopje koffie), alleen tevreden klanten om een review vragen, of reviews laten schrijven door mensen die geen klant zijn.',
          'Een Tipero-stand vraagt iedere klant hetzelfde, zonder beloning. Daarmee past hij binnen de regels. Daarom zet ik ook geen teksten op de stand als "Tevreden? Laat een review achter!", maar gewoon "Laat een review achter!".',
        ],
        opHome: true,
      },
      {
        id: 'alle-klanten',
        vraag: 'Is de stand ook voor klanten die minder tevreden zijn?',
        antwoord: [
          'Ja, de stand is voor álle klanten. Dat is eerlijk en het hoort zo volgens de regels van Google. Een profiel met alleen maar perfecte reviews komt bovendien minder echt over dan een profiel met een eerlijke mix.',
          'Krijg je een kritische review? Reageer rustig en vriendelijk. Nieuwe klanten zien dan dat je serieus met feedback omgaat.',
        ],
      },
      {
        id: 'hoeveel-reviews',
        vraag: 'Hoeveel extra reviews levert een stand op?',
        antwoord: [
          'Dat kan ik niet beloven, en eerlijk gezegd kan niemand dat. Het hangt af van hoeveel klanten je hebt, waar de stand staat en of je er af en toe even naar wijst.',
          'Wat de stand wél doet: het voor iedere klant zo makkelijk mogelijk maken om een review achter te laten, op het moment dat ze toch al bij je toonbank staan.',
        ],
      },
      {
        id: 'beloning',
        vraag: 'Mag ik klanten een kleine beloning geven voor een review?',
        antwoord: [
          'Nee, dat mag niet volgens de regels van Google. Reviews in ruil voor korting, een cadeautje of een winactie kunnen door Google worden verwijderd. Vriendelijk vragen mag wél, en dat is precies wat de stand doet.',
        ],
      },
    ],
  },
  {
    titel: 'De stand zelf',
    vragen: [
      {
        id: 'link-aanpassen',
        vraag: 'Kan de link later aangepast worden?',
        antwoord: [
          'Ja. Krijg je een nieuw menu, een andere website, of wil je de stand voor iets anders gebruiken? Stuur me een berichtje. De NFC-chip kan ik opnieuw programmeren, en ik kijk meteen of de QR-code nog naar de goede plek wijst.',
          'Verandert alleen de inhoud van je menu, maar blijft de link hetzelfde? Dan hoeft er aan de stand niets te gebeuren.',
        ],
        opHome: true,
      },
      {
        id: 'levensduur',
        vraag: 'Hoe lang gaat de stand mee?',
        antwoord: [
          'De NFC-chip heeft geen batterij en hoeft nooit te worden opgeladen. Uitlezen slijt de chip niet, dus bij normaal gebruik gaat hij jaren mee.',
          '[Vul aan: van welk materiaal de stand is en hoe je hem schoonhoudt.]',
        ],
      },
      {
        id: 'huisstijl',
        vraag: 'Kan de stand in mijn eigen huisstijl?',
        antwoord: [
          `Ja. Voor ${formatPrijs(prijzen.huisstijl)} maak ik de stand met je eigen logo, kleuren en QR-code. Stuur je logo mee, het liefst als pdf, svg of png met een transparante achtergrond.`,
        ],
        link: { tekst: 'Bekijk de prijzen', href: '/prijzen' },
      },
      {
        id: 'zelf-instellen',
        vraag: 'Moet ik zelf iets instellen?',
        antwoord: [
          'Nee. Ik zoek de juiste link op, programmeer de chip, maak de QR-code en test alles ter plekke. Jij hoeft alleen te zeggen waar de stand moet komen te staan.',
        ],
      },
    ],
  },
  {
    titel: 'Bestellen en levering',
    vragen: [
      {
        id: 'levertijd',
        vraag: 'Hoe snel wordt de stand geleverd?',
        antwoord: [
          `Na je aanvraag spreken we een moment af waarop ik langskom. Een stand in het standaard-ontwerp lever ik ${bedrijf.levertijd}. Een stand in je eigen huisstijl duurt iets langer, omdat ik die eerst voor je ontwerp.`,
        ],
        opHome: true,
      },
      {
        id: 'kosten',
        vraag: 'Wat kost een stand?',
        antwoord: [
          `Een stand in het Tipero-ontwerp kost ${formatPrijs(prijzen.standaard)}, in je eigen huisstijl ${formatPrijs(prijzen.huisstijl)}. De set met een reviewstand en een menustand kost ${formatPrijs(prijzen.set)}.${prijzen.eenmalig ? ' Dat zijn eenmalige prijzen, zonder abonnement.' : ''} Langskomen, instellen en testen zitten erbij in.`,
        ],
        link: { tekst: 'Alle prijzen', href: '/prijzen' },
      },
      {
        id: 'werkgebied',
        vraag: 'In welke plaatsen kom je langs?',
        antwoord: [
          'In Lekkerkerk en omgeving: de Krimpenerwaard (zoals Krimpen aan de Lek, Ouderkerk aan den IJssel en Schoonhoven), Krimpen aan den IJssel en Rotterdam-Oost. Zit je net buiten dit gebied? Vraag het gerust.',
        ],
        link: { tekst: 'Bekijk het werkgebied', href: '/werkgebied' },
      },
    ],
  },
];

/** Alle vragen in één lijst. */
export const alleVragen: FaqItem[] = faq.flatMap((c) => c.vragen);

/** De vragen voor op de homepage. */
export const homeVragen: FaqItem[] = alleVragen.filter((v) => v.opHome);
