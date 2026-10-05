import { CupSoda, Droplet, Sparkles, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { MenuLabelBadge } from "@/components/shared/MenuLabelBadge";
import { FadeIn } from "@/components/ui/FadeIn";
import type { MenuCategory, MenuItem } from "@/data/menu";
import { formatPrice } from "@/lib/format";

function FriesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10 5.5 3.5M10 10V2.5M14 10V2.5M17 10l1.5-6.5" />
      <path d="M4 10h16l-2.2 10.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8Z" />
    </svg>
  );
}

const icons: Record<string, LucideIcon | typeof FriesIcon> = {
  friet: FriesIcon,
  snacks: UtensilsCrossed,
  sauzen: Droplet,
  specials: Sparkles,
  dranken: CupSoda,
};

function Prices({ item }: { item: MenuItem }) {
  if (item.prices.length === 1) {
    return (
      <p className="shrink-0 font-heading text-xl font-bold tabular-nums">
        {formatPrice(item.prices[0].amount)}
      </p>
    );
  }

  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Prijzen ${item.name}`}>
      {item.prices.map((price) => (
        <li
          key={price.size}
          className="inline-flex items-center gap-2 rounded-full bg-creme px-3 py-1.5 ring-1 ring-antraciet/10"
        >
          <span className="text-sm text-antraciet-zacht">{price.size}</span>
          <span className="font-bold tabular-nums">{formatPrice(price.amount)}</span>
        </li>
      ))}
    </ul>
  );
}

export function MenuSection({ category }: { category: MenuCategory }) {
  const Icon = icons[category.id] ?? UtensilsCrossed;
  const titleId = `${category.id}-titel`;

  return (
    <section id={category.id} aria-labelledby={titleId} className="scroll-mt-36 md:scroll-mt-40">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-goud">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
          <h2 id={titleId} className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            {category.name}
          </h2>
          <p className="text-antraciet-zacht">{category.intro}</p>
        </div>
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {category.items.map((item, index) => {
          const multiPrice = item.prices.length > 1;
          return (
            <li key={item.id} className={multiPrice ? "md:col-span-2" : ""}>
              <FadeIn
                delay={(index % 2) * 80}
                className="h-full rounded-3xl bg-white p-5 shadow-sm ring-1 ring-antraciet/5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-xl font-bold leading-tight">{item.name}</h3>
                    {item.labels && (
                      <p className="mt-2 flex flex-wrap gap-2">
                        {item.labels.map((label) => (
                          <MenuLabelBadge key={label} label={label} />
                        ))}
                      </p>
                    )}
                  </div>
                  {!multiPrice && <Prices item={item} />}
                </div>
                <p className="mt-2 leading-relaxed text-antraciet-zacht">{item.description}</p>
                {multiPrice && <Prices item={item} />}
              </FadeIn>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
