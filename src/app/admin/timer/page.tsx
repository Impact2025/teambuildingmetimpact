import { redirect } from "next/navigation";

import { TimerControlPanel } from "@/components/admin/timer-control-panel";
import { WorkshopRealtimeBridge } from "@/components/realtime/workshop-realtime-bridge";
import { prisma } from "@/lib/prisma";
import { getWorkshopLiveState } from "@/lib/workshop/state";

export default async function TimerPage({ searchParams }: { searchParams?: { workshopId?: string } }) {
  const workshops = await prisma.workshop.findMany({
    orderBy: { date: "asc" },
    include: {
      sessions: {
        orderBy: { order: "asc" },
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
    redirect("/admin/timer");
  }

  const liveState = await getWorkshopLiveState(selectedWorkshop.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Timerbeheer
          </p>
          <h1 className="text-xl font-semibold text-neutral-900">
            {selectedWorkshop.title}
          </h1>
        </div>
      </div>

      <WorkshopRealtimeBridge
        workshopId={selectedWorkshop.id}
        initialState={liveState}
        role="admin"
      />

      <TimerControlPanel
        workshopId={selectedWorkshop.id}
        sessions={selectedWorkshop.sessions.map((session) => ({
          id: session.id,
          title: session.title,
          order: session.order,
          buildDurationSec: session.buildDurationSec,
          discussDurationSec: session.discussDurationSec,
        }))}
        slides={liveState.slides}
      />
    </div>
  );
}
