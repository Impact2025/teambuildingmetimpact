import type { Workshop, WorkshopSession } from "@prisma/client";

import type { SlideDescriptor } from "@/types/workshop";

export function buildSlides(
  workshop: Workshop,
  sessions: WorkshopSession[]
): SlideDescriptor[] {
  const introSlides: SlideDescriptor[] = [
    {
      id: `${workshop.id}-intro-who`,
      kind: "intro:who",
      title: workshop.facilitatorName ?? "Facilitator",
      subtitle: workshop.facilitatorTitle ?? "LEGO® SERIOUS PLAY®",
      description: workshop.description ?? workshop.title,
    },
    {
      id: `${workshop.id}-intro-lsp`,
      kind: "intro:lsp",
      title: "Wat is LEGO® SERIOUS PLAY®?",
      description:
        "We bouwen verhalen in 3D om strategieën, inzichten en samenwerking tastbaar te maken.",
    },
    {
      id: `${workshop.id}-intro-flow`,
      kind: "intro:house",
      title: "Flow van de dag",
      description: "Welkom, bouwrondes, reflectie, foto’s & AI-samenvatting.",
    },
  ];

  const sessionSlides: SlideDescriptor[] = sessions
    .sort((a, b) => a.order - b.order)
    .map<SlideDescriptor>((session) => ({
      id: `${session.id}-slide`,
      kind: "session",
      sessionId: session.id,
      title: session.title,
      description: session.assignmentMarkdown,
    }));

  const outroSlides: SlideDescriptor[] = [
    {
      id: `${workshop.id}-pause`,
      kind: "pause",
      title: "Pauze",
      description: "Neem even rust, we starten zo weer.",
    },
    {
      id: `${workshop.id}-summary`,
      kind: "summary",
      title: "Reflectie & AI-samenvatting",
      description: "We eindigen met inzichten, foto’s en een AI prompt voor Midjourney.",
    },
  ];

  return [...introSlides, ...sessionSlides, ...outroSlides];
}
