const SLOT_LINE_REGEX = /^(\d{1,2}:\d{2})\s*(?:–|-)\s*(\d{1,2}:\d{2})\s*\|\s*(.+)$/;

const THEME_COLORS = [
  "#60A5FA",
  "#F97316",
  "#34D399",
  "#F472B6",
  "#A78BFA",
  "#FACC15",
];

type WorkingSegment = {
  startLabel: string;
  endLabel: string;
  startMinutes: number;
  endMinutes: number;
  title: string;
  descriptionLines: string[];
  noteLines: string[];
};

export type ParsedSessionPlan = {
  title: string;
  assignmentMarkdown: string;
  facilitatorNotes?: string;
  buildDurationSec: number;
  discussDurationSec: number;
  themeColor?: string;
};

export function createSessionsFromPlan(planText: string): ParsedSessionPlan[] {
  const segments = parseSegments(planText);

  return segments.map((segment, index) => {
    const totalMinutes = calculateDurationMinutes(
      segment.startMinutes,
      segment.endMinutes
    );
    const { buildSeconds, discussSeconds } = distributeDurations(totalMinutes);

    const assignmentLines: string[] = [
      `**Tijdslot:** ${segment.startLabel} – ${segment.endLabel}`,
    ];

    const assignmentBody = segment.descriptionLines
      .map(formatDescriptionLine)
      .filter(Boolean);

    if (assignmentBody.length > 0) {
      assignmentLines.push("", ...assignmentBody);
    }

    const facilitatorNotes = segment.noteLines
      .map((line) => line.replace(/^💡\s*/, "💡 "))
      .join(" \u2022 ") || undefined;

    return {
      title: segment.title,
      assignmentMarkdown: assignmentLines.join("\n"),
      facilitatorNotes,
      buildDurationSec: buildSeconds,
      discussDurationSec: discussSeconds,
      themeColor: THEME_COLORS[index % THEME_COLORS.length],
    };
  });
}

function parseSegments(planText: string): WorkingSegment[] {
  const lines = planText.split(/\r?\n/);
  const segments: WorkingSegment[] = [];
  let current: WorkingSegment | null = null;

  const flush = () => {
    if (!current) {
      return;
    }

    const durationMinutes = calculateDurationMinutes(
      current.startMinutes,
      current.endMinutes
    );

    if (durationMinutes <= 0) {
      current = null;
      return;
    }

    segments.push({ ...current });
    current = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const slotMatch = SLOT_LINE_REGEX.exec(line);
    if (slotMatch) {
      flush();
      const startLabel = slotMatch[1];
      const endLabel = slotMatch[2];
      const rawTitle = slotMatch[3];

      const startMinutes = parseTimeToMinutes(startLabel);
      const endMinutes = parseTimeToMinutes(endLabel);

      if (startMinutes == null || endMinutes == null) {
        continue;
      }

      current = {
        startLabel,
        endLabel,
        startMinutes,
        endMinutes,
        title: normaliseTitle(rawTitle),
        descriptionLines: [],
        noteLines: [],
      };
      continue;
    }

    if (current) {
      if (line.startsWith("💡")) {
        current.noteLines.push(line);
      } else {
        current.descriptionLines.push(line);
      }
    }
  }

  flush();

  return segments;
}

function parseTimeToMinutes(label: string): number | null {
  const [hours, minutes] = label.split(":");
  const hourNumber = Number(hours);
  const minuteNumber = Number(minutes);
  if (
    Number.isNaN(hourNumber) ||
    Number.isNaN(minuteNumber) ||
    hourNumber < 0 ||
    hourNumber > 23 ||
    minuteNumber < 0 ||
    minuteNumber > 59
  ) {
    return null;
  }
  return hourNumber * 60 + minuteNumber;
}

function calculateDurationMinutes(start: number, end: number): number {
  let duration = end - start;
  if (duration <= 0) {
    duration += 24 * 60;
  }
  return duration;
}

function distributeDurations(totalMinutes: number) {
  const minutes = Math.max(2, Math.round(totalMinutes));
  let buildMinutes = Math.max(1, Math.round(minutes * 0.65));
  let discussMinutes = Math.max(1, minutes - buildMinutes);

  if (buildMinutes + discussMinutes < minutes) {
    buildMinutes += minutes - (buildMinutes + discussMinutes);
  }

  if (buildMinutes + discussMinutes > minutes) {
    const overflow = buildMinutes + discussMinutes - minutes;
    if (buildMinutes > discussMinutes) {
      buildMinutes = Math.max(1, buildMinutes - overflow);
    } else {
      discussMinutes = Math.max(1, discussMinutes - overflow);
    }
  }

  return {
    buildSeconds: buildMinutes * 60,
    discussSeconds: Math.max(60, discussMinutes * 60),
  };
}

function normaliseTitle(raw: string): string {
  return raw
    .replace(/^[0-9]+[\.)\-]\s*/, "")
    .replace(/[“”]/g, '"')
    .trim();
}

function formatDescriptionLine(line: string): string {
  if (!line) {
    return "";
  }

  const bulletMatch = line.match(/^[-*•]\s*(.*)$/);
  if (bulletMatch) {
    return `- ${bulletMatch[1].trim()}`;
  }

  return line;
}
