type LogoMarkProps = {
  className?: string;
};

/** Beeldmerk: puntzak friet. Dezelfde vorm staat in app/icon.svg (favicon). */
export function LogoMark({ className = "h-10 w-10" }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="16" fill="#1F1F1F" />
      <g fill="#F4B400">
        <rect x="17" y="13" width="7" height="24" rx="2" transform="rotate(-10 20.5 25)" />
        <rect x="28.5" y="8" width="7" height="28" rx="2" />
        <rect x="40" y="13" width="7" height="24" rx="2" transform="rotate(10 43.5 25)" />
        <rect x="23" y="16" width="6" height="20" rx="2" transform="rotate(-4 26 26)" />
        <rect x="35" y="16" width="6" height="20" rx="2" transform="rotate(4 38 26)" />
      </g>
      <path d="M13 31h38l-5.5 22.5a3 3 0 0 1-2.9 2.3H21.4a3 3 0 0 1-2.9-2.3L13 31Z" fill="#D7263D" />
      <path d="M20 37h24" stroke="#FFF8E7" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}
