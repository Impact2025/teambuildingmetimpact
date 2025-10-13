import { redirect } from "next/navigation";

import { AddChecklistItemForm } from "@/components/checklists/add-checklist-form";
import { ChecklistGroup } from "@/components/checklists/checklist-group";
import { prisma } from "@/lib/prisma";

type ChecklistPageProps = {
  searchParams?: {
    workshopId?: string;
  };
};

export default async function ChecklistPage({ searchParams }: ChecklistPageProps) {
  const workshops = await prisma.workshop.findMany({
    orderBy: { date: "asc" },
    include: {
      checklists: {
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
    redirect("/admin/checklists");
  }

  const prepItems = selectedWorkshop.checklists.filter((item) => item.type === "PREP");
  const sessionItems = selectedWorkshop.checklists.filter((item) => item.type === "SESSION");
  const wrapItems = selectedWorkshop.checklists.filter((item) => item.type === "WRAP");

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Checklists
          </p>
          <h1 className="text-xl font-semibold text-neutral-900">
            {selectedWorkshop.title}
          </h1>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <ChecklistGroup
            title="Voor de start"
            description="Zorg dat materiaal, ruimte en deelnemers klaarstaan."
            items={prepItems}
          />
          <AddChecklistItemForm
            workshopId={selectedWorkshop.id}
            type="PREP"
            label="Nieuwe voorbereidingsstap"
          />
        </div>

        <div className="space-y-6">
          <ChecklistGroup
            title="Tijdens sessies"
            description="Herinneringen en rituelen per sessie."
            items={sessionItems}
          />
          <AddChecklistItemForm
            workshopId={selectedWorkshop.id}
            type="SESSION"
            label="Nieuwe sessie-check"
          />
        </div>

        <div className="space-y-6">
          <ChecklistGroup
            title="Afsluiting"
            description="Samenvattingen, foto's en vervolgacties."
            items={wrapItems}
          />
          <AddChecklistItemForm
            workshopId={selectedWorkshop.id}
            type="WRAP"
            label="Nieuwe afsluitstap"
          />
        </div>
      </div>
    </div>
  );
}
