/**
 * ─────────────────────────────────────────────────────────────
 *  BRANCHEPAGINA'S: /kapper, /bakker, /snackbar
 * ─────────────────────────────────────────────────────────────
 *  Elke branche heeft eigen teksten. De SEO-titel en -omschrijving
 *  staan in seo.ts.
 */
import type { IconName } from '../lib/icons';
import type { StandSoort } from '../lib/types';

export interface Branche {
  slug: 'kapper' | 'bakker' | 'snackbar';
  /** Voor menu's en kaarten. */
  naam: string;
  /** Meervoud, voor in lopende tekst. */
  meervoud: string;
  /** Het soort zaak, voor in lopende tekst ("in je kapsalon"). */
  zaak: string;
  icoon: IconName;
  /** Kort zinnetje voor kaarten op de homepage. */
  teaser: string;
  hero: {
    eyebrow: string;
    titel: string;
    /** Deel van de titel dat het gele accent krijgt. */
    accent: string;
    intro: string;
  };
  /** Voorbeeldstanden in de hero. */
  standen: { soort: StandSoort; regels: string[]; accentRegel: number; subtekst: string }[];
  waarom: { titel: string; alineas: string[] };
  toepassingen: { product: StandSoort; titel: string; tekst: string }[];
  plekken: { titel: string; tekst: string }[];
  voorbeeldteksten: string[];
  vragen: { vraag: string; antwoord: string }[];
  lokaal: { titel: string; tekst: string };
  testimonialPlaceholder: string;
}

export const branches: Branche[] = [
  {
    slug: 'kapper',
    naam: 'Kappers',
    meervoud: 'kappers',
    zaak: 'kapsalon',
    icoon: 'scissors',
    teaser: 'Reviews bij het afrekenen, je prijslijst bij de wachtstoel en je Instagram als portfolio.',
    hero: {
      eyebrow: 'Voor kapsalons en barbershops',
      titel: 'Meer Google-reviews voor je kapsalon',
      accent: 'Google-reviews',
      intro:
        'Je klant staat bij de kassa met een frisse coupe en de telefoon al in de hand. Met een NFC-standaard naast de pin-automaat tikt je klant één keer en staat direct op je reviewpagina.',
    },
    standen: [
      { soort: 'review', regels: ['Hoe was je', 'knipbeurt?'], accentRegel: 1, subtekst: 'Laat een review achter' },
      { soort: 'socials', regels: ['Bekijk ons', 'werk!'], accentRegel: 1, subtekst: 'Volg ons op Instagram' },
    ],
    waarom: {
      titel: 'Waarom reviews zo belangrijk zijn voor kappers',
      alineas: [
        'Een nieuwe kapper kies je niet zomaar. Mensen willen weten of er naar ze geluisterd wordt, of ze goed geholpen worden en of de knipbeurt de prijs waard is. Dus kijken ze naar reviews en naar foto’s van eerder werk.',
        'Je vaste klanten weten allang hoe goed je bent, maar dat staat nog niet online. Met een stand bij de kassa maak je het voor iedere klant makkelijk om hun ervaring te delen, zonder dat jij er elke keer naar hoeft te vragen.',
      ],
    },
    toepassingen: [
      {
        product: 'review',
        titel: 'Reviews bij het afrekenen',
        tekst: 'Zet de reviewstand naast de pin-automaat. Wie met de telefoon betaalt, heeft die toch al in de hand. Eén tik en het reviewvenster staat open.',
      },
      {
        product: 'menu',
        titel: 'Je prijslijst bij de hand',
        tekst: 'Gebruik de menustand voor je prijslijst of behandelingen. Handig voor wie in de wachtstoel twijfelt tussen knippen, of knippen én kleuren.',
      },
      {
        product: 'socials',
        titel: 'Je Instagram als portfolio',
        tekst: 'Als kapper is je Instagram of TikTok je etalage. Met de socials-stand volgen klanten je met één tik en zien ze je nieuwste fades, kleuringen en kapsels voorbijkomen.',
      },
    ],
    plekken: [
      { titel: 'Naast de pin-automaat', tekst: 'Iedere klant komt hier langs, op het moment dat de knipbeurt klaar is.' },
      { titel: 'Bij de wachtstoelen', tekst: 'Wie wacht, pakt de telefoon. Een stand met je prijslijst of Instagram valt hier vanzelf op.' },
      { titel: 'Bij de spiegel', tekst: 'Een stand op de werkplek, voor klanten die tijdens het föhnen al even willen kijken.' },
    ],
    voorbeeldteksten: [
      'Hoe was je knipbeurt? Laat een review achter!',
      'Bekijk onze prijslijst',
      'Meer van ons werk? Volg ons op Instagram',
      'Plan je volgende afspraak',
    ],
    vragen: [
      {
        vraag: 'Kan de stand naar mijn online agenda linken?',
        antwoord:
          'Ja. Een stand kan naar elke link wijzen, dus ook naar de pagina waar klanten online een afspraak maken. Zo plannen ze hun volgende knipbeurt meteen in.',
      },
      {
        vraag: 'Hoeveel standen heb ik nodig?',
        antwoord:
          'Begin met één reviewstand bij de kassa: daar komt iedere klant langs. Wil je ook je prijslijst of Instagram laten zien? Dan is een tweede stand bij de wachtstoelen handig.',
      },
      {
        vraag: 'Werkt het ook in een barbershop met veel jonge klanten?',
        antwoord:
          'Ja. Wie gewend is om met de telefoon te betalen en codes te scannen, vindt tikken op een stand heel normaal. Een socials-stand voor je Instagram of TikTok past daar goed bij.',
      },
    ],
    lokaal: {
      titel: 'Voor kappers in Lekkerkerk en omgeving',
      tekst:
        'Of je nu een kapsalon in Lekkerkerk hebt, een barbershop in Krimpen aan den IJssel of een salon in Schoonhoven: ik kom langs, stel de stand in en test hem samen met je. Ook in de rest van de Krimpenerwaard en in Rotterdam-Oost.',
    },
    testimonialPlaceholder: '[testimonial van een kapper volgt]',
  },
  {
    slug: 'bakker',
    naam: 'Bakkers',
    meervoud: 'bakkers',
    zaak: 'bakkerij',
    icoon: 'bread',
    teaser: 'Reviews terwijl de rij wacht, je assortiment of taartenlijst op de telefoon en socials voor wat er vers uit de oven komt.',
    hero: {
      eyebrow: 'Voor bakkerijen en banketbakkers',
      titel: 'Meer Google-reviews voor je bakkerij',
      accent: 'Google-reviews',
      intro:
        'Bij de bakker staat vaak een rij, en iedereen wacht met de telefoon in de hand. Met een NFC-standaard op de toonbank laat je klant met één tik een review achter of bekijkt alvast je assortiment.',
    },
    standen: [
      { soort: 'review', regels: ['Hoe smaakt', 'het?'], accentRegel: 1, subtekst: 'Laat een review achter' },
      { soort: 'menu', regels: ['Taart', 'bestellen?'], accentRegel: 1, subtekst: 'Bekijk ons assortiment' },
    ],
    waarom: {
      titel: 'Waarom reviews belangrijk zijn voor je bakkerij',
      alineas: [
        'Nieuwe bewoners, fietsers die door de Krimpenerwaard trekken, iemand die een verjaardagstaart zoekt: ze zoeken op “bakker in de buurt” en zien meteen de sterren en reviews van elke bakkerij.',
        'Je vaste klanten komen elke week. Als zij hun ervaring delen, zien nieuwe klanten meteen waarom. De stand maakt dat zo makkelijk dat het in een paar tellen in de rij kan.',
      ],
    },
    toepassingen: [
      {
        product: 'review',
        titel: 'Reviews terwijl de rij wacht',
        tekst: 'Zet de reviewstand op de toonbank of bij de kassa. Wie in de rij staat, heeft even tijd. Eén tik is genoeg, de review kan later worden afgemaakt.',
      },
      {
        product: 'menu',
        titel: 'Je assortiment en taartenlijst',
        tekst: 'Laat klanten je assortiment, je taarten of je bestelformulier zien. Handig voor wie een taart wil bestellen, en extra fijn in drukke weken rond de feestdagen.',
      },
      {
        product: 'socials',
        titel: 'Laat zien wat er vers uit de oven komt',
        tekst: 'Een nieuw brood, seizoensgebak of oliebollen rond oud en nieuw? Wie je volgt op Instagram of Facebook ziet het meteen. Met de socials-stand volgen klanten je met één tik.',
      },
    ],
    plekken: [
      { titel: 'Naast de kassa', tekst: 'Iedere klant komt hier langs, ook als het druk is.' },
      { titel: 'Bij de vitrine', tekst: 'Wie twijfelt tussen twee gebakjes, kijkt graag even naar je assortiment.' },
      { titel: 'Bij de bestelbalie', tekst: 'Een menustand met je taartenaanbod of je bestelpagina, voor wie vooruit wil bestellen.' },
    ],
    voorbeeldteksten: [
      'Hoe smaakt het? Laat een review achter!',
      'Bekijk ons assortiment',
      'Taart bestellen? Tik hier',
      'Volg ons voor nieuwe lekkernijen',
    ],
    vragen: [
      {
        vraag: 'Werkt het als er een rij staat?',
        antwoord:
          'Ja, juist dan. Tikken duurt een seconde. Je klant hoeft niet aan de kant te gaan staan en kan de review ook later afmaken, want de pagina blijft gewoon open op de telefoon.',
      },
      {
        vraag: 'Kan de stand naar mijn allergeneninformatie linken?',
        antwoord:
          'Ja, als die online staat. Een stand kan naar elke webpagina of pdf wijzen, dus ook naar een overzicht van allergenen. Zorg wel dat die informatie actueel blijft.',
      },
      {
        vraag: 'Kan ik de stand per seizoen aanpassen?',
        antwoord:
          'De link op de stand kan worden aangepast, bijvoorbeeld naar je kerst- of paasassortiment. Stuur me een berichtje en ik regel het.',
      },
    ],
    lokaal: {
      titel: 'Voor bakkers in Lekkerkerk en omgeving',
      tekst:
        'Van de bakker om de hoek in Lekkerkerk tot de banketbakkerij in Schoonhoven of Ouderkerk aan den IJssel: ik kom langs, stel de stand in en test hem samen met je. Ook in Krimpen aan den IJssel en Rotterdam-Oost.',
    },
    testimonialPlaceholder: '[testimonial van een bakker volgt]',
  },
  {
    slug: 'snackbar',
    naam: 'Snackbars',
    meervoud: 'snackbars',
    zaak: 'snackbar',
    icoon: 'fries',
    teaser: 'Je menu op de telefoon van wachtende klanten en een review terwijl de friet bakt.',
    hero: {
      eyebrow: 'Voor snackbars en cafetaria’s',
      titel: 'Je menu en Google-reviews in één tik',
      accent: 'Google-reviews',
      intro:
        'Bij de snackbar wacht iedereen even op de bestelling. Precies het moment om je menu te bekijken of een review achter te laten. Met een NFC-standaard op de toonbank kan dat met één tik.',
    },
    standen: [
      { soort: 'menu', regels: ['Bekijk', 'ons menu!'], accentRegel: 1, subtekst: 'Tik met je telefoon of scan' },
      { soort: 'review', regels: ['Even', 'wachten?'], accentRegel: 1, subtekst: 'Laat een review achter' },
    ],
    waarom: {
      titel: 'Waarom reviews belangrijk zijn voor je snackbar',
      alineas: [
        'Wie zin heeft in friet of een broodje, zoekt vaak op “snackbar in de buurt”. Dan zijn de sterren en reviews het eerste wat iemand van jouw zaak ziet, vaak nog voordat ze je menu hebben bekeken.',
        'Je hebt alles in huis voor reviews: lekker eten en klanten die toch al even moeten wachten. De stand op de toonbank brengt die twee samen.',
      ],
    },
    toepassingen: [
      {
        product: 'menu',
        titel: 'Je menu op hun telefoon',
        tekst: 'Met de menustand bekijken klanten je hele menu terwijl ze in de rij staan. Ze weten sneller wat ze willen als ze aan de beurt zijn.',
      },
      {
        product: 'review',
        titel: 'Een review terwijl de friet bakt',
        tekst: 'Je klant staat toch te wachten op de bestelling. Eén tik op de reviewstand en het reviewvenster staat open.',
      },
      {
        product: 'socials',
        titel: 'Acties en nieuwe snacks',
        tekst: 'Een nieuwe burger, een weekactie of aangepaste openingstijden? Wie je volgt op Instagram, TikTok of Facebook ziet het meteen.',
      },
    ],
    plekken: [
      { titel: 'Op de toonbank bij het bestellen', tekst: 'Een menustand helpt klanten kiezen voordat ze aan de beurt zijn.' },
      { titel: 'Bij de wachtplek of statafel', tekst: 'Hier staan klanten het langst. Een reviewstand valt hier goed op.' },
      { titel: 'Bij de afhaalbalie', tekst: 'Het laatste moment voordat klanten met hun bestelling naar huis gaan.' },
    ],
    voorbeeldteksten: [
      'Wachten op je bestelling? Laat een review achter!',
      'Bekijk ons menu!',
      'Volg ons voor acties',
      'Hoe was je bestelling? Laat het ons weten',
    ],
    vragen: [
      {
        vraag: 'Kan de menustand naar mijn bestelpagina linken?',
        antwoord:
          'Ja. Heb je een eigen bestelpagina of sta je op een bezorgplatform? Dan kan de stand daarnaartoe wijzen. Zo weten klanten je de volgende keer ook online te vinden.',
      },
      {
        vraag: 'Ik pas mijn prijzen vaak aan. Moet de stand dan steeds veranderen?',
        antwoord:
          'Nee. De stand wijst naar je online menu. Pas je de prijzen op die pagina aan, dan ziet iedereen meteen de nieuwe prijzen. De stand zelf hoeft niet te veranderen.',
      },
      {
        vraag: 'Werkt de stand ook als het druk is?',
        antwoord:
          'Ja. Er hoeft niemand iets voor te doen aan de toonbank. Klanten tikken zelf, en jij kunt gewoon doorwerken.',
      },
    ],
    lokaal: {
      titel: 'Voor snackbars in Lekkerkerk en omgeving',
      tekst:
        'Of je cafetaria nu in Lekkerkerk staat, in Krimpen aan den IJssel of in Rotterdam-Oost: ik kom langs en zet de stand samen met je klaar. Ook in Schoonhoven, Ouderkerk aan den IJssel en de rest van de Krimpenerwaard.',
    },
    testimonialPlaceholder: '[testimonial van een snackbar volgt]',
  },
];

/** Andere zaken waar een stand goed werkt (homepage). */
export const andereZaken = [
  'Nagelstudio’s en schoonheidssalons',
  'Cafés en lunchrooms',
  'Slagers en groentewinkels',
  'Bloemisten',
  'Fietsenmakers en garages',
  'Sportscholen en studio’s',
];
