/** Gedeelde SVG-helpers. Figuren gebruiken de klassen k (zwart), w (wit) en ln (lijn); de kleuren staan in de CSS. */
export const escapeAttr = (s: string): string => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function svgOpen(viewBox: string, label: string): string {
  return `<svg class="fig" viewBox="${viewBox}" role="img" aria-label="${escapeAttr(label)}" xmlns="http://www.w3.org/2000/svg">`;
}
