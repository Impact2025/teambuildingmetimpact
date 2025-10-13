const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "facilitator@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "workshop123";

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
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
