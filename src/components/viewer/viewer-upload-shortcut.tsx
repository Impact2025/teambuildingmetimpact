"use client";

import Link from "next/link";

import { useWorkshopStore } from "@/state/workshop-store";

type ViewerUploadShortcutProps = {
  pin: string;
};

export function ViewerUploadShortcut({ pin }: ViewerUploadShortcutProps) {
  const activeSessionId = useWorkshopStore((store) => store.state?.activeSessionId);

  const target = activeSessionId
    ? `/viewer/${pin}/upload?session=${encodeURIComponent(activeSessionId)}`
    : `/viewer/${pin}/upload`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href={target}
        className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400"
      >
        <span className="rounded-full bg-white/20 px-2 py-1 text-xs">Foto</span>
        <span>Upload</span>
      </Link>
    </div>
  );
}
