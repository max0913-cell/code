import Link from "next/link";
import { ContactDetails } from "@/components/shared/ContactDetails";
import { LogoMark } from "@/components/shared/LogoMark";
import { OpeningHours } from "@/components/shared/OpeningHours";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { Container } from "@/components/ui/Container";
import { navItems, siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-antraciet text-creme">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_0.8fr] lg:gap-10">
        <div className="space-y-5">
          <Link href="/" className="inline-flex items-center gap-3 rounded-xl">
            <LogoMark className="h-12 w-12" />
            <span className="font-heading text-2xl font-extrabold tracking-tight">{siteConfig.name}</span>
          </Link>
          <p className="max-w-xs text-creme/85">
            Sinds {siteConfig.foundingYear} bakken we friet zoals friet bedoeld is: dagvers gesneden, twee
            keer gebakken en met liefde geserveerd.
          </p>
          <SocialLinks tone="dark" />
        </div>

        <div>
          <h2 className="mb-5 font-heading text-lg font-bold text-goud">Contact</h2>
          <ContactDetails tone="dark" />
        </div>

        <div>
          <h2 className="mb-5 font-heading text-lg font-bold text-goud">Openingstijden</h2>
          <div className="-mx-3">
            <OpeningHours tone="dark" />
          </div>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-5 font-heading text-lg font-bold text-goud">Snel naar</h2>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-10 items-center underline-offset-4 transition-colors hover:text-goud hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-creme/10">
        <Container className="flex flex-col gap-2 py-6 text-sm text-creme/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Alle prijzen zijn inclusief btw.
          </p>
          <p>
            Gebakken in {siteConfig.address.city} <span aria-hidden="true">🍟</span>
          </p>
        </Container>
      </div>
    </footer>
  );
}
