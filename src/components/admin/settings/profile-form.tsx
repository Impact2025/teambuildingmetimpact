"use client";

import { useRef, useState, useTransition } from "react";

import { updateProfile } from "@/actions/settings";

type Props = {
  name: string;
  email: string;
};

export function ProfileForm({ name, email }: Props) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    startTransition(async () => {
      const result = await updateProfile(
        nameRef.current!.value.trim(),
        emailRef.current!.value.trim()
      );
      if (result.ok) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Naam
          </label>
          <input
            ref={nameRef}
            type="text"
            defaultValue={name}
            required
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#006D77] focus:bg-white focus:ring-2 focus:ring-[#006D77]/10"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            E-mailadres
          </label>
          <input
            ref={emailRef}
            type="email"
            defaultValue={email}
            required
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#006D77] focus:bg-white focus:ring-2 focus:ring-[#006D77]/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-[#006D77] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-[#005862] disabled:opacity-50"
        >
          {isPending ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Opslaan…
            </>
          ) : (
            "Opslaan"
          )}
        </button>

        {status === "success" && (
          <p className="text-sm font-medium text-emerald-600">Profiel bijgewerkt</p>
        )}
        {status === "error" && (
          <p className="text-sm font-medium text-red-600">{errorMsg}</p>
        )}
      </div>
    </form>
  );
}
