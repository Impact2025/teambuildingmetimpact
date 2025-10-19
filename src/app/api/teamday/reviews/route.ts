import { NextRequest, NextResponse } from "next/server";

import {
  createTeamdayReviews,
  getRecentTeamdayReviews,
  getTeamdayReviewsBySession,
  type CreateTeamdayReviewInput,
} from "@/lib/teamday-reviews";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateTeamdayReviewInput;
    const reviews = await createTeamdayReviews(body);
    return NextResponse.json({ reviews }, { status: 201 });
  } catch (error: any) {
    const message = error?.message ?? "Opslaan mislukt";
    const status = message.includes("sessie") ? 400 : 422;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const requestedSessionKeys = searchParams.getAll("sessionKey").filter(Boolean);

  if (requestedSessionKeys.length > 0) {
    const reviewsBySession = await getTeamdayReviewsBySession(requestedSessionKeys);
    return NextResponse.json({ reviews: reviewsBySession });
  }

  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Math.max(1, Math.min(50, Number(limitParam) || 12)) : 12;
  const reviews = await getRecentTeamdayReviews(limit);
  return NextResponse.json({ reviews });
}
