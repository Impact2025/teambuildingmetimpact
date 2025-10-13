import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { getPublishedBlogBySlug } from "@/lib/blogs";

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

  const contentElements = renderBlogContent(blog.content);
  const tags = blog.tags
    ? blog.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="bg-neutral-50 py-16 text-neutral-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 sm:px-10">
        <div className="space-y-4">
          <Link href="/blog" className="text-xs font-semibold uppercase tracking-[0.3em] text-[#006D77]">
            ← Terug naar overzicht
          </Link>
          <h1 className="text-4xl font-semibold text-neutral-900">{blog.title}</h1>
          <p className="text-sm text-neutral-500">
            {new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium" }).format(blog.publishedAt ?? blog.createdAt)}
          </p>
          {blog.coverImage ? (
            <div className="overflow-hidden rounded-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-64 w-full object-cover object-center"
              />
            </div>
          ) : null}
        </div>

        <article className="space-y-6">
          {contentElements}
        </article>

        <footer className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">Focus keyword</p>
            <p className="text-base font-medium text-neutral-800">{blog.focusKeyphrase}</p>
          </div>
          {tags.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">Tags</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-[#006D77]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {blog.midjourneyPrompt ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">Midjourney prompt</p>
              <p className="text-sm text-neutral-600">{blog.midjourneyPrompt}</p>
            </div>
          ) : null}
        </footer>
      </div>
    </main>
  );
}
