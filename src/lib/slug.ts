export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ensureSlugBase(value: string, fallback: string) {
  const slug = slugify(value);
  return slug.length > 0 ? slug : slugify(fallback);
}
