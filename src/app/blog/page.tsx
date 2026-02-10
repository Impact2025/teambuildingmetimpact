import type { Metadata } from "next";
import Link from "next/link";

import { getPublishedBlogs } from "@/lib/blogs";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Blog | Teambuilding met Impact",
  description: "Lees verhalen, inzichten en tips over betekenisvolle teambuilding en LEGO® Serious Play. Inspirerende cases en praktische adviezen voor sterke teams.",
  keywords: [
    "blog",
    "teambuilding",
    "LEGO Serious Play",
    "teamontwikkeling",
    "inzichten",
    "tips",
    "cases",
    "maatschappelijke impact"
  ],
  alternates: {
    canonical: "https://www.teambuildingmetimpact.nl/blog",
  },
  openGraph: {
    title: "Blog | Teambuilding met Impact",
    description: "Lees verhalen, inzichten en tips over betekenisvolle teambuilding en LEGO® Serious Play. Inspirerende cases en praktische adviezen voor sterke teams.",
    url: "https://www.teambuildingmetimpact.nl/blog",
    siteName: "Teambuilding met Impact",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Teambuilding met Impact",
    description: "Lees verhalen, inzichten en tips over betekenisvolle teambuilding en LEGO® Serious Play.",
  },
};

export default async function BlogIndexPage() {
  const { items } = await getPublishedBlogs();

  return (
    <main className="bg-neutral-50 py-16 text-neutral-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 sm:px-10">
        <header className="space-y-3 text-center sm:text-left">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog" },
            ]}
            className="justify-center sm:justify-start"
          />
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
                  className="group flex h-full flex-col justify-between rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:border-[#006D77]/40 hover:shadow-md overflow-hidden"
                >
                  {blog.coverImage ? (
                    <div className="relative h-56 w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <h2 className="absolute bottom-4 left-4 right-4 text-xl font-semibold text-white line-clamp-2">
                        {blog.title}
                      </h2>
                    </div>
                  ) : (
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-neutral-900">{blog.title}</h2>
                    </div>
                  )}
                  <div className="space-y-3 p-6 pt-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">
                      {new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium" }).format(blog.publishedAt ?? blog.createdAt)}
                    </p>
                    <p className="text-sm text-neutral-600 line-clamp-3">{excerpt}{excerpt.length >= 160 ? "..." : ""}</p>
                    <span className="mt-2 inline-flex items-center text-xs font-semibold uppercase tracking-[0.3em] text-[#006D77]">
                      Lees verder →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}