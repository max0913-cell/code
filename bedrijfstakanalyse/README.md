# Oefensite: De meso-omgeving – Bedrijfstakanalyse (ENTECO02J1)

Statische oefensite (HTML, CSS en JavaScript, geen build-stap) voor de digitale toets van 40 meerkeuzevragen.
Alle vragen, uitleg en flashcards zijn gebaseerd op de slides van week 1 t/m 4.

## Starten

Dubbelklik op `index.html` (opent in je browser), of start een kleine webserver in deze map:

```bash
npx serve .
```

Open daarna de link uit de terminal (meestal http://localhost:3000).

## Wat zit erin

- **Oefenen**: kies week 1, 2, 3, 4 of alle stof en het aantal vragen (10, 20 of alle). Je ziet één vraag tegelijk met direct uitleg, en je kunt een hint opvragen.
- **Toetssimulatie**: 40 willekeurige vragen zonder tussentijdse feedback. De verdeling volgt de toetsmatrijs op de slides: 18 vragen ABCD-analyse (9 uit week 1, 9 uit week 2), 12 uit week 3 en 10 uit week 4. Aan het eind krijg je je cijfer (cesuur 27 van 40 = 5,5), je score per week en per onderwerp, en alle fout beantwoorde vragen met uitleg.
- **Foutenlijst**: elke foute vraag komt terug tot je hem 2× achter elkaar goed hebt.
- **Flashcards**: 56 begrippen (voorkant begrip, achterkant uitleg en voorbeeld), per week, met "ken ik" en schudden.
- Vragen en antwoordvolgorde worden elke keer geschud. Je voortgang staat in `localStorage` van je browser.

## Bestanden

| Bestand | Inhoud |
|---|---|
| `index.html`, `style.css`, `app.js` | de site |
| `questions.js` | vragenbank (id, week, onderwerp, vraag, 4 opties, antwoord, uitleg, hint, bron) |
| `flashcards.js` | flashcards per week |
| `check-questions.cjs` | controlescript |

## Vragen controleren

```bash
node check-questions.cjs
```

Het script controleert onder meer: precies 4 unieke opties, één geldig antwoord, een uitleg, hint, week en onderwerp, geen dubbele id's of vraagteksten, minstens 25 vragen per week, en dat de officiële oefenvragen van de slides compleet zijn en hetzelfde antwoord hebben als de antwoordsleutel op de slides.

De 7 terugblikvragen op de slides van week 2 hebben geen officiële antwoordsleutel. Vraag 4 (productlevenscyclus) en 7 (cabrio's) zijn in de site gemarkeerd als "antwoord niet officieel bevestigd".
