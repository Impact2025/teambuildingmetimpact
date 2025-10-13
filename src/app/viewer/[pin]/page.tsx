import { notFound } from "next/navigation";

import { PresenterScreen } from "@/components/presenter/presenter-screen";
import { WorkshopRealtimeBridge } from "@/components/realtime/workshop-realtime-bridge";
import { prisma } from "@/lib/prisma";
import { getWorkshopLiveState } from "@/lib/workshop/state";

type ViewerWorkshopPageProps = {
  params: {
    pin: string;
  };
};

export default async function ViewerWorkshopPage({ params }: ViewerWorkshopPageProps) {
  const normalizedPin = params.pin?.trim() ?? "";

  if (!normalizedPin) {
    notFound();
  }

  const workshop = await prisma.workshop.findUnique({
    where: { viewerPin: normalizedPin },
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
