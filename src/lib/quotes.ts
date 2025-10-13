import { prisma } from "@/lib/prisma";

export async function getQuoteRequests() {
  return prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
}
