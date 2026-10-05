import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  description: "Deze pagina bestaat niet (meer). Ga terug naar de homepage of bekijk ons menu.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center sm:py-32">
      <p className="font-heading text-8xl font-extrabold text-goud-donker sm:text-9xl">404</p>
      <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
        Oeps, deze friet is op
      </h1>
      <p className="mt-4 max-w-md text-lg text-antraciet-zacht">
        De pagina die je zoekt bestaat niet (meer). Gelukkig is de rest van de zaak gewoon open.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Naar de homepage</ButtonLink>
        <ButtonLink href="/menu/" variant="outline">
          Bekijk het menu
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </ButtonLink>
      </div>
    </Container>
  );
}
