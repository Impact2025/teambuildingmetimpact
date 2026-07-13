import { NextRequest, NextResponse } from "next/server";
import { BlogStatus } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

/**
 * Public blog-publish endpoint voor Agent OS.
 *
 * Spiegelt dezelfde contract als bijeen.app/api/blog zodat Agent OS het
 * Teambuilding-project precies zo kan pushen als Bijeen:
 *   POST /api/blog
 *   Authorization: Bearer <TEAMBUILDING_API_KEY>
 *   body: { title, content, excerpt, metaTitle, metaDescription, tags, status }
 *   -> 201 { post: { slug } }
 *
 * Auth loopt via een aparte Bearer-key (TEAMBUILDING_API_KEY), NIET via de
 * NextAuth-admin-session — anders kan Agent OS de POST niet doen. De bestaande
 * admin-server-action (createBlogAction) blijft onaangetast.
 */

const publishSchema = z.object({
  title: z.string().min(3),
  content: z.string().default(""),
  excerpt: z.string().optional(),
  metaTitle: z.string().min(3),
  metaDescription: z.string().min(10),
  tags: z.array(z.string()).optional().default([]),
  status: z.string().optional().default("published"),
  // optioneel: Agent OS stuurt soms een slug/focusKeyphrase/primaryKeyword mee
  slug: z.string().optional(),
  focusKeyphrase: z.string().optional(),
  primaryKeyword: z.string().optional(),
  extraKeywords: z.string().optional(),
});

async function ensureUniqueSlug(base: string): Promise<string> {
  let root = slugify(base) || "blog";
  let candidate = root;
  let counter = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
    candidate = `${root}-${counter}`;
    counter += 1;
  }
}

export async function POST(req: NextRequest) {
  try {
    const expected = process.env.TEAMBUILDING_API_KEY;
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

    if (!expected || token !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const raw = await req.json();
    const parsed = publishSchema.safeParse(raw);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: `Validatiefout (${issue.path.join(".")}): ${issue.message}` },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const slug = await ensureUniqueSlug(data.slug || data.title);
    const shouldPublish = data.status.toLowerCase() === "published";

    const created = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt ?? null,
        content: data.content,
        focusKeyphrase: data.focusKeyphrase || data.primaryKeyword || data.title,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        tags: data.tags.length ? data.tags.join(", ") : null,
        primaryKeyword: data.primaryKeyword || data.focusKeyphrase || data.title,
        extraKeywords: data.extraKeywords ?? null,
        status: shouldPublish ? BlogStatus.PUBLISHED : BlogStatus.DRAFT,
        publishedAt: shouldPublish ? new Date() : null,
      },
    });

    return NextResponse.json({ post: { slug: created.slug } }, { status: 201 });
  } catch (error) {
    console.error("[api/blog] publicatie mislukt:", error);
    return NextResponse.json(
      { error: "Publicatie mislukt" },
      { status: 500 },
    );
  }
}
