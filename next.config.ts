import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statische export: `npm run build` schrijft de complete site naar de map `out/`
  output: "export",
  // /menu/ → out/menu/index.html; werkt op elke statische host
  trailingSlash: true,
  // Zonder server is er geen beeldoptimalisatie; afbeeldingen worden 1-op-1 geserveerd
  images: { unoptimized: true },
};

export default nextConfig;
