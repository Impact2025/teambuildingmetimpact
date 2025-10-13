import { notFound } from "next/navigation";
import { BlogStatus } from "@prisma/client";

import { BlogEditor } from "@/components/blogs/blog-editor";
import { getBlogById } from "@/lib/blogs";

type PageProps = {
  params: { id: string };
};

export default async function EditBlogPage({ params }: PageProps) {
  const blog = await getBlogById(params.id);

  if (!blog) {
    notFound();
  }

  const initialState = {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt ?? "",
    content: blog.content,
    coverImage: blog.coverImage ?? "",
    focusKeyphrase: blog.focusKeyphrase,
    metaTitle: blog.metaTitle,
    metaDescription: blog.metaDescription,
    tags: blog.tags ?? "",
    midjourneyPrompt: blog.midjourneyPrompt ?? "",
    sourceLink: blog.sourceLink ?? "",
    toneOfVoice: blog.toneOfVoice ?? "Warm, positief en deskundig",
    goal: blog.goal ?? "",
    primaryKeyword: blog.primaryKeyword,
    extraKeywords: blog.extraKeywords ?? "",
    status: blog.status,
    updatedAt: blog.updatedAt.toISOString(),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Blogs</p>
        <h1 className="text-2xl font-semibold text-neutral-900">{blog.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
          <span>{blog.status === BlogStatus.PUBLISHED ? "Gepubliceerd" : "Concept"}</span>
          {blog.publishedAt ? (
            <span>• sinds {new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium" }).format(blog.publishedAt)}</span>
          ) : null}
        </div>
      </div>
      <BlogEditor initialState={initialState} />
    </div>
  );
}
