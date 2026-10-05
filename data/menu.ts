/**
 * Het complete menu. Pas hier namen, omschrijvingen, prijzen en labels aan.
 *
 * - Prijzen staan in centen: 295 = € 2,95 (zo voorkom je afrondingsfouten).
 * - Een item heeft één prijs, of meerdere formaten (zie "Verse friet").
 * - Labels zijn optioneel: "Populair", "Vegetarisch" of "Pittig".
 * - Zet `featured: true` en een `image` om een item op de homepage uit te lichten.
 */

export type MenuLabel = "Populair" | "Vegetarisch" | "Pittig";

export type MenuPrice = {
  /** Bijv. "Klein"; leeg laten als er maar één formaat is */
  size?: string;
  /** In centen */
  amount: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  prices: MenuPrice[];
  labels?: MenuLabel[];
  featured?: boolean;
  /** Pad vanaf de map public, bijv. "/images/stoofvlees.jpg" */
  image?: string;
  imageAlt?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  intro: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "friet",
    name: "Friet",
    intro: "Dagvers gesneden en twee keer gebakken. Krokant van buiten, zacht van binnen.",
    items: [
      {
        id: "verse-friet",
        name: "Verse friet",
        description: "Onze klassieker: handgesneden, goudbruin en met precies genoeg zout.",
        prices: [
          { size: "Klein", amount: 295 },
          { size: "Middel", amount: 375 },
          { size: "Groot", amount: 450 },
        ],
        featured: true,
        image: "/images/friet-groot.jpg",
        imageAlt: "Een grote puntzak goudbruine verse friet",
      },
      {
        id: "loaded-friet",
        name: "Loaded friet",
        description: "Friet vol gesmolten kaas, krokante bacon en frisse lente-ui.",
        prices: [{ amount: 750 }],
        labels: ["Populair"],
        featured: true,
        image: "/images/loaded-friet.jpg",
        imageAlt: "Bakje friet met gesmolten kaas, bacon en lente-ui",
      },
      {
        id: "truffelfriet",
        name: "Truffelfriet",
        description: "Met truffelolie, flinke vlokken Parmezaan en een snufje peterselie.",
        prices: [{ amount: 695 }],
        image: "/images/truffelfriet.jpg",
        imageAlt: "Friet met geraspte Parmezaanse kaas en peterselie",
      },
    ],
  },
  {
    id: "snacks",
    name: "Snacks",
    intro: "De Hollandse klassiekers, krokant gebakken zoals het hoort.",
    items: [
      {
        id: "frikandel",
        name: "Frikandel",
        description: "Lekker puur, of speciaal met mayo, curry en uitjes.",
        prices: [{ amount: 250 }],
      },
      {
        id: "kroket",
        name: "Kroket",
        description: "Romige rundvleeskroket met een krokant korstje.",
        prices: [{ amount: 275 }],
      },
      {
        id: "kaassouffle",
        name: "Kaassoufflé",
        description: "Krokant deeg met een kern van warme, smeuïge kaas.",
        prices: [{ amount: 275 }],
        labels: ["Vegetarisch"],
      },
      {
        id: "bitterballen",
        name: "Bitterballen (8 stuks)",
        description: "Om te delen, of niet. Met een bakje mosterd erbij.",
        prices: [{ amount: 595 }],
      },
      {
        id: "vegetarische-kroket",
        name: "Vegetarische kroket",
        description: "Net zo romig als het origineel, helemaal zonder vlees.",
        prices: [{ amount: 295 }],
        labels: ["Vegetarisch"],
      },
    ],
  },
  {
    id: "sauzen",
    name: "Sauzen",
    intro: "Elke ochtend vers gemaakt in onze eigen keuken.",
    items: [
      {
        id: "mayonaise",
        name: "Mayonaise",
        description: "Romig en vol van smaak, zoals mayo hoort te zijn.",
        prices: [{ amount: 75 }],
      },
      {
        id: "truffelmayo",
        name: "Huisgemaakte truffelmayo",
        description: "Onze eigen mayo met een flinke scheut truffel.",
        prices: [{ amount: 125 }],
      },
      {
        id: "satesaus",
        name: "Satésaus",
        description: "Warme pindasaus met een zoete, licht pittige toets.",
        prices: [{ amount: 100 }],
      },
      {
        id: "sriracha-mayo",
        name: "Sriracha-mayo",
        description: "Romig met een stevige kick. Niet voor watjes.",
        prices: [{ amount: 125 }],
        labels: ["Pittig"],
      },
      {
        id: "joppiesaus",
        name: "Joppiesaus",
        description: "Zoet, kruidig en een tikje kerrie. Verslavend lekker.",
        prices: [{ amount: 100 }],
      },
    ],
  },
  {
    id: "specials",
    name: "Specials",
    intro: "Voor als je echt honger hebt.",
    items: [
      {
        id: "frietje-stoofvlees",
        name: "Frietje stoofvlees",
        description: "Verse friet met uren gestoofd rundvlees in donkere biersaus.",
        prices: [{ amount: 895 }],
        labels: ["Populair"],
        featured: true,
        image: "/images/stoofvlees.jpg",
        imageAlt: "Bakje friet met Vlaams stoofvlees en een klodder mayonaise",
      },
      {
        id: "kapsalon",
        name: "Kapsalon",
        description: "Friet, shoarma en gesmolten kaas, met frisse salade en knoflooksaus.",
        prices: [{ amount: 950 }],
      },
      {
        id: "vegan-kapsalon",
        name: "Vegan kapsalon",
        description: "Alle lagen van het origineel, met plantaardige shoarma en vegan kaas.",
        prices: [{ amount: 950 }],
      },
    ],
  },
  {
    id: "dranken",
    name: "Dranken",
    intro: "Iets erbij om het weg te spoelen.",
    items: [
      {
        id: "frisdrank",
        name: "Frisdrank",
        description: "Cola, cola zero, sinas, cassis of spa. Lekker koud.",
        prices: [{ amount: 250 }],
      },
      {
        id: "munt-thee",
        name: "Verse munt-thee",
        description: "Met een flinke bos verse munt en een schijfje citroen.",
        prices: [{ amount: 295 }],
      },
      {
        id: "speciaalbier",
        name: "Speciaalbier",
        description: "Wisselend aanbod van een lokale brouwerij. Vraag wat er op de tap staat.",
        prices: [{ amount: 450 }],
      },
    ],
  },
];

export const featuredItems = menu.flatMap((category) =>
  category.items.filter((item) => item.featured),
);
