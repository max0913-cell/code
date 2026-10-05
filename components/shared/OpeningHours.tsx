"use client";

import { siteConfig } from "@/config/site";
import { formatHours } from "@/lib/opening-hours";
import { useAmsterdamNow } from "./useAmsterdamNow";

type OpeningHoursProps = {
  tone?: "light" | "dark";
};

/** Openingstijden per dag; de huidige dag wordt in de browser gemarkeerd. */
export function OpeningHours({ tone = "light" }: OpeningHoursProps) {
  const now = useAmsterdamNow();
  const isDark = tone === "dark";

  return (
    <dl className="space-y-1">
      {siteConfig.openingHours.map((day) => {
        const isToday = now?.day === day.day;
        const isClosed = !day.open;

        return (
          <div
            key={day.day}
            className={`flex items-baseline justify-between gap-4 rounded-lg px-3 py-1.5 ${
              isToday ? "bg-goud text-antraciet" : ""
            }`}
          >
            <dt className={isToday ? "font-bold" : ""}>
              {day.label}
              {isToday && <span className="sr-only"> (vandaag)</span>}
            </dt>
            <dd
              className={`tabular-nums ${isToday ? "font-bold" : ""} ${
                isClosed && !isToday ? (isDark ? "text-creme/70" : "text-antraciet-zacht") : ""
              }`}
            >
              {formatHours(day)}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
