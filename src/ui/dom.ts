type Child = Node | string | number | null | undefined | false;
type Props = Record<string, unknown> | null;

/** Kleine helper om DOM-elementen te maken: h('button', { class: 'btn', onclick }, 'Tekst'). */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, props?: Props, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') el.className = String(v);
      else if (k === 'html') el.innerHTML = String(v);
      else if (k === 'text') el.textContent = String(v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v as EventListener);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, String(v));
    }
  }
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    el.append(typeof c === 'number' ? String(c) : c);
  }
  return el;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export function formatTime(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export function formatSeconds(ms: number): string {
  const s = ms / 1000;
  return s < 10 ? `${s.toFixed(1).replace('.', ',')} s` : `${Math.round(s)} s`;
}

export function formatDate(t: number): string {
  const d = new Date(t);
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function setTitle(part: string): void {
  document.title = part ? `${part} · NOA-oefenen` : 'NOA-oefenen · Geneeskunde Erasmus MC';
}

/** Laat lege waarden weg, zodat je `cond ? el : null` in lijsten kunt gebruiken. */
export const nodes = (...xs: (Node | null | undefined | false)[]): Node[] => xs.filter((x): x is Node => !!x);
