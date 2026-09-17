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


type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};


/*
 * EDIT EXPENSE
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
          "Only the treasurer can edit expenses.",
      },
      {
        status: 403,
      }
    );
  }


  /*
   * 3. Edit expense
   */
  try {
    const { id } =
      await context.params;

    const body =
      await request.json();


    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";


    const amount =
      Number(body.amount);


    const category =
      body.category;


    const date =
      typeof body.date === "string"
        ? body.date
        : "";


    /*
     * Validate title
     */
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


    /*
     * Validate amount
     */
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


    /*
     * Validate category
     */
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


    /*
     * Validate date
     */
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
          error:
            "Enter a valid date.",
        },
        {
          status: 400,
        }
      );
    }


    /*
     * Check expense exists
     */
    const existingExpense =
      await prisma.expense.findUnique({
        where: {
          id,
        },
      });


    if (!existingExpense) {
      return NextResponse.json(
        {
          error:
            "Expense not found.",
        },
        {
          status: 404,
        }
      );
    }


    /*
     * Update expense
     */
    const expense =
      await prisma.expense.update({
        where: {
          id,
        },

        data: {
          title,
          amount,
          category,
          date: parsedDate,
        },
      });


    /*
     * Refresh pages
     */
    revalidatePath("/");
    revalidatePath("/report");


    return NextResponse.json(
      expense
    );
  } catch (error) {
    console.error(
      "UPDATE EXPENSE ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to update expense.",
      },
      {
        status: 500,
      }
    );
  }
}


/*
 * DELETE EXPENSE
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
          "Only the treasurer can delete expenses.",
      },
      {
        status: 403,
      }
    );
  }


  /*
   * 3. Delete expense
   */
  try {
    const { id } =
      await context.params;


    /*
     * Check expense exists
     */
    const expense =
      await prisma.expense.findUnique({
        where: {
          id,
        },
      });


    if (!expense) {
      return NextResponse.json(
        {
          error:
            "Expense not found.",
        },
        {
          status: 404,
        }
      );
    }


    /*
     * Delete
     */
    await prisma.expense.delete({
      where: {
        id,
      },
    });


    /*
     * Refresh pages
     */
    revalidatePath("/");
    revalidatePath("/report");


    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE EXPENSE ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to delete expense.",
      },
      {
        status: 500,
      }
    );
  }
}