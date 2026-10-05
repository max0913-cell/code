import { Clock, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapPlaceholder } from "@/components/contact/MapPlaceholder";
import { ContactDetails } from "@/components/shared/ContactDetails";
import { OpeningHours } from "@/components/shared/OpeningHours";
import { OpenStatus } from "@/components/shared/OpenStatus";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { fullAddress, siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact en openingstijden",
  description: `Vraag, idee of groot gezelschap? Neem contact op met ${siteConfig.name}. Je vindt ons aan de ${fullAddress}. Bel ${siteConfig.phone.display} of stuur een bericht.`,
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Zeg het maar"
        intro={
          <p>
            Een vraag over allergenen, een bestelling voor een groep of gewoon een compliment? Stuur een berichtje,
            bel even of loop binnen.
          </p>
        }
      >
        <div className="mt-6">
          <OpenStatus />
        </div>
      </PageHeader>

      <Container className="grid gap-8 pb-16 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
        <ContactForm />

        <aside className="space-y-6" aria-label="Contactgegevens">
          <div className="rounded-3xl bg-antraciet p-6 text-creme on-dark sm:p-8">
            <h2 className="mb-5 flex items-center gap-2 font-heading text-xl font-bold text-goud">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Direct contact
            </h2>
            <ContactDetails tone="dark" />
            <div className="mt-6 border-t border-creme/15 pt-6">
              <p className="mb-3 text-sm text-creme/80">Volg ons voor specials en nieuwtjes</p>
              <SocialLinks tone="dark" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-antraciet/5 sm:p-8">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold">
              <Clock className="h-5 w-5 text-tomaat" aria-hidden="true" />
              Openingstijden
            </h2>
            <div className="-mx-3">
              <OpeningHours />
            </div>
          </div>
        </aside>
      </Container>

      <section aria-labelledby="kaart-titel" className="pb-20 sm:pb-24">
        <Container>
          <h2 id="kaart-titel" className="mb-6 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Zo vind je ons
          </h2>
          <MapPlaceholder />
        </Container>
      </section>
    </>
  );
}
