import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { TeamdayReviewStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getTeamdayProgram, TEAMDAY_PROGRAM_SLUG, ensureTeamdayProgramSeed } from "@/lib/teamday-program";
import { MAX_TEAMDAY_REVIEW_COMMENT_LENGTH } from "@/lib/teamday-review-constants";

const reviewEntrySchema = z.object({
  sessionKey: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .max(MAX_TEAMDAY_REVIEW_COMMENT_LENGTH)
    .optional(),
});

const createReviewSchema = z.object({
  reviewerName: z.string().trim().min(1).max(120),
  entries: z.array(reviewEntrySchema).min(1),
  sessionSlug: z.string().optional(),
});

export type CreateTeamdayReviewInput = z.infer<typeof createReviewSchema>;

export type TeamdayReviewRecord = {
  id: string;
  sessionKey: string;
  reviewerName: string;
  rating: number;
  comment: string | null;
  reviewedAt: Date;
  programId: string | null;
  status: TeamdayReviewStatus;
};

export type TeamdayReviewWithSession = TeamdayReviewRecord & {
  sessionTitle: string;
  sessionSubtitle: string | null;
};

function normaliseComment(comment?: string) {
  if (!comment) {
    return null;
  }
  const trimmed = comment.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function createTeamdayReviews(input: CreateTeamdayReviewInput): Promise<TeamdayReviewRecord[]> {
  const payload = createReviewSchema.parse(input);

  if (!payload.entries.some((entry) => entry.rating > 0)) {
    throw new Error("Minstens één beoordeling vereist");
  }

  const program = await getTeamdayProgram();
  const validSessionIds = new Set(program.sessions.map((session) => session.id));

  const dedupedEntries = new Map<string, { rating: number; comment: string | null }>();
  for (const entry of payload.entries) {
    if (!validSessionIds.has(entry.sessionKey)) {
      throw new Error("Onbekend sessieonderdeel geselecteerd");
    }
    if (entry.rating < 1 || entry.rating > 5) {
      throw new Error("Ongeldige beoordeling");
    }
    dedupedEntries.set(entry.sessionKey, {
      rating: entry.rating,
      comment: normaliseComment(entry.comment ?? undefined),
    });
  }

  if (!dedupedEntries.size) {
    throw new Error("Geen geldige sessies geselecteerd");
  }

  await ensureTeamdayProgramSeed();
  const programRecord = await prisma.teamdayProgram.findUnique({
    where: { slug: TEAMDAY_PROGRAM_SLUG },
    select: { id: true },
  });

  // Find teamday session if slug is provided
  let teamdaySessionId: string | null = null;
  if (payload.sessionSlug) {
    const session = await prisma.teamdaySession.findUnique({
      where: { slug: payload.sessionSlug },
      select: { id: true },
    });
    teamdaySessionId = session?.id ?? null;
  }

  const creations = Array.from(dedupedEntries.entries()).map(([sessionKey, entry]) =>
    prisma.teamdayReview.create({
      data: {
        sessionKey,
        reviewerName: payload.reviewerName,
        rating: entry.rating,
        comment: entry.comment,
        programId: programRecord?.id ?? null,
        teamdaySessionId,
      },
    })
  );

  try {
    const results = await prisma.$transaction(creations);
    return results.map((review) => ({
      id: review.id,
      sessionKey: review.sessionKey,
      reviewerName: review.reviewerName,
      rating: review.rating,
      comment: review.comment,
      reviewedAt: review.reviewedAt,
      programId: review.programId,
      status: review.status as TeamdayReviewStatus,
    }));
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new Error("Review-opslag is nog niet beschikbaar. Voer eerst de database-migratie uit.");
    }
    throw error;
  }
}

export async function getTeamdayReviewsBySession(sessionKeys: string[]): Promise<Record<string, TeamdayReviewRecord[]>> {
  if (sessionKeys.length === 0) {
    return {};
  }

  let reviews: TeamdayReviewRecord[] = [];
  try {
    reviews = await prisma.teamdayReview.findMany({
      where: {
        sessionKey: { in: sessionKeys }
      },
      orderBy: { reviewedAt: "desc" },
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return {};
    }
    throw error;
  }

  const grouped: Record<string, TeamdayReviewRecord[]> = {};

  for (const review of reviews) {
    if (!grouped[review.sessionKey]) {
      grouped[review.sessionKey] = [];
    }
    grouped[review.sessionKey].push({
      id: review.id,
      sessionKey: review.sessionKey,
      reviewerName: review.reviewerName,
      rating: review.rating,
      comment: review.comment,
      reviewedAt: review.reviewedAt,
      programId: review.programId,
      status: review.status as TeamdayReviewStatus,
    });
  }

  return grouped;
}

export async function getRecentTeamdayReviews(limit = 12): Promise<TeamdayReviewWithSession[]> {
  const programPromise = getTeamdayProgram();
  let reviews: TeamdayReviewRecord[] = [];

  try {
    reviews = await prisma.teamdayReview.findMany({
      where: {
        status: "APPROVED",
      },
      orderBy: { reviewedAt: "desc" },
      take: limit,
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      await programPromise;
      return [];
    }
    throw error;
  }

  const program = await programPromise;

  const sessionMap = new Map(program.sessions.map((session) => [session.id, session]));

  return reviews.map((review) => {
    const session = sessionMap.get(review.sessionKey);
    return {
      id: review.id,
      sessionKey: review.sessionKey,
      reviewerName: review.reviewerName,
      rating: review.rating,
      comment: review.comment,
      reviewedAt: review.reviewedAt,
      programId: review.programId,
      status: review.status as TeamdayReviewStatus,
      sessionTitle: session?.title ?? "Onbekend onderdeel",
      sessionSubtitle: session?.subtitle ?? null,
    };
  });
}

function isMissingTableError(error: unknown): boolean {
  return error instanceof PrismaClientKnownRequestError && error.code === "P2021";
}

// Admin functions

export async function getAllTeamdayReviews(): Promise<TeamdayReviewWithSession[]> {
  const programPromise = getTeamdayProgram();
  let reviews: TeamdayReviewRecord[] = [];

  try {
    reviews = await prisma.teamdayReview.findMany({
      orderBy: { reviewedAt: "desc" },
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      await programPromise;
      return [];
    }
    throw error;
  }

  const program = await programPromise;
  const sessionMap = new Map(program.sessions.map((session) => [session.id, session]));

  return reviews.map((review) => {
    const session = sessionMap.get(review.sessionKey);
    return {
      id: review.id,
      sessionKey: review.sessionKey,
      reviewerName: review.reviewerName,
      rating: review.rating,
      comment: review.comment,
      reviewedAt: review.reviewedAt,
      programId: review.programId,
      status: review.status as TeamdayReviewStatus,
      sessionTitle: session?.title ?? "Onbekend onderdeel",
      sessionSubtitle: session?.subtitle ?? null,
    };
  });
}

export async function updateReviewStatus(reviewId: string, status: TeamdayReviewStatus): Promise<TeamdayReviewRecord> {
  try {
    const review = await prisma.teamdayReview.update({
      where: { id: reviewId },
      data: { status },
    });

    return {
      id: review.id,
      sessionKey: review.sessionKey,
      reviewerName: review.reviewerName,
      rating: review.rating,
      comment: review.comment,
      reviewedAt: review.reviewedAt,
      programId: review.programId,
      status: review.status as TeamdayReviewStatus,
    };
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new Error("Review-opslag is nog niet beschikbaar. Voer eerst de database-migratie uit.");
    }
    throw error;
  }
}

export async function updateTeamdayReview(
  reviewId: string,
  data: { reviewerName?: string; rating?: number; comment?: string; sessionKey?: string; reviewedAt?: Date }
): Promise<TeamdayReviewRecord> {
  try {
    const updateData: any = {};

    if (data.reviewerName !== undefined) {
      updateData.reviewerName = data.reviewerName.trim();
    }
    if (data.rating !== undefined) {
      if (data.rating < 1 || data.rating > 5) {
        throw new Error("Ongeldige beoordeling (1-5 sterren)");
      }
      updateData.rating = data.rating;
    }
    if (data.comment !== undefined) {
      updateData.comment = normaliseComment(data.comment);
    }
    if (data.sessionKey !== undefined) {
      updateData.sessionKey = data.sessionKey;
    }
    if (data.reviewedAt !== undefined) {
      updateData.reviewedAt = data.reviewedAt;
    }

    const review = await prisma.teamdayReview.update({
      where: { id: reviewId },
      data: updateData,
    });

    return {
      id: review.id,
      sessionKey: review.sessionKey,
      reviewerName: review.reviewerName,
      rating: review.rating,
      comment: review.comment,
      reviewedAt: review.reviewedAt,
      programId: review.programId,
      status: review.status as TeamdayReviewStatus,
    };
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new Error("Review-opslag is nog niet beschikbaar. Voer eerst de database-migratie uit.");
    }
    throw error;
  }
}

export async function deleteTeamdayReview(reviewId: string): Promise<void> {
  try {
    await prisma.teamdayReview.delete({
      where: { id: reviewId },
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new Error("Review-opslag is nog niet beschikbaar. Voer eerst de database-migratie uit.");
    }
    throw error;
  }
}

export type ReviewAggregateStats = {
  count: number;
  averageRating: number;
};

export async function getApprovedReviewStats(): Promise<ReviewAggregateStats> {
  try {
    const result = await prisma.teamdayReview.aggregate({
      where: { status: "APPROVED" },
      _count: true,
      _avg: { rating: true },
    });

    return {
      count: result._count ?? 0,
      averageRating: result._avg.rating ?? 0,
    };
  } catch (error) {
    if (isMissingTableError(error)) {
      return { count: 0, averageRating: 0 };
    }
    throw error;
  }
}
