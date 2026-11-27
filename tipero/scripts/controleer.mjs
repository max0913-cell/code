/**
 * Controleert de gebouwde site (dist/) op SEO, toegankelijkheid en kapotte links.
 *
 *   npm run controleer        (na `npm run build`)
 *
 * Fouten → exitcode 1. Waarschuwingen en placeholders worden alleen gemeld.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const site = 'https://www.tipero.nl';

const fouten = [];
const waarschuwingen = [];
const placeholders = new Map();
const fout = (pagina, tekst) => fouten.push(`${pagina}: ${tekst}`);
const let_op = (pagina, tekst) => waarschuwingen.push(`${pagina}: ${tekst}`);

async function bestaat(pad) {
  try {
    return (await stat(pad)).isFile();
  } catch {
    return false;
  }
}

async function htmlBestanden(map) {
  const items = await readdir(map, { withFileTypes: true });
  const lijst = [];
  for (const item of items) {
    const pad = join(map, item.name);
    if (item.isDirectory()) lijst.push(...(await htmlBestanden(pad)));
    else if (item.name.endsWith('.html')) lijst.push(pad);
  }
  return lijst;
}

/** "/kapper" → dist/kapper.html, "/" → dist/index.html, "/favicon.svg" → dist/favicon.svg */
function bestandVoorPad(pad) {
  if (pad === '/' || pad === '') return join(dist, 'index.html');
  if (/\.[a-z0-9]+$/i.test(pad)) return join(dist, pad);
  return join(dist, `${pad.replace(/\/$/, '')}.html`);
}

const paginaPad = (bestand) => {
  const rel = '/' + relative(dist, bestand).replace(/\\/g, '/');
  return rel === '/index.html' ? '/' : rel.replace(/\.html$/, '');
};

const bestanden = await htmlBestanden(dist);
const paginas = new Map();
for (const bestand of bestanden) {
  const html = await readFile(bestand, 'utf8');
  paginas.set(paginaPad(bestand), { bestand, html, doc: parse(html) });
}

const titels = new Map();
const omschrijvingen = new Map();

for (const [pad, { html, doc }] of paginas) {
  const noindex = /<meta name="robots" content="noindex/.test(html);

  // ── Basis ──
  if (doc.querySelector('html')?.getAttribute('lang') !== 'nl') fout(pad, 'lang="nl" ontbreekt');
  if (!doc.querySelector('meta[name="viewport"]')) fout(pad, 'viewport-meta ontbreekt');

  // ── Titel en omschrijving ──
  const titel = doc.querySelector('title')?.text.trim() ?? '';
  const omschrijving = doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  if (!titel) fout(pad, 'geen <title>');
  else if (titel.length > 60) let_op(pad, `titel is ${titel.length} tekens (advies: max. 60): "${titel}"`);
  if (!omschrijving) fout(pad, 'geen meta description');
  else if (omschrijving.length > 160) fout(pad, `omschrijving is ${omschrijving.length} tekens (max. ~155)`);
  else if (omschrijving.length > 155) let_op(pad, `omschrijving is ${omschrijving.length} tekens (advies: max. 155)`);
  else if (omschrijving.length < 70 && !noindex) let_op(pad, `omschrijving is kort (${omschrijving.length} tekens)`);
  if (!noindex) {
    if (titels.has(titel)) fout(pad, `titel is gelijk aan die van ${titels.get(titel)}`);
    if (omschrijvingen.has(omschrijving)) fout(pad, `omschrijving is gelijk aan die van ${omschrijvingen.get(omschrijving)}`);
    titels.set(titel, pad);
    omschrijvingen.set(omschrijving, pad);
  }

  // ── Canonical en robots ──
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (!noindex) {
    const verwacht = pad === '/' ? `${site}/` : `${site}${pad}`;
    if (canonical !== verwacht) fout(pad, `canonical is "${canonical}", verwacht "${verwacht}"`);
  } else if (canonical) {
    let_op(pad, 'noindex-pagina heeft een canonical');
  }

  // ── Open Graph / Twitter ──
  for (const prop of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'og:locale']) {
    if (!doc.querySelector(`meta[property="${prop}"]`)) fout(pad, `${prop} ontbreekt`);
  }
  if (!doc.querySelector('meta[name="twitter:card"]')) fout(pad, 'twitter:card ontbreekt');
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '';
  if (ogImage.startsWith(site)) {
    if (!(await bestaat(bestandVoorPad(ogImage.slice(site.length))))) fout(pad, `og:image bestaat niet: ${ogImage}`);
  } else if (ogImage) fout(pad, `og:image is geen absolute URL op ${site}`);

  // ── Koppen ──
  const koppen = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const h1s = koppen.filter((k) => k.tagName === 'H1');
  if (h1s.length !== 1) fout(pad, `${h1s.length} × <h1> (moet er precies 1 zijn)`);
  let vorige = 0;
  for (const kop of koppen) {
    const niveau = Number(kop.tagName[1]);
    if (vorige && niveau > vorige + 1) fout(pad, `kopniveau springt van h${vorige} naar h${niveau}: "${kop.text.trim()}"`);
    if (!kop.text.trim()) fout(pad, `lege ${kop.tagName.toLowerCase()}`);
    vorige = niveau;
  }

  // ── Toegankelijkheid ──
  for (const img of doc.querySelectorAll('img')) {
    if (img.getAttribute('alt') === undefined) fout(pad, `<img> zonder alt: ${img.getAttribute('src')}`);
    if (!img.getAttribute('width') || !img.getAttribute('height')) fout(pad, `<img> zonder width/height: ${img.getAttribute('src')}`);
  }
  for (const svg of doc.querySelectorAll('svg[role="img"]')) {
    if (!svg.getAttribute('aria-label')?.trim()) fout(pad, '<svg role="img"> zonder aria-label');
  }
  for (const a of doc.querySelectorAll('a')) {
    const naam = (a.getAttribute('aria-label') ?? a.text).trim();
    if (!naam) fout(pad, `link zonder tekst: ${a.getAttribute('href')}`);
    if (!a.getAttribute('href')) fout(pad, `link zonder href: "${naam}"`);
    if (a.getAttribute('target') === '_blank' && !/noopener|noreferrer/.test(a.getAttribute('rel') ?? ''))
      fout(pad, `target=_blank zonder rel=noopener: ${a.getAttribute('href')}`);
  }
  for (const knop of doc.querySelectorAll('button')) {
    if (!(knop.getAttribute('aria-label') ?? knop.text).trim()) fout(pad, '<button> zonder naam');
  }
  for (const veld of doc.querySelectorAll('input, textarea, select')) {
    const type = veld.getAttribute('type');
    if (type === 'hidden') continue;
    const id = veld.getAttribute('id');
    const viaFor = id && doc.querySelector(`label[for="${id}"]`);
    const omringd = veld.closest('label');
    if (!viaFor && !omringd && !veld.getAttribute('aria-label')) fout(pad, `formulierveld zonder label: ${veld.getAttribute('name')}`);
  }
  const ids = new Map();
  for (const el of doc.querySelectorAll('[id]')) {
    const id = el.getAttribute('id');
    if (ids.has(id)) fout(pad, `dubbele id: #${id}`);
    ids.set(id, true);
  }
  for (const el of doc.querySelectorAll('[aria-labelledby]')) {
    for (const ref of el.getAttribute('aria-labelledby').split(/\s+/)) {
      if (!ids.has(ref)) fout(pad, `aria-labelledby verwijst naar onbekende id: #${ref}`);
    }
  }

  // ── Interne links ──
  for (const a of doc.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const [linkPad, hash] = href.startsWith('#') ? [pad, href.slice(1)] : href.split('#');
    if (linkPad !== '/' && linkPad.endsWith('/')) fout(pad, `link met slash aan het eind: ${href}`);
    if (/\.html$/.test(linkPad)) fout(pad, `link met .html: ${href}`);
    const doelBestand = bestandVoorPad(linkPad);
    if (!(await bestaat(doelBestand))) {
      fout(pad, `kapotte link: ${href}`);
      continue;
    }
    if (hash) {
      const doel = paginas.get(linkPad === '' ? pad : linkPad);
      if (doel && !doel.doc.querySelector(`[id="${hash}"]`)) fout(pad, `anker bestaat niet: ${href}`);
    }
  }

  // ── Witruimte vóór links (Astro haalt witruimte met een regeleinde weg) ──
  const plakker = html.match(/[a-zA-Z0-9.,:;]<a /g);
  if (plakker) fout(pad, `${plakker.length} link(s) zonder spatie ervoor`);

  // ── JSON-LD ──
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  if (scripts.length !== 1) fout(pad, `${scripts.length} JSON-LD-blokken (verwacht 1)`);
  for (const script of scripts) {
    let data;
    try {
      data = JSON.parse(script.text);
    } catch (e) {
      fout(pad, `JSON-LD is geen geldige JSON: ${e.message}`);
      continue;
    }
    controleerJsonLd(pad, data, noindex);
  }

  // ── Placeholders in zichtbare tekst ──
  const zichtbaar = doc.querySelector('body')?.text ?? '';
  for (const m of zichtbaar.matchAll(/\[[^\]\n]{2,200}\]/g)) {
    const lijst = placeholders.get(m[0]) ?? new Set();
    lijst.add(pad);
    placeholders.set(m[0], lijst);
  }
}

function controleerJsonLd(pad, data, noindex) {
  if (data['@context'] !== 'https://schema.org') fout(pad, 'JSON-LD @context moet https://schema.org zijn');
  const graph = data['@graph'] ?? [];
  const ids = new Set(graph.map((n) => n['@id']).filter(Boolean));
  const types = graph.map((n) => [n['@type']].flat()).flat();
  // ook geneste @id's (bv. logo)
  JSON.stringify(data, (k, v) => {
    if (v && typeof v === 'object' && v['@id'] && Object.keys(v).length > 1) ids.add(v['@id']);
    return v;
  });
  // Elke verwijzing ({ "@id": ... } zonder andere velden) moet bestaan.
  JSON.stringify(data, (k, v) => {
    if (v && typeof v === 'object' && !Array.isArray(v) && v['@id'] && Object.keys(v).length === 1 && !ids.has(v['@id']))
      fout(pad, `JSON-LD verwijst naar onbekende @id: ${v['@id']}`);
    return v;
  });

  for (const nodig of ['LocalBusiness', 'WebSite']) if (!types.includes(nodig)) fout(pad, `JSON-LD mist ${nodig}`);
  if (!noindex && !types.some((t) => /Page$/.test(t))) fout(pad, 'JSON-LD mist een WebPage-node');

  for (const node of graph) {
    const type = [node['@type']].flat()[0];
    if (type === 'LocalBusiness') {
      for (const v of ['name', 'url', 'areaServed', 'logo']) if (!node[v]) fout(pad, `LocalBusiness mist ${v}`);
      if (node.address) fout(pad, 'LocalBusiness bevat een adres (dat wil je niet op de site)');
    }
    if (type === 'BreadcrumbList') {
      const items = node.itemListElement ?? [];
      if (items.length < 2) fout(pad, 'BreadcrumbList heeft minder dan 2 items');
      items.forEach((item, i) => {
        if (item.position !== i + 1) fout(pad, `BreadcrumbList positie ${item.position} ≠ ${i + 1}`);
        if (!item.name || !String(item.item ?? '').startsWith(site)) fout(pad, `BreadcrumbList item ${i + 1} onvolledig`);
      });
    }
    if (type === 'Product') {
      if (!node.name || !node.image) fout(pad, `Product "${node.name}" mist name of image`);
      for (const offer of [node.offers].flat()) {
        if (!offer || !/^\d+\.\d{2}$/.test(offer.price ?? '')) fout(pad, `Offer van "${node.name}" heeft geen geldige price`);
        if (offer?.priceCurrency !== 'EUR') fout(pad, `Offer van "${node.name}" mist priceCurrency EUR`);
        if (!offer?.availability) fout(pad, `Offer van "${node.name}" mist availability`);
      }
    }
    if (type === 'FAQPage') {
      const vragen = node.mainEntity ?? [];
      if (!vragen.length) fout(pad, 'FAQPage zonder vragen');
      for (const v of vragen) {
        if (v['@type'] !== 'Question' || !v.name || !v.acceptedAnswer?.text) fout(pad, `FAQ-vraag onvolledig: ${v.name}`);
      }
    }
  }
}

// ── Sitemap en robots ──
const sitemap = await readFile(join(dist, 'sitemap-0.xml'), 'utf8').catch(() => '');
if (!sitemap) fout('sitemap', 'sitemap-0.xml ontbreekt');
const inSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const [pad, { html }] of paginas) {
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const url = pad === '/' ? `${site}/` : `${site}${pad}`;
  if (pad === '/404') continue;
  if (!noindex && !inSitemap.includes(url)) fout('sitemap', `${url} staat niet in de sitemap`);
  if (noindex && inSitemap.includes(url)) fout('sitemap', `${url} is noindex maar staat in de sitemap`);
}
for (const url of inSitemap) {
  if (!paginas.has(url.slice(site.length) || '/')) fout('sitemap', `sitemap bevat onbekende pagina ${url}`);
}
const robots = await readFile(join(dist, 'robots.txt'), 'utf8').catch(() => '');
if (!robots.includes(`Sitemap: ${site}/sitemap-index.xml`)) fout('robots.txt', 'verwijzing naar sitemap ontbreekt');

// ── Rapport ──
console.log(`\nGecontroleerd: ${paginas.size} pagina's\n`);
if (waarschuwingen.length) {
  console.log(`Waarschuwingen (${waarschuwingen.length}):`);
  for (const w of waarschuwingen) console.log(`  ⚠ ${w}`);
  console.log('');
}
if (placeholders.size) {
  console.log(`Nog in te vullen placeholders (${placeholders.size}):`);
  for (const [tekst, lijst] of placeholders) console.log(`  • ${tekst}  (${[...lijst].join(', ')})`);
  console.log('');
}
if (fouten.length) {
  console.log(`Fouten (${fouten.length}):`);
  for (const f of fouten) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log('✓ Geen fouten gevonden.');
