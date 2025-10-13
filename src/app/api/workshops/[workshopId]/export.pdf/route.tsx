import { NextRequest } from "next/server";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";

import { requireAdmin } from "@/actions/helpers";
import { prisma } from "@/lib/prisma";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "#1f2933",
  },
  heading: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 700,
  },
  subheading: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 4,
    fontWeight: 600,
  },
  paragraph: {
    marginBottom: 8,
    lineHeight: 1.4,
  },
  sessionCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d2d6dc",
    padding: 12,
    marginBottom: 12,
  },
  bold: {
    fontWeight: 600,
  },
  tagList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  tag: {
    fontSize: 10,
    backgroundColor: "#f1f5f9",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 12,
    marginRight: 4,
    marginTop: 4,
  },
});

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

  const report = workshop.aiReports[0] ?? null;

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>{workshop.title}</Text>
        <Text style={styles.paragraph}>
          Datum: {workshop.date.toLocaleDateString("nl-NL")}
        </Text>
        {workshop.description ? (
          <Text style={styles.paragraph}>{workshop.description}</Text>
        ) : null}

        <Text style={styles.subheading}>Sessies</Text>
        {workshop.sessions.map((session, index) => (
          <View key={session.id} style={styles.sessionCard}>
            <Text style={styles.bold}>
              {index + 1}. {session.title}
            </Text>
            <Text style={styles.paragraph}>{session.assignmentMarkdown}</Text>
            {session.facilitatorNotes ? (
              <Text style={styles.paragraph}>Notities: {session.facilitatorNotes}</Text>
            ) : null}
            {session.uploads.length ? (
              <View>
                <Text style={styles.bold}>Uploads</Text>
                {session.uploads.map((upload) => (
                  <View key={upload.id}>
                    <Text style={styles.paragraph}>
                      • {upload.title ?? "Naamloos"} — {upload.notes ?? "Geen notities"}
                    </Text>
                    {upload.tags.length ? (
                      <View style={styles.tagList}>
                        {upload.tags.map((tag) => (
                          <Text key={tag} style={styles.tag}>
                            #{tag}
                          </Text>
                        ))}
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))}

        {report ? (
          <View>
            <Text style={styles.subheading}>AI Samenvatting</Text>
            <Text style={styles.paragraph}>{report.summary}</Text>
            <Text style={styles.bold}>Metaforen</Text>
            <Text style={styles.paragraph}>{report.metaphors.join(", ")}</Text>
            <Text style={styles.bold}>Midjourney Prompts</Text>
            {(report.prompts as any[]).map((prompt, index) => (
              <Text key={index} style={styles.paragraph}>
                {index + 1}. {prompt.prompt}
              </Text>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);
  const bytes = new Uint8Array(buffer);
  const fileName = `${slugify(workshop.title)}.pdf`;

  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${fileName}`,
    },
  });
}
