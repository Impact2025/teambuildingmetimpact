import { TeamdayProgramForm } from "@/components/teamday/teamday-program-form";
import { getTeamdayProgram } from "@/lib/teamday-program";

export const metadata = {
  title: "Teamdag programma",
  description: "Beheer het dagprogramma voor Teambuilding met Impact",
};

export default async function TeamdayAdminPage() {
  const program = await getTeamdayProgram();

  return (
    <div className="space-y-10">
      <TeamdayProgramForm initialProgram={program} />
    </div>
  );
}
