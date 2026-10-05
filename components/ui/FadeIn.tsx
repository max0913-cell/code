"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  /** Vertraging in milliseconden, handig om kaarten na elkaar te laten verschijnen */
  delay?: number;
};

/**
 * Laat de inhoud zacht invaden zodra die in beeld scrollt.
 * De animatie zelf staat in globals.css en draait alleen als
 * de bezoeker geen "beperkte beweging" heeft ingesteld.
 */
export function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = delay ? ({ "--fade-delay": `${delay}ms` } as CSSProperties) : undefined;

  return (
    <div ref={ref} className={`fade-in ${className}`} style={style}>
      {children}
    </div>
  );
}
