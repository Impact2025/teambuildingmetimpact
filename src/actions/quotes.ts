"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";

const quoteRequestSchema = z.object({
  name: z.string().min(2, "Naam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  company: z.string().optional(),
  phone: z.string().optional(),
  participantCount: z.number().int().min(1).max(500).optional(),
  datePreference: z.string().optional(),
  locationOption: z.enum(["bij-ons", "externe-locatie", "nog-te-bepalen"]),
  goals: z.array(z.enum(["verbinding", "communicatie", "plezier", "impact"])).min(1),
  activityType: z.enum(["buiten", "binnen", "advies"]),
  notes: z.string().optional(),
  privacyAccepted: z.boolean().refine((value) => value, "Privacybeleid moet worden geaccepteerd"),
});

type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export type QuoteRequestResult =
  | { status: "success" }
  | { status: "error"; message: string };

function formatGoals(values: QuoteRequestInput["goals"]) {
  const mapping: Record<QuoteRequestInput["goals"][number], string> = {
    verbinding: "Verbinding",
    communicatie: "Communicatie",
    plezier: "Plezier",
    impact: "Maatschappelijke impact",
  };
  return values.map((value) => mapping[value]).join(", ");
}

function formatActivity(value: QuoteRequestInput["activityType"]) {
  switch (value) {
    case "buiten":
      return "Buiten";
    case "binnen":
      return "Binnen";
    case "advies":
      return "Advies gewenst";
    default:
      return value;
  }
}

function formatLocation(value: QuoteRequestInput["locationOption"]) {
  switch (value) {
    case "bij-ons":
      return "Bij ons";
    case "externe-locatie":
      return "Externe locatie";
    case "nog-te-bepalen":
      return "Nog te bepalen";
    default:
      return value;
  }
}

async function sendNotificationEmails(data: QuoteRequestInput) {
  const notifyEmail = process.env.QUOTE_REQUEST_NOTIFY_EMAIL ?? "hello@teambuildingmetimpact.nl";

  const summaryHtml = `
    <h2>Nieuwe offerte-aanvraag</h2>
    <p><strong>Naam:</strong> ${data.name}</p>
    <p><strong>E-mail:</strong> ${data.email}</p>
    ${data.company ? `<p><strong>Bedrijf:</strong> ${data.company}</p>` : ""}
    ${data.phone ? `<p><strong>Telefoon:</strong> ${data.phone}</p>` : ""}
    ${data.participantCount ? `<p><strong>Aantal deelnemers:</strong> ${data.participantCount}</p>` : ""}
    ${data.datePreference ? `<p><strong>Datum/periode:</strong> ${data.datePreference}</p>` : ""}
    <p><strong>Locatie:</strong> ${formatLocation(data.locationOption)}</p>
    <p><strong>Doelen:</strong> ${formatGoals(data.goals)}</p>
    <p><strong>Type activiteit:</strong> ${formatActivity(data.activityType)}</p>
    ${data.notes ? `<p><strong>Opmerkingen:</strong><br/>${data.notes.replace(/\n/g, "<br/>")}</p>` : ""}
  `;

  const summaryText = `Nieuwe offerte-aanvraag\n\nNaam: ${data.name}\nE-mail: ${data.email}${
    data.company ? `\nBedrijf: ${data.company}` : ""
  }${data.phone ? `\nTelefoon: ${data.phone}` : ""}${
    data.participantCount ? `\nAantal deelnemers: ${data.participantCount}` : ""
  }${data.datePreference ? `\nDatum/periode: ${data.datePreference}` : ""}\nLocatie: ${formatLocation(
    data.locationOption
  )}\nDoelen: ${formatGoals(data.goals)}\nType activiteit: ${formatActivity(data.activityType)}${
    data.notes ? `\n\nOpmerkingen:\n${data.notes}` : ""
  }`;

  try {
    await sendMail({
      to: notifyEmail,
      subject: `Nieuwe offerte-aanvraag - ${data.name}`,
      html: summaryHtml,
      text: summaryText,
    });
  } catch (error) {
    console.warn("[Quote] Notificatiemail kon niet worden verzonden", error);
  }

  try {
    await sendMail({
      to: data.email,
      subject: "Bedankt voor jullie aanvraag",
      html: `
      <h2>Bedankt voor jullie aanvraag!</h2>
      <p>We nemen binnen 24 uur contact met je op om de impactvolle teambuilding te plannen.</p>
      <p><strong>Samenvatting</strong></p>
      <ul>
        <li><strong>Doelen:</strong> ${formatGoals(data.goals)}</li>
        <li><strong>Type activiteit:</strong> ${formatActivity(data.activityType)}</li>
        ${data.participantCount ? `<li><strong>Aantal deelnemers:</strong> ${data.participantCount}</li>` : ""}
      </ul>
      <p>Heb je tussentijds vragen? Mail ons via <a href="mailto:${notifyEmail}">${notifyEmail}</a>.</p>
    `,
      text: `Bedankt voor jullie aanvraag! We nemen binnen 24 uur contact op.\n\nDoelen: ${formatGoals(
        data.goals
      )}\nType activiteit: ${formatActivity(data.activityType)}${
        data.participantCount ? `\nAantal deelnemers: ${data.participantCount}` : ""
      }`,
    });
  } catch (error) {
    console.warn("[Quote] Bevestigingsmail kon niet worden verzonden", error);
  }
}

export async function submitQuoteRequestAction(input: QuoteRequestInput): Promise<QuoteRequestResult> {
  try {
    const parsed = quoteRequestSchema.parse(input);

    await prisma.quoteRequest.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        company: parsed.company,
        phone: parsed.phone,
        participantCount: parsed.participantCount,
        datePreference: parsed.datePreference,
        locationOption: parsed.locationOption,
        goals: parsed.goals.join(","),
        activityType: parsed.activityType,
        notes: parsed.notes,
        privacyAccepted: parsed.privacyAccepted,
      },
    });

    try {
      await sendNotificationEmails(parsed);
    } catch (mailError) {
      console.warn("[Quote] Email versturen mislukt", mailError);
    }

    return { status: "success" };
  } catch (error) {
    console.error("[Quote] submitQuoteRequestAction failed", error);
    if (error instanceof z.ZodError) {
      return { status: "error", message: error.issues[0]?.message ?? "Ongeldige invoer" };
    }
    if (error instanceof Error) {
      return { status: "error", message: error.message };
    }
    return { status: "error", message: "Onbekende fout" };
  }
}
