import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { bedrijf } from './src/data/bedrijf';

// Pagina's die niet in de sitemap horen (noindex).
const nietInSitemap = ['/bedankt', '/404'];

export default defineConfig({
  site: bedrijf.url,
  // Schone URL's zonder slash aan het eind: /kapper, /prijzen, ...
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      filter: (pagina) => !nietInSitemap.some((pad) => new URL(pagina).pathname === pad),
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
  // Poppins, zelf gehost (alleen de gebruikte gewichten, latin-subset, woff2).
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Poppins',
      cssVariable: '--font-poppins',
      fallbacks: ['Arial', 'sans-serif'],
      display: 'swap',
      options: {
        variants: [
          { src: ['./src/assets/fonts/poppins-latin-400-normal.woff2'], weight: 400, style: 'normal' },
          { src: ['./src/assets/fonts/poppins-latin-600-normal.woff2'], weight: 600, style: 'normal' },
          { src: ['./src/assets/fonts/poppins-latin-700-normal.woff2'], weight: 700, style: 'normal' },
        ],
      },
    },
  ],
  image: {
    // Afbeeldingen worden bij de build geoptimaliseerd (AVIF/WebP via <Picture>).
    responsiveStyles: true,
  },
  devToolbar: { enabled: false },
});
