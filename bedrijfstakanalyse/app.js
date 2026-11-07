/* Oefensite "De meso-omgeving – Bedrijfstakanalyse" – geen build-stap, geen backend. */
(function () {
  'use strict';

  var QS = window.QUESTIONS || [];
  var FC = window.FLASHCARDS || [];
  var BY_ID = {};
  QS.forEach(function (q) { BY_ID[q.id] = q; });

  var STORE_KEY = 'bta-oefensite-v1';
  var LETTERS = ['A', 'B', 'C', 'D'];
  var WEEKS = [1, 2, 3, 4];
  var WEEK_INFO = {
    1: { titel: 'Week 1', datum: '8 okt', stof: 'ABCD-analyse, 6 W\'s van Ferrell, bedrijfstakanalyse, DESTEP, marktomvang en marktaandeel, productlevenscyclus, conjunctuur en seizoen, vijfkrachtenmodel.' },
    2: { titel: 'Week 2', datum: '12 okt', stof: 'Concurrentie vs concurrenten, rivaal- en partnerbenadering, stappenplan concurrentieanalyse, concurrentieniveaus, identificatiemethoden, distributieanalyse en distributie-intensiteit.' },
    3: { titel: 'Week 3', datum: '26 okt', stof: 'Sectoren, SBI-indeling, bedrijfstak en bedrijfskolom, horizontale concentratie, integratie, parallellisatie, diversificatie, conglomeratie, specialisatie, samenwerkingsvormen, kartels, soorten concurrentie.' },
    4: { titel: 'Week 4', datum: '4 nov', stof: 'SGR-model, Cn-ratio, toegevoegde waarde, marktvormen met hun SGR-kenmerken, kostenleiderschap, productdifferentiatie, toetredingsbarrières, marktmacht.' }
  };
  // Verdeling van de toetssimulatie volgens de toetsmatrijs op de slides:
  // LD1 (ABCD, week 1+2) 18 vragen, LD2+LD3 (week 3) 12 vragen, LD4 (week 4) 10 vragen.
  var TOETS_VERDELING = { 1: 9, 2: 9, 3: 12, 4: 10 };
  var TOETS_N = 40;
  var CESUUR = 27; // 67,5%: minimaal 27 van 40 goed voor een 5,5

  /* ---------------- Opslag (localStorage) ---------------- */
  function defaultState() {
    return { stats: {}, fouten: {}, toetsen: [], kaarten: {}, scope: 'alle', aantal: '20', alleenOnbekend: false };
  }
  function load() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        var d = JSON.parse(raw);
        var s = defaultState();
        Object.keys(s).forEach(function (k) { if (d && d[k] !== undefined) s[k] = d[k]; });
        // opruimen: vragen die niet meer bestaan
        Object.keys(s.fouten).forEach(function (id) { if (!BY_ID[id]) delete s.fouten[id]; });
        return s;
      }
    } catch (e) { /* geen opslag beschikbaar: gewoon doorgaan */ }
    return defaultState();
  }
  var state = load();
  function save() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* negeren */ }
    updateNavCount();
  }

  /** Verwerkt een antwoord in de statistiek en de foutenlijst. Geeft de foutenlijst-status terug. */
  function registreer(q, goed) {
    var s = state.stats[q.id] || { goed: 0, fout: 0, laatst: null };
    if (goed) s.goed++; else s.fout++;
    s.laatst = goed;
    state.stats[q.id] = s;
    var status = null;
    if (!goed) {
      state.fouten[q.id] = 0;
      status = { type: 'toegevoegd' };
    } else if (Object.prototype.hasOwnProperty.call(state.fouten, q.id)) {
      state.fouten[q.id] += 1;
      if (state.fouten[q.id] >= 2) { delete state.fouten[q.id]; status = { type: 'opgelost' }; }
      else status = { type: 'reeks', reeks: state.fouten[q.id] };
    }
    save();
    return status;
  }

  /* ---------------- Hulpfuncties ---------------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }
  function nl(n, dec) { return n.toFixed(dec).replace('.', ','); }
  function inScope(week) { return state.scope === 'alle' || String(week) === String(state.scope); }
  function scopeLabel() { return state.scope === 'alle' ? 'Alle stof' : 'Week ' + state.scope; }
  function foutIds() { return Object.keys(state.fouten).filter(function (id) { return BY_ID[id]; }); }
  function cijfer(score, n) {
    var c = Math.round(CESUUR * n / TOETS_N);
    var g = score >= c ? 5.5 + (score - c) * 4.5 / (n - c) : 1 + score * 4.5 / c;
    return Math.round(Math.max(1, Math.min(10, g)) * 10) / 10;
  }
  function fmtTijd(ms) {
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60);
    return m + ':' + String(s % 60).padStart(2, '0');
  }
  function fmtDatum(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }) + ' ' +
      d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  }
  var app = document.getElementById('app');
  function render(html) {
    app.innerHTML = html;
    window.scrollTo(0, 0);
  }
  function updateNavCount() {
    var el = document.getElementById('nav-fouten');
    if (el) el.textContent = foutIds().length || '';
  }
  function setNav(name) {
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === name) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  function bar(p, cls) {
    return '<div class="bar ' + (cls || '') + '" role="img" aria-label="' + p + '%"><span style="width:' + p + '%"></span></div>';
  }
  var ICONS = {
    oefen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    toets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M9 2h6"/></svg>',
    fouten: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    kaarten: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 2h12a2 2 0 0 1 2 2v12"/></svg>'
  };

  /* ---------------- Startscherm ---------------- */
  function viewHome() {
    setNav('home');
    var pool = QS.filter(function (q) { return inScope(q.week); });
    var fouten = foutIds();
    var foutenInScope = fouten.filter(function (id) { return inScope(BY_ID[id].week); });
    var kaarten = FC.filter(function (f) { return inScope(f.week); });

    var scopeBtns = WEEKS.map(function (w) {
      return '<button type="button" data-scope="' + w + '" aria-pressed="' + (String(state.scope) === String(w)) + '">Week ' + w + '</button>';
    }).join('') + '<button type="button" data-scope="alle" aria-pressed="' + (state.scope === 'alle') + '">Alle stof</button>';

    var info = state.scope === 'alle'
      ? 'Alle ' + QS.length + ' vragen van week 1 t/m 4.'
      : WEEK_INFO[state.scope].titel + ' (' + WEEK_INFO[state.scope].datum + ', ' + pool.length + ' vragen): ' + WEEK_INFO[state.scope].stof;

    var aantalBtns = ['10', '20', 'alle'].map(function (a) {
      return '<button type="button" data-aantal="' + a + '" aria-pressed="' + (state.aantal === a) + '">' + (a === 'alle' ? 'Alle (' + pool.length + ')' : a) + '</button>';
    }).join('');

    var lopend = toets && !toets.klaar
      ? '<button class="btn" data-act="toets-verder">Ga verder (' + toets.items.filter(function (it) { return it.gekozen !== null; }).length + '/' + TOETS_N + ')</button>'
      : '';

    // Voortgang per week
    var rows = WEEKS.map(function (w) {
      var qs = QS.filter(function (q) { return q.week === w; });
      var goed = qs.filter(function (q) { return state.stats[q.id] && state.stats[q.id].laatst === true; }).length;
      var p = pct(goed, qs.length);
      return '<div class="progress-row"><span>Week ' + w + '</span>' + bar(p, 'good') + '<span class="num">' + goed + '/' + qs.length + '</span></div>';
    }).join('');

    var hist = state.toetsen.slice(-5).reverse().map(function (t) {
      return '<li><span>' + esc(fmtDatum(t.datum)) + '</span><span>' + t.score + '/' + t.n + ' · <b>' + nl(t.cijfer, 1) + '</b></span></li>';
    }).join('');

    render(
      '<section class="hero">' +
        '<h1>Oefenen voor de toets Bedrijfstakanalyse</h1>' +
        '<p>De meso-omgeving (ENTECO02J1) · digitale toets van 40 meerkeuzevragen. Alle vragen en uitleg zijn gebaseerd op de slides van week 1 t/m 4.</p>' +
      '</section>' +

      '<section class="card" aria-labelledby="kies-stof">' +
        '<h2 id="kies-stof">Kies je stof</h2>' +
        '<div class="seg" role="group" aria-label="Kies week">' + scopeBtns + '</div>' +
        '<p class="scope-info">' + esc(info) + '</p>' +
      '</section>' +

      '<section class="modes">' +
        '<div class="card mode">' +
          '<h2><span class="mode-icon">' + ICONS.oefen + '</span>Oefenen</h2>' +
          '<p>Eén vraag tegelijk, direct feedback met uitleg en een hint als je vastzit. Stof: <b>' + esc(scopeLabel()) + '</b>.</p>' +
          '<div class="inline-opts" role="group" aria-label="Aantal vragen">Aantal: ' + aantalBtns + '</div>' +
          '<button class="btn btn-primary" data-act="oefen">Start oefenen</button>' +
        '</div>' +
        '<div class="card mode">' +
          '<h2><span class="mode-icon">' + ICONS.toets + '</span>Toetssimulatie</h2>' +
          '<p>40 willekeurige vragen over alle weken, verdeeld zoals de toetsmatrijs (9 · 9 · 12 · 10 per week). Geen tussentijdse feedback; aan het eind je cijfer (5,5 bij 27 goed).</p>' +
          '<div class="btn-row"><button class="btn btn-primary" data-act="toets">' + (lopend ? 'Nieuwe toets' : 'Start toets') + '</button>' + lopend + '</div>' +
        '</div>' +
        '<div class="card mode">' +
          '<h2><span class="mode-icon">' + ICONS.fouten + '</span>Foutenlijst</h2>' +
          '<p>Fout beantwoorde vragen komen terug tot je ze 2× achter elkaar goed hebt. Nu: <b>' + fouten.length + '</b> vragen' +
            (state.scope !== 'alle' ? ' (' + foutenInScope.length + ' in ' + esc(scopeLabel()) + ')' : '') + '.</p>' +
          '<div class="btn-row"><button class="btn btn-primary" data-act="fouten-oefen"' + (foutenInScope.length ? '' : ' disabled') + '>Oefen fouten</button>' +
          '<a class="btn" href="#fouten">Bekijk lijst</a></div>' +
        '</div>' +
        '<div class="card mode">' +
          '<h2><span class="mode-icon">' + ICONS.kaarten + '</span>Flashcards</h2>' +
          '<p>De belangrijkste begrippen: voorkant begrip, achterkant uitleg en voorbeeld. ' + kaarten.length + ' kaarten voor ' + esc(scopeLabel()) + '.</p>' +
          '<a class="btn btn-primary" href="#kaarten">Start flashcards</a>' +
        '</div>' +
      '</section>' +

      '<section class="card" aria-labelledby="voortgang">' +
        '<h2 id="voortgang">Je voortgang</h2>' +
        '<p class="small muted">Aantal vragen dat je de laatste keer goed had.</p>' +
        '<div class="progress-list">' + rows + '</div>' +
        (hist ? '<h3 style="margin-top:16px">Laatste toetssimulaties</h3><ul class="history">' + hist + '</ul>' : '') +
        '<div class="btn-row end" style="margin-top:14px"><button class="btn btn-ghost btn-danger" data-act="reset">Voortgang wissen</button></div>' +
      '</section>'
    );

    app.querySelectorAll('[data-scope]').forEach(function (b) {
      b.addEventListener('click', function () { state.scope = b.getAttribute('data-scope'); save(); viewHome(); });
    });
    app.querySelectorAll('[data-aantal]').forEach(function (b) {
      b.addEventListener('click', function () { state.aantal = b.getAttribute('data-aantal'); save(); viewHome(); });
    });
    on('[data-act="oefen"]', function () { startOefen('oefen'); });
    on('[data-act="fouten-oefen"]', function () { startOefen('fouten'); });
    on('[data-act="toets"]', function () {
      if (toets && !toets.klaar) bevestig('Je hebt nog een toetssimulatie open. Als je een nieuwe start, gaat die verloren.', 'Nieuwe toets starten', startToets);
      else startToets();
    });
    on('[data-act="toets-verder"]', function () { go('#toets'); });
    on('[data-act="reset"]', function () {
      bevestig('Al je voortgang, de foutenlijst, je toetsresultaten en de gekende flashcards worden gewist.', 'Alles wissen', function () {
        var scope = state.scope;
        state = defaultState();
        state.scope = scope;
        save();
        viewHome();
      });
    });
  }
  function on(sel, fn) {
    var el = app.querySelector(sel);
    if (el) el.addEventListener('click', fn);
  }
  function go(hash) {
    if (location.hash === hash) route(); else location.hash = hash;
  }

  /* Eigen bevestigingsvenster: confirm() en alert() werken niet overal (bijv. in een ingesloten pagina). */
  function venster(tekst, okLabel, opOk, annuleerLabel) {
    var oud = document.querySelector('.overlay');
    if (oud) oud.remove();
    var vorige = document.activeElement;
    var ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = '<div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-tekst">' +
      '<p id="dlg-tekst">' + esc(tekst) + '</p>' +
      '<div class="btn-row end">' +
        (annuleerLabel ? '<button type="button" class="btn" data-dlg="nee">' + esc(annuleerLabel) + '</button>' : '') +
        '<button type="button" class="btn btn-primary" data-dlg="ja">' + esc(okLabel) + '</button>' +
      '</div></div>';
    function sluit() {
      ov.remove();
      document.removeEventListener('keydown', toets_, true);
      if (vorige && vorige.focus && document.body.contains(vorige)) vorige.focus();
    }
    function toets_(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); sluit(); }
    }
    document.body.appendChild(ov);
    document.addEventListener('keydown', toets_, true);
    ov.addEventListener('click', function (e) { if (e.target === ov) sluit(); });
    var nee = ov.querySelector('[data-dlg="nee"]');
    if (nee) nee.addEventListener('click', sluit);
    var ja = ov.querySelector('[data-dlg="ja"]');
    ja.addEventListener('click', function () { sluit(); if (opOk) opOk(); });
    ja.focus();
  }
  function bevestig(tekst, okLabel, opOk) { venster(tekst, okLabel, opOk, 'Annuleren'); }
  function melding(tekst) { venster(tekst, 'Oké', null, null); }

  /* ---------------- Oefenmodus en foutenlijst-modus ---------------- */
  var oefen = null;

  function maakItem(q) {
    return { id: q.id, order: shuffle([0, 1, 2, 3]), gekozen: null, goed: null, hint: false, status: null };
  }

  function startOefen(mode, ids) {
    var pool;
    if (ids) pool = ids.map(function (id) { return BY_ID[id]; }).filter(Boolean);
    else if (mode === 'fouten') pool = foutIds().map(function (id) { return BY_ID[id]; }).filter(function (q) { return inScope(q.week); });
    else pool = QS.filter(function (q) { return inScope(q.week); });
    pool = shuffle(pool);
    if (mode === 'oefen' && !ids && state.aantal !== 'alle') pool = pool.slice(0, Number(state.aantal));
    if (!pool.length) { melding('Er zijn geen vragen voor deze keuze.'); return; }
    oefen = { mode: mode, items: pool.map(maakItem), i: 0, klaar: false };
    go('#oefenen');
  }

  function metaChips(q, extra) {
    var html = '<span class="chip accent">Week ' + q.week + '</span><span class="chip">' + esc(q.onderwerp) + '</span>';
    if (q.bron === 'slides') html += '<span class="chip">Officiële oefenvraag</span>';
    if (q.onbevestigd) html += '<span class="chip warn">Antwoord niet officieel bevestigd</span>';
    return '<div class="meta">' + html + (extra || '') + '</div>';
  }

  function bronTekst(q) {
    return q.bron === 'slides'
      ? 'Bron: officiële oefenvraag (' + esc(q.bronDetail || 'slides') + ')' + (q.onbevestigd ? ' – antwoord niet officieel bevestigd' : '')
      : 'Bron: zelfgemaakte vraag op basis van de slides';
  }

  function viewOefen(keepScroll) {
    setNav(oefen && oefen.mode === 'fouten' ? 'fouten' : 'home');
    if (!oefen) { go('#start'); return; }
    if (oefen.klaar) { viewOefenEind(); return; }
    var n = oefen.items.length;
    var item = oefen.items[oefen.i];
    var q = BY_ID[item.id];
    var beantwoord = item.gekozen !== null;
    var aantalGoed = oefen.items.filter(function (it) { return it.goed === true; }).length;
    var correctPos = item.order.indexOf(q.antwoord);

    var extra = '';
    if (oefen.mode === 'fouten' || Object.prototype.hasOwnProperty.call(state.fouten, q.id)) {
      var r = state.fouten[q.id];
      if (r !== undefined && !beantwoord) extra = '<span class="chip bad">Foutenlijst · ' + r + '/2 goed op rij</span>';
    }

    var opts = item.order.map(function (oi, k) {
      var cls = 'opt';
      if (beantwoord) {
        if (k === correctPos) cls += ' correct';
        else if (k === item.gekozen) cls += ' wrong';
        else cls += ' dim';
      }
      return '<li><button type="button" class="' + cls + '" data-k="' + k + '"' + (beantwoord ? ' disabled' : '') + '>' +
        '<span class="letter">' + LETTERS[k] + '</span><span>' + esc(q.opties[oi]) + '</span></button></li>';
    }).join('');

    var hint = '';
    if (item.hint) hint = '<div class="hint"><b>Hint:</b> ' + esc(q.hint) + '</div>';

    var feedback = '';
    if (beantwoord) {
      var st = item.status;
      var stTekst = '';
      if (st && st.type === 'toegevoegd') stTekst = 'Deze vraag staat nu op je foutenlijst. Hij komt terug tot je hem 2× achter elkaar goed hebt.';
      else if (st && st.type === 'reeks') stTekst = 'Foutenlijst: ' + st.reeks + ' van 2 keer goed op rij. Nog 1× goed en hij gaat van de lijst.';
      else if (st && st.type === 'opgelost') stTekst = '2× achter elkaar goed: deze vraag is van je foutenlijst gehaald.';
      feedback = '<div class="feedback ' + (item.goed ? 'good' : 'bad') + '" id="feedback" tabindex="-1">' +
        '<h3>' + (item.goed ? 'Goed!' : 'Helaas – het juiste antwoord is ' + LETTERS[correctPos] + '.') + '</h3>' +
        (item.goed ? '' : '<p><b>' + LETTERS[correctPos] + ':</b> ' + esc(q.opties[q.antwoord]) + '</p>') +
        '<p>' + esc(q.uitleg) + '</p>' +
        (stTekst ? '<p class="small"><b>' + esc(stTekst) + '</b></p>' : '') +
        '<p class="src">' + bronTekst(q) + '</p>' +
      '</div>';
    }

    var laatste = oefen.i === n - 1;
    var knoppen = beantwoord
      ? '<button class="btn btn-primary btn-block" data-act="volgende">' + (laatste ? 'Bekijk resultaat' : 'Volgende vraag →') + '</button>'
      : '<div class="btn-row">' + (item.hint ? '' : '<button class="btn" data-act="hint">Toon hint</button>') +
        '<button class="btn btn-ghost" data-act="sla-over">Sla over</button></div>';

    var html =
      '<div class="session-head">' +
        '<a class="btn btn-ghost" href="#start">← Stoppen</a>' +
        '<span class="stat">' + (oefen.mode === 'fouten' ? 'Foutenlijst · ' : '') + 'Vraag ' + (oefen.i + 1) + '/' + n + ' · ' + aantalGoed + ' goed</span>' +
      '</div>' +
      '<div class="progress"><span style="width:' + pct(oefen.i + (beantwoord ? 1 : 0), n) + '%"></span></div>' +
      '<article class="card">' +
        metaChips(q, extra) +
        '<p class="qtext">' + esc(q.vraag) + '</p>' +
        '<ol class="options">' + opts + '</ol>' +
        hint + feedback + knoppen +
        '<p class="kbd-hint">Toetsen: 1–4 of A–D kiezen · H hint · Enter volgende</p>' +
      '</article>';

    if (keepScroll) app.innerHTML = html; else render(html);

    app.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () { kiesOefen(Number(b.getAttribute('data-k'))); });
    });
    on('[data-act="hint"]', function () { item.hint = true; viewOefen(true); });
    on('[data-act="sla-over"]', volgendeOefen);
    on('[data-act="volgende"]', volgendeOefen);
    if (beantwoord) {
      var fb = document.getElementById('feedback');
      if (fb && fb.scrollIntoView) fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      var nb = app.querySelector('[data-act="volgende"]');
      if (nb) nb.focus({ preventScroll: true });
    }
  }

  function kiesOefen(k) {
    var item = oefen.items[oefen.i];
    if (item.gekozen !== null) return;
    var q = BY_ID[item.id];
    item.gekozen = k;
    item.goed = item.order[k] === q.antwoord;
    item.status = registreer(q, item.goed);
    viewOefen(true);
  }

  function volgendeOefen() {
    if (oefen.i < oefen.items.length - 1) { oefen.i++; viewOefen(); }
    else { oefen.klaar = true; viewOefenEind(); }
  }

  function viewOefenEind() {
    var items = oefen.items;
    var beantwoord = items.filter(function (it) { return it.gekozen !== null; });
    var goed = beantwoord.filter(function (it) { return it.goed; }).length;
    var fout = beantwoord.filter(function (it) { return !it.goed; });
    var overgeslagen = items.length - beantwoord.length;
    var lijst = fout.map(function (it) {
      var q = BY_ID[it.id];
      return '<div class="review"><div class="meta"><span class="chip accent">Week ' + q.week + '</span><span class="chip">' + esc(q.onderwerp) + '</span></div>' +
        '<p><b>' + esc(q.vraag) + '</b></p>' +
        '<p class="ans"><b>Juiste antwoord:</b> ' + esc(q.opties[q.antwoord]) + '</p>' +
        '<p class="small muted">' + esc(q.uitleg) + '</p></div>';
    }).join('');
    var nogFout = foutIds().filter(function (id) { return inScope(BY_ID[id].week); }).length;

    render(
      '<section class="card">' +
        '<h1>' + (oefen.mode === 'fouten' ? 'Foutenlijst-ronde klaar' : 'Ronde klaar') + '</h1>' +
        '<div class="grade"><div class="grade-num ' + (pct(goed, beantwoord.length) >= 67.5 ? 'pass' : 'fail') + '">' + goed + '/' + beantwoord.length + '</div>' +
        '<div><p><b>' + pct(goed, beantwoord.length) + '%</b> goed' + (overgeslagen ? ' · ' + overgeslagen + ' overgeslagen' : '') + '</p>' +
        '<p class="small muted">Op je foutenlijst (' + esc(scopeLabel()) + '): ' + nogFout + ' vragen.</p></div></div>' +
        '<div class="btn-row" style="margin-top:14px">' +
          (fout.length ? '<button class="btn btn-primary" data-act="opnieuw-fout">Fouten uit deze ronde opnieuw (' + fout.length + ')</button>' : '') +
          '<button class="btn" data-act="nieuw">Nieuwe ronde</button>' +
          '<a class="btn btn-ghost" href="#start">Naar start</a>' +
        '</div>' +
      '</section>' +
      (lijst ? '<section class="card"><h2>Fout beantwoord</h2>' + lijst + '</section>' : '')
    );
    on('[data-act="opnieuw-fout"]', function () { startOefen('oefen', fout.map(function (it) { return it.id; })); });
    on('[data-act="nieuw"]', function () { startOefen(oefen.mode); });
  }

  /* ---------------- Foutenlijst-overzicht ---------------- */
  function viewFouten() {
    setNav('fouten');
    var ids = foutIds();
    var inS = ids.filter(function (id) { return inScope(BY_ID[id].week); })
      .sort(function (a, b) { return BY_ID[a].week - BY_ID[b].week || a.localeCompare(b); });
    var scopeBtns = WEEKS.map(function (w) {
      var c = ids.filter(function (id) { return BY_ID[id].week === w; }).length;
      return '<button type="button" data-scope="' + w + '" aria-pressed="' + (String(state.scope) === String(w)) + '">Week ' + w + ' (' + c + ')</button>';
    }).join('') + '<button type="button" data-scope="alle" aria-pressed="' + (state.scope === 'alle') + '">Alle (' + ids.length + ')</button>';

    var lijst = inS.map(function (id) {
      var q = BY_ID[id];
      var r = state.fouten[id];
      return '<li><div><div class="meta"><span class="chip accent">Week ' + q.week + '</span><span class="chip">' + esc(q.onderwerp) + '</span></div>' +
        esc(q.vraag.length > 160 ? q.vraag.slice(0, 157) + '…' : q.vraag) + '</div>' +
        '<span class="dots" title="' + r + ' van 2 keer goed op rij" aria-label="' + r + ' van 2 keer goed op rij"><i class="' + (r >= 1 ? 'on' : '') + '"></i><i></i></span></li>';
    }).join('');

    render(
      '<section class="hero"><h1>Foutenlijst</h1>' +
        '<p>Elke vraag die je fout beantwoordt (bij oefenen of in de toetssimulatie) komt hier. Heb je hem 2× achter elkaar goed, dan verdwijnt hij van de lijst. Een nieuwe fout zet de teller weer op 0.</p></section>' +
      '<section class="card">' +
        '<div class="seg" role="group" aria-label="Kies week">' + scopeBtns + '</div>' +
        (inS.length
          ? '<button class="btn btn-primary" data-act="fouten-oefen" style="margin:6px 0 14px">Oefen deze ' + inS.length + ' vragen</button><ul class="flist">' + lijst + '</ul>'
          : '<p class="muted" style="margin-top:8px">Geen vragen op je foutenlijst voor deze keuze. Goed bezig!</p>') +
      '</section>'
    );
    app.querySelectorAll('[data-scope]').forEach(function (b) {
      b.addEventListener('click', function () { state.scope = b.getAttribute('data-scope'); save(); viewFouten(); });
    });
    on('[data-act="fouten-oefen"]', function () { startOefen('fouten'); });
  }

  /* ---------------- Toetssimulatie ---------------- */
  var toets = null;
  var timerId = null;

  function startToets() {
    var gekozen = [];
    WEEKS.forEach(function (w) {
      var pool = shuffle(QS.filter(function (q) { return q.week === w; }));
      gekozen = gekozen.concat(pool.slice(0, TOETS_VERDELING[w]));
    });
    if (gekozen.length < TOETS_N) { // vangnet als een week te weinig vragen heeft
      var rest = shuffle(QS.filter(function (q) { return gekozen.indexOf(q) < 0; }));
      gekozen = gekozen.concat(rest.slice(0, TOETS_N - gekozen.length));
    }
    toets = {
      items: shuffle(gekozen).map(function (q) { return { id: q.id, order: shuffle([0, 1, 2, 3]), gekozen: null, goed: null }; }),
      i: 0, start: Date.now(), eind: null, klaar: false
    };
    go('#toets');
  }

  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  function viewToets(keepScroll) {
    setNav('home');
    if (!toets) { go('#start'); return; }
    if (toets.klaar) { viewToetsResultaat(); return; }
    var n = toets.items.length;
    var item = toets.items[toets.i];
    var q = BY_ID[item.id];
    var aantalBeantwoord = toets.items.filter(function (it) { return it.gekozen !== null; }).length;

    var opts = item.order.map(function (oi, k) {
      return '<li><button type="button" class="opt' + (item.gekozen === k ? ' selected' : '') + '" data-k="' + k + '" aria-pressed="' + (item.gekozen === k) + '">' +
        '<span class="letter">' + LETTERS[k] + '</span><span>' + esc(q.opties[oi]) + '</span></button></li>';
    }).join('');

    var grid = toets.items.map(function (it, idx) {
      var cls = (it.gekozen !== null ? 'answered' : '') + (idx === toets.i ? ' current' : '');
      return '<button type="button" class="' + cls + '" data-ga="' + idx + '" aria-label="Vraag ' + (idx + 1) + (it.gekozen !== null ? ', beantwoord' : '') + '">' + (idx + 1) + '</button>';
    }).join('');

    var html =
      '<div class="session-head">' +
        '<a class="btn btn-ghost" href="#start">← Start</a>' +
        '<span class="stat">Vraag ' + (toets.i + 1) + '/' + n + ' · beantwoord ' + aantalBeantwoord + '/' + n + ' · <span id="timer">' + fmtTijd(Date.now() - toets.start) + '</span></span>' +
      '</div>' +
      '<div class="progress"><span style="width:' + pct(aantalBeantwoord, n) + '%"></span></div>' +
      '<article class="card">' +
        '<div class="meta"><span class="chip">Toetssimulatie · vraag ' + (toets.i + 1) + '</span></div>' +
        '<p class="qtext">' + esc(q.vraag) + '</p>' +
        '<ol class="options">' + opts + '</ol>' +
        '<div class="btn-row" style="justify-content:space-between">' +
          '<button class="btn" data-act="vorige"' + (toets.i === 0 ? ' disabled' : '') + '>← Vorige</button>' +
          (toets.i < n - 1
            ? '<button class="btn btn-primary" data-act="volgende">Volgende →</button>'
            : '<button class="btn btn-primary" data-act="inleveren">Inleveren</button>') +
        '</div>' +
        '<p class="kbd-hint">Toetsen: 1–4 of A–D kiezen · ← → bladeren</p>' +
      '</article>' +
      '<section class="card">' +
        '<h2>Overzicht</h2>' +
        '<div class="qgrid">' + grid + '</div>' +
        '<div class="btn-row end" style="margin-top:14px"><button class="btn btn-primary" data-act="inleveren">Inleveren (' + aantalBeantwoord + '/' + n + ')</button></div>' +
      '</section>';

    if (keepScroll) app.innerHTML = html; else render(html);

    app.querySelectorAll('.opt').forEach(function (b) {
      b.addEventListener('click', function () { kiesToets(Number(b.getAttribute('data-k'))); });
    });
    app.querySelectorAll('[data-ga]').forEach(function (b) {
      b.addEventListener('click', function () { toets.i = Number(b.getAttribute('data-ga')); viewToets(); });
    });
    on('[data-act="vorige"]', function () { if (toets.i > 0) { toets.i--; viewToets(); } });
    on('[data-act="volgende"]', function () { if (toets.i < n - 1) { toets.i++; viewToets(); } });
    app.querySelectorAll('[data-act="inleveren"]').forEach(function (b) { b.addEventListener('click', inleveren); });

    stopTimer();
    timerId = setInterval(function () {
      var t = document.getElementById('timer');
      if (t && toets && !toets.klaar) t.textContent = fmtTijd(Date.now() - toets.start); else stopTimer();
    }, 1000);
  }

  function kiesToets(k) {
    var item = toets.items[toets.i];
    item.gekozen = item.gekozen === k ? null : k; // nog een keer tikken = antwoord weghalen
    viewToets(true);
  }

  function inleveren() {
    var open = toets.items.filter(function (it) { return it.gekozen === null; }).length;
    var vraag = open
      ? 'Je hebt nog ' + open + ' ' + (open === 1 ? 'vraag' : 'vragen') + ' niet beantwoord. Die tellen als fout.'
      : 'Je hebt alle vragen beantwoord. Daarna kun je niets meer veranderen.';
    bevestig(vraag, open ? 'Toch inleveren' : 'Inleveren', leverIn);
  }

  function leverIn() {
    stopTimer();
    toets.eind = Date.now();
    var score = 0;
    toets.items.forEach(function (it) {
      var q = BY_ID[it.id];
      it.goed = it.gekozen !== null && it.order[it.gekozen] === q.antwoord;
      if (it.goed) score++;
      registreer(q, it.goed);
    });
    toets.score = score;
    toets.cijfer = cijfer(score, toets.items.length);
    toets.klaar = true;
    state.toetsen.push({ datum: toets.eind, score: score, n: toets.items.length, cijfer: toets.cijfer, duur: toets.eind - toets.start });
    if (state.toetsen.length > 30) state.toetsen = state.toetsen.slice(-30);
    save();
    viewToetsResultaat();
  }

  function viewToetsResultaat() {
    setNav('home');
    var n = toets.items.length;
    var c = Math.round(CESUUR * n / TOETS_N);
    var geslaagd = toets.score >= c;

    var perWeek = {};
    var perOnd = {};
    toets.items.forEach(function (it) {
      var q = BY_ID[it.id];
      perWeek[q.week] = perWeek[q.week] || { goed: 0, n: 0 };
      perWeek[q.week].n++; if (it.goed) perWeek[q.week].goed++;
      var key = q.week + '|' + q.onderwerp;
      perOnd[key] = perOnd[key] || { week: q.week, onderwerp: q.onderwerp, goed: 0, n: 0 };
      perOnd[key].n++; if (it.goed) perOnd[key].goed++;
    });
    var weekRows = WEEKS.filter(function (w) { return perWeek[w]; }).map(function (w) {
      var s = perWeek[w]; var p = pct(s.goed, s.n);
      return '<tr><td>Week ' + w + '</td><td class="barcell">' + bar(p, p >= 67.5 ? 'good' : 'bad') + '</td><td class="num">' + s.goed + '/' + s.n + ' (' + p + '%)</td></tr>';
    }).join('');
    var ondRows = Object.keys(perOnd).map(function (k) { return perOnd[k]; })
      .sort(function (a, b) { return a.week - b.week || (a.goed / a.n) - (b.goed / b.n) || a.onderwerp.localeCompare(b.onderwerp); })
      .map(function (s) {
        var p = pct(s.goed, s.n);
        return '<tr><td><span class="chip accent">W' + s.week + '</span> ' + esc(s.onderwerp) + '</td><td class="barcell">' + bar(p, p >= 67.5 ? 'good' : 'bad') + '</td><td class="num">' + s.goed + '/' + s.n + '</td></tr>';
      }).join('');

    var fout = toets.items.filter(function (it) { return !it.goed; });
    var lijst = fout.map(function (it) {
      var q = BY_ID[it.id];
      var nr = toets.items.indexOf(it) + 1;
      var jouw = it.gekozen === null ? '<i>niet beantwoord</i>' : LETTERS[it.gekozen] + '. ' + esc(q.opties[it.order[it.gekozen]]);
      var juistPos = it.order.indexOf(q.antwoord);
      return '<div class="review">' + metaChips(q, '<span class="chip">Vraag ' + nr + '</span>') +
        '<p><b>' + esc(q.vraag) + '</b></p>' +
        '<p class="ans"><b>Jouw antwoord:</b> ' + jouw + '</p>' +
        '<p class="ans"><b>Juiste antwoord:</b> ' + LETTERS[juistPos] + '. ' + esc(q.opties[q.antwoord]) + '</p>' +
        '<p class="small">' + esc(q.uitleg) + '</p>' +
        '<p class="src small muted">' + bronTekst(q) + '</p></div>';
    }).join('');

    render(
      '<section class="card">' +
        '<h1>Resultaat toetssimulatie</h1>' +
        '<div class="grade"><div class="grade-num ' + (geslaagd ? 'pass' : 'fail') + '">' + nl(toets.cijfer, 1) + '</div>' +
          '<div><p><b>' + toets.score + ' van de ' + n + '</b> goed (' + nl(toets.score / n * 100, 1) + '%) · ' + (geslaagd ? 'voldoende' : 'onvoldoende') + '</p>' +
          '<p class="small muted">Cesuur uit de toetsmatrijs: 67,5% = ' + c + ' van ' + n + ' goed voor een 5,5. Tijd: ' + fmtTijd(toets.eind - toets.start) + '.</p></div></div>' +
        '<div class="btn-row" style="margin-top:14px">' +
          (fout.length ? '<button class="btn btn-primary" data-act="oefen-fout">Oefen deze ' + fout.length + ' fouten</button>' : '') +
          '<button class="btn" data-act="nieuwe-toets">Nieuwe toets</button>' +
          '<a class="btn btn-ghost" href="#start">Naar start</a>' +
        '</div>' +
      '</section>' +
      '<section class="card"><h2>Score per week</h2><table class="scores"><thead><tr><th>Week</th><th></th><th>Goed</th></tr></thead><tbody>' + weekRows + '</tbody></table></section>' +
      '<section class="card"><h2>Score per onderwerp</h2><table class="scores"><thead><tr><th>Onderwerp</th><th></th><th>Goed</th></tr></thead><tbody>' + ondRows + '</tbody></table></section>' +
      '<section class="card"><h2>Fout beantwoorde vragen (' + fout.length + ')</h2>' + (lijst || '<p>Alles goed – knap!</p>') + '</section>'
    );
    on('[data-act="oefen-fout"]', function () { startOefen('oefen', fout.map(function (it) { return it.id; })); });
    on('[data-act="nieuwe-toets"]', startToets);
  }

  /* ---------------- Flashcards ---------------- */
  var FC_BY_ID = {};
  FC.forEach(function (f) { FC_BY_ID[f.id] = f; });
  var kaart = null;

  function kaartSleutel() { return state.scope + '|' + state.alleenOnbekend; }
  function startKaarten(geschud) {
    var pool = FC.filter(function (f) { return inScope(f.week); });
    if (state.alleenOnbekend) pool = pool.filter(function (f) { return !state.kaarten[f.id]; });
    if (geschud) pool = shuffle(pool);
    kaart = { ids: pool.map(function (f) { return f.id; }), i: 0, flipped: false, sleutel: kaartSleutel() };
  }

  function viewKaarten() {
    setNav('kaarten');
    if (!kaart || kaart.sleutel !== kaartSleutel()) startKaarten(false);
    var alle = FC.filter(function (f) { return inScope(f.week); });
    var gekend = alle.filter(function (f) { return state.kaarten[f.id]; }).length;
    var scopeBtns = WEEKS.map(function (w) {
      return '<button type="button" data-scope="' + w + '" aria-pressed="' + (String(state.scope) === String(w)) + '">Week ' + w + '</button>';
    }).join('') + '<button type="button" data-scope="alle" aria-pressed="' + (state.scope === 'alle') + '">Alle</button>';

    var body;
    if (!kaart.ids.length) {
      body = '<div class="card"><p>Je kent alle kaarten van ' + esc(scopeLabel()) + ' al. Zet het filter uit om ze nog eens te bekijken.</p></div>';
    } else {
      var f = FC_BY_ID[kaart.ids[kaart.i]];
      var bekend = !!state.kaarten[f.id];
      body =
        '<div class="session-head"><span class="stat">Kaart ' + (kaart.i + 1) + '/' + kaart.ids.length + '</span>' +
          '<span class="stat">' + gekend + '/' + alle.length + ' gekend</span></div>' +
        '<div class="flash-wrap">' +
          '<button type="button" class="flash' + (kaart.flipped ? ' flipped' : '') + '" data-act="flip" aria-label="Draai de kaart om">' +
            '<div class="face front" aria-hidden="' + kaart.flipped + '">' +
              '<span class="chip accent">Week ' + f.week + '</span>' +
              '<p class="term" style="margin-top:12px">' + esc(f.begrip) + '</p>' +
              '<p class="tap">Tik om de uitleg te zien</p>' +
            '</div>' +
            '<div class="face back" aria-hidden="' + !kaart.flipped + '">' +
              '<div class="meta" style="margin:0"><span class="chip accent">Week ' + f.week + '</span><span class="chip">' + esc(f.begrip) + '</span></div>' +
              '<p style="margin:0">' + esc(f.uitleg) + '</p>' +
              '<div class="ex"><b>Voorbeeld:</b> ' + esc(f.voorbeeld) + '</div>' +
            '</div>' +
          '</button>' +
        '</div>' +
        '<div class="btn-row" style="justify-content:space-between">' +
          '<button class="btn" data-act="kprev"' + (kaart.i === 0 ? ' disabled' : '') + '>← Vorige</button>' +
          '<button class="btn' + (bekend ? ' btn-primary' : '') + '" data-act="ken" aria-pressed="' + bekend + '">' + (bekend ? '✓ Ken ik' : 'Ken ik') + '</button>' +
          '<button class="btn" data-act="knext"' + (kaart.i === kaart.ids.length - 1 ? ' disabled' : '') + '>Volgende →</button>' +
        '</div>' +
        '<p class="kbd-hint">Toetsen: spatie omdraaien · ← → bladeren · K ken ik</p>';
    }

    render(
      '<section class="hero"><h1>Flashcards</h1><p>Voorkant: begrip. Achterkant: korte uitleg en een voorbeeld. Markeer kaarten die je kent, dan kun je de rest apart herhalen.</p></section>' +
      '<section class="card">' +
        '<div class="seg" role="group" aria-label="Kies week">' + scopeBtns + '</div>' +
        '<div class="btn-row" style="align-items:center">' +
          '<label class="small" style="display:flex;align-items:center;gap:8px;min-height:44px"><input type="checkbox" id="alleen-onbekend"' + (state.alleenOnbekend ? ' checked' : '') + '> Alleen kaarten die ik nog niet ken</label>' +
          '<button class="btn btn-ghost" data-act="schud">Schudden</button>' +
        '</div>' +
      '</section>' +
      body
    );

    app.querySelectorAll('[data-scope]').forEach(function (b) {
      b.addEventListener('click', function () { state.scope = b.getAttribute('data-scope'); save(); viewKaarten(); });
    });
    var cb = document.getElementById('alleen-onbekend');
    if (cb) cb.addEventListener('change', function () { state.alleenOnbekend = cb.checked; save(); viewKaarten(); });
    on('[data-act="schud"]', function () { startKaarten(true); viewKaarten(); });
    on('[data-act="flip"]', flipKaart);
    on('[data-act="kprev"]', function () { kaartNaar(-1); });
    on('[data-act="knext"]', function () { kaartNaar(1); });
    on('[data-act="ken"]', kenKaart);
  }
  function flipKaart() {
    kaart.flipped = !kaart.flipped;
    var el = app.querySelector('.flash');
    if (el) {
      el.classList.toggle('flipped', kaart.flipped);
      el.querySelector('.front').setAttribute('aria-hidden', String(kaart.flipped));
      el.querySelector('.back').setAttribute('aria-hidden', String(!kaart.flipped));
    }
  }
  function kaartNaar(d) {
    var j = kaart.i + d;
    if (j < 0 || j >= kaart.ids.length) return;
    kaart.i = j; kaart.flipped = false; viewKaarten();
  }
  function kenKaart() {
    var id = kaart.ids[kaart.i];
    if (state.kaarten[id]) delete state.kaarten[id]; else state.kaarten[id] = true;
    save();
    // Bij het filter "alleen onbekend" blijft de huidige stapel staan tot je opnieuw kiest
    kaart.sleutel = kaartSleutel();
    viewKaarten();
  }

  /* ---------------- Toetsenbord ---------------- */
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (document.querySelector('.overlay')) return;
    var tag = e.target && e.target.tagName ? e.target.tagName.toUpperCase() : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    var opKnop = tag === 'BUTTON' || tag === 'A';
    var h = location.hash || '#start';
    var key = (e.key || '').toLowerCase();
    var idx = ['1', '2', '3', '4'].indexOf(key);
    if (idx < 0) idx = ['a', 'b', 'c', 'd'].indexOf(key);

    if (h === '#oefenen' && oefen && !oefen.klaar) {
      var it = oefen.items[oefen.i];
      if (idx >= 0 && it.gekozen === null) { e.preventDefault(); kiesOefen(idx); }
      else if (key === 'h' && it.gekozen === null && !it.hint) { it.hint = true; viewOefen(true); }
      else if (key === 'enter' && it.gekozen !== null && !opKnop) { e.preventDefault(); volgendeOefen(); }
    } else if (h === '#toets' && toets && !toets.klaar) {
      if (idx >= 0) { e.preventDefault(); toets.items[toets.i].gekozen = idx; viewToets(true); }
      else if (key === 'arrowright' && toets.i < toets.items.length - 1) { toets.i++; viewToets(); }
      else if (key === 'arrowleft' && toets.i > 0) { toets.i--; viewToets(); }
    } else if (h === '#kaarten' && kaart && kaart.ids.length) {
      if ((key === ' ' || key === 'enter') && !opKnop) { e.preventDefault(); flipKaart(); }
      else if (key === 'arrowright') kaartNaar(1);
      else if (key === 'arrowleft') kaartNaar(-1);
      else if (key === 'k') kenKaart();
    }
  });

  /* ---------------- Router ---------------- */
  function route() {
    stopTimer();
    var h = location.hash || '#start';
    if (h === '#oefenen') viewOefen();
    else if (h === '#toets') viewToets();
    else if (h === '#fouten') viewFouten();
    else if (h === '#kaarten') viewKaarten();
    else viewHome();
  }
  window.addEventListener('hashchange', route);
  updateNavCount();
  route();
})();
