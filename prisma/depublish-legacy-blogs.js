/**
 * One-off: de-publish the 6 legacy IctusGo blog slugs so they drop out of the
 * sitemap and the /blog index. Each has a permanent 301 redirect (in
 * next.config.mjs) to a fresh Teambuilding met Impact post, so link equity is
 * preserved and old URLs never 404.
 *
 * Note: BlogStatus only allows DRAFT | PUBLISHED (no ARCHIVED), so we use DRAFT.
 *
 * Run: node prisma/depublish-legacy-blogs.js
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const LEGACY_SLUGS = [
  "teambuilding-met-impact-betekenisvolle-verandering",
  "teambuilding-buiten-kantoor-die-je-kunt-meten-maak-kennis-met-ictusgo",
  "teambuilding-met-maatschappelijke-impact-zo-maak-je-het-aantoonbaar-voor-je-directie",
  "gps-teambuilding-haarlemmermeer-ontdek-de-polder-en-maak-echt-impact",
  "teambuilding-haarlemmermeer-meer-dan-een-uitje-in-de-polder",
  "effectieve-teambuilding-lego-serious-play",
];

(async () => {
  let count = 0;
  for (const slug of LEGACY_SLUGS) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) {
      console.log(`⚠️  Niet gevonden (al weg?): ${slug}`);
      continue;
    }
    await prisma.blogPost.update({
      where: { slug },
      data: { status: "DRAFT" },
    });
    console.log(
      `🔒 Naar DRAFT: ${slug} (was ${existing.status}) -> 301 naar nieuwe post`
    );
    count++;
  }
  console.log(`\nKlaar: ${count} legacy post(s) gearchiveerd.`);
})()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
