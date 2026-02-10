import { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "LEGO® Serious Play | Teambuilding met Impact",
  description: "Ontdek LEGO® Serious Play: bouw aan inzicht, verbinding en innovatie met deze krachtige methode voor teamontwikkeling.",
  keywords: ["LEGO Serious Play", "LSP", "teamontwikkeling", "innovatie", "strategie", "samenwerking", "facilitator"],
};

export default function LspPage() {
  return (
    <main className="bg-neutral-50 text-neutral-900">
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-collaboration.png')" }}
          />
          <div className="absolute inset-0 bg-neutral-950/70" />
        </div>
        <div className="relative mx-auto flex min-h-[50vh] w-full max-w-6xl flex-col justify-center gap-6 px-6 pb-24 pt-32 sm:px-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "LEGO® Serious Play" },
            ]}
            className="text-white/60 [&_a]:text-white/60 [&_a:hover]:text-accent"
          />
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">LEGO® Serious Play</h1>
          <p className="max-w-2xl text-lg text-white/80">
            Bouw aan inzicht, verbinding en innovatie
          </p>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-neutral-900">LEGO® Serious Play</h2>
            <p className="text-lg font-semibold text-neutral-700">
              LEGO® Serious Play (LSP) is geen kinderspel — het is een krachtige methode om complexe vraagstukken te verkennen, 
              samenwerking te versterken en creativiteit te stimuleren.
            </p>
            <p>
              Door letterlijk te bouwen met je handen, denken teams op een dieper niveau na, delen ze meer perspectieven en 
              komen ze sneller tot gezamenlijke inzichten.
            </p>
            
            <h2 className="mt-10 text-3xl font-semibold text-neutral-900">Waarom LEGO® Serious Play?</h2>
            <p>
              Soms blijven gesprekken aan de oppervlakte. Iedereen heeft ideeën, maar de usual suspects praten het meest. 
              Met LSP komt ieders stem letterlijk op tafel. Door te bouwen in plaats van alleen te praten, activeer je zowel 
              hoofd als hart — en ontdek je patronen, waarden en oplossingen die anders verborgen blijven.
            </p>
            
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">LSP helpt teams om:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                  <span>gezamenlijke visies en strategieën te verkennen</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                  <span>vertrouwen en begrip te versterken</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                  <span>creatieve oplossingen te ontwikkelen voor echte uitdagingen</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                  <span>betrokkenheid te vergroten en besluitvorming te versnellen</span>
                </li>
              </ul>
            </div>
            
            <h2 className="mt-10 text-3xl font-semibold text-neutral-900">Hoe werkt het?</h2>
            <p>
              Een gecertificeerde facilitator begeleidt de groep stap voor stap door een aantal bouwopdrachten. Iedereen bouwt 
              eerst individueel, deelt zijn of haar verhaal en vervolgens worden de bouwwerken verbonden tot een gemeenschappelijk model.
            </p>
            <p>
              De kracht zit in de metaforen: het bouwwerk staat symbool voor iemands ideeën, waarden of visie. Zo ontstaat een rijk, 
              gedeeld beeld van de werkelijkheid — tastbaar, visueel en betekenisvol.
            </p>
            
            <h2 className="mt-10 text-3xl font-semibold text-neutral-900">Voor wie?</h2>
            <p>
              LEGO® Serious Play is ideaal voor:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                <span>teams die strategische of culturele veranderingen doormaken</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                <span>organisaties die meer samenwerking en vertrouwen willen opbouwen</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                <span>leiderschapsteams die richting en visie willen scherpstellen</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                <span>groepen die op zoek zijn naar energie en vernieuwing in hun samenwerking</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-3xl border border-accent/40 bg-accent-soft/80 p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-900">Resultaat</h3>
              <div className="mt-4 space-y-4">
                <p className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                  <span>Meer openheid en verbinding in het team</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                  <span>Heldere inzichten en gezamenlijke richting</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                  <span>Een concrete vertaling van ideeën naar actie</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                  <span>En natuurlijk: veel plezier en creativiteit onderweg</span>
                </p>
              </div>
            </div>
            
            <div className="rounded-3xl border border-accent/40 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-900">Praktisch</h3>
              <div className="mt-4 space-y-4">
                <p className="flex items-start gap-3">
                  <span className="font-semibold">Duur:</span>
                  <span>2 tot 4 uur (afhankelijk van het doel en de groepsgrootte)</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="font-semibold">Locatie:</span>
                  <span>in-company of op een inspirerende externe locatie</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="font-semibold">Groepsgrootte:</span>
                  <span>6 – 20 personen (grotere groepen in overleg)</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="font-semibold">Begeleiding:</span>
                  <span>gecertificeerde LEGO® Serious Play facilitator</span>
                </p>
              </div>
            </div>
            
            <div className="rounded-3xl border border-[#006D77] bg-[#006D77] p-8 text-white shadow-sm">
              <h3 className="text-xl font-semibold">Klaar om samen te bouwen?</h3>
              <p className="mt-4 text-white/90">
                Wil je ontdekken wat LEGO® Serious Play voor jouw team kan betekenen?
              </p>
              <Link
                href="#contact"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#006D77] transition hover:bg-neutral-100"
              >
                Neem contact met ons op
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}