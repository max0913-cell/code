/**
 * Controleert de contrastverhoudingen van alle kleurcombinaties die de site gebruikt (WCAG 2.2).
 *   npm run controleer:contrast
 * Tekst: minimaal 4.5:1 (AA). Grote tekst en UI-randen: minimaal 3:1.
 */
const kleur = {
  ink: '#15172a', ink2: '#1e2137', ink3: '#2a2e4a', yellow: '#ffc61a', yellowSoft: '#fff5d1',
  white: '#ffffff', grey50: '#f5f5f8', grey100: '#ececf2', muted: '#4a4d66', mutedDark: '#b8bbd0',
  placeholder: '#6b6e86', veldrand: '#7d8098', huisstijlAccent: '#0e6e5c', rivierNaam: '#8a8eaa', gebiedNaam: '#6f7391',
};

const kanaal = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminantie = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * kanaal(r) + 0.7152 * kanaal(g) + 0.0722 * kanaal(b);
};
const contrast = (a, b) => {
  const [l1, l2] = [luminantie(a), luminantie(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// [voorgrond, achtergrond, minimum, omschrijving]
const paren = [
  ['ink', 'white', 4.5, 'gewone tekst'],
  ['ink', 'grey50', 4.5, 'tekst op lichtgrijze secties'],
  ['ink', 'grey100', 4.5, 'labels op lichtgrijs'],
  ['ink', 'yellow', 4.5, 'tekst op gele knoppen en vlakken'],
  ['ink', 'yellowSoft', 4.5, 'tekst in lichtgele vakken'],
  ['muted', 'white', 4.5, 'gedempte tekst op wit'],
  ['muted', 'grey50', 4.5, 'gedempte tekst op lichtgrijs'],
  ['muted', 'yellowSoft', 4.5, 'gedempte tekst op lichtgeel'],
  ['white', 'ink', 4.5, 'tekst op zwart'],
  ['white', 'ink2', 4.5, 'tekst op donkere kaarten'],
  ['white', 'ink3', 4.5, 'tekst op donkerste kaarten'],
  ['mutedDark', 'ink', 4.5, 'gedempte tekst op zwart'],
  ['mutedDark', 'ink2', 4.5, 'gedempte tekst op donkere kaarten'],
  ['yellow', 'ink', 4.5, 'geel accent op zwart'],
  ['yellow', 'ink2', 4.5, 'geel accent op donkere kaarten'],
  ['placeholder', 'white', 4.5, 'placeholdertekst in formulier'],
  ['veldrand', 'white', 3, 'rand van formuliervelden (UI)'],
  ['huisstijlAccent', 'white', 4.5, 'accentkleur huisstijl-voorbeeld'],
  ['rivierNaam', 'ink', 4.5, 'riviernamen op de kaart'],
  ['gebiedNaam', 'ink', 3, 'gebiedsnaam op de kaart (groot, uitgespatieerd)'],
  ['yellow', 'ink', 3, 'focusring op donker (UI)'],
  ['ink', 'white', 3, 'focusring op licht (UI)'],
];

let fouten = 0;
for (const [voor, achter, min, wat] of paren) {
  const c = contrast(kleur[voor], kleur[achter]);
  const ok = c >= min;
  if (!ok) fouten++;
  console.log(`${ok ? '✓' : '✗'} ${c.toFixed(2).padStart(5)}:1  (min. ${min})  ${voor} op ${achter}: ${wat}`);
}
// Geel als tekst op wit mag nooit voorkomen:
console.log(`ℹ geel op wit zou ${contrast(kleur.yellow, kleur.white).toFixed(2)}:1 zijn: daarom nooit als tekstkleur op wit gebruikt.`);
if (fouten) {
  console.log(`\n✗ ${fouten} combinatie(s) halen het minimum niet.`);
  process.exit(1);
}
console.log('\n✓ Alle combinaties halen WCAG AA.');
