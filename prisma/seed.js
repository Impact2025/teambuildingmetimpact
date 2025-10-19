const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "v.munster@weareimpact.nl";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Impact+Days2025!";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      name: "Workshop Facilitator",
      role: Role.ADMIN,
      hashedPassword,
    },
  });

  console.log("✅ Admin account gereed:");
  console.log(`   Email: ${user.email}`);
  console.log(`   Wachtwoord: ${adminPassword}`);
  console.log(
    "   Pas deze waarden aan voordat je naar productie gaat en verwijder de SEED_* variabelen."
  );

  // Seed teamday program
  const program = await prisma.teamdayProgram.upsert({
    where: { slug: "default" },
    update: {},
    create: {
      slug: "default",
      data: {
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
          playlistUrl: "https://open.spotify.com/playlist/6jCfnlF6KQKnitp41I2B2G",
        },
        sessions: [],
      },
    },
  });

  // Seed teamday reviews voor oktober met verschillende statussen
  const reviewsData = [
    // Goedgekeurde reviews
    {
      sessionKey: "obstacle-course",
      reviewerName: "Sarah van der Berg",
      rating: 5,
      comment: "Fantastische activiteit! Het was echt teamwork en iedereen deed mee. De combinatie van creativiteit en samen een doel bereiken was perfect.",
      status: "APPROVED",
      reviewedAt: new Date("2024-10-14T17:30:00"),
    },
    {
      sessionKey: "connection-tower",
      reviewerName: "Mark Jansen",
      rating: 5,
      comment: "De toren bouwen was een geweldige afsluiter. Leuk om te zien hoe iedereen zijn best deed en het einde in feestsfeer was.",
      status: "APPROVED",
      reviewedAt: new Date("2024-10-14T17:45:00"),
    },
    {
      sessionKey: "happy-object",
      reviewerName: "Lisa Vermeulen",
      rating: 4,
      comment: "Mooie opdracht om elkaar beter te leren kennen. Het was persoonlijk en toch laagdrempelig.",
      status: "APPROVED",
      reviewedAt: new Date("2024-10-14T18:00:00"),
    },
    {
      sessionKey: "wickevoorter-welcome",
      reviewerName: "Tom de Vries",
      rating: 5,
      comment: "Wat een mooie locatie om te starten! De rondleiding door Ada was inspirerend en gaf meteen een goede sfeer voor de rest van de dag.",
      status: "APPROVED",
      reviewedAt: new Date("2024-10-15T09:15:00"),
    },
    {
      sessionKey: "skills-check",
      reviewerName: "Emma Bakker",
      rating: 4,
      comment: "Leuke ijsbreker! Iedereen voelde zich meteen op zijn gemak door de korte opdrachten.",
      status: "APPROVED",
      reviewedAt: new Date("2024-10-15T10:30:00"),
    },
    {
      sessionKey: "mh17-monument",
      reviewerName: "Peter Smit",
      rating: 5,
      comment: "Indrukwekkend en respectvol vormgegeven. Een belangrijk moment van reflectie tijdens de dag.",
      status: "APPROVED",
      reviewedAt: new Date("2024-10-15T11:00:00"),
    },
    {
      sessionKey: "obstacle-course",
      reviewerName: "Noor Hassan",
      rating: 4,
      comment: "Echt leuk om samen te bouwen en te testen. Alleen de tijd was wel kort, maar dat zorgde ook voor een goede dynamiek.",
      status: "APPROVED",
      reviewedAt: new Date("2024-10-15T12:00:00"),
    },
    // Reviews in behandeling
    {
      sessionKey: "connection-tower",
      reviewerName: "Jan Pietersen",
      rating: 3,
      comment: "Leuk concept, maar onze toren viel steeds om. Wel grappig!",
      status: "PENDING",
      reviewedAt: new Date("2024-10-15T13:00:00"),
    },
    {
      sessionKey: "boskern-intro",
      reviewerName: "Sophie Willems",
      rating: 4,
      comment: "Mooie locatie en fijn ontvangst. De uitleg van Daphne was helder.",
      status: "PENDING",
      reviewedAt: new Date("2024-10-15T14:00:00"),
    },
  ];

  for (const reviewData of reviewsData) {
    await prisma.teamdayReview.upsert({
      where: {
        id: `seed-${reviewData.sessionKey}-${reviewData.reviewerName.toLowerCase().replace(/\s+/g, "-")}`,
      },
      update: reviewData,
      create: {
        id: `seed-${reviewData.sessionKey}-${reviewData.reviewerName.toLowerCase().replace(/\s+/g, "-")}`,
        ...reviewData,
        programId: program.id,
      },
    });
  }

  console.log(`✅ ${reviewsData.length} teamdag reviews aangemaakt (${reviewsData.filter(r => r.status === "APPROVED").length} goedgekeurd, ${reviewsData.filter(r => r.status === "PENDING").length} in behandeling)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
