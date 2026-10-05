import type { MetadataRoute } from "next";
import { navItems, siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return navItems.map((item) => ({
    url: `${siteConfig.url}${item.href}`,
    changeFrequency: item.href === "/menu/" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));
}
