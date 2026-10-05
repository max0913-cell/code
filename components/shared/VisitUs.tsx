import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { ContactDetails } from "@/components/shared/ContactDetails";
import { OpeningHours } from "@/components/shared/OpeningHours";
import { OpenStatus } from "@/components/shared/OpenStatus";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routeUrl, siteConfig } from "@/config/site";

/** Blok met openingstijden en adres (homepage) */
export function VisitUs() {
  return (
    <section aria-labelledby="langskomen-titel" className="py-20 sm:py-24">
      <Container>
        <FadeIn className="rounded-[2.5rem] bg-goud p-6 sm:p-10 lg:p-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              id="langskomen-titel"
              tone="gold"
              eyebrow="Kom langs"
              title="Trek gekregen?"
              intro="Loop binnen, bestel aan de toonbank en eet hier of neem mee."
            />
            <OpenStatus className="self-start sm:self-auto" />
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 sm:p-8">
              <h3 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold">
                <Clock className="h-5 w-5 text-tomaat" aria-hidden="true" />
                Openingstijden
              </h3>
              <div className="-mx-3">
                <OpeningHours />
              </div>
            </div>

            <div className="flex flex-col rounded-3xl bg-white p-6 sm:p-8">
              <h3 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold">
                <MapPin className="h-5 w-5 text-tomaat" aria-hidden="true" />
                Hier vind je ons
              </h3>
              <ContactDetails />
              <p className="mt-5 text-antraciet-zacht">
                Midden in het centrum van {siteConfig.address.city}, op een paar minuten lopen van de markt.
              </p>
              <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
                <ButtonLink href={routeUrl} variant="dark">
                  <Navigation className="h-5 w-5" aria-hidden="true" />
                  Route plannen
                </ButtonLink>
                <ButtonLink href={`tel:${siteConfig.phone.international}`} variant="outline">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  Bel ons
                </ButtonLink>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
