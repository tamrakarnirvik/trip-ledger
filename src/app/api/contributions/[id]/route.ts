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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: Request,
  context: RouteContext
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
          "Only the treasurer can reverse payments.",
      },
      {
        status: 403,
      }
    );
  }

  try {

    const { id } =
      await context.params;

    const contribution =
      await prisma.contribution.findUnique({
        where: {
          id,
        },
      });

    if (!contribution) {
      return NextResponse.json(
        {
          error:
            "Payment not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.contribution.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE CONTRIBUTION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to reverse payment.",
      },
      {
        status: 500,
      }
    );
  }
}