import Link from "next/link";
import { notFound } from "next/navigation";

import { ViewerUploadForm } from "@/components/viewer/viewer-upload-form";
import { prisma } from "@/lib/prisma";
import { getWorkshopLiveState } from "@/lib/workshop/state";

type ViewerUploadPageProps = {
  params: {
    pin: string;
  };
  searchParams?: {
    session?: string;
  };
};

export default async function ViewerUploadPage({ params, searchParams }: ViewerUploadPageProps) {
  const pin = params.pin?.trim();
  if (!pin) {
    notFound();
  }

  const workshop = await prisma.workshop.findUnique({
    where: { viewerPin: pin },
    include: {
      sessions: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!workshop) {
    notFound();
  }

  const liveState = await getWorkshopLiveState(workshop.id);
  const defaultSessionId = searchParams?.session ?? liveState.activeSessionId ?? undefined;

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
            Foto uploaden
          </p>
          <h1 className="text-3xl font-semibold">Bewaar momenten per sessie</h1>
          <p className="text-sm text-white/60">
            Upload foto’s en notities terwijl je de sessie begeleidt. Deze komen automatisch bij de juiste workshop terecht.
          </p>
        </header>

        <ViewerUploadForm
          pin={pin}
          sessions={workshop.sessions}
          defaultSessionId={defaultSessionId}
        />

        <Link
          href={`/viewer/${pin}`}
          className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/40 hover:bg-white/10"
        >
          Terug naar viewer
        </Link>
      </div>
    </main>
  );
}
