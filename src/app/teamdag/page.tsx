import { TeamdayViewer } from "@/components/teamday/teamday-viewer";
import {
  DEFAULT_FACILITATOR_TIPS,
  getTeamdayProgram,
} from "@/lib/teamday-program";
import { getTeamdayUploadsBySession } from "@/lib/teamday-uploads";

export const metadata = {
  title: "Teamdag viewer",
  description: "Eigen viewer voor Teambuilding met Impact programma",
};

export default async function TeamdagPage() {
  const program = await getTeamdayProgram();
  const uploads = await getTeamdayUploadsBySession(program.sessions.map((session) => session.id));

  return (
    <TeamdayViewer
      program={program}
      tips={DEFAULT_FACILITATOR_TIPS}
      initialUploads={uploads}
    />
  );
}
