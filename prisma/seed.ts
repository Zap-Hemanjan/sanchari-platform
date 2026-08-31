import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

// 12 real package names/durations/destinations, scraped from the live
// sanchari.travel /our-packages/ listing. Only "Tamil Nadu Temple Journey"
// has a verified real itinerary (from its live detail page) — the rest seed
// with just the listing fields, ready for Pranay to fill in via
// /admin/packages. Fabricating itineraries for packages we haven't verified
// would be dishonest filler.
const PACKAGES: Array<{
  slug: string;
  title: string;
  duration: string;
  destination: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  itinerary: { title: string; summary: string; details: string }[];
}> = [
  {
    slug: "tamil-nadu-temple-journey",
    title: "Tamil Nadu Temple Journey",
    duration: "7 Days 6 Nights",
    destination: "Tamil Nadu",
    description:
      "From Adiyogi's luminous presence at the Isha Yoga Center, through twelve divine abodes across Tamil Nadu, this journey blends devotion, heritage and comfort across a week of temple darshan.",
    highlights: [
      "Adiyogi Shiva Statue, Isha Yoga Center, Coimbatore",
      "Brihadeeswarar Temple, Thanjavur",
      "Meenakshi Amman Temple, Madurai",
      "Sri Ranganathaswamy Temple, Srirangam",
      "Arunachaleswarar Temple, Tiruvannamalai",
    ],
    inclusions: ["Hotel", "Meals", "Flight", "Sightseeing", "Transport"],
    itinerary: [
      {
        title: "Arrival in Coimbatore — Isha Yoga Center",
        summary: "Fly in and visit the Adiyogi Shiva statue.",
        details:
          "10:10 - 11:35 AM: Flight, Hyderabad to Coimbatore.\nAfternoon: Transfer to hotel, check in.\nEvening: Visit Isha Yoga Center for Adiyogi darshan.",
      },
      {
        title: "Thanjavur — Brihadeeswarar Temple",
        summary: "Morning darshan at the Big Temple, evening free.",
        details:
          "Morning: Drive to Thanjavur, darshan at Brihadeeswarar Temple.\nAfternoon: Explore Thanjavur Palace and art gallery.\nEvening: Free time / rest.",
      },
      {
        title: "Srirangam — Sri Ranganathaswamy Temple",
        summary: "Visit one of the largest functioning Hindu temples.",
        details:
          "Morning: Darshan at Sri Ranganathaswamy Temple, Srirangam.\nAfternoon: Transfer towards Madurai.",
      },
      {
        title: "Madurai — Meenakshi Amman Temple",
        summary: "Full day at the iconic Meenakshi Temple complex.",
        details:
          "Morning and evening darshan at Meenakshi Amman Temple.\nAfternoon: Local market and heritage walk.",
      },
      {
        title: "Tiruvannamalai — Arunachaleswarar Temple",
        summary: "Darshan and, if timed right, the hill Girivalam walk.",
        details:
          "Morning: Drive to Tiruvannamalai.\nAfternoon: Darshan at Arunachaleswarar Temple.\nEvening: Optional Girivalam (hill circumambulation).",
      },
      {
        title: "Free day / buffer for travel",
        summary: "Buffer day for rest or additional nearby temples.",
        details:
          "Kept free to absorb travel delays, or for an optional visit to a nearby temple town.",
      },
      {
        title: "Departure",
        summary: "Transfer to the airport for the return flight.",
        details: "Morning: Check out and transfer to the airport for departure.",
      },
    ],
  },
  {
    slug: "sacred-karnataka",
    title: "Sacred Karnataka",
    duration: "6 Days",
    destination: "Karnataka",
    description: "A pilgrimage circuit through Karnataka's most revered temple towns.",
    highlights: [],
    inclusions: [],
    itinerary: [],
  },
  {
    slug: "sacred-telangana",
    title: "Sacred Telangana",
    duration: "5 Days",
    destination: "Telangana",
    description: "Temple circuit covering Telangana's most significant pilgrimage sites.",
    highlights: [],
    inclusions: [],
    itinerary: [],
  },
  {
    slug: "sacred-andhra-pradesh",
    title: "Sacred Andhra Pradesh",
    duration: "6 Days",
    destination: "Andhra Pradesh",
    description: "A journey through Andhra Pradesh's sacred temple towns.",
    highlights: [],
    inclusions: [],
    itinerary: [],
  },
  {
    slug: "heritage-tamil-nadu",
    title: "Heritage Tamil Nadu",
    duration: "3 Days",
    destination: "Tamil Nadu",
    description: "A short heritage and temple circuit through Tamil Nadu.",
    highlights: [],
    inclusions: [],
    itinerary: [],
  },
  {
    slug: "sacred-tamil-nadu",
    title: "Sacred Tamil Nadu",
    duration: "4 Days",
    destination: "Tamil Nadu",
    description: "A focused pilgrimage circuit through Tamil Nadu's temple towns.",
    highlights: [],
    inclusions: [],
    itinerary: [],
  },
  {
    slug: "sacred-kerala-3",
    title: "Sacred Kerala 3",
    duration: "4 Days",
    destination: "Kerala",
    description: "One of Sanchari's Kerala temple circuit variants.",
    highlights: [],
    inclusions: [],
    itinerary: [],
  },
  {
    slug: "sacred-kerala-2",
    title: "Sacred Kerala 2",
    duration: "4 Days",
    destination: "Kerala",
    description: "One of Sanchari's Kerala temple circuit variants.",
    highlights: [],
    inclusions: [],
    itinerary: [],
  },
  {
    slug: "sacred-kerala",
    title: "Sacred Kerala",
    duration: "7 Days",
    destination: "Kerala",
    description: "A comprehensive week-long temple circuit across Kerala.",
    highlights: [],
    inclusions: [],
    itinerary: [],
  },
  {
    slug: "karnataka-coastal-temple-circuit",
    title: "Karnataka Coastal Temple Circuit",
    duration: "4 Days",
    destination: "Karnataka",
    description: "A coastal Karnataka circuit covering temples along the Arabian Sea.",
    highlights: [],
    inclusions: [],
    itinerary: [],
  },
];

const DESTINATION_ALT_TEXT_MATCHES: Array<{ name: string; location: string; match: string }> = [
  { name: "Murudeshwar Temple", location: "Karnataka", match: "Murudeshwar" },
  { name: "Yadadri Sri Lakshmi Narasimha Swamy Temple", location: "Telangana", match: "Yadadri" },
  { name: "Simhachalam Temple", location: "Andhra Pradesh", match: "Simhachalam" },
  { name: "Sri Ranganathaswamy Temple", location: "Tamil Nadu", match: "Ranganathaswamy" },
  { name: "Sree Padmanabhaswamy Temple", location: "Kerala", match: "Padmanabhaswamy" },
  { name: "Guruvayur Temple", location: "Kerala", match: "Guruvayur" },
];

// Real copy, scraped from the live site's homepage.
const SANCHARI_WAY: Array<{ title: string; description: string }> = [
  {
    title: "Curated With Context",
    description:
      "We bring together sacred destinations, regional history, temple traditions and local culture to reveal the complete story of every place.",
  },
  {
    title: "Planned Around People",
    description:
      "Journeys are shaped around the traveller's age, interests, preferred pace, family requirements and comfort — not around a fixed template.",
  },
  {
    title: "Supported Throughout",
    description:
      "From routes and stays to temple schedules and on-ground movement, essential details are coordinated through one dependable travel partner.",
  },
];

const PROCESS_STEPS: Array<{ title: string; description: string }> = [
  {
    title: "Trusted & Safe",
    description: "Your comfort, safety, and peace of mind are our top priorities.",
  },
  {
    title: "Expert Guides",
    description:
      "Our experienced tour coordinators and knowledgeable local guides ensure every pilgrimage is smooth, informative, and spiritually enriching.",
  },
  {
    title: "VIP Darshan",
    description:
      "Enjoy a seamless pilgrimage with our VIP Darshan assistance. We help you navigate the darshan process efficiently, minimizing waiting time.",
  },
  {
    title: "Comfortable Travel",
    description:
      "Travel with ease in clean, well-maintained vehicles designed to make your pilgrimage relaxing and enjoyable.",
  },
];

// Genuine, accurate-to-how-this-system-actually-works answers — not
// fabricated business policy (e.g. specific refund percentages) we haven't
// been given.
const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "How do I book a tour?",
    answer:
      "Submit an enquiry from any package page or the Contact Us page, or message us directly on WhatsApp. Our travel experts will get back to you within 24 hours to arrange your booking.",
  },
  {
    question: "What is included in a package?",
    answer:
      "Each package page lists its specific inclusions (typically hotel, meals, transport and sightseeing) under the Inclusions section — this varies by trip, so please check the individual package page.",
  },
  {
    question: "Can I request a custom itinerary?",
    answer:
      "Yes — mention your preferred dates, group size and interests in your enquiry, and our team will help tailor a plan.",
  },
  {
    question: "Do you offer group discounts?",
    answer:
      "Group pricing depends on group size and the specific package — let us know your group details in your enquiry and we'll share options.",
  },
];

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
    update: {
      // Real, publicly-listed contact details from the live site's own
      // Contact Us page — not fabricated. Stats are deliberately left unset
      // (the live site's own "0+" counters are an unconfigured placeholder;
      // seeding fake numbers would be no better).
      contactPhone: "+91 7337428436",
      contactEmail: "info@sanchari.travel",
      contactLocation: "Hyderabad, India",
      contactHours: "Mon - Fri: 08.00 - 20.00",
    },
    create: {
      id: "singleton",
      heroHeadline: "Discover the Soul of South India",
      heroSubheadline:
        "Curated temple circuits, adventure escapes and wellness retreats across South India.",
      contactPhone: "+91 7337428436",
      contactEmail: "info@sanchari.travel",
      contactLocation: "Hyderabad, India",
      contactHours: "Mon - Fri: 08.00 - 20.00",
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

  // Reuse already-uploaded gallery images (from the earlier live-site media
  // ingestion) for matching destinations, rather than re-uploading.
  const existingMedia = await prisma.mediaAsset.findMany();
  const destinationCount = await prisma.destination.count();
  if (destinationCount === 0) {
    await prisma.destination.createMany({
      data: DESTINATION_ALT_TEXT_MATCHES.map((destination, order) => {
        const media = existingMedia.find((m) => m.altText.includes(destination.match));
        return {
          name: destination.name,
          location: destination.location,
          imageUrl: media?.url ?? null,
          order,
        };
      }),
    });
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  const packageCount = await prisma.package.count();
  if (packageCount === 0) {
    for (const [index, pkg] of PACKAGES.entries()) {
      await prisma.package.create({
        data: {
          slug: pkg.slug,
          title: pkg.title,
          duration: pkg.duration,
          destination: pkg.destination,
          description: pkg.description,
          // The one fully-detailed package reuses the real Brihadeeswarar
          // Temple hero photo already set as the homepage hero image.
          heroImageUrl: pkg.slug === "tamil-nadu-temple-journey" ? settings?.heroImageUrl : null,
          published: true,
          order: index,
          highlights: { create: pkg.highlights.map((text, order) => ({ text, order })) },
          inclusions: { create: pkg.inclusions.map((text, order) => ({ text, order })) },
          itineraryDays: {
            create: pkg.itinerary.map((day, order) => ({
              dayNumber: order + 1,
              title: day.title,
              summary: day.summary,
              details: day.details,
              order,
            })),
          },
        },
      });
    }
  }

  const valuePropCount = await prisma.valueProp.count();
  if (valuePropCount === 0) {
    await prisma.valueProp.createMany({
      data: [
        ...SANCHARI_WAY.map((v, order) => ({ section: "sanchari_way", ...v, order })),
        ...PROCESS_STEPS.map((v, order) => ({ section: "process", ...v, order })),
      ],
    });
  }

  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    await prisma.faq.createMany({
      data: FAQS.map((faq, order) => ({ ...faq, order })),
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
