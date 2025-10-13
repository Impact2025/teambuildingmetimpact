import { notFound } from "next/navigation";

import { PresenterScreen } from "@/components/presenter/presenter-screen";
import { WorkshopRealtimeBridge } from "@/components/realtime/workshop-realtime-bridge";
import { prisma } from "@/lib/prisma";
import { getWorkshopLiveState } from "@/lib/workshop/state";

type PresenterPageProps = {
  params: {
    workshopId: string;
  };
};

export default async function PresenterPage({ params }: PresenterPageProps) {
  const workshop = await prisma.workshop.findUnique({
    where: { id: params.workshopId },
  });

  if (!workshop) {
    notFound();
  }

  const liveState = await getWorkshopLiveState(workshop.id);

  return (
    <>
      <WorkshopRealtimeBridge
        workshopId={workshop.id}
        initialState={liveState}
        role="viewer"
      />
      <PresenterScreen workshopTitle={workshop.title} />
    </>
  );
}
