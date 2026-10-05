const priceFormatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
});

/** 295 → "€ 2,95" */
export function formatPrice(cents: number): string {
  return priceFormatter.format(cents / 100);
}
