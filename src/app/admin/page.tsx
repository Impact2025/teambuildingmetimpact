import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-600">Volgende sessie</h2>
          <p className="mt-2 text-xl font-semibold text-neutral-900">Nog geen sessies gepland</p>
          <p className="mt-2 text-sm text-neutral-500">
            Maak een dagprogramma om timers, slides en uploads klaar te zetten.
          </p>
          <Link
            href="/admin/sessions"
            className="mt-6 inline-flex rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            Plan sessies
          </Link>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-600">Presentatie viewer</h2>
          <p className="mt-2 text-xl font-semibold text-neutral-900">Geen actieve dag</p>
          <p className="mt-2 text-sm text-neutral-500">
            Start een dag in het sessie-overzicht om een gedeelde presentatie-link te ontvangen.
          </p>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-600">AI raporten</h2>
          <p className="mt-2 text-xl font-semibold text-neutral-900">Nog niet beschikbaar</p>
          <p className="mt-2 text-sm text-neutral-500">
            Upload bouwwerken en notities om de AI-samenvatting aan het einde van de dag te genereren.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-10 text-center text-sm text-neutral-500">
        <p>
          Deze startpagina toont straks live voortgang, timers en checklists zodra een workshop gepland is.
        </p>
      </section>
    </div>
  );
}
