import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const PIN_LENGTH = 6;
const MAX_ATTEMPTS = 20;

function generateRandomPin() {
  const min = 10 ** (PIN_LENGTH - 1);
  const max = 10 ** PIN_LENGTH - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

type WorkshopDelegate = Pick<PrismaClient["workshop"], "findUnique" | "create" | "update">;

type PrismaLike = {
  workshop: WorkshopDelegate;
};

export async function generateUniqueViewerPin(client: PrismaLike = prisma): Promise<string> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const pin = generateRandomPin();
    const existing = await client.workshop.findUnique({
      where: { viewerPin: pin },
      select: { id: true },
    });
    if (!existing) {
      return pin;
    }
  }

  throw new Error("Kon geen unieke pincode genereren na meerdere pogingen.");
}

export function formatViewerUrl(baseUrl: string, pin: string) {
  let origin = baseUrl;
  try {
    // eslint-disable-next-line no-new
    new URL(origin);
  } catch {
    origin = `https://${baseUrl.replace(/^https?:\/\//, "")}`;
  }

  const url = new URL(origin);
  url.pathname = `/viewer/${pin}`;
  return url.toString().replace(/\/?$/, "");
}
