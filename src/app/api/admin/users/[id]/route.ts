import {
  NextResponse,
} from "next/server";

import {
  getCurrentSession,
} from "@/lib/session";

import prisma from "@/lib/prisma";


type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};


const allowedRoles = [
  "TREASURER",
  "FRIEND",
] as const;


export async function PATCH(
  request: Request,
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
          "Only the treasurer can manage users.",
      },
      {
        status: 403,
      }
    );
  }


  const {
    id,
  } =
    await context.params;


  /*
   * Protect your own account.
   */
  if (
    id ===
    session.user.id
  ) {
    return NextResponse.json(
      {
        error:
          "You cannot change your own role.",
      },
      {
        status: 400,
      }
    );
  }


  const body =
    await request
      .json()
      .catch(
        () => null
      );


  const role =
    body?.role;


  if (
    !allowedRoles.includes(
      role
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid user role.",
      },
      {
        status: 400,
      }
    );
  }


  const user =
    await prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        role: true,
      },
    });


  if (!user) {
    return NextResponse.json(
      {
        error:
          "User not found.",
      },
      {
        status: 404,
      }
    );
  }


  /*
   * Never allow the final Treasurer
   * account to be demoted.
   */
  if (
    user.role ===
      "TREASURER" &&
    role ===
      "FRIEND"
  ) {
    const treasurerCount =
      await prisma.user.count({
        where: {
          role:
            "TREASURER",
        },
      });


    if (
      treasurerCount <= 1
    ) {
      return NextResponse.json(
        {
          error:
            "The final Treasurer account cannot be demoted.",
        },
        {
          status: 400,
        }
      );
    }
  }


  const updatedUser =
    await prisma.user.update({
      where: {
        id,
      },

      data: {
        role,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });


  return NextResponse.json({
    user:
      updatedUser,
  });
}


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
          "Only the treasurer can delete users.",
      },
      {
        status: 403,
      }
    );
  }


  const {
    id,
  } =
    await context.params;


  /*
   * Protect current admin.
   */
  if (
    id ===
    session.user.id
  ) {
    return NextResponse.json(
      {
        error:
          "You cannot delete your own account.",
      },
      {
        status: 400,
      }
    );
  }


  const user =
    await prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        role: true,
      },
    });


  if (!user) {
    return NextResponse.json(
      {
        error:
          "User not found.",
      },
      {
        status: 404,
      }
    );
  }


  /*
   * Protect the final Treasurer.
   */
  if (
    user.role ===
    "TREASURER"
  ) {
    const treasurerCount =
      await prisma.user.count({
        where: {
          role:
            "TREASURER",
        },
      });


    if (
      treasurerCount <= 1
    ) {
      return NextResponse.json(
        {
          error:
            "The final Treasurer account cannot be deleted.",
        },
        {
          status: 400,
        }
      );
    }
  }


  /*
   * Remove Better Auth data
   * before deleting the user.
   */
  await prisma.$transaction([
    prisma.session.deleteMany({
      where: {
        userId: id,
      },
    }),

    prisma.account.deleteMany({
      where: {
        userId: id,
      },
    }),

    prisma.user.delete({
      where: {
        id,
      },
    }),
  ]);


  return NextResponse.json({
    success: true,
  });
}