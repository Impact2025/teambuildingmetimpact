import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Over ons | Teambuilding met Impact",
  description: "Leer meer over Teambuilding met Impact, onze visie, missie, kernwaarden en oprichter Vincent van Munster. Ontdek hoe wij teams sterker maken door samen impact te creëren.",
  keywords: [
    "over ons",
    "teambuilding met impact",
    "vincent van munster",
    "visie",
    "missie",
    "kernwaarden",
    "maatschappelijke impact",
    "teamontwikkeling"
  ],
  alternates: {
    canonical: "https://www.teambuildingmetimpact.nl/over-ons",
  },
  openGraph: {
    title: "Over ons | Teambuilding met Impact",
    description: "Leer meer over Teambuilding met Impact, onze visie, missie, kernwaarden en oprichter Vincent van Munster. Ontdek hoe wij teams sterker maken door samen impact te creëren.",
    url: "https://www.teambuildingmetimpact.nl/over-ons",
    siteName: "Teambuilding met Impact",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Over ons | Teambuilding met Impact",
    description: "Leer meer over Teambuilding met Impact, onze visie, missie, kernwaarden en oprichter Vincent van Munster.",
  },
};

export default function AboutPage() {
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
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Over Teambuilding met Impact</h1>
          <p className="max-w-2xl text-lg text-white/80">
            Wij geloven dat teambuilding pas echt waardevol is als het méér oplevert dan alleen een leuke dag.
          </p>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-neutral-900">Onze visie</h2>
            <p>
              Teambuilding met Impact is opgericht met een krachtige visie: teams sterker maken door samen impact te creëren – 
              zowel op de samenwerking binnen het team als op de wereld daarbuiten.
            </p>
            <p>
              We streven ernaar om teambuilding te transformeren van een tijdelijke ervaring naar een duurzame krachtbron 
              voor teams en organisaties. Onze aanpak combineert creatieve werkvormen zoals LEGO® Serious Play met 
              maatschappelijke betekenis, waardoor teams niet alleen groeien in verbondenheid maar ook bijdragen aan 
              positieve verandering in de samenleving.
            </p>
            
            <h2 className="mt-10 text-3xl font-semibold text-neutral-900">Onze missie</h2>
            <p>
              Door bedrijven te verbinden aan maatschappelijke projecten en creatieve werkvormen zoals LEGO® Serious Play 
              zorgen we voor dagen die niet alleen inspireren, maar ook blijvende verandering brengen.
            </p>
            <p>
              We starten altijd met jullie doelen: meer verbinding, betere communicatie of juist meer energie en creativiteit? 
              Vanuit die vraag ontwerpen we een programma dat past bij jullie team en organisatie.
            </p>
            <p>
              Tijdens de dag staat samenwerking centraal. Jullie gaan niet alleen aan de slag met elkaar, maar ook met een 
              concreet project waar anderen iets aan hebben. Zo ontstaat er een ervaring die plezier geeft én betekenisvol is.
            </p>
          </div>
          
          <div className="space-y-4 rounded-3xl border border-accent/40 bg-accent-soft/80 p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-deep">
              Onze kernwaarden
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                <span><strong>Betekenis:</strong> Elke activiteit moet impact hebben voor het team én de samenleving</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                <span><strong>Connectie:</strong> Teams verbinden met elkaar en met maatschappelijke doelen</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                <span><strong>Creativiteit:</strong> Innovatieve werkvormen die inzichten opleveren en verbinding creëren</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                <span><strong>Duurzaamheid:</strong> Langetermijnimpact voor teams en maatschappelijke partners</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#006D77] py-20 text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[3fr_2fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Oprichter
            </p>
            <h2 className="text-3xl font-semibold">Vincent van Munster</h2>
            <div className="space-y-4 text-white/70">
              <p>
                Ik ben Vincent van Munster, oprichter van Teambuilding met Impact. Het concept ontstond uit het idee om 
                teambuildingactiviteiten te verbinden aan plekken met een verhaal, plekken die ik sinds 2012 wekelijks ontdek 
                tijdens mijn reis als sociaal ondernemer.
              </p>
              <p>
                Iedere locatie vertelt iets unieks over samenwerking, veerkracht en betekenis. Die verhalen gebruik ik om 
                teams te inspireren en om verbinding te creëren die verder gaat dan één leuke dag.
              </p>
              <p>
                In 2025 werd ik gecertificeerd LEGO® Serious Play facilitator. Naast het verbinden van activiteiten aan 
                plekken met een verhaal begeleid ik nu ook sessies waarin teams met LEGO-steentjes hun ideeën, uitdagingen 
                en ambities letterlijk bouwen. Met deze methode help ik teams complexe vraagstukken zichtbaar en tastbaar 
                te maken, en samen tot inzichten te komen die echt blijven hangen.
              </p>
              <p>
                Of het nu gaat om strategie, cultuur of samenwerking – ik geloof dat leren pas impact heeft als het wordt 
                ervaren, gevoeld en gedeeld.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-accent/40 bg-white/5 p-8 text-sm text-white/80">
            <p className="text-lg font-semibold text-accent">Biologische en sociale thee kruiden</p>
            <div className="mt-4 flex items-start gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-full border-2 border-accent">
                <img 
                  src="/images/Vincent van Munster.png" 
                  alt="Vincent van Munster" 
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs text-white/60 mt-1">Vincent van Munster. Oprichter, impactmaker en LSP facilitator.</p>
                <p className="mt-3">
                  Mijn favoriete manier om gesprekken te starten? Samen een kop biologische thee drinken, luisteren naar de 
                  verhalen van het team en ontdekken waar we het verschil kunnen maken.
                </p>
                <p className="mt-4 text-white/60">
                  Laten we samen bouwen aan meer betekenis, creativiteit en verbinding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
