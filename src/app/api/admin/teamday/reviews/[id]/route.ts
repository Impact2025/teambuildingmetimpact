import { NextRequest, NextResponse } from "next/server";
import { TeamdayReviewStatus } from "@prisma/client";

import { auth } from "@/auth";
import { updateReviewStatus, updateTeamdayReview, deleteTeamdayReview } from "@/lib/teamday-reviews";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Handle status update
    if (body.status) {
      if (!["PENDING", "APPROVED", "REJECTED"].includes(body.status)) {
        return NextResponse.json({ error: "Ongeldige status" }, { status: 400 });
      }
      const review = await updateReviewStatus(params.id, body.status as TeamdayReviewStatus);
      return NextResponse.json({ review });
    }

    // Handle content update
    const { reviewerName, rating, comment, sessionKey, reviewedAt } = body;
    if (reviewerName === undefined && rating === undefined && comment === undefined && sessionKey === undefined && reviewedAt === undefined) {
      return NextResponse.json({ error: "Geen update data opgegeven" }, { status: 400 });
    }

    const updateData: any = { reviewerName, rating, comment, sessionKey };
    if (reviewedAt) {
      updateData.reviewedAt = new Date(reviewedAt);
    }

    const review = await updateTeamdayReview(params.id, updateData);
    return NextResponse.json({ review });
  } catch (error: any) {
    const message = error?.message ?? "Update mislukt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  try {
    await deleteTeamdayReview(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const message = error?.message ?? "Verwijderen mislukt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
