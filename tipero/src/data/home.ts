/**
 * ─────────────────────────────────────────────────────────────
 *  HOMEPAGE-TEKSTEN
 * ─────────────────────────────────────────────────────────────
 */
import type { IconName } from '../lib/icons';

export const home = {
  hero: {
    eyebrow: 'NFC-standaards voor lokale zaken',
    /** De H1. Het deel in `accent` wordt geel. */
    titel: 'Meer Google-reviews, zonder erom te\u00A0vragen',
    accent: 'Google-reviews',
    intro:
      'Een NFC-standaard op je toonbank. Je klant tikt met de telefoon en staat meteen op jouw Google-reviewpagina. Geen app nodig. Ik kom langs, stel alles in en test het ter plekke.',
    punten: ['Werkt op iPhone en Android', 'QR-code als back-up', 'Ik kom langs en stel alles in'],
  },

  probleem: {
    eyebrow: 'Het probleem',
    titel: 'Je klanten zijn blij. Online zie je dat nog niet.',
    alineas: [
      'Mensen kijken eerst naar reviews voordat ze ergens binnenstappen. Maar wie tevreden de deur uitloopt, denkt er thuis niet meer aan. En elke klant zelf vragen om een review voelt ongemakkelijk, zeker als het druk is.',
      'Een Tipero-standaard op je toonbank vraagt het voor je. Bij iedere klant, op het moment dat het het makkelijkst is: bij het afrekenen. Eén tik en ze staan op je reviewpagina.',
    ],
  },

  stappen: {
    eyebrow: 'Hoe het werkt',
    titel: 'In drie stappen op je toonbank',
  },

  producten: {
    eyebrow: 'Producten',
    titel: 'Eén stand voor elk doel',
    intro: 'Kies wat je klanten moeten zien. Elke stand werkt met NFC én met een QR-code.',
  },

  voorWie: {
    eyebrow: 'Voor wie',
    titel: 'Gemaakt voor zaken met een toonbank',
    intro: 'Overal waar klanten afrekenen of even wachten, werkt een stand. Ik heb aparte pagina’s voor:',
    andereTitel: 'Maar ook voor',
  },

  waarom: {
    eyebrow: 'Waarom Tipero',
    titel: 'Geen pakketje met een handleiding. Gewoon geregeld.',
    intro:
      'Een NFC-standaard koop je ook online. Maar dan moet je zelf de juiste link vinden, de chip programmeren en hopen dat alles werkt. Bij Tipero doe ik dat voor je.',
    punten: [
      {
        icoon: 'pin',
        titel: 'Ik kom langs',
        tekst: 'Ik kom naar je zaak in Lekkerkerk of omgeving. Persoonlijk, op een moment dat het jou uitkomt.',
      },
      {
        icoon: 'link',
        titel: 'Ik zoek de juiste link op',
        tekst: 'De link die direct je reviewvenster opent, vind je niet zomaar. Ik regel het, ook voor je menu of socials.',
      },
      {
        icoon: 'shield',
        titel: 'Getest op jouw toonbank',
        tekst: 'Ik test de stand ter plekke met een iPhone én een Android. Zo weet je zeker dat hij werkt.',
      },
      {
        icoon: 'palette',
        titel: 'In je eigen huisstijl',
        tekst: 'Moet de stand bij je zaak passen? Dan maak ik hem met je eigen logo en kleuren.',
      },
      {
        icoon: 'whatsapp',
        titel: 'Even appen als er iets is',
        tekst: 'Nieuwe link of een vraag? Je appt gewoon iemand uit de buurt, geen klantenservice.',
      },
      {
        icoon: 'bolt',
        titel: 'Jij hoeft niets te doen',
        tekst: 'Geen app, geen account, geen gedoe. De stand staat op je toonbank en werkt.',
      },
    ] satisfies { icoon: IconName; titel: string; tekst: string }[],
  },

  vergelijking: {
    titel: 'Tipero vs. een stand uit een webshop',
    kolommen: ['', 'Vaak bij een webshop', 'Bij Tipero'],
    rijen: [
      ['De juiste link opzoeken', 'Zelf uitzoeken', 'Doe ik voor je'],
      ['Chip programmeren', 'Zelf, met een app', 'Doe ik ter plekke'],
      ['Testen op iPhone én Android', 'Zelf doen', 'Samen, in je zaak'],
      ['Ontwerp', 'Standaardontwerp', 'Tipero-ontwerp of jouw huisstijl'],
      ['Hulp als er iets is', 'Mailen met een klantenservice', 'Appen met iemand uit de buurt'],
    ],
  },

  testimonials: {
    eyebrow: 'Ervaringen',
    titel: 'Wat ondernemers zeggen',
  },

  prijzen: {
    eyebrow: 'Prijzen',
    titel: 'Duidelijke prijzen',
    intro: 'Langskomen, instellen en testen zitten erbij in.',
  },

  faq: {
    eyebrow: 'Vragen',
    titel: 'Veelgestelde vragen',
  },
};
