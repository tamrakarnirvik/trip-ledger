import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import {
  getCurrentSession,
} from "@/lib/session";

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
          "Only the treasurer can record payments.",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const body = await request.json();

    const memberId =
      typeof body.memberId === "string"
        ? body.memberId
        : "";

    const amount =
      Number(body.amount);

    if (!memberId) {
      return NextResponse.json(
        {
          error: "Member is required.",
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
            "Enter a valid payment amount.",
        },
        {
          status: 400,
        }
      );
    }

    const member =
      await prisma.member.findUnique({
        where: {
          id: memberId,
        },

        include: {
          trip: true,
          contributions: true,
        },
      });

    if (!member) {
      return NextResponse.json(
        {
          error: "Member not found.",
        },
        {
          status: 404,
        }
      );
    }

    const alreadyPaid =
      member.contributions.reduce(
        (
          total,
          contribution
        ) =>
          total +
          contribution.amount,
        0
      );

    const remaining =
      member.trip
        .contributionPerPerson -
      alreadyPaid;

    if (remaining <= 0) {
      return NextResponse.json(
        {
          error:
            "This member has already paid in full.",
        },
        {
          status: 400,
        }
      );
    }

    if (amount > remaining) {
      return NextResponse.json(
        {
          error: `Only Rs. ${remaining.toLocaleString(
            "en-IN"
          )} remains for this member.`,
        },
        {
          status: 400,
        }
      );
    }

    const contribution =
      await prisma.contribution.create({
        data: {
          memberId,
          amount,
        },
      });

    revalidatePath("/");

    return NextResponse.json(
      contribution,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CONTRIBUTION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to record payment.",
      },
      {
        status: 500,
      }
    );
  }
}