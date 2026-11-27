/**
 * Kleine statische server voor dist/, die zich gedraagt zoals Netlify:
 * - /prijzen → prijzen.html, / → index.html, onbekend → 404.html (status 404)
 * - headers uit public/_headers (CSP, caching, ...)
 * - gzip/brotli-compressie voor tekstbestanden
 * Wordt gebruikt door scripts/lighthouse.mjs.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

/** Leest het Netlify-formaat van _headers. */
async function leesHeaders(dist) {
  const regels = [];
  let huidig = null;
  const tekst = await readFile(join(dist, '_headers'), 'utf8').catch(() => '');
  for (const regel of tekst.split('\n')) {
    if (!regel.trim() || regel.trim().startsWith('#')) continue;
    if (!/^\s/.test(regel)) {
      huidig = { patroon: new RegExp(`^${regel.trim().replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`), headers: {} };
      regels.push(huidig);
    } else if (huidig) {
      const i = regel.indexOf(':');
      huidig.headers[regel.slice(0, i).trim()] = regel.slice(i + 1).trim();
    }
  }
  return regels;
}

async function bestaat(pad) {
  try {
    return (await stat(pad)).isFile();
  } catch {
    return false;
  }
}

export async function startServer(dist, poort) {
  const headerRegels = await leesHeaders(dist);
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const pad = decodeURIComponent(url.pathname);
    let bestand = join(dist, normalize(pad));
    let status = 200;
    if (pad === '/') bestand = join(dist, 'index.html');
    else if (!extname(pad)) bestand = join(dist, `${pad.replace(/\/$/, '')}.html`);
    if (!bestand.startsWith(dist) || !(await bestaat(bestand))) {
      bestand = join(dist, '404.html');
      status = 404;
    }
    let data = await readFile(bestand);
    const type = types[extname(bestand)] ?? 'application/octet-stream';
    const headers = { 'Content-Type': type };
    for (const regel of headerRegels) if (regel.patroon.test(pad)) Object.assign(headers, regel.headers);
    if (/text|json|xml|svg|javascript/.test(type)) {
      const accept = req.headers['accept-encoding'] ?? '';
      if (accept.includes('br')) {
        data = brotliCompressSync(data);
        headers['Content-Encoding'] = 'br';
      } else if (accept.includes('gzip')) {
        data = gzipSync(data);
        headers['Content-Encoding'] = 'gzip';
      }
      headers['Vary'] = 'Accept-Encoding';
    }
    res.writeHead(status, headers);
    res.end(data);
  });
  await new Promise((r) => server.listen(poort, '127.0.0.1', r));
  return server;
}
