import Image from "next/image";
import { ArrowRight, Award, Flame, HeartHandshake, Sprout, Utensils, Zap, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Over ons",
  description: `In ${siteConfig.foundingYear} begonnen Sanne en Joris Het Frietlokaal: eerlijke friet van aardappelen van een vaste teler, twee keer gebakken in plantaardig vet.`,
  path: "/over-ons/",
});

const steps: { title: string; text: string; Icon: LucideIcon }[] = [
  {
    title: "Van onze vaste teler",
    text: "Onze aardappelen komen al sinds dag één van dezelfde teler. We weten precies waar ze vandaan komen en hoe ze gegroeid zijn.",
    Icon: Sprout,
  },
  {
    title: "Twee keer gebakken",
    text: "Eerst op lage temperatuur voor een zachte binnenkant, daarna kort en heet voor die krokante korst. Altijd in 100% plantaardig vet.",
    Icon: Flame,
  },
  {
    title: "Sauzen van vanochtend",
    text: "Elke ochtend draaien we onze sauzen vers: van klassieke mayo tot truffelmayo en satésaus. Geen emmers uit de groothandel.",
    Icon: Utensils,
  },
];

const values: { title: string; text: string; Icon: LucideIcon }[] = [
  {
    title: "Kwaliteit",
    text: "Goede friet begint bij goede aardappelen. We besparen nooit op ingrediënten.",
    Icon: Award,
  },
  {
    title: "Gezelligheid",
    text: "Bij ons ben je geen bestelnummer. We maken graag een praatje aan de toonbank.",
    Icon: HeartHandshake,
  },
  {
    title: "Snelheid",
    text: "Vers is niet traag. Binnen tien minuten staat je bestelling klaar.",
    Icon: Zap,
  },
];

export default function OverOnsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Over ons"
        title="Twee vrienden, één missie: betere friet"
        intro={
          <p>
            {siteConfig.name} is begonnen met een simpele ergernis: waarom is friet zo vaak slap, vet en
            saai? Dat kon beter. Dus deden we het zelf.
          </p>
        }
      />

      {/* Het verhaal */}
      <section aria-labelledby="verhaal-titel" className="pb-20 sm:pb-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Geen fade-in: deze foto staat op mobiel direct in beeld (LCP) */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-3 -rotate-2 rounded-[2.75rem] bg-goud" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
              <Image
                src="/images/sanne-en-joris.jpg"
                alt="Sanne en Joris, de oprichters van Het Frietlokaal, voor hun zaak"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 520px, (min-width: 640px) 448px, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <FadeIn delay={120}>
            <SectionHeading id="verhaal-titel" eyebrow="Het verhaal" title="Van collega's naar compagnons" />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-antraciet-zacht">
              <p>
                Sanne en Joris leerden elkaar kennen in de keuken van een druk restaurant. Jarenlang stonden
                ze zij aan zij achter het fornuis, en na elke late dienst haalden ze samen een zak friet.
              </p>
              <p>
                Die friet viel steeds tegen. Slap, te vet, sauzen uit een emmer. &ldquo;Dit moet toch beter
                kunnen?&rdquo; werd hun vaste grap, tot het in {siteConfig.foundingYear} geen grap meer was.
              </p>
              <p>
                Ze zegden hun baan op en openden {siteConfig.name} aan de {siteConfig.address.street}. Met
                eerlijke producten, een open keuken en friet waar ze zelf trots op zijn.
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Werkwijze */}
      <section aria-labelledby="werkwijze-titel" className="bg-creme-donker/60 py-20 sm:py-24">
        <Container>
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.9fr]">
            <SectionHeading
              id="werkwijze-titel"
              eyebrow="Onze werkwijze"
              title="Van aardappel tot puntzak"
              intro="Goede friet heeft geen geheim recept nodig. Wel aandacht, elke dag opnieuw."
            />
            <FadeIn className="relative hidden aspect-[4/3] overflow-hidden rounded-[2rem] lg:block">
              <Image
                src="/images/aardappelen.jpg"
                alt="Kist met verse, ongeschilde aardappelen van onze vaste teler"
                fill
                sizes="480px"
                className="object-cover"
              />
            </FadeIn>
          </div>

          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map(({ title, text, Icon }, index) => (
              <li key={title}>
                <FadeIn delay={index * 120} className="relative h-full rounded-3xl bg-white p-7 shadow-sm ring-1 ring-antraciet/5">
                  <span
                    className="absolute right-6 top-5 font-heading text-6xl font-extrabold text-antraciet/10"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-goud">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-2xl font-bold">
                    <span className="sr-only">Stap {index + 1}: </span>
                    {title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-antraciet-zacht">{text}</p>
                </FadeIn>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Kernwaarden */}
      <section aria-labelledby="waarden-titel" className="on-dark bg-antraciet py-20 text-creme sm:py-24">
        <Container>
          <SectionHeading
            id="waarden-titel"
            tone="dark"
            align="center"
            eyebrow="Waar we voor staan"
            title="Drie dingen die we nooit vergeten"
          />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map(({ title, text, Icon }, index) => (
              <li key={title}>
                <FadeIn delay={index * 120} className="h-full rounded-3xl bg-creme/5 p-7 text-center ring-1 ring-creme/10">
                  <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-goud text-antraciet">
                    <Icon className="h-8 w-8" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-goud">{title}</h3>
                  <p className="mt-2 leading-relaxed text-creme/85">{text}</p>
                </FadeIn>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* CTA */}
      <section aria-labelledby="proef-titel" className="py-20 sm:py-24">
        <Container>
          <FadeIn className="flex flex-col items-start gap-6 rounded-[2.5rem] bg-goud p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="proef-titel" className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                Genoeg gelezen. Tijd om te proeven.
              </h2>
              <p className="mt-2 text-lg">Bekijk wat er vandaag uit de frituur komt.</p>
            </div>
            <ButtonLink href="/menu/" variant="dark" className="shrink-0">
              Naar het menu
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </ButtonLink>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
