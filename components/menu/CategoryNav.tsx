"use client";

import { useEffect, useRef, useState } from "react";

type CategoryNavProps = {
  categories: { id: string; name: string }[];
};

/**
 * Sticky balk met de menucategorieën. Licht de categorie op die je
 * op dat moment bekijkt en scrolt die knop zelf in beeld op mobiel.
 */
export function CategoryNav({ categories }: CategoryNavProps) {
  const [active, setActive] = useState(categories[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const nav = listRef.current?.closest("nav");
      const offset = (nav?.getBoundingClientRect().bottom ?? 0) + 24;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

      let current = categories[0]?.id;
      for (const category of categories) {
        const section = document.getElementById(category.id);
        if (section && section.getBoundingClientRect().top <= offset) current = category.id;
      }
      if (atBottom) current = categories[categories.length - 1]?.id;
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [categories]);

  // Houd de actieve knop zichtbaar in de horizontaal scrollende lijst
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    if (!list || !link) return;
    const left = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left, behavior: reduceMotion ? "auto" : "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="Menucategorieën"
      className="sticky top-16 z-40 border-y border-antraciet/10 bg-creme/95 backdrop-blur supports-[backdrop-filter]:bg-creme/85 md:top-20"
    >
      <ul
        ref={listRef}
        className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-3 sm:px-8"
      >
        {categories.map((category) => {
          const isActive = category.id === active;
          return (
            <li key={category.id} className="shrink-0">
              <a
                href={`#${category.id}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => setActive(category.id)}
                className={`inline-flex min-h-11 items-center rounded-full px-5 font-semibold transition-colors ${
                  isActive
                    ? "bg-antraciet text-creme"
                    : "bg-white text-antraciet ring-1 ring-antraciet/10 hover:bg-goud"
                }`}
              >
                {category.name}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
