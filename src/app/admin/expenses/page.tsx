import {
  redirect,
} from "next/navigation";

import {
  ReceiptText,
  Shapes,
  Wallet,
} from "lucide-react";

import {
  AdminCreateAction,
} from "@/components/admin/admin-create-action";

import {
  AdminPageShell,
} from "@/components/admin/admin-page-shell";

import {
  ExpenseList,
} from "@/components/dashboard/expense-list";

import {
  formatMoney,
} from "@/lib/format";

import {
  getCurrentSession,
} from "@/lib/session";

import prisma from "@/lib/prisma";

import type {
  ExpenseCategory,
} from "@/types/trip";


export const dynamic =
  "force-dynamic";


export default async function AdminExpensesPage() {
  const session =
    await getCurrentSession();


  if (!session) {
    redirect(
      "/login"
    );
  }


  if (
    session.user.role !==
    "TREASURER"
  ) {
    redirect(
      "/"
    );
  }


  const trip =
    await prisma.trip.findFirst({
      include: {
        expenses: {
          orderBy: {
            date:
              "desc",
          },
        },
      },
    });


  if (!trip) {
    redirect(
      "/"
    );
  }


  const expenses =
    trip.expenses.map(
      (expense) => ({
        id:
          expense.id,

        title:
          expense.title,

        category:
          expense.category as ExpenseCategory,

        amount:
          expense.amount,

        date:
          expense.date
            .toISOString()
            .split(
              "T"
            )[0],
      })
    );


  const totalSpent =
    expenses.reduce(
      (
        total,
        expense
      ) =>
        total +
        expense.amount,
      0
    );


  const categories =
    new Set(
      expenses.map(
        (expense) =>
          expense.category
      )
    ).size;


  const average =
    expenses.length > 0
      ? Math.round(
          totalSpent /
            expenses.length
        )
      : 0;


  return (
    <AdminPageShell
      tripName={
        trip.name
      }
      title="Expenses"
      description="Review and manage all trip spending."
    >

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >

        <p className="text-sm text-zinc-500">
          {expenses.length} expense records
        </p>


        <AdminCreateAction
          mode="expense"
          tripId={
            trip.id
          }
        />

      </div>


      <section
        className="
          mt-4
          grid
          grid-cols-2
          gap-3

          lg:grid-cols-3
        "
      >

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">

          <Wallet
            size={17}
            className="text-rose-600"
          />

          <p className="mt-3 text-xs text-zinc-500">
            Total Spent
          </p>

          <p className="mt-1 text-lg font-semibold tabular-nums">
            {formatMoney(
              totalSpent
            )}
          </p>

        </div>


        <div className="rounded-2xl border border-zinc-200 bg-white p-4">

          <ReceiptText
            size={17}
            className="text-violet-600"
          />

          <p className="mt-3 text-xs text-zinc-500">
            Expenses
          </p>

          <p className="mt-1 text-lg font-semibold">
            {expenses.length}
          </p>

        </div>


        <div
          className="
            col-span-2

            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-4

            lg:col-span-1
          "
        >

          <Shapes
            size={17}
            className="text-sky-600"
          />

          <p className="mt-3 text-xs text-zinc-500">
            Categories / Average
          </p>

          <p className="mt-1 text-lg font-semibold">
            {categories}
            <span className="ml-2 text-xs font-normal text-zinc-400">
              · {formatMoney(
                average
              )} avg.
            </span>
          </p>

        </div>

      </section>


      <div className="mt-4">

        <ExpenseList
          expenses={
            expenses
          }
          canManage
        />

      </div>

    </AdminPageShell>
  );
}