"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getOpenAIClient } from "@/lib/openai";

import { requireAdmin } from "./helpers";

const responseSchema = z.object({
  summary: z.string(),
  metaphors: z.array(z.string()),
  prompts: z.array(
    z.object({
      prompt: z.string(),
      keywords: z.array(z.string()).optional(),
      style: z.string().optional(),
      lighting: z.string().optional(),
      material: z.string().optional(),
      composition: z.string().optional(),
    })
  ),
});

export async function generateAiReportAction(workshopId: string) {
  await requireAdmin();

  const workshop = await prisma.workshop.findUnique({
    where: { id: workshopId },
    include: {
      sessions: {
        orderBy: { order: "asc" },
        include: {
          uploads: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!workshop) {
    throw new Error("Workshop niet gevonden");
  }

  const promptContent = workshop.sessions
    .map((session, index) => {
      const uploads = session.uploads
        .map((upload) => `- ${upload.title ?? "Naamloos"}: tags (${upload.tags.join(", ")}) notities (${upload.notes ?? "-"})`)
        .join("\n");
      return `Sessie ${index + 1}: ${session.title}
Opdracht:
${session.assignmentMarkdown}
Notities: ${session.facilitatorNotes ?? "-"}
Uploads:
${uploads || "geen uploads"}`;
    })
    .join("\n\n");

  const systemPrompt = `Je bent een LEGO® SERIOUS PLAY® facilitator. Maak een beknopte samenvatting (Nederlands), benoem kernmetaforen en bedenk 3 Midjourney prompts (Engels) met 5-8 kernwoorden, stijl, licht, materiaal en compositie. Voeg \"--ar 16:9 --v 6\" toe.`;

  const client = getOpenAIClient();

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Workshop: ${workshop.title}\nDatum: ${workshop.date.toISOString()}\n\n${promptContent}\n\nGeef enkel JSON met velden summary (string), metaphors (array van strings) en prompts (array met objecten {prompt, keywords, style, lighting, material, composition}).` ,
      },
    ],
  });

  const output = response.output_text;

  if (!output) {
    throw new Error("OpenAI gaf geen geldige output");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(output);
  } catch (error) {
    throw new Error("OpenAI reactie kon niet worden geparsed");
  }

  const parsed = responseSchema.parse(parsedJson);

  const report = await prisma.aIReport.create({
    data: {
      workshopId,
      summary: parsed.summary,
      metaphors: parsed.metaphors,
      prompts: parsed.prompts,
      modelVersion: "gpt-4o-mini",
    },
  });

  return report;
}
