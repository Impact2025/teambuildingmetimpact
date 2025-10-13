import type { MetadataRoute } from "next";

const BASE_URL = "https://www.teambuildingmetimpact.nl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
