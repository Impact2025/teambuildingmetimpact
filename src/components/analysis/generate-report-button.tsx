"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { generateAiReportAction } from "@/actions/analysis";

type GenerateReportButtonProps = {
  workshopId: string;
};

export function GenerateReportButton({ workshopId }: GenerateReportButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        await generateAiReportAction(workshopId);
        router.refresh();
      } catch (err: any) {
        setError(err.message ?? "Analyse mislukt");
      }
    });
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
      >
        {isPending ? "Analyse wordt gemaakt..." : "Genereer AI-rapport"}
      </button>
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
