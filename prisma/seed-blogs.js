/**
 * Seed Teambuilding met Impact blog posts from markdown files.
 *
 * Source: D:/APPS/Teambuilding/artikelen/blog/*.md
 * Target: Prisma BlogPost model (status PUBLISHED, idempotent upsert by slug).
 *
 * Content is stored as RAW markdown and rendered by the custom parser in
 * src/app/blog/[slug]/page.tsx. That parser:
 *   - renders `# `/`## `/`### ` as headings and each non-empty line as a <p>
 *   - auto-adds target="_blank" to links and renders **bold**
 * Therefore we STRIP inline `{target="_blank"}` attributes and the leading
 * `# <title>` H1 (the page already renders the title as <h1>) and the trailing
 * author byline (the page attributes Vincent via schema.org).
 *
 * Usage:
 *   node prisma/seed-blogs.js          # upsert into DB (needs DATABASE_URL)
 *   node prisma/seed-blogs.js --dry    # parse + print, no DB write
 */

const fs = require("fs");
const path = require("path");

let prisma;
try {
  ({ PrismaClient } = require("@prisma/client"));
} catch (e) {
  console.error("⚠️  @prisma/client niet gevonden — voer eerst 'npm install' en 'npx prisma generate' uit.");
  process.exit(1);
}
prisma = new PrismaClient();

const BLOG_SOURCE_DIR =
  process.env.BLOG_SOURCE_DIR ||
  "D:/APPS/Teambuilding/artikelen/blog";
const DRY = process.argv.includes("--dry");

// --- small frontmatter parser (handles `key: value` and inline arrays) ---
function parseFrontmatter(fmBlock) {
  const out = {};
  for (const rawLine of fmBlock.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, "");
    }
    out[key] = value;
  }
  return out;
}

function toArray(v) {
  if (Array.isArray(v)) return v;
  if (!v) return [];
  return String(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// --- clean the markdown body for the custom renderer ---
function cleanBody(body) {
  const lines = body.split("\n");
  const cleaned = [];
  for (let line of lines) {
    const trimmed = line.trim();
    // drop the H1 title line (page renders <h1>{title}</h1> already)
    if (/^#\s+/.test(trimmed)) continue;
    // drop trailing author byline(s)
    if (/^Vincent van Munster,?\s*oprichter/i.test(trimmed)) continue;
    // Convert raw HTML anchors <a href="url" ...>text</a> -> [text](url)
    line = line.replace(
      /<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi,
      (_, url, text) => `[${text.trim()}](url)`
    );
    // strip any leftover HTML tags (defensive)
    line = line.replace(/<[^>]+>/g, "");
    // strip inline target="_blank" attributes (parser adds these itself)
    line = line.replace(/\{\s*target\s*=\s*["']_blank["']\s*\}/g, "");
    // also catch a stray unbalanced one
    line = line.replace(/\{\s*target\s*=\s*["']_blank["']?/g, "");
    cleaned.push(line);
  }
  // collapse 3+ blank lines
  let out = cleaned.join("\n").replace(/\n{3,}/g, "\n\n");
  return out.trim() + "\n";
}

async function seedBlogs() {
  if (!fs.existsSync(BLOG_SOURCE_DIR)) {
    console.error(`❌ Bronmap niet gevonden: ${BLOG_SOURCE_DIR}`);
    process.exit(1);
  }
  const files = fs
    .readdirSync(BLOG_SOURCE_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  if (files.length === 0) {
    console.error("❌ Geen markdown-bestanden gevonden in bronmap.");
    process.exit(1);
  }

  const posts = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_SOURCE_DIR, file), "utf8");
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!m) {
      console.warn(`⚠️  Geen frontmatter in ${file} — overgeslagen.`);
      continue;
    }
    const fm = parseFrontmatter(m[1]);
    const body = cleanBody(m[2]);

    const secondary = toArray(fm.secondary_keywords);
    const tags = secondary.join(", ");
    const dateStr = fm.date || fm.publishedAt;
    const publishedAt = dateStr ? new Date(dateStr + "T09:00:00Z") : new Date();

    posts.push({
      title: fm.title,
      slug: fm.slug,
      excerpt: fm.excerpt || "",
      content: body,
      focusKeyphrase: fm.primary_keyword || "",
      metaTitle: fm.meta_title || fm.title,
      metaDescription: fm.meta_description || "",
      tags,
      primaryKeyword: fm.primary_keyword || "",
      extraKeywords: tags,
      status: "PUBLISHED",
      publishedAt,
    });
  }

  if (DRY) {
    console.log(`\n[DRY RUN] ${posts.length} artikelen gevonden:\n`);
    for (const p of posts) {
      console.log(`• ${p.slug}`);
      console.log(`    title: ${p.title}`);
      console.log(`    pk: ${p.primaryKeyword}`);
      console.log(`    metaTitle: ${p.metaTitle}`);
      console.log(`    publishedAt: ${p.publishedAt.toISOString()}`);
      console.log(`    tags(${p.tags.split(",").length}): ${p.tags}`);
      console.log(`    content lines: ${p.content.split("\n").length}`);
    }
    await prisma.$disconnect();
    return;
  }

  let created = 0;
  let updated = 0;
  for (const p of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.blogPost.update({ where: { slug: p.slug }, data: p });
      updated++;
      console.log(`🔄 Bijgewerkt: ${p.slug}`);
    } else {
      await prisma.blogPost.create({ data: p });
      created++;
      console.log(`✅ Aangemaakt: ${p.slug}`);
    }
  }
  console.log(
    `\nKlaar: ${created} nieuw, ${updated} bijgewerkt van ${posts.length} artikelen.`
  );
  return { created, updated, total: posts.length };
}

async function run() {
  try {
    const result = await seedBlogs();
    return result;
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run directly (`node prisma/seed-blogs.js`), but not when required by seed.js
if (require.main === module) {
  run();
}

module.exports = { seedBlogs };
