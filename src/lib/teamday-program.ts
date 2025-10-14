import { z } from "zod";

import { prisma } from "@/lib/prisma";

export const TEAMDAY_PROGRAM_SLUG = "default";

const teamdayMetaSchema = z.object({
  dateLabel: z.string(),
  locations: z.array(z.string()).default([]),
  organisations: z.array(z.string()).default([]),
  facilitator: z.object({
    name: z.string(),
    title: z.string(),
  }),
  playlistUrl: z.string().url(),
});

const teamdayScriptBlockSchema = z.object({
  label: z.string(),
  lines: z.array(z.string()),
});

const teamdayActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  durationSec: z.number().int().positive().optional(),
  description: z.string().optional(),
  prompts: z.array(z.string()).optional(),
  reminders: z.array(z.string()).optional(),
});

const teamdayTimeslotSchema = z.object({
  start: z.string(),
  end: z.string(),
  totalMinutes: z.number().int().positive(),
});

const teamdaySessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  timeslot: teamdayTimeslotSchema,
  location: z.string().optional(),
  attendees: z.array(z.string()).optional(),
  overview: z.array(z.string()).optional(),
  script: z.array(teamdayScriptBlockSchema).optional(),
  activities: z.array(teamdayActivitySchema).optional(),
  transitions: z.array(z.string()).optional(),
  reflection: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
});

const teamdayProgramSchema = z.object({
  meta: teamdayMetaSchema,
  sessions: z.array(teamdaySessionSchema).min(1),
});

export type TeamdayMeta = z.infer<typeof teamdayMetaSchema>;
export type TeamdayScriptBlock = z.infer<typeof teamdayScriptBlockSchema>;
export type TeamdayActivity = z.infer<typeof teamdayActivitySchema>;
export type TeamdaySession = z.infer<typeof teamdaySessionSchema>;
export type TeamdayProgram = z.infer<typeof teamdayProgramSchema>;

export const DEFAULT_TEAMDAY_PROGRAM: TeamdayProgram = {
  meta: {
    dateLabel: "14 oktober",
    locations: [
      "De Wickevoorter Stadsboeren",
      "Nationaal Monument MH17",
      "Wijkcentrum De Boskern – Hoofddorp",
    ],
    organisations: ["Stichting Maatvast", "Teambuilding met Impact"],
    facilitator: {
      name: "Vincent van Munster",
      title: "Gecertificeerd LEGO® Serious Play facilitator",
    },
    playlistUrl:
      "https://open.spotify.com/playlist/6jCfnlF6KQKnitp41I2B2G?si=OCayBiG1RFi74A0K9eJngA&pi=87Rz30wiTDW5I",
  },
  sessions: [
    {
      id: "wickevoorter-welcome",
      title: "De Wickevoorter Stadsboeren – Welkom & rondleiding",
      subtitle: "Aankomst, welkomsttekst en rondleiding door Ada",
      timeslot: {
        start: "13:00",
        end: "14:15",
        totalMinutes: 75,
      },
      location: "De Wickevoorter Stadsboeren",
      attendees: ["Ada", "Martin", "Vincent"],
      overview: [
        "Verwelkom de groep tussen het groen en schets de bedoeling van de dag.",
        "Triggert verbinding met duurzaamheid en gemeenschap als opmaat voor de teamdag.",
        "Laat Ada de rondleiding verzorgen en houd ruimte voor vragen.",
      ],
      script: [
        {
          label: "Welkomsttekst – Vincent",
          lines: [
            "Goedemiddag allemaal, van harte welkom!",
            "Wat fijn om hier samen te zijn, midden tussen het groen bij De Wickevoorter Stadsboeren.",
            "Mijn naam is Vincent van Munster, ik mag jullie vandaag begeleiden tijdens de Teambuilding met Impact-dag.",
            "Vandaag draait om verbinding, inspiratie en samen ontdekken wat impact maken betekent — voor jullie als team én voor de omgeving van Haarlemmermeer.",
            "We beginnen deze middag op een plek die dat perfect belichaamt: een boerderij waar duurzaamheid, gemeenschap en samenwerking hand in hand gaan.",
            "Ik geef nu graag het woord aan [naam van de boer/boerin of gids] van De Wickevoorter Stadsboeren, die jullie meeneemt voor een rondleiding over het terrein en vertelt over het mooie werk dat hier gebeurt.",
          ],
        },
        {
          label: "Afsluittekst – Vincent (14:05)",
          lines: [
            "Dank jullie wel allemaal — en natuurlijk een groot dankjewel aan Ada voor het warme ontvangst en de inspirerende rondleiding.",
            "Wat een mooie start van de dag: even letterlijk zien en voelen wat duurzaamheid en gemeenschapszin betekenen hier in de Haarlemmermeer.",
            "We nemen dat gevoel van verbinding mee naar onze volgende stop: het Nationaal Monument MH17.",
            "Daar nemen we even de tijd voor stilte, reflectie en samen stilstaan bij wat ons als mensen en als gemeenschap raakt.",
            "Pak gerust nog wat water of frisse lucht, dan vertrekken we zo rustig richting Vijfhuizen.",
          ],
        },
      ],
      transitions: [
        "Verzamel de groep bij de uitgang en kondig de verplaatsing naar Vijfhuizen aan.",
        "Zorg dat iedereen iets te drinken heeft en klaar is om te vertrekken.",
      ],
    },
    {
      id: "mh17-monument",
      title: "Nationaal Monument MH17 – Stiltewandeling",
      subtitle: "Reflectie op verbinding, verlies en betekenis",
      timeslot: {
        start: "14:25",
        end: "14:50",
        totalMinutes: 25,
      },
      location: "Nationaal Monument MH17, Vijfhuizen",
      overview: [
        "Introduceer het monument met respect en ruimte voor persoonlijke beleving.",
        "Faciliteer een gezamenlijke stiltewandeling en korte bezinning.",
        "Geen groepsopdracht — laat het moment voor zichzelf spreken.",
      ],
      script: [
        {
          label: "Opening – Vincent",
          lines: [
            "We staan hier op een bijzondere plek.",
            "Een plek van herinnering, maar ook van verbondenheid.",
            "Iedereen beleeft dit moment op zijn eigen manier — neem die ruimte, kijk om je heen, voel wat deze plek met je doet.",
          ],
        },
      ],
      transitions: [
        "Nodig iedereen uit om stil te wandelen en rond te kijken.",
        "Sluit af met een kort dankwoord en kondig vertrek naar De Boskern aan.",
      ],
    },
    {
      id: "boskern-intro",
      title: "De Boskern – Ontvangst & intro door Daphne",
      subtitle: "Kennismaking met Stichting Maatvast",
      timeslot: {
        start: "15:00",
        end: "15:15",
        totalMinutes: 15,
      },
      location: "Wijkcentrum De Boskern",
      overview: [
        "Daphne heet het gezelschap welkom en schetst het belang van De Boskern.",
        "Korte rondleiding door de ruimte en praktische aanwijzingen.",
        "Maak de brug naar het LEGO® Serious Play programma.",
      ],
      script: [
        {
          label: "Intro – Daphne Wijkhuizen",
          lines: [
            "Welkom bij De Boskern! Wat leuk dat jullie hier zijn voor deze bijzondere middag.",
            "De Boskern is meer dan een gebouw — het is een ontmoetingsplek waar de wijk samenkomt.",
            "Even kort over wie we zijn: Stichting Maatvast beheert sociale locaties zoals deze in Hoofddorp.",
            "Ons doel is simpel: ruimte bieden waar mensen elkaar ontmoeten, activiteiten organiseren en samen bouwen aan een levendige buurt.",
            "Hier in De Boskern gebeurt van alles: van koffieochtenden tot taallessen, van buurtinitiatieven tot kinderactiviteiten.",
            "Vandaag gaan jullie zelf ook aan de slag met ‘bouwen’ — maar dan met LEGO! Vincent neemt het zo van me over. Veel plezier!",
          ],
        },
      ],
      transitions: [
        "Rondleiding door de ruimte (5 minuten).",
        "Laat deelnemers plaatsnemen aan tafels en draag over aan Vincent.",
      ],
    },
    {
      id: "skills-check",
      title: "Intro & warming-up – Skills check met LEGO",
      subtitle: "Activatie, ijsbreker en materiaalverkenning",
      timeslot: {
        start: "15:15",
        end: "15:30",
        totalMinutes: 15,
      },
      location: "De Boskern – tafels in groepen",
      overview: [
        "Activeer speelsheid en maak LEGO toegankelijk voor iedereen.",
        "Gebruik korte opdrachten van één minuut om tempo en energie hoog te houden.",
      ],
      script: [
        {
          label: "Opening – Vincent",
          lines: [
            "Welkom bij Bouwpret! Ik ben Vincent, en ik ga jullie begeleiden door een middag waarin we letterlijk gaan bouwen aan verbinding.",
            "Voor je ligt een bakje met LEGO. Sommigen van jullie hebben misschien thuis kinderen die hier de hele dag mee spelen, anderen hebben in geen jaren een LEGO-steentje aangeraakt.",
            "Dat maakt niet uit — iedereen kan dit.",
          ],
        },
      ],
      activities: [
        {
          id: "skills-check-1",
          title: "Opdracht 1 – Bouw iets wat je vanmorgen hebt gedaan",
          durationSec: 60,
          prompts: ["Timer op 1 minuut.", "Laat na afloop 2–3 vrijwilligers delen."],
        },
        {
          id: "skills-check-2",
          title: "Opdracht 2 – Bouw iets waardoor je moet lachen",
          durationSec: 60,
          prompts: [
            "Start opnieuw 1 minuut.",
            "Nodig deelnemers uit om elkaars bouwsels te bekijken.",
            "Benadruk diversiteit in perspectieven.",
          ],
        },
      ],
      notes: [
        "Sluit af met de quote: ‘Iedereen bouwt vanuit zijn eigen perspectief, en alle perspectieven tellen mee.’",
      ],
    },
    {
      id: "happy-object",
      title: "Flash-build – Happy object",
      subtitle: "Positieve energie en verbinding",
      timeslot: {
        start: "15:30",
        end: "15:45",
        totalMinutes: 15,
      },
      location: "De Boskern",
      overview: [
        "Laat iedereen iets bouwen waar ze blij van worden (3 minuten bouwtijd).",
        "Loop langs de modellen in een ‘mini-museum’ en laat iedereen kort delen.",
        "Reflecteer op diversiteit aan energiebronnen binnen het team.",
      ],
      activities: [
        {
          id: "happy-object-build",
          title: "Bouwtijd Happy Object",
          durationSec: 180,
          prompts: [
            "Zet timer op 3 minuten en herinner aan de playlist voor extra sfeer.",
            "Na de timer: organiseer een rondgang waarbij iedereen in 20 seconden deelt.",
          ],
        },
      ],
      notes: [
        "Sluit af met observatie: ‘Diversiteit in wat ons energie geeft, maakt een team sterk.’",
      ],
    },
    {
      id: "obstacle-course",
      title: "Teambouw – De obstakelbaan",
      subtitle: "Samenwerking, creativiteit en plezier",
      timeslot: {
        start: "15:45",
        end: "16:15",
        totalMinutes: 30,
      },
      location: "De Boskern",
      overview: [
        "Verdeel de groep in drie teams en bouw een hindernisbaan van minimaal 50 cm.",
        "Gebruik LEGO-autootjes voor testen en zorg dat iedereen een rol heeft.",
        "Sluit af met reflectie over samenwerking en afspraken.",
      ],
      activities: [
        {
          id: "obstacle-build",
          title: "Bouwfase obstakelbaan",
          durationSec: 12 * 60,
          prompts: [
            "Teams bepalen wie test en wat de grootste uitdaging wordt.",
            "Loop rond, stel vragen, geef energie maar geen oplossingen.",
          ],
        },
        {
          id: "obstacle-test",
          title: "Testfase",
          durationSec: 8 * 60,
          prompts: [
            "Laat elk team eerst eigen baan testen en daarna die van een ander team.",
            "Maak van het testen een feestje met aanmoediging en applaus.",
          ],
        },
        {
          id: "obstacle-reflect",
          title: "Reflectie – Wat maakt een goede hindernisbaan?",
          durationSec: 5 * 60,
          prompts: [
            "Bespreek: samenwerking, afspraken, bijsturen als iets niet werkt.",
            "Koppel inzichten aan dagelijkse praktijk.",
          ],
        },
      ],
      reflection: [
        "Welke baan werkte het best en waarom?",
        "Wat nemen jullie mee naar jullie dagelijkse samenwerking?",
      ],
    },
    {
      id: "connection-tower",
      title: "De toren van verbinding – Finale & reflectie",
      subtitle: "Energieke afsluiter en viering",
      timeslot: {
        start: "16:15",
        end: "16:45",
        totalMinutes: 30,
      },
      location: "De Boskern",
      overview: [
        "Teams bouwen de hoogste en meest originele toren (10 minuten).",
        "Gebruik applausmeter voor originaliteit en meet hoogte voor objectieve score.",
        "Sluit af met reflectievragen, groepsfoto en drie belangrijkste takeaways.",
      ],
      activities: [
        {
          id: "tower-build",
          title: "Bouwfase toren",
          durationSec: 10 * 60,
          prompts: [
            "Loop rond, motiveer en helpt teams hun verhaal te benoemen.",
            "Herinner aan stevigheid: toren moet vrij staan.",
          ],
        },
        {
          id: "tower-jury",
          title: "Jury & presentatie",
          durationSec: 5 * 60,
          prompts: [
            "Teams presenteren in 20 seconden hun concept.",
            "Applausmeter voor originaliteit, meetlint voor hoogte.",
          ],
        },
        {
          id: "tower-reflect",
          title: "Reflectie & afsluiting",
          durationSec: 5 * 60,
          prompts: [
            "Vraag: ‘Wat hebben we vandaag gebouwd?’ en laat deelnemers antwoorden.",
            "Som drie takeaways op: uniek talent, bouwen helpt denken, samenwerken werkt als iedereen meedoet.",
            "Plan groepsfoto en sluit af met dankwoord en applaus.",
          ],
        },
      ],
      transitions: [
        "Organiseer groepsfoto met modellen en torens in beeld.",
        "Nodig deelnemers uit om foto’s te maken en bouwwerken nog even te laten staan.",
      ],
      notes: [
        "Reserve-opdracht bij extra tijd: bouw in 2 minuten een brug tussen twee tafels.",
        "Snelle evaluatie: één woord dat deze middag samenvat of duim omhoog/omlaag.",
      ],
    },
  ],
};

export const DEFAULT_FACILITATOR_TIPS: string[] = [
  "Begin hoog in energie, maar bouw rustmomenten in tijdens reflecties.",
  "Let op stille deelnemers: nodig ze uit zonder te pushen en geef waardering voor bijdragen.",
  "Valideer alle creaties, ook de simpele – betekenis is belangrijker dan uiterlijk.",
  "Gebruik duidelijke timers en wees strikt op de tijd om het programma in flow te houden.",
  "Bij weerstand (‘LEGO is kinderachtig’): erken het gevoel en leg uit waarom de methode werkt.",
  "Wanneer iemand vastloopt: ‘Bouw wat in je opkomt, je brein volgt vanzelf.’",
  "Hou extra LEGO-stenen klaar zodat teams niet vastlopen op materiaaltekort.",
  "Testmomenten zijn hoogtepunten – maak er een feestje van met enthousiasme en applaus.",
  "Vraag regelmatig: ‘Wie hebben we nog niet gehoord?’ om iedereen te betrekken.",
  "Laat deelnemers tijdens reflecties concrete voorbeelden koppelen aan hun dagelijkse werk.",
  "Gebruik quotes als ‘Bouwen met je handen helpt denken met je hoofd’ om inzichten te versterken.",
];

export function parseTeamdayProgram(payload: unknown): TeamdayProgram | null {
  const result = teamdayProgramSchema.safeParse(payload);
  if (!result.success) {
    return null;
  }
  return result.data;
}

export async function getTeamdayProgram(): Promise<TeamdayProgram> {
  try {
    const record = await prisma.teamdayProgram.findUnique({
      where: { slug: TEAMDAY_PROGRAM_SLUG },
    });

    if (!record) {
      return DEFAULT_TEAMDAY_PROGRAM;
    }

    const parsed = parseTeamdayProgram(record.data);
    return parsed ?? DEFAULT_TEAMDAY_PROGRAM;
  } catch (error) {
    console.error("Kon teamdag-programma niet ophalen", error);
    return DEFAULT_TEAMDAY_PROGRAM;
  }
}

export async function upsertTeamdayProgram(program: TeamdayProgram) {
  const payload = teamdayProgramSchema.parse(program);

  return prisma.teamdayProgram.upsert({
    where: { slug: TEAMDAY_PROGRAM_SLUG },
    create: {
      slug: TEAMDAY_PROGRAM_SLUG,
      data: payload,
    },
    update: {
      data: payload,
    },
  });
}

export async function ensureTeamdayProgramSeed() {
  await prisma.teamdayProgram.upsert({
    where: { slug: TEAMDAY_PROGRAM_SLUG },
    update: {},
    create: {
      slug: TEAMDAY_PROGRAM_SLUG,
      data: DEFAULT_TEAMDAY_PROGRAM,
    },
  });
}
