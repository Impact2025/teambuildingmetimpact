import Link from "next/link";

import { CreateWorkshopForm } from "@/components/workshops/create-workshop-form";
import { WorkshopCardActions } from "@/components/workshops/workshop-card-actions";
import { prisma } from "@/lib/prisma";
import { formatViewerUrl } from "@/lib/viewer-pin";

async function getWorkshops() {
  return prisma.workshop.findMany({
    orderBy: { date: "asc" },
    include: {
      _count: {
        select: { sessions: true, aiReports: true },
      },
    },
  });
}

export default async function SessionsPage() {
  const workshops = await getWorkshops();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  return (
    <div className="space-y-10">
      <CreateWorkshopForm />

      <section className="space-y-4">
        <header className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Geplande workshopdagen
            </h2>
            <p className="text-sm text-neutral-500">
              Beheer opdrachten, timers en presentatievolgorde per dag.
            </p>
          </div>
        </header>

        {workshops.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/70 p-10 text-center text-sm text-neutral-500">
            <p>Je hebt nog geen workshops toegevoegd. Maak de eerste dag aan om sessies te plannen.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {workshops.map((workshop) => {
              const dateLabel = new Intl.DateTimeFormat("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(workshop.date);

              return (
                <div
                  key={workshop.id}
                  className="group flex h-full flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-neutral-400 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-neutral-400">
                      <span>{dateLabel}</span>
                      <span>{workshop.status}</span>
                    </div>
                    <Link
                      href={`/admin/sessions/${workshop.id}`}
                      className="block space-y-2"
                    >
                      <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-neutral-700">
                        {workshop.title}
                      </h3>
                      {workshop.description ? (
                        <p className="text-sm text-neutral-500">
                          {workshop.description}
                        </p>
                      ) : null}
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3 text-xs text-neutral-500">
                    <span>{workshop._count.sessions} sessies</span>
                    <span>{workshop._count.aiReports} AI-rapporten</span>
                  </div>
                  {workshop.viewerPin ? (
                    <div className="mt-3 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/60 px-4 py-3 text-xs text-neutral-500">
                      <p className="font-semibold text-neutral-700">Pincode voor deelnemers</p>
                      <p className="text-lg font-semibold tracking-[0.3em] text-neutral-900">{workshop.viewerPin}</p>
                      <p className="mt-1 break-all text-[0.7rem] text-neutral-500">
                        Deel link: {formatViewerUrl(baseUrl, workshop.viewerPin)}
                      </p>
                    </div>
                  ) : null}
                  <div className="mt-4 flex justify-end">
                    <WorkshopCardActions workshopId={workshop.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
