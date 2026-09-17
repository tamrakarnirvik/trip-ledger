import {
  redirect,
} from "next/navigation";

import {
  CheckCircle2,
  Clock3,
  UsersRound,
} from "lucide-react";

import {
  AdminCreateAction,
} from "@/components/admin/admin-create-action";

import {
  AdminPageShell,
} from "@/components/admin/admin-page-shell";

import {
  MembersList,
} from "@/components/dashboard/members-list";

import {
  getCurrentSession,
} from "@/lib/session";

import prisma from "@/lib/prisma";


export const dynamic =
  "force-dynamic";


export default async function AdminMembersPage() {
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


  const fullyPaid =
    members.filter(
      (member) =>
        member.amountPaid >=
        trip.contributionPerPerson
    ).length;


  const partial =
    members.filter(
      (member) =>
        member.amountPaid > 0 &&
        member.amountPaid <
          trip.contributionPerPerson
    ).length;


  const pending =
    members.filter(
      (member) =>
        member.amountPaid ===
        0
    ).length;


  return (
    <AdminPageShell
      tripName={
        trip.name
      }
      title="Members"
      description="Manage trip members and their contribution status."
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
          {members.length} trip members
        </p>


        <AdminCreateAction
          mode="member"
          tripId={
            trip.id
          }
        />

      </div>


      {/* SUMMARY */}

      <section
        className="
          mt-4
          grid
          grid-cols-2
          gap-3

          lg:grid-cols-4
        "
      >

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <UsersRound
            size={17}
            className="text-violet-600"
          />

          <p className="mt-3 text-xs text-zinc-500">
            Total Members
          </p>

          <p className="mt-1 text-xl font-semibold">
            {members.length}
          </p>
        </div>


        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <CheckCircle2
            size={17}
            className="text-emerald-600"
          />

          <p className="mt-3 text-xs text-zinc-500">
            Fully Paid
          </p>

          <p className="mt-1 text-xl font-semibold">
            {fullyPaid}
          </p>
        </div>


        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <Clock3
            size={17}
            className="text-amber-600"
          />

          <p className="mt-3 text-xs text-zinc-500">
            Partial
          </p>

          <p className="mt-1 text-xl font-semibold">
            {partial}
          </p>
        </div>


        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <Clock3
            size={17}
            className="text-zinc-500"
          />

          <p className="mt-3 text-xs text-zinc-500">
            Pending
          </p>

          <p className="mt-1 text-xl font-semibold">
            {pending}
          </p>
        </div>

      </section>


      <div className="mt-4">

        <MembersList
          members={
            members
          }
          contributionPerPerson={
            trip.contributionPerPerson
          }
          canManage
        />

      </div>

    </AdminPageShell>
  );
}