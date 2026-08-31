import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD must be set (see .env.example) before seeding.",
    );
  }

  const passwordHash = await hashPassword(adminPassword);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Sanchari Admin",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroHeadline: "Discover the Soul of South India",
      heroSubheadline:
        "Curated temple circuits, adventure escapes and wellness retreats across South India.",
    },
  });

  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    await prisma.category.createMany({
      data: [
        {
          title: "Temple Tourism",
          description:
            "Comprehensive pilgrimage circuits with structured itineraries and reliable ground transport.",
          order: 0,
        },
        {
          title: "Adventure Experiences",
          description:
            "High-energy travel packages including trekking, wildlife safaris, and water sports.",
          order: 1,
        },
        {
          title: "Wellness & Activities",
          description:
            "Immersive retreats focusing on traditional Kerala Ayurvedic treatments and yoga programs.",
          order: 2,
        },
      ],
    });
  }

  console.log(`Seeded admin user: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
