# NOA-oefenen · Geneeskunde Erasmus MC (selectie 2027-2028)

Een gratis oefensite voor de **NOA-capaciteitentest** van de decentrale selectie Geneeskunde van het Erasmus MC. Elke subtest heeft drie niveaus (makkelijk, examen, moeilijk), elke opgave heeft een uitleg, en de site werkt goed op een telefoon.

> Deze site is niet verbonden aan het Erasmus MC of aan NOA. Alle opgaven zijn zelf gemaakt, in hetzelfde format als de echte test, en komen niet uit officiële voorbeelden of betaalde oefensites. Controleer data altijd op de site van het Erasmus MC.

## Wat zit erin

| Subtest | Soort | Wat je doet |
|---|---|---|
| Woordanalogieën | vragenbank (307 vragen) | `A – B = C – ?`, 5 opties |
| Rekenvaardigheid | generator (≥ 8 somtypes per niveau) | hoofdrekenen met decimalen, breuken en procenten, 5 opties |
| Exclusie | generator (≥ 8 regels per niveau) | welke van de 5 figuren hoort er niet bij? |
| Componenten | generator | met welke 2 van de 6 figuren kun je alle stukken samen maken? |
| *Extra:* Cijferreeksen | generator (≥ 8 regels per niveau) | welk getal komt hierna? |
| *Extra:* Woordrelaties | vragenbank (186 vragen) | welke 2 woorden zijn synoniemen of tegenstellingen? |
| *Extra:* Spiegelbeelden | generator | welke 2 van de 6 figuren zijn gespiegeld? |

De extra subtests gebruikt NOA in vergelijkbare tests; ze zitten misschien niet in de test op de selectiedag.

**Functies:** oefenmodus (direct nakijken met uitleg), toetsmodus (instelbare tijd, nakijken aan het eind), examensimulatie (de vier hoofdsubtests achter elkaar), resultaten met tijd per vraag en "fouten opnieuw oefenen", voortgang per subtest en niveau met grafiek (opgeslagen in je browser), licht en donker thema, bediening met toetsenbord. De echte tijdslimieten van NOA zijn niet bekend; de standaardtijden zijn een schatting.

## Hoe de correctheid wordt bewaakt

Alle opgaven worden automatisch gecontroleerd (`npm test`, ongeveer een minuut):

- **Rekenen:** exacte breuken met BigInt (geen afrondingsfouten). Elke optie wordt in de som ingevuld: precies één optie klopt. Alle opties zijn verschillend en worden met een komma geschreven. 4000 opgaven per niveau.
- **Cijferreeksen:** naast de bedoelde regel worden ruim tien andere soorten regels (rekenkundig, meetkundig, verschilreeksen, Fibonacci-achtig, door elkaar lopende reeksen, ...) op de getoonde getallen geprobeerd. Wijst een andere passende regel een andere optie aan, dan wordt de opgave weggegooid. 4000 per niveau.
- **Exclusie:** elke figuur is data; elke regel is een functie. Precies 4 figuren voldoen, 1 niet. Daarnaast worden ruim 35 eigenschappen en regels (vorm, aantal, vulling, grootte, draaiing, symmetrie, ...) op alle figuren geprobeerd: geen enkele mag een andere figuur als afwijker aanwijzen. 2500 per niveau.
- **Componenten:** rooster van hokjes en halve hokjes (elk hokje is 4 driehoekjes). Een backtracking-solver controleert dat precies 2 van de 6 opties te maken zijn, met én zonder spiegelen van de stukken (alleen opgaven waar dat hetzelfde uitkomt). 2000 per niveau.
- **Spiegelbeelden:** alleen figuren zonder draai- of spiegelsymmetrie (alle 7 symmetrieën gecontroleerd). Alle 6 varianten zijn verschillend en precies 2 zijn gespiegeld. 3000 per niveau.
- **Vragenbanken:** 5 unieke opties, geldig antwoord, uitleg die het antwoord noemt, geen dubbele vragen. Bij woordrelaties mag geen ander tweetal in een set elders als synoniem- of tegenstellingspaar voorkomen. Alle woordvragen zijn daarnaast met de hand nagelopen op dubbelzinnigheid.
- **Rondes:** binnen een ronde komt geen opgave twee keer voor.

## Lokaal draaien

Je hebt [Node.js](https://nodejs.org) 20 of nieuwer nodig.

```bash
npm ci
```

```bash
npm run dev
```

Open daarna de link die in de terminal verschijnt (meestal http://localhost:5173).

Andere opdrachten:

```bash
npm test
```

```bash
npm run build
```

```bash
npm run voorbeelden -- rekenen 5
```

`npm run build` maakt de map `dist/` met alleen statische bestanden. Die map kun je op elke webserver zetten. `npm run voorbeelden` print voorbeeldopgaven per niveau (vervang `rekenen` door `analogieen`, `reeksen`, `woordrelaties`, ...).

## Publiceren

### Optie 1: GitHub Pages (gratis, repo moet openbaar zijn)

Met een gratis GitHub-account werkt Pages alleen voor **openbare** repo's.

1. Maak de repo openbaar: op GitHub naar **Settings → General**, helemaal onderaan bij **Danger Zone** op **Change visibility → Make public**.
2. Zet Pages aan: **Settings → Pages**, kies bij **Source** voor **GitHub Actions**.
3. Zet de code op de branch `main` (bijvoorbeeld door de pull request te mergen).
4. De workflow `Testen en publiceren` draait de tests, bouwt de site en zet hem online. Je ziet de voortgang onder het tabblad **Actions**.
5. Je link wordt: `https://<gebruikersnaam>.github.io/<repo>/`, voor deze repo **https://max0913-cell.github.io/code/**.

Elke push naar `main` publiceert automatisch een nieuwe versie, maar alleen als alle tests slagen.

### Optie 2: Netlify (gratis, repo mag privé blijven)

1. Draai `npm ci` en `npm run build`.
2. Ga naar https://app.netlify.com/drop en sleep de map `dist` in het venster.
3. Je krijgt meteen een openbare link. Met een (gratis) account kun je die link houden en later bijwerken.

Andere hosts zoals Cloudflare Pages of Vercel werken ook: build-opdracht `npm run build`, map `dist`.

## Mappenstructuur

```
index.html
src/
  main.ts, styles.css, storage.ts
  core/        rng, exacte breuken, driehoekjesrooster, SVG-helpers, types
  subtests/
    registry.ts            alle subtests op één plek
    rekenen/ reeksen/      generators met eigen controles
    exclusie/              figuurmodel, regels, generator, tekenen
    componenten/           generator, solver, tekenen
    spiegel/               generator, tekenen
    analogieen/ woordrelaties/  handgeschreven vragenbanken
  ui/          startpagina, sessies, resultaten, voortgang, schaal van figuren
tests/         automatische controles per subtest
scripts/       voorbeeldopgaven printen
.github/workflows/deploy.yml
```

## Vragen toevoegen

- Woordanalogie: voeg een regel toe in `src/subtests/analogieen/<niveau>.ts`: `['A', 'B', 'C', 'antwoord', ['afleider1', 'afleider2', 'afleider3', 'afleider4'], 'Uitleg die het antwoord noemt.']`.
- Woordrelatie: in `src/subtests/woordrelaties/banks.ts`, met `s(...)` voor synoniemen en `t(...)` voor tegenstellingen.
- Draai daarna `npm test`: de validatie laat zien of een vraag ongeldig is.

## Officieel materiaal

- [Erasmus MC: verdiep je in de toelating, opleiding en selectie](https://www.eur.nl/erasmusmc/onderwijs/decentrale-selectie/verdiep-je-de-toelating-opleiding-en-selectie)
- [Reglement selectie 2027-2028](https://www.eur.nl/erasmusmc/media/2026-09-eurreglementselectie2027-2028)
- [NOA-testvoorbeelden](https://eur.nl/erasmusmc/media/125011)
- [Slides coachingswebinar 2025](https://eur.nl/erasmusmc/media/125009)
- [Gratis oefentest van NOA (assess.ly)](https://assess.ly/en/noa/)

## Ook in deze repo: oefensite Bedrijfstakanalyse

In de map [`bedrijfstakanalyse/`](bedrijfstakanalyse/) staat een losse statische oefensite voor de toets *De meso-omgeving – Bedrijfstakanalyse* (ENTECO02J1). Die heeft geen build-stap: open `bedrijfstakanalyse/index.html` of draai `npx serve bedrijfstakanalyse`. Zie [de README in die map](bedrijfstakanalyse/README.md).
