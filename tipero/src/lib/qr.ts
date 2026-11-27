import qrcode from 'qrcode-generator';

export interface QrPad {
  /** SVG-pad (één `d`-attribuut) met alle donkere modules. */
  d: string;
  /** Aantal modules per zijde (zonder witrand). */
  grootte: number;
}

/**
 * Maakt bij het bouwen een échte, scanbare QR-code als SVG-pad.
 * Er gaat dus geen JavaScript naar de browser.
 */
export function maakQr(tekst: string): QrPad {
  const qr = qrcode(0, 'M');
  qr.addData(tekst);
  qr.make();
  const n = qr.getModuleCount();
  let d = '';
  for (let rij = 0; rij < n; rij++) {
    let kol = 0;
    while (kol < n) {
      if (!qr.isDark(rij, kol)) {
        kol++;
        continue;
      }
      const start = kol;
      while (kol < n && qr.isDark(rij, kol)) kol++;
      d += `M${start} ${rij}h${kol - start}v1h-${kol - start}z`;
    }
  }
  return { d, grootte: n };
}
