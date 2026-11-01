import { Frac, fracHtml } from '../../core/fraction';

/** Weergave van een getal: als decimaal (met komma) of als echte breuk. */
export type Fmt = 'dec' | 'frac';

export type Expr =
  | { k: 'num'; v: Frac; fmt: Fmt }
  | { k: 'unk'; fmt: Fmt }
  | { k: 'op'; op: '+' | '−' | '×' | ':'; a: Expr; b: Expr }
  | { k: 'pct'; p: Expr; of: Expr };

export interface Equation {
  lhs: Expr;
  rhs: Expr;
}

export const num = (v: Frac, fmt: Fmt = 'dec'): Expr => ({ k: 'num', v, fmt });
export const unk = (fmt: Fmt = 'dec'): Expr => ({ k: 'unk', fmt });
export const op = (o: '+' | '−' | '×' | ':', a: Expr, b: Expr): Expr => ({ k: 'op', op: o, a, b });
export const pct = (p: Expr, of: Expr): Expr => ({ k: 'pct', p, of });

/** Reken een expressie exact uit, met x ingevuld op de plek van "...". */
export function evalExpr(e: Expr, x: Frac): Frac {
  switch (e.k) {
    case 'num':
      return e.v;
    case 'unk':
      return x;
    case 'pct':
      return evalExpr(e.p, x).mul(Frac.of(1, 100)).mul(evalExpr(e.of, x));
    case 'op': {
      const a = evalExpr(e.a, x);
      const b = evalExpr(e.b, x);
      switch (e.op) {
        case '+':
          return a.add(b);
        case '−':
          return a.sub(b);
        case '×':
          return a.mul(b);
        case ':':
          return a.div(b);
      }
    }
  }
}

/** Klopt de vergelijking als x wordt ingevuld? (deling door nul telt als "klopt niet") */
export function satisfies(eq: Equation, x: Frac): boolean {
  try {
    return evalExpr(eq.lhs, x).eq(evalExpr(eq.rhs, x));
  } catch {
    return false;
  }
}

const prec = (e: Expr): number => {
  if (e.k === 'op') return e.op === '+' || e.op === '−' ? 1 : 2;
  if (e.k === 'pct') return 3;
  return 4;
};

export function formatValue(v: Frac, fmt: Fmt, html: boolean): string {
  if (fmt === 'frac') return html ? fracHtml(v) : v.toFracText();
  return v.toDecimal();
}

export function renderExpr(e: Expr, html: boolean): string {
  switch (e.k) {
    case 'num':
      return formatValue(e.v, e.fmt, html);
    case 'unk':
      return html ? '<span class="blank" aria-label="onbekend">...</span>' : '...';
    case 'pct':
      return `${renderExpr(e.p, html)}% van ${renderExpr(e.of, html)}`;
    case 'op': {
      const p = prec(e);
      const wrapA = prec(e.a) < p;
      const wrapB = prec(e.b) < p || (prec(e.b) === p && (e.op === '−' || e.op === ':'));
      const a = renderExpr(e.a, html);
      const b = renderExpr(e.b, html);
      return `${wrapA ? `(${a})` : a} ${e.op} ${wrapB ? `(${b})` : b}`;
    }
  }
}

export function renderEquation(eq: Equation, html: boolean): string {
  return `${renderExpr(eq.lhs, html)} = ${renderExpr(eq.rhs, html)}`;
}

/** Alle getallen die in de som staan (om de weergave te controleren). */
export function numbersIn(e: Expr): { v: Frac; fmt: Fmt }[] {
  switch (e.k) {
    case 'num':
      return [{ v: e.v, fmt: e.fmt }];
    case 'unk':
      return [];
    case 'pct':
      return [...numbersIn(e.p), ...numbersIn(e.of)];
    case 'op':
      return [...numbersIn(e.a), ...numbersIn(e.b)];
  }
}

export function countUnknowns(e: Expr): number {
  switch (e.k) {
    case 'num':
      return 0;
    case 'unk':
      return 1;
    case 'pct':
      return countUnknowns(e.p) + countUnknowns(e.of);
    case 'op':
      return countUnknowns(e.a) + countUnknowns(e.b);
  }
}
