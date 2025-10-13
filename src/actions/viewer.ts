"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export type ViewerLoginState = {
  status: "idle" | "error";
  message?: string;
};

export async function verifyViewerPinAction(
  _prevState: ViewerLoginState | undefined,
  formData: FormData
): Promise<ViewerLoginState> {
  const rawPin = formData.get("pin");
  const next = typeof rawPin === "string" ? rawPin.replace(/\s+/g, "") : "";

  if (!next || next.length < 4) {
    return {
      status: "error",
      message: "Voer een geldige pincode in.",
    };
  }

  const workshop = await prisma.workshop.findUnique({
    where: { viewerPin: next },
    select: { id: true },
  });

  if (!workshop) {
    return {
      status: "error",
      message: "Onbekende pincode. Vraag de facilitator om de juiste code.",
    };
  }

  redirect(`/viewer/${next}`);
}
