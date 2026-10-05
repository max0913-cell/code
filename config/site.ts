/**
 * Alle bedrijfsgegevens op één plek.
 * Pas hier naam, adres, telefoon, openingstijden en social media aan;
 * de hele site (footer, contactpagina, SEO, structured data) leest hieruit.
 */

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type OpeningHoursDay = {
  /** Engelse dagnaam, gebruikt voor structured data en "vandaag"-markering */
  day: DayOfWeek;
  /** Zoals de dag op de site getoond wordt */
  label: string;
  /** "HH:MM" (24-uurs), of null als je die dag gesloten bent */
  open: string | null;
  close: string | null;
};

export const siteConfig = {
  name: "Het Frietlokaal",
  shortDescription:
    "Verse handgesneden friet, huisgemaakte sauzen en klassieke snacks in Voorbeeldstad.",
  /** Volledige URL van de live site, zonder slash aan het eind */
  url: "https://www.hetfrietlokaal.nl",
  foundingYear: 2019,
  founders: ["Sanne", "Joris"],

  address: {
    street: "Marktstraat 12",
    postalCode: "1234 AB",
    city: "Voorbeeldstad",
    country: "NL",
  },

  phone: {
    /** Zoals het nummer op de site staat */
    display: "0123-456789",
    /** Internationaal formaat voor tel:-links en structured data */
    international: "+31123456789",
  },

  email: "info@hetfrietlokaal.nl",

  /**
   * Formspree formulier-ID (het stuk na https://formspree.io/f/).
   * Laat leeg om het contactformulier via de e-mailapp van de bezoeker te laten verzenden.
   */
  formspreeId: "",

  openingHours: [
    { day: "Monday", label: "Maandag", open: null, close: null },
    { day: "Tuesday", label: "Dinsdag", open: "12:00", close: "21:00" },
    { day: "Wednesday", label: "Woensdag", open: "12:00", close: "21:00" },
    { day: "Thursday", label: "Donderdag", open: "12:00", close: "21:00" },
    { day: "Friday", label: "Vrijdag", open: "12:00", close: "22:00" },
    { day: "Saturday", label: "Zaterdag", open: "12:00", close: "22:00" },
    { day: "Sunday", label: "Zondag", open: "15:00", close: "21:00" },
  ] satisfies OpeningHoursDay[],

  social: {
    instagram: "https://www.instagram.com/hetfrietlokaal",
    facebook: "https://www.facebook.com/hetfrietlokaal",
  },
};

export const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`;

export const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${siteConfig.name}, ${fullAddress}`,
)}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${siteConfig.name}, ${fullAddress}`,
)}`;

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/menu/", label: "Menu" },
  { href: "/over-ons/", label: "Over ons" },
  { href: "/contact/", label: "Contact" },
] as const;
