import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MenuLabelBadge } from "@/components/shared/MenuLabelBadge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredItems } from "@/data/menu";
import { formatPrice } from "@/lib/format";

export function FeaturedProducts() {
  return (
    <section aria-labelledby="favorieten-titel" className="bg-creme-donker/60 py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="favorieten-titel"
            eyebrow="Favorieten"
            title="Hier komen ze voor terug"
            intro="Drie gerechten die bijna iedereen bestelt. Begin hier als je twijfelt."
          />
          <ButtonLink href="/menu/" variant="outline" className="shrink-0 self-start sm:self-auto">
            Bekijk het hele menu
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </ButtonLink>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItems.map((item, index) => {
            const lowest = Math.min(...item.prices.map((price) => price.amount));
            const priceText =
              item.prices.length > 1 ? `vanaf ${formatPrice(lowest)}` : formatPrice(lowest);

            return (
              <li key={item.id} className={index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}>
                <FadeIn
                  delay={index * 120}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-antraciet/5 transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.imageAlt ?? ""}
                        fill
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                      />
                    )}
                    {item.labels && (
                      <div className="absolute left-4 top-4 flex gap-2">
                        {item.labels.map((label) => (
                          <MenuLabelBadge key={label} label={label} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-heading text-2xl font-bold">{item.name}</h3>
                      <p className="shrink-0 rounded-full bg-goud px-3 py-1 font-bold tabular-nums">
                        {priceText}
                      </p>
                    </div>
                    <p className="mt-2 leading-relaxed text-antraciet-zacht">{item.description}</p>
                  </div>
                </FadeIn>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
