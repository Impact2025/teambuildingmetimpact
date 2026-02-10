import Image from "next/image";
import Link from "next/link";

import { getLatestBlogs } from "@/lib/blogs";
import { getRecentTeamdayReviews } from "@/lib/teamday-reviews";
import { QuoteWizard } from "@/components/marketing/quote-wizard";

export const metadata = {
  title: "Teambuilding met Impact | Betekenisvolle Teambuilding en LEGO® Serious Play",
  description: "Samen bouwen aan sterke teams én een betere wereld. Maatschappelijke teambuilding met LEGO® Serious Play voor blijvende impact en verbinding binnen je team.",
  keywords: [
    "teambuilding",
    "LEGO Serious Play",
    "maatschappelijke impact",
    "teamontwikkeling",
    "bedrijfsuitje",
    "creatieve werkvormen",
    "teamcohesie",
    "sociale verantwoordelijkheid bedrijven"
  ],
  alternates: {
    canonical: "https://www.teambuildingmetimpact.nl/",
  },
  openGraph: {
    title: "Teambuilding met Impact | Betekenisvolle Teambuilding en LEGO® Serious Play",
    description: "Samen bouwen aan sterke teams én een betere wereld. Maatschappelijke teambuilding met LEGO® Serious Play voor blijvende impact en verbinding binnen je team.",
    url: "https://www.teambuildingmetimpact.nl/",
    siteName: "Teambuilding met Impact",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teambuilding met Impact | Betekenisvolle Teambuilding en LEGO® Serious Play",
    description: "Samen bouwen aan sterke teams én een betere wereld. Maatschappelijke teambuilding met LEGO® Serious Play voor blijvende impact en verbinding binnen je team.",
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

const legoBenefits = [
  "Diepgang – complexe vraagstukken worden zichtbaar en tastbaar",
  "Verbinding – iedereen draagt gelijkwaardig bij en bouwt mee",
  "Creativiteit & impact – doen in plaats van praten versnelt nieuwe ideeën",
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Teambuilding met Impact",
  url: "https://www.teambuildingmetimpact.nl",
  logo: "https://www.teambuildingmetimpact.nl/favicon.ico",
  sameAs: [
    "https://www.linkedin.com/company/teambuilding-met-impact/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+31-6-14470977",
    contactType: "sales",
    areaServed: "NL",
    availableLanguage: ["Dutch"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "Website",
  name: "Teambuilding met Impact",
  url: "https://www.teambuildingmetimpact.nl",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.teambuildingmetimpact.nl/blog?zoek={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

function formatReviewDate(date: Date) {
  return new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium" }).format(date);
}

export default async function Home() {
  const [latestBlogs, recentReviews] = await Promise.all([
    getLatestBlogs(),
    getRecentTeamdayReviews(3),
  ]);
  return (
    <main className="bg-neutral-50 text-neutral-900">
      <script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-collaboration.png')" }}
          />
          <div className="absolute inset-0 bg-neutral-950/70" />
        </div>
        <div className="relative mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-32 sm:px-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-900 shadow-sm">
              Teambuilding met Impact
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Samen bouwen aan sterke teams én een betere wereld
            </h1>
            <p className="max-w-2xl text-lg text-white/80">
              Een teamdag kan méér zijn dan gezellig samen zijn. We combineren teamontwikkeling met maatschappelijke betekenis. Geen standaard uitje, maar een ervaring waarbij jullie samenwerken, plezier maken én bijdragen aan een concreet goed doel.
            </p>
            <p className="max-w-2xl text-lg text-white/70">
              Zo groeit niet alleen de verbinding binnen je team, maar ook de impact die je samen maakt.
            </p>
            <div className="flex flex-wrap gap-4 pt-1">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-xl bg-[#006D77] px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-accent-deep"
              >
                Vraag een gratis offerte aan
              </Link>
              <Link
                href="/viewer"
                className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:border-accent hover:bg-white/10"
              >
                LEGO® SERIOUS PLAY® Viewer
              </Link>
            </div>
          </div>
          <div className="w-full max-w-md space-y-6 rounded-3xl border border-accent/40 bg-white/10 p-8 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">
              Onze belofte
            </p>
            <p className="text-lg font-semibold">
              Wij geloven dat teambuilding pas echt waardevol is als het méér oplevert dan alleen een leuke dag.
            </p>
            <p className="text-sm text-white/70">
              Onze missie is om teams sterker te maken door samen impact te creëren – op de samenwerking binnen het team én op de wereld daarbuiten.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-neutral-900">Onze missie</h2>
            <p>
              Door bedrijven te verbinden aan maatschappelijke projecten en creatieve werkvormen zoals LEGO® Serious Play zorgen we voor dagen die niet alleen inspireren, maar ook blijvende verandering brengen.
            </p>
            <p>
              We starten altijd met jullie doelen: meer verbinding, betere communicatie of juist meer energie en creativiteit? Vanuit die vraag ontwerpen we een programma dat past bij jullie team en organisatie.
            </p>
            <p>
              Tijdens de dag staat samenwerking centraal. Jullie gaan niet alleen aan de slag met elkaar, maar ook met een concreet project waar anderen iets aan hebben. Zo ontstaat er een ervaring die plezier geeft én betekenisvol is.
            </p>
          </div>
          <div className="space-y-4 rounded-3xl border border-accent/40 bg-accent-soft/80 p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-deep">
              Maatschappelijke teambuilding
            </p>
            <p>
              Elk programma is volledig maatwerk. We stemmen locatie, activiteiten en intensiteit af op jullie teamdynamiek en werken het liefst samen met plekken met een verhaal: sociale ondernemingen, zorginstellingen of maatschappelijke initiatieven die extra aandacht verdienen.
            </p>
            <p>
              Wat ons onderscheidt? We maken impact meetbaar. Na afloop laten we zien wat de dag concreet heeft opgeleverd – voor jullie team én voor de mensen of organisaties die jullie geholpen hebben.
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
            <h2 className="text-3xl font-semibold">Programma’s die raken én verbinden</h2>
            <p className="text-white/70 lg:max-w-4xl">
              Met elkaar de handen uit de mouwen steken, creatief aan de slag of samen nieuwe perspectieven ontdekken – elk programma draagt bij aan echte impact voor jullie team én voor de samenleving.
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

      <section className="border-b border-neutral-200 bg-white py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 sm:px-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-semibold text-neutral-900">Waarom kiezen voor Teambuilding met Impact?</h2>
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
              Sinds 2012 bouwen we bruggen tussen teams en maatschappelijke organisaties. Dankzij ons brede netwerk vinden we altijd een project dat écht bij jullie past.
            </p>
            <p className="text-sm text-neutral-600">
              We werken op plekken met een verhaal – waar je niet alleen samenwerkt, maar samen iets achterlaat. Na afloop laten we zien wat jullie inzet concreet heeft opgeleverd, voor jullie team én voor de mensen die jullie geholpen hebben.
            </p>
          </div>
        </div>
      </section>

      {recentReviews.length > 0 ? (
        <section className="relative isolate overflow-hidden py-20 text-white">
          <div className="absolute inset-0">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/images/lego-teambuilding-background.jpg')" }}
            />
            <div className="absolute inset-0 bg-neutral-950/75" />
          </div>
          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 sm:px-10">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Ervaringen uit de praktijk</p>
              <h2 className="text-3xl font-semibold">Reviews per onderdeel van de teamdag</h2>
              <p className="text-sm text-white/70 lg:max-w-3xl">
                Na afloop vragen we deelnemers om per sessie sterren uit te delen. Zo houden we scherp wat goed werkt en waar we kunnen verbeteren.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {recentReviews.map((review) => (
                <article
                  key={review.id}
                  className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/10"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-white">{review.reviewerName}</p>
                        <p className="text-xs text-white/60">{formatReviewDate(review.reviewedAt)}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xl" aria-label={`${review.rating} van 5 sterren`}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span
                            key={index}
                            aria-hidden="true"
                            className={index < review.rating ? "text-amber-400" : "text-white/20"}
                          >
                            ★
                          </span>
                        ))}
                        <span className="sr-only">{review.rating} van 5 sterren</span>
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                      {review.sessionTitle}
                    </div>
                    {review.comment ? (
                      <p className="text-sm text-white/75">{review.comment}</p>
                    ) : (
                      <p className="text-sm italic text-white/50">Geen toelichting gegeven.</p>
                    )}
                  </div>
                  {review.sessionSubtitle ? (
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">{review.sessionSubtitle}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[#006D77] py-20 text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[3fr_2fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Over Vincent
            </p>
            <h2 className="text-3xl font-semibold">Vincent van Munster</h2>
            <div className="space-y-4 text-white/70">
              <p>
                Ik ben Vincent van Munster, oprichter van Teambuilding met Impact. Het concept ontstond uit het idee om teambuildingactiviteiten te verbinden aan plekken met een verhaal, plekken die ik sinds 2012 wekelijks ontdek tijdens mijn reis als sociaal ondernemer.
              </p>
              <p>
                Iedere locatie vertelt iets unieks over samenwerking, veerkracht en betekenis. Die verhalen gebruik ik om teams te inspireren en om verbinding te creëren die verder gaat dan één leuke dag.
              </p>
              <p>
                In 2025 werd ik gecertificeerd LEGO® Serious Play facilitator. Naast het verbinden van activiteiten aan plekken met een verhaal begeleid ik nu ook sessies waarin teams met LEGO-steentjes hun ideeën, uitdagingen en ambities letterlijk bouwen. Met deze methode help ik teams complexe vraagstukken zichtbaar en tastbaar te maken, en samen tot inzichten te komen die echt blijven hangen.
              </p>
              <p>
                Of het nu gaat om strategie, cultuur of samenwerking – ik geloof dat leren pas impact heeft als het wordt ervaren, gevoeld en gedeeld.
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
                  Mijn favoriete manier om gesprekken te starten? Samen een kop biologische thee drinken, luisteren naar de verhalen van het team en ontdekken waar we het verschil kunnen maken.
                </p>
                <p className="mt-4 text-white/60">
                  Laten we samen bouwen aan meer betekenis, creativiteit en verbinding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {latestBlogs.length > 0 ? (
        <section className="border-b border-neutral-200 bg-white py-20">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 sm:px-10">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">Laatste blogs</p>
                <h2 className="text-3xl font-semibold text-neutral-900">Inspiratie voor betekenisvolle teambuilding</h2>
                <p className="text-sm text-neutral-600 lg:max-w-3xl">
                  Verhalen, inzichten en tips om teams te verbinden via LEGO® Serious Play en maatschappelijke impact.
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-xl border border-[#006D77] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#006D77] transition hover:bg-[#006D77] hover:text-white"
              >
                Bekijk alle blogs
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {latestBlogs.map((blog) => {
                const summary = blog.excerpt
                  ? blog.excerpt
                  : blog.content.replace(/#+\s?/g, "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim().slice(0, 160);

                return (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="group flex h-full flex-col justify-between rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:border-[#006D77]/50 hover:shadow-md overflow-hidden"
                  >
                    {blog.coverImage ? (
                      <div className="relative h-48 w-full overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <h3 className="absolute bottom-4 left-4 right-4 text-lg font-semibold text-white line-clamp-2">
                          {blog.title}
                        </h3>
                      </div>
                    ) : (
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-neutral-900">{blog.title}</h3>
                      </div>
                    )}
                    <div className="space-y-3 p-6 pt-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">
                        {new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium" }).format(blog.publishedAt ?? blog.createdAt)}
                      </p>
                      <p className="text-sm text-neutral-600 line-clamp-3">{summary}{summary.length >= 160 ? "..." : ""}</p>
                      <span className="mt-2 inline-flex items-center text-xs font-semibold uppercase tracking-[0.3em] text-[#006D77]">
                        Lees verder →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section id="contact" className="bg-white py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[3fr_2fr] lg:items-start">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">Maak het verschil</p>
            <h2 className="text-3xl font-semibold text-neutral-900">Willen jullie een teambuilding die écht impact maakt?</h2>
            <p className="text-neutral-700">
              Doorloop de stappen en ontvang binnen 24 uur een vrijblijvende offerte.
            </p>
            <QuoteWizard />
          </div>
          <div className="space-y-6 rounded-3xl border border-accent/40 bg-accent-soft/80 p-8 text-sm text-neutral-600 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">
              Onderdeel van WeAreImpact
            </p>
            <p>
              Teambuilding met Impact is onderdeel van <a href="https://weareimpact.nl/" target="_blank" rel="noopener noreferrer" className="text-[#006D77] underline">WeAreImpact</a>,
              die organisaties, teams en individuen helpt om meer betekenis te geven aan hun werk en samenwerking.
            </p>
            <p>
              We geloven dat échte impact ontstaat wanneer goede bedoelingen worden omgezet in tastbare resultaten. Door strategie en uitvoering te verbinden brengen we energie, beweging en betrokkenheid in teams – met effecten die voelbaar zijn voor mensen én gemeenschappen.
            </p>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-neutral-800">Telefoon</p>
                <p>06 144 70977</p>
              </div>
              <div>
                <p className="font-semibold text-neutral-800">Mail</p>
                <p>hello@teambuildingmetimpact.nl</p>
              </div>
              <div>
                <p className="font-semibold text-neutral-800">Adres</p>
                <p>Luzernestraat 43 | 2153 GM Nieuw-Vennep</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
