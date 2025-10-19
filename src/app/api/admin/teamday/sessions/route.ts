import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { createTeamdaySession, getAllTeamdaySessions, type CreateTeamdaySessionInput } from "@/lib/teamday-sessions";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  try {
    const sessions = await getAllTeamdaySessions();
    return NextResponse.json({ sessions });
  } catch (error: any) {
    const message = error?.message ?? "Ophalen mislukt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CreateTeamdaySessionInput;
    const newSession = await createTeamdaySession(body);
    return NextResponse.json({ session: newSession }, { status: 201 });
  } catch (error: any) {
    const message = error?.message ?? "Aanmaken mislukt";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
