# Het Frietlokaal

Website van Het Frietlokaal: verse handgesneden friet, huisgemaakte sauzen en klassieke snacks.
Gebouwd met Next.js en Tailwind CSS, als **statische site**. Je hebt dus geen server of database nodig en kunt hem gratis hosten.

## Snel starten

Je hebt [Node.js](https://nodejs.org) versie 20.9 of hoger nodig.

```bash
npm install       # eenmalig: alles installeren
npm run dev       # ontwikkelserver starten
```

Open daarna **http://localhost:3000** in je browser. Wijzigingen die je opslaat zie je direct.

Andere handige commando's:

```bash
npm run build     # bouwt de complete site naar de map out/
npm run lint      # controleert de code op fouten
npm run preview   # bekijk de gebouwde site (map out/) zoals hij online komt te staan
```

---

## Teksten en prijzen aanpassen

### Bedrijfsgegevens: `config/site.ts`

Adres, telefoonnummer, e-mail, openingstijden en social-media-links staan allemaal in **één bestand**. Pas je hier iets aan, dan verandert het overal mee: header, footer, contactpagina, Google-gegevens (structured data) en de "Nu open"-melding.

```ts
phone: {
  display: "0123-456789",          // zo staat het op de site
  international: "+31123456789",   // voor de bel-knop op mobiel
},
```

**Openingstijden:** gebruik `"HH:MM"`, of `null` voor gesloten:

```ts
{ day: "Monday", label: "Maandag", open: null, close: null },        // gesloten
{ day: "Tuesday", label: "Dinsdag", open: "12:00", close: "21:00" },
```

Zet bij `url` het echte webadres zodra je dat hebt (bijv. `https://www.hetfrietlokaal.nl`). Dat is nodig voor Google en voor de previews op social media.

### Menu en prijzen: `data/menu.ts`

Elk gerecht ziet er zo uit:

```ts
{
  id: "loaded-friet",                       // uniek, kleine letters, streepjes
  name: "Loaded friet",
  description: "Friet vol gesmolten kaas, krokante bacon en frisse lente-ui.",
  prices: [{ amount: 750 }],                // let op: in CENTEN, 750 = € 7,50
  labels: ["Populair"],                     // optioneel: "Populair", "Vegetarisch", "Pittig"
},
```

- **Prijs wijzigen:** pas `amount` aan. Prijzen staan in centen, dus € 3,75 schrijf je als `375`.
- **Meerdere formaten:** zie "Verse friet" (`{ size: "Klein", amount: 295 }, …`).
- **Gerecht toevoegen:** kopieer een blok, geef het een nieuw `id` en pas de tekst aan.
- **Op de homepage uitlichten:** zet `featured: true` en geef een `image` en `imageAlt` mee. Houd het bij drie uitgelichte gerechten, dan blijft de layout netjes.

### Overige teksten

| Wat | Waar |
|---|---|
| Homepage (hero, kernpunten, verhaal) | `components/home/` |
| Blok "Kom langs" | `components/shared/VisitUs.tsx` |
| Over ons (verhaal, werkwijze, kernwaarden) | `app/over-ons/page.tsx` |
| Contactpagina | `app/contact/page.tsx` |
| Titel en omschrijving voor Google (per pagina) | bovenaan elk `page.tsx`-bestand, bij `pageMetadata` |

> Het verhaal op "Over ons" is voorbeeldtekst. Lees het even na en vervang het door jullie echte verhaal.

---

## Foto's vervangen

Alle foto's staan in **`public/images/`**. Nu zijn het nog placeholders met de bestandsnaam erop.
Vervang ze door je eigen foto's met **precies dezelfde bestandsnaam**, dan hoef je niets aan de code te veranderen.

| Bestand | Waar | Aanbevolen formaat |
|---|---|---|
| `hero.jpg` | grote foto op de homepage | 1200 × 1200 (vierkant) |
| `friet-groot.jpg` | uitgelicht: Verse friet | 1200 × 900 (4:3) |
| `loaded-friet.jpg` | uitgelicht: Loaded friet | 1200 × 900 (4:3) |
| `stoofvlees.jpg` | uitgelicht: Frietje stoofvlees | 1200 × 900 (4:3) |
| `truffelfriet.jpg` | reserve, voor als je truffelfriet uitlicht | 1200 × 900 (4:3) |
| `sanne-en-joris.jpg` | homepage en Over ons | 1200 × 1500 (staand, 4:5) |
| `aardappelen.jpg` | Over ons, werkwijze | 1200 × 900 (4:3) |
| `menu-header.jpg` | bovenaan de menupagina | 1600 × 800 |
| `og-image.jpg` | preview bij delen op WhatsApp, Facebook enz. | precies 1200 × 630 |

**Tips voor een snelle site:**
- Houd foto's onder de **200 KB**. Comprimeer ze gratis met [squoosh.app](https://squoosh.app) (kies MozJPEG, kwaliteit ca. 75).
- Foto's worden automatisch bijgesneden. Zorg dat het belangrijkste (de friet!) in het midden staat.
- Beschrijf je foto's: de omschrijving (alt-tekst) staat in de code naast de afbeelding, bijvoorbeeld bij `imageAlt` in `data/menu.ts`. Zo werkt de site ook voor blinde bezoekers en voor Google.

Het favicon (het icoontje in het browsertabblad) is `app/icon.svg`.

---

## Contactformulier instellen

Het formulier werkt meteen: zolang er niets is ingesteld, opent het de e-mailapp van de bezoeker met het bericht al ingevuld.
Wil je dat berichten direct in je inbox komen? Gebruik dan [Formspree](https://formspree.io) (gratis tot 50 berichten per maand):

1. Maak een account en een nieuw formulier aan met `info@hetfrietlokaal.nl` als ontvanger.
2. Je krijgt een adres als `https://formspree.io/f/abcdwxyz`. Kopieer het laatste stukje (`abcdwxyz`).
3. Plak het in `config/site.ts`: `formspreeId: "abcdwxyz",`
4. Zet de site opnieuw online. Na het eerste bericht vraagt Formspree je om te bevestigen.

Lukt het versturen een keer niet, dan krijgt de bezoeker automatisch de optie om via e-mail te versturen.

---

## Online zetten via Vercel (gratis)

1. Zet deze code op **GitHub** (staat hij er al, dan kun je deze stap overslaan).
2. Ga naar [vercel.com](https://vercel.com) en log in met je GitHub-account.
3. Klik op **Add New… → Project** en kies deze repository.
4. Vercel herkent Next.js automatisch. Laat alle instellingen staan en klik op **Deploy**.
5. Na ongeveer een minuut staat je site online op een adres als `het-frietlokaal.vercel.app`.

**Eigen domeinnaam koppelen:** ga in Vercel naar je project → **Settings → Domains**, voeg `hetfrietlokaal.nl` toe en volg de instructies om de DNS bij je domeinprovider aan te passen. Vergeet daarna niet de `url` in `config/site.ts` aan te passen.

Vanaf nu gaat elke wijziging die je naar GitHub pusht **automatisch** online.

### Liever Netlify?

Kan ook: koppel de repository op [netlify.com](https://netlify.com) met build command `npm run build` en publish directory `out`.
Of sleep de map `out/` (na `npm run build`) naar [app.netlify.com/drop](https://app.netlify.com/drop).

---

## Techniek in het kort

- Next.js 16 (App Router) + TypeScript, statische export naar `out/`
- Tailwind CSS v4: kleuren en lettertypes staan in `app/globals.css`
- Iconen: lucide-react
- SEO: unieke titel en omschrijving per pagina, Open Graph, `sitemap.xml`, `robots.txt` en Restaurant-structured data met adres en openingstijden
- Lighthouse (mobiel): performance 94–99, toegankelijkheid, best practices en SEO 100

Meer technische afspraken staan in `CLAUDE.md`.
