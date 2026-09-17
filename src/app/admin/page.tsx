import {
  ArrowLeft,
  Banknote,
  ShieldCheck,
  UsersRound,
  Wallet,
} from "lucide-react";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import {
  AdminUserManager,
} from "@/components/admin/admin-user-manager";

import {
  AppSidebar,
} from "@/components/layout/app-sidebar";

import {
  formatMoney,
} from "@/lib/format";

import {
  getCurrentSession,
} from "@/lib/session";

import prisma from "@/lib/prisma";


export const dynamic =
  "force-dynamic";


export default async function AdminPage() {
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


  /*
   * Load users + trip data.
   */
  const [
    users,
    trip,
  ] =
    await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },

        orderBy: {
          createdAt:
            "desc",
        },
      }),


      prisma.trip.findFirst({
        include: {
          members: {
            include: {
              contributions:
                true,
            },
          },

          expenses:
            true,
        },
      }),
    ]);


  const tripName =
    trip?.name ??
    "Trip Ledger";


  const totalUsers =
    users.length;


  const treasurerCount =
    users.filter(
      (user) =>
        user.role ===
        "TREASURER"
    ).length;


  const friendCount =
    users.filter(
      (user) =>
        user.role ===
        "FRIEND"
    ).length;


  const collected =
    trip?.members.reduce(
      (
        tripTotal,
        member
      ) =>
        tripTotal +
        member.contributions.reduce(
          (
            memberTotal,
            contribution
          ) =>
            memberTotal +
            contribution.amount,
          0
        ),
      0
    ) ?? 0;


  const spent =
    trip?.expenses.reduce(
      (
        total,
        expense
      ) =>
        total +
        expense.amount,
      0
    ) ?? 0;


  const available =
    collected -
    spent;


  const serializedUsers =
    users.map(
      (user) => ({
        id:
          user.id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role,

        emailVerified:
          user.emailVerified,

        createdAt:
          user.createdAt.toISOString(),
      })
    );


  return (
    <main
      className="
        min-h-screen
        bg-[#f7f7f8]
        text-zinc-950
      "
    >

      <AppSidebar
        tripName={
          tripName
        }
        canManage
      />


      <div
        className="
          mx-auto
          max-w-[1600px]

          px-4
          py-6

          sm:px-6
          sm:py-8

          lg:ml-[220px]
          lg:px-10
        "
      >

        {/* =========================
            HEADER
        ========================= */}

        <header
          className="
            flex
            flex-col
            gap-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-2

                text-xs
                font-semibold
                uppercase
                tracking-[0.16em]
                text-zinc-400
              "
            >

              <ShieldCheck
                size={14}
              />

              Administration

            </div>


            <h1
              className="
                mt-2

                text-2xl
                font-semibold
                tracking-tight
                text-zinc-950

                sm:text-3xl
              "
            >
              Admin Panel
            </h1>


            <p
              className="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              Manage users, access and TripLedger activity.
            </p>

          </div>


          <Link
            href="/"
            className="
              inline-flex
              w-fit
              items-center
              gap-2

              rounded-xl

              border
              border-zinc-200

              bg-white

              px-3.5
              py-2.5

              text-sm
              font-medium
              text-zinc-700

              shadow-sm

              transition

              hover:bg-zinc-50
            "
          >

            <ArrowLeft
              size={15}
            />

            Dashboard

          </Link>

        </header>


        {/* =========================
            OVERVIEW
        ========================= */}

        <section
          className="
            mt-7

            grid
            grid-cols-2
            gap-3

            sm:gap-4

            xl:grid-cols-5
          "
        >

          {/* USERS */}

          <div
            className="
              rounded-[22px]
              border
              border-zinc-200
              bg-white
              p-4
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    font-medium
                    text-zinc-500
                  "
                >
                  Users
                </p>


                <p
                  className="
                    mt-3
                    text-2xl
                    font-semibold
                    tabular-nums
                  "
                >
                  {totalUsers}
                </p>

              </div>


              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center

                  rounded-xl

                  bg-violet-50
                  text-violet-700
                "
              >

                <UsersRound
                  size={17}
                />

              </div>

            </div>

          </div>


          {/* FRIENDS */}

          <div
            className="
              rounded-[22px]
              border
              border-zinc-200
              bg-white
              p-4
              shadow-sm
            "
          >

            <p className="text-xs font-medium text-zinc-500">
              Friends
            </p>


            <p
              className="
                mt-3
                text-2xl
                font-semibold
                tabular-nums
              "
            >
              {friendCount}
            </p>

          </div>


          {/* TREASURERS */}

          <div
            className="
              rounded-[22px]
              border
              border-zinc-200
              bg-white
              p-4
              shadow-sm
            "
          >

            <p className="text-xs font-medium text-zinc-500">
              Treasurers
            </p>


            <p
              className="
                mt-3
                text-2xl
                font-semibold
                tabular-nums
              "
            >
              {treasurerCount}
            </p>

          </div>


          {/* COLLECTED */}

          <div
            className="
              rounded-[22px]
              border
              border-zinc-200
              bg-white
              p-4
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
              "
            >

              <div>

                <p className="text-xs font-medium text-zinc-500">
                  Collected
                </p>


                <p
                  className="
                    mt-3
                    text-xl
                    font-semibold
                    tabular-nums
                  "
                >
                  {formatMoney(
                    collected
                  )}
                </p>

              </div>


              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center

                  rounded-xl

                  bg-emerald-50
                  text-emerald-700
                "
              >

                <Banknote
                  size={17}
                />

              </div>

            </div>

          </div>


          {/* AVAILABLE */}

          <div
            className="
              col-span-2

              rounded-[22px]

              border
              border-zinc-900

              bg-zinc-950

              p-4

              text-white

              shadow-[0_10px_30px_rgba(0,0,0,0.08)]

              xl:col-span-1
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    font-medium
                    text-zinc-400
                  "
                >
                  Available
                </p>


                <p
                  className="
                    mt-3
                    text-xl
                    font-semibold
                    tabular-nums
                  "
                >
                  {formatMoney(
                    available
                  )}
                </p>


                <p
                  className="
                    mt-2
                    text-[10px]
                    text-zinc-500
                  "
                >
                  {formatMoney(
                    spent
                  )} spent
                </p>

              </div>


              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center

                  rounded-xl

                  bg-white/10
                "
              >

                <Wallet
                  size={17}
                />

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            USER MANAGEMENT
        ========================= */}

        <AdminUserManager
          users={
            serializedUsers
          }
          currentUserId={
            session.user.id
          }
        />


        <footer
          className="
            mt-8
            pb-5

            text-center
            text-xs
            text-zinc-400
          "
        >
          TripLedger Admin
        </footer>

      </div>

    </main>
  );
}