import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Teambuilding Impact Meten met IctusGo | GPS Teambuilding Platform",
  description:
    "IctusGo maakt de impact van je maatschappelijke teamdag automatisch meetbaar. Via GPS-routes, checkpoints en een automatisch gegenereerd impactrapport zie je precies wat jullie bijdrage heeft betekend.",
  keywords: [
    "teambuilding impact meten",
    "IctusGo teambuilding",
    "GPS teambuilding platform",
    "maatschappelijke teamdag rapportage",
    "impactrapport teambuilding",
    "aantoonbare teamdag",
  ],
  alternates: {
    canonical: "https://www.teambuildingmetimpact.nl/ictusgo",
  },
  openGraph: {
    title: "Teambuilding Impact Meten met IctusGo | GPS Teambuilding Platform",
    description:
      "IctusGo maakt de impact van je maatschappelijke teamdag automatisch meetbaar. Via GPS-routes, checkpoints en een automatisch gegenereerd impactrapport zie je precies wat jullie bijdrage heeft betekend.",
    url: "https://www.teambuildingmetimpact.nl/ictusgo",
    siteName: "Teambuilding met Impact",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teambuilding Impact Meten met IctusGo | GPS Teambuilding Platform",
    description:
      "IctusGo maakt de impact van je maatschappelijke teamdag automatisch meetbaar. Via GPS-routes, checkpoints en een automatisch gegenereerd impactrapport.",
  },
};

const steps = [
  {
    number: "01",
    title: "Deelnemers gaan op pad via GPS-routes",
    description:
      "Teams vertrekken met hun smartphone en volgen een op maat gemaakte GPS-route door de omgeving. Onderweg ontdekken ze locaties, opdrachten en bijdrages die zijn gekoppeld aan het maatschappelijk doel van de dag.",
  },
  {
    number: "02",
    title: "Checkpoints registreren elke bijdrage",
    description:
      "Op elk checkpoint scannen deelnemers een QR-code of voltooien een opdracht. Elke actie wordt direct geregistreerd: hoeveel dozen ingepakt, hoeveel minuten hulp verleend, hoeveel kilometer gelopen. Transparant en traceerbaar.",
  },
  {
    number: "03",
    title: "Platform genereert automatisch impactrapport",
    description:
      "Na afloop bundelt IctusGo alle data in een professioneel impactrapport. Uitgesplitst per deelnemer, per team en per activiteit — klaar om te delen met management, partners of stakeholders.",
  },
];

const reportMetrics = [
  { label: "Vrijwilligersuren ingezet", value: "38 uur" },
  { label: "Deelnemers actief", value: "24 personen" },
  { label: "Checkpoints voltooid", value: "96 / 96" },
  { label: "Dozen ingepakt", value: "340 stuks" },
  { label: "Maatschappelijke partner", value: "Voedselbank" },
  { label: "Teamtevredenheid", value: "4,8 / 5,0" },
];

const partnerLogos = [
  { src: "/images/partner-voedselbank.jpg", alt: "Voedselbank" },
  { src: "/images/partner-meerwaarde.gif", alt: "MeerWaarde" },
  { src: "/images/partner-ons-tweede-thuis.png", alt: "Ons Tweede Thuis" },
  { src: "/images/partner-gemeente-haarlemmermeer.png", alt: "Gemeente Haarlemmermeer" },
  { src: "/images/partner-rabobank.png", alt: "Rabobank" },
];

const ictusgoJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Teambuilding Impact Meten met IctusGo",
  url: "https://www.teambuildingmetimpact.nl/ictusgo",
  description:
    "IctusGo is een GPS teambuilding platform dat de maatschappelijke impact van een teamdag automatisch meet en rapporteert.",
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "IctusGo",
    applicationCategory: "BusinessApplication",
    description:
      "GPS teambuilding platform dat via checkpoints bijdragen registreert en automatisch een impactrapport genereert.",
    url: "https://www.ictusgo.nl",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wat is IctusGo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IctusGo is een GPS-gebaseerd teambuilding platform waarmee deelnemers via een smartphone-route langs checkpoints gaan. Elke bijdrage wordt automatisch geregistreerd en gebundeld in een impactrapport.",
      },
    },
    {
      "@type": "Question",
      name: "Hoe wordt de teambuilding impact gemeten?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Deelnemers registreren bijdragen op checkpoints via QR-codes. Het platform telt alle acties op — uren, producten, kilometers — en genereert na afloop automatisch een gedetailleerd impactrapport.",
      },
    },
    {
      "@type": "Question",
      name: "Welke organisaties werken al met IctusGo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IctusGo is al ingezet bij teams die samenwerken met de Voedselbank, MeerWaarde, Ons Tweede Thuis, Gemeente Haarlemmermeer en Rabobank.",
      },
    },
  ],
};

export default function IctusGoPage() {
  return (
    <main className="bg-neutral-50 text-neutral-900">
      <script
        id="ictusgo-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ictusgoJsonLd) }}
      />
      <script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-collaboration.png"
            alt="Teamleden op pad tijdens een GPS teambuilding route met IctusGo"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-neutral-950/75" />
        </div>
        <div className="relative mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-32 sm:px-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-900 shadow-sm">
              IctusGo Platform
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Teambuilding impact meten — automatisch en aantoonbaar
            </h1>
            <p className="max-w-2xl text-lg text-white/80">
              Met IctusGo weet je na elke maatschappelijke teamdag precies wat jullie hebben bijgedragen. Deelnemers volgen GPS-routes, registreren bijdragen via checkpoints en het platform genereert automatisch een professioneel impactrapport.
            </p>
            <p className="max-w-2xl text-lg text-white/70">
              Geen gedoe met Excel-sheets. Geen geschatte cijfers. Gewoon een helder rapport dat laat zien wat de dag écht heeft opgeleverd.
            </p>
            <div className="flex flex-wrap gap-4 pt-1">
              <a
                href="mailto:hello@teambuildingmetimpact.nl?subject=Voorbeeldrapport IctusGo aanvragen"
                className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-brand-dark"
              >
                Vraag een voorbeeldrapport op
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:border-accent hover:bg-white/10"
              >
                Plan een demo
              </Link>
            </div>
          </div>
          <div className="w-full max-w-md space-y-6 rounded-3xl border border-accent/40 bg-white/10 p-8 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">
              Waarom impact meten?
            </p>
            <p className="text-lg font-semibold">
              MVO-coördinatoren en HR-managers willen aantonen wat een teamdag oplevert — voor het team én voor de samenleving.
            </p>
            <p className="text-sm text-white/70">
              IctusGo geeft jou de data om intern te verantwoorden én extern te communiceren. Concreet, betrouwbaar en automatisch gegenereerd na elke dag.
            </p>
          </div>
        </div>
      </section>

      {/* Hoe het werkt */}
      <section className="border-b border-neutral-200 bg-white py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 sm:px-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">
              GPS teambuilding platform
            </p>
            <h2 className="text-3xl font-semibold text-neutral-900">
              Zo werkt IctusGo in 3 stappen
            </h2>
            <p className="max-w-3xl text-neutral-600">
              Van vertrek tot rapport: IctusGo begeleidt deelnemers via hun smartphone door de dag en registreert automatisch elke bijdrage die het team levert.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-8 shadow-sm"
              >
                <span className="text-5xl font-semibold text-accent">
                  {step.number}
                </span>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voorbeeld impactrapport */}
      <section className="relative isolate overflow-hidden py-20 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/programs-background.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-neutral-950/85" />
        </div>
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 sm:px-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Maatschappelijke teamdag rapportage
            </p>
            <h2 className="text-3xl font-semibold">
              Een echt impactrapport — automatisch gegenereerd door IctusGo
            </h2>
            <p className="max-w-3xl text-white/70">
              Dit is hoe een IctusGo-rapport eruitziet na een dag bij de Voedselbank. Alle cijfers komen rechtstreeks uit de registraties van deelnemers — geen schattingen, geen handmatig invoeren.
            </p>
          </div>

          {/* Mock rapport */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:p-10">
            <div className="mb-8 flex flex-col gap-2 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                  Impactrapport
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  Teamdag Voedselbank Haarlemmermeer
                </p>
                <p className="text-sm text-white/60">
                  Gegenereerd via IctusGo · 14 maart 2025
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Alle checkpoints voltooid
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reportMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-brand/30 p-6">
              <p className="text-sm font-semibold text-accent">Samenvatting van de dag</p>
              <p className="mt-2 text-sm text-white/75">
                Het team van 24 personen heeft in totaal 38 vrijwilligersuren ingezet voor de Voedselbank Haarlemmermeer. Via 8 GPS-checkpoints werden 340 dozen ingepakt en gesorteerd voor gezinnen in de regio. De deelnemers waardeerden de dag gemiddeld met een 4,8. Dit rapport is automatisch samengesteld op basis van de geregistreerde data in IctusGo.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-white/40">
                Gegenereerd door IctusGo · ictusgo.nl
              </p>
              <a
                href="mailto:hello@teambuildingmetimpact.nl?subject=Voorbeeldrapport IctusGo aanvragen"
                className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-brand-dark"
              >
                Ontvang jouw voorbeeldrapport
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="border-b border-neutral-200 bg-white py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 sm:px-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">
              Vertrouwd door vooraanstaande organisaties
            </p>
            <h2 className="text-3xl font-semibold text-neutral-900">
              IctusGo draait al bij deze partners
            </h2>
            <p className="max-w-3xl text-neutral-600">
              Van voedselbanken tot gemeenten en grote werkgevers — organisaties die begrijpen dat een maatschappelijke teamdag aantoonbaar resultaat moet opleveren, kiezen voor IctusGo.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {partnerLogos.map((logo) => (
              <div
                key={logo.src}
                className="flex h-24 items-center justify-center rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={140}
                  height={70}
                  className="max-h-14 w-auto object-contain"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-accent/40 bg-accent-soft/80 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-deep">
                Voedselbank
              </p>
              <p className="mt-3 text-sm text-neutral-600">
                Teams pakken en sorteren voedselpakketten. IctusGo registreert het aantal dozen, de bestede tijd en het aantal actieve deelnemers per checkpoint.
              </p>
            </div>
            <div className="rounded-3xl border border-accent/40 bg-accent-soft/80 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-deep">
                Gemeente Haarlemmermeer
              </p>
              <p className="mt-3 text-sm text-neutral-600">
                Gemeentelijke teams gebruiken IctusGo om buurtactiviteiten te documenteren en intern te rapporteren over maatschappelijke inzet van medewerkers.
              </p>
            </div>
            <div className="rounded-3xl border border-accent/40 bg-accent-soft/80 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-deep">
                Rabobank
              </p>
              <p className="mt-3 text-sm text-neutral-600">
                Rabobank-teams leveren bewijs voor hun MVO-beleid met een automatisch rapport dat concrete uren, activiteiten en bereik laat zien per deelnemer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 sm:px-10 lg:flex-row lg:gap-16">
          <div className="lg:w-80 lg:flex-shrink-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">
              Veelgestelde vragen
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-neutral-900">
              Alles over IctusGo
            </h2>
            <p className="mt-4 text-sm text-neutral-600">
              Heb je een andere vraag? Neem direct contact op via{" "}
              <a
                href="mailto:hello@teambuildingmetimpact.nl"
                className="text-brand underline"
              >
                hello@teambuildingmetimpact.nl
              </a>
              .
            </p>
          </div>
          <div className="flex-1 divide-y divide-neutral-200">
            <div className="py-6">
              <h3 className="text-base font-semibold text-neutral-900">
                Wat is IctusGo?
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                IctusGo is een GPS-gebaseerd teambuilding platform waarmee deelnemers via hun smartphone langs checkpoints gaan. Elke bijdrage wordt automatisch geregistreerd en gebundeld in een impactrapport dat je kunt delen met management, HR of externe partners.
              </p>
            </div>
            <div className="py-6">
              <h3 className="text-base font-semibold text-neutral-900">
                Hoe wordt de impact precies gemeten?
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Deelnemers registreren bijdragen op checkpoints via QR-codes of opdrachten in de app. Het platform telt alle acties op — uren, producten, kilometers, aantallen — en genereert na afloop automatisch een gedetailleerd rapport zonder handmatig invoeren.
              </p>
            </div>
            <div className="py-6">
              <h3 className="text-base font-semibold text-neutral-900">
                Voor welke groepsgroottes werkt IctusGo?
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                IctusGo werkt voor kleine teams van 10 personen tot grote bedrijfsdagen met 200+ deelnemers. Het platform schaalt mee en geeft per deelnemer, per team én voor de totale groep inzicht in de bijdrage.
              </p>
            </div>
            <div className="py-6">
              <h3 className="text-base font-semibold text-neutral-900">
                Kunnen we het rapport gebruiken voor ons MVO-jaarverslag?
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Absoluut. Het IctusGo-rapport is opgemaakt als een professioneel document met concrete cijfers, uitgesplitst naar activiteit en deelnemersniveau. Ideaal als bijlage bij je MVO-rapportage of intern communicatiemateriaal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="rapport-aanvragen" className="bg-brand py-20 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 sm:px-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Klaar om impact aantoonbaar te maken?
            </p>
            <h2 className="text-3xl font-semibold">
              Vraag een voorbeeldrapport op
            </h2>
            <p className="max-w-xl text-white/75">
              Wil je zien hoe een IctusGo-rapport eruitziet voor jouw organisatie? Stuur ons een bericht en we sturen je binnen 24 uur een voorbeeldrapport toe — inclusief toelichting op hoe het platform werkt.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:hello@teambuildingmetimpact.nl?subject=Voorbeeldrapport IctusGo aanvragen&body=Hallo,%0A%0AIk ben geïnteresseerd in een voorbeeldrapport van IctusGo.%0A%0AMijn naam:%0AMijn organisatie:%0AGroepsgrootte (indicatief):%0A%0AMet vriendelijke groet,"
                className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-900 transition hover:bg-accent/90"
              >
                Vraag een voorbeeldrapport op
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:border-accent hover:bg-white/10"
              >
                Offerte aanvragen
              </Link>
            </div>
          </div>
          <div className="w-full max-w-md space-y-5 rounded-3xl border border-accent/40 bg-white/5 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Wat je ontvangt
            </p>
            <ul className="space-y-3">
              {[
                "Een echt impactrapport als voorbeeld",
                "Uitleg over hoe IctusGo werkt bij jouw type dag",
                "Indicatie van kosten en mogelijkheden",
                "Binnen 24 uur in je inbox",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/75">
                  <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="border-t border-white/10 pt-5 text-sm text-white/50">
              <p className="font-semibold text-white/70">Contact</p>
              <p className="mt-1">hello@teambuildingmetimpact.nl</p>
              <p className="mt-1">06 144 70977</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
