import { BlogStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getAdminBlogList() {
  return prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getBlogById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export async function getPublishedBlogBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: {
      slug,
      status: BlogStatus.PUBLISHED,
    },
  });
}

export async function getPublishedBlogs(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: BlogStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.blogPost.count({ where: { status: BlogStatus.PUBLISHED } }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
  };
}

export async function getLatestBlogs(limit = 3) {
  try {
    return await prisma.blogPost.findMany({
      where: { status: BlogStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  } catch (error) {
    console.error("Kon laatste blogs niet ophalen", error);
    return [];
  }
}

export async function getPopularBlogs(limit = 5, excludeSlug?: string) {
  try {
    return await prisma.blogPost.findMany({
      where: {
        status: BlogStatus.PUBLISHED,
        ...(excludeSlug ? { slug: { not: excludeSlug } } : {}),
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
      },
    });
  } catch (error) {
    console.error("Kon populaire blogs niet ophalen", error);
    return [];
  }
}

export async function getAllTags() {
  try {
    const blogs = await prisma.blogPost.findMany({
      where: {
        status: BlogStatus.PUBLISHED,
        tags: { not: null },
      },
      select: { tags: true },
    });

    const tagCounts = new Map<string, number>();
    blogs.forEach((blog) => {
      if (blog.tags) {
        const tags = blog.tags.split(",").map((t) => t.trim()).filter(Boolean);
        tags.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
        });
      }
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Kon tags niet ophalen", error);
    return [];
  }
}
