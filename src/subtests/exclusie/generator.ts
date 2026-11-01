import type { Rng } from '../../core/rng';
import { LETTERS, type Level, type Question } from '../../core/types';
import { type Fig, oddOneOut, shapePoints, FLAG_BASES, rotatePt } from './model';
import { describeFig, figSvg } from './render';
import { ALL_FEATURES, RULES, type Rule } from './rules';

export interface ExclusieItem {
  rule: Rule;
  figs: Fig[];
  odd: number;
}

/** Ligt alles binnen het vak? */
function inBounds(f: Fig): boolean {
  const ok = (v: number) => v >= 1.5 && v <= 98.5;
  for (const e of f.els) {
    if (e.t === 'shape') {
      if (e.kind === 'circle') {
        if (!ok(e.x - e.r) || !ok(e.x + e.r) || !ok(e.y - e.r) || !ok(e.y + e.r)) return false;
      } else if (shapePoints(e).some(([x, y]) => !ok(x) || !ok(y))) return false;
    }
    if (e.t === 'dot' && (!ok(e.x - e.r) || !ok(e.x + e.r) || !ok(e.y - e.r) || !ok(e.y + e.r))) return false;
    if (e.t === 'line' && ![e.x1, e.y1, e.x2, e.y2].every(ok)) return false;
    if (e.t === 'arrow') {
      const a = (e.dir * Math.PI) / 180;
      const dx = (Math.sin(a) * e.len) / 2;
      const dy = (-Math.cos(a) * e.len) / 2;
      if (![e.x + dx, e.y + dy, e.x - dx, e.y - dy].every(ok)) return false;
    }
    if (e.t === 'flag') {
      const g = FLAG_BASES[e.base];
      const pts = [...g.lines.flat(), ...g.polys.flatMap((p) => p.pts)].map((p) => rotatePt([e.mirror ? -p[0] : p[0], p[1]], e.rot));
      if (pts.some(([x, y]) => !ok(50 + x * 34) || !ok(50 + y * 34))) return false;
    }
  }
  return true;
}

/**
 * Alle correctheidschecks voor een exclusie-opgave (leeg = goed):
 * - de regel wijst precies één afwijker aan (4 voldoen, 1 niet), en dat is de bedoelde;
 * - geen enkele andere eigenschap of regel wijst een andere figuur aan;
 * - geen andere eigenschap wijst dezelfde afwijker aan (behalve wat logisch uit de regel volgt);
 * - de vijf figuren zijn verschillend en passen in het vak.
 */
export function checkExclusie(rule: Rule, figs: Fig[], odd: number): string[] {
  const errs: string[] = [];
  if (figs.length !== 5) return ['niet 5 figuren'];
  const own = ALL_FEATURES[rule.feature](figs);
  if (oddOneOut(own) !== odd) errs.push(`regel ${rule.id} wijst niet precies de afwijker aan`);
  for (const [name, fn] of Object.entries(ALL_FEATURES)) {
    const j = oddOneOut(fn(figs));
    if (j < 0) continue;
    if (j !== odd) errs.push(`${name} wijst ${LETTERS[j]} aan`);
    else if (name !== rule.feature && !rule.allowed.includes(name)) errs.push(`${name} wijst ook de afwijker aan`);
  }
  const keys = figs.map((f) => JSON.stringify(f.els.map((e) => ({ ...e }))));
  if (new Set(keys).size !== 5) errs.push('twee figuren zijn gelijk');
  if (!figs.every(inBounds)) errs.push('figuur buiten het vak');
  return errs;
}

export function generateExclusie(level: Level, r: Rng, ruleId?: string): ExclusieItem {
  const rules = RULES[level];
  for (let attempt = 0; attempt < 5000; attempt++) {
    const rule = ruleId ? rules.find((x) => x.id === ruleId)! : r.pick(rules);
    const odd = r.int(0, 4);
    const figs = rule.gen(r, odd);
    if (!figs) continue;
    if (checkExclusie(rule, figs, odd).length === 0) return { rule, figs, odd };
  }
  throw new Error(`Kon geen exclusie-opgave maken (${level}${ruleId ? `, ${ruleId}` : ''})`);
}

export function exclusieToQuestion(it: ExclusieItem, level: Level): Question {
  const labels = it.figs.map(describeFig);
  return {
    key: `${it.rule.id}|${JSON.stringify(it.figs)}`,
    subtest: 'exclusie',
    level,
    type: it.rule.id,
    instruction: 'Vier figuren volgen dezelfde regel. Welke figuur hoort er niet bij?',
    promptHtml: '',
    promptLabel: `Exclusie (${it.rule.id.replace(/_/g, ' ')})`,
    options: it.figs.map((f, i) => ({ html: figSvg(f, `Figuur ${LETTERS[i]}: ${labels[i]}`), label: labels[i] })),
    correct: [it.odd],
    explanationHtml: `<p>${it.rule.explain(it.figs, it.odd)}</p>`,
    optionStyle: 'figure',
  };
}
