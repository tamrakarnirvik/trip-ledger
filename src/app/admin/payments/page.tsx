import {
  redirect,
} from "next/navigation";

import {
  Banknote,
  Clock3,
  Target,
  WalletCards,
} from "lucide-react";

import {
  AdminCreateAction,
} from "@/components/admin/admin-create-action";

import {
  AdminPageShell,
} from "@/components/admin/admin-page-shell";

import {
  AdminPaymentsManager,
} from "@/components/admin/admin-payments-manager";

import {
  formatMoney,
} from "@/lib/format";

import {
  getCurrentSession,
} from "@/lib/session";

import prisma from "@/lib/prisma";


export const dynamic =
  "force-dynamic";


export default async function AdminPaymentsPage() {
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
        members: {
          include: {
            contributions:
              true,
          },

          orderBy: {
            createdAt:
              "asc",
          },
        },
      },
    });


  if (!trip) {
    redirect(
      "/"
    );
  }


  const members =
    trip.members.map(
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
        };
      }
    );


  const payments =
    trip.members
      .flatMap(
        (member) =>
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

              member: {
                id:
                  member.id,

                name:
                  member.name,
              },
            })
          )
      )
      .sort(
        (
          first,
          second
        ) =>
          new Date(
            second.createdAt
          ).getTime() -
          new Date(
            first.createdAt
          ).getTime()
      );


  const collected =
    payments.reduce(
      (
        total,
        payment
      ) =>
        total +
        payment.amount,
      0
    );


  const expected =
    members.length *
    trip.contributionPerPerson;


  const remaining =
    Math.max(
      expected -
        collected,
      0
    );


  return (
    <AdminPageShell
      tripName={
        trip.name
      }
      title="Payments"
      description="Record, review and reverse trip contributions."
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
          Track all contribution transactions.
        </p>


        <AdminCreateAction
          mode="payment"
          tripId={
            trip.id
          }
          members={
            members
          }
          contributionPerPerson={
            trip.contributionPerPerson
          }
        />

      </div>


      <section
        className="
          mt-4
          grid
          grid-cols-2
          gap-3

          xl:grid-cols-4
        "
      >

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">

          <Banknote
            size={17}
            className="text-emerald-600"
          />

          <p className="mt-3 text-xs text-zinc-500">
            Collected
          </p>

          <p className="mt-1 text-lg font-semibold tabular-nums">
            {formatMoney(
              collected
            )}
          </p>

        </div>


        <div className="rounded-2xl border border-zinc-200 bg-white p-4">

          <Target
            size={17}
            className="text-violet-600"
          />

          <p className="mt-3 text-xs text-zinc-500">
            Expected
          </p>

          <p className="mt-1 text-lg font-semibold tabular-nums">
            {formatMoney(
              expected
            )}
          </p>

        </div>


        <div className="rounded-2xl border border-zinc-200 bg-white p-4">

          <Clock3
            size={17}
            className="text-amber-600"
          />

          <p className="mt-3 text-xs text-zinc-500">
            Remaining
          </p>

          <p className="mt-1 text-lg font-semibold tabular-nums">
            {formatMoney(
              remaining
            )}
          </p>

        </div>


        <div className="rounded-2xl border border-zinc-200 bg-white p-4">

          <WalletCards
            size={17}
            className="text-sky-600"
          />

          <p className="mt-3 text-xs text-zinc-500">
            Transactions
          </p>

          <p className="mt-1 text-lg font-semibold">
            {payments.length}
          </p>

        </div>

      </section>


      <div className="mt-4">

        <AdminPaymentsManager
          payments={
            payments
          }
          members={
            members
          }
        />

      </div>

    </AdminPageShell>
  );
}