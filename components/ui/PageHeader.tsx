import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "./Container";

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  image?: { src: string; alt: string };
  children?: ReactNode;
};

/** Kop bovenaan subpagina's: titel links, optioneel een grote foto rechts */
export function PageHeader({ eyebrow, title, intro, image, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-24 -top-40 h-[26rem] w-[26rem] rounded-full bg-goud/25 blur-3xl"
        aria-hidden="true"
      />
      <Container
        className={`relative grid items-center gap-10 pb-12 pt-10 sm:pt-14 lg:pb-16 lg:pt-16 ${
          image ? "lg:grid-cols-[1.1fr_1fr] lg:gap-14" : ""
        }`}
      >
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-tomaat-donker">{eyebrow}</p>
          <h1 className="font-heading text-4xl font-extrabold leading-[1] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <div className="mt-5 text-lg leading-relaxed text-antraciet-zacht sm:text-xl">{intro}</div>
          {children}
        </div>

        {image && (
          <div className="relative hidden aspect-[2/1] overflow-hidden rounded-[2rem] shadow-lg shadow-antraciet/10 sm:block lg:aspect-[4/3]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </Container>
    </section>
  );
}
