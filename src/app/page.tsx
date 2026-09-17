import * as motion from "motion/react-client";

import {
  Banknote,
  ReceiptText,
  UsersRound,
  Wallet,
} from "lucide-react";

import {
  headers,
} from "next/headers";

import {
  redirect,
} from "next/navigation";

import {
  TripActions,
} from "@/components/dashboard/trip-actions";

import {
  ExpenseSummary,
} from "@/components/dashboard/expense-summary";

import {
  ContributionProgress,
} from "@/components/dashboard/contribution-progress";

import {
  ExpenseList,
} from "@/components/dashboard/expense-list";

import {
  MembersList,
} from "@/components/dashboard/members-list";

import {
  StatCard,
} from "@/components/dashboard/stat-card";

import {
  LogoutButton,
} from "@/components/auth/logout-button";

import {
  formatMoney,
} from "@/lib/format";

import {
  auth,
} from "@/lib/auth";

import {
  TripSettings,
} from "@/components/dashboard/trip-settings";

import prisma from "@/lib/prisma";

import type {
  ExpenseCategory,
} from "@/types/trip";


export const dynamic =
  "force-dynamic";


export default async function Home() {
  /*
   * 1. Check authentication
   */

  const session =
    await auth.api.getSession({
      headers:
        await headers(),
    });

  if (!session) {
    redirect("/login");
  }

  const isTreasurer =
  session.user.role ===
  "TREASURER";


  /*
   * 2. Load trip from PostgreSQL
   */

  const dbTrip =
    await prisma.trip.findFirst({
      include: {
        members: {
          include: {
            contributions: {
              orderBy: {
                createdAt:
                  "desc",
              },
            },
          },

          orderBy: {
            createdAt:
              "asc",
          },
        },

        expenses: {
          orderBy: {
            date:
              "desc",
          },
        },
      },
    });


  /*
   * 3. No trip found
   */

  if (!dbTrip) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8]">
        <div className="text-center">

          <h1 className="text-xl font-semibold text-zinc-950">
            No trip found
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Seed your database first.
          </p>

        </div>
      </main>
    );
  }


  /*
   * 4. Trip UI object
   */

  const trip = {
    id:
      dbTrip.id,

    name:
      dbTrip.name,

    contributionPerPerson:
      dbTrip.contributionPerPerson,
  };


  /*
   * 5. Members + contribution totals/history
   */

  const members =
    dbTrip.members.map(
      (member) => {
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

        return {
          id:
            member.id,

          name:
            member.name,

          amountPaid,

          contributions:
            member.contributions.map(
              (
                contribution
              ) => ({
                id:
                  contribution.id,

                amount:
                  contribution.amount,

                createdAt:
                  contribution.createdAt.toISOString(),
              })
            ),
        };
      }
    );


  /*
   * 6. Expenses for UI
   */

  const expenses =
    dbTrip.expenses.map(
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
            .split("T")[0],
      })
    );


  /*
   * 7. Dashboard calculations
   */

  const expectedFund =
    members.length *
    trip.contributionPerPerson;


  const collectedMoney =
    members.reduce(
      (
        total,
        member
      ) =>
        total +
        member.amountPaid,
      0
    );


  const totalExpenses =
    expenses.reduce(
      (
        total,
        expense
      ) =>
        total +
        expense.amount,
      0
    );


  const availableMoney =
    collectedMoney -
    totalExpenses;


  const fullyPaidMembers =
    members.filter(
      (member) =>
        member.amountPaid >=
        trip.contributionPerPerson
    ).length;


  /*
   * 8. Render dashboard
   */

  return (
    <main className="min-h-screen bg-[#f7f7f8] pb-24 text-zinc-950 md:pb-0">

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">

        {/* HEADER */}

        <motion.header
          initial={{
            opacity: 0,
            y: -12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,

            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="mb-8"
        >

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            {/* LEFT SIDE */}

            <div>

              <div className="mb-3 flex items-center gap-2">

                <div className="h-2 w-2 rounded-full bg-zinc-900" />

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Trip Ledger
                </p>

              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {trip.name}
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Manage contributions and trip
                expenses in one place.
              </p>

            </div>


            {/* RIGHT SIDE */}

            <div className="flex flex-wrap items-center gap-2">

  {/* MEMBER INFO */}

  <div className="flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600">

    <UsersRound
      size={16}
    />

    <span>
      {members.length} members
    </span>

    <span className="text-zinc-300">
      ·
    </span>

    <span>
      {formatMoney(
        trip.contributionPerPerson
      )}{" "}
      each
    </span>

  </div>


  {/* ROLE BADGE */}

  <span
    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
      isTreasurer
        ? "bg-zinc-900 text-white"
        : "bg-zinc-100 text-zinc-600"
    }`}
  >
    {isTreasurer
      ? "Treasurer"
      : "Friend"}
  </span>


  {/* LOGOUT */}

  <LogoutButton
    name={
      session.user.name
    }
  />

</div>

          </div>

        </motion.header>


        {/* ACTION BUTTONS */}

        {/* TREASURER ACTIONS */}

{isTreasurer ? (
  <div className="mb-6 flex flex-wrap items-start gap-2">

    <TripActions
      tripId={trip.id}
      members={members}
      contributionPerPerson={
        trip.contributionPerPerson
      }
    />

    <TripSettings
      tripId={
        trip.id
      }
      contributionPerPerson={
        trip.contributionPerPerson
      }
    />

  </div>
) : (
  <div className="mb-6 rounded-2xl border border-zinc-200 bg-white px-4 py-3">

    <p className="text-sm font-medium text-zinc-700">
      View-only access
    </p>

    <p className="mt-1 text-xs text-zinc-500">
      You can view the trip,
      contributions and expenses.
      Only the treasurer can make
      changes.
    </p>

  </div>
)}


        {/* SUMMARY CARDS */}

        <section className="grid gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-4">

          <StatCard
            title="Expected Fund"
            value={
              formatMoney(
                expectedFund
              )
            }
            description={`${formatMoney(
              trip.contributionPerPerson
            )} × ${members.length} people`}
            icon={
              <Banknote
                size={19}
              />
            }
            delay={0.08}
          />


          <StatCard
            title="Collected"
            value={
              formatMoney(
                collectedMoney
              )
            }
            description={`${fullyPaidMembers} of ${members.length} fully paid`}
            icon={
              <UsersRound
                size={19}
              />
            }
            delay={0.14}
          />


          <StatCard
            title="Total Spent"
            value={
              formatMoney(
                totalExpenses
              )
            }
            description={`${expenses.length} expenses recorded`}
            icon={
              <ReceiptText
                size={19}
              />
            }
            delay={0.2}
          />


          <StatCard
            title="Available"
            value={
              formatMoney(
                availableMoney
              )
            }
            description="Current trip money"
            icon={
              <Wallet
                size={19}
              />
            }
            highlight
            delay={0.26}
          />

        </section>


        {/* CONTRIBUTION PROGRESS */}

        <div className="mt-4">

          <ContributionProgress
            collected={
              collectedMoney
            }
            expected={
              expectedFund
            }
            fullyPaidMembers={
              fullyPaidMembers
            }
            totalMembers={
              members.length
            }
          />

        </div>


        {/* MEMBERS + EXPENSES */}

        <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1.15fr_0.85fr]">

          <MembersList
  members={members}
  contributionPerPerson={
    trip.contributionPerPerson
  }
  canManage={
    isTreasurer
  }
/>


          <ExpenseList
  expenses={expenses}
  canManage={
    isTreasurer
  }
/>

        </div>


        {/* EXPENSE CATEGORY SUMMARY */}

        <div className="mt-4">

          <ExpenseSummary
            expenses={
              expenses
            }
          />

        </div>


        {/* FOOTER */}

        <motion.footer
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.75,
            duration: 0.5,
          }}
          className="mt-8 pb-4 text-center text-xs text-zinc-400"
        >
          TripLedger · Villa Trip Fund
        </motion.footer>

      </div>

    </main>
  );
}