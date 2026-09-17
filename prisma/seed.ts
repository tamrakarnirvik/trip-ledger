import "dotenv/config";

import {
  PrismaClient,
} from "../src/generated/prisma/client";

import {
  PrismaPg,
} from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL!,
});

const prisma =
  new PrismaClient({
    adapter,
  });

async function main() {
  // Clear existing data
  await prisma.expense.deleteMany();

  await prisma.contribution.deleteMany();

  await prisma.member.deleteMany();

  await prisma.trip.deleteMany();

  // Create the trip
  const trip =
    await prisma.trip.create({
      data: {
        name: "Villa Trip",
        contributionPerPerson: 3500,
      },
    });

  const members = [
    {
      name: "Ajesh",
      amountPaid: 3500,
    },
    {
      name: "Nirvik",
      amountPaid: 3500,
    },
    {
      name: "Sujal",
      amountPaid: 2000,
    },
    {
      name: "Rohan",
      amountPaid: 3500,
    },
    {
      name: "Prabin",
      amountPaid: 3500,
    },
    {
      name: "Sagar",
      amountPaid: 0,
    },
    {
      name: "Bibek",
      amountPaid: 3500,
    },
    {
      name: "Anish",
      amountPaid: 0,
    },
    {
      name: "Kiran",
      amountPaid: 0,
    },
  ];

  for (const member of members) {
    await prisma.member.create({
      data: {
        name: member.name,

        tripId: trip.id,

        contributions:
          member.amountPaid > 0
            ? {
                create: {
                  amount:
                    member.amountPaid,
                },
              }
            : undefined,
      },
    });
  }

  await prisma.expense.createMany({
    data: [
      {
        title: "Villa Advance",

        category:
          "ACCOMMODATION",

        amount: 8000,

        date: new Date(
          "2026-09-15T00:00:00"
        ),

        tripId: trip.id,
      },

      {
        title: "Chicken",

        category: "FOOD",

        amount: 2500,

        date: new Date(
          "2026-09-16T00:00:00"
        ),

        tripId: trip.id,
      },

      {
        title: "Soft Drinks",

        category: "DRINKS",

        amount: 1200,

        date: new Date(
          "2026-09-16T00:00:00"
        ),

        tripId: trip.id,
      },

      {
        title: "Snacks",

        category: "FOOD",

        amount: 850,

        date: new Date(
          "2026-09-16T00:00:00"
        ),

        tripId: trip.id,
      },

      {
        title: "Fuel",

        category: "TRANSPORT",

        amount: 1500,

        date: new Date(
          "2026-09-16T00:00:00"
        ),

        tripId: trip.id,
      },
    ],
  });

  console.log(
    "✅ TripLedger database seeded successfully."
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