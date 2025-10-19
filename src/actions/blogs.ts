"use server";

import { revalidatePath } from "next/cache";
import { BlogStatus } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { generateWithOpenRouter } from "@/lib/gemini";
import { ensureSlugBase, slugify } from "@/lib/slug";

import { requireAdmin } from "./helpers";

const blogSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().url().optional(),
  focusKeyphrase: z.string().min(3),
  metaTitle: z.string().min(3),
  metaDescription: z.string().min(10),
  tags: z.string().optional(),
  midjourneyPrompt: z.string().optional(),
  sourceLink: z.string().url().optional(),
  toneOfVoice: z.string().optional(),
  goal: z.string().optional(),
  primaryKeyword: z.string().min(3),
  extraKeywords: z.string().optional(),
  status: z.nativeEnum(BlogStatus).default(BlogStatus.DRAFT),
  publishedAt: z.string().nullable().optional(),
});

const aiRequestSchema = z.object({
  primaryKeyword: z.string().min(3),
  extraKeywords: z.string().optional(),
  toneOfVoice: z.string().min(3),
  audience: z.string().min(3),
});

async function ensureUniqueSlug(base: string, ignoreId?: string) {
  let root = ensureSlugBase(base, base);
  if (!root) {
    root = "blog";
  }

  let candidate = root;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === ignoreId) {
      return candidate;
    }

    candidate = `${root}-${counter}`;
    counter += 1;
  }
}

function revalidateBlogPaths(slug?: string) {
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  revalidatePath("/");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

export async function createBlogAction(input: z.input<typeof blogSchema>) {
  const admin = await requireAdmin();
  const parsed = blogSchema.parse(input);

  const slugBase = parsed.slug ?? ensureSlugBase(parsed.title, parsed.primaryKeyword);
  const slug = await ensureUniqueSlug(slugBase);

  const created = await prisma.blogPost.create({
    data: {
      title: parsed.title,
      slug,
      excerpt: parsed.excerpt ?? null,
      content: parsed.content ?? "",
      coverImage: parsed.coverImage ?? null,
      focusKeyphrase: parsed.focusKeyphrase,
      metaTitle: parsed.metaTitle,
      metaDescription: parsed.metaDescription,
      tags: parsed.tags ?? null,
      midjourneyPrompt: parsed.midjourneyPrompt ?? null,
      sourceLink: parsed.sourceLink ?? null,
      toneOfVoice: parsed.toneOfVoice ?? null,
      goal: parsed.goal ?? null,
      primaryKeyword: parsed.primaryKeyword,
      extraKeywords: parsed.extraKeywords ?? null,
      status: parsed.status,
      publishedAt: parsed.publishedAt ? new Date(parsed.publishedAt) : (parsed.status === BlogStatus.PUBLISHED ? new Date() : null),
      authorId: admin.id,
    },
  });

  revalidateBlogPaths(created.slug);
  return created;
}

export async function updateBlogAction(id: string, input: z.input<typeof blogSchema>) {
  await requireAdmin();
  const parsed = blogSchema.parse(input);

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Blog niet gevonden");
  }

  const slugBase = parsed.slug ?? existing.slug ?? ensureSlugBase(parsed.title, parsed.primaryKeyword);
  const slug = await ensureUniqueSlug(slugBase, id);

  const shouldPublish = parsed.status === BlogStatus.PUBLISHED;

  const updated = await prisma.blogPost.update({
    where: { id },
    data: {
      title: parsed.title,
      slug,
      excerpt: parsed.excerpt ?? null,
      content: parsed.content ?? "",
      coverImage: parsed.coverImage ?? null,
      focusKeyphrase: parsed.focusKeyphrase,
      metaTitle: parsed.metaTitle,
      metaDescription: parsed.metaDescription,
      tags: parsed.tags ?? null,
      midjourneyPrompt: parsed.midjourneyPrompt ?? null,
      sourceLink: parsed.sourceLink ?? null,
      toneOfVoice: parsed.toneOfVoice ?? null,
      goal: parsed.goal ?? null,
      primaryKeyword: parsed.primaryKeyword,
      extraKeywords: parsed.extraKeywords ?? null,
      status: parsed.status,
      publishedAt: parsed.publishedAt
        ? new Date(parsed.publishedAt)
        : (shouldPublish ? existing.publishedAt ?? new Date() : null),
    },
  });

  revalidateBlogPaths(updated.slug);
  return updated;
}

export async function deleteBlogAction(id: string) {
  await requireAdmin();

  const deleted = await prisma.blogPost.delete({ where: { id } });
  revalidateBlogPaths(deleted.slug);
  return { success: true };
}

export async function generateBlogWithAIAction(input: z.input<typeof aiRequestSchema>) {
  await requireAdmin();
  const parsed = aiRequestSchema.parse(input);

  try {
    const prompt = `Je bent hoofdredacteur van Teambuilding met Impact, een organisatie die bedrijven helpt om met betekenisvolle teambuilding meer verbinding, motivatie en maatschappelijke impact te creëren. Wij faciliteren LEGO® Serious Play® (LSP) sessies waarin teams via bouwen en verhalen inzichten krijgen, beter samenwerken en duurzame verandering realiseren.

Schrijf in het Nederlands een volledige, SEO-vriendelijke blogpost volgens deze structuur:
H1 met het primair keyword.
Intro (2–3 zinnen) over relevantie voor teams en organisaties.
H2 Wat is er gebeurd?
H2 Wat betekent dit voor teams en leiders? met 3–5 bulletpunten praktische tips of inzichten.
H2 Onze visie (Teambuilding met Impact) met uitleg hoe LSP-teambuilding inzichten naar actie en impact vertaalt.
H2 Wat kun jij vandaag doen? met concrete stappen of reflectievragen.
Slot met uitnodiging om samen impact te maken via teambuilding of een LSP-sessie.
Sluit af met "Bron: [LINK]" waarbij LINK optioneel kan zijn.

Randvoorwaarden:
- Korte actieve zinnen (max 20 woorden)
- Warme positieve deskundige toon
- Geen emoji's
- BELANGRIJK: Gebruik ALLEEN kleine letters in titels, behalve voor eigennamen (bijv. "LEGO® Serious Play®", "Teambuilding met Impact"). Dus NIET "Teambuilding Met Impact: Zo Creëer Je Betekenisvolle Verandering" maar "Teambuilding met impact: zo creëer je betekenisvolle verandering"
- Optimaliseer automatisch voor het primair keyword en extra keywords

Gegevens:
Primair keyword: ${parsed.primaryKeyword}
Extra keywords: ${parsed.extraKeywords ?? "-"}
Tone of voice: ${parsed.toneOfVoice}
Doelgroep: ${parsed.audience}

Geef eerst de complete blogtekst. Plaats daarna op een nieuwe regel het metadata-blok als \`\`\`json ...\`\`\` met velden:
- focus_keyphrase: de focus keyphrase voor SEO
- meta_title: de meta title
- meta_description: de meta description
- slug: de slug voor de URL
- tags: komma-gescheiden tags
- midjourney_prompt: Een Midjourney prompt voor een visueel aantrekkelijke afbeelding die past bij het artikel (in het Engels, beschrijf een scene met mensen, LEGO elementen, teamwork, warme kleuren, professioneel)
- social_media_post: Een social media post voor LinkedIn/Facebook (2-3 zinnen + 3-5 relevante hashtags)

Het JSON blok moet geldig zijn.`;

    const output = await generateWithOpenRouter(prompt);

    if (!output) {
      throw new Error("OpenRouter leverde geen resultaat");
    }

    const fencedMatch = output.match(/```json([\s\S]*?)```/i);
    const rawMatch = output.match(/\{[^{}]*"focus_keyphrase"[\s\S]*\}/i);

    const metadataString = (fencedMatch?.[1] ?? rawMatch?.[0] ?? "").trim();
    if (!metadataString) {
      throw new Error("AI-resultaat bevat geen metadata JSON");
    }

    let metadata: unknown;
    try {
      metadata = JSON.parse(metadataString);
    } catch (error) {
      throw new Error("AI metadata kon niet worden geparsed");
    }

    const article = fencedMatch
      ? output.replace(fencedMatch[0], "").trim()
      : output.replace(metadataString, "").trim();

    const metadataSchema = z.object({
      focus_keyphrase: z.string().min(1),
      meta_title: z.string().min(1),
      meta_description: z.string().min(1),
      slug: z.string().min(1),
      tags: z.string().optional(),
      midjourney_prompt: z.string().optional(),
      social_media_post: z.string().optional(),
    });

    const parsedMetadata = metadataSchema.parse(metadata);

    let resolvedSlug = slugify(parsedMetadata.slug || parsed.primaryKeyword);
    if (!resolvedSlug) {
      resolvedSlug = `blog-${Date.now()}`;
    }

    return {
      content: article,
      metadata: {
        focusKeyphrase: parsedMetadata.focus_keyphrase,
        metaTitle: parsedMetadata.meta_title,
        metaDescription: parsedMetadata.meta_description,
        slug: resolvedSlug,
        tags: parsedMetadata.tags,
        midjourneyPrompt: parsedMetadata.midjourney_prompt,
        socialMediaPost: parsedMetadata.social_media_post,
        sourceLink: null,
        extraKeywords: parsed.extraKeywords,
      },
    };
  } catch (error) {
    console.error("[AI] generateBlogWithAIAction failed", error);
    if (error instanceof Error) {
      throw new Error(`AI-generatie mislukt: ${error.message}`);
    }
    throw new Error("AI-generatie mislukt");
  }
}
