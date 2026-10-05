import { CookingPot, Scissors, Timer, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

const features: { title: string; text: string; Icon: LucideIcon }[] = [
  {
    title: "Dagvers gesneden",
    text: "Elke ochtend schillen en snijden we onze aardappelen zelf. Diepvriesfriet komt er bij ons niet in.",
    Icon: Scissors,
  },
  {
    title: "Huisgemaakte sauzen",
    text: "Van truffelmayo tot satésaus: we maken alles elke ochtend vers in onze eigen keuken.",
    Icon: CookingPot,
  },
  {
    title: "Klaar binnen 10 minuten",
    text: "Vers bakken kost tijd, maar niet veel. Binnen tien minuten heb je je bestelling in handen.",
    Icon: Timer,
  },
];

export function Features() {
  return (
    <section aria-labelledby="kernpunten-titel" className="pb-20 sm:pb-24">
      <Container>
        <h2 id="kernpunten-titel" className="sr-only">
          Waarom onze friet beter is
        </h2>
        <ul className="grid gap-5 md:grid-cols-3">
          {features.map(({ title, text, Icon }, index) => (
            <li key={title}>
              <FadeIn
                delay={index * 120}
                className="flex h-full gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-antraciet/5 transition-shadow hover:shadow-md md:flex-col md:p-7"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-goud text-antraciet md:h-14 md:w-14">
                  <Icon className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true" strokeWidth={2.2} />
                </span>
                <div>
                  <h3 className="font-heading text-xl font-bold md:text-2xl">{title}</h3>
                  <p className="mt-1.5 leading-relaxed text-antraciet-zacht md:mt-2">{text}</p>
                </div>
              </FadeIn>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
