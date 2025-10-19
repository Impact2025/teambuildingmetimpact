import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onze missie | Teambuilding met Impact",
  description: "Ontdek onze missie: teams sterker maken door samen impact te creëren. Leer hoe wij teambuilding combineren met maatschappelijke betekenis voor blijvende verandering.",
  keywords: [
    "missie",
    "teambuilding met impact",
    "maatschappelijke impact",
    "teamontwikkeling",
    "duurzame teambuilding",
    "creatieve werkvormen",
    "LEGO Serious Play"
  ],
  alternates: {
    canonical: "https://www.teambuildingmetimpact.nl/missie",
  },
  openGraph: {
    title: "Onze missie | Teambuilding met Impact",
    description: "Ontdek onze missie: teams sterker maken door samen impact te creëren. Leer hoe wij teambuilding combineren met maatschappelijke betekenis voor blijvende verandering.",
    url: "https://www.teambuildingmetimpact.nl/missie",
    siteName: "Teambuilding met Impact",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onze missie | Teambuilding met Impact",
    description: "Ontdek onze missie: teams sterker maken door samen impact te creëren.",
  },
};

export default function MissionPage() {
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
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Onze missie</h1>
          <p className="max-w-2xl text-lg text-white/80">
            Teams sterker maken door samen impact te creëren – op de samenwerking binnen het team én op de wereld daarbuiten.
          </p>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-neutral-900">Waarom we doen wat we doen</h2>
            <p>
              Teambuilding met Impact is geboren uit de overtuiging dat teams het beste groeien wanneer ze samenwerking 
              combineren met betekenis. We geloven dat échte teamontwikkeling niet los staat van de wereld om ons heen, 
              maar juist verbonden is met maatschappelijke impact.
            </p>
            <p>
              Onze missie is om teams sterker te maken door samen impact te creëren – zowel op de samenwerking binnen het 
              team als op de wereld daarbuiten. We doen dit door bedrijven te verbinden aan maatschappelijke projecten en 
              creatieve werkvormen zoals LEGO® Serious Play.
            </p>
            
            <h2 className="mt-10 text-3xl font-semibold text-neutral-900">Hoe we onze missie vervullen</h2>
            <p>
              We starten altijd met jullie doelen: meer verbinding, betere communicatie of juist meer energie en creativiteit? 
              Vanuit die vraag ontwerpen we een programma dat past bij jullie team en organisatie.
            </p>
            <p>
              Tijdens de dag staat samenwerking centraal. Jullie gaan niet alleen aan de slag met elkaar, maar ook met een 
              concreet project waar anderen iets aan hebben. Zo ontstaat er een ervaring die plezier geeft én betekenisvol is.
            </p>
            
            <div className="mt-8 rounded-3xl border border-accent/40 bg-accent-soft/80 p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-900">Ons unieke aanbod</h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                  <span><strong>Maatwerk aanpak:</strong> Elk programma is volledig op maat gemaakt voor jouw team en doelen</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                  <span><strong>Maatschappelijke connectie:</strong> Samenwerking met sociale organisaties en initiatieven</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                  <span><strong>Meetbare impact:</strong> We laten zien wat de dag concreet heeft opgeleverd</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-deep" />
                  <span><strong>Creatieve methodes:</strong> LEGO® Serious Play en andere innovatieve werkvormen</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-3xl border border-accent/40 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-900">Onze belofte</h3>
              <p className="mt-4 text-neutral-700">
                Wij geloven dat teambuilding pas echt waardevol is als het méér oplevert dan alleen een leuke dag.
              </p>
              <p className="mt-3 text-neutral-700">
                Onze missie is om teams sterker te maken door samen impact te creëren – op de samenwerking binnen het team 
                én op de wereld daarbuiten.
              </p>
            </div>
            
            <div className="rounded-3xl border border-accent/40 bg-[#006D77] p-8 text-white shadow-sm">
              <h3 className="text-xl font-semibold">Duurzame impact</h3>
              <p className="mt-4 text-white/90">
                Wat ons onderscheidt? We maken impact meetbaar. Na afloop laten we zien wat de dag concreet heeft opgeleverd 
                – voor jullie team én voor de mensen of organisaties die jullie geholpen hebben.
              </p>
              <p className="mt-3 text-white/90">
                Elk programma is volledig maatwerk. We stemmen locatie, activiteiten en intensiteit af op jullie teamdynamiek 
                en werken het liefst samen met plekken met een verhaal: sociale ondernemingen, zorginstellingen of 
                maatschappelijke initiatieven die extra aandacht verdienen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}