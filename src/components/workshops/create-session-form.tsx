"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { createSessionFormAction } from "@/actions/workshops";
import { workshopActionDefaultState } from "@/state/workshop-actions";

type CreateSessionFormProps = {
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
      {pending ? "Toevoegen..." : "Nieuwe sessie"}
    </button>
  );
}

export function CreateSessionForm({ workshopId }: CreateSessionFormProps) {
  const [state, formAction] = useFormState(
    createSessionFormAction,
    workshopActionDefaultState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="workshopId" value={workshopId} />
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 space-y-4">
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="title">
            <span>Titel</span>
            <input
              id="title"
              name="title"
              required
              placeholder="Bouw jouw metafoor"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="assignmentMarkdown">
            <span>Opdracht (Markdown toegestaan)</span>
            <textarea
              id="assignmentMarkdown"
              name="assignmentMarkdown"
              required
              rows={5}
              placeholder="Beschrijf de opdracht, reflectievragen en criteria."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />
          </label>
        </div>
        <div className="w-full max-w-sm space-y-4">
          <fieldset className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
            <legend className="px-2 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Bouwfase
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="space-y-1 text-xs font-medium text-neutral-600" htmlFor="buildMinutes">
                <span>Minuten</span>
                <input
                  id="buildMinutes"
                  name="buildMinutes"
                  type="number"
                  min={0}
                  defaultValue={10}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-neutral-600" htmlFor="buildSeconds">
                <span>Seconden</span>
                <input
                  id="buildSeconds"
                  name="buildSeconds"
                  type="number"
                  min={0}
                  max={59}
                  defaultValue={0}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
            <legend className="px-2 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Bespreekfase
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="space-y-1 text-xs font-medium text-neutral-600" htmlFor="discussMinutes">
                <span>Minuten</span>
                <input
                  id="discussMinutes"
                  name="discussMinutes"
                  type="number"
                  min={0}
                  defaultValue={10}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-neutral-600" htmlFor="discussSeconds">
                <span>Seconden</span>
                <input
                  id="discussSeconds"
                  name="discussSeconds"
                  type="number"
                  min={0}
                  max={59}
                  defaultValue={0}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
                />
              </label>
            </div>
          </fieldset>

          <label className="block space-y-2 text-sm font-medium text-neutral-700" htmlFor="themeColor">
            <span>Themakleur</span>
            <input
              id="themeColor"
              name="themeColor"
              type="color"
              className="h-12 w-full rounded-xl border border-neutral-200 bg-white"
              defaultValue="#bcccdc"
            />
          </label>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-xs text-neutral-400">
          Voeg na elke sessie reflectie-notities en tags toe voor de AI-analyse.
        </p>
        <SubmitButton />
      </div>

      {state.status === "error" ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.message}
        </p>
      ) : null}
      {state.status === "success" ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
