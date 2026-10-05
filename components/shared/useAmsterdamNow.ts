"use client";

import { useSyncExternalStore } from "react";
import { amsterdamNowKey, parseNowKey, type NowInfo } from "@/lib/opening-hours";

function subscribe(onChange: () => void) {
  const interval = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(interval);
}

const getServerSnapshot = () => null;

/**
 * Huidige dag en tijd in Nederland. Geeft `null` tijdens de build (statische HTML)
 * en vult zich in de browser, zodat "vandaag" en "nu open" altijd kloppen.
 */
export function useAmsterdamNow(): NowInfo | null {
  const key = useSyncExternalStore(subscribe, () => amsterdamNowKey(), getServerSnapshot);
  return key ? parseNowKey(key) : null;
}
