"use client";

import { useFormState, useFormStatus } from "react-dom";

import { verifyViewerPinAction } from "@/actions/viewer";
import { viewerLoginDefaultState } from "@/state/viewer-login";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      {pending ? "Controleren..." : "Ga naar sessie"}
    </button>
  );
}

export function ViewerLoginForm() {
  const [state, formAction] = useFormState(
    verifyViewerPinAction,
    viewerLoginDefaultState
  );

  return (
    <form
      action={formAction}
      className="w-full max-w-sm space-y-5 rounded-3xl border border-neutral-200 bg-white/90 px-8 py-10 shadow-xl"
    >
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
          Workshop toegang
        </p>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Voer de pincode in
        </h1>
        <p className="text-sm text-neutral-500">
          Vraag de facilitator om de code voor vandaag. Je ziet dan live de sessie, timer en slides.
        </p>
      </div>

      <label className="block space-y-2 text-sm font-medium text-neutral-700" htmlFor="pin">
        <span>Pincode</span>
        <input
          id="pin"
          name="pin"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          placeholder="Bijv. 123456"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-center text-lg tracking-[0.4em] text-neutral-900 shadow-sm transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
        />
      </label>

      <SubmitButton />

      {state.status === "error" ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.message}
        </p>
      ) : null}

      <p className="text-center text-xs text-neutral-400">
        Deze weergave is read-only. De facilitator behoudt de controle over timers en slides.
      </p>
    </form>
  );
}
