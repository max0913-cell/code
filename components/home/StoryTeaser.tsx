import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";

const facts = [
  { value: String(siteConfig.foundingYear), label: "opgericht" },
  { value: "2×", label: "gebakken" },
  { value: "100%", label: "plantaardig vet" },
];

export function StoryTeaser() {
  return (
    <section aria-labelledby="verhaal-titel" className="on-dark bg-antraciet py-20 text-creme sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
            <Image
              src="/images/sanne-en-joris.jpg"
              alt="Sanne en Joris lachend achter de toonbank van Het Frietlokaal"
              fill
              sizes="(min-width: 1024px) 520px, (min-width: 640px) 448px, 100vw"
              className="object-cover"
            />
          </div>
          <div
            className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-goud sm:-right-5 sm:-top-5 sm:h-24 sm:w-24"
            aria-hidden="true"
          />
        </FadeIn>

        <FadeIn delay={120}>
          <SectionHeading
            id="verhaal-titel"
            tone="dark"
            eyebrow="Ons verhaal"
            title="Begonnen met één gedachte: friet kan beter"
          />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-creme/85">
            <p>
              Na jaren in de horeca besloten {siteConfig.founders.join(" en ")} in{" "}
              {siteConfig.foundingYear} het roer om te gooien. Hun plan? Een frietzaak waar alles klopt.
            </p>
            <p>
              Aardappelen van een vaste teler, sauzen die we zelf maken en friet die je nog écht proeft.
              Geen poespas, gewoon eerlijk lekker.
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-creme/15 py-6">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-sm text-creme/80">{fact.label}</dt>
                <dd className="font-heading text-3xl font-extrabold text-goud sm:text-4xl">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <ButtonLink href="/over-ons/" variant="outline-light" className="mt-8">
            Lees ons verhaal
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </ButtonLink>
        </FadeIn>
      </Container>
    </section>
  );
}
