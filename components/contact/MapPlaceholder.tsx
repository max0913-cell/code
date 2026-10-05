import { MapPin, Navigation } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { mapsUrl, routeUrl, siteConfig } from "@/config/site";

/**
 * Placeholder voor een kaart. Bewust geen Google Maps-embed:
 * dat scheelt honderden kilobytes, cookies en een cookiemelding.
 * Wil je later een echte kaart? Vervang dit blok door een <iframe>.
 */
export function MapPlaceholder() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-creme-donker ring-1 ring-antraciet/10">
      {/* Gestileerde "straten" */}
      <div
        className="absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage: [
            "linear-gradient(90deg, transparent 47%, #fff 47%, #fff 53%, transparent 53%)",
            "linear-gradient(0deg, transparent 46%, #fff 46%, #fff 54%, transparent 54%)",
            "linear-gradient(90deg, transparent 0 49%, rgba(31,31,31,0.06) 49% 51%, transparent 51%)",
            "linear-gradient(0deg, transparent 0 49%, rgba(31,31,31,0.06) 49% 51%, transparent 51%)",
          ].join(","),
          backgroundSize: "100% 100%, 100% 100%, 90px 90px, 90px 90px",
        }}
      />
      <div
        className="absolute left-[8%] top-[12%] h-24 w-32 rounded-3xl bg-blad/15 sm:h-32 sm:w-48"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[10%] right-[6%] h-20 w-40 rounded-3xl bg-goud/25 sm:w-56"
        aria-hidden="true"
      />

      <div className="relative flex min-h-[22rem] flex-col items-center justify-center gap-5 p-6 text-center sm:min-h-[26rem]">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-tomaat text-white shadow-lg shadow-tomaat/30">
          <MapPin className="h-8 w-8" aria-hidden="true" />
        </span>
        <div className="rounded-3xl bg-white/95 px-6 py-5 shadow-md">
          <p className="font-heading text-xl font-extrabold">{siteConfig.name}</p>
          <p className="text-antraciet-zacht">
            {siteConfig.address.street}, {siteConfig.address.postalCode} {siteConfig.address.city}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={routeUrl} variant="dark">
            <Navigation className="h-5 w-5" aria-hidden="true" />
            Route plannen
          </ButtonLink>
          <ButtonLink href={mapsUrl} variant="outline" className="bg-white">
            Bekijk op Google Maps
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
