import type { Metadata } from "next";
import { mapsUrl, siteConfig } from "@/config/site";

const ogImage = {
  url: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name}: verse friet in ${siteConfig.address.city}`,
};

type PageMetadataInput = {
  title: string;
  description: string;
  /** Pad van de pagina, bijv. "/menu/" */
  path: string;
  /** true = title niet aanvullen met " | Het Frietlokaal" */
  absoluteTitle?: boolean;
};

/**
 * Bouwt per pagina een complete set metadata.
 * Open Graph wordt in Next.js per pagina in z'n geheel overschreven,
 * daarom zetten we hier steeds alle velden opnieuw.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const ogTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "nl_NL",
      siteName: siteConfig.name,
      url: path,
      title: ogTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage.url],
    },
  };
}

/** Restaurant structured data (schema.org) met adres en openingstijden */
export function restaurantJsonLd() {
  const { address, phone, email, url, name, social, openingHours } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${url}/#restaurant`,
    name,
    description: siteConfig.shortDescription,
    url,
    image: `${url}/images/hero.jpg`,
    logo: `${url}/icon.svg`,
    telephone: phone.international,
    email,
    priceRange: "€",
    servesCuisine: ["Friet", "Snacks", "Nederlands"],
    acceptsReservations: false,
    hasMenu: `${url}/menu/`,
    foundingDate: String(siteConfig.foundingYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      postalCode: address.postalCode,
      addressLocality: address.city,
      addressCountry: address.country,
    },
    openingHoursSpecification: openingHours
      .filter((day) => day.open && day.close)
      .map((day) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${day.day}`,
        opens: day.open,
        closes: day.close,
      })),
    sameAs: [social.instagram, social.facebook],
    hasMap: mapsUrl,
  };
}
