"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { createWorkshopFormAction } from "@/actions/workshops";
import { workshopActionDefaultState } from "@/state/workshop-actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      {pending ? "Opslaan..." : "Workshop aanmaken"}
    </button>
  );
}

export function CreateWorkshopForm() {
  const [state, formAction] = useFormState(
    createWorkshopFormAction,
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
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900">Nieuwe workshopdag</h2>
        <p className="text-sm text-neutral-500">
          Stel een dagprogramma op met opdrachten, timers en thema.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="title">
          <span>Titel</span>
          <input
            id="title"
            name="title"
            required
            placeholder="Workshop dag 1"
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="date">
          <span>Datum</span>
          <input
            id="date"
            name="date"
            type="date"
            required
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="facilitatorName">
          <span>Facilitator</span>
          <input
            id="facilitatorName"
            name="facilitatorName"
            placeholder="Naam facilitator"
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="facilitatorTitle">
          <span>Rol / titel</span>
          <input
            id="facilitatorTitle"
            name="facilitatorTitle"
            placeholder="Facilitator"
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          />
        </label>
      </div>

      <label className="mt-4 block space-y-2 text-sm font-medium text-neutral-700" htmlFor="description">
        <span>Korte omschrijving</span>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Wat is het doel van deze sessie dag?"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
        />
      </label>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-xs text-neutral-400">
          Tip: Gebruik templates om een dagprogramma te dupliceren.
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
