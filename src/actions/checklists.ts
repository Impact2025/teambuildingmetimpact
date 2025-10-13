"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { requireAdmin } from "./helpers";

const checklistSchema = z.object({
  workshopId: z.string().cuid(),
  type: z.enum(["PREP", "SESSION", "WRAP"]),
  label: z.string().min(2),
  sessionId: z.string().cuid().optional(),
});

export async function createChecklistItemAction(input: z.infer<typeof checklistSchema>) {
  await requireAdmin();
  const data = checklistSchema.parse(input);

  const order = await prisma.checklistItem.count({
    where: { workshopId: data.workshopId, type: data.type },
  });

  const item = await prisma.checklistItem.create({
    data: {
      workshopId: data.workshopId,
      type: data.type,
      label: data.label,
      order,
      sessionId: data.sessionId,
    },
  });

  return item;
}

export async function toggleChecklistItemAction(itemId: string, checked: boolean) {
  await requireAdmin();

  return prisma.checklistItem.update({
    where: { id: itemId },
    data: { isChecked: checked },
  });
}
