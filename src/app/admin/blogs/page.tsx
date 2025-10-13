import Link from "next/link";
import { BlogStatus } from "@prisma/client";

import { getAdminBlogList } from "@/lib/blogs";

function StatusBadge({ status }: { status: BlogStatus }) {
  const styles =
    status === BlogStatus.PUBLISHED
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-neutral-100 text-neutral-600 border-neutral-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles}`}>
      {status === BlogStatus.PUBLISHED ? "Gepubliceerd" : "Concept"}
    </span>
  );
}

export default async function AdminBlogsPage() {
  const blogs = await getAdminBlogList();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Content</p>
          <h1 className="text-2xl font-semibold text-neutral-900">Blogs beheren</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Publiceer verhalen over betekenisvolle teambuilding en LEGO® Serious Play.
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center justify-center rounded-xl bg-[#006D77] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-accent-deep"
        >
          Nieuwe blog
        </Link>
      </div>

      <div className="space-y-4">
        {blogs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/70 p-10 text-center text-sm text-neutral-500">
            <p>Er zijn nog geen blogposts. Start met een AI-gegenereerd concept of schrijf er zelf één.</p>
          </div>
        ) : (
          blogs.map((blog) => {
            const updatedLabel = new Intl.DateTimeFormat("nl-NL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(blog.updatedAt ?? blog.createdAt);

            return (
              <Link
                key={blog.id}
                href={`/admin/blogs/${blog.id}`}
                className="flex flex-col gap-3 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-[#006D77]/40 hover:shadow-md lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-neutral-900">{blog.title}</h2>
                    <StatusBadge status={blog.status} />
                  </div>
                  <p className="text-sm text-neutral-600">Bewerkt op {updatedLabel}</p>
                  {blog.excerpt ? (
                    <p className="text-sm text-neutral-500">
                      {blog.excerpt.length > 180 ? `${blog.excerpt.slice(0, 177)}...` : blog.excerpt}
                    </p>
                  ) : null}
                </div>
                <div className="shrink-0 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
                  Bekijken
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
