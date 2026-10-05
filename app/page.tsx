import { Features } from "@/components/home/Features";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { StoryTeaser } from "@/components/home/StoryTeaser";
import { VisitUs } from "@/components/shared/VisitUs";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `${siteConfig.name} | Verse friet in ${siteConfig.address.city}`,
  description: `Dagvers gesneden friet, twee keer gebakken, met huisgemaakte sauzen en klassieke snacks. Kom langs aan de ${siteConfig.address.street} in ${siteConfig.address.city}.`,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedProducts />
      <StoryTeaser />
      <VisitUs />
    </>
  );
}
