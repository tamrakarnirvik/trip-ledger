import {
  NextResponse,
} from "next/server";

import {
  revalidatePath,
} from "next/cache";

import prisma from "@/lib/prisma";

import {
  getCurrentSession,
} from "@/lib/session";

const expenseCategories = [
  "ACCOMMODATION",
  "FOOD",
  "DRINKS",
  "TRANSPORT",
  "ENTERTAINMENT",
  "OTHER",
] as const;

function isExpenseCategory(
  value: unknown
): value is
  (typeof expenseCategories)[number] {
  return (
    typeof value === "string" &&
    expenseCategories.includes(
      value as
        (typeof expenseCategories)[number]
    )
  );
}

export async function POST(
  request: Request
) {
  const session =
    await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      {
        error:
          "You must be signed in.",
      },
      {
        status: 401,
      }
    );
  }

  if (
    session.user.role !==
    "TREASURER"
  ) {
    return NextResponse.json(
      {
        error:
          "Only the treasurer can add expenses.",
      },
      {
        status: 403,
      }
    );
  }

  try {

    // your existing expense code
    const body =
      await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const category =
      body.category;

    const amount =
      Number(body.amount);

    const date =
      typeof body.date === "string"
        ? body.date
        : "";

    const tripId =
      typeof body.tripId === "string"
        ? body.tripId
        : "";

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Expense name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !isExpenseCategory(
        category
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Choose a valid category.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a valid amount.",
        },
        {
          status: 400,
        }
      );
    }

    if (!date) {
      return NextResponse.json(
        {
          error:
            "Expense date is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!tripId) {
      return NextResponse.json(
        {
          error:
            "Trip ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const parsedDate =
      new Date(
        `${date}T00:00:00.000Z`
      );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid date.",
        },
        {
          status: 400,
        }
      );
    }

    const trip =
      await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

    if (!trip) {
      return NextResponse.json(
        {
          error: "Trip not found.",
        },
        {
          status: 404,
        }
      );
    }

    const expense =
      await prisma.expense.create({
        data: {
          title,
          category,
          amount,
          date: parsedDate,
          tripId,
        },
      });

    revalidatePath("/");

    return NextResponse.json(
      expense,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "ADD EXPENSE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to add expense.",
      },
      {
        status: 500,
      }
    );
  }
}