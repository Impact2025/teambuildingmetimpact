import { NextRequest, NextResponse } from "next/server";

import { getTeamdaySessionBySlug } from "@/lib/teamday-sessions";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getTeamdaySessionBySlug(params.slug);

    if (!session) {
      return NextResponse.json({ error: "Sessie niet gevonden" }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch (error: any) {
    const message = error?.message ?? "Ophalen mislukt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
