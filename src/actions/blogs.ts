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
  coverImage: z.string().optional(), // Accept both URLs and local paths
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
  const result = blogSchema.safeParse(input);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new Error(`Validatiefout (${issue.path.join(".")}): ${issue.message}`);
  }
  const parsed = result.data;

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
  const result = blogSchema.safeParse(input);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new Error(`Validatiefout (${issue.path.join(".")}): ${issue.message}`);
  }
  const parsed = result.data;

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
H1 met het primair keyword (in sentence case - zie hieronder).
Intro (2–3 zinnen) over relevantie voor teams en organisaties.
H2 Wat is er gebeurd?
H2 Wat betekent dit voor teams en leiders? met 3–5 bulletpunten praktische tips of inzichten.
H2 Onze visie (Teambuilding met Impact) met uitleg hoe LSP-teambuilding inzichten naar actie en impact vertaalt.
H2 Wat kun jij vandaag doen? met concrete stappen of reflectievragen.
Slot met uitnodiging om samen impact te maken via teambuilding of een LSP-sessie.
Sluit af met "Bron: [LINK]" waarbij LINK optioneel kan zijn.

KRITIEKE RANDVOORWAARDEN VOOR ALLE TITELS (H1, H2, meta_title):
- VERPLICHT: Gebruik sentence case - alleen de EERSTE letter is een hoofdletter, de rest kleine letters
- Uitzondering: Eigennamen blijven zoals ze zijn (LEGO® Serious Play®, Teambuilding met Impact als bedrijfsnaam)
- Voorbeelden CORRECT:
  ✓ "Teambuilding met impact: zo creëer je betekenisvolle verandering"
  ✓ "Effectieve teambuilding met LEGO Serious Play"
  ✓ "Zo bouw je een sterk team met maatschappelijke impact"
- Voorbeelden FOUT (gebruik deze NOOIT):
  ✗ "Teambuilding Met Impact: Zo Creëer Je Betekenisvolle Verandering"
  ✗ "Effectieve Teambuilding Met LEGO Serious Play"
  ✗ "Zo Bouw Je Een Sterk Team"

Andere randvoorwaarden:
- Korte actieve zinnen (max 20 woorden)
- Warme positieve deskundige toon
- Geen emoji's
- Optimaliseer automatisch voor het primair keyword en extra keywords

Gegevens:
Primair keyword: ${parsed.primaryKeyword}
Extra keywords: ${parsed.extraKeywords ?? "-"}
Tone of voice: ${parsed.toneOfVoice}
Doelgroep: ${parsed.audience}

Geef eerst de complete blogtekst. Plaats daarna op een nieuwe regel het metadata-blok als \`\`\`json ...\`\`\` met velden:
- focus_keyphrase: de focus keyphrase voor SEO (in sentence case)
- meta_title: de meta title (VERPLICHT in sentence case - alleen eerste letter hoofdletter!)
- meta_description: de meta description (in sentence case)
- slug: de slug voor de URL (lowercase met hyphens)
- tags: komma-gescheiden tags
- midjourney_prompt: Een Midjourney prompt voor een visueel aantrekkelijke afbeelding die past bij het artikel (in het Engels, beschrijf een scene met mensen, LEGO elementen, teamwork, warme kleuren, professioneel)
- social_media_post: Een social media post voor LinkedIn/Facebook (2-3 zinnen + 3-5 relevante hashtags)

Het JSON blok moet geldig zijn.

NOGMAALS: Alle titels (inclusief meta_title) MOETEN in sentence case zijn!`;

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

const enrichRequestSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(50),
  primaryKeyword: z.string().optional(),
});

const STATIC_PAGES = [
  { url: "/", label: "Homepage – Teambuilding met Impact" },
  { url: "/over-ons", label: "Over ons – wie wij zijn" },
  { url: "/missie", label: "Onze missie – maatschappelijke impact" },
  { url: "/programmas", label: "Programma's – ons aanbod teambuilding" },
  { url: "/lsp", label: "LEGO® Serious Play viewer" },
  { url: "/blog", label: "Blog – alle artikelen" },
  { url: "/contact", label: "Contact – offerte aanvragen" },
];

export async function enrichBlogWithAIAction(input: z.input<typeof enrichRequestSchema>) {
  await requireAdmin();
  const parsed = enrichRequestSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Ongeldige invoer: zorg dat er voldoende content is.");
  }
  const { title, content, primaryKeyword } = parsed.data;

  const publishedBlogs = await prisma.blogPost.findMany({
    where: { status: BlogStatus.PUBLISHED },
    select: { title: true, slug: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  const internalLinksContext = [
    ...STATIC_PAGES.map((p) => `- https://www.teambuildingmetimpact.nl${p.url} (${p.label})`),
    ...publishedBlogs.map((b) => `- https://www.teambuildingmetimpact.nl/blog/${b.slug} (${b.title})`),
  ].join("\n");

  const prompt = `Je bent SEO-specialist en contentredacteur voor Teambuilding met Impact. Je taak is een bestaande blogpost te verrijken met wereldklasse SEO en interne links.

## Beschikbare interne links
${internalLinksContext}

## Blog content om te verrijken
Titel: ${title ?? "(geen)"}
Primair keyword (hint): ${primaryKeyword ?? "(bepaal zelf)"}

---
${content}
---

## Jouw taken

### 1. Voeg 2–4 interne links toe aan de content
- Kies alleen links die écht relevant zijn voor de context in de tekst
- Gebruik Markdown-linksyntax: [ankertekst](url)
- Verwerk de link natuurlijk in een bestaande zin — voeg geen extra zinnen toe
- Gebruik beschrijvende ankerteksten (geen "klik hier")
- Verspreid de links door de tekst

### 2. Genereer SEO-metadata (VERPLICHT in sentence case)
- focus_keyphrase: de belangrijkste zoekterm (2–4 woorden)
- meta_title: pakkende titel van max 60 tekens, eindigt op "| Teambuilding met Impact"
- meta_description: 140–160 tekens, activeert klikgedrag, bevat het keyword
- slug: url-vriendelijk, lowercase met koppeltekens
- primary_keyword: het primaire keyword
- extra_keywords: 4–6 aanvullende keywords, komma-gescheiden
- tags: 3–5 tags, komma-gescheiden
- midjourney_prompt: Engelse Midjourney prompt voor een passende afbeelding (mensen, teamwork, warme kleuren, professioneel)
- social_media_post: LinkedIn/Facebook post van 2–3 zinnen + 3–5 hashtags

### Randvoorwaarden
- Sentence case voor alle titels (alleen eerste letter hoofdletter, behalve eigennamen)
- Schrijf niets aan de blogtekst zelf bij behalve de interne links

## Uitvoerformaat
Geef eerst de VOLLEDIGE verrijkte blogtekst (met interne links). Daarna op een nieuwe regel het metadata-blok als \`\`\`json ...\`\`\`:

\`\`\`json
{
  "focus_keyphrase": "...",
  "meta_title": "...",
  "meta_description": "...",
  "slug": "...",
  "primary_keyword": "...",
  "extra_keywords": "...",
  "tags": "...",
  "midjourney_prompt": "...",
  "social_media_post": "..."
}
\`\`\``;

  try {
    const output = await generateWithOpenRouter(prompt);

    if (!output) {
      throw new Error("OpenRouter leverde geen resultaat");
    }

    // Try multiple extraction strategies for the JSON block
    const fencedJsonMatch = output.match(/```json\s*([\s\S]*?)```/i);
    const fencedAnyMatch = output.match(/```\s*(\{[\s\S]*?\})\s*```/i);
    const lastBraceMatch = (() => {
      const start = output.lastIndexOf("{");
      const end = output.lastIndexOf("}");
      if (start !== -1 && end > start) return output.slice(start, end + 1);
      return null;
    })();

    const metadataString = (
      fencedJsonMatch?.[1] ??
      fencedAnyMatch?.[1] ??
      lastBraceMatch ??
      ""
    ).trim();

    if (!metadataString) {
      console.error("[AI] enrichBlog: no JSON found in output:", output.slice(0, 500));
      throw new Error("AI-resultaat bevat geen metadata JSON");
    }

    let metadata: unknown;
    try {
      metadata = JSON.parse(metadataString);
    } catch {
      console.error("[AI] enrichBlog: JSON parse failed:", metadataString.slice(0, 200));
      throw new Error("AI metadata kon niet worden geparsed");
    }

    const metaSchema = z.object({
      focus_keyphrase: z.string().min(1),
      meta_title: z.string().min(1),
      meta_description: z.string().min(1),
      slug: z.string().min(1),
      primary_keyword: z.string().min(1),
      extra_keywords: z.string().optional(),
      tags: z.string().optional(),
      midjourney_prompt: z.string().optional(),
      social_media_post: z.string().optional(),
    });

    const parsedMeta = metaSchema.safeParse(metadata);
    if (!parsedMeta.success) {
      console.error("[AI] enrichBlog: schema validation failed:", parsedMeta.error.issues);
      throw new Error("AI metadata mist verplichte velden");
    }

    const jsonBlockStart = fencedJsonMatch
      ? output.indexOf(fencedJsonMatch[0])
      : fencedAnyMatch
      ? output.indexOf(fencedAnyMatch[0])
      : lastBraceMatch
      ? output.lastIndexOf(lastBraceMatch)
      : output.length;

    const enrichedContent = output.slice(0, jsonBlockStart).trim();

    return {
      content: enrichedContent,
      metadata: {
        focusKeyphrase: parsedMeta.data.focus_keyphrase,
        metaTitle: parsedMeta.data.meta_title,
        metaDescription: parsedMeta.data.meta_description,
        slug: slugify(parsedMeta.data.slug),
        primaryKeyword: parsedMeta.data.primary_keyword,
        extraKeywords: parsedMeta.data.extra_keywords ?? "",
        tags: parsedMeta.data.tags ?? "",
        midjourneyPrompt: parsedMeta.data.midjourney_prompt,
        socialMediaPost: parsedMeta.data.social_media_post,
      },
    };
  } catch (error) {
    console.error("[AI] enrichBlogWithAIAction failed", error);
    if (error instanceof Error) {
      throw new Error(`SEO-verrijking mislukt: ${error.message}`);
    }
    throw new Error("SEO-verrijking mislukt");
  }
}
