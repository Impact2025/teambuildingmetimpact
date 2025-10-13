type TimelineSession = {
  id: string;
  title: string;
  buildDurationSec: number;
  discussDurationSec: number;
};

type RunOfShowTimelineProps = {
  sessions: TimelineSession[];
};

export function RunOfShowTimeline({ sessions }: RunOfShowTimelineProps) {
  const phases = sessions.flatMap((session) => [
    {
      id: `${session.id}-build`,
      title: session.title,
      label: "Bouwen",
      durationSec: session.buildDurationSec,
    },
    {
      id: `${session.id}-discuss`,
      title: session.title,
      label: "Bespreken",
      durationSec: session.discussDurationSec,
    },
  ]);

  const totalSec = phases.reduce((total, phase) => total + phase.durationSec, 0);

  if (totalSec === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Run of Show</h2>
        <p className="text-sm text-neutral-500">
          Volgen de tijdlijn tijdens de dag. Segmenten zijn proportioneel aan de duur van de fase.
        </p>
      </div>
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex min-h-[120px] flex-col justify-center gap-2 bg-neutral-50/60 p-6 text-xs text-neutral-500 md:flex-row">
          {phases.map((phase) => {
            const width = `${Math.max((phase.durationSec / totalSec) * 100, 5)}%`;
            const minutes = Math.round(phase.durationSec / 60);

            return (
              <div
                key={phase.id}
                className="flex-grow rounded-2xl bg-white p-4 shadow-sm"
                style={{ flexBasis: width }}
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-neutral-400">
                  {phase.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-neutral-800">{phase.title}</p>
                <p className="text-[0.7rem] text-neutral-500">{minutes} min</p>
              </div>
            );
          })}
        </div>
        <footer className="flex items-center justify-between border-t border-neutral-200 bg-white px-6 py-3 text-xs text-neutral-500">
          <span>Totaal: {Math.round(totalSec / 60)} minuten</span>
          <span>Voorbereiding & pauzes worden later toegevoegd</span>
        </footer>
      </div>
    </section>
  );
}
