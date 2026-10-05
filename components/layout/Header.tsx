"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Navigation, X } from "lucide-react";
import { LogoMark } from "@/components/shared/LogoMark";
import { navItems, routeUrl, siteConfig } from "@/config/site";

/** "/menu/" en "/menu" zijn dezelfde pagina */
const normalize = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);

export function Header() {
  const pathname = normalize(usePathname() ?? "/");
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sluit het mobiele menu met Escape en geef de focus terug aan de knop
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Sluit het menu als het scherm breder wordt dan mobiel
  useEffect(() => {
    if (!open) return;
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => media.matches && setOpen(false);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-antraciet/10 bg-creme/95 backdrop-blur supports-[backdrop-filter]:bg-creme/85">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 md:h-20">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-xl"
          onClick={() => setOpen(false)}
        >
          <LogoMark className="h-10 w-10 transition-transform duration-300 motion-safe:group-hover:-rotate-6 md:h-11 md:w-11" />
          <span className="flex flex-col leading-none">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-antraciet-zacht">
              Het
            </span>
            <span className="font-heading text-xl font-extrabold tracking-tight md:text-2xl">
              Frietlokaal
            </span>
          </span>
          <span className="sr-only">, naar de homepage</span>
        </Link>

        <nav aria-label="Hoofdmenu" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = normalize(item.href) === pathname;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-full px-4 py-2 font-semibold transition-colors hover:bg-antraciet/5 ${
                      active ? "text-antraciet" : "text-antraciet-zacht hover:text-antraciet"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span
                        className="absolute inset-x-4 -bottom-0.5 h-1 rounded-full bg-goud"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <a
          href={routeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden min-h-11 items-center gap-2 rounded-full bg-antraciet px-5 font-semibold text-creme transition-colors hover:bg-tomaat hover:text-white md:inline-flex"
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Route
          <span className="sr-only"> naar {siteConfig.name} plannen (opent in een nieuw tabblad)</span>
        </a>

        <button
          ref={buttonRef}
          type="button"
          className="-mr-2 inline-flex h-12 w-12 items-center justify-center rounded-full text-antraciet transition-colors hover:bg-antraciet/5 md:hidden"
          aria-expanded={open}
          aria-controls="mobiel-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-7 w-7" aria-hidden="true" /> : <Menu className="h-7 w-7" aria-hidden="true" />}
          <span className="sr-only">{open ? "Menu sluiten" : "Menu openen"}</span>
        </button>
      </div>

      <nav
        id="mobiel-menu"
        aria-label="Hoofdmenu"
        className={`border-t border-antraciet/10 bg-creme md:hidden ${open ? "block" : "hidden"}`}
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
          {navItems.map((item) => {
            const active = normalize(item.href) === pathname;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-12 items-center rounded-2xl px-4 font-heading text-xl font-bold transition-colors ${
                    active ? "bg-goud text-antraciet" : "hover:bg-antraciet/5"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="pt-2">
            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-antraciet px-5 font-semibold text-creme transition-colors hover:bg-tomaat"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              Route plannen
              <span className="sr-only"> (opent in een nieuw tabblad)</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
