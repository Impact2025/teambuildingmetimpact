import { getQuoteRequests } from "@/lib/quotes";

const goalLabels: Record<string, string> = {
  verbinding: "Verbinding",
  communicatie: "Communicatie",
  plezier: "Plezier",
  impact: "Maatschappelijke impact",
};

const activityLabels: Record<string, string> = {
  buiten: "Buiten",
  binnen: "Binnen",
  advies: "Advies gewenst",
};

const locationLabels: Record<string, string> = {
  "bij-ons": "Bij ons",
  "externe-locatie": "Externe locatie",
  "nog-te-bepalen": "Nog te bepalen",
};

const dateFormatter = new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" });

function formatGoals(value?: string | null) {
  if (!value) return "-";
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => goalLabels[item] ?? item)
    .join(", ");
}

function formatActivity(value?: string | null) {
  if (!value) return "-";
  return activityLabels[value] ?? value;
}

function formatLocation(value?: string | null) {
  if (!value) return "-";
  return locationLabels[value] ?? value;
}

export default async function AdminQuotesPage() {
  const requests = await getQuoteRequests();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Offertes</p>
        <h1 className="text-2xl font-semibold text-neutral-900">Binnengekomen aanvragen</h1>
        <p className="text-sm text-neutral-500">
          Aanvragen worden automatisch opgeslagen, ook wanneer e-mails door de mailprovider worden geweigerd.
          Hier vind je alle details om direct contact op te nemen.
        </p>
      </header>

      {requests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-10 text-center text-sm text-neutral-500">
          Nog geen offerte-aanvragen ontvangen.
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <article
              key={request.id}
              className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Aanvrager</p>
                  <h2 className="text-lg font-semibold text-neutral-900">{request.name}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600">
                    <a href={`mailto:${request.email}`} className="text-[#006D77] underline">
                      {request.email}
                    </a>
                    {request.phone ? (
                      <a href={`tel:${request.phone}`} className="text-neutral-600">
                        {request.phone}
                      </a>
                    ) : null}
                    {request.company ? <span>{request.company}</span> : null}
                  </div>
                </div>
                <div className="text-xs text-neutral-500">
                  {dateFormatter.format(request.createdAt)}
                </div>
              </div>

              <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Deelnemers</dt>
                  <dd className="text-sm text-neutral-700">{request.participantCount ?? "-"}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Voorkeur datum</dt>
                  <dd className="text-sm text-neutral-700">{request.datePreference ?? "-"}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Locatie</dt>
                  <dd className="text-sm text-neutral-700">{formatLocation(request.locationOption)}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Doelen</dt>
                  <dd className="text-sm text-neutral-700">{formatGoals(request.goals)}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Activiteit</dt>
                  <dd className="text-sm text-neutral-700">{formatActivity(request.activityType)}</dd>
                </div>
              </dl>

              {request.notes ? (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Opmerkingen</p>
                  <p className="mt-2 whitespace-pre-wrap">{request.notes}</p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
