import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

const BASE_URL = "https://www.teambuildingmetimpact.nl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true, publishedAt: true },
  });

  const today = new Date();

  // Static pages with priority and change frequency
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/over-ons`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/missie`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/programmas`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/lsp`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/viewer`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Blog posts
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: blog.updatedAt ?? blog.publishedAt ?? today,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
