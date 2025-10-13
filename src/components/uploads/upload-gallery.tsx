import Image from "next/image";

type UploadItem = {
  id: string;
  title: string | null;
  notes: string | null;
  tags: string[];
  url: string;
  createdAt: Date;
};

type SessionWithUploads = {
  id: string;
  title: string;
  uploads: UploadItem[];
};

type UploadGalleryProps = {
  sessions: SessionWithUploads[];
};

export function UploadGallery({ sessions }: UploadGalleryProps) {
  if (sessions.every((session) => session.uploads.length === 0)) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/70 p-10 text-center text-sm text-neutral-500">
        Nog geen uploads beschikbaar. Voeg foto&rsquo;s toe per sessie om een gallerij op te bouwen.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sessions.map((session) => (
        <section key={session.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-900">{session.title}</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">
              {session.uploads.length} uploads
            </span>
          </div>
          {session.uploads.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-500">
              Nog geen foto&rsquo;s toegevoegd voor deze sessie.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {session.uploads.map((upload) => (
                <figure
                  key={upload.id}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
                >
                  <Image
                    src={upload.url}
                    alt={upload.title ?? "Bouwwerk"}
                    width={600}
                    height={450}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="space-y-2 p-4 text-sm text-neutral-600">
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {upload.title ?? "Naamloos bouwwerk"}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {upload.createdAt.toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {upload.notes ? <p>{upload.notes}</p> : null}
                    {upload.tags.length ? (
                      <ul className="flex flex-wrap gap-2 text-xs text-neutral-500">
                        {upload.tags.map((tag) => (
                          <li key={tag} className="rounded-full bg-neutral-100 px-3 py-1">
                            #{tag}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
