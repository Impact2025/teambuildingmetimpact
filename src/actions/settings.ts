"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

const profileSchema = z.object({
  name: z.string().min(2, "Naam moet minimaal 2 tekens bevatten"),
  email: z.string().email("Voer een geldig e-mailadres in"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Huidig wachtwoord is verplicht"),
    newPassword: z.string().min(8, "Nieuw wachtwoord moet minimaal 8 tekens bevatten"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Wachtwoorden komen niet overeen",
    path: ["confirmPassword"],
  });

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateProfile(
  name: string,
  email: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Niet ingelogd" };

  const parsed = profileSchema.safeParse({ name, email });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ongeldige invoer" };
  }

  const existing = await prisma.user.findFirst({
    where: { email: parsed.data.email, NOT: { id: session.user.id } },
  });
  if (existing) return { ok: false, error: "Dit e-mailadres is al in gebruik" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, email: parsed.data.email },
  });

  revalidatePath("/admin/settings");
  return { ok: true };
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Niet ingelogd" };

  const parsed = passwordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ongeldige invoer" };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.hashedPassword) return { ok: false, error: "Gebruiker niet gevonden" };

  const valid = await verifyPassword(parsed.data.currentPassword, user.hashedPassword);
  if (!valid) return { ok: false, error: "Huidig wachtwoord is onjuist" };

  const hashed = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { hashedPassword: hashed },
  });

  return { ok: true };
}
