import Image from "next/image";
import { ArrowRight, Navigation } from "lucide-react";
import { OpenStatus } from "@/components/shared/OpenStatus";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { routeUrl, siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-titel">
      {/* Decoratieve vormen */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-goud/25 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative grid items-center gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-antraciet px-4 py-1.5 text-sm font-semibold text-creme">
            <span className="h-2 w-2 rounded-full bg-goud" aria-hidden="true" />
            Sinds {siteConfig.foundingYear} in {siteConfig.address.city}
          </p>

          <h1
            id="hero-titel"
            className="font-heading text-[2.9rem] font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Friet zoals friet{" "}
            <span className="box-decoration-clone bg-[linear-gradient(transparent_62%,var(--color-goud)_62%,var(--color-goud)_92%,transparent_92%)] px-1">
              bedoeld
            </span>{" "}
            is
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-antraciet-zacht sm:text-xl">
            Elke dag vers gesneden, twee keer gebakken, met liefde geserveerd.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/menu/">
              Bekijk het menu
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={routeUrl} variant="outline">
              <Navigation className="h-5 w-5" aria-hidden="true" />
              Route plannen
            </ButtonLink>
          </div>

          <div className="mt-8">
            <OpenStatus />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            className="absolute -inset-3 rotate-3 rounded-[2.75rem] bg-goud sm:-inset-4"
            aria-hidden="true"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] shadow-xl shadow-antraciet/15 sm:aspect-square lg:aspect-[4/5]">
            <Image
              src="/images/hero.jpg"
              alt="Een rijkelijk gevuld bakje goudbruine, verse friet met mayonaise"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 520px, (min-width: 640px) 448px, 100vw"
              className="object-cover"
            />
          </div>
          <div
            className="absolute -bottom-6 -left-3 flex h-28 w-28 -rotate-12 flex-col items-center justify-center rounded-full bg-tomaat text-center font-heading font-extrabold leading-tight text-white shadow-lg sm:-left-6 sm:h-32 sm:w-32"
            aria-hidden="true"
          >
            <span className="text-3xl sm:text-4xl">2×</span>
            <span className="text-sm sm:text-base">gebakken</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
