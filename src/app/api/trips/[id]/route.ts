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


export async function PATCH(
  request: Request,
  context: RouteContext
) {
  /*
   * 1. Check login
   */
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


  /*
   * 2. Only Treasurer can change settings
   */
  if (
    session.user.role !==
    "TREASURER"
  ) {
    return NextResponse.json(
      {
        error:
          "Only the treasurer can change trip settings.",
      },
      {
        status: 403,
      }
    );
  }


  try {
    const { id } =
      await context.params;

    const body =
      await request.json();


    const contributionPerPerson =
      Number(
        body.contributionPerPerson
      );


    /*
     * 3. Validate amount
     */
    if (
      !Number.isInteger(
        contributionPerPerson
      ) ||
      contributionPerPerson <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a valid per-person amount.",
        },
        {
          status: 400,
        }
      );
    }


    /*
     * Optional sensible limit
     */
    if (
      contributionPerPerson >
      1_000_000
    ) {
      return NextResponse.json(
        {
          error:
            "The amount is too large.",
        },
        {
          status: 400,
        }
      );
    }


    /*
     * 4. Find trip + existing payments
     */
    const trip =
      await prisma.trip.findUnique({
        where: {
          id,
        },

        include: {
          members: {
            include: {
              contributions: true,
            },
          },
        },
      });


    if (!trip) {
      return NextResponse.json(
        {
          error:
            "Trip not found.",
        },
        {
          status: 404,
        }
      );
    }


    /*
     * 5. Find the highest amount
     * any member has already paid.
     */
    const highestAmountPaid =
      trip.members.reduce(
        (
          highest,
          member
        ) => {
          const amountPaid =
            member.contributions.reduce(
              (
                total,
                contribution
              ) =>
                total +
                contribution.amount,
              0
            );

          return Math.max(
            highest,
            amountPaid
          );
        },
        0
      );


    /*
     * Prevent creating overpaid members.
     *
     * Example:
     * Someone already paid Rs. 3,500.
     * We don't allow target to become Rs. 3,000.
     */
    if (
      contributionPerPerson <
      highestAmountPaid
    ) {
      return NextResponse.json(
        {
          error:
            `The amount cannot be lower than Rs. ${highestAmountPaid.toLocaleString(
              "en-IN"
            )} because a member has already paid that amount.`,
        },
        {
          status: 400,
        }
      );
    }


    /*
     * 6. Update trip
     */
    const updatedTrip =
      await prisma.trip.update({
        where: {
          id,
        },

        data: {
          contributionPerPerson,
        },
      });


    /*
     * 7. Refresh pages
     */
    revalidatePath("/");
    revalidatePath("/report");


    return NextResponse.json(
      updatedTrip
    );
  } catch (error) {
    console.error(
      "UPDATE TRIP SETTINGS ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to update trip settings.",
      },
      {
        status: 500,
      }
    );
  }
}