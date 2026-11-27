# Tipero: website

De website van **Tipero**: NFC-standaards voor de toonbank van lokale ondernemers in de regio Rotterdam.

Gebouwd met [Astro](https://astro.build) 7 als statische site. Bezoekers krijgen geen JavaScript binnen, alleen HTML en CSS.
Daardoor is de site snel: Lighthouse (mobiel) geeft 100 op prestaties, toegankelijkheid, best practices en SEO.

- 11 pagina's: home, producten, hoe het werkt, prijzen, werkgebied, over, contact, veelgestelde vragen, privacy, bedankt en 404
- Alle teksten, prijzen en contactgegevens staan in databestanden in `src/data/`
- SEO: unieke titels en omschrijvingen, canonical-URL's, Open Graph-afbeeldingen, sitemap, robots.txt en structured data (LocalBusiness zonder adres, Product/Offer, FAQPage, BreadcrumbList)
- Geen cookies en geen tracking, dus ook geen cookiebanner nodig
- Contactformulier via Netlify Forms (of Formspree), werkt zonder eigen server en zonder JavaScript

---

## 1. Lokaal starten

Je hebt **Node.js 22** (of nieuwer) nodig: [nodejs.org](https://nodejs.org). Open een terminal in de map `tipero` en installeer eenmalig de pakketten:

```bash
npm install
```

Start daarna de ontwikkelserver:

```bash
npm run dev
```

Open http://localhost:4321. Pas je iets aan, dan zie je het meteen in de browser.

Andere opdrachten:

| Opdracht | Wat het doet |
|---|---|
| `npm run build` | Controleert de code (TypeScript) en bouwt de site in `dist/` |
| `npm run preview` | Bekijk de gebouwde site lokaal |
| `npm run controleer` | Controleert de gebouwde site: SEO, koppen, links, formulier, structured data en kleurcontrast |
| `npm run placeholders` | Laat zien welke `[placeholders]` nog ingevuld moeten worden |
| `npm run lighthouse` | Draait Lighthouse (mobiel) op alle pagina's (heeft Chrome nodig) |
| `npm run afbeeldingen` | Maakt de OG-afbeeldingen, favicon en productafbeeldingen opnieuw (zie §4) |

---

## 2. Teksten, prijzen en gegevens aanpassen

Alles wat je zelf wilt aanpassen staat in `src/data/`. Je hoeft geen HTML te kennen. Pas de tekst tussen de aanhalingstekens aan en sla het bestand op.

| Bestand | Wat staat erin |
|---|---|
| `src/data/bedrijf.ts` | **Contactgegevens, prijzen, levertijd, KvK, formulier-instelling.** Begin hier. |
| `src/data/seo.ts` | Titel en omschrijving per pagina, zoals Google ze toont |
| `src/data/home.ts` | Teksten van de homepage |
| `src/data/producten.ts` | Reviewstand, menustand en socials-stand |
| `src/data/stappen.ts` | De stappen op de homepage en op /hoe-het-werkt |
| `src/data/faq.ts` | Alle veelgestelde vragen (met `opHome: true` staan ze ook op de homepage) |
| `src/data/werkgebied.ts` | Naam van je werkgebied (nu: regio Rotterdam), ook voor de structured data |
| `src/data/over.ts` | Je eigen verhaal op /over |
| `src/data/testimonials.ts` | Ervaringen van klanten (alleen échte, met toestemming) |
| `src/data/navigatie.ts` | Menu-items in de header en footer |
| `src/pages/privacy.astro` | De privacyverklaring |

### Prijzen

In `src/data/bedrijf.ts`:

```ts
export const prijzen = {
  standaard: 29.95,
  huisstijl: 39.95,
  set: 49.95,
  ...
```

Gebruik een **punt** als decimaalteken. Op de site wordt het automatisch "€ 29,95". De prijzen worden overal bijgewerkt: in de prijskaarten, de FAQ, de paginatitels en de structured data voor Google.

### Contactgegevens

Ook in `src/data/bedrijf.ts`. Vul je 06-nummer gewoon in, bijvoorbeeld `'06 12345678'`. De site maakt daar zelf een WhatsApp-link van (`wa.me/31612345678`) met een vooraf ingevuld bericht. Zolang er nog een placeholder staat, gaan de WhatsApp-knoppen naar de contactpagina.

Heb je een KvK-nummer? Vul het in bij `kvk`. Het verschijnt dan in de footer, in de privacyverklaring en in de structured data. Laat je het leeg, dan wordt het nergens getoond.

### Placeholders

Gegevens die nog ontbreken staan tussen [vierkante haken], bijvoorbeeld `[06-nummer]`. Bekijk wat er nog openstaat met:

```bash
npm run build
```

```bash
npm run placeholders
```

Wil je live gaan voordat je testimonials of een foto hebt? Zet dan `toonPlaceholders: false` in `bedrijf.ts`. De lege blokken worden dan verborgen.

### Je foto op de Over-pagina

Zet een foto (`.jpg`, `.png` of `.webp`, liefst staand en minstens 900 pixels breed) in `src/assets/over/`. De site maakt er bij het bouwen automatisch kleine AVIF- en WebP-versies van, met de juiste afmetingen. Pas de alt-tekst aan in `src/data/over.ts`.

### Controleer deze punten voordat je live gaat

Een paar teksten zijn een aanname. Controleer ze en pas ze aan als ze niet kloppen:

- [ ] **Langskomen en instellen zitten bij de prijs in** (`prijzen.inbegrepen` in `bedrijf.ts`)
- [ ] **Prijzen zijn eenmalig, zonder abonnement** (`prijzen.eenmalig`)
- [ ] **De set is in het standaard-ontwerp** (prijskaart en FAQ)
- [ ] **Btw-vermelding** (`prijzen.btwTekst`): incl. of excl. btw, of geen btw door de kleineondernemersregeling
- [ ] **Levertijd** (`levertijd`) en **reactietijd** ("Meestal reageer ik dezelfde dag.")
- [ ] **Link later aanpassen**: de FAQ zegt dat je de chip opnieuw kunt programmeren en de QR-code controleert
- [ ] **Materiaal en schoonmaken** van de stand (FAQ "Hoe lang gaat de stand mee?")
- [ ] **Privacy**: de stand verzamelt geen gegevens van klanten. Dat klopt als op de chip een directe link staat. Gebruik je een eigen doorverwijslink met statistieken, pas dan de privacyverklaring aan.
- [ ] **Naam van je e-mailprovider** in de privacyverklaring

### Teksten op de stand en de regels van Google

Google staat toe dat je klanten om een review vraagt, maar niet in ruil voor een beloning, en niet alleen aan tevreden klanten. Gebruik daarom op standen en op de site neutrale teksten zoals "Laat een review achter!". Vermijd teksten als "Tevreden? Laat een review achter".

---

## 3. Gratis online zetten met Netlify (met eigen domein)

> De site staat nu alleen in GitHub. Hij komt pas online als je de stappen hieronder zelf doet.

### Site aanmaken

1. Maak een gratis account op [netlify.com](https://www.netlify.com) en log in met GitHub.
2. Kies **Add new project** → **Import an existing project** → **GitHub**, en selecteer deze repository.
3. Vul in:
   - **Branch to deploy**: de branch met de site (bijvoorbeeld `main`)
   - **Base directory**: `tipero`
   - **Build command**: `npm run build` (staat ook al in `netlify.toml`)
   - **Publish directory**: `dist` (Netlify toont dit soms als `tipero/dist`)
4. Klik op **Deploy**. Na een minuut of twee staat de site op een adres als `https://jouw-naam.netlify.app`.

Elke keer dat je een wijziging naar GitHub pusht, zet Netlify automatisch de nieuwe versie online.

### Contactformulier aanzetten

1. Ga in Netlify naar **Project configuration → Forms** en zet **Form detection** aan.
2. Start een nieuwe deploy (**Deploys → Trigger deploy**), zodat Netlify het formulier vindt.
3. Ga naar **Forms → Form notifications → Add notification → Email notification** en vul je e-mailadres in. Elke aanvraag krijg je dan ook per mail.
4. Test het formulier op de live site. De inzending staat daarna onder **Forms**.

Het gratis Netlify-abonnement heeft een maandlimiet. Check de actuele limieten op netlify.com/pricing.

### Eigen domein koppelen (www.tipero.nl)

1. Koop `tipero.nl` bij een domeinregistrar (bijvoorbeeld TransIP, Hostnet of Versio), als je dat nog niet hebt.
2. Ga in Netlify naar **Domain management → Add a domain** en vul `www.tipero.nl` in. Netlify voegt `tipero.nl` er zelf bij en stuurt die door naar `www`.
3. Stel de DNS in. Er zijn twee manieren:
   - **Makkelijkst: Netlify DNS.** Kies in Netlify voor "Netlify DNS" en zet bij je registrar de **nameservers** op de vier adressen die Netlify geeft.
   - **DNS bij je registrar houden.** Maak deze records aan (Netlify toont de actuele waarden bij je domein):
     - `www` → **CNAME** → `jouw-naam.netlify.app`
     - `@` (het kale domein) → **A-record** → het IP-adres van Netlify's load balancer (staat in Netlify's instructies, op het moment van schrijven `75.2.60.5`)
4. Wacht tot de DNS is bijgewerkt (meestal binnen een uur, soms tot 24 uur). Netlify regelt daarna automatisch een gratis **https-certificaat** (Let's Encrypt).
5. Zet **www.tipero.nl** als **Primary domain**.

Gebruik je een ander domein? Pas dan `url` aan in `src/data/bedrijf.ts`. De canonical-URL's, de sitemap, robots.txt en de Open Graph-tags gaan daarna allemaal mee.

### Alternatief: Cloudflare Pages

Dat kan ook gratis, met onbeperkt verkeer. Kies bij Cloudflare **Workers & Pages → Create → Pages → Connect to Git**, met root directory `tipero`, build command `npm run build` en output directory `dist`. Netlify Forms werkt daar niet. Maak dan een gratis formulier aan op [formspree.io](https://formspree.io) en zet in `bedrijf.ts`:

```ts
formulier: { aanbieder: 'formspree', formspreeId: 'jouw-id' },
```

Het bestand `public/_headers` (beveiliging en caching) werkt op beide platforms.

---

## 4. Afbeeldingen opnieuw maken

De OG-afbeeldingen (`public/og/`, zichtbaar bij delen via WhatsApp en social media), `favicon.ico`, `apple-touch-icon.png`, `logo-512.png` en de productafbeeldingen voor Google worden gemaakt vanuit de echte componenten van de site. Maak ze opnieuw als je de huisstijl of de koppen verandert:

```bash
npm install --no-save playwright
```

```bash
npx playwright install chromium
```

```bash
npm run afbeeldingen
```

De sjablonen staan in `src/pages/merkbeelden/` en de lijst met formaten in `scripts/merkbeelden.json`. Ze bestaan alleen tijdens `npm run dev` en komen niet op de live site.

Het logo staat als SVG in `src/assets/merk/` (donker, wit, beeldmerk en favicon), handig voor drukwerk en social media.

---

## 5. Google Search Console instellen en de sitemap indienen

Doe dit zodra de site live staat op je eigen domein.

1. Ga naar [search.google.com/search-console](https://search.google.com/search-console) en log in met je Google-account.
2. Klik op **Property toevoegen** en kies **Domein**. Vul `tipero.nl` in (zonder `www` en zonder `https://`).
3. Google geeft je een **TXT-record** (begint met `google-site-verification=`). Voeg dat toe in je DNS: bij je registrar, of in Netlify onder **Domain management → DNS records** als je Netlify DNS gebruikt.
4. Klik in Search Console op **Verifiëren**. Lukt het niet meteen, probeer het dan na een uur opnieuw.
5. Ga in het menu naar **Indexering → Sitemaps**, vul `sitemap-index.xml` in en klik op **Indienen**. De status wordt na een tijdje **Geslaagd**.
6. Vul bovenin bij **URL-inspectie** `https://www.tipero.nl/` in en klik op **Indexering aanvragen**. Doe dat ook voor `/producten`, `/prijzen` en `/werkgebied`.
7. Kijk na een paar dagen bij **Indexering → Pagina's** welke pagina's zijn opgenomen, en later bij **Prestaties** op welke zoekwoorden je gevonden wordt.

Controleer de structured data van de live site met de [Rich Results Test](https://search.google.com/test/rich-results) en de [Schema Markup Validator](https://validator.schema.org). Een melding over een ontbrekend adres bij LocalBusiness is verwacht: je werkt vanuit huis en vermeldt bewust alleen je werkgebied (`areaServed`). Meldingen over verzending en retourbeleid bij de producten kun je ook negeren, want je verkoopt niet via een webshop.

### Belangrijkste tip voor lokale SEO: Google Bedrijfsprofiel

Maak een gratis [Google Bedrijfsprofiel](https://www.google.com/business/) aan als **servicegebied-bedrijf**: vul je werkgebied in en verberg je adres. Zet daarin de link naar je website. Dat profiel bepaalt grotendeels of je in Google Maps en bij "in de buurt"-zoekopdrachten verschijnt. En natuurlijk: zet je eigen reviewstand op je bureau.

---

## 6. Later: privacyvriendelijke statistieken (optioneel)

Wil je weten hoeveel bezoekers je hebt, zonder cookies? Kies bijvoorbeeld Plausible, GoatCounter of Netlify Analytics (dat laatste meet op de server en voegt geen script toe). Let dan op:

- Pas de privacyverklaring aan (`src/pages/privacy.astro`).
- Voeg het domein van de dienst toe aan de `Content-Security-Policy` in `public/_headers` (bij `script-src` en `connect-src`).

---

## 7. Juridische aandachtspunten

- **KvK-nummer**: zodra je ingeschreven bent, moet het op je website staan. Vul het in bij `kvk` in `bedrijf.ts`.
- **Adres**: de wet (art. 3:15d BW) vraagt bij commerciële websites in principe om een vestigingsadres. Veel ondernemers die vanuit huis werken gebruiken daarvoor een correspondentie- of kantooradres. Vraag bij de KvK na wat in jouw situatie nodig is. Deze site toont bewust alleen je werkgebied.
- **Btw**: vermeld of prijzen inclusief of exclusief btw zijn, of dat je de kleineondernemersregeling (KOR) gebruikt.

---

## Mappenstructuur

```
tipero/
├── public/                 favicon, OG-afbeeldingen, _headers (worden 1-op-1 gekopieerd)
├── scripts/                controles, Lighthouse, afbeeldingen maken
├── src/
│   ├── assets/             lettertypen (Poppins, zelf gehost), logo's, foto voor /over
│   ├── components/         bouwstenen (header, footer, illustraties, prijskaarten, FAQ, ...)
│   ├── data/               ← alle teksten, prijzen en gegevens
│   ├── layouts/            basislayout met SEO-tags en structured data
│   ├── lib/                hulpfuncties (opmaak, JSON-LD, QR-code)
│   ├── pages/              één bestand per pagina
│   └── styles/global.css   kleuren, typografie en knoppen
├── astro.config.ts         site-instellingen (domein, lettertypen, sitemap)
└── netlify.toml            Netlify-instellingen
```

Lettertype: Poppins (SIL Open Font License, zie `src/assets/fonts/OFL-LICENSE.txt`).
