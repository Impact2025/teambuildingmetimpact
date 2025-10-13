import { BlogStatus } from "@prisma/client";

import { BlogEditor } from "@/components/blogs/blog-editor";

const defaultState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  focusKeyphrase: "",
  metaTitle: "",
  metaDescription: "",
  tags: "",
  midjourneyPrompt: "Visualiseer een inspirerende LSP-teambuildingsessie met mensen die bouwen, samenwerken en betekenis creëren in een warme, natuurlijke setting.",
  sourceLink: "",
  toneOfVoice: "Warm, positief en deskundig",
  goal: "",
  primaryKeyword: "",
  extraKeywords: "",
  status: BlogStatus.DRAFT,
  updatedAt: null,
};

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Blogs</p>
        <h1 className="text-2xl font-semibold text-neutral-900">Nieuwe blog</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Gebruik de AI generator of schrijf handmatig om teams te inspireren.
        </p>
      </div>
      <BlogEditor initialState={defaultState} />
    </div>
  );
}
