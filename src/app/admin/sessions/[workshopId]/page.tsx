import Link from "next/link";
import { notFound } from "next/navigation";

import { CreateSessionForm } from "@/components/workshops/create-session-form";
import { ImportPlanForm } from "@/components/workshops/import-plan-form";
import { RunOfShowTimeline } from "@/components/workshops/run-of-show-timeline";
import { SessionList } from "@/components/workshops/session-list";
import { prisma } from "@/lib/prisma";
import { formatViewerUrl } from "@/lib/viewer-pin";

type WorkshopSessionsPageProps = {
  params: {
    workshopId: string;
  };
};

export default async function WorkshopSessionsPage({
  params,
}: WorkshopSessionsPageProps) {
  const workshop = await prisma.workshop.findUnique({
    where: { id: params.workshopId },
    include: {
      sessions: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!workshop) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const viewerLink = workshop.viewerPin ? formatViewerUrl(baseUrl, workshop.viewerPin) : null;

  const dateLabel = new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(workshop.date);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              {dateLabel}
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900">{workshop.title}</h2>
            {workshop.description ? (
              <p className="max-w-2xl text-sm text-neutral-500">
                {workshop.description}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
              {workshop.facilitatorName ? (
                <span className="rounded-full bg-neutral-100 px-3 py-1">
                  Facilitator: {workshop.facilitatorName}
                  {workshop.facilitatorTitle ? `, ${workshop.facilitatorTitle}` : ""}
                </span>
              ) : null}
              <span className="rounded-full bg-neutral-100 px-3 py-1">
                Status: {workshop.status}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/presenter/${workshop.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-700 transition hover:border-neutral-500 hover:text-neutral-900"
            >
              Open presentatie-viewer
            </Link>
          </div>
        </div>
        {viewerLink ? (
          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/70 p-4 text-sm text-neutral-600">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
                Deelnemerspincode
              </p>
              <p className="text-2xl font-semibold tracking-[0.4em] text-neutral-900">
                {workshop.viewerPin}
              </p>
            </div>
            <div className="flex-1 min-w-[220px]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Deel-link
              </p>
              <p className="break-all text-sm text-neutral-500">{viewerLink}</p>
            </div>
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <CreateSessionForm workshopId={workshop.id} />
        <ImportPlanForm workshopId={workshop.id} />
      </div>

      <SessionList
        workshopId={workshop.id}
        sessions={workshop.sessions.map((session) => ({
          id: session.id,
          title: session.title,
          assignmentMarkdown: session.assignmentMarkdown,
          buildDurationSec: session.buildDurationSec,
          discussDurationSec: session.discussDurationSec,
          themeColor: session.themeColor,
          facilitatorNotes: session.facilitatorNotes,
          order: session.order,
        }))}
      />

      <RunOfShowTimeline
        sessions={workshop.sessions.map((session) => ({
          id: session.id,
          title: session.title,
          buildDurationSec: session.buildDurationSec,
          discussDurationSec: session.discussDurationSec,
        }))}
      />
    </div>
  );
}
