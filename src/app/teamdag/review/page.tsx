import { TeamdayReviewForm } from "@/components/teamday/teamday-review-form";
import { getTeamdayProgram } from "@/lib/teamday-program";

export const metadata = {
  title: "Teamdag review invullen",
  description: "Laat per onderdeel weten hoe je de teamdag hebt ervaren.",
};

export default async function TeamdayReviewPage() {
  const program = await getTeamdayProgram();

  return (
    <main className="bg-neutral-50 py-12 text-neutral-900">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-10">
        <TeamdayReviewForm program={program} />
      </div>
    </main>
  );
}
