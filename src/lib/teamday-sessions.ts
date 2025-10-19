import { z } from "zod";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { TEAMDAY_PROGRAM_SLUG } from "@/lib/teamday-program";

export type TeamdaySessionRecord = {
  id: string;
  slug: string;
  eventDate: Date;
  clientName: string;
  participantCount: number | null;
  notes: string | null;
  programId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamdaySessionWithStats = TeamdaySessionRecord & {
  reviewCount: number;
  averageRating: number | null;
};

const createSessionSchema = z.object({
  eventDate: z.coerce.date(),
  clientName: z.string().trim().min(1).max(200),
  participantCount: z.number().int().min(1).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export type CreateTeamdaySessionInput = z.infer<typeof createSessionSchema>;

function generateUniqueSlug(): string {
  return nanoid(10);
}

export async function createTeamdaySession(input: CreateTeamdaySessionInput): Promise<TeamdaySessionRecord> {
  const payload = createSessionSchema.parse(input);

  const program = await prisma.teamdayProgram.findUnique({
    where: { slug: TEAMDAY_PROGRAM_SLUG },
    select: { id: true },
  });

  const slug = generateUniqueSlug();

  const session = await prisma.teamdaySession.create({
    data: {
      slug,
      eventDate: payload.eventDate,
      clientName: payload.clientName,
      participantCount: payload.participantCount ?? null,
      notes: payload.notes ?? null,
      programId: program?.id ?? null,
    },
  });

  return {
    id: session.id,
    slug: session.slug,
    eventDate: session.eventDate,
    clientName: session.clientName,
    participantCount: session.participantCount,
    notes: session.notes,
    programId: session.programId,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

export async function getTeamdaySessionBySlug(slug: string): Promise<TeamdaySessionRecord | null> {
  const session = await prisma.teamdaySession.findUnique({
    where: { slug },
  });

  if (!session) {
    return null;
  }

  return {
    id: session.id,
    slug: session.slug,
    eventDate: session.eventDate,
    clientName: session.clientName,
    participantCount: session.participantCount,
    notes: session.notes,
    programId: session.programId,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

export async function getAllTeamdaySessions(): Promise<TeamdaySessionWithStats[]> {
  const sessions = await prisma.teamdaySession.findMany({
    orderBy: { eventDate: "desc" },
    include: {
      reviews: {
        select: {
          rating: true,
          status: true,
        },
      },
    },
  });

  return sessions.map((session) => {
    const approvedReviews = session.reviews.filter((r) => r.status === "APPROVED");
    const reviewCount = approvedReviews.length;
    const averageRating =
      reviewCount > 0
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : null;

    return {
      id: session.id,
      slug: session.slug,
      eventDate: session.eventDate,
      clientName: session.clientName,
      participantCount: session.participantCount,
      notes: session.notes,
      programId: session.programId,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      reviewCount,
      averageRating,
    };
  });
}

export async function deleteTeamdaySession(sessionId: string): Promise<void> {
  await prisma.teamdaySession.delete({
    where: { id: sessionId },
  });
}

export function generateReviewLink(slug: string): string {
  return `/teamdag/review/${slug}`;
}
