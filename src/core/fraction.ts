/**
 * Exacte rationale getallen met BigInt. Zo bestaan er geen floating-point-fouten:
 * 0,1 + 0,2 is hier precies 3/10.
 */
const gcd = (a: bigint, b: bigint): bigint => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
};

export class Frac {
  readonly n: bigint;
  readonly d: bigint;

  private constructor(n: bigint, d: bigint) {
    if (d === 0n) throw new Error('Deling door nul');
    if (d < 0n) {
      n = -n;
      d = -d;
    }
    const g = gcd(n, d) || 1n;
    this.n = n / g;
    this.d = d / g;
  }

  static of(n: bigint | number, d: bigint | number = 1): Frac {
    if (typeof n === 'number' && !Number.isInteger(n)) throw new Error(`Geen geheel getal: ${n}`);
    if (typeof d === 'number' && !Number.isInteger(d)) throw new Error(`Geen geheel getal: ${d}`);
    return new Frac(BigInt(n), BigInt(d));
  }

  /** Decimaal getal: dec(16, 2) = 0,16. */
  static dec(digits: number | bigint, places: number): Frac {
    return new Frac(BigInt(digits), 10n ** BigInt(places));
  }

  /** Lees "0,16", "0.16", "3/8" of "12". */
  static parse(s: string): Frac {
    const t = s.trim().replace(',', '.');
    if (t.includes('/')) {
      const [a, b] = t.split('/');
      return new Frac(BigInt(a), BigInt(b));
    }
    const neg = t.startsWith('-');
    const u = neg ? t.slice(1) : t;
    const [ip, fp = ''] = u.split('.');
    const v = new Frac(BigInt(ip + fp || '0'), 10n ** BigInt(fp.length));
    return neg ? v.neg() : v;
  }

  add(o: Frac): Frac {
    return new Frac(this.n * o.d + o.n * this.d, this.d * o.d);
  }
  sub(o: Frac): Frac {
    return new Frac(this.n * o.d - o.n * this.d, this.d * o.d);
  }
  mul(o: Frac): Frac {
    return new Frac(this.n * o.n, this.d * o.d);
  }
  div(o: Frac): Frac {
    if (o.n === 0n) throw new Error('Deling door nul');
    return new Frac(this.n * o.d, this.d * o.n);
  }
  neg(): Frac {
    return new Frac(-this.n, this.d);
  }
  inv(): Frac {
    return new Frac(this.d, this.n);
  }
  cmp(o: Frac): number {
    const l = this.n * o.d;
    const r = o.n * this.d;
    return l < r ? -1 : l > r ? 1 : 0;
  }
  eq(o: Frac): boolean {
    return this.n === o.n && this.d === o.d;
  }
  isInt(): boolean {
    return this.d === 1n;
  }
  isPos(): boolean {
    return this.n > 0n;
  }
  isZero(): boolean {
    return this.n === 0n;
  }

  /** Heeft dit getal een eindige decimale schrijfwijze? (noemer alleen factoren 2 en 5) */
  isTerminating(): boolean {
    let d = this.d;
    while (d % 2n === 0n) d /= 2n;
    while (d % 5n === 0n) d /= 5n;
    return d === 1n;
  }

  /** Aantal cijfers achter de komma (alleen voor eindige decimalen). */
  places(): number {
    if (!this.isTerminating()) return Infinity;
    let p = 0;
    let n = this.n < 0n ? -this.n : this.n;
    let d = this.d;
    while (d !== 1n) {
      // vermenigvuldig met 10 tot de noemer wegvalt
      n *= 10n;
      const g = gcd(n, d);
      n /= g;
      d /= g;
      p++;
    }
    return p;
  }

  /** Aantal significante cijfers (handig om weergave kort te houden). */
  sigDigits(): number {
    const s = this.toDecimal().replace('-', '').replace(',', '').replace(/^0+/, '');
    return s.replace(/0+$/, '').length || 1;
  }

  /** Decimale weergave met komma, exact. Gooit een fout bij een niet-eindige breuk. */
  toDecimal(): string {
    if (!this.isTerminating()) throw new Error(`Geen eindige decimaal: ${this.n}/${this.d}`);
    const p = this.places();
    const neg = this.n < 0n;
    const scaled = ((neg ? -this.n : this.n) * 10n ** BigInt(p)) / this.d;
    let s = scaled.toString();
    if (p > 0) {
      s = s.padStart(p + 1, '0');
      s = `${s.slice(0, s.length - p)},${s.slice(s.length - p)}`;
    }
    return (neg ? '-' : '') + s;
  }

  /** Breuknotatie als tekst, bijvoorbeeld "3/8" of "2". */
  toFracText(): string {
    return this.d === 1n ? this.n.toString() : `${this.n}/${this.d}`;
  }

  /** Benadering als gewoon getal: alleen voor vergelijken van groottes, nooit voor antwoorden. */
  approx(): number {
    return Number(this.n) / Number(this.d);
  }

  toString(): string {
    return this.toFracText();
  }
}

export const F = (n: number | bigint, d: number | bigint = 1): Frac => Frac.of(n, d);
export const D = (s: string): Frac => Frac.parse(s);

/** HTML voor een echte (gestapelde) breuk. */
export function fracHtml(f: Frac): string {
  if (f.isInt()) return `<span class="num-int">${f.n}</span>`;
  const neg = f.n < 0n;
  const n = neg ? -f.n : f.n;
  return `${neg ? '−' : ''}<span class="frac" role="math" aria-label="${n} gedeeld door ${f.d}"><span class="frac-n">${n}</span><span class="frac-d">${f.d}</span></span>`;
}

/** Platte tekst voor aria-labels en sleutels, bijvoorbeeld "3/8". */
export function fracLabel(f: Frac): string {
  return f.isInt() ? f.n.toString() : `${f.n}/${f.d}`;
}

/** HTML voor een niet-vereenvoudigde breuk, bijvoorbeeld 6/8 in een tussenstap. */
export function fracRawHtml(n: bigint | number, d: bigint | number): string {
  return `<span class="frac" role="math" aria-label="${n} gedeeld door ${d}"><span class="frac-n">${n}</span><span class="frac-d">${d}</span></span>`;
}

export const lcm = (a: bigint, b: bigint): bigint => (a / gcd(a, b)) * b;
