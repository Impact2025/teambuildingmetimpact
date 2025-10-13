import { redirect } from "next/navigation";

import { UploadForm } from "@/components/uploads/upload-form";
import { UploadGallery } from "@/components/uploads/upload-gallery";
import { prisma } from "@/lib/prisma";
import { getUploadSignedUrl } from "@/lib/workshop/uploads";

type UploadsPageProps = {
  searchParams?: {
    workshopId?: string;
  };
};

export default async function UploadsPage({ searchParams }: UploadsPageProps) {
  const workshops = await prisma.workshop.findMany({
    orderBy: { date: "asc" },
    include: {
      sessions: {
        orderBy: { order: "asc" },
        include: {
          uploads: {
            orderBy: { createdAt: "desc" },
          },
        },
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
    redirect("/admin/uploads");
  }

  const sessions = await Promise.all(
    selectedWorkshop.sessions.map(async (session) => ({
      id: session.id,
      title: session.title,
      uploads: await Promise.all(
        session.uploads.map(async (upload) => ({
          id: upload.id,
          title: upload.title,
          notes: upload.notes,
          tags: upload.tags,
          url: await getUploadSignedUrl(upload.storagePath),
          createdAt: upload.createdAt,
        }))
      ),
    }))
  );

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Bouwwerken
          </p>
          <h1 className="text-xl font-semibold text-neutral-900">
            {selectedWorkshop.title}
          </h1>
        </div>
      </header>

      <UploadForm
        sessions={selectedWorkshop.sessions.map((session) => ({
          id: session.id,
          title: session.title,
        }))}
      />

      <UploadGallery sessions={sessions} />
    </div>
  );
}
