"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  cloneWorkshopAction,
  deleteWorkshopAction,
} from "@/actions/workshops";

type WorkshopCardActionsProps = {
  workshopId: string;
};

export function WorkshopCardActions({ workshopId }: WorkshopCardActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClone = () => {
    startTransition(async () => {
      await cloneWorkshopAction(workshopId);
      router.refresh();
    });
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Weet je zeker dat je deze workshopdag en alle sessies wilt verwijderen?"
    );
    if (!confirmed) {
      return;
    }
    startTransition(async () => {
      await deleteWorkshopAction(workshopId);
      router.refresh();
    });
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleClone}
        disabled={isPending}
        className="rounded-xl border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Kopieer dag
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-xl border border-red-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-600 transition hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Verwijder
      </button>
    </div>
  );
}
