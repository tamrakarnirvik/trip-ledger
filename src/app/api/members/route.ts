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
          "Only the treasurer can add members.",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const tripId =
      typeof body.tripId === "string"
        ? body.tripId
        : "";

    if (!name) {
      return NextResponse.json(
        {
          error: "Member name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 60) {
      return NextResponse.json(
        {
          error:
            "Member name is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (!tripId) {
      return NextResponse.json(
        {
          error: "Trip ID is required.",
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

    const member =
      await prisma.member.create({
        data: {
          name,
          tripId,
        },
      });

    revalidatePath("/");

    return NextResponse.json(
      member,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "ADD MEMBER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to add member.",
      },
      {
        status: 500,
      }
    );
  }
}