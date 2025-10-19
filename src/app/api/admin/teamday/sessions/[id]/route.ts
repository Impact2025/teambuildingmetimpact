import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { deleteTeamdaySession } from "@/lib/teamday-sessions";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  try {
    await deleteTeamdaySession(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const message = error?.message ?? "Verwijderen mislukt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
