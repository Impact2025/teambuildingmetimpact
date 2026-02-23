import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PARTNER_LOGOS } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Programma's | Teambuilding met Impact",
  description: "Ontdek onze unieke programma's die raken én verbinden voor betekenisvolle teambuilding. Creatieve werkvormen met maatschappelijke impact die blijven hangen.",
  keywords: [
    "programma's",
    "teambuilding",
    "creatieve werkvormen",
    "LEGO Serious Play",
    "maatschappelijke impact",
    "teamontwikkeling",
    "bedrijfsuitje",
    "maatwerk"
  ],
  alternates: {
    canonical: "https://www.teambuildingmetimpact.nl/programmas",
  },
  openGraph: {
    title: "Programma's | Teambuilding met Impact",
    description: "Ontdek onze unieke programma's die raken én verbinden voor betekenisvolle teambuilding. Creatieve werkvormen met maatschappelijke impact die blijven hangen.",
    url: "https://www.teambuildingmetimpact.nl/programmas",
    siteName: "Teambuilding met Impact",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Programma's | Teambuilding met Impact",
    description: "Ontdek onze unieke programma's die raken én verbinden voor betekenisvolle teambuilding.",
  },
};

const programs = [
  {
    icon: "🍽️",
    title: "Aan tafel en in gesprek",
    tagline: "Verbinding via gesprek en een gezonde maaltijd",
    description:
      "Ontmoet mensen die je normaal nooit spreekt: ouderen, jongeren of een andere bijzondere doelgroep. Samen eten opent gesprekken die anders nooit zouden plaatsvinden. Jullie team kookt en serveert – en plukt de vruchten van een dag vol warmte en verbinding.",
    audience: "Teams die bewuster willen samenwerken en oog willen hebben voor de ander",
    duration: "Halve dag (3–4 uur) of hele dag (6–8 uur)",
  },
  {
    icon: "🔨",
    title: "Handen uit de mouwen",
    tagline: "Samen iets betekenen voor de lokale gemeenschap",
    description:
      "Of het nu gaat om het opknappen van een speeltuin, het helpen bij een voedselbank of het ondersteunen van een sportvereniging – jullie pakken écht iets aan. Teambuilding waarbij de resultaten zichtbaar zijn en het voldoening geeft om terug te kijken.",
    audience: "Teams die hands-on willen bijdragen en trots naar huis willen gaan",
    duration: "Halve dag (3–4 uur) of hele dag (6–8 uur)",
  },
  {
    icon: "🌿",
    title: "Natuurlijk goed en lekker bezig",
    tagline: "Buiten werken, wandelen en de natuur versterken",
    description:
      "Nederland heeft prachtige natuur – en die heeft jullie hulp nodig. Denk aan landschapsbeheer, bomen planten of een wandeling gecombineerd met een maatschappelijk project. Buiten zijn geeft energie, en samenwerken in de natuur haalt het beste in een team naar boven.",
    audience: "Teams die van buiten zijn houden en rust en ruimte zoeken",
    duration: "Halve dag (3–4 uur) of hele dag (6–8 uur)",
  },
  {
    icon: "🚶",
    title: "Ga op stap en neem mee",
    tagline: "Begeleid een bijzondere groep op een onvergetelijke uitstap",
    description:
      "Neem mensen mee die zelden de kans krijgen om ergens naartoe te gaan: bewoners van een zorginstelling, cliënten van een dagbesteding of andere bijzondere groepen. Samen naar de dierentuin, een museum of gewoon lekker buiten. Jullie aandacht en aanwezigheid maken het verschil.",
    audience: "Teams met een warm hart voor zorg en kwetsbare doelgroepen",
    duration: "Halve dag (3–4 uur) of hele dag (6–8 uur)",
  },
];

const faqs = [
  {
    question: "Wat is maatschappelijke teambuilding?",
    answer: "Maatschappelijke teambuilding combineert teamontwikkeling met een bijdrage aan de samenleving. Jullie team werkt samen aan een project dat anderen helpt, waardoor je niet alleen de onderlinge band versterkt maar ook concrete impact maakt.",
  },
  {
    question: "Hoeveel deelnemers kunnen meedoen?",
    answer: "Onze programma's zijn geschikt voor groepen van 8 tot 150 deelnemers. Voor grotere groepen maken we maatwerk mogelijk door meerdere activiteiten parallel te organiseren.",
  },
  {
    question: "Hoe lang duurt een teambuilding programma?",
    answer: "Een standaard programma duurt een halve dag (3-4 uur) of een hele dag (6-8 uur). We kunnen ook meerdaagse trajecten verzorgen voor diepgaandere teamontwikkeling.",
  },
  {
    question: "Wat kost een teambuilding met impact?",
    answer: "De kosten hangen af van het aantal deelnemers, de duur en het type programma. Vraag vrijblijvend een offerte aan voor een prijsindicatie op maat.",
  },
  {
    question: "Kunnen jullie ook LEGO® Serious Play sessies verzorgen?",
    answer: "Ja, onze gecertificeerde LEGO® Serious Play facilitator begeleidt sessies waarbij teams met LEGO-steentjes werken aan strategie, samenwerking en innovatie. Dit kan als losstaande workshop of als onderdeel van een teamdag.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function ProgramsPage() {
  return (
    <main className="bg-neutral-50 text-neutral-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/programs-background.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-neutral-950/70" />
        </div>
        <div className="relative mx-auto flex min-h-[50vh] w-full max-w-6xl flex-col justify-center gap-6 px-6 pb-24 pt-32 sm:px-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Programma\u2019s" },
            ]}
            className="text-white/60 [&_a]:text-white/60 [&_a:hover]:text-accent"
          />
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Onze programma&#39;s</h1>
          <p className="max-w-2xl text-lg text-white/80">
            Vier programmatypen, één gemeenschappelijk doel: teams sterker maken door samen impact te creëren op plekken met een verhaal.
          </p>
        </div>
      </section>

      {/* Vier programmakaarten */}
      <section className="border-b border-neutral-200 bg-white py-20">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
          <div className="mb-12 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">Altijd maatwerk</p>
            <h2 className="text-3xl font-semibold text-neutral-900">Vier manieren om impact te maken</h2>
            <p className="max-w-3xl text-neutral-600">
              Elk programma is volledig afgestemd op jullie team, doelen en de locatie. We werken bij voorkeur op plekken met een verhaal: sociale ondernemingen, zorginstellingen of maatschappelijke initiatieven.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {programs.map((program) => (
              <div
                key={program.title}
                className="flex flex-col rounded-3xl border border-neutral-200 bg-neutral-50 p-8 shadow-sm"
              >
                <div className="mb-4 text-4xl" aria-hidden="true">{program.icon}</div>
                <h3 className="text-xl font-semibold text-neutral-900">{program.title}</h3>
                <p className="mt-1 text-sm font-medium text-brand">{program.tagline}</p>
                <p className="mt-4 text-sm text-neutral-600 leading-relaxed">{program.description}</p>
                <div className="mt-6 space-y-2 border-t border-neutral-200 pt-4">
                  <p className="text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-700">Doelgroep:</span> {program.audience}
                  </p>
                  <p className="text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-700">Duur:</span> {program.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LSP kaart */}
      <section className="border-b border-neutral-200 bg-accent-soft/60 py-20">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
          <div className="flex flex-col gap-8 rounded-3xl border border-accent/40 bg-white p-8 shadow-sm lg:flex-row lg:items-center lg:gap-12">
            <div className="flex-1 space-y-4">
              <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                Nieuw in 2025
              </span>
              <h2 className="text-2xl font-semibold text-neutral-900">LEGO® Serious Play sessies</h2>
              <p className="text-neutral-600">
                Naast onze maatschappelijke programma&#39;s bieden we nu ook LEGO® Serious Play aan. Een bewezen methode waarbij teams met LEGO-steentjes werken aan strategie, cultuur en samenwerking. Vincent van Munster is gecertificeerd facilitator en begeleidt jullie stap voor stap.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3 text-sm text-neutral-700">
                  <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-accent-deep" />
                  <span>Geschikt voor 6–20 personen, 2–4 uur</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-700">
                  <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-accent-deep" />
                  <span>Ideaal voor strategiesessies, teamreflectie of cultuurverandering</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-700">
                  <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-accent-deep" />
                  <span>Combineerbaar met een maatschappelijk programma op dezelfde dag</span>
                </li>
              </ul>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/lsp"
                className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-brand-dark"
              >
                Meer over LSP →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners balk */}
      <section className="border-b border-neutral-200 bg-white py-12">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">
            Impact maken we o.a. met
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {PARTNER_LOGOS.map((logo) => (
              <div
                key={logo.src}
                className="flex h-14 w-28 items-center justify-center rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={100}
                  height={48}
                  className="max-h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-neutral-50 py-20">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">
              Veelgestelde vragen
            </p>
            <h2 className="text-3xl font-semibold text-neutral-900">
              FAQ over teambuilding met impact
            </h2>
          </div>
          <div className="mt-10 space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-neutral-200 bg-white p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-neutral-900">
                  {faq.question}
                  <span className="ml-4 text-accent-deep transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm text-neutral-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
          <div className="flex flex-col gap-6 rounded-3xl border border-neutral-200 bg-neutral-50 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-neutral-900">Klaar voor een teamdag met impact?</h2>
              <p className="text-sm text-neutral-600">
                Doorloop de stappen en ontvang binnen 24 uur een vrijblijvende offerte op maat.
              </p>
            </div>
            <Link
              href="/#contact"
              className="inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-brand-dark"
            >
              Vraag een offerte aan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
