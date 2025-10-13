import { NextRequest } from "next/server";

import { requireAdmin } from "@/actions/helpers";
import { prisma } from "@/lib/prisma";

function toCsvRow(values: (string | number | null | undefined)[]) {
  return values
    .map((value) => {
      if (value === null || value === undefined) return "";
      const text = value.toString().replace(/"/g, '""');
      return `"${text}"`;
    })
    .join(",");
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export async function GET(
  request: NextRequest,
  { params }: { params: { workshopId: string } }
) {
  await requireAdmin();

  const workshop = await prisma.workshop.findUnique({
    where: { id: params.workshopId },
    include: {
      sessions: {
        orderBy: { order: "asc" },
        include: {
          uploads: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
      aiReports: {
        orderBy: { generatedAt: "desc" },
        take: 1,
      },
    },
  });

  if (!workshop) {
    return new Response("Workshop niet gevonden", { status: 404 });
  }

  const rows: string[] = [];
  rows.push(toCsvRow(["Workshop", workshop.title]));
  rows.push(toCsvRow(["Datum", workshop.date.toISOString()]));
  rows.push("");
  rows.push(toCsvRow(["Sessies"]));
  rows.push(toCsvRow(["Volgorde", "Titel", "Opdracht", "Bouwtijd (sec)", "Bespreektijd (sec)", "Notities"]));

  workshop.sessions.forEach((session, index) => {
    rows.push(
      toCsvRow([
        index + 1,
        session.title,
        session.assignmentMarkdown,
        session.buildDurationSec,
        session.discussDurationSec,
        session.facilitatorNotes ?? "",
      ])
    );

    if (session.uploads.length) {
      rows.push(toCsvRow(["", "Uploads"]));
      rows.push(toCsvRow(["", "Titel", "Tags", "Notities"]));
      session.uploads.forEach((upload) => {
        rows.push(
          toCsvRow([
            "",
            upload.title ?? "Naamloos",
            upload.tags.join(" | "),
            upload.notes ?? "",
          ])
        );
      });
    }
    rows.push("");
  });

  if (workshop.aiReports[0]) {
    rows.push(toCsvRow(["AI Samenvatting"]));
    rows.push(toCsvRow([workshop.aiReports[0].summary]));
    rows.push("");
    rows.push(toCsvRow(["Metaforen", workshop.aiReports[0].metaphors.join(" | ")]));
  }

  const csv = rows.join("\n");
  const fileName = `${slugify(workshop.title)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${fileName}`,
    },
  });
}
