import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

const BASE_URL = "https://www.teambuildingmetimpact.nl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true, publishedAt: true },
  });

  const staticRoutes = [
    "",
    "/blog",
    "/login",
    "/viewer",
  ];

  const today = new Date();

  const routes: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: today,
  }));

  const dynamicRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: blog.updatedAt ?? blog.publishedAt ?? today,
  }));

  return [...routes, ...dynamicRoutes];
}
