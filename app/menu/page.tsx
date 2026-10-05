import { Info, Navigation } from "lucide-react";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { MenuSection } from "@/components/menu/MenuSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { routeUrl, siteConfig } from "@/config/site";
import { menu } from "@/data/menu";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Menu en prijzen",
  description:
    "Bekijk ons menu met prijzen: dagverse friet, loaded friet, truffelfriet, frietje stoofvlees, Hollandse snacks, huisgemaakte sauzen en dranken.",
  path: "/menu/",
});

export default function MenuPage() {
  return (
    <>
      <PageHeader
        eyebrow="Menu"
        title="Waar heb je zin in?"
        intro={
          <p>
            Alles wordt pas gebakken als jij bestelt. Combineer je friet met een van onze huisgemaakte sauzen,
            of ga all-in met een special.
          </p>
        }
        image={{
          src: "/images/menu-header.jpg",
          alt: "Tafel vol bakjes friet, snacks en verschillende sauzen",
        }}
      />

      <CategoryNav categories={menu.map(({ id, name }) => ({ id, name }))} />

      <Container className="space-y-20 py-14 sm:py-20">
        {menu.map((category) => (
          <MenuSection key={category.id} category={category} />
        ))}

        <aside className="flex flex-col gap-6 rounded-[2rem] bg-antraciet p-6 text-creme on-dark sm:p-10 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <Info className="mt-1 h-6 w-6 shrink-0 text-goud" aria-hidden="true" />
            <div>
              <h2 className="font-heading text-2xl font-bold">Allergieën of vragen?</h2>
              <p className="mt-1 max-w-xl text-creme/85">
                We bakken in 100% plantaardig vet. Vraag ons gerust naar allergenen, we helpen je graag.
                Bellen kan ook: {siteConfig.phone.display}.
              </p>
            </div>
          </div>
          <ButtonLink href={routeUrl} className="shrink-0">
            <Navigation className="h-5 w-5" aria-hidden="true" />
            Route plannen
          </ButtonLink>
        </aside>
      </Container>
    </>
  );
}
