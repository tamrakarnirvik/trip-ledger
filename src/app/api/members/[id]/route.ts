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


/*
 * EDIT MEMBER
 */
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
   * 2. Check Treasurer role
   */
  if (
    session.user.role !==
    "TREASURER"
  ) {
    return NextResponse.json(
      {
        error:
          "Only the treasurer can edit members.",
      },
      {
        status: 403,
      }
    );
  }


  /*
   * 3. Edit member
   */
  try {
    const { id } =
      await context.params;


    const body =
      await request.json();


    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";


    /*
     * Validate name
     */
    if (!name) {
      return NextResponse.json(
        {
          error:
            "Member name is required.",
        },
        {
          status: 400,
        }
      );
    }


    if (
      name.length > 60
    ) {
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


    /*
     * Check member exists
     */
    const existingMember =
      await prisma.member.findUnique({
        where: {
          id,
        },
      });


    if (!existingMember) {
      return NextResponse.json(
        {
          error:
            "Member not found.",
        },
        {
          status: 404,
        }
      );
    }


    /*
     * Update member
     */
    const member =
      await prisma.member.update({
        where: {
          id,
        },

        data: {
          name,
        },
      });


    /*
     * Refresh pages
     */
    revalidatePath("/");
    revalidatePath("/report");


    return NextResponse.json(
      member
    );
  } catch (error) {
    console.error(
      "UPDATE MEMBER ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to update member.",
      },
      {
        status: 500,
      }
    );
  }
}


/*
 * DELETE MEMBER
 */
export async function DELETE(
  _request: Request,
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
   * 2. Check Treasurer role
   */
  if (
    session.user.role !==
    "TREASURER"
  ) {
    return NextResponse.json(
      {
        error:
          "Only the treasurer can delete members.",
      },
      {
        status: 403,
      }
    );
  }


  /*
   * 3. Delete member
   */
  try {
    const { id } =
      await context.params;


    const member =
      await prisma.member.findUnique({
        where: {
          id,
        },
      });


    if (!member) {
      return NextResponse.json(
        {
          error:
            "Member not found.",
        },
        {
          status: 404,
        }
      );
    }


    await prisma.member.delete({
      where: {
        id,
      },
    });


    /*
     * Because Contribution has
     * onDelete: Cascade,
     * this member's contributions
     * are deleted automatically.
     */


    revalidatePath("/");
    revalidatePath("/report");


    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE MEMBER ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to delete member.",
      },
      {
        status: 500,
      }
    );
  }
}