import { TeamdayViewer } from "@/components/teamday/teamday-viewer";
import {
  DEFAULT_FACILITATOR_TIPS,
  getTeamdayProgram,
} from "@/lib/teamday-program";

export const metadata = {
  title: "Teamdag viewer",
  description: "Eigen viewer voor Teambuilding met Impact programma",
};

export default async function TeamdagPage() {
  const program = await getTeamdayProgram();

  return <TeamdayViewer program={program} tips={DEFAULT_FACILITATOR_TIPS} />;
}
