import { Metadata } from "next";
import Image from "next/image";

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

const experienceHighlights = [
  {
    title: "Aan tafel en in gesprek…",
    description:
      "Met wie zou jij wel eens aan tafel willen zitten? Ouderen, jongeren of een andere doelgroep? Kom met elkaar in gesprek onder het genot van een lekkere en gezonde maaltijd.",
  },
  {
    title: "Handen uit de mouwen",
    description:
      "Met je team iets betekenen voor de lokale voetbalclub of muziekvereniging? Wij regelen het. Een uitje dat je voldoening geeft en waar teambuilding centraal staat.",
  },
  {
    title: "Natuurlijk goed en lekker bezig",
    description:
      "Zet je samen in voor de Nederlandse natuur. Combineer het met een wandeling of excursie en ervaar hoe buiten zijn energie geeft.",
  },
  {
    title: "Ga op stap en neem mee…",
    description:
      "Neem een bijzondere groep mensen mee op stap: naar de dierentuin, een museum of gewoon lekker naar buiten. Jullie aandacht maakt het verschil.",
  },
];

const reasons = [
  "Versterkt teamspirit en werkplezier",
  "Geeft medewerkers trots en zingeving",
  "Verbetert imago en maatschappelijke betrokkenheid",
  "Creëert blijvende herinneringen én concrete maatschappelijke resultaten",
];

const partnerLogos = [
  {
    src: "/images/partner-voedselbank.jpg",
    alt: "Voedselbank partnerlogo",
  },
  {
    src: "/images/partner-meerwaarde.gif",
    alt: "MeerWaarde partnerlogo",
  },
  {
    src: "/images/partner-hq720.png",
    alt: "Impact organisatie partnerlogo",
  },
  {
    src: "/images/partner-rabobank.png",
    alt: "Rabobank partnerlogo",
  },
  {
    src: "/images/partner-gemeente-haarlemmermeer.png",
    alt: "Gemeente Haarlemmermeer partnerlogo",
  },
  {
    src: "/images/partner-ons-tweede-thuis.png",
    alt: "Ons Tweede Thuis partnerlogo",
  },
];

export default function ProgramsPage() {
  return (
    <main className="bg-neutral-50 text-neutral-900">
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: "url('/images/programs-background.png')" }}
          />
          <div className="absolute inset-0 bg-neutral-950/70" />
        </div>
        <div className="relative mx-auto flex min-h-[50vh] w-full max-w-6xl flex-col justify-center gap-6 px-6 pb-24 pt-32 sm:px-10">
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Onze programma&#39;s</h1>
          <p className="max-w-2xl text-lg text-white/80">
            Programma&#39;s die raken én verbinden – voor betekenisvolle teambuilding die blijft hangen.
          </p>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 sm:px-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-semibold text-neutral-900">Waarom kiezen voor onze programma&#39;s?</h2>
            <ul className="space-y-3">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3 text-sm text-neutral-700">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">
                Impact maken we o.a. met
              </p>
              <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                {partnerLogos.map((logo) => (
                  <div
                    key={logo.src}
                    className="flex h-16 w-32 items-center justify-center rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={120}
                      height={60}
                      className="max-h-12 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full max-w-lg space-y-4 rounded-3xl border border-accent/40 bg-accent-soft/80 p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">Wat ons onderscheidt</p>
            <p className="text-lg font-semibold text-neutral-900">Teambuilding die verder gaat dan één dag</p>
            <p className="text-sm text-neutral-600">
              Sinds 2012 bouwen we bruggen tussen teams en maatschappelijke organisaties. Dankzij ons brede netwerk 
              vinden we altijd een project dat écht bij jullie past.
            </p>
            <p className="text-sm text-neutral-600">
              We werken op plekken met een verhaal – waar je niet alleen samenwerkt, maar samen iets achterlaat. 
              Na afloop laten we zien wat jullie inzet concreet heeft opgeleverd, voor jullie team én voor de mensen 
              die jullie geholpen hebben.
            </p>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden py-20 text-white">
        <div className="absolute inset-0">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: "url('/images/programs-background.png')" }}
          />
          <div className="absolute inset-0 bg-neutral-950/80" />
        </div>
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 sm:px-10">
          <div className="space-y-4 text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Altijd maatwerk</p>
            <p className="text-white/70 lg:max-w-4xl">
              Met elkaar de handen uit de mouwen steken, creatief aan de slag of samen nieuwe perspectieven ontdekken – 
              elk programma draagt bij aan echte impact voor jullie team én voor de samenleving.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {experienceHighlights.map((highlight) => (
              <div
                key={highlight.title}
                className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-[#006D77] p-6 shadow-lg shadow-black/30"
              >
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">{highlight.title}</h3>
                  <p className="text-sm text-white/85">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}