/*
 * Vragenbank "De meso-omgeving – Bedrijfstakanalyse" (ENTECO02J1)
 *
 * Elke vraag:
 *   id          unieke code (w<week>-<nummer>)
 *   week        1–4 (de week waarin de stof behandeld is)
 *   onderwerp   onderwerp binnen de week
 *   vraag       vraagtekst (mag een korte casus bevatten)
 *   opties      precies 4 antwoorden (zonder A/B/C/D, die worden bij het tonen toegevoegd)
 *   antwoord    index van het juiste antwoord in `opties` (0 = eerste optie)
 *   uitleg      waarom het goede antwoord klopt en waarom de belangrijkste afleider fout is
 *   hint        korte hint (optioneel te tonen in de oefenmodus)
 *   bron        "slides" (officiële oefenvraag) of "zelfgemaakt"
 *   bronDetail  (optioneel) waar de vraag op de slides staat
 *   onbevestigd (optioneel) true = antwoord niet officieel bevestigd
 *
 * Alleen gebaseerd op de slides van week 1 t/m 4.
 */
window.QUESTIONS = [];

/* ============================================================
 * WEEK 1 – ABCD, afnemersanalyse, bedrijfstakanalyse (8 okt)
 * ============================================================ */

/* --- Officiële oefenvragen (slides week 2: "Terugblik") --- */
QUESTIONS.push(
  {
    id: 'w1-01', week: 1, onderwerp: 'Bedrijfstakanalyse',
    vraag: 'Welke factor kan worden geïdentificeerd door middel van een bedrijfstakanalyse?',
    opties: [
      'De aantrekkelijkheid van de markt.',
      'De operationele efficiëntie van het bedrijf.',
      'De concurrenten.',
      'De marketingstrategie van het bedrijf.'
    ],
    antwoord: 0,
    uitleg: 'De bedrijfstakanalyse gaat over de aantrekkelijkheid van de markt en de kansen en bedreigingen in de bedrijfstak ("Toetreden ja of nee?"). "De concurrenten" is de valkuil: afzonderlijke concurrenten (ondernemingen en merken) onderzoek je in de concurrentenanalyse (micro/meso), niet in de bedrijfstakanalyse (concurrentie als geheel).',
    hint: 'Denk aan de vraag "Toetreden ja of nee?".',
    bron: 'slides', bronDetail: 'Tentamenvraag 1, slides week 2'
  },
  {
    id: 'w1-02', week: 1, onderwerp: 'Vijfkrachtenmodel',
    vraag: 'Hoe kunnen schaalvoordelen in een industrie de concurrentie-intensiteit verminderen?',
    opties: [
      'Ze verhogen de kosten voor de bestaande concurrenten.',
      'Ze vergroten de vraag naar nieuwe producten.',
      'Ze maken het moeilijker voor nieuwe spelers om toe te treden.',
      'Ze verminderen de kosten voor leveranciers.'
    ],
    antwoord: 2,
    uitleg: 'Schaalvoordelen zijn een toetredingsdrempel: de toetredingsdrempels zijn juist laag bij "afwezigheid van schaalvoordelen". Met schaalvoordelen kunnen nieuwe spelers moeilijk dezelfde lage kosten halen, dus komen er minder toetreders. Schaalvoordelen verlagen de kosten van de bestaande aanbieders, ze verhogen die niet.',
    hint: 'Kijk naar de kracht "dreiging van potentiële toetreders".',
    bron: 'slides', bronDetail: 'Tentamenvraag 2, slides week 2'
  },
  {
    id: 'w1-03', week: 1, onderwerp: 'Vijfkrachtenmodel',
    vraag: 'Waarom kan een industrie met hoge overstapkosten voor afnemers minder aantrekkelijk zijn voor nieuwe toetreders?',
    opties: [
      'Nieuwe toetreders kunnen zich makkelijker onderscheiden.',
      'Afnemers blijven loyaal aan bestaande aanbieders, zelfs als er betere alternatieven komen.',
      'Afnemers hebben meer macht over leveranciers.',
      'Het vergroot de concurrentiedruk, daardoor hebben afnemers te maken met kosten.'
    ],
    antwoord: 1,
    uitleg: 'Hoge overstapkosten (switching costs) houden afnemers vast bij hun huidige aanbieder. Een nieuwkomer krijgt ze dan moeilijk over, ook met een beter product. "Afnemers hebben meer macht" klopt niet: de macht van afnemers is juist sterk bij LAGE switching costs.',
    hint: 'Wat doet een klant als overstappen duur is?',
    bron: 'slides', bronDetail: 'Tentamenvraag 3, slides week 2'
  },
  {
    id: 'w1-04', week: 1, onderwerp: 'Productlevenscyclus',
    vraag: 'In welke fase van de productlevenscyclus voegt een ondernemer vaak nieuwe functies of varianten toe om de vraag te stimuleren?',
    opties: ['Introductiefase', 'Groeifase', 'Volwassenheidsfase', 'Neergangsfase'],
    antwoord: 2,
    uitleg: 'In de volwassenheidsfase moet je je positie verdedigen en je onderscheiden van concurrenten; nieuwe functies of varianten zijn een manier om dat te doen. In de groeifase is dat nog niet nodig: daar benut je de groei en bouw je je marktpositie op. LET OP: de docent heeft voor deze vraag geen officiële antwoordsleutel gegeven.',
    hint: 'In welke fase moet je je vooral onderscheiden van concurrenten?',
    bron: 'slides', bronDetail: 'Tentamenvraag 4, slides week 2', onbevestigd: true
  },
  {
    id: 'w1-05', week: 1, onderwerp: 'Bedrijfstakanalyse vs andere analyses',
    vraag: 'Een bedrijf overweegt een nieuwe markt te betreden en wil onderzoeken hoe aantrekkelijk deze markt is, om te kijken of toetreden gunstig is. Welke onderzoeksmethode biedt het meest betrouwbare inzicht in hoe aantrekkelijk de markt is?',
    opties: [
      'SWOT-analyse, omdat het zowel interne sterktes en zwaktes van het bedrijf als de kansen en bedreigingen in de markt in kaart brengt.',
      'De concurrentieanalyse, omdat deze een volledig inzicht geeft in welke concurrentie er op de markt is; door deze te onderzoeken kan dit bij toetreding een concurrentievoordeel geven.',
      'De 6 W\'s van Ferrell, omdat het inzicht biedt in klantbehoeften en het koopgedrag.',
      'Porter\'s vijfkrachtenmodel, omdat het de concurrentiedruk, de macht van leveranciers en klanten, de dreiging van substituten en toetreders, en de mate van rivaliteit in de markt beoordeelt.'
    ],
    antwoord: 3,
    uitleg: 'Het vijfkrachtenmodel hoort bij de bedrijfstakstructuurfactoren van de bedrijfstakanalyse en beoordeelt de aantrekkelijkheid van de markt. De 6 W\'s zijn de afnemersanalyse (klanten), niet de markt als geheel. De concurrentieanalyse kijkt naar afzonderlijke concurrenten, niet naar de aantrekkelijkheid van de hele markt.',
    hint: 'Welk model hoort bij "bedrijfstakstructuurfactoren"?',
    bron: 'slides', bronDetail: 'Tentamenvraag 5, slides week 2'
  },
  {
    id: 'w1-06', week: 1, onderwerp: '6 W\'s van Ferrell',
    vraag: 'Ferrell en Hartline (2010) delen de afnemersanalyse in aan de hand van de zes W\'s. Welke vraag wordt gesteld bij "Wie"?',
    opties: [
      'Wie is onze ideale klant?',
      'Wie zijn onze huidige en potentiële klanten?',
      'Wie zijn onze belangrijkste leveranciers en partners?',
      'Wie zijn onze concurrenten en hoe beïnvloeden zij onze klanten?'
    ],
    antwoord: 1,
    uitleg: 'De 6 W\'s horen bij de afnemersanalyse (A van ABCD). Bij "Wie" breng je je huidige én potentiële klanten in kaart. "Wie is onze ideale klant?" is te smal: het gaat om alle (ook potentiële) klanten. Leveranciers en concurrenten horen niet bij de afnemersanalyse.',
    hint: 'De 6 W\'s gaan alleen over afnemers – zowel nu als later.',
    bron: 'slides', bronDetail: 'Tentamenvraag 6, slides week 2'
  },
  {
    id: 'w1-07', week: 1, onderwerp: 'Conjunctuur- en seizoensgevoeligheid',
    vraag: 'De vraag naar cabrio\'s is:',
    opties: [
      'Conjunctuurgevoelig',
      'Seizoengevoelig',
      'Zowel conjunctuur- als seizoengevoelig',
      'Niet conjunctuur- en seizoengevoelig'
    ],
    antwoord: 2,
    uitleg: 'Een cabrio is een duur luxeproduct: als de economie (bestedingen) slechter gaat, kopen mensen er minder van, dus conjunctuurgevoelig. Daarnaast kopen mensen een cabrio vooral voor mooi weer, dus ook seizoengevoelig. Alleen "seizoengevoelig" vergeet het conjunctuureffect. LET OP: de docent heeft voor deze vraag geen officiële antwoordsleutel gegeven.',
    hint: 'Is het een luxeproduct? En hangt het af van het weer/seizoen?',
    bron: 'slides', bronDetail: 'Tentamenvraag 7, slides week 2', onbevestigd: true
  }
);

/* --- Officiële oefenvragen (slides week 3: "Terugblik", stof week 1) --- */
QUESTIONS.push(
  {
    id: 'w1-08', week: 1, onderwerp: 'Vijfkrachtenmodel',
    vraag: 'Wat is het gevolg van een hoge concentratie van afnemers binnen het vijfkrachtenmodel van Porter?',
    opties: [
      'Afnemers hebben minder invloed op de verkoopprijs.',
      'Afnemers kunnen meer invloed uitoefenen op de prijs.',
      'Leveranciers krijgen meer onderhandelingsmacht.',
      'Nieuwe aanbieders kunnen gemakkelijker toetreden.'
    ],
    antwoord: 1,
    uitleg: 'De macht van afnemers is sterk als ze sterk geconcentreerd zijn (plus lage switching costs en weinig productdifferentiatie). Dan kunnen ze meer druk zetten op de prijs. "Leveranciers krijgen meer macht" is precies omgekeerd: geconcentreerde afnemers verzwakken de aanbieders.',
    hint: 'Wanneer is de macht van afnemers sterk?',
    bron: 'slides', bronDetail: 'Tentamenvraag 1, slides week 3'
  },
  {
    id: 'w1-09', week: 1, onderwerp: 'Productlevenscyclus',
    vraag: 'Welke strategie past het best bij een ondernemer in de introductiefase van de productlevenscyclus?',
    opties: [
      'De productie opschalen om aan de groeiende vraag te voldoen.',
      'De kosten per product verlagen door schaalvoordelen te benutten.',
      'Het product aanpassen om zich te onderscheiden in een snel groeiende markt.',
      'Investeren in naamsbekendheid en consumenten overtuigen om het nieuwe product te proberen.'
    ],
    antwoord: 3,
    uitleg: 'Introductie: "Krijg consumenten zover dat ze het product leren kennen en proberen. Zorg voor bekendheid en vertrouwen." Opschalen voor een groeiende vraag past bij de groeifase, want in de introductiefase is de vraag nog klein.',
    hint: 'Kennen consumenten het product in deze fase al?',
    bron: 'slides', bronDetail: 'Tentamenvraag 2, slides week 3'
  },
  {
    id: 'w1-10', week: 1, onderwerp: 'Vijfkrachtenmodel',
    vraag: 'Wanneer vergroten lage overstapkosten de onderhandelingsmacht van afnemers?',
    opties: [
      'Wanneer afnemers eenvoudig kunnen wisselen.',
      'Wanneer aanbieders moeilijk te vervangen zijn.',
      'Wanneer leveranciers weinig alternatieven hebben.',
      'Wanneer producten sterk van elkaar verschillen.'
    ],
    antwoord: 0,
    uitleg: 'Lage switching costs betekenen dat afnemers makkelijk naar een andere aanbieder kunnen gaan; dat geeft ze macht. "Producten verschillen sterk" werkt juist andersom: afnemers zijn sterk als er WEINIG productdifferentiatie is (veel alternatieven).',
    hint: 'Lage overstapkosten = makkelijk …',
    bron: 'slides', bronDetail: 'Tentamenvraag 3, slides week 3'
  },
  {
    id: 'w1-11', week: 1, onderwerp: '6 W\'s vs vijfkrachtenmodel',
    vraag: 'Een ondernemer wil onderzoeken waarom consumenten voor een bepaald merk sneakers kiezen. Welke analyse kan de ondernemer het best gebruiken?',
    opties: [
      'De 6 W\'s-analyse, om de invloed van leveranciers en concurrenten op de winstgevendheid te onderzoeken.',
      'De 6 W\'s-analyse, om de doelgroep, behoeften en het koopgedrag van consumenten in kaart te brengen.',
      'Het vijfkrachtenmodel, om onder andere de onderhandelingsmacht van afnemers te onderzoeken.',
      'Het vijfkrachtenmodel, om de behoeften en het koopgedrag van consumenten in kaart te brengen.'
    ],
    antwoord: 1,
    uitleg: '"Waarom kiezen consumenten …" is een vraag over afnemers: de 6 W\'s (Wie, Wat, Waar, Wanneer, Waarom wel, Waarom niet) brengen doelgroep, behoeften en koopgedrag in kaart. Het vijfkrachtenmodel kijkt naar de onderhandelingsmacht van afnemers als groep, niet naar hun koopmotieven.',
    hint: 'Gaat het om klanten of om de markt als geheel?',
    bron: 'slides', bronDetail: 'Tentamenvraag 4, slides week 3'
  },
  {
    id: 'w1-12', week: 1, onderwerp: 'Vijfkrachtenmodel',
    vraag: 'Een ondernemer wil een nieuwe supermarktketen starten. De bestaande landelijke ketens kopen op grote schaal in, hebben efficiënte distributienetwerken en kunnen daardoor tegen lagere kosten werken. De nieuwe onderneming heeft een veel kleiner inkoopvolume. Welke uitspraak verklaart het best waarom toetreding tot deze markt lastig kan zijn?',
    opties: [
      'De bestaande ketens hebben een sterke merkidentiteit, waardoor productdifferentiatie voor nieuwe aanbieders onmogelijk is.',
      'De bestaande ketens hebben veel afnemers, waardoor consumenten niet meer naar andere supermarkten kunnen overstappen.',
      'De bestaande ketens hebben een breed assortiment, waardoor nieuwe aanbieders geen eigen doelgroep kunnen bedienen.',
      'De bestaande ketens profiteren van schaalvoordelen, waardoor nieuwe aanbieders moeilijk dezelfde lage kosten kunnen realiseren.'
    ],
    antwoord: 3,
    uitleg: 'De casus noemt inkoop op grote schaal en efficiënte netwerken: dat zijn schaalvoordelen, een toetredingsdrempel. De andere opties zijn te absoluut ("onmogelijk", "niet meer kunnen") en worden in de casus niet genoemd.',
    hint: 'Welk woord uit de casus wijst op lagere kosten door grootte?',
    bron: 'slides', bronDetail: 'Tentamenvraag 5, slides week 3'
  }
);

/* --- Zelfgemaakte vragen week 1 --- */
QUESTIONS.push(
  {
    id: 'w1-13', week: 1, onderwerp: 'ABCD-analyse',
    vraag: 'Waar staan de letters van de ABCD-analyse voor?',
    opties: [
      'Afnemers, Bedrijfstak, Concurrenten, Distributie',
      'Afnemers, Branche, Conjunctuur, DESTEP',
      'Aanbieders, Bedrijfskolom, Concurrentie, Doelgroep',
      'Afnemers, Bedrijfstak, Conjunctuur, Distributie'
    ],
    antwoord: 0,
    uitleg: 'ABCD = Afnemers, Bedrijfstak, Concurrenten, Distributie. Samen geven ze een goed beeld van de externe omgeving waarin een onderneming opereert. Conjunctuur is geen letter van ABCD maar een marktfactor binnen de bedrijfstakanalyse.',
    hint: 'A = de klant, D = hoe het product bij de klant komt.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-14', week: 1, onderwerp: 'ABCD-analyse',
    vraag: 'Wat brengt de ABCD-analyse vooral in beeld?',
    opties: [
      'De sterke en zwakke punten binnen de eigen onderneming',
      'De externe omgeving waarin een onderneming opereert',
      'Alleen de macro-omgeving (DESTEP-factoren)',
      'De financiële resultaten van de onderneming'
    ],
    antwoord: 1,
    uitleg: 'Volgens de slides geeft de ABCD-analyse "een goed beeld van de externe omgeving waarin een onderneming opereert" (externe analyse). Interne sterktes en zwaktes horen bij een interne analyse, niet bij ABCD.',
    hint: 'Intern of extern?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-15', week: 1, onderwerp: '6 W\'s van Ferrell',
    vraag: 'Streetwearmerk NoordStoer onderzoekt waarom jongeren de nieuwe hoodie NIET kopen: ze vinden hem te duur en kennen het merk niet. Bij welke W van Ferrell hoort dit?',
    opties: ['Wat', 'Waarom (niet)', 'Wie', 'Waar'],
    antwoord: 1,
    uitleg: '"Waarom (niet)" gaat over de redenen waarom (potentiële) klanten het product niet kopen. "Wat" gaat over wát klanten kopen, niet over de redenen om af te haken.',
    hint: 'Het gaat om redenen om het product níet te kopen.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-16', week: 1, onderwerp: '6 W\'s van Ferrell',
    vraag: 'Een hard-seltzermerk wil weten of klanten vooral in de supermarkt, in de horeca of online kopen. Welke W van Ferrell is dit?',
    opties: ['Wanneer', 'Wie', 'Waar', 'Wat'],
    antwoord: 2,
    uitleg: '"Waar" gaat over de plek waar klanten kopen (supermarkt, horeca, online). "Wanneer" gaat over het moment (bijv. zomer, weekend), niet over de plek.',
    hint: 'Plaats of tijd?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-17', week: 1, onderwerp: '6 W\'s van Ferrell',
    vraag: 'Welke reeks bevat precies de zes W\'s van Ferrell?',
    opties: [
      'Wie, Wat, Waar, Wanneer, Waarom (wel), Waarom (niet)',
      'Wie, Wat, Waar, Wanneer, Waarom, Hoeveel',
      'Wie, Wat, Waar, Waarmee, Waarom (wel), Waarom (niet)',
      'Wie, Wat, Wanneer, Welke concurrent, Waarom (wel), Waarom (niet)'
    ],
    antwoord: 0,
    uitleg: 'De zes W\'s: Wie, Wat, Waar, Wanneer, Waarom (wel) en Waarom (niet). Let op: "Waarom" komt twee keer voor (wel en niet); concurrenten horen niet bij de afnemersanalyse.',
    hint: 'Waarom komt twee keer voor.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-18', week: 1, onderwerp: 'Bedrijfstakanalyse vs concurrentieanalyse',
    vraag: 'Volgens het schema op de slides wordt de concurrentieanalyse op twee niveaus uitgevoerd. Welke koppeling is juist?',
    opties: [
      'Macroniveau → concurrentie als geheel (mededinging) → bedrijfstakanalyse',
      'Macroniveau → afzonderlijke ondernemingen en merken → concurrentenanalyse',
      'Micro- en mesoniveau → concurrentie als geheel → bedrijfstakanalyse',
      'Micro- en mesoniveau → DESTEP-factoren → bedrijfstakanalyse'
    ],
    antwoord: 0,
    uitleg: 'Op macroniveau kijk je naar de mededinging: concurrentie als geheel → bedrijfstakanalyse ("Concurrentie (algemeen)"). Op micro- en mesoniveau kijk je naar de concurrenten als afzonderlijke ondernemingen en merken → concurrentenanalyse ("Concurrenten"). Optie 2 haalt die twee door elkaar.',
    hint: 'Concurrentie (algemeen) ↔ concurrenten.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-19', week: 1, onderwerp: 'Bedrijfstakanalyse vs concurrentieanalyse',
    vraag: 'Starter Bruisbar twijfelt of ze de hard-seltzermarkt wel moet betreden: is de markt aantrekkelijk en welke kansen en bedreigingen zijn er in de bedrijfstak? Welke analyse past hier het best?',
    opties: [
      'Concurrentenanalyse',
      'Bedrijfstakanalyse',
      'Afnemersanalyse met de 6 W\'s',
      'Distributieanalyse'
    ],
    antwoord: 1,
    uitleg: 'De bedrijfstakanalyse gaat over de aantrekkelijkheid van de markt en de kansen en bedreigingen in de bedrijfstak ("Toetreden ja of nee?"). De concurrentenanalyse zoomt in op afzonderlijke concurrenten en hun sterke en zwakke punten, niet op de hele markt.',
    hint: '"Toetreden ja of nee?"',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-20', week: 1, onderwerp: 'Bedrijfstakanalyse',
    vraag: 'Welke drie groepen factoren onderzoek je in de bedrijfstakanalyse?',
    opties: [
      'Afnemersfactoren, concurrentiefactoren en distributiefactoren',
      'Macro-omgevingsfactoren, marktfactoren en bedrijfstakstructuurfactoren',
      'Structuur, gedrag en resultaat',
      'Interne factoren, externe factoren en toevalsfactoren'
    ],
    antwoord: 1,
    uitleg: 'De bedrijfstakanalyse bestaat uit: 1) macro-omgevingsfactoren (DESTEP), 2) marktfactoren (marktomvang, marktgroei/PLC, conjunctuur- en seizoensgevoeligheid) en 3) bedrijfstakstructuurfactoren (winstgevendheid en de vijf krachten). Structuur–gedrag–resultaat is het SGR-model uit week 4.',
    hint: 'Factor 1 is DESTEP, factor 3 bevat het vijfkrachtenmodel.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-21', week: 1, onderwerp: 'DESTEP',
    vraag: 'De overheid verhoogt per 1 januari de accijns op bier. Onder welke DESTEP-factor valt dit?',
    opties: ['Economisch', 'Sociaal-cultureel', 'Politiek-juridisch', 'Ecologisch'],
    antwoord: 2,
    uitleg: 'Een maatregel van de overheid (belasting, wetgeving) valt onder Politiek(-juridisch). De accijns heeft wel economische gevolgen, maar de oorzaak is een overheidsbesluit; daarom is "Economisch" niet het beste antwoord.',
    hint: 'Wie neemt dit besluit?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-22', week: 1, onderwerp: 'DESTEP',
    vraag: 'Steeds minder jongeren drinken alcohol: in 2003 had 84% van de 12- tot 16-jarigen ooit alcohol gedronken, twintig jaar later was dat 40%. Welke DESTEP-factor is dit vooral?',
    opties: ['Demografisch', 'Sociaal-cultureel', 'Technologisch', 'Economisch'],
    antwoord: 1,
    uitleg: 'Een verandering in gedrag, normen en gewoontes (bewuster drinken) is sociaal-cultureel. Demografisch gaat over de samenstelling van de bevolking (aantallen, leeftijd), niet over veranderd gedrag.',
    hint: 'Verandert de bevolkingsopbouw of het gedrag?',
    bron: 'zelfgemaakt'
  }
);

QUESTIONS.push(
  {
    id: 'w1-23', week: 1, onderwerp: 'Marktomvang en deelmarkten',
    vraag: 'De totale bierconsumptie in Nederland daalt al jaren, maar speciaalbier en alcoholvrij bier zitten al tien jaar in de lift. Hoe noem je "speciaalbier" ten opzichte van "bier" in de bedrijfstakanalyse?',
    opties: ['Een substituut', 'Een deelmarkt', 'Een strategische groep', 'Een bedrijfskolom'],
    antwoord: 1,
    uitleg: 'Bier is de totale markt; speciaalbier en alcoholvrij bier zijn deelmarkten daarbinnen. Een deelmarkt kan groeien terwijl de totale markt krimpt. Een substituut is een ánder product dat dezelfde behoefte vervult (bijv. wijn of cocktails), geen onderdeel van dezelfde markt.',
    hint: 'Totale markt ↔ …',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-24', week: 1, onderwerp: 'Marktaandeel berekenen',
    vraag: 'De totale omzet in de Nederlandse markt voor hard seltzer is € 40 miljoen. Merk Bruisbar heeft een omzet van € 6 miljoen. Wat is het marktaandeel van Bruisbar?',
    opties: ['6,7%', '15%', '34%', '40%'],
    antwoord: 1,
    uitleg: 'Marktaandeel = eigen omzet / totale marktomzet × 100% = 6 / 40 × 100% = 15%. 6,7% krijg je als je de deling omdraait en door 100 deelt (40/6 ≈ 6,7) – dat is fout.',
    hint: 'Eigen omzet gedeeld door de totale markt.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-25', week: 1, onderwerp: 'Marktaandeel berekenen',
    vraag: 'In een markt van 2 miljoen verkochte blikjes energiedrank per maand verkoopt merk Volt er 500.000. Concurrent Spark heeft een marktaandeel van 30%. Hoeveel blikjes verkoopt Spark meer dan Volt?',
    opties: ['50.000', '100.000', '150.000', '600.000'],
    antwoord: 1,
    uitleg: 'Spark: 30% van 2.000.000 = 600.000 blikjes. Volt: 500.000. Verschil = 100.000. 600.000 is het aantal van Spark zelf, niet het verschil.',
    hint: 'Reken eerst het aantal van Spark uit.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-26', week: 1, onderwerp: 'Productlevenscyclus',
    vraag: 'Wat is de juiste volgorde van de fasen van de productlevenscyclus?',
    opties: [
      'Introductie – groei – verzadiging – volwassenheid – teruggang',
      'Introductie – groei – volwassenheid – verzadiging – teruggang',
      'Groei – introductie – volwassenheid – verzadiging – teruggang',
      'Introductie – volwassenheid – groei – verzadiging – teruggang'
    ],
    antwoord: 1,
    uitleg: 'De vijf fasen zijn: introductie, groei, volwassenheid, verzadiging en teruggang. Volwassenheid komt vóór verzadiging: eerst wordt de groei minder (volwassen), daarna is de markt verzadigd.',
    hint: 'Vijf fasen; "volwassen" komt vóór "verzadigd".',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-27', week: 1, onderwerp: 'Productlevenscyclus',
    vraag: 'Tien jaar geleden had niemand ervan gehoord, nu zijn hard seltzers niet meer weg te denken uit het supermarktschap. Het aantal verkochte liters steeg vorig jaar met 120%. Welke actie past volgens de slides het best bij deze fase?',
    opties: [
      'Vernieuw (lanceer een opvolger) of bouw gecontroleerd af.',
      'Benut de groei en bouw je marktpositie op (bijv. door klantenbinding) voordat concurrenten dat doen.',
      'Verdedig je positie en onderscheid je van concurrenten.',
      'Zoek nieuwe mogelijkheden om de levenscyclus te verlengen (innovatie).'
    ],
    antwoord: 1,
    uitleg: 'Een sterk stijgende afzet (+120%) past bij de groeifase: benut de groei en bouw je marktpositie (bijv. klantenbinding) voordat concurrenten dat doen. "Verdedig je positie" hoort bij volwassenheid, als de groei afvlakt.',
    hint: 'Hoe snel groeit de afzet?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-28', week: 1, onderwerp: 'Productlevenscyclus',
    vraag: 'Bijna niemand koopt nog dvd\'s; de afzet daalt elk jaar. Wat kan een producent van dvd-spelers volgens de slides het best doen?',
    opties: [
      'Investeren in naamsbekendheid zodat consumenten het product leren kennen.',
      'Benut de groei en bouw je marktpositie op.',
      'Vernieuwen (een opvolger lanceren) of gecontroleerd afbouwen.',
      'Marktaandeel van concurrenten afpakken om de levenscyclus te verlengen.'
    ],
    antwoord: 2,
    uitleg: 'Een dalende afzet past bij de teruggangsfase: vernieuw (lanceer een opvolger) of bouw gecontroleerd af. Marktaandeel afpakken en de levenscyclus verlengen hoort bij de verzadigingsfase, als de markt nog niet krimpt.',
    hint: 'Dalende afzet = laatste fase.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-29', week: 1, onderwerp: 'Productlevenscyclus',
    vraag: 'Bijna iedereen heeft al draadloze oordopjes; de markt groeit nauwelijks nog. Een fabrikant brengt een nieuwe versie met extra functies uit en probeert klanten van concurrenten over te halen. In welke fase zit het product volgens de omschrijving op de slides?',
    opties: ['Groei', 'Introductie', 'Verzadiging', 'Teruggang'],
    antwoord: 2,
    uitleg: 'Verzadiging: "Zoek nieuwe mogelijkheden om de levenscyclus te verlengen (innovatie) en probeer marktaandeel van concurrenten af te pakken en klanten aan je te binden." De markt groeit niet meer, dus groei kan niet; de afzet daalt nog niet, dus het is ook geen teruggang.',
    hint: 'Markt groeit niet meer, maar daalt ook (nog) niet.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-30', week: 1, onderwerp: 'Conjunctuur- en seizoensgevoeligheid',
    vraag: 'De verkoop van luxe buitenbarbecues van € 2.471 daalt sterk zodra het economisch slechter gaat. Hoe noem je deze vraag?',
    opties: ['Seizoengevoelig', 'Conjunctuurgevoelig', 'Niet conjunctuurgevoelig', 'Trendgevoelig'],
    antwoord: 1,
    uitleg: 'Conjunctuurgevoelig betekent dat de vraag meebeweegt met de bestedingen in de economie (de golf rond de trendlijn). Seizoengevoelig gaat over de tijd van het jaar, niet over de economie.',
    hint: 'Hangt het af van de economie of van de tijd van het jaar?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-31', week: 1, onderwerp: 'Conjunctuur- en seizoensgevoeligheid',
    vraag: 'Welk product is het duidelijkst seizoengevoelig, maar nauwelijks conjunctuurgevoelig?',
    opties: [
      'Kruidnoten',
      'Een nieuwe auto',
      'Een verre vliegreis',
      'Een luxe horloge'
    ],
    antwoord: 0,
    uitleg: 'Kruidnoten worden vooral rond Sinterklaas verkocht (seizoen) en zijn goedkoop, dus mensen blijven ze ook kopen als het economisch slechter gaat. Een auto, verre reis of luxe horloge zijn dure aankopen die mensen uitstellen in slechte tijden: die zijn conjunctuurgevoelig.',
    hint: 'Welk product is goedkoop maar hoort bij één periode van het jaar?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-32', week: 1, onderwerp: 'Winstgevendheid',
    vraag: 'Onder welke groep factoren valt "winstgevendheid" in de bedrijfstakanalyse?',
    opties: ['Macro-omgevingsfactoren', 'Marktfactoren', 'Bedrijfstakstructuurfactoren', 'Afnemersfactoren'],
    antwoord: 2,
    uitleg: 'Winstgevendheid staat bij de bedrijfstakstructuurfactoren, samen met de vijf krachten van Porter. De marktfactoren zijn marktomvang, marktgroei/fase in de PLC en conjunctuur- en seizoensgevoeligheid.',
    hint: 'Het staat in hetzelfde rijtje als het vijfkrachtenmodel.',
    bron: 'zelfgemaakt'
  }
);

QUESTIONS.push(
  {
    id: 'w1-33', week: 1, onderwerp: 'Vijfkrachtenmodel',
    vraag: 'Welke vijf krachten onderscheidt Porter in het vijfkrachtenmodel?',
    opties: [
      'Dreiging van potentiële toetreders, onderhandelingsmacht van leveranciers, onderhandelingsmacht van afnemers, dreiging van substituutproducten, concurrentie tussen bestaande aanbieders',
      'Dreiging van potentiële toetreders, onderhandelingsmacht van leveranciers, onderhandelingsmacht van afnemers, dreiging van substituutproducten, invloed van de overheid',
      'Afnemers, bedrijfstak, concurrenten, distributie, leveranciers',
      'Onderhandelingsmacht van leveranciers, onderhandelingsmacht van afnemers, conjunctuur, dreiging van substituutproducten, concurrentie tussen bestaande aanbieders'
    ],
    antwoord: 0,
    uitleg: 'De vijf krachten: dreiging van potentiële toetreders, onderhandelingsmacht van leveranciers, onderhandelingsmacht van afnemers, dreiging van substituutproducten en (in het midden) de concurrentie tussen bestaande aanbieders. De overheid is géén aparte kracht in het model.',
    hint: 'In het midden van het model staan de bestaande aanbieders.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-34', week: 1, onderwerp: 'Vijfkrachtenmodel',
    vraag: 'Een kleine fabrikant van vliegtuigonderdelen kan maar bij twee bedrijven ter wereld een speciale legering kopen. Overstappen kost maanden aan tests. Welke kracht is hier sterk?',
    opties: [
      'De onderhandelingsmacht van afnemers',
      'De onderhandelingsmacht van leveranciers',
      'De dreiging van substituutproducten',
      'De dreiging van potentiële toetreders'
    ],
    antwoord: 1,
    uitleg: 'De macht van leveranciers is sterk als ze sterk geconcentreerd zijn (maar twee), de switching costs hoog zijn (maanden testen) en er weinig alternatieven zijn. De fabrikant is hier zelf de afnemer, maar die heeft juist weinig macht.',
    hint: 'Wie levert hier aan wie?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-35', week: 1, onderwerp: 'Vijfkrachtenmodel',
    vraag: 'Welke situatie maakt de dreiging van potentiële toetreders het GROOTST?',
    opties: [
      'Bestaande aanbieders hebben grote schaalvoordelen.',
      'Er is weinig productdifferentiatie en nieuwkomers komen makkelijk in de distributiekanalen.',
      'Afnemers hebben hoge overstapkosten.',
      'Bestaande aanbieders geven heel veel uit aan communicatie en reclame.'
    ],
    antwoord: 1,
    uitleg: 'Toetredingsdrempels zijn laag bij: afwezigheid van schaalvoordelen, beperkte communicatie-intensiteit, weinig productdifferentiatie en gemakkelijke toegang tot distributiekanalen. Grote schaalvoordelen en veel reclame-uitgaven maken toetreden juist moeilijker.',
    hint: 'Zoek de optie met lage toetredingsdrempels.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-36', week: 1, onderwerp: 'Vijfkrachtenmodel',
    vraag: 'Een energiedrankmerk merkt dat studenten in de tentamenweek steeds vaker voor koffie kiezen in plaats van energiedrank. Welke kracht uit het vijfkrachtenmodel speelt hier?',
    opties: [
      'Concurrentie tussen bestaande aanbieders',
      'Onderhandelingsmacht van afnemers',
      'Dreiging van substituutproducten',
      'Dreiging van potentiële toetreders'
    ],
    antwoord: 2,
    uitleg: 'Koffie is een ander product dat dezelfde behoefte vervult (wakker blijven): een substituut (slides: koffie vs energy drinks). Concurrentie tussen bestaande aanbieders gaat over andere aanbieders van hetzelfde product, zoals een ander energiedrankmerk.',
    hint: 'Ander product, zelfde behoefte.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-37', week: 1, onderwerp: 'Vijfkrachtenmodel',
    vraag: 'Waardoor wordt de concurrentie tussen bestaande aanbieders volgens de slides NIET bepaald?',
    opties: [
      'Het aantal aanbieders',
      'De mate van productdifferentiatie',
      'De concentratiegraad van de aanbieders',
      'De seizoensgevoeligheid van het product'
    ],
    antwoord: 3,
    uitleg: 'De concurrentie wordt bepaald door: het aantal aanbieders, de mate van productdifferentiatie, de concentratiegraad van de aanbieders en de samenwerking binnen een markt. Seizoensgevoeligheid is een marktfactor, geen bepalende factor voor de concurrentie-intensiteit.',
    hint: 'Eén optie hoort bij de marktfactoren.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-38', week: 1, onderwerp: 'Vijfkrachtenmodel',
    vraag: 'Een fabrikant van tv\'s verkoopt bijna alles via drie grote elektronicaketens. De tv\'s lijken sterk op die van concurrenten en de ketens kunnen makkelijk een ander merk in de schappen zetten. Wat betekent dit voor de fabrikant?',
    opties: [
      'De onderhandelingsmacht van de afnemers (de ketens) is sterk.',
      'De onderhandelingsmacht van de leveranciers is sterk.',
      'De dreiging van potentiële toetreders is klein.',
      'De dreiging van substituten is groot.'
    ],
    antwoord: 0,
    uitleg: 'De ketens zijn hier de afnemers. Hun macht is sterk: ze zijn sterk geconcentreerd (drie ketens), hebben lage switching costs en er is weinig productdifferentiatie. De fabrikant is zelf de leverancier, en die heeft hier juist weinig macht.',
    hint: 'De ketens kopen de tv\'s in – welke rol hebben ze?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-39', week: 1, onderwerp: 'Bedrijfstakanalyse',
    vraag: 'In de bedrijfstakanalyse van de hard-seltzermarkt scoort "marktomvang" hoog (positief) en "concurrentie" ook hoog (negatief). Met welke methode kom je dan tot één conclusie over de aantrekkelijkheid van de markt?',
    opties: [
      'De gewogen factorscoremethode',
      'De 6 W\'s van Ferrell',
      'Het berekenen van de Cn-ratio',
      'Positioneringsonderzoek'
    ],
    antwoord: 0,
    uitleg: 'Met de gewogen factorscoremethode weeg je de belangrijkste factoren en bereken je een totale score; een hoge score op de ene factor kan een lage score op een andere compenseren. De Cn-ratio meet alleen de concentratie (week 4) en geeft geen totaaloordeel over de markt.',
    hint: 'Factoren wegen en optellen tot een totaalscore.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w1-40', week: 1, onderwerp: 'Bedrijfstakanalyse',
    vraag: 'Bij stap 2 van de bedrijfstakanalyse breng je kansen en bedreigingen in kaart. Welke van deze punten is voor een nieuw hard-seltzermerk een BEDREIGING?',
    opties: [
      'Groeiende vraag naar gezonde alcoholopties',
      'Trend naar low-calorie',
      'Veranderende regels rond alcoholreclame',
      'Nieuwe smaken en innovaties zijn mogelijk'
    ],
    antwoord: 2,
    uitleg: 'Op de slides staan als bedreigingen: veel concurrentie (o.a. grote merken), makkelijke toetreding voor nieuwe spelers en veranderende regels rond alcoholreclame. De andere drie zijn juist kansen.',
    hint: 'Welke ontwikkeling maakt het moeilijker om te verkopen?',
    bron: 'zelfgemaakt'
  }
);

/* ============================================================
 * WEEK 2 – Concurrentieanalyse en distributieanalyse (12 okt)
 * ============================================================ */

/* --- Officiële oefenvragen (slides week 3: "Terugblik", stof week 2) --- */
QUESTIONS.push(
  {
    id: 'w2-01', week: 2, onderwerp: 'Identificatiemethoden',
    vraag: 'Wat is het grootste risico van het gebruik van concurrentiegeoriënteerde methoden voor concurrentieanalyse?',
    opties: [
      'Ze bieden te veel informatie over indirecte concurrenten die niet van cruciaal belang zijn.',
      'Ze leiden vaak tot korte termijnanalyses van de markt.',
      'Ze vereisen intensief onderzoek naar consumentengedrag.',
      'Ze kunnen leiden tot verkeerde inschattingen door verschillen in perceptie.'
    ],
    antwoord: 3,
    uitleg: 'Bij concurrentiegeoriënteerde methoden (managementoordeel, strategische groepen) bepaalt het bedrijf zelf wie de concurrenten zijn. Het management kan dat anders zien dan de klant: verkeerde inschatting door verschil in perceptie. "Intensief onderzoek naar consumentengedrag" hoort juist bij afnemersgeoriënteerde methoden.',
    hint: 'Wie bepaalt bij deze methode wie de concurrent is: het bedrijf of de klant?',
    bron: 'slides', bronDetail: 'Tentamenvraag 6, slides week 3'
  },
  {
    id: 'w2-02', week: 2, onderwerp: 'Concurrentieniveaus',
    vraag: 'PureWater introduceert een nieuw mineraalwater met toegevoegde vitamines. Bij de concurrentieanalyse kijkt PureWater naast traditionele mineraalwaters ook naar kokoswater, gearomatiseerd water en sportdranken, die ook de behoefte aan hydratatie en gezondheid vervullen. Welke vorm van concurrentie is van toepassing wanneer PureWater zich met deze andere dranken vergelijkt?',
    opties: [
      'Productvormconcurrentie',
      'Productcategorieconcurrentie',
      'Generieke concurrentie',
      'Budgetconcurrentie'
    ],
    antwoord: 1,
    uitleg: 'Kokoswater, gearomatiseerd water en sportdranken zijn andere soorten dranken binnen dezelfde productcategorie (gezonde, verfrissende dranken) – vergelijk Red Bull vs Coca-Cola. Productvormconcurrentie zou alleen ander mineraalwater met vitamines zijn (vergelijk Red Bull vs Monster).',
    hint: 'Zelfde soort product (drank), maar een andere vorm.',
    bron: 'slides', bronDetail: 'Tentamenvraag 7, slides week 3'
  },
  {
    id: 'w2-03', week: 2, onderwerp: 'Keuze belangrijkste concurrenten',
    vraag: 'Na het identificeren van concurrenten besluit een manager om prioriteiten te stellen voor verdere analyse. Welke concurrenten krijgen meestal voorrang in deze vervolganalyse?',
    opties: [
      'Concurrenten met een groeiend marktaandeel en een afwijkend product.',
      'Concurrenten met een groot marktaandeel en een vergelijkbaar product of doelgroep.',
      'Concurrenten met een toenemend marktaandeel, ongeacht de gelijkenis met het eigen product.',
      'Concurrenten met een laag marktaandeel en een vergelijkbaar product.'
    ],
    antwoord: 1,
    uitleg: 'Bij de keuze van de belangrijkste concurrenten kijk je naar het marktaandeel én naar de vergelijking met het eigen product. Een groot marktaandeel met een vergelijkbaar product/doelgroep is de grootste bedreiging. "Ongeacht de gelijkenis" negeert het tweede criterium.',
    hint: 'Twee criteria: marktaandeel en t.o.v. eigen product.',
    bron: 'slides', bronDetail: 'Tentamenvraag 8, slides week 3'
  },
  {
    id: 'w2-04', week: 2, onderwerp: 'Lengte vs breedte',
    vraag: 'Welke van de volgende beschrijvingen verwijst naar de lengte van een distributiekanaal?',
    opties: [
      'Het aantal typen tussenschakels binnen één niveau, zoals het onderscheid tussen supermarkten en speciaalzaken.',
      'Het aantal niveaus in de distributiekolom tussen producent en consument, zoals directe versus indirecte levering.',
      'Het onderscheid tussen directe en indirecte concurrenten binnen dezelfde markt.',
      'Het aantal klanten dat via een distributiekanaal bereikt kan worden.'
    ],
    antwoord: 1,
    uitleg: 'Lengte = het aantal niveaus in de distributiekolom. Breedte = het type tussenschakels binnen één niveau (bijv. supermarkt, drogist, warenhuis). Optie 1 beschrijft dus de breedte, niet de lengte.',
    hint: 'Lengte = hoeveel schakels achter elkaar.',
    bron: 'slides', bronDetail: 'Tentamenvraag 9, slides week 3'
  },
  {
    id: 'w2-05', week: 2, onderwerp: 'Distributie-intensiteit',
    vraag: 'Een parfummerk besluit zijn nieuwe collectie alleen te verkopen via enkele high-end boetieks in de grootste steden ter wereld, om exclusiviteit te behouden en het merk een premium imago te geven. Welke vorm van distributie-intensiteit past dit merk toe?',
    opties: [
      'Intensieve distributie',
      'Selectieve distributie',
      'Exclusieve distributie',
      'Directe distributie'
    ],
    antwoord: 2,
    uitleg: 'Heel weinig, zorgvuldig gekozen verkooppunten voor een premium imago = exclusieve distributie (zoals Rolex). Selectieve distributie heeft meer verkooppunten die aan eisen moeten voldoen (zoals Apple Authorized Resellers). "Directe distributie" gaat over de lengte van het kanaal, niet over de intensiteit.',
    hint: 'Denk aan het Rolex-voorbeeld.',
    bron: 'slides', bronDetail: 'Tentamenvraag 10, slides week 3'
  }
);

/* --- Zelfgemaakte vragen week 2 --- */
QUESTIONS.push(
  {
    id: 'w2-06', week: 2, onderwerp: 'Concurrentie vs concurrenten',
    vraag: 'Wat is het verschil tussen "concurrentie (algemeen)" en "concurrenten"?',
    opties: [
      'Concurrentie (algemeen) gaat over de mededinging als geheel (bedrijfstakanalyse); concurrenten zijn de afzonderlijke ondernemingen en merken (concurrentenanalyse).',
      'Concurrentie (algemeen) gaat over afzonderlijke merken; concurrenten gaan over de hele bedrijfstak.',
      'Concurrentie (algemeen) hoort bij de afnemersanalyse; concurrenten horen bij de distributieanalyse.',
      'Er is geen verschil: beide woorden betekenen hetzelfde.'
    ],
    antwoord: 0,
    uitleg: 'Concurrentie (algemeen) = de concurrentie als geheel op macroniveau, onderzocht in de bedrijfstakanalyse. Concurrenten = afzonderlijke ondernemingen en merken op micro- en mesoniveau, onderzocht in de concurrentenanalyse. Optie 2 draait dit precies om.',
    hint: 'Macroniveau ↔ micro/mesoniveau.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-07', week: 2, onderwerp: 'Concurrentieanalyse',
    vraag: 'Wat zijn volgens de slides de twee doelen van de concurrentieanalyse?',
    opties: [
      'Inzicht krijgen in de sterke en zwakke punten van concurrenten en in hun toekomstige gedrag.',
      'De aantrekkelijkheid van de markt bepalen en beslissen over toetreding.',
      'De koopmotieven van klanten en hun koopmoment in kaart brengen.',
      'Het aantal niveaus en het type tussenschakels in het distributiekanaal bepalen.'
    ],
    antwoord: 0,
    uitleg: 'De concurrentieanalyse is bedoeld om inzicht te krijgen in de sterke en zwakke punten van concurrenten (ten opzichte van jezelf) en in hun toekomstige gedrag. De aantrekkelijkheid van de markt bepalen is het doel van de bedrijfstakanalyse.',
    hint: 'Het gaat om de concurrenten zelf: nu en later.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-08', week: 2, onderwerp: 'Rivaal- vs partnerbenadering',
    vraag: 'Twee autofabrikanten die op de markt concurreren, laten één bestelbus samen ontwikkelen en bouwen om kosten te besparen en schaalvoordeel te behalen. Welke benadering van concurrenten is dit?',
    opties: [
      'Rivaalbenadering',
      'Partnerbenadering',
      'Budgetconcurrentie',
      'Concurrentiegeoriënteerde identificatie'
    ],
    antwoord: 1,
    uitleg: 'Bij de partnerbenadering werk je samen met een concurrent voor een win-winsituatie (slides: VW liet Ford zijn bestelbus bouwen). Bij de rivaalbenadering zie je de concurrent als tegenstander die je wilt verslaan (slides: Samsung die Apple bespot).',
    hint: 'Win-win of touwtrekken?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-09', week: 2, onderwerp: 'Rivaal- vs partnerbenadering',
    vraag: 'Smartphonemerk Zonix plaatst een reeks spottende berichten op sociale media over de nieuwe telefoon van concurrent Pear. Welke benadering van concurrentie past hierbij?',
    opties: ['Partnerbenadering', 'Rivaalbenadering', 'Generieke concurrentie', 'Multi-channel'],
    antwoord: 1,
    uitleg: 'Zonix ziet Pear als tegenstander die verslagen moet worden: rivaalbenadering (vergelijk Samsung die Apple bespot). Bij de partnerbenadering zou Zonix juist samenwerken met Pear.',
    hint: 'Samenwerken of aanvallen?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-10', week: 2, onderwerp: 'Stappenplan concurrentieanalyse',
    vraag: 'Wat is de eerste stap van de concurrentieanalyse (na de marktdefinitie)?',
    opties: [
      'Verwachte strategieën van concurrenten',
      'Identificatie en keuze van concurrenten',
      'Doelstellingen van concurrenten',
      'Eigen relatieve sterktes en zwaktes'
    ],
    antwoord: 1,
    uitleg: 'Stap 1 is de identificatie en keuze van concurrenten. Daarna volgen doelstellingen (2), huidige strategieën (3), succesbepalende factoren en sterktes/zwaktes (4) en ten slotte de verwachte strategieën (5). Je kunt geen doelstellingen analyseren voordat je weet wie je concurrenten zijn.',
    hint: 'Eerst weten wie, dan pas wat ze doen.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-11', week: 2, onderwerp: 'Stappenplan concurrentieanalyse',
    vraag: 'Welke stap van de concurrentieanalyse volgt uit de doelstellingen, de huidige strategieën en de sterktes en zwaktes van concurrenten?',
    opties: [
      'Identificatie en keuze van concurrenten',
      'Marktdefinitie',
      'Verwachte strategieën van concurrenten',
      'Interne analyse'
    ],
    antwoord: 2,
    uitleg: 'Stap 5, de verwachte strategieën van concurrenten, bouwt voort op stap 2 (doelstellingen), 3 (huidige strategieën) en 4 (succesbepalende factoren en sterktes/zwaktes). Marktdefinitie en interne analyse zijn volgens het schema fasen uit het planningsproces, geen stappen van de concurrentieanalyse zelf.',
    hint: 'Het is de laatste stap van het stappenplan.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-12', week: 2, onderwerp: 'Concurrentieniveaus',
    vraag: 'Voor Red Bull is Monster Energy een concurrent op welk niveau?',
    opties: [
      'Productvormconcurrentie',
      'Productcategorieconcurrentie',
      'Generieke concurrentie',
      'Budgetconcurrentie'
    ],
    antwoord: 0,
    uitleg: 'Monster is precies hetzelfde soort product (energiedrank): productvormconcurrentie, het binnenste en smalste niveau. Coca-Cola zou productcategorieconcurrentie zijn (andere frisdrank).',
    hint: 'Hetzelfde soort product.',
    bron: 'zelfgemaakt'
  }
);

QUESTIONS.push(
  {
    id: 'w2-13', week: 2, onderwerp: 'Concurrentieniveaus',
    vraag: 'Bioscoopketen FilmFabriek merkt dat jongeren hun zakgeld steeds vaker aan een festivalticket of nieuwe sneakers uitgeven in plaats van aan de bioscoop. Welk concurrentieniveau is dit?',
    opties: ['Productvormconcurrentie', 'Productcategorieconcurrentie', 'Generieke concurrentie', 'Budgetconcurrentie'],
    antwoord: 3,
    uitleg: 'Festivaltickets en sneakers vervullen een heel andere behoefte, maar strijden om hetzelfde geld: "Je kunt je geld maar één keer uitgeven" = budgetconcurrentie (vergelijk Red Bull vs hamburger). Bij generieke concurrentie vervult het andere product dezelfde behoefte (bijv. thuis streamen als avondje ontspanning).',
    hint: 'Is het dezelfde behoefte, of alleen hetzelfde geld?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-14', week: 2, onderwerp: 'Concurrentieniveaus',
    vraag: 'Een student die \'s ochtends wakker wil worden, kiest tussen een blikje energiedrank en een kop koffie. Welk concurrentieniveau is er tussen energiedrank en koffie?',
    opties: ['Productvormconcurrentie', 'Productcategorieconcurrentie', 'Generieke concurrentie', 'Budgetconcurrentie'],
    antwoord: 2,
    uitleg: 'Koffie is een ander soort product dat dezelfde behoefte vervult (energie/wakker worden): generieke concurrentie (slides: Red Bull vs koffie). Budgetconcurrentie gaat om producten die een heel andere behoefte vervullen, maar om hetzelfde budget strijden.',
    hint: 'Andere productsoort, dezelfde behoefte.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-15', week: 2, onderwerp: 'Concurrentieniveaus',
    vraag: 'Welke volgorde van de concurrentieniveaus loopt van SMAL (meest directe concurrenten) naar BREED?',
    opties: [
      'Budget – generiek – productcategorie – productvorm',
      'Productvorm – productcategorie – generiek – budget',
      'Productcategorie – productvorm – generiek – budget',
      'Productvorm – generiek – productcategorie – budget'
    ],
    antwoord: 1,
    uitleg: 'Van binnen naar buiten: productvorm (zelfde product), productcategorie (zelfde soort product), generiek (zelfde behoefte) en budget (zelfde geld). Optie 1 is dezelfde rij, maar van breed naar smal.',
    hint: 'Begin bij de concurrent die het meest op jou lijkt.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-16', week: 2, onderwerp: 'Concurrentieniveaus',
    vraag: 'Volgens het schema "Wie zit er in mijn markt?" hoort bij het ondernemingsniveau een lange planningstermijn en een brede marktdefinitie. Naar welke concurrentieniveaus kijk je dan?',
    opties: [
      'Productvormconcurrentie',
      'Productcategorie- en productvormconcurrentie',
      'Productcategorieconcurrentie',
      'Generieke en budgetconcurrentie'
    ],
    antwoord: 3,
    uitleg: 'Ondernemingsniveau → lange termijn → brede marktdefinitie → generieke en budgetconcurrentie. Het productniveau (korte termijn, enge marktdefinitie) kijkt naar productcategorie- en productvormconcurrentie.',
    hint: 'Brede marktdefinitie = brede concurrentieniveaus.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-17', week: 2, onderwerp: 'Identificatiemethoden',
    vraag: 'Welke methode om concurrenten te identificeren is concurrentiegeoriënteerd?',
    opties: [
      'Merkwisselingen',
      'Direct identificatieonderzoek bij afnemers',
      'Strategische groepen',
      'Positioneringsonderzoek'
    ],
    antwoord: 2,
    uitleg: 'Concurrentiegeoriënteerde methoden: managementoordeel en strategische groepen. Afnemersgeoriënteerde methoden: direct identificatieonderzoek bij afnemers, merkwisselingen en positioneringsonderzoek.',
    hint: 'Twee methoden zijn concurrentiegeoriënteerd, drie afnemersgeoriënteerd.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-18', week: 2, onderwerp: 'Identificatiemethoden',
    vraag: 'Supermarktketen Versa onderzoekt via kassadata naar welk ander merk klanten overstappen als hun vaste merk pindakaas niet op voorraad is. Welke methode gebruikt Versa?',
    opties: [
      'Managementoordeel (concurrentiegeoriënteerd)',
      'Strategische groepen (concurrentiegeoriënteerd)',
      'Merkwisselingen (afnemersgeoriënteerd)',
      'Positioneringsonderzoek (afnemersgeoriënteerd)'
    ],
    antwoord: 2,
    uitleg: 'Kijken naar welk merk klanten wisselen = merkwisselingen, een afnemersgeoriënteerde methode: het gedrag van de klant bepaalt wie de concurrent is. Positioneringsonderzoek kijkt naar hoe klanten merken zien ten opzichte van elkaar (bijv. een kaart met prijs en kwaliteit), niet naar wisselgedrag.',
    hint: 'Klanten stappen over naar een ander merk.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-19', week: 2, onderwerp: 'Identificatiemethoden',
    vraag: 'Het directieteam van luchtvaartmaatschappij SkyLine gaat in een vergadering zelf op basis van ervaring na wie hun belangrijkste concurrenten zijn. Welke methode is dit?',
    opties: [
      'Direct identificatieonderzoek bij afnemers',
      'Managementoordeel',
      'Merkwisselingen',
      'Positioneringsonderzoek'
    ],
    antwoord: 1,
    uitleg: 'Het management bepaalt zelf wie de concurrenten zijn: managementoordeel (concurrentiegeoriënteerd). Bij direct identificatieonderzoek bij afnemers vraag je het juist aan de klanten.',
    hint: 'Wie beslist hier: de klant of het bedrijf zelf?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-20', week: 2, onderwerp: 'Identificatiemethoden',
    vraag: 'Wat is het belangrijkste verschil tussen concurrentiegeoriënteerde en afnemersgeoriënteerde identificatiemethoden?',
    opties: [
      'Bij concurrentiegeoriënteerde methoden kijkt het bedrijf zelf naar de concurrenten; bij afnemersgeoriënteerde methoden bepaalt de waarneming of het gedrag van de afnemer wie de concurrent is.',
      'Concurrentiegeoriënteerde methoden gaan over leveranciers; afnemersgeoriënteerde methoden over klanten.',
      'Concurrentiegeoriënteerde methoden gebruik je alleen bij budgetconcurrentie.',
      'Afnemersgeoriënteerde methoden zijn managementoordeel en strategische groepen.'
    ],
    antwoord: 0,
    uitleg: 'Concurrentiegeoriënteerd (managementoordeel, strategische groepen): het bedrijf kijkt zelf. Afnemersgeoriënteerd (identificatieonderzoek, merkwisselingen, positioneringsonderzoek): de afnemer is het uitgangspunt. Daarom is het risico van concurrentiegeoriënteerde methoden een verkeerde inschatting door verschil in perceptie. Optie 4 noemt de concurrentiegeoriënteerde methoden.',
    hint: 'Vanuit wiens blik kijk je?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-21', week: 2, onderwerp: 'Identificatiemethoden',
    vraag: 'Uit welke vier onderdelen bestaat "identificatie en keuze van concurrenten" volgens de slides?',
    opties: [
      'Concurrentieniveaus, methoden om concurrenten te identificeren, keuze van de identificatiemethode, keuze welke concurrenten het belangrijkst zijn',
      'Doelstellingen, huidige strategieën, sterktes en zwaktes, verwachte strategieën',
      'Lengte, breedte, intensiteit, management van het kanaal',
      'Wie, Wat, Waar, Wanneer'
    ],
    antwoord: 0,
    uitleg: 'Identificatie en keuze van concurrenten = 1) concurrentieniveaus, 2) methoden om concurrenten te identificeren, 3) de keuze van de identificatiemethode, 4) de keuze welke concurrenten de onderneming het belangrijkst vindt. Optie 2 zijn de vervolgstappen (2 t/m 5) van de concurrentieanalyse.',
    hint: 'Begint bij de vier niveaus van concurrentie.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-22', week: 2, onderwerp: 'Keuze belangrijkste concurrenten',
    vraag: 'Koffiebar Bonen & Co heeft een lange lijst met concurrenten. Op basis van welke twee criteria kiest ze volgens de slides de belangrijkste?',
    opties: [
      'Marktaandeel en vergelijking met het eigen product',
      'Leeftijd van het bedrijf en aantal medewerkers',
      'Winstgevendheid en seizoensgevoeligheid',
      'Afstand tot de leverancier en distributie-intensiteit'
    ],
    antwoord: 0,
    uitleg: 'Bij "Lijstje met concurrenten… now what?" noemen de slides: marktaandeel en ten opzichte van het eigen product. Het doel is daarna inzicht te krijgen in de sterke en zwakke punten van die concurrenten.',
    hint: 'Hoe groot zijn ze, en hoe veel lijken ze op jou?',
    bron: 'zelfgemaakt'
  }
);

QUESTIONS.push(
  {
    id: 'w2-23', week: 2, onderwerp: 'Distributieanalyse macro/meso/micro',
    vraag: 'De distributieanalyse wordt op drie niveaus bekeken. Welke koppeling is juist?',
    opties: [
      'Macro = distributiekolom; meso = tussenschakel; micro = afzonderlijke spelers (retailers)',
      'Macro = afzonderlijke spelers; meso = distributiekolom; micro = tussenschakel',
      'Macro = DESTEP; meso = bedrijfstak; micro = onderneming',
      'Macro = tussenschakel; meso = afzonderlijke spelers; micro = distributiekolom'
    ],
    antwoord: 0,
    uitleg: 'Op macroniveau kijk je naar de hele distributiekolom (lengte en breedte), op mesoniveau naar de tussenschakels (groothandel, retailer) en op microniveau naar de afzonderlijke spelers (retailers). Let op: DESTEP hoort bij de bedrijfstakanalyse, niet bij de distributieanalyse.',
    hint: 'Van de hele kolom naar één winkel.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-24', week: 2, onderwerp: 'Lengte vs breedte',
    vraag: 'Een fabrikant van verzorgingsproducten verkoopt aan supermarkten, drogisterijen én discountwinkels. Over welke dimensie van het distributiekanaal gaat dit?',
    opties: ['De lengte', 'De breedte', 'De distributie-intensiteit', 'Directe levering'],
    antwoord: 1,
    uitleg: 'Verschillende soorten tussenschakels binnen één niveau (supermarkt, drogist, discounter – vergelijk AH, Kruidvat en Action) = de breedte. De lengte gaat over het aantal niveaus tussen producent en consument.',
    hint: 'Hoeveel soorten winkels op hetzelfde niveau?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-25', week: 2, onderwerp: 'Direct vs indirect',
    vraag: 'Een fruitteler verkoopt zijn appels via een groothandel, die ze doorverkoopt aan groentewinkels, die ze aan consumenten verkopen. Hoe noem je deze vorm van levering?',
    opties: ['Directe levering', 'Indirecte levering', 'Multi-channel', 'Exclusieve distributie'],
    antwoord: 1,
    uitleg: 'Er zitten tussenschakels (groothandel en detailhandel) tussen producent en consument: indirecte levering. Bij directe levering levert de producent zonder intermediairs aan de consument.',
    hint: 'Zitten er tussenschakels tussen?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-26', week: 2, onderwerp: 'Direct vs indirect',
    vraag: 'Een kleine brouwerij verkoopt haar bier uitsluitend via de eigen webshop en bezorgt het zelf bij de consument thuis. Er zitten geen andere bedrijven tussen. Wat is hier van toepassing?',
    opties: [
      'Directe levering (zonder intermediairs)',
      'Indirecte levering via de detailhandel',
      'Multi-channel',
      'Een lang distributiekanaal'
    ],
    antwoord: 0,
    uitleg: 'De producent levert zelf rechtstreeks aan de consument, zonder groothandel of detailhandel: directe levering. Multi-channel klopt niet: de brouwerij gebruikt maar één kanaal (bij Nike op de slides ging het om eigen winkels en webshop én verkoop via retailers).',
    hint: 'Is er een andere partij tussen brouwerij en consument?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-27', week: 2, onderwerp: 'Multi-channel',
    vraag: 'Een sportmerk verkoopt zijn schoenen via sportwinkels en warenhuizen, maar opent daarnaast eigen winkels en zet sterk in op de eigen webshop (direct-to-consumer). Hoe heet deze distributievorm?',
    opties: ['Directe levering', 'Indirecte levering', 'Multi-channel', 'Exclusieve distributie'],
    antwoord: 2,
    uitleg: 'Een combinatie van directe levering (eigen winkels, webshop) en indirecte levering (via retailers) = multi-channel, zoals Nike op de slides. Alleen "directe levering" klopt niet, omdat er ook via retailers wordt verkocht.',
    hint: 'Meerdere kanalen tegelijk.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-28', week: 2, onderwerp: 'Multi-channel',
    vraag: 'Nike opende meer eigen winkels en zette in op online verkoop. Volgens het artikel op de slides reageerden retailers met "Dat pikken wij niet. Dan gaan we minder van jullie verkopen." Welk nadeel van multi-channel laat dit zien?',
    opties: [
      'De producent verliest het directe contact met de consument.',
      'Bestaande tussenschakels (retailers) kunnen zich gepasseerd voelen en het merk minder gaan verkopen.',
      'De distributiekolom wordt langer.',
      'Het product wordt minder exclusief omdat het overal te koop is.'
    ],
    antwoord: 1,
    uitleg: 'Door zelf direct te verkopen ging Nike concurreren met zijn eigen retailers. Die verkochten daarna minder Nike, waardoor hun schappen later gevuld waren met concurrenten. Contact met de consument krijgt Nike juist méér door eigen winkels, dus optie 1 is geen nadeel maar een voordeel.',
    hint: 'Wat deden de winkels als reactie?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-29', week: 2, onderwerp: 'Groothandel en retail',
    vraag: 'Een analist onderzoekt de marktaandelen van supermarktformules (zoals AH en Jumbo) en de ontwikkeling van groothandels zoals Sligro. Op welk niveau van de distributieanalyse kijkt de analist dan?',
    opties: [
      'Macroniveau: de lengte en breedte van de distributiekolom',
      'Mesoniveau: de tussenschakels (groothandel en retailer)',
      'Microniveau: de concurrenten van de producent',
      'Het niveau van de afnemersanalyse'
    ],
    antwoord: 1,
    uitleg: 'Groothandel en retailer zijn de tussenschakels; die bekijk je op mesoniveau. Op macroniveau gaat het om de hele kolom (lengte en breedte), niet om specifieke groothandels of formules.',
    hint: 'Groothandel en retailer zijn tussenschakels.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-30', week: 2, onderwerp: 'Groothandel en retail',
    vraag: 'In een supermarktschap hangt een kaartje: "Wij maken ons hard voor lage prijzen. Hierdoor is dit product momenteel niet verkrijgbaar. We zijn met de leverancier in gesprek." Op welk niveau van de distributieanalyse past dit voorbeeld?',
    opties: [
      'Macro: de lengte van de distributiekolom',
      'Macro: de breedte van de distributiekolom',
      'Micro: een afzonderlijke speler (retailer)',
      'Het concurrentieniveau budgetconcurrentie'
    ],
    antwoord: 2,
    uitleg: 'Het gaat om het gedrag van één bepaalde supermarkt richting een leverancier: een afzonderlijke speler, dus microniveau. Lengte en breedte gaan over de opbouw van de hele kolom.',
    hint: 'Gaat het over de hele kolom of over één winkelketen?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-31', week: 2, onderwerp: 'Distributie-intensiteit',
    vraag: 'Frisdrankmerk Bubbl wil dat consumenten zijn blikjes overal kunnen kopen: in supermarkten, tankstations, kantines en automaten. Welke distributie-intensiteit is dit?',
    opties: ['Intensieve distributie', 'Selectieve distributie', 'Exclusieve distributie', 'Directe distributie'],
    antwoord: 0,
    uitleg: 'Zo veel mogelijk verkooppunten = intensieve distributie (zoals Coca-Cola). Selectieve distributie werkt met een beperkt aantal gekozen verkooppunten (zoals Apple Authorized Resellers).',
    hint: 'Denk aan het Coca-Cola-voorbeeld.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-32', week: 2, onderwerp: 'Distributie-intensiteit',
    vraag: 'Laptopmerk Nordic Tech verkoopt alleen via elektronicawinkels die door het merk zijn goedgekeurd als "erkende verkoper" en die aan eisen voor advies en service voldoen. Welke distributie-intensiteit is dit?',
    opties: ['Intensieve distributie', 'Selectieve distributie', 'Exclusieve distributie', 'Multi-channel'],
    antwoord: 1,
    uitleg: 'Een beperkt aantal gekozen verkooppunten die aan eisen voldoen = selectieve distributie (zoals de Apple Authorized Reseller op de slides). Exclusief is nog veel beperkter: heel weinig verkooppunten voor een premium imago (zoals Rolex).',
    hint: 'Denk aan "Authorized Reseller".',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-33', week: 2, onderwerp: 'Distributiebeslissingen',
    vraag: 'Welke drie beslissingen neem je volgens de slides bij distributie?',
    opties: [
      'De keuze van het distributiekanaal, de keuze van de distributie-intensiteit en het management van het distributiekanaal',
      'De keuze van de leverancier, de prijs en de reclame',
      'De keuze tussen rivaal- en partnerbenadering, de concurrentieniveaus en de identificatiemethode',
      'Lengte, breedte en diepte van het assortiment'
    ],
    antwoord: 0,
    uitleg: 'Distributie: drie beslissingen = 1) de keuze van het distributiekanaal, 2) de keuze van de distributie-intensiteit (doelstelling: weinig of veel verkooppunten) en 3) het management van het distributiekanaal. Optie 3 hoort bij de concurrentieanalyse.',
    hint: 'Kanaal – intensiteit – management.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w2-34', week: 2, onderwerp: 'Lengte vs breedte',
    vraag: 'Een producent van wijn levert eerst aan een importeur (groothandel), die levert aan een tweede groothandel, die levert aan slijterijen, die verkopen aan consumenten. Wat kun je zeggen over dit distributiekanaal?',
    opties: [
      'Het is een lang kanaal met indirecte levering.',
      'Het is een kort kanaal met directe levering.',
      'Het is een breed kanaal, want er zijn veel soorten winkels.',
      'Het is multi-channel, want er zijn meerdere groothandels.'
    ],
    antwoord: 0,
    uitleg: 'Er zitten veel niveaus (groothandel – groothandel – detailhandel) tussen producent en consument: een lang kanaal met indirecte levering. Breed zou betekenen dat er verschillende soorten tussenschakels op hetzelfde niveau zijn; hier is er per niveau maar één soort.',
    hint: 'Tel het aantal schakels achter elkaar.',
    bron: 'zelfgemaakt'
  }
);

/* ============================================================
 * WEEK 3 – Sectoren, bedrijfskolom, dynamiek, samenwerking (26 okt)
 * ============================================================ */

/* --- Officiële oefenvragen (slides week 4, stof week 3) --- */
QUESTIONS.push(
  {
    id: 'w3-01', week: 3, onderwerp: 'Integratie',
    vraag: 'Douwe Egberts, een grote koffiebrander, wil meer controle over de waardeketen. Wat kunnen zij het beste doen?',
    opties: [
      'Specialisatie toepassen',
      'Conglomeratie toepassen',
      'Diversificatie toepassen',
      'Integratie toepassen'
    ],
    antwoord: 3,
    uitleg: 'Bij integratie gaat een bedrijf een extra activiteit in de eigen bedrijfskolom uitvoeren (achterwaarts richting grondstof of voorwaarts richting consument). Zo krijg je meer controle over de keten. Specialisatie is juist het omgekeerde: je doet minder activiteiten en stoot onderdelen af (zoals Philips).',
    hint: 'Meer schakels van de bedrijfskolom zelf doen.',
    bron: 'slides', bronDetail: 'Tentamenvraag 4, slides week 4'
  },
  {
    id: 'w3-02', week: 3, onderwerp: 'Interne, externe en potentiële concurrentie',
    vraag: 'Er is sprake van potentiële concurrentie als:',
    opties: [
      'Producten door gebruikers substitueerbaar zijn door producten uit andere bedrijfstakken',
      'Er concurrentie is tussen bedrijfstakgenoten',
      'Er concurrentie is tussen ondernemingen in de bedrijfstak',
      'Producten door gebruikers niet substitueerbaar zijn'
    ],
    antwoord: 0,
    uitleg: 'Potentiële concurrentie = de dreiging van toetreders en substituutproducten. Als gebruikers jouw product kunnen vervangen door een product uit een andere bedrijfstak (zoals Netflix vs Pathé), is dat potentiële concurrentie. Concurrentie tussen bedrijfstakgenoten (optie 2 en 3) is interne concurrentie.',
    hint: 'Denk aan toetreders en substituten.',
    bron: 'slides', bronDetail: 'Tentamenvraag 5, slides week 4'
  },
  {
    id: 'w3-03', week: 3, onderwerp: 'Interne, externe en potentiële concurrentie',
    vraag: 'FreshBites, een startup gespecialiseerd in biologische maaltijdboxen, wil uitbreiden naar de markt voor kant-en-klare gezonde snacks. GreenEats is hier al een gevestigde speler. Van welk type concurrentie is sprake voor GreenEats?',
    opties: [
      'Externe concurrentie',
      'Interne concurrentie',
      'Idealistische concurrentie',
      'Potentiële concurrentie'
    ],
    antwoord: 3,
    uitleg: 'FreshBites zit nog niet in de snackmarkt, maar dreigt toe te treden. Voor GreenEats is FreshBites dus een (dreigende) toetreder: potentiële concurrentie. Het is (nog) geen interne concurrentie, want FreshBites is nog geen bedrijfstakgenoot in de snackmarkt.',
    hint: 'Zit FreshBites al in de snackmarkt?',
    bron: 'slides', bronDetail: 'Tentamenvraag 6, slides week 4'
  },
  {
    id: 'w3-04', week: 3, onderwerp: 'Parallellisatie vs conglomeratie',
    vraag: 'In de gezondheids- en welzijnsindustrie is het bedrijf HealthPlus actief; het richt zich op de verkoop van fitnessapparatuur. Door toenemende concurrentie breidt het uit en gaat het zich ook richten op de productie van voedingssupplementen en sportkleding. Van welke "activiteit" is hier sprake?',
    opties: [
      'Horizontale concentratie',
      'Integratie',
      'Conglomeratie',
      'Parallellisatie'
    ],
    antwoord: 3,
    uitleg: 'HealthPlus voegt producten toe uit andere bedrijfskolommen die aansluiten bij het huidige aanbod en dezelfde klant (sport en gezondheid) – vergelijk Picnic dat naast boodschappen ook maaltijden gaat leveren. Dat is parallellisatie. Conglomeratie is een verzameling sterk uiteenlopende activiteiten zonder duidelijke samenhang (zoals Amazon).',
    hint: 'Sluiten de nieuwe producten aan bij het bestaande aanbod?',
    bron: 'slides', bronDetail: 'Tentamenvraag 9, slides week 4'
  },
  {
    id: 'w3-05', week: 3, onderwerp: 'Horizontale concentratie',
    vraag: '"MediaMarkt heeft serieuze interesse in de overname van 9 BCC-winkels. De elektronicaketen is in vergevorderde gesprekken met de curatoren." Van welke "activiteit" is hier sprake?',
    opties: [
      'Horizontale concentratie',
      'Integratie',
      'Conglomeratie',
      'Parallellisatie'
    ],
    antwoord: 0,
    uitleg: 'MediaMarkt neemt winkels over van een concurrent in dezelfde bedrijfstak (elektronicaretail): het breidt uit ten koste van andere ondernemingen in de bedrijfstak = horizontale concentratie. Integratie zou betekenen dat MediaMarkt een andere schakel in de bedrijfskolom erbij neemt, zoals een fabrikant.',
    hint: 'Zelfde schakel in de kolom of een andere?',
    bron: 'slides', bronDetail: 'Tentamenvraag 10, slides week 4'
  },
  {
    id: 'w3-06', week: 3, onderwerp: 'Sectoren',
    vraag: 'Een klein commercieel consultancybedrijf genaamd GreenImpact is gespecialiseerd in het adviseren van de overheid over duurzame bedrijfsvoering en milieuvriendelijke praktijken. In welke sector is GreenImpact actief?',
    opties: ['De primaire sector', 'De secundaire sector', 'De tertiaire sector', 'De quartaire sector'],
    antwoord: 2,
    uitleg: 'GreenImpact levert een dienst (advies) en doet dat commercieel, dus de tertiaire sector (commerciële dienstverlening). De klant is de overheid, maar dat maakt het nog geen quartaire sector: die bestaat uit niet-commerciële dienstverlening, zoals de brandweer.',
    hint: 'Let op het woord "commercieel".',
    bron: 'slides', bronDetail: 'Tentamenvraag 11, slides week 4'
  },
  {
    id: 'w3-07', week: 3, onderwerp: 'Samenwerkingsvormen',
    vraag: 'Verschillende bedrijven werken samen in een samenwerkingsverband; deze samenwerking heeft een tijdelijk karakter. Welk type samenwerking wordt hier beschreven?',
    opties: ['Coöperatie', 'Consortium', 'Joint venture', 'Coöptatie'],
    antwoord: 1,
    uitleg: 'Een consortium is een tijdelijk samenwerkingsverband van bedrijven, bijvoorbeeld voor één groot project (slides: de Franse Naval Group bouwt samen met Nederlandse toeleveranciers onderzeeboten). Een coöperatie (zoals FrieslandCampina) is een blijvende vereniging van leden, niet tijdelijk.',
    hint: 'Het sleutelwoord is "tijdelijk".',
    bron: 'slides', bronDetail: 'Tentamenvraag 12, slides week 4'
  },
  {
    id: 'w3-08', week: 3, onderwerp: 'SBI-indeling CBS',
    vraag: 'Het CBS gebruikt de Standaard Bedrijfsindeling (SBI) om bedrijven te classificeren op basis van hun activiteiten en productieprocessen. De indeling bestaat uit verschillende niveaus, zoals afdelingen, groepen en klassen. Waarvoor kan deze SBI-indeling worden gebruikt?',
    opties: [
      'Om te bepalen welke bedrijven de meeste winst maken binnen een sector.',
      'Om vast te stellen welke bedrijven met elkaar concurreren op basis van hun marktaandeel.',
      'Om economische gegevens, zoals omzet en werkgelegenheid, tussen sectoren te vergelijken.',
      'Om te bepalen welke producten bedrijven binnen een sector mogen verkopen op de markt.'
    ],
    antwoord: 2,
    uitleg: 'Met de SBI deelt het CBS bedrijven in naar activiteit, zodat je statistieken (zoals omzet en werkgelegenheid) per sector of bedrijfstak kunt vergelijken. De SBI zegt niets over marktaandelen of wie met wie concurreert; daarvoor heb je een concurrentieanalyse nodig.',
    hint: 'Het CBS is een bureau voor statistiek.',
    bron: 'slides', bronDetail: 'Tentamenvraag 13, slides week 4'
  }
);

/* --- Zelfgemaakte vragen week 3 --- */
QUESTIONS.push(
  {
    id: 'w3-09', week: 3, onderwerp: 'Sectoren',
    vraag: 'De brandweer is een voorbeeld van een organisatie in welke sector?',
    opties: ['Primaire sector', 'Secundaire sector', 'Tertiaire sector', 'Quartaire sector'],
    antwoord: 3,
    uitleg: 'De brandweer levert een dienst zonder winstoogmerk: niet-commerciële dienstverlening = quartaire sector. De tertiaire sector is commerciële dienstverlening, zoals een supermarkt of een bezorgdienst.',
    hint: 'Dienst, maar zonder winstoogmerk.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-10', week: 3, onderwerp: 'Sectoren',
    vraag: 'Staalbedrijf IJzerkracht maakt van ijzererts staalplaten voor de auto-industrie. In welke sector is IJzerkracht actief?',
    opties: ['Primaire sector', 'Secundaire sector', 'Tertiaire sector', 'Quartaire sector'],
    antwoord: 1,
    uitleg: 'Het bewerken van grondstoffen tot producten (industrie, zoals een staalfabriek) is de secundaire sector. De primaire sector haalt de grondstoffen zelf uit de natuur (landbouw, visserij, mijnbouw); IJzerkracht bewerkt het erts.',
    hint: 'Winnen of bewerken?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-11', week: 3, onderwerp: 'Sectoren',
    vraag: 'Welk bedrijf hoort in de primaire sector?',
    opties: [
      'Een akkerbouwer die tarwe verbouwt',
      'Een bakkerij die van meel brood maakt',
      'Een supermarkt die brood verkoopt',
      'Een maaltijdbezorger'
    ],
    antwoord: 0,
    uitleg: 'De primaire sector haalt producten uit de natuur, zoals landbouw (slides: een maaidorser op het land). De bakkerij bewerkt de grondstof en hoort daarom bij de secundaire sector; supermarkt en bezorger zijn commerciële diensten (tertiair).',
    hint: 'Waar begint de keten?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-12', week: 3, onderwerp: 'SBI-indeling CBS',
    vraag: 'De SBI-code van een hogeschool is Q 85.4.01. Waar staat de letter Q voor?',
    opties: ['De klasse', 'De groep', 'De afdeling', 'De sector'],
    antwoord: 3,
    uitleg: 'De SBI-indeling is: de sector (letter) . de afdeling (cijfer) . de groep (cijfer) . de klasse (cijfer). Q is dus de sector (Onderwijs). De klasse is het meest gedetailleerde niveau en staat helemaal achteraan.',
    hint: 'Alleen het eerste niveau is een letter.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-13', week: 3, onderwerp: 'SBI-indeling CBS',
    vraag: 'Wat is de juiste volgorde van de SBI-indeling van het CBS, van grof naar fijn?',
    opties: [
      'Sector – afdeling – groep – klasse',
      'Sector – groep – afdeling – klasse',
      'Afdeling – sector – klasse – groep',
      'Klasse – groep – afdeling – sector'
    ],
    antwoord: 0,
    uitleg: 'De sector.de afdeling.de groep.de klasse (letter.cijfer.cijfer.cijfer). Optie 4 is dezelfde volgorde, maar dan van fijn naar grof.',
    hint: 'Begint met een letter.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-14', week: 3, onderwerp: 'Bedrijfstak vs bedrijfskolom',
    vraag: 'Wat is een bedrijfstak?',
    opties: [
      'Alle opeenvolgende schakels van oerproducent tot consument',
      'De ondernemingen die hetzelfde soort product maken met min of meer dezelfde productieprocessen',
      'Een samenwerkingsverband van ondernemingen met een tijdelijk karakter',
      'Alle bedrijven met dezelfde SBI-letter, ongeacht wat ze maken'
    ],
    antwoord: 1,
    uitleg: 'Een bedrijfstak bestaat uit ondernemingen die hetzelfde soort product maken met min of meer dezelfde productieprocessen (bijv. Heineken, Hertog Jan en Jupiler: de bierbrouwerijen). Optie 1 is de definitie van de bedrijfskolom.',
    hint: 'Horizontaal: bedrijven op dezelfde schakel.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-15', week: 3, onderwerp: 'Bedrijfstak vs bedrijfskolom',
    vraag: 'Graanboer en hopboer → bierbrouwerij → drankgroothandel en supermarkten → cafés → consument. Hoe noem je deze hele reeks?',
    opties: ['Een bedrijfstak', 'Een bedrijfskolom', 'Een sector', 'Een strategische groep'],
    antwoord: 1,
    uitleg: 'De bedrijfskolom is de reeks opeenvolgende bedrijfstakken van oerproducent tot consument. Een bedrijfstak is maar één schakel in die kolom (bijv. alle bierbrouwerijen).',
    hint: 'Van oerproducent tot consument.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-16', week: 3, onderwerp: 'Bedrijfstak vs bedrijfskolom',
    vraag: 'Unilever maakt onder meer soep, mayonaise, thee, wasmiddel en deodorant. Wat laat dit zien?',
    opties: [
      'Een onderneming kan tot verschillende bedrijfstakken behoren.',
      'Een onderneming hoort altijd bij precies één bedrijfstak.',
      'Unilever is een coöperatie.',
      'Unilever is een voorbeeld van specialisatie.'
    ],
    antwoord: 0,
    uitleg: 'Op de slides is Unilever het voorbeeld bij de vraag "Kan een individuele onderneming tot verschillende bedrijfstakken behoren?" – ja: voedingsmiddelen en verzorgings- en schoonmaakproducten zijn verschillende bedrijfstakken. Specialisatie zou juist betekenen dat Unilever zich op minder activiteiten richt.',
    hint: 'Hoeveel soorten producten maakt het bedrijf?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-17', week: 3, onderwerp: 'Horizontale concentratie',
    vraag: 'Streamingdienst Videoland neemt Viaplay Nederland over. Waarom is dit horizontale concentratie?',
    opties: [
      'Videoland gaat een schakel verder richting de consument uitvoeren.',
      'Videoland breidt uit ten koste van een andere onderneming in dezelfde bedrijfstak.',
      'Videoland gaat producten uit een andere bedrijfskolom verkopen.',
      'Videoland stoot een onderdeel af om zich te richten op zijn kern.'
    ],
    antwoord: 1,
    uitleg: 'Horizontale concentratie: "Bedrijven breiden uit ten koste van andere ondernemingen in de bedrijfstak." Videoland en Viaplay zitten allebei in dezelfde bedrijfstak (streaming). Optie 1 beschrijft voorwaartse integratie.',
    hint: 'Zijn het bedrijven op dezelfde schakel?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-18', week: 3, onderwerp: 'Integratie',
    vraag: 'Ferrero, de maker van Nutella, koopt hazelnootleverancier Oltan. Van welke activiteit is sprake?',
    opties: ['Voorwaartse integratie', 'Achterwaartse integratie', 'Horizontale concentratie', 'Parallellisatie'],
    antwoord: 1,
    uitleg: 'Ferrero neemt een schakel eerder in de bedrijfskolom over, richting de grondstof (hazelnoten): achterwaartse integratie. Voorwaartse integratie gaat richting de consument (zoals Rolex dat een winkelketen koopt).',
    hint: 'Richting grondstof of richting consument?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-19', week: 3, onderwerp: 'Integratie',
    vraag: 'Horlogemaker Rolex koopt een keten van juwelierswinkels die zijn horloges verkoopt. Van welke activiteit is sprake?',
    opties: ['Achterwaartse integratie', 'Voorwaartse integratie', 'Horizontale concentratie', 'Conglomeratie'],
    antwoord: 1,
    uitleg: 'Rolex neemt een schakel verderop in de kolom over, richting de consument (de retail): voorwaartse integratie. Horizontale concentratie zou zijn als Rolex een andere horlogemaker zou overnemen.',
    hint: 'De winkel zit tussen Rolex en de consument.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-20', week: 3, onderwerp: 'Integratie vs horizontale concentratie',
    vraag: 'Snoepfabrikant Zoetekauw opent eigen winkels waarin het alleen zijn eigen snoep verkoopt. Concurrent Snoeplust neemt juist een andere snoepfabrikant over. Welke combinatie is juist?',
    opties: [
      'Zoetekauw: voorwaartse integratie; Snoeplust: horizontale concentratie',
      'Zoetekauw: horizontale concentratie; Snoeplust: voorwaartse integratie',
      'Zoetekauw: achterwaartse integratie; Snoeplust: horizontale concentratie',
      'Zoetekauw: parallellisatie; Snoeplust: conglomeratie'
    ],
    antwoord: 0,
    uitleg: 'Eigen winkels openen = een schakel richting consument erbij (voorwaartse integratie, zoals de Haribo-winkel op de slides). Een andere snoepfabrikant overnemen = uitbreiden in dezelfde bedrijfstak (horizontale concentratie). Achterwaarts zou richting suikerfabrikant gaan.',
    hint: 'Integratie = andere schakel in de kolom; horizontale concentratie = zelfde schakel.',
    bron: 'zelfgemaakt'
  }
);

QUESTIONS.push(
  {
    id: 'w3-21', week: 3, onderwerp: 'Parallellisatie vs conglomeratie',
    vraag: 'Online supermarkt Picnic begint een maaltijddienst: Picnic kookt maaltijden in een eigen keuken en levert ze mee met de rest van de boodschappen. Van welke activiteit is sprake?',
    opties: ['Parallellisatie', 'Conglomeratie', 'Achterwaartse integratie', 'Specialisatie'],
    antwoord: 0,
    uitleg: 'Dit is het voorbeeld van parallellisatie op de slides: Picnic voegt een aanverwant product (kant-en-klare maaltijden) toe aan zijn bestaande aanbod voor dezelfde klant. Conglomeratie is een verzameling sterk uiteenlopende activiteiten zonder duidelijke samenhang, zoals Amazon met filmstudio, clouddienst en vrachtvliegtuigen.',
    hint: 'Sluit de maaltijddienst aan bij de boodschappen?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-22', week: 3, onderwerp: 'Parallellisatie vs conglomeratie',
    vraag: 'Een webwinkel heeft een filmstudio gekocht, verkoopt een eigen e-reader en slimme speakers, verhuurt clouddiensten aan andere bedrijven en heeft eigen vrachtvliegtuigen. Van welke activiteit is sprake?',
    opties: ['Parallellisatie', 'Conglomeratie', 'Horizontale concentratie', 'Voorwaartse integratie'],
    antwoord: 1,
    uitleg: 'Heel uiteenlopende activiteiten in veel verschillende bedrijfstakken, zonder duidelijke samenhang = conglomeratie (het conglomeraat Amazon op de slides). Bij parallellisatie sluiten de nieuwe producten aan bij het bestaande aanbod (zoals Picnic met maaltijden naast boodschappen).',
    hint: 'Hebben al deze activiteiten iets met elkaar te maken?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-23', week: 3, onderwerp: 'Diversificatie en branchevervaging',
    vraag: 'Een mediabedrijf bezit kranten, tijdschriften, radiozenders, nieuwswebsites en tv-zenders. Volgens de slides leidt diversificatie tot welk gevolg?',
    opties: ['Specialisatie', 'Branchevervaging', 'Kartelvorming', 'Concentratie van afnemers'],
    antwoord: 1,
    uitleg: 'Bij diversificatie gaat een onderneming steeds meer verschillende producten aanbieden (slides: DPG Media en RTL). Het gevolg is branchevervaging: de grenzen tussen branches worden vaag. Specialisatie is juist het omgekeerde van diversificatie.',
    hint: 'De grenzen tussen branches worden …',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-24', week: 3, onderwerp: 'Specialisatie',
    vraag: 'Elektronicaconcern Philips verkoopt zijn divisie met airfryers, stofzuigers en koffieapparaten om zich te richten op gezondheidsapparatuur. Van welke activiteit is sprake?',
    opties: ['Diversificatie', 'Conglomeratie', 'Specialisatie', 'Horizontale concentratie'],
    antwoord: 2,
    uitleg: 'Philips stoot activiteiten af en richt zich op minder activiteiten: specialisatie. Diversificatie is het tegenovergestelde: juist meer verschillende producten gaan aanbieden.',
    hint: 'Gaat het bedrijf meer of minder verschillende dingen doen?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-25', week: 3, onderwerp: 'Groeistrategieën',
    vraag: '"Wat doe je als je wilt groeien?" Welke activiteit uit het rijtje op de slides leidt juist NIET tot meer activiteiten voor het bedrijf?',
    opties: ['Horizontale concentratie', 'Integratie', 'Conglomeratie', 'Specialisatie'],
    antwoord: 3,
    uitleg: 'Bij specialisatie richt een bedrijf zich op minder activiteiten en stoot het onderdelen af (Philips). Horizontale concentratie, integratie en conglomeratie voegen juist activiteiten of marktaandeel toe.',
    hint: 'Welke activiteit gaat over afstoten?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-26', week: 3, onderwerp: 'Overname en fusie',
    vraag: 'Volvo en de Chinese autofabrikant Geely richten samen het nieuwe automerk Lynk & Co op, terwijl Volvo en Geely zelf ook gewoon blijven bestaan. Welke samenwerkingsvorm is dit?',
    opties: ['Fusie', 'Joint venture', 'Overname', 'Kartel'],
    antwoord: 1,
    uitleg: 'Bij een joint venture richten twee (of meer) bedrijven samen een nieuwe, gezamenlijke onderneming op; de moederbedrijven blijven zelfstandig bestaan (Volvo + Geely → Lynk & Co). Bij een fusie gaan de bedrijven zelf samen op in één onderneming.',
    hint: 'Blijven de oorspronkelijke bedrijven bestaan?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-27', week: 3, onderwerp: 'Overname en fusie',
    vraag: 'Twee luchtvaartmaatschappijen besluiten samen verder te gaan als één nieuwe combinatie, zoals bij Air France-KLM. Hoe heet deze vorm?',
    opties: ['Joint venture', 'Fusie', 'Consortium', 'Inkoopcombinatie'],
    antwoord: 1,
    uitleg: 'Bij een fusie gaan twee ondernemingen samen op in één combinatie (Air France-KLM op de slides). Bij een joint venture richten de bedrijven samen een nieuw, apart bedrijf op en blijven ze zelf los van elkaar bestaan.',
    hint: 'De bedrijven gaan zelf samen.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-28', week: 3, onderwerp: 'Overname en fusie',
    vraag: 'Roompot neemt vakantieparkenketen Landal over. De Autoriteit Consument & Markt (ACM) stelt als voorwaarde dat Roompot zes Zeeuwse vakantieparken moet afstoten. Waarom doet de ACM dit?',
    opties: [
      'Om te voorkomen dat Roompot na de overname een te sterke positie op de markt voor vakantieparken krijgt.',
      'Omdat de ACM bepaalt welke producten een bedrijf mag verkopen.',
      'Omdat overnames in Nederland altijd verboden zijn.',
      'Om de winst van Roompot te verhogen.'
    ],
    antwoord: 0,
    uitleg: 'De ACM houdt toezicht op concurrentie. Ze wilde voorkomen dat Roompot na de overname een te sterke positie op de markt voor vakantieparken in Nederland zou krijgen. Overnames zijn niet altijd verboden: Videoland mocht Viaplay Nederland wel overnemen, omdat er voldoende concurrentie overbleef.',
    hint: 'Waarom is concurrentie belangrijk voor consumenten?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-29', week: 3, onderwerp: 'Consortium vs coöperatie',
    vraag: 'Duizenden melkveehouders zijn samen lid en eigenaar van één zuivelonderneming die hun melk verwerkt, zoals FrieslandCampina. Welke samenwerkingsvorm is dit?',
    opties: ['Consortium', 'Coöperatie', 'Joint venture', 'Franchising'],
    antwoord: 1,
    uitleg: 'Een coöperatie is een blijvende samenwerking waarbij de leden (hier de boeren) samen eigenaar zijn (FrieslandCampina op de slides). Een consortium is een tijdelijk samenwerkingsverband van bedrijven voor bijvoorbeeld één project.',
    hint: 'Leden die samen eigenaar zijn – blijvend.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-30', week: 3, onderwerp: 'Consortium vs coöperatie',
    vraag: 'Een Franse scheepsbouwer en een aantal Nederlandse toeleveranciers werken samen om voor de marine vier onderzeeboten te bouwen. Na de oplevering stopt de samenwerking. Welke samenwerkingsvorm is dit?',
    opties: ['Coöperatie', 'Consortium', 'Fusie', 'Vrijwillig filiaalbedrijf'],
    antwoord: 1,
    uitleg: 'Een tijdelijk samenwerkingsverband voor één groot project = consortium (slides: Naval Group en Nederlandse toeleveranciers). Een coöperatie is blijvend en de leden zijn samen eigenaar.',
    hint: 'Stopt de samenwerking na het project?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-31', week: 3, onderwerp: 'Samenwerkingsvormen',
    vraag: 'Een aantal zelfstandige supermarktketens (zoals Plus, Hoogvliet en Dirk) kopen hun producten samen in via één organisatie, zodat ze betere inkoopprijzen krijgen. Hoe heet deze samenwerking?',
    opties: ['Inkoopcombinatie', 'Franchising', 'Kartel', 'Joint venture'],
    antwoord: 0,
    uitleg: 'Samen inkopen voor inkoopvoordeel, terwijl de ketens zelfstandig blijven = inkoopcombinatie (Superunie op de slides). Een kartel is iets anders: verboden afspraken tussen concurrenten, bijvoorbeeld over prijzen.',
    hint: 'Ze kopen samen in, maar blijven concurreren in de winkel.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-32', week: 3, onderwerp: 'Samenwerkingsvormen',
    vraag: 'Snackketen Kippie zoekt ondernemers die een eigen vestiging openen onder de naam en formule van Kippie, tegen een vergoeding. Welke samenwerkingsvorm is dit?',
    opties: ['Inkoopcombinatie', 'Franchising', 'Coöperatie', 'Consortium'],
    antwoord: 1,
    uitleg: 'Bij franchising mag een zelfstandige ondernemer (franchisenemer) de naam en formule van een franchisegever gebruiken tegen een vergoeding (Kippie op de slides). Bij een inkoopcombinatie kopen zelfstandige bedrijven alleen samen in en houden ze hun eigen naam.',
    hint: '"Word franchisenemer!"',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-33', week: 3, onderwerp: 'Kartel',
    vraag: 'Vier fabrikanten van gloeilampen spreken af dat hun lampen niet langer dan 1000 uur mogen branden, zodat consumenten vaker nieuwe lampen moeten kopen. Wat is dit, en welke instantie houdt hier in Nederland toezicht op?',
    opties: [
      'Een consortium; toezicht door het CBS',
      'Een kartel; verboden door de Mededingingswet, toezicht door de ACM',
      'Een joint venture; toezicht door de ACM',
      'Een inkoopcombinatie; toezicht door het CBS'
    ],
    antwoord: 1,
    uitleg: 'Afspraken tussen concurrenten die de concurrentie beperken (zoals het gloeilampenkartel op de slides) = kartelvorming. Dat is verboden door de Mededingingswet; de ACM houdt toezicht. Het CBS maakt statistieken (zoals de SBI-indeling) en houdt geen toezicht op concurrentie.',
    hint: 'Afspraken tussen concurrenten ten koste van de consument.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-34', week: 3, onderwerp: 'Interne, externe en potentiële concurrentie',
    vraag: 'Streamingdiensten Netflix, Disney+, HBO Max en Prime Video strijden om dezelfde abonnees. Welke vorm van concurrentie in de bedrijfstak is dit?',
    opties: ['Interne concurrentie', 'Externe concurrentie', 'Potentiële concurrentie', 'Budgetconcurrentie'],
    antwoord: 0,
    uitleg: 'Interne concurrentie: concurrentie tussen ondernemingen in dezelfde bedrijfstak, met als doel een groot marktaandeel te verwerven. Externe concurrentie is concurrentie met ondernemingen die producten afnemen of toeleveren (zoals Universal tegenover Netflix).',
    hint: 'Zitten ze in dezelfde bedrijfstak?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-35', week: 3, onderwerp: 'Interne, externe en potentiële concurrentie',
    vraag: 'Filmstudio Universal (leverancier van films) en streamingdienst Netflix onderhandelen hard over de prijs van filmrechten. Welke vorm van concurrentie is dit volgens de slides?',
    opties: ['Interne concurrentie', 'Externe concurrentie', 'Potentiële concurrentie', 'Productvormconcurrentie'],
    antwoord: 1,
    uitleg: 'Externe concurrentie: concurreren met ondernemingen die producten afnemen of toeleveren – hier de leverancier van de films. Interne concurrentie is tussen bedrijven in dezelfde bedrijfstak (Netflix vs Disney+).',
    hint: 'Universal levert aan Netflix.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-36', week: 3, onderwerp: 'Omgevingsfactoren',
    vraag: 'Welke omgevingsfactoren beïnvloeden volgens het schema op de slides de concurrentie in een bedrijfstak?',
    opties: [
      'Overheid/economische orde, toevalsfactoren en de vraag',
      'Afnemers, bedrijfstak, concurrenten en distributie',
      'Structuur, gedrag en resultaat',
      'Lengte, breedte en intensiteit'
    ],
    antwoord: 0,
    uitleg: 'In het schema werken drie omgevingsfactoren in op de bedrijfstakken: de overheid/economische orde (bijv. wetgeving en toezicht door de ACM), toevalsfactoren (bijv. noodweer) en de vraag. ABCD is de externe analyse uit week 1–2, niet dit schema.',
    hint: 'Denk aan het gebouw, het onweer en de pijl van onderen.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w3-37', week: 3, onderwerp: 'Omgevingsfactoren',
    vraag: 'Een overstroming legt een maand lang alle fabrieken in een regio stil, waardoor de concurrentieverhoudingen in de bedrijfstak veranderen. Onder welke omgevingsfactor valt dit?',
    opties: ['Overheid/economische orde', 'Toevalsfactoren', 'Vraag', 'Externe concurrentie'],
    antwoord: 1,
    uitleg: 'Een onverwachte gebeurtenis zoals een natuurramp is een toevalsfactor (op de slides het onweerswolkje). Overheid/economische orde gaat over regels en toezicht, zoals de Mededingingswet.',
    hint: 'Niemand heeft hiervoor gekozen.',
    bron: 'zelfgemaakt'
  }
);

QUESTIONS.push(
  {
    id: 'w3-38', week: 3, onderwerp: 'Samenwerkingsvormen',
    vraag: 'Zelfstandige supermarktondernemers runnen ieder hun eigen winkel, maar werken allemaal onder dezelfde naam en formule (zoals Spar) en krijgen hun producten van één centrale organisatie. Hoe heet deze samenwerkingsvorm?',
    opties: ['Vrijwillig filiaalbedrijf', 'Fusie', 'Consortium', 'Kartel'],
    antwoord: 0,
    uitleg: 'Bij een vrijwillig filiaalbedrijf blijven de winkeliers zelfstandig ondernemer, maar werken ze vrijwillig samen onder één formule met een centrale (groothandels)organisatie (Spar op de slides: "ondernemer worden?"). Bij een fusie gaan de bedrijven op in één onderneming en zijn ze niet meer zelfstandig.',
    hint: 'Zelfstandig blijven, maar onder één naam.',
    bron: 'zelfgemaakt'
  }
);

/* ============================================================
 * WEEK 4 – SGR-model en marktvormen (4 nov)
 * ============================================================ */

/* --- Officiële oefenvragen (slides week 4) --- */
QUESTIONS.push(
  {
    id: 'w4-01', week: 4, onderwerp: 'Rivaliserend gedrag',
    vraag: 'Limit pricing is een strategische prijstechniek die door gevestigde bedrijven in een markt wordt gebruikt. Wat is het primaire doel van limit pricing?',
    opties: [
      'Om de korte termijn winst te maximaliseren door de prijs zo hoog mogelijk te stellen',
      'Om toetredingsbarrières te creëren door de prijs net laag genoeg in te stellen zodat toetreding onaantrekkelijk wordt',
      'Om meer klanten aan te trekken door de laagst mogelijke prijs aan te bieden',
      'Om te voldoen aan regelgeving omtrent anti-concurrentiepraktijken'
    ],
    antwoord: 1,
    uitleg: 'Limit pricing staat op de slides bij de toetredingsbarrières: de prijs wordt net zo laag gezet dat toetreden voor nieuwkomers niet aantrekkelijk is. Het neveneffect is gevaar van winsterosie. Het gaat niet om "de laagst mogelijke prijs" (optie 3), maar om een prijs die net laag genoeg is om toetreders tegen te houden.',
    hint: 'Het staat in de tabel "toetredingsbarrières".',
    bron: 'slides', bronDetail: 'Tentamenvraag 1, slides week 4'
  },
  {
    id: 'w4-02', week: 4, onderwerp: 'Rivaliserend gedrag',
    vraag: 'Wat gebeurt er vaak in de markt als een kostenleider prijzen ONDER het niveau van concurrenten instelt en een groot marktaandeel wint?',
    opties: [
      'Het zorgt voor een diversificatie van concurrenten in de markt',
      'Het dwingt concurrenten om zich te richten op productinnovatie',
      'Het kan concurrenten uit de markt drijven, leidend tot marktconcentratie',
      'Het verhoogt de kans op prijskartels in de sector'
    ],
    antwoord: 2,
    uitleg: 'Kostenleiderschap met prijzen onder het niveau van concurrenten: hoog marktaandeel en hoge winst voor de kostenleider, concurrenten verlaten de markt (concentratie) en winsterosie in de bedrijfstak door prijsbederf. Prijzen OP of BOVEN het niveau van concurrenten leiden juist tot potentiële concurrentie (deconcentratie).',
    hint: 'Wat gebeurt er met concurrenten die niet zo goedkoop kunnen werken?',
    bron: 'slides', bronDetail: 'Tentamenvraag 2, slides week 4'
  },
  {
    id: 'w4-03', week: 4, onderwerp: 'Structuur vs gedrag',
    vraag: 'Wat is GEEN structuurkenmerk bij een monopolie?',
    opties: ['Winstmaximalisatie', 'Geen toetreding', 'Volledige informatie', 'Eén aanbieder'],
    antwoord: 0,
    uitleg: 'Winstmaximalisatie is ondernemersGEDRAG (de G van SGR), geen structuurkenmerk. De structuur van een monopolie is: één aanbieder, homogeen product, volledige informatie, geen toetreding en weinig/veel afnemers.',
    hint: 'Welke optie is iets wat de ondernemer DOET?',
    bron: 'slides', bronDetail: 'Tentamenvraag 3, slides week 4'
  },
  {
    id: 'w4-04', week: 4, onderwerp: 'Cn-ratio',
    vraag: 'Waar geeft de Cn-ratio inzicht in?',
    opties: [
      'De marktaandelen van alle aanbieders in een markt',
      'De marktaandelen van de grootste aanbieders in een markt',
      'De marktaandelen van alle kleine aanbieders in een markt',
      'Het gemiddelde van alle marktaandelen'
    ],
    antwoord: 1,
    uitleg: 'De concentratiegraad of Cn-ratio is de maatstaf voor de marktmacht van de grootste ondernemingen: een C4 van 60% betekent dat de 4 grootste spelers samen 60% van de markt hebben. Over de rest van de spelers zegt de Cn-ratio juist niets (kleinschaligheid).',
    hint: 'C4 = de 4 …',
    bron: 'slides', bronDetail: 'Tentamenvraag 7, slides week 4'
  },
  {
    id: 'w4-05', week: 4, onderwerp: 'Marktvormen',
    vraag: 'In de markt voor koffiezaken zijn er veel kleine cafés die elk hun eigen unieke sfeer en speciale koffiespecialiteiten aanbieden. Van welke marktvorm is hier sprake?',
    opties: ['Volledig vrije mededinging', 'Monopolie', 'Monopolistische concurrentie', 'Oligopolie'],
    antwoord: 2,
    uitleg: 'Veel aanbieders met een heterogeen product (elk café is anders) = monopolistische concurrentie. Bij volledig vrije mededinging zijn er ook veel aanbieders, maar is het product homogeen (zoals graan).',
    hint: 'Veel aanbieders – maar is het product overal hetzelfde?',
    bron: 'slides', bronDetail: 'Tentamenvraag 8, slides week 4'
  },
  {
    id: 'w4-06', week: 4, onderwerp: 'Marktmacht vergroten',
    vraag: 'Welke van de onderstaande mogelijkheden is GÉÉN manier waarop bedrijven hun marktmacht kunnen versterken of benutten?',
    opties: [
      'Het aanbieden van gekoppelde diensten om klanten aan zich te binden.',
      'Het gebruiken van patenten om concurrenten tijdelijk uit te sluiten van het gebruik van bepaalde technologieën.',
      'Het overnemen van veelbelovende nieuwkomers om hun concurrentiepositie te versterken.',
      'Het verlagen van prijzen door efficiënter te produceren en kosten te besparen.'
    ],
    antwoord: 3,
    uitleg: 'Op de slides staan vier manieren om marktmacht te vergroten: gekoppelde diensten leveren (Google), marktmacht uitbuiten (Booking), het patentenstelsel (Pfizer) en overname van nieuwkomers (Facebook – Instagram/WhatsApp). Efficiënter produceren om goedkoper te worden staat daar niet bij.',
    hint: 'Drie opties staan letterlijk op de slide "marktmacht vergroten".',
    bron: 'slides', bronDetail: 'Tentamenvraag 14, slides week 4'
  }
);

/* --- Zelfgemaakte vragen week 4 --- */
QUESTIONS.push(
  {
    id: 'w4-07', week: 4, onderwerp: 'SGR-model',
    vraag: 'Waar staan de letters van het SGR-model voor?',
    opties: [
      'Structuur – Gedrag – Resultaat',
      'Sector – Groep – Richting',
      'Structuur – Groei – Rendement',
      'Strategie – Gedrag – Resultaat'
    ],
    antwoord: 0,
    uitleg: 'SGR = (markt)Structuur – (ondernemers)Gedrag – Resultaat. De structuur zijn de randvoorwaarden, het gedrag de activiteiten en het resultaat de winstgevendheid/groei van de afzet. "Strategie" is niet de S: de S staat voor de marktstructuur (kenmerken).',
    hint: 'De S zijn de kenmerken van de markt.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-08', week: 4, onderwerp: 'Structuur vs gedrag',
    vraag: 'Welk kenmerk hoort bij de MARKTSTRUCTUUR in het SGR-model?',
    opties: ['Winstmaximalisatie', 'Toe- en uittreding', 'Toetredingsbarrières', 'Innovatief resultaat'],
    antwoord: 2,
    uitleg: 'Structuurkenmerken: aantal aanbieders, aard van het product, kostenstructuur van de productie, toetredingsbarrières en kenmerken van de vraag. Let op: "toe- en uittreding" is gedrag (wat ondernemers doen), "toetredingsbarrières" is structuur (hoe de markt in elkaar zit).',
    hint: 'Barrières zijn een eigenschap van de markt, geen handeling.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-09', week: 4, onderwerp: 'Structuur vs gedrag',
    vraag: 'Welk kenmerk hoort bij het (ondernemers)GEDRAG in het SGR-model?',
    opties: ['Aantal aanbieders', 'Ontwikkeling van de investeringen', 'Kenmerken van de vraag', 'Groei van de toegevoegde waarde'],
    antwoord: 1,
    uitleg: 'Gedrag: winstmaximalisatie, toe- en uittreding, innovatief gedrag en ontwikkeling van de investeringen (slides: Amazon investeert 1,4 miljard in Nederland). "Groei van de toegevoegde waarde" is een resultaat; "aantal aanbieders" en "kenmerken van de vraag" zijn structuur.',
    hint: 'Wat besluit de ondernemer te doen?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-10', week: 4, onderwerp: 'SGR-model',
    vraag: 'Welk onderdeel hoort bij het RESULTAAT in het SGR-model?',
    opties: ['Innovatief gedrag', 'Aard van het product', 'Ontwikkeling buitenlandse afzet', 'Toe- en uittreding'],
    antwoord: 2,
    uitleg: 'Resultaat: winstgevendheid, groei van de toegevoegde waarde, ontwikkeling binnenlandse en buitenlandse afzet en innovatief resultaat (op de resultaatslide ook werkgelegenheid). Let op het verschil: innovatief GEDRAG hoort bij gedrag, innovatief RESULTAAT bij resultaat.',
    hint: 'Afzet is een uitkomst.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-11', week: 4, onderwerp: 'Structuur vs gedrag',
    vraag: 'AI-bedrijf DataNova brengt elk half jaar een nieuw taalmodel uit om bij te blijven bij de concurrentie. Bij welk onderdeel van het SGR-model hoort dit?',
    opties: ['Structuur: aard van het product', 'Gedrag: innovatief gedrag', 'Resultaat: innovatief resultaat', 'Structuur: kostenstructuur'],
    antwoord: 1,
    uitleg: 'Steeds nieuwe producten ontwikkelen om bij te blijven is wat de ondernemer DOET: innovatief gedrag (slides: AI-bedrijven zoals ChatGPT, Gemini en Copilot). Innovatief resultaat is de uitkomst daarvan voor de hele bedrijfstak, niet de activiteit zelf.',
    hint: 'Is het een handeling of een uitkomst?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-12', week: 4, onderwerp: 'SGR-model',
    vraag: 'In het SGR-model staan pijlen in twee richtingen tussen structuur, gedrag en resultaat. Wat betekent dat?',
    opties: [
      'De structuur bepaalt het gedrag en het resultaat, maar gedrag en resultaat kunnen de structuur ook weer veranderen.',
      'Structuur, gedrag en resultaat staan los van elkaar.',
      'Alleen het resultaat beïnvloedt de structuur.',
      'Het model geldt alleen voor monopolies.'
    ],
    antwoord: 0,
    uitleg: 'De pijlen gaan heen én terug: ze beïnvloeden elkaar. Een voorbeeld: een kostenleider met lage prijzen (gedrag) kan concurrenten uit de markt drijven, waardoor het aantal aanbieders (structuur) daalt. Ze staan dus niet los van elkaar.',
    hint: 'Kan gedrag de marktstructuur veranderen?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-13', week: 4, onderwerp: 'Cn-ratio',
    vraag: 'In de markt voor fietsen hebben de vijf grootste merken deze marktaandelen: 24%, 18%, 15%, 9% en 6%. Wat is de C3-ratio?',
    opties: ['42%', '57%', '66%', '72%'],
    antwoord: 1,
    uitleg: 'C3 = de marktaandelen van de 3 grootste aanbieders opgeteld: 24 + 18 + 15 = 57%. 66% is de C4 (57 + 9) en 72% de C5.',
    hint: 'Tel de drie grootste bij elkaar op.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-14', week: 4, onderwerp: 'Cn-ratio',
    vraag: 'In een markt hebben de grootste aanbieders deze marktaandelen: A 31%, B 22%, C 12%, D 8%, E 5%. Wat is de C4-ratio?',
    opties: ['65%', '73%', '78%', '53%'],
    antwoord: 1,
    uitleg: 'C4 = 31 + 22 + 12 + 8 = 73%. Dit betekent dat de 4 grootste spelers samen 73% van de markt in handen hebben. 65% is de C3 en 78% de C5.',
    hint: 'Precies 4 aanbieders optellen.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-15', week: 4, onderwerp: 'Cn-ratio',
    vraag: 'In een markt is de C4 30%. Welke conclusie mag je hieruit NIET trekken?',
    opties: [
      'De vier grootste aanbieders hebben samen 30% van de markt.',
      'De overige aanbieders hebben samen 70% van de markt.',
      'De overige 70% is verdeeld over vier middelgrote bedrijven.',
      'De vier grootste spelers hebben geen meerderheid van de markt.'
    ],
    antwoord: 2,
    uitleg: 'De Cn-ratio zegt niets over hoe de rest van de markt verdeeld is ("kleinschaligheid"): het kunnen ook heel veel kleine ondernemingen zijn die niches bedienen. Optie 1, 2 en 4 volgen wel direct uit een C4 van 30%.',
    hint: 'Wat weet je níet over de overige spelers?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-16', week: 4, onderwerp: 'Toegevoegde waarde',
    vraag: 'Een chipsfabrikant koopt bij de boer aardappelen in voor € 10 en verkoopt de chips voor € 35 aan de supermarkt. Wat is de toegevoegde waarde van de chipsfabrikant?',
    opties: ['€ 10', '€ 25', '€ 35', '€ 45'],
    antwoord: 1,
    uitleg: 'Toegevoegde waarde = verkoopwaarde – inkoopwaarde = € 35 – € 10 = € 25. € 35 is de verkoopwaarde zelf; daar zit de waarde van de ingekochte aardappelen nog in.',
    hint: 'Verkoop min inkoop.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-17', week: 4, onderwerp: 'Toegevoegde waarde',
    vraag: 'Een meubelmaker koopt hout in voor € 120 en verkoopt een tafel aan een woonwinkel voor € 450. De woonwinkel verkoopt de tafel aan een consument voor € 700. Wat is de toegevoegde waarde van de woonwinkel?',
    opties: ['€ 250', '€ 330', '€ 580', '€ 700'],
    antwoord: 0,
    uitleg: 'De woonwinkel koopt in voor € 450 en verkoopt voor € 700: toegevoegde waarde = 700 – 450 = € 250. € 330 is de toegevoegde waarde van de meubelmaker (450 – 120).',
    hint: 'Kijk alleen naar inkoop en verkoop van de woonwinkel.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-18', week: 4, onderwerp: 'Homogeen vs heterogeen',
    vraag: 'Welk product is het duidelijkst HOMOGEEN?',
    opties: ['Rijst van dezelfde soort en kwaliteit', 'Een merkhoodie van een streetwearlabel', 'Een smartphone', 'Een auto'],
    antwoord: 0,
    uitleg: 'Een homogeen product is bij alle aanbieders (vrijwel) gelijk, zoals rijst of graan. Een merkhoodie is heterogeen: klanten zien verschil tussen merken (slides: dure merkhoodie vs Zeeman-hoodie).',
    hint: 'Maakt het de klant uit van welke aanbieder het komt?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-19', week: 4, onderwerp: 'Kostenstructuur en toetredingsbarrières',
    vraag: 'Telecombedrijf Verbindt investeert miljarden in een eigen glasvezelnetwerk. Nieuwe aanbieders moeten hetzelfde doen om mee te kunnen doen. Welk structuurkenmerk zorgt hier voor een toetredingsbarrière?',
    opties: ['Kapitaalintensiteit', 'Buitenlandse vraag', 'Doorzichtigheid', 'Homogeen product'],
    antwoord: 0,
    uitleg: 'Als je enorme investeringen nodig hebt om te starten (slides: KPN investeert miljarden in digitale infrastructuur), is de bedrijfstak kapitaalintensief; dat is een toetredingsbarrière. Doorzichtigheid gaat over de beschikbaarheid van informatie, niet over investeringen.',
    hint: 'Hoeveel geld is nodig om te beginnen?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-20', week: 4, onderwerp: 'Kenmerken van de vraag',
    vraag: 'Een fabrikant van warmtepompen ziet de vraag snel stijgen, en een groot deel van de bestellingen komt uit het buitenland. Onder welk structuurkenmerk van het SGR-model valt dit?',
    opties: ['Kostenstructuur van de productie', 'Kenmerken van de vraag', 'Aantal aanbieders', 'Toetredingsbarrières'],
    antwoord: 1,
    uitleg: 'Kenmerken van de vraag: groei van de vraag, concentratie van de afnemers en buitenlandse vraag (slides: warmtepompen). Het gaat niet om de aanbieders of de kosten, maar om de afnemers.',
    hint: 'Het gaat over de afnemers.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-21', week: 4, onderwerp: 'Kenmerken van de vraag',
    vraag: 'Een producent van huismerk-koekjes verkoopt bijna alles aan een paar grote supermarktketens. Welk kenmerk van de vraag is hier van belang?',
    opties: ['Groei van de vraag', 'Buitenlandse vraag', 'Concentratie van de afnemers', 'Kapitaalintensiteit'],
    antwoord: 2,
    uitleg: 'Weinig, grote afnemers (supermarktketens) = een hoge concentratie van de afnemers, een kenmerk van de vraag. Kapitaalintensiteit hoort bij de kostenstructuur en de toetredingsbarrières, niet bij de vraag.',
    hint: 'Hoeveel afnemers zijn er?',
    bron: 'zelfgemaakt'
  }
);

QUESTIONS.push(
  {
    id: 'w4-22', week: 4, onderwerp: 'Marktvormen',
    vraag: 'Er zijn weinig aanbieders en het product is bij alle aanbieders vrijwel gelijk, zoals benzine. Welke marktvorm is dit?',
    opties: ['Homogeen oligopolie', 'Heterogeen oligopolie', 'Volledig vrije mededinging', 'Monopolistische concurrentie'],
    antwoord: 0,
    uitleg: 'Weinig aanbieders + homogeen product = homogeen oligopolie (slides: benzine). Een heterogeen oligopolie heeft ook weinig aanbieders, maar verschillende producten (zoals auto\'s).',
    hint: 'Aantal aanbieders × aard van het product.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-23', week: 4, onderwerp: 'Marktvormen',
    vraag: 'Een handvol grote automerken beheerst de markt; elk merk heeft eigen modellen, design en imago. Welke marktvorm is dit?',
    opties: ['Homogeen oligopolie', 'Heterogeen oligopolie', 'Monopolistische concurrentie', 'Monopolie'],
    antwoord: 1,
    uitleg: 'Weinig aanbieders + heterogeen product = heterogeen oligopolie (slides: automerken). Monopolistische concurrentie heeft ook een heterogeen product, maar dan met véél aanbieders.',
    hint: 'Weinig of veel aanbieders?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-24', week: 4, onderwerp: 'Marktvormen',
    vraag: 'Welke kenmerken horen bij volledig vrije mededinging?',
    opties: [
      'Veel aanbieders, homogeen product, volledige informatie, geen toetredingsbarrières',
      'Veel aanbieders, heterogeen product, onvolledige informatie, geringe toetredingsbarrières',
      'Weinig aanbieders, homogeen product, onvolledige informatie, toetredingsbarrières',
      'Eén aanbieder, homogeen product, volledige informatie, geen toetreding'
    ],
    antwoord: 0,
    uitleg: 'Volledig vrije mededinging (slides: graan): veel aanbieders, homogeen product, volledige informatie, geen toetredingsbarrières en lage vaste kosten. Optie 2 beschrijft monopolistische concurrentie (heterogeen product).',
    hint: 'Denk aan graan.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-25', week: 4, onderwerp: 'Marktvormen',
    vraag: 'Bij welke marktvorm is het resultaat "prijs gelijk aan minimale kosten" en "geen bedrijfswinst op lange termijn", en kan de aanbieder alleen de hoeveelheid aanpassen?',
    opties: ['Monopolie', 'Oligopolie', 'Volledig vrije mededinging', 'Monopolistische concurrentie'],
    antwoord: 2,
    uitleg: 'Bij volledig vrije mededinging past de aanbieder alleen de hoeveelheid aan (geen concurrentie met prijs) en is het resultaat: prijs gelijk aan minimale kosten en geen bedrijfswinst op lange termijn. Bij monopolistische concurrentie is de aanbieder juist een prijszetter met mogelijkheden voor ondernemerspremie.',
    hint: 'Bij welke marktvorm heeft één aanbieder geen invloed op de prijs?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-26', week: 4, onderwerp: 'Marktvormen',
    vraag: 'Bij welke marktvorm horen volgens de slides de gedragskenmerken "reactie op concurrenten" en "kartelvorming", en het resultaat "prijsstarheid"?',
    opties: ['Volledig vrije mededinging', 'Monopolistische concurrentie', 'Oligopolie', 'Monopolie'],
    antwoord: 2,
    uitleg: 'Bij een oligopolie zijn er weinig aanbieders die goed op elkaar letten (reactie op concurrenten), soms afspraken maken (kartelvorming), met als resultaat prijsstarheid en "wel winst, niet maximaal". Bij een monopolie is er geen concurrent om op te reageren.',
    hint: 'Weinig aanbieders die elkaar in de gaten houden.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-27', week: 4, onderwerp: 'Marktvormen',
    vraag: 'Welk resultaat hoort volgens de slides bij een monopolie?',
    opties: [
      'Prijs gelijk aan minimale kosten',
      'Winst op korte én lange termijn',
      'Geen bedrijfstakwinst op lange termijn',
      'Prijsstarheid; wel winst, niet maximaal'
    ],
    antwoord: 1,
    uitleg: 'Een monopolist (slides: ProRail) heeft geen concurrenten en er is geen toetreding, dus kan hij winst maken op korte én lange termijn. "Wel winst, niet maximaal" en prijsstarheid horen bij een oligopolie.',
    hint: 'Kan iemand de winst van een monopolist afpakken?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-28', week: 4, onderwerp: 'Marktvormen',
    vraag: 'Welke gedragskenmerken horen bij monopolistische concurrentie?',
    opties: [
      'Hoeveelheid aanpassen; geen concurrentie met prijs',
      'Prijszetter; concurrentie met prijs, product en reclame',
      'Winstmaximalisatie; limietprijzen',
      'Reactie op concurrenten; kartelvorming'
    ],
    antwoord: 1,
    uitleg: 'Bij monopolistische concurrentie heeft elk bedrijf een eigen (heterogeen) product en is het daardoor prijszetter; er wordt geconcurreerd met prijs, product en reclame. Winstmaximalisatie en limietprijzen horen bij een monopolie.',
    hint: 'Elk café heeft zijn eigen unieke aanbod …',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-29', week: 4, onderwerp: 'Structuur vs gedrag',
    vraag: 'Een student zet "winstmaximalisatie" in het SGR-schema van een monopolie bij de STRUCTUUR. Waarom is dat fout?',
    opties: [
      'Winstmaximalisatie is een resultaat, geen structuur.',
      'Winstmaximalisatie is ondernemersgedrag, geen kenmerk van de marktstructuur.',
      'Winstmaximalisatie komt bij een monopolie niet voor.',
      'Winstmaximalisatie hoort bij de kenmerken van de vraag.'
    ],
    antwoord: 1,
    uitleg: 'Winstmaximalisatie is iets wat de ondernemer nastreeft en doet: gedrag (de G). Het resultaat is de winst zelf ("winst op korte en lange termijn"). Daarom is ook optie 1 fout: het streven is gedrag, de behaalde winst is het resultaat.',
    hint: 'Streven of uitkomst?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-30', week: 4, onderwerp: 'Rivaliserend gedrag',
    vraag: 'Discounter Prijsvast is kostenleider, maar houdt zijn prijzen op hetzelfde niveau als de concurrenten. Wat is volgens de slides het gevolg?',
    opties: [
      'Concurrenten verlaten de markt (concentratie).',
      'Hoge winst(marge) voor de kostenleider en potentiële concurrentie (deconcentratie).',
      'Winsterosie in de hele bedrijfstak door prijsbederf.',
      'De markt wordt een monopolie.'
    ],
    antwoord: 1,
    uitleg: 'Kostenleiderschap met prijzen op of boven het niveau van concurrenten: hoge winst(marge) voor de kostenleider, en omdat de prijzen hoog blijven is toetreden aantrekkelijk: potentiële concurrentie (deconcentratie). Concurrenten die de markt verlaten en winsterosie horen bij prijzen ONDER het niveau van concurrenten.',
    hint: 'Let op: de prijzen zijn níet lager dan die van concurrenten.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-31', week: 4, onderwerp: 'Rivaliserend gedrag',
    vraag: 'Een techbedrijf brengt een compleet nieuw soort product op de markt, dat nog niemand anders heeft (productinnovatie). Welke marktvorm ontstaat volgens de slides door deze productdifferentiatie?',
    opties: ['Monopolistische concurrentie', 'Breed oligopolie', 'Monopolie', 'Volledig vrije mededinging'],
    antwoord: 2,
    uitleg: 'Productdifferentiatie met een nieuwe markt en een nieuw product (productinnovatie) leidt tot een monopolie: je bent (voorlopig) de enige aanbieder. Productdifferentiatie in bestaande markten (marktsegmentatie) leidt tot een heterogener product: monopolistische concurrentie of een breed oligopolie.',
    hint: 'Hoeveel aanbieders zijn er van een product dat nog niemand heeft?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-32', week: 4, onderwerp: 'Rivaliserend gedrag',
    vraag: 'Twee automerken richten zich met eigen modellen op verschillende marktsegmenten in een bestaande markt (marktsegmentatie). Wat is volgens de slides het gevolg voor de marktvorm?',
    opties: [
      'Een homogener product: volledig vrije mededinging',
      'Een heterogener product: monopolistische concurrentie of breed oligopolie',
      'Een monopolie',
      'Winsterosie door prijsbederf'
    ],
    antwoord: 1,
    uitleg: 'Productdifferentiatie in bestaande markten (marktsegmentatie) maakt het product heterogener; de markt wordt monopolistische concurrentie of een breed oligopolie (slides: BMW en Mercedes). Een monopolie ontstaat alleen bij een nieuwe markt met een nieuw product.',
    hint: 'Bestaande markt of nieuwe markt?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-33', week: 4, onderwerp: 'Toetredingsbarrières',
    vraag: 'Een luchtvaartmaatschappij koopt veel meer vliegtuigen dan ze nodig heeft, zodat ze nieuwe toetreders direct met lage prijzen en veel vluchten kan wegconcurreren. Welke toetredingsbarrière is dit en wat is het neveneffect?',
    opties: [
      'Limit pricing – gevaar van winsterosie',
      'Strategische overcapaciteit – hogere constante kosten',
      'Patenten – rendabele R&D-uitgaven',
      'Productdifferentiatie – vermindering prijsconcurrentie'
    ],
    antwoord: 1,
    uitleg: 'Meer capaciteit aanhouden dan nodig om toetreders af te schrikken = strategische overcapaciteit; het neveneffect zijn hogere constante kosten (die extra vliegtuigen kosten ook geld als ze stilstaan). Limit pricing gaat alleen over een lage prijs, niet over extra capaciteit.',
    hint: 'Meer capaciteit dan nodig …',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-34', week: 4, onderwerp: 'Toetredingsbarrières',
    vraag: 'Welke koppeling van toetredingsbarrière en neveneffect is JUIST volgens de slides?',
    opties: [
      'Patenten – hogere constante kosten',
      'Productdifferentiatie – vermindering prijsconcurrentie',
      'Limit pricing – marktmacht',
      'Voor- en achterwaartse integratie – gevaar van winsterosie'
    ],
    antwoord: 1,
    uitleg: 'De juiste koppelingen: limit pricing – gevaar van winsterosie; productdifferentiatie – vermindering prijsconcurrentie; patenten – rendabele R&D-uitgaven; voor- en achterwaartse integratie – marktmacht; strategische overcapaciteit – hogere constante kosten.',
    hint: 'Als producten verschillen, hoef je minder op prijs te concurreren.',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-35', week: 4, onderwerp: 'Toetredingsbarrières',
    vraag: 'Een farmaceutisch bedrijf laat een nieuw medicijn octrooieren (patent), zodat concurrenten het voorlopig niet mogen namaken. Wat is volgens de slides het neveneffect van deze toetredingsbarrière?',
    opties: ['Gevaar van winsterosie', 'Rendabele R&D-uitgaven', 'Hogere constante kosten', 'Vermindering van de vraag'],
    antwoord: 1,
    uitleg: 'Patenten – rendabele R&D-uitgaven: doordat niemand het medicijn mag namaken, kan het bedrijf zijn onderzoekskosten terugverdienen. Gevaar van winsterosie hoort bij limit pricing.',
    hint: 'Wat levert het onderzoek op als niemand mag kopiëren?',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-36', week: 4, onderwerp: 'Marktmacht vergroten',
    vraag: 'Een groot techbedrijf koopt een snelgroeiende startup met een populaire fotodelen-app, nog voordat die een echte concurrent kan worden. Welke manier om marktmacht te vergroten is dit?',
    opties: ['Gekoppelde diensten leveren', 'Patentenstelsel', 'Overname van nieuwkomers', 'Limit pricing'],
    antwoord: 2,
    uitleg: 'Een veelbelovende nieuwkomer overnemen voordat die gevaarlijk wordt = overname van nieuwkomers (slides: Facebook met Instagram en WhatsApp). Gekoppelde diensten leveren betekent dat je diensten aan elkaar koppelt om klanten te binden (zoals Google).',
    hint: 'De nieuwkomer verdwijnt als concurrent door …',
    bron: 'zelfgemaakt'
  },
  {
    id: 'w4-37', week: 4, onderwerp: 'Marktmacht vergroten',
    vraag: 'Een techbedrijf zorgt dat zijn zoekmachine, e-mail, agenda, kaarten en cloudopslag naadloos samenwerken met één account, zodat klanten niet snel overstappen. Welke manier om marktmacht te vergroten is dit?',
    opties: ['Overname van nieuwkomers', 'Gekoppelde diensten leveren', 'Marktmacht uitbuiten', 'Strategische overcapaciteit'],
    antwoord: 1,
    uitleg: 'Diensten aan elkaar koppelen zodat klanten aan je gebonden zijn = gekoppelde diensten leveren (slides: Google). Overname van nieuwkomers gaat over het opkopen van nieuwe concurrenten.',
    hint: 'Alles werkt samen met één account.',
    bron: 'zelfgemaakt'
  }
);
