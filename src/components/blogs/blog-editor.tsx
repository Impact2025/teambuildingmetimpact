"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  createBlogAction,
  deleteBlogAction,
  generateBlogWithAIAction,
  updateBlogAction,
} from "@/actions/blogs";
import { slugify } from "@/lib/slug";

type BlogStatusValue = "DRAFT" | "PUBLISHED";

type BlogEditorState = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  focusKeyphrase: string;
  metaTitle: string;
  metaDescription: string;
  tags: string;
  midjourneyPrompt: string;
  sourceLink: string;
  toneOfVoice: string;
  goal: string;
  primaryKeyword: string;
  extraKeywords: string;
  status: BlogStatusValue;
  updatedAt?: string | null;
};

type AiGeneratorState = {
  primaryKeyword: string;
  extraKeywords: string;
  toneOfVoice: string;
  audience: string;
};

type Feedback = {
  type: "success" | "error";
  message: string;
};

const STATUS_OPTIONS: { label: string; value: BlogStatusValue }[] = [
  { label: "Concept", value: "DRAFT" },
  { label: "Gepubliceerd", value: "PUBLISHED" },
];

const DEFAULT_TONE = "Warm, positief en deskundig";

function normalizeOptional(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function BlogEditor({ initialState }: { initialState: BlogEditorState }) {
  const router = useRouter();
  const [form, setForm] = useState<BlogEditorState>(initialState);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialState.slug));
  const [aiState, setAiState] = useState<AiGeneratorState>({
    primaryKeyword: initialState.primaryKeyword ?? "",
    extraKeywords: initialState.extraKeywords ?? "",
    toneOfVoice: initialState.toneOfVoice ?? DEFAULT_TONE,
    audience:
      "HR-professionals, leidinggevenden en organisaties die werken aan teamontwikkeling, cultuur en maatschappelijke betrokkenheid",
  });
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [aiFeedback, setAiFeedback] = useState<Feedback | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isGenerating, startGenerating] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  const mode: "create" | "edit" = form.id ? "edit" : "create";

  const publishLabel = form.status === "PUBLISHED" ? "Herpubliceren" : "Publiceren";

  const handleTitleChange = useCallback(
    (value: string) => {
      setForm((prev) => {
        const nextSlug = slugTouched ? prev.slug : slugify(value);
        return { ...prev, title: value, slug: nextSlug };
      });
    },
    [slugTouched]
  );

  const handleSlugBlur = useCallback(() => {
    setForm((prev) => ({ ...prev, slug: slugify(prev.slug || prev.title) }));
  }, []);

  const handleSubmit = useCallback(
    (statusOverride?: BlogStatusValue) => {
      startSaving(async () => {
        setFeedback(null);
        const payload = {
          title: form.title.trim(),
          slug: slugify(form.slug || form.title),
          excerpt: normalizeOptional(form.excerpt),
          content: form.content,
          coverImage: normalizeOptional(form.coverImage),
          focusKeyphrase: form.focusKeyphrase.trim(),
          metaTitle: form.metaTitle.trim(),
          metaDescription: form.metaDescription.trim(),
          tags: normalizeOptional(form.tags),
          midjourneyPrompt: normalizeOptional(form.midjourneyPrompt),
          sourceLink: normalizeOptional(form.sourceLink),
          toneOfVoice: normalizeOptional(form.toneOfVoice),
          goal: normalizeOptional(form.goal),
          primaryKeyword: form.primaryKeyword.trim(),
          extraKeywords: normalizeOptional(form.extraKeywords),
          status: statusOverride ?? form.status,
        } as const;

        try {
          if (mode === "create") {
            const created = await createBlogAction(payload);
            setFeedback({ type: "success", message: "Blog opgeslagen. Je kunt nu verder bewerken." });
            router.replace(`/admin/blogs/${created.id}`);
          } else if (form.id) {
            await updateBlogAction(form.id, payload);
            setForm((prev) => ({ ...prev, status: payload.status, updatedAt: new Date().toISOString() }));
            setFeedback({ type: "success", message: "Wijzigingen opgeslagen." });
            if (payload.status === "PUBLISHED") {
              router.refresh();
            }
          }
        } catch (error) {
          setFeedback({ type: "error", message: error instanceof Error ? error.message : "Opslaan mislukt" });
        }
      });
    },
    [form, mode, router]
  );

  const handleGenerate = useCallback(() => {
    startGenerating(async () => {
      setAiFeedback(null);
      try {
        if (!aiState.primaryKeyword.trim() && !form.primaryKeyword.trim()) {
          setAiFeedback({ type: "error", message: "Vul eerst het primair keyword in." });
          return;
        }

        const result = await generateBlogWithAIAction({
          primaryKeyword: aiState.primaryKeyword.trim() || form.primaryKeyword.trim(),
          extraKeywords: normalizeOptional(aiState.extraKeywords),
          toneOfVoice: aiState.toneOfVoice.trim() || DEFAULT_TONE,
          audience: aiState.audience,
        });

        const plainExcerpt = result.content
          .replace(/#+\s?/g, "")
          .replace(/\*\*/g, "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 220);

        setForm((prev) => ({
          ...prev,
          title: result.metadata.metaTitle,
          slug: result.metadata.slug,
          excerpt: plainExcerpt,
          content: result.content,
          focusKeyphrase: result.metadata.focusKeyphrase,
          metaTitle: result.metadata.metaTitle,
          metaDescription: result.metadata.metaDescription,
          tags: result.metadata.tags ?? prev.tags,
          midjourneyPrompt: result.metadata.midjourneyPrompt ?? prev.midjourneyPrompt,
          sourceLink: prev.sourceLink,
          toneOfVoice: aiState.toneOfVoice.trim() || prev.toneOfVoice,
          goal: prev.goal,
          primaryKeyword: aiState.primaryKeyword.trim() || prev.primaryKeyword,
          extraKeywords: aiState.extraKeywords.trim() || prev.extraKeywords,
        }));

        setSlugTouched(true);
        setAiFeedback({ type: "success", message: "Concept gegenereerd. Controleer en werk bij waar nodig." });
      } catch (error) {
        setAiFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "AI-generatie mislukt. Controleer je GEMINI_API_KEY of probeer het later opnieuw.",
        });
      }
    });
  }, [aiState, form.primaryKeyword, startGenerating]);

  const handleDelete = useCallback(() => {
    if (!form.id) return;
    const confirmed = window.confirm("Weet je zeker dat je deze blog wilt verwijderen?");
    if (!confirmed) {
      return;
    }

    startDeleting(async () => {
      setFeedback(null);
      try {
        await deleteBlogAction(form.id!);
        router.push("/admin/blogs");
      } catch (error) {
        setFeedback({ type: "error", message: error instanceof Error ? error.message : "Verwijderen mislukt" });
      }
    });
  }, [form.id, router]);

  const disableSave = useMemo(() => isSaving || isGenerating || isDeleting, [isDeleting, isGenerating, isSaving]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      className="space-y-8"
    >
      {feedback ? (
        <div
          className={`rounded-3xl border px-5 py-4 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <section className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Basisinformatie</h2>
            <p className="text-sm text-neutral-500">Titel, slug en meta data voor SEO.</p>
          </div>
          {mode === "edit" && form.updatedAt ? (
            <div className="text-xs text-neutral-500">
              Laatst bijgewerkt: {new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(form.updatedAt))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="blog-title">
            <span>Titel</span>
            <input
              id="blog-title"
              name="title"
              value={form.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Bijv. LEGO® Serious Play verbindt teams"
              required
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="blog-slug">
            <span>Slug</span>
            <input
              id="blog-slug"
              name="slug"
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true);
                setForm((prev) => ({ ...prev, slug: event.target.value }));
              }}
              onBlur={handleSlugBlur}
              placeholder="lego-serious-play-verbindt-teams"
              required
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="blog-status">
            <span>Status</span>
            <select
              id="blog-status"
              name="status"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as BlogStatusValue }))}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="blog-primary-keyword">
            <span>Primair keyword</span>
            <input
              id="blog-primary-keyword"
              name="primaryKeyword"
              value={form.primaryKeyword}
              onChange={(event) => setForm((prev) => ({ ...prev, primaryKeyword: event.target.value }))}
              placeholder="bijv. LEGO Serious Play"
              required
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            />
          </label>
        </div>
        <label className="block space-y-2 text-sm font-medium text-neutral-700" htmlFor="blog-extra-keywords">
          <span>Extra keywords (komma-gescheiden)</span>
          <input
            id="blog-extra-keywords"
            name="extraKeywords"
            value={form.extraKeywords}
            onChange={(event) => setForm((prev) => ({ ...prev, extraKeywords: event.target.value }))}
            placeholder="teambuilding, maatschappelijke impact, hr"
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
          />
        </label>
      </section>

      <section className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">SEO & metadata</h2>
          <p className="text-sm text-neutral-500">Vul deze velden voor optimale zichtbaarheid.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="blog-focus-keyphrase">
            <span>Focus keyphrase</span>
            <input
              id="blog-focus-keyphrase"
              name="focusKeyphrase"
              value={form.focusKeyphrase}
              onChange={(event) => setForm((prev) => ({ ...prev, focusKeyphrase: event.target.value }))}
              required
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="blog-meta-title">
            <span>Meta title</span>
            <input
              id="blog-meta-title"
              name="metaTitle"
              value={form.metaTitle}
              onChange={(event) => setForm((prev) => ({ ...prev, metaTitle: event.target.value }))}
              required
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="blog-meta-description">
            <span>Meta description</span>
            <textarea
              id="blog-meta-description"
              name="metaDescription"
              value={form.metaDescription}
              onChange={(event) => setForm((prev) => ({ ...prev, metaDescription: event.target.value }))}
              rows={3}
              required
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="blog-tags">
            <span>Tags</span>
            <input
              id="blog-tags"
              name="tags"
              value={form.tags}
              onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
              placeholder="Impact, Teamontwikkeling"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="blog-cover-image">
            <span>Coverafbeelding (URL)</span>
            <input
              id="blog-cover-image"
              name="coverImage"
              value={form.coverImage}
              onChange={(event) => setForm((prev) => ({ ...prev, coverImage: event.target.value }))}
              placeholder="https://..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="blog-midjourney">
            <span>Midjourney prompt</span>
            <textarea
              id="blog-midjourney"
              name="midjourneyPrompt"
              value={form.midjourneyPrompt}
              onChange={(event) => setForm((prev) => ({ ...prev, midjourneyPrompt: event.target.value }))}
              rows={3}
              placeholder="Visualiseer een inspirerende LSP-teambuildingsessie..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            />
          </label>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Inhoud</h2>
          <p className="text-sm text-neutral-500">Schrijf of plak de volledige blog. Markdown wordt ondersteund.</p>
        </div>
        <label className="block space-y-2 text-sm font-medium text-neutral-700" htmlFor="blog-excerpt">
          <span>Korte intro / excerpt</span>
          <textarea
            id="blog-excerpt"
            name="excerpt"
            rows={3}
            value={form.excerpt}
            onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
            placeholder="Maximaal 2-3 zinnen voor de bloglijst of sociale media."
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium text-neutral-700" htmlFor="blog-content">
          <span>Blogtekst</span>
          <textarea
            id="blog-content"
            name="content"
            rows={22}
            value={form.content}
            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
            placeholder="Schrijf hier de volledige blogtekst inclusief koppen."
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
          />
        </label>
      </section>

      <section className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">AI blog generator</h2>
            <p className="text-sm text-neutral-500">Vul context in en genereer een concept in jullie huisstijl.</p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 shadow-sm transition hover:bg-accent-deep hover:text-white disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {isGenerating ? "Bezig..." : "Genereer met AI"}
          </button>
        </div>

        {aiFeedback ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              aiFeedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            {aiFeedback.message}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="ai-primary">
            <span>Primair keyword</span>
            <input
              id="ai-primary"
              value={aiState.primaryKeyword}
              onChange={(event) => setAiState((prev) => ({ ...prev, primaryKeyword: event.target.value }))}
              placeholder="Bijv. betekenisvolle teambuilding"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="ai-extra">
            <span>Extra keywords</span>
            <input
              id="ai-extra"
              value={aiState.extraKeywords}
              onChange={(event) => setAiState((prev) => ({ ...prev, extraKeywords: event.target.value }))}
              placeholder="scheid met komma's"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="ai-tone">
            <span>Tone of voice</span>
            <input
              id="ai-tone"
              value={aiState.toneOfVoice}
              onChange={(event) => setAiState((prev) => ({ ...prev, toneOfVoice: event.target.value }))}
              placeholder={DEFAULT_TONE}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="ai-audience">
            <span>Doelgroep</span>
            <select
              id="ai-audience"
              value={aiState.audience}
              onChange={(event) => setAiState((prev) => ({ ...prev, audience: event.target.value }))}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
            >
              <option value="HR-professionals, leidinggevenden en organisaties die werken aan teamontwikkeling, cultuur en maatschappelijke betrokkenheid">
                HR & leiderschap (standaard)
              </option>
              <option value="Teamcoaches en facilitators die impactvolle werkvormen zoeken">
                Teamcoaches & facilitators
              </option>
              <option value="Directies en MT’s die cultuurverandering of strategie-sessies willen versnellen">
                Directies & MT’s
              </option>
              <option value="Maatschappelijke organisaties en CSR-teams die medewerkers willen activeren">
                CSR & maatschappelijke teams
              </option>
            </select>
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-neutral-900">Acties</p>
          <p className="text-xs text-neutral-500">Sla op als concept of publiceer direct.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {mode === "edit" ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400"
            >
              {isDeleting ? "Verwijderen..." : "Verwijderen"}
            </button>
          ) : null}
          <button
            type="submit"
            disabled={disableSave}
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400"
          >
            {isSaving ? "Opslaan..." : "Opslaan"}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={disableSave}
            className="inline-flex items-center justify-center rounded-xl bg-[#006D77] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {isSaving ? "Bezig..." : publishLabel}
          </button>
        </div>
      </section>
    </form>
  );
}
