import { siteConfig } from "@/config/site";

/* Merk-iconen staan niet (meer) in lucide-react, daarom hier als eenvoudige inline SVG */

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const links = [
  { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: siteConfig.social.facebook, label: "Facebook", Icon: FacebookIcon },
];

type SocialLinksProps = {
  tone?: "light" | "dark";
};

export function SocialLinks({ tone = "dark" }: SocialLinksProps) {
  const style =
    tone === "dark"
      ? "bg-creme/10 text-creme hover:bg-goud hover:text-antraciet"
      : "bg-antraciet text-creme hover:bg-tomaat hover:text-white";

  return (
    <ul className="flex gap-3">
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${style}`}
          >
            <Icon />
            <span className="sr-only">
              {siteConfig.name} op {label} (opent in een nieuw tabblad)
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
