/**
 * Figuren die met elkaar vergeleken moeten worden (stukken en opties bij componenten,
 * de figuren bij spiegelbeelden) krijgen exact dezelfde schaal: één hokje is overal even groot.
 * Elke SVG heeft data-u = breedte in hokjes; we kiezen per vraag de grootste schaal die overal past.
 */
export function fitFigures(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-scale-group]').forEach((group) => {
    if (group.offsetParent === null) return; // verborgen (bijvoorbeeld een dichte uitklapper)
    const svgs = [...group.querySelectorAll<SVGSVGElement>('svg[data-u]')];
    if (svgs.length === 0) return;
    for (const s of svgs) s.style.width = '';
    let u = 30;
    for (const s of svgs) {
      const units = Number(s.getAttribute('data-u'));
      const parent = s.parentElement;
      if (!parent || !(units > 0)) continue;
      const cs = getComputedStyle(parent);
      const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (avail > 0) u = Math.min(u, avail / units);
    }
    u = Math.max(6, Math.floor(u * 10) / 10);
    for (const s of svgs) s.style.width = `${(u * Number(s.getAttribute('data-u'))).toFixed(1)}px`;
  });
}

let installed = false;
export function installFigureScaling(): void {
  if (installed) return;
  installed = true;
  let t: number | undefined;
  window.addEventListener('resize', () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fitFigures(document), 80);
  });
  document.addEventListener(
    'toggle',
    (e) => {
      const el = e.target as HTMLElement;
      if (el.tagName === 'DETAILS') fitFigures(el);
    },
    true,
  );
}
