"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { importWorkshopPlanAction } from "@/actions/workshops";
import { workshopActionDefaultState } from "@/state/workshop-actions";

type ImportPlanFormProps = {
  workshopId: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      {pending ? "Importeren..." : "Planning importeren"}
    </button>
  );
}

export function ImportPlanForm({ workshopId }: ImportPlanFormProps) {
  const [state, formAction] = useFormState(
    importWorkshopPlanAction,
    workshopActionDefaultState
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state.status === "success" && textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="flex h-full flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="workshopId" value={workshopId} />
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900">
          Importeer dagschema
        </h2>
        <p className="text-sm text-neutral-500">
          Plak een tekstuele planning. We zetten elk tijdslot om naar een sessie
          met een bouw- en bespreekduur.
        </p>
      </div>

      <label className="flex-1 space-y-2 text-sm font-medium text-neutral-700" htmlFor="planText">
        <span>Planningstekst</span>
        <textarea
          id="planText"
          name="planText"
          ref={textareaRef}
          rows={10}
          placeholder="15:00 – 15:10 | Intro & warming-up&#10;Doel: ..."
          className="h-full min-h-[12rem] w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          required
        />
      </label>

      <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
        <input
          type="checkbox"
          name="replaceExisting"
          defaultChecked
          className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400"
        />
        Bestaande sessies vervangen
      </label>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-neutral-400">
          Tip: Controleer de geïmporteerde opdrachten en pas handmatig aan waar
          nodig.
        </p>
        <SubmitButton />
      </div>

      {state.status === "error" ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.message}
        </p>
      ) : null}
      {state.status === "success" ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
