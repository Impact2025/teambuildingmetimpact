import { getAllTeamdaySessions } from "@/lib/teamday-sessions";
import { TeamdaySessionManager } from "@/components/teamday/teamday-session-manager";

export const metadata = {
  title: "Teamdag sessies",
  description: "Beheer teamdag sessies en review links",
};

export default async function TeamdaySessionsPage() {
  const sessions = await getAllTeamdaySessions();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Sessies</p>
        <h1 className="text-2xl font-semibold text-neutral-900">Teamdag sessies beheren</h1>
        <p className="text-sm text-neutral-500">
          Maak voor elke teamdag een unieke sessie aan. Stuur de klant de review-link zodat deelnemers feedback kunnen geven.
        </p>
      </header>

      <TeamdaySessionManager initialSessions={sessions} />
    </div>
  );
}
