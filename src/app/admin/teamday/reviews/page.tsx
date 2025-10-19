import { getAllTeamdayReviews } from "@/lib/teamday-reviews";
import { getTeamdayProgram } from "@/lib/teamday-program";
import { TeamdayReviewList } from "@/components/teamday/teamday-review-list";

export const metadata = {
  title: "Teamdag reviews",
  description: "Beheer reviews voor Teambuilding met Impact",
};

export default async function TeamdayReviewsAdminPage() {
  const [reviews, program] = await Promise.all([
    getAllTeamdayReviews(),
    getTeamdayProgram(),
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Reviews</p>
        <h1 className="text-2xl font-semibold text-neutral-900">Teamdag reviews beheren</h1>
        <p className="text-sm text-neutral-500">
          Nieuwe reviews worden standaard op &apos;in behandeling&apos; gezet. Keur reviews goed om ze op de website te tonen.
        </p>
      </header>

      <TeamdayReviewList reviews={reviews} program={program} />
    </div>
  );
}
