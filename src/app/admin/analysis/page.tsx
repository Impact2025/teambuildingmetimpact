import { redirect } from "next/navigation";

import { GenerateReportButton } from "@/components/analysis/generate-report-button";
import { prisma } from "@/lib/prisma";

type AnalysisPageProps = {
  searchParams?: {
    workshopId?: string;
  };
};

export default async function AnalysisPage({ searchParams }: AnalysisPageProps) {
  const workshops = await prisma.workshop.findMany({
    orderBy: { date: "asc" },
    include: {
      aiReports: {
        orderBy: { generatedAt: "desc" },
      },
    },
  });

  if (workshops.length === 0) {
    redirect("/admin/sessions");
  }

  const selectedWorkshop = searchParams?.workshopId
    ? workshops.find((workshop) => workshop.id === searchParams.workshopId)
    : workshops[0];

  if (!selectedWorkshop) {
    redirect("/admin/analysis");
  }

  const latestReport = selectedWorkshop.aiReports[0] ?? null;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            AI Analyse
          </p>
          <h1 className="text-xl font-semibold text-neutral-900">
            {selectedWorkshop.title}
          </h1>
          <p className="text-sm text-neutral-500">
            Verzamel uploads en notities om de dag automatisch te laten samenvatten.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <a
              href={`/api/workshops/${selectedWorkshop.id}/export.pdf`}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 hover:border-neutral-400"
            >
              Download PDF
            </a>
            <a
              href={`/api/workshops/${selectedWorkshop.id}/export.csv`}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 hover:border-neutral-400"
            >
              Download CSV
            </a>
          </div>
          <GenerateReportButton workshopId={selectedWorkshop.id} />
        </div>
      </header>

      {latestReport ? (
        <article className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Samenvatting</h2>
              <p className="text-xs text-neutral-400">
                Gegenereerd op {latestReport.generatedAt.toLocaleString("nl-NL")}
              </p>
            </div>
            <span className="rounded-full border border-neutral-200 px-4 py-2 text-xs text-neutral-500">
              Model: {latestReport.modelVersion ?? "gpt-4o-mini"}
            </span>
          </div>

          <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {latestReport.summary}
          </p>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900">Kernmetaforen</h3>
            <ul className="flex flex-wrap gap-3 text-sm text-neutral-600">
              {latestReport.metaphors.map((item) => (
                <li key={item} className="rounded-full bg-neutral-100 px-4 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900">Midjourney prompts</h3>
            <div className="space-y-4">
              {Array.isArray(latestReport.prompts)
                ? (latestReport.prompts as any[]).map((prompt, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600"
                    >
                      <p className="font-semibold text-neutral-900">Prompt {index + 1}</p>
                      <p className="mt-2 whitespace-pre-wrap">{prompt.prompt}</p>
                    </div>
                  ))
                : null}
            </div>
          </section>
        </article>
      ) : (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/70 p-10 text-center text-sm text-neutral-500">
          Nog geen AI-rapport beschikbaar. Voeg uploads en notities toe en start vervolgens de analyse.
        </div>
      )}
    </div>
  );
}
