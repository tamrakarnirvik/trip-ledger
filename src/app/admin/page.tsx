import {
  ArrowLeft,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from "lucide-react";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import {
  AppSidebar,
} from "@/components/layout/app-sidebar";

import {
  getCurrentSession,
} from "@/lib/session";

import prisma from "@/lib/prisma";


export const dynamic =
  "force-dynamic";


function formatAdminDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(date);
}


export default async function AdminPage() {

  /*
   * ===============================
   * AUTHENTICATION
   * ===============================
   */

  const session =
    await getCurrentSession();


  if (!session) {
    redirect(
      "/login"
    );
  }


  /*
   * Only Treasurer accounts
   * can enter /admin.
   */
  if (
    session.user.role !==
    "TREASURER"
  ) {
    redirect(
      "/"
    );
  }


  /*
   * ===============================
   * LOAD DATA
   * ===============================
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
        select: {
          name: true,
        },
      }),

    ]);


  /*
   * ===============================
   * ADMIN STATISTICS
   * ===============================
   */

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


  const verifiedCount =
    users.filter(
      (user) =>
        user.emailVerified
    ).length;


  const tripName =
    trip?.name ??
    "Trip Ledger";


  return (
    <main
      className="
        min-h-screen
        bg-[#f7f7f8]
        text-zinc-950
      "
    >

      {/* ==========================
          SIDEBAR
      ========================== */}

      <AppSidebar
        tripName={
          tripName
        }
        canManage
      />


      {/* ==========================
          PAGE
      ========================== */}

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

        {/* ==========================
            HEADER
        ========================== */}

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
              Manage TripLedger users and system access.
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
              hover:text-zinc-950
            "
          >

            <ArrowLeft
              size={15}
            />

            Dashboard

          </Link>

        </header>


        {/* ==========================
            STAT CARDS
        ========================== */}

        <section
          className="
            mt-7
            grid
            grid-cols-2
            gap-3

            sm:gap-4

            xl:grid-cols-4
          "
        >

          {/* TOTAL USERS */}

          <div
            className="
              rounded-[22px]
              border
              border-zinc-200
              bg-white
              p-4
              shadow-sm

              sm:p-5
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
                  Total Users
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
                  h-10
                  w-10
                  items-center
                  justify-center

                  rounded-xl

                  bg-violet-50
                  text-violet-700
                "
              >

                <UsersRound
                  size={18}
                />

              </div>

            </div>

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

              sm:p-5
            "
          >

            <p
              className="
                text-xs
                font-medium
                text-zinc-500
              "
            >
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


          {/* FRIENDS */}

          <div
            className="
              rounded-[22px]
              border
              border-zinc-200
              bg-white
              p-4
              shadow-sm

              sm:p-5
            "
          >

            <p
              className="
                text-xs
                font-medium
                text-zinc-500
              "
            >
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


          {/* VERIFIED */}

          <div
            className="
              rounded-[22px]
              border
              border-zinc-900
              bg-zinc-950
              p-4
              text-white

              shadow-[0_10px_30px_rgba(0,0,0,0.08)]

              sm:p-5
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
                  Verified
                </p>


                <p
                  className="
                    mt-3
                    text-2xl
                    font-semibold
                    tabular-nums
                  "
                >
                  {verifiedCount}
                </p>

              </div>


              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center

                  rounded-xl

                  bg-white/10
                  text-white
                "
              >

                <UserCheck
                  size={18}
                />

              </div>

            </div>

          </div>

        </section>


        {/* ==========================
            USERS TABLE
        ========================== */}

        <section
          className="
            mt-5
            rounded-[24px]
            border
            border-zinc-200
            bg-white
            shadow-sm
          "
        >

          {/* HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-4

              border-b
              border-zinc-100

              px-5
              py-4

              sm:px-6
            "
          >

            <div>

              <h2
                className="
                  text-base
                  font-semibold
                  text-zinc-950
                "
              >
                Registered Users
              </h2>


              <p
                className="
                  mt-1
                  text-xs
                  text-zinc-500
                "
              >
                Accounts registered with TripLedger.
              </p>

            </div>


            <span
              className="
                rounded-full
                bg-zinc-100
                px-2.5
                py-1.5

                text-[11px]
                font-medium
                text-zinc-600
              "
            >
              {users.length} users
            </span>

          </div>


          {/* DESKTOP TABLE */}

          <div
            className="
              hidden
              overflow-x-auto

              md:block
            "
          >

            <table
              className="
                w-full
                border-collapse
                text-left
              "
            >

              <thead>

                <tr
                  className="
                    border-b
                    border-zinc-100

                    text-[11px]
                    font-medium
                    uppercase
                    tracking-wide
                    text-zinc-400
                  "
                >

                  <th
                    className="
                      px-6
                      py-3
                    "
                  >
                    User
                  </th>


                  <th
                    className="
                      px-4
                      py-3
                    "
                  >
                    Role
                  </th>


                  <th
                    className="
                      px-4
                      py-3
                    "
                  >
                    Verification
                  </th>


                  <th
                    className="
                      px-4
                      py-3
                    "
                  >
                    Joined
                  </th>

                </tr>

              </thead>


              <tbody>

                {users.map(
                  (user) => {

                    const initial =
                      user.name
                        ?.trim()
                        .charAt(0)
                        .toUpperCase() ||
                      user.email
                        .charAt(0)
                        .toUpperCase();


                    const isCurrentUser =
                      user.id ===
                      session.user.id;


                    return (

                      <tr
                        key={
                          user.id
                        }
                        className="
                          border-b
                          border-zinc-100

                          last:border-b-0

                          transition

                          hover:bg-zinc-50/60
                        "
                      >

                        {/* USER */}

                        <td
                          className="
                            px-6
                            py-4
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center

                                rounded-xl

                                bg-zinc-100

                                text-xs
                                font-semibold
                                text-zinc-700
                              "
                            >
                              {initial}
                            </div>


                            <div
                              className="
                                min-w-0
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-2
                                "
                              >

                                <p
                                  className="
                                    truncate
                                    text-sm
                                    font-medium
                                    text-zinc-900
                                  "
                                >
                                  {user.name ||
                                    "Unnamed User"}
                                </p>


                                {isCurrentUser && (

                                  <span
                                    className="
                                      rounded-full
                                      bg-zinc-100
                                      px-2
                                      py-0.5

                                      text-[10px]
                                      font-medium
                                      text-zinc-500
                                    "
                                  >
                                    You
                                  </span>

                                )}

                              </div>


                              <p
                                className="
                                  mt-0.5
                                  truncate
                                  text-xs
                                  text-zinc-500
                                "
                              >
                                {user.email}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* ROLE */}

                        <td
                          className="
                            px-4
                            py-4
                          "
                        >

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-2.5
                              py-1

                              text-[11px]
                              font-medium

                              ${
                                user.role ===
                                "TREASURER"
                                  ? "bg-zinc-950 text-white"
                                  : "bg-zinc-100 text-zinc-600"
                              }
                            `}
                          >
                            {
                              user.role ===
                              "TREASURER"
                                ? "Treasurer"
                                : "Friend"
                            }
                          </span>

                        </td>


                        {/* VERIFICATION */}

                        <td
                          className="
                            px-4
                            py-4
                          "
                        >

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-2.5
                              py-1

                              text-[11px]
                              font-medium

                              ${
                                user.emailVerified
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }
                            `}
                          >

                            {user.emailVerified
                              ? "Verified"
                              : "Pending"}

                          </span>

                        </td>


                        {/* DATE */}

                        <td
                          className="
                            whitespace-nowrap
                            px-4
                            py-4

                            text-xs
                            text-zinc-500
                          "
                        >
                          {formatAdminDate(
                            user.createdAt
                          )}
                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>


          {/* MOBILE USER CARDS */}

          <div
            className="
              divide-y
              divide-zinc-100

              md:hidden
            "
          >

            {users.map(
              (user) => {

                const initial =
                  user.name
                    ?.trim()
                    .charAt(0)
                    .toUpperCase() ||
                  user.email
                    .charAt(0)
                    .toUpperCase();


                return (

                  <div
                    key={
                      user.id
                    }
                    className="
                      px-5
                      py-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center

                          rounded-xl

                          bg-zinc-100

                          text-xs
                          font-semibold
                          text-zinc-700
                        "
                      >
                        {initial}
                      </div>


                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >

                        <p
                          className="
                            truncate
                            text-sm
                            font-medium
                            text-zinc-900
                          "
                        >
                          {user.name ||
                            "Unnamed User"}
                        </p>


                        <p
                          className="
                            mt-0.5
                            truncate
                            text-xs
                            text-zinc-500
                          "
                        >
                          {user.email}
                        </p>


                        <div
                          className="
                            mt-3
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >

                          <span
                            className={`
                              rounded-full
                              px-2.5
                              py-1

                              text-[10px]
                              font-medium

                              ${
                                user.role ===
                                "TREASURER"
                                  ? "bg-zinc-950 text-white"
                                  : "bg-zinc-100 text-zinc-600"
                              }
                            `}
                          >

                            {user.role ===
                            "TREASURER"
                              ? "Treasurer"
                              : "Friend"}

                          </span>


                          <span
                            className={`
                              rounded-full
                              px-2.5
                              py-1

                              text-[10px]
                              font-medium

                              ${
                                user.emailVerified
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }
                            `}
                          >

                            {user.emailVerified
                              ? "Verified"
                              : "Pending"}

                          </span>


                          <span
                            className="
                              text-[10px]
                              text-zinc-400
                            "
                          >
                            {formatAdminDate(
                              user.createdAt
                            )}
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </section>

      </div>

    </main>
  );
}