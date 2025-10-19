import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getAllTeamdayReviews } from "@/lib/teamday-reviews";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  try {
    const reviews = await getAllTeamdayReviews();
    return NextResponse.json({ reviews });
  } catch (error: any) {
    const message = error?.message ?? "Ophalen mislukt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
