import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pagina niet gevonden | Teambuilding met Impact",
  description: "De pagina die je zoekt bestaat niet of is verplaatst.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-neutral-50 px-6 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-neutral-900">Pagina niet gevonden</h1>
      <p className="mt-4 max-w-md text-sm text-neutral-600">
        De pagina die je zoekt bestaat niet of is verplaatst. Ga terug naar de homepage of bekijk onze blogs voor inspiratie.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-brand-dark"
        >
          Naar de homepage
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center justify-center rounded-xl border border-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-brand transition hover:bg-brand hover:text-white"
        >
          Bekijk de blog
        </Link>
      </div>
    </main>
  );
}
