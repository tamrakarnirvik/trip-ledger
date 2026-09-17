import Link from "next/link";

import {
  headers,
} from "next/headers";

import {
  redirect,
} from "next/navigation";

import {
  auth,
} from "@/lib/auth";

import {
  ArrowLeft,
} from "lucide-react";

import prisma from "@/lib/prisma";

import {
  formatMoney,
} from "@/lib/format";

export const dynamic =
  "force-dynamic";

export default async function ReportPage() {
    const session =
  await auth.api.getSession({
    headers:
      await headers(),
  });

if (!session) {
  redirect("/login");
}
  const trip =
    await prisma.trip.findFirst({
      include: {
        members: {
          include: {
            contributions: true,
          },

          orderBy: {
            createdAt:
              "asc",
          },
        },

        expenses: {
          orderBy: {
            date:
              "asc",
          },
        },
      },
    });

  if (!trip) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Trip not found.
      </main>
    );
  }

  const members =
    trip.members.map(
      (member) => ({
        ...member,

        amountPaid:
          member.contributions.reduce(
            (
              total,
              contribution
            ) =>
              total +
              contribution.amount,
            0
          ),
      })
    );

  const expected =
    members.length *
    trip.contributionPerPerson;

  const collected =
    members.reduce(
      (
        total,
        member
      ) =>
        total +
        member.amountPaid,
      0
    );

  const spent =
    trip.expenses.reduce(
      (
        total,
        expense
      ) =>
        total +
        expense.amount,
      0
    );

  const available =
    collected -
    spent;

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 py-8 text-zinc-950 sm:px-6">

      <div className="mx-auto max-w-4xl">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-950"
        >
          <ArrowLeft
            size={
              16
            }
          />

          Dashboard
        </Link>

        <header className="mt-8">

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            TripLedger Report
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {
              trip.name
            }
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Financial summary for the trip.
          </p>

        </header>

        <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">

          <ReportStat
            label="Expected"
            value={
              expected
            }
          />

          <ReportStat
            label="Collected"
            value={
              collected
            }
          />

          <ReportStat
            label="Spent"
            value={
              spent
            }
          />

          <ReportStat
            label="Available"
            value={
              available
            }
            highlight
          />

        </section>

        <section className="mt-6 rounded-3xl border border-zinc-200 bg-white">

          <div className="border-b border-zinc-100 p-5">

            <h2 className="font-semibold">
              Member Contributions
            </h2>

          </div>

          <div className="divide-y divide-zinc-100">

            {members.map(
              (member) => (

                <div
                  key={
                    member.id
                  }
                  className="flex items-center justify-between gap-4 p-5"
                >

                  <div>

                    <p className="text-sm font-medium">
                      {
                        member.name
                      }
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {
                        member
                          .contributions
                          .length
                      }{" "}
                      payment
                      {member
                        .contributions
                        .length ===
                      1
                        ? ""
                        : "s"}
                    </p>

                  </div>

                  <p className="text-sm font-semibold">
                    {formatMoney(
                      member.amountPaid
                    )}
                  </p>

                </div>

              )
            )}

          </div>

        </section>

        <section className="mt-6 rounded-3xl border border-zinc-200 bg-white">

          <div className="border-b border-zinc-100 p-5">

            <h2 className="font-semibold">
              Expenses
            </h2>

          </div>

          <div className="divide-y divide-zinc-100">

            {trip.expenses.map(
              (expense) => (

                <div
                  key={
                    expense.id
                  }
                  className="flex items-center justify-between gap-4 p-5"
                >

                  <div>

                    <p className="text-sm font-medium">
                      {
                        expense.title
                      }
                    </p>

                    <p className="mt-1 text-xs capitalize text-zinc-500">
                      {expense.category
                        .toLowerCase()
                        .replaceAll(
                          "_",
                          " "
                        )}
                    </p>

                  </div>

                  <p className="text-sm font-semibold">
                    {formatMoney(
                      expense.amount
                    )}
                  </p>

                </div>

              )
            )}

          </div>

        </section>

      </div>

    </main>
  );
}

function ReportStat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white"
      }`}
    >
      <p
        className={`text-xs ${
          highlight
            ? "text-zinc-400"
            : "text-zinc-500"
        }`}
      >
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold">
        {formatMoney(
          value
        )}
      </p>
    </div>
  );
}