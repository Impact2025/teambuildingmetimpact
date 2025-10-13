import Link from "next/link";

export default function PresenterLandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 text-white">
      <div className="flex w-full max-w-4xl flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          Presentatie View
        </p>
        <h1 className="text-4xl font-semibold">Koppel deze weergave aan een actieve workshop</h1>
        <p className="max-w-2xl text-base text-white/70">
          Gebruik de link die vanuit het admin-dashboard wordt gedeeld. De beamer-proof modus geeft timers, opdrachten en statussen automatisch weer.
        </p>
        <Link
          href="/login"
          className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white"
        >
          Naar admin-dashboard
        </Link>
      </div>
    </main>
  );
}
