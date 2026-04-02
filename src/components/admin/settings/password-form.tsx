"use client";

import { useRef, useState, useTransition } from "react";

import { changePassword } from "@/actions/settings";

export function PasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const currentRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    startTransition(async () => {
      const result = await changePassword(
        currentRef.current!.value,
        newRef.current!.value,
        confirmRef.current!.value
      );
      if (result.ok) {
        setStatus("success");
        formRef.current?.reset();
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Huidig wachtwoord
        </label>
        <div className="relative">
          <input
            ref={currentRef}
            type={showCurrent ? "text" : "password"}
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 pr-10 text-sm text-neutral-900 outline-none transition focus:border-[#006D77] focus:bg-white focus:ring-2 focus:ring-[#006D77]/10"
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            tabIndex={-1}
          >
            {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Nieuw wachtwoord
          </label>
          <div className="relative">
            <input
              ref={newRef}
              type={showNew ? "text" : "password"}
              required
              autoComplete="new-password"
              minLength={8}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 pr-10 text-sm text-neutral-900 outline-none transition focus:border-[#006D77] focus:bg-white focus:ring-2 focus:ring-[#006D77]/10"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              tabIndex={-1}
            >
              {showNew ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <p className="text-xs text-neutral-400">Minimaal 8 tekens</p>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Herhaal nieuw wachtwoord
          </label>
          <input
            ref={confirmRef}
            type={showNew ? "text" : "password"}
            required
            autoComplete="new-password"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#006D77] focus:bg-white focus:ring-2 focus:ring-[#006D77]/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-neutral-700 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Bijwerken…
            </>
          ) : (
            "Wachtwoord bijwerken"
          )}
        </button>

        {status === "success" && (
          <p className="text-sm font-medium text-emerald-600">Wachtwoord gewijzigd</p>
        )}
        {status === "error" && (
          <p className="text-sm font-medium text-red-600">{errorMsg}</p>
        )}
      </div>
    </form>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}
