import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { getPublishedBlogBySlug, getPopularBlogs, getAllTags } from "@/lib/blogs";

type PageProps = {
  params: { slug: string };
};

function renderBlogContent(content: string): ReactNode[] {
  const lines = content.split(/\n+/);
  const elements: ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-2 pl-6 text-neutral-700">
          {listBuffer.map((item, index) => (
            <li key={index} className="list-disc">
              {item}
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed.startsWith("- ")) {
      listBuffer.push(trimmed.slice(2).trim());
      return;
    }

    flushList();

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={elements.length} className="text-xl font-semibold text-neutral-900">
          {trimmed.slice(4).trim()}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={elements.length} className="text-2xl font-semibold text-neutral-900">
          {trimmed.slice(3).trim()}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={elements.length} className="text-3xl font-semibold text-neutral-900">
          {trimmed.slice(2).trim()}
        </h1>
      );
      return;
    }

    if (trimmed.toLowerCase().startsWith("bron:")) {
      const match = trimmed.match(/\[([^\]]*)\]/);
      const link = match?.[1]?.trim();
      elements.push(
        <p key={elements.length} className="text-sm text-neutral-600">
          Bron: {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#006D77] underline">
              {link}
            </a>
          ) : (
            "-"
          )}
        </p>
      );
      return;
    }

    elements.push(
      <p key={elements.length} className="text-base leading-relaxed text-neutral-700">
        {trimmed}
      </p>
    );
  });

  flushList();
  return elements;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const blog = await getPublishedBlogBySlug(params.slug);

  if (!blog) {
    return {
      title: "Blog niet gevonden",
    };
  }

  const keywords = [blog.primaryKeyword];
  if (blog.extraKeywords) keywords.push(blog.extraKeywords);
  if (blog.tags) keywords.push(blog.tags);

  return {
    title: blog.metaTitle,
    description: blog.metaDescription,
    keywords,
    alternates: {
      canonical: `/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.metaTitle,
      description: blog.metaDescription,
      type: "article",
      url: `https://www.teambuildingmetimpact.nl/blog/${blog.slug}`,
      images: blog.coverImage
        ? [
            {
              url: blog.coverImage,
              alt: blog.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.metaTitle,
      description: blog.metaDescription,
      images: blog.coverImage ? [blog.coverImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const blog = await getPublishedBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  const [popularBlogs, allTags] = await Promise.all([
    getPopularBlogs(5, params.slug),
    getAllTags(),
  ]);

  const contentElements = renderBlogContent(blog.content);
  const tags = blog.tags
    ? blog.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  // BlogPosting Schema for SEO
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.metaDescription,
    image: blog.coverImage || "https://www.teambuildingmetimpact.nl/images/hero-collaboration.png",
    datePublished: (blog.publishedAt ?? blog.createdAt).toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: "Vincent van Munster",
      url: "https://www.teambuildingmetimpact.nl/over-ons",
    },
    publisher: {
      "@type": "Organization",
      name: "Teambuilding met Impact",
      logo: {
        "@type": "ImageObject",
        url: "https://www.teambuildingmetimpact.nl/images/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.teambuildingmetimpact.nl/blog/${blog.slug}`,
    },
    keywords: [blog.primaryKeyword, blog.extraKeywords, blog.tags].filter(Boolean).join(", "),
  };

  return (
    <main className="bg-neutral-50 py-16 text-neutral-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="mb-8">
          <Link href="/blog" className="text-xs font-semibold uppercase tracking-[0.3em] text-[#006D77]">
            ← Terug naar overzicht
          </Link>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main content */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold text-neutral-900">{blog.title}</h1>
              <p className="text-sm text-neutral-500">
                {new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium" }).format(blog.publishedAt ?? blog.createdAt)}
              </p>
            </div>

            {blog.coverImage ? (
              <div className="overflow-hidden rounded-3xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="h-96 w-full object-cover object-center"
                />
              </div>
            ) : null}

            <article className="space-y-6">
              {contentElements}
            </article>

            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 border-t border-neutral-200 pt-6">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-[#006D77]">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="w-full space-y-8 lg:w-80">
            {/* Meest gelezen blogs */}
            {popularBlogs.length > 0 ? (
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-neutral-900">Meest gelezen</h3>
                <div className="space-y-4">
                  {popularBlogs.map((popularBlog) => (
                    <Link
                      key={popularBlog.id}
                      href={`/blog/${popularBlog.slug}`}
                      className="group block space-y-1"
                    >
                      <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-[#006D77]">
                        {popularBlog.title}
                      </h4>
                      {popularBlog.excerpt ? (
                        <p className="line-clamp-2 text-xs text-neutral-600">{popularBlog.excerpt}</p>
                      ) : null}
                      <p className="text-xs text-neutral-400">
                        {new Intl.DateTimeFormat("nl-NL", { dateStyle: "short" }).format(
                          popularBlog.publishedAt ?? new Date()
                        )}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Tag cloud */}
            {allTags.length > 0 ? (
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-neutral-900">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 20).map(({ tag, count }) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-accent-soft hover:text-[#006D77]"
                      title={`${count} artikel${count !== 1 ? "en" : ""}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
