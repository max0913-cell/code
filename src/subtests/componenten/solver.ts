import { type Shape, normalize, orientations } from '../../core/trigrid';

/**
 * Backtracking-solver: kun je de doelvorm precies vullen met alle stukken
 * (elk stuk één keer, draaien mag, niet overlappen, geen gaten)?
 * Geeft de plaatsing terug (per stuk de driehoekjes in de doelvorm), of null.
 *
 * Werkwijze: neem steeds het kleinste nog lege driehoekje van de doelvorm. Het stuk dat
 * dat driehoekje bedekt, moet er met zijn eigen kleinste driehoekje op liggen (alles wat
 * kleiner is, is al bedekt). Daardoor is per stand de plek meteen bepaald.
 */
export function solve(target: Shape, pieces: Shape[], allowMirror: boolean): Shape[] | null {
  const t = normalize(target);
  const total = pieces.reduce((s, p) => s + p.length, 0);
  if (total !== t.length) return null;
  const index = new Map<number, number>();
  t.forEach((k, i) => index.set(k, i));
  const covered = new Uint8Array(t.length);
  const orients = pieces.map((p) => orientations(p, allowMirror));
  const sigs = orients.map((os) => os.map((o) => o.join(',')).sort()[0]);
  const used = new Uint8Array(pieces.length);
  const placement: Shape[] = pieces.map(() => []);

  const rec = (from: number): boolean => {
    let i = from;
    while (i < t.length && covered[i]) i++;
    if (i === t.length) return true;
    const tk = t[i];
    const tried = new Set<string>();
    for (let p = 0; p < pieces.length; p++) {
      if (used[p]) continue;
      // gelijke stukken hoeven maar één keer geprobeerd te worden
      if (tried.has(sigs[p])) continue;
      tried.add(sigs[p]);
      for (const o of orients[p]) {
        const anchor = o[0];
        if ((anchor & 3) !== (tk & 3)) continue;
        const delta = tk - anchor;
        const idx: number[] = [];
        let ok = true;
        for (const k of o) {
          const j = index.get(k + delta);
          if (j === undefined || covered[j]) {
            ok = false;
            break;
          }
          idx.push(j);
        }
        if (!ok) continue;
        for (const j of idx) covered[j] = 1;
        used[p] = 1;
        placement[p] = idx.map((j) => t[j]);
        if (rec(i + 1)) return true;
        used[p] = 0;
        for (const j of idx) covered[j] = 0;
      }
    }
    return false;
  };
  return rec(0) ? placement.map((s) => s.slice()) : null;
}

export const canTile = (target: Shape, pieces: Shape[], allowMirror: boolean): boolean => solve(target, pieces, allowMirror) !== null;
