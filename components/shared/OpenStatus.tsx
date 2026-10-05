"use client";

import { openStatus } from "@/lib/opening-hours";
import { useAmsterdamNow } from "./useAmsterdamNow";

type OpenStatusProps = {
  className?: string;
};

/** Live "Nu open" / "Nu gesloten"-indicator, alleen zichtbaar in de browser. */
export function OpenStatus({ className = "" }: OpenStatusProps) {
  const now = useAmsterdamNow();

  if (!now) {
    // Zelfde hoogte reserveren zodat de pagina niet verspringt
    return <span className={`inline-block min-h-8 ${className}`} aria-hidden="true" />;
  }

  const { isOpen, text } = openStatus(now);

  return (
    <span
      className={`inline-flex min-h-8 items-center gap-2 rounded-2xl bg-white px-3 py-1 text-sm font-semibold leading-snug text-antraciet shadow-sm ring-1 ring-antraciet/10 ${className}`}
    >
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${isOpen ? "bg-blad" : "bg-tomaat"}`}
        aria-hidden="true"
      />
      {text}
    </span>
  );
}
