@AGENTS.md

# Het Frietlokaal: projectafspraken

Website voor frietzaak Het Frietlokaal. Statische site, geen database, geen login.

## Stack
- **Next.js 16 (App Router) + TypeScript**, statische export (`output: "export"`, `trailingSlash: true`)
- **Tailwind CSS v4**: thema staat in `app/globals.css` (`@theme`), er is geen `tailwind.config`
- **Iconen:** `lucide-react`. Merk-iconen (Instagram/Facebook) zitten niet in lucide; die staan als inline SVG in `components/shared/SocialLinks.tsx`
- **Fonts:** `next/font/google` (Bricolage Grotesque = koppen, Inter = tekst), worden tijdens de build mee verpakt
- Voeg geen nieuwe dependencies toe zonder overleg

## Commando's
```bash
npm run dev     # ontwikkelserver op http://localhost:3000
npm run build   # statische export naar out/ (draait ook TypeScript-check)
npm run lint    # ESLint (flat config, eslint.config.mjs)
npm run preview # gebouwde site (out/) lokaal bekijken op http://localhost:3000
```
Draai na elke wijziging `npm run build` en `npm run lint`; beide moeten zonder fouten slagen.

## Mappenstructuur
```
app/                 routes: page.tsx (home), menu/, over-ons/, contact/, not-found.tsx
                     layout.tsx (fonts, header/footer, standaard-metadata, JSON-LD)
                     sitemap.ts, robots.ts, icon.svg, globals.css
components/layout/   Header (sticky + hamburgermenu), Footer
components/ui/       Container, ButtonLink, SectionHeading, PageHeader, FadeIn
components/home/     Hero, Features, FeaturedProducts, StoryTeaser
components/menu/     CategoryNav (sticky, actieve categorie), MenuSection
components/contact/  ContactForm (Formspree + mailto-fallback), MapPlaceholder
components/shared/   OpeningHours, OpenStatus, ContactDetails, SocialLinks, VisitUs, JsonLd, LogoMark
config/site.ts       ALLE bedrijfsgegevens (adres, telefoon, openingstijden, socials, Formspree-ID, site-URL)
data/menu.ts         ALLE menudata (prijzen in centen, labels, uitgelichte items)
lib/                 format.ts (prijzen), seo.ts (metadata + Restaurant JSON-LD), opening-hours.ts
public/images/       foto's (nu placeholders), og-image.jpg voor social media
```

## Afspraken
- **Geen hardcoded bedrijfsgegevens of prijzen** in componenten: altijd uit `config/site.ts` of `data/menu.ts`.
- **Interne links eindigen op `/`** (`/menu/`), passend bij `trailingSlash: true`.
- **Metadata per pagina** via `pageMetadata()` uit `lib/seo.ts` (zet ook Open Graph en canonical).
- **Server components** standaard; `"use client"` alleen waar nodig (Header, CategoryNav, ContactForm, FadeIn, OpeningHours/OpenStatus).
- **Datum/tijd** ("vandaag", "nu open") alleen in de browser via `useAmsterdamNow()`; de build kent de tijd niet.
- **Afbeeldingen:** `next/image` met `fill` + `sizes`; `images.unoptimized` staat aan (statische export). Bovenaan de pagina `loading="eager"` + `fetchPriority="high"` (in Next 16 is `priority` deprecated). Zet geen `FadeIn` om content die direct in beeld staat (slecht voor LCP).
- **Animaties** alleen via `FadeIn`/CSS en altijd met respect voor `prefers-reduced-motion`.
- **Teksten** in het Nederlands, informeel (je/jij), kort en smakelijk.

## Kleuren en contrast (WCAG AA)
| Token | Hex | Gebruik |
|---|---|---|
| `goud` | #F4B400 | primair, vlakken en knoppen; **nooit als tekst op licht** (1,9:1) |
| `goud-donker` | #7A5900 | gele tekst op lichte achtergrond |
| `antraciet` | #1F1F1F | tekst, donkere vlakken; antraciet op goud = 8,9:1 |
| `antraciet-zacht` | #4A4540 | secundaire tekst |
| `creme` / `creme-donker` | #FFF8E7 / #F7EBCC | achtergronden |
| `tomaat` | #D7263D | labels, knop-hover (wit erop = 5:1), iconen |
| `tomaat-donker` | #B01D31 | rode **tekst** (bovenkopjes, foutmeldingen) |
| `blad` | #2E6B3F | label "Vegetarisch" (wit erop = 6,4:1) |

Op een goudgele achtergrond: alleen antraciet tekst (`SectionHeading tone="gold"`). Donkere secties krijgen de class `on-dark` voor een gele focus-ring.

## Kwaliteit
- Doel: Lighthouse 90+ op alle onderdelen (mobiel en desktop).
- Toegankelijkheid: skiplink, zichtbare focus-states, `aria-current` in navigatie, labels en foutmeldingen gekoppeld via `aria-describedby`.
