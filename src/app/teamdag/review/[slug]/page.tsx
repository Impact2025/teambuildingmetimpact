import { notFound } from "next/navigation";

import { getTeamdaySessionBySlug } from "@/lib/teamday-sessions";
import { getTeamdayProgram } from "@/lib/teamday-program";
import { TeamdaySessionReviewForm } from "@/components/teamday/teamday-session-review-form";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  const session = await getTeamdaySessionBySlug(params.slug);

  if (!session) {
    return {
      title: "Review niet gevonden",
    };
  }

  return {
    title: `Review - ${session.clientName}`,
    description: `Deel je ervaring over de teamdag voor ${session.clientName}`,
  };
}

export default async function TeamdaySessionReviewPage({ params }: Props) {
  const session = await getTeamdaySessionBySlug(params.slug);

  if (!session) {
    notFound();
  }

  const program = await getTeamdayProgram();

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Teambuilding met Impact
          </p>
          <h1 className="mt-2 text-3xl font-bold text-neutral-900">Deel je ervaring</h1>
          <p className="mt-4 text-neutral-600">
            We horen graag hoe je de teamdag hebt ervaren. Je feedback helpt ons om toekomstige programma&apos;s nog beter te maken.
          </p>
        </header>

        <TeamdaySessionReviewForm program={program} session={session} />
      </div>
    </div>
  );
}
