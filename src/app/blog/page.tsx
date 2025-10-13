import type { Metadata } from "next";
import Link from "next/link";

import { getPublishedBlogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blog | Teambuilding met Impact",
  description: "Lees verhalen, inzichten en tips over betekenisvolle teambuilding en LEGO® Serious Play.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Teambuilding met Impact",
    description: "Laat je inspireren door cases, inzichten en tips om teams te verbinden met LEGO® Serious Play.",
    url: "https://www.teambuildingmetimpact.nl/blog",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const { items } = await getPublishedBlogs();

  return (
    <main className="bg-neutral-50 py-16 text-neutral-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 sm:px-10">
        <header className="space-y-3 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">
            Blog
          </p>
          <h1 className="text-4xl font-semibold">Betekenisvolle teambuilding verhalen</h1>
          <p className="text-sm text-neutral-600 sm:max-w-2xl">
            Laat je inspireren door cases, inzichten en tips om teams te verbinden met LEGO® Serious Play en impactvolle teambuilding.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/70 p-12 text-center text-sm text-neutral-500">
            <p>Er zijn nog geen blogartikelen gepubliceerd. Kom snel terug voor nieuwe inspiratie.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((blog) => {
              const excerpt = blog.excerpt ?? blog.content.replace(/#+\s?/g, "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim().slice(0, 160);
              return (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="flex h-full flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-[#006D77]/40 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">
                      {new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium" }).format(blog.publishedAt ?? blog.createdAt)}
                    </p>
                    <h2 className="text-xl font-semibold text-neutral-900">{blog.title}</h2>
                    <p className="text-sm text-neutral-600">{excerpt}{excerpt.length >= 160 ? "..." : ""}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-[0.3em] text-[#006D77]">
                    Lees verder →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
