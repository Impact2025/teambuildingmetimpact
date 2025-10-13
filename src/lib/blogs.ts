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
