import { Mail, MapPin, Phone } from "lucide-react";
import { mapsUrl, siteConfig } from "@/config/site";

type ContactDetailsProps = {
  tone?: "light" | "dark";
};

export function ContactDetails({ tone = "light" }: ContactDetailsProps) {
  const isDark = tone === "dark";
  const iconClass = `mt-0.5 h-5 w-5 shrink-0 ${isDark ? "text-goud" : "text-tomaat"}`;
  const linkClass = `underline decoration-2 underline-offset-4 transition-colors ${
    isDark ? "decoration-goud/60 hover:text-goud" : "decoration-goud hover:text-tomaat"
  }`;
  const { address, phone, email } = siteConfig;

  return (
    <ul className="space-y-4">
      <li className="flex gap-3">
        <MapPin className={iconClass} aria-hidden="true" />
        <address className="not-italic">
          <span className="sr-only">Adres: </span>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {address.street}
            <br />
            {address.postalCode} {address.city}
            <span className="sr-only"> (bekijk op Google Maps, opent in een nieuw tabblad)</span>
          </a>
        </address>
      </li>
      <li className="flex gap-3">
        <Phone className={iconClass} aria-hidden="true" />
        <span>
          <span className="sr-only">Telefoon: </span>
          <a href={`tel:${phone.international}`} className={linkClass}>
            {phone.display}
          </a>
        </span>
      </li>
      <li className="flex gap-3">
        <Mail className={iconClass} aria-hidden="true" />
        <span>
          <span className="sr-only">E-mail: </span>
          <a href={`mailto:${email}`} className={`${linkClass} break-all`}>
            {email}
          </a>
        </span>
      </li>
    </ul>
  );
}
