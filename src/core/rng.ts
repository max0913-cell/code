/** Seedbare pseudo-random generator (mulberry32), zodat tests reproduceerbaar zijn. */
export interface Rng {
  /** Getal in [0, 1). */
  next(): number;
  /** Geheel getal in [min, max] (inclusief). */
  int(min: number, max: number): number;
  pick<T>(arr: readonly T[]): T;
  /** Geeft een geschudde kopie terug. */
  shuffle<T>(arr: readonly T[]): T[];
  chance(p: number): boolean;
  /** Kies k verschillende elementen. */
  sample<T>(arr: readonly T[], k: number): T[];
}

export function makeRng(seed: number = Math.floor(Math.random() * 2 ** 32)): Rng {
  let a = seed >>> 0;
  const next = (): number => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number): number => min + Math.floor(next() * (max - min + 1));
  const shuffle = <T>(arr: readonly T[]): T[] => {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = int(0, i);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  return {
    next,
    int,
    pick: <T>(arr: readonly T[]): T => {
      if (arr.length === 0) throw new Error('pick uit lege lijst');
      return arr[int(0, arr.length - 1)];
    },
    shuffle,
    chance: (p: number) => next() < p,
    sample: <T>(arr: readonly T[], k: number): T[] => shuffle(arr).slice(0, k),
  };
}
