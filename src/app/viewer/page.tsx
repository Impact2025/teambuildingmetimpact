import { ViewerLoginForm } from "@/components/viewer/viewer-login-form";

export default function ViewerPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 px-6 py-16 text-white">
      <div className="flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between">
        <section className="max-w-2xl space-y-6 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            LEGO® SERIOUS PLAY® Viewer
          </p>
          <h1 className="text-4xl font-semibold">
            Bekijk de workshop live mee met jouw team
          </h1>
          <p className="text-base text-white/70">
            Met de unieke pincode van vandaag zie je de actuele sessie, resterende tijd
            en instructies. Ideaal voor deelnemers of klanten die meekijken op afstand
            of via de beamer.
          </p>
          <ul className="space-y-2 text-sm text-white/60">
            <li>• Volg de timer in realtime</li>
            <li>• Lees de opdracht van de huidige sessie mee</li>
            <li>• Geen account nodig, alleen de pincode van vandaag</li>
          </ul>
        </section>

        <ViewerLoginForm />
      </div>
    </main>
  );
}
