"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  FileText,
  LayoutDashboard,
  Mountain,
  ReceiptText,
  Settings2,
  UsersRound,
  Wallet,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";


type AppSidebarProps = {
  tripName: string;
  canManage: boolean;
};


type DashboardSection =
  | "dashboard"
  | "members"
  | "expenses"
  | "trip-settings";


type SectionId =
  | DashboardSection
  | "reports";


/*
 * This component is declared OUTSIDE
 * AppSidebar so React does not recreate
 * it during every render.
 */
function ActiveIndicator({
  activeSection,
  section,
}: {
  activeSection: SectionId;
  section: SectionId;
}) {
  if (
    activeSection !==
    section
  ) {
    return null;
  }

  return (
    <span
      className="
        absolute
        -left-2
        top-1/2
        h-5
        w-1
        -translate-y-1/2
        rounded-full
        bg-zinc-950
      "
    />
  );
}


export function AppSidebar({
  tripName,
  canManage,
}: AppSidebarProps) {

  const pathname =
    usePathname();


  /*
   * Only stores the section visible
   * while scrolling on the dashboard.
   */
  const [
    visibleSection,
    setVisibleSection,
  ] =
    useState<DashboardSection>(
      "dashboard"
    );


  /*
   * Reports is determined directly
   * from the current pathname.
   *
   * This avoids calling setState
   * directly inside useEffect.
   */
  const activeSection: SectionId =
    pathname.startsWith(
      "/report"
    )
      ? "reports"
      : visibleSection;


  /*
   * Detect which dashboard section
   * is currently visible.
   */
  useEffect(() => {

    /*
     * Only use the observer
     * on the dashboard page.
     */
    if (pathname !== "/") {
      return;
    }


    const sectionIds: DashboardSection[] =
      [
        "dashboard",
        "expenses",
        "members",
        "trip-settings",
      ];


    const sections =
      sectionIds
        .map((id) =>
          document.getElementById(
            id
          )
        )
        .filter(
          (
            element
          ): element is HTMLElement =>
            element !== null
        );


    const observer =
      new IntersectionObserver(
        (entries) => {

          const visibleEntries =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (
                  first,
                  second
                ) =>
                  second
                    .intersectionRatio -
                  first
                    .intersectionRatio
              );


          if (
            visibleEntries.length ===
            0
          ) {
            return;
          }


          const sectionId =
            visibleEntries[0]
              .target
              .id as DashboardSection;


          /*
           * State update happens inside
           * the observer callback,
           * which is safe.
           */
          setVisibleSection(
            sectionId
          );

        },
        {
          root: null,

          /*
           * Defines the area of the screen
           * used to determine active section.
           */
          rootMargin:
            "-18% 0px -65% 0px",

          threshold: [
            0,
            0.1,
            0.25,
            0.5,
          ],
        }
      );


    sections.forEach(
      (section) => {
        observer.observe(
          section
        );
      }
    );


    return () => {
      observer.disconnect();
    };

  }, [
    pathname,
  ]);


  /*
   * Shared sidebar navigation style.
   */
  function navClasses(
    section: SectionId
  ) {

    const active =
      activeSection ===
      section;


    return `
      group
      relative
      flex
      items-center
      gap-3
      rounded-xl
      px-3
      py-2.5
      text-sm
      font-medium
      transition-all
      duration-200

      ${
        active
          ? "bg-zinc-100 text-zinc-950"
          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"
      }
    `;

  }


  /*
   * Immediately update active state
   * when dashboard navigation is clicked.
   */
  function handleDashboardClick(
    section: DashboardSection
  ) {

    setVisibleSection(
      section
    );

  }


  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        z-40

        hidden
        w-[220px]
        flex-col

        border-r
        border-zinc-200

        bg-white

        px-4
        py-5

        lg:flex
      "
    >

      {/* ===============================
          LOGO
      =============================== */}

      <div className="flex items-center gap-3 px-2">

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-zinc-900
            text-white
            shadow-sm
          "
        >

          <Wallet
            size={17}
            strokeWidth={1.8}
          />

        </div>


        <span
          className="
            text-lg
            font-semibold
            tracking-tight
            text-zinc-950
          "
        >
          Trip Ledger
        </span>

      </div>


      {/* ===============================
          NAVIGATION
      =============================== */}

      <nav className="mt-8 space-y-1">


        {/* DASHBOARD */}

        <Link
          href="/#dashboard"
          onClick={() =>
            handleDashboardClick(
              "dashboard"
            )
          }
          className={
            navClasses(
              "dashboard"
            )
          }
        >

          <ActiveIndicator
            activeSection={
              activeSection
            }
            section="dashboard"
          />


          <LayoutDashboard
            size={18}
            strokeWidth={
              activeSection ===
              "dashboard"
                ? 2
                : 1.7
            }
          />

          <span>
            Dashboard
          </span>

        </Link>


        {/* MEMBERS */}

        <Link
          href="/#members"
          onClick={() =>
            handleDashboardClick(
              "members"
            )
          }
          className={
            navClasses(
              "members"
            )
          }
        >

          <ActiveIndicator
            activeSection={
              activeSection
            }
            section="members"
          />


          <UsersRound
            size={18}
            strokeWidth={
              activeSection ===
              "members"
                ? 2
                : 1.7
            }
          />

          <span>
            Members
          </span>

        </Link>


        {/* EXPENSES */}

        <Link
          href="/#expenses"
          onClick={() =>
            handleDashboardClick(
              "expenses"
            )
          }
          className={
            navClasses(
              "expenses"
            )
          }
        >

          <ActiveIndicator
            activeSection={
              activeSection
            }
            section="expenses"
          />


          <ReceiptText
            size={18}
            strokeWidth={
              activeSection ===
              "expenses"
                ? 2
                : 1.7
            }
          />

          <span>
            Expenses
          </span>

        </Link>


        {/* REPORTS */}

        <Link
          href="/report"
          className={
            navClasses(
              "reports"
            )
          }
        >

          <ActiveIndicator
            activeSection={
              activeSection
            }
            section="reports"
          />


          <FileText
            size={18}
            strokeWidth={
              activeSection ===
              "reports"
                ? 2
                : 1.7
            }
          />

          <span>
            Reports
          </span>

        </Link>


        {/* TRIP SETTINGS */}

        {canManage && (

          <Link
            href="/#trip-settings"
            onClick={() =>
              handleDashboardClick(
                "trip-settings"
              )
            }
            className={
              navClasses(
                "trip-settings"
              )
            }
          >

            <ActiveIndicator
              activeSection={
                activeSection
              }
              section="trip-settings"
            />


            <Settings2
              size={18}
              strokeWidth={
                activeSection ===
                "trip-settings"
                  ? 2
                  : 1.7
              }
            />

            <span>
              Trip Settings
            </span>

          </Link>

        )}

      </nav>


      {/* ===============================
          BOTTOM TRIP CARD
      =============================== */}

      <div className="mt-auto">

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-zinc-200
            bg-zinc-50
          "
        >

          {/* TRIP VISUAL */}

          <div
            className="
              flex
              h-20
              items-center
              justify-center
              bg-gradient-to-br
              from-zinc-100
              to-zinc-200
            "
          >

            <Mountain
              size={30}
              strokeWidth={1.35}
              className="text-zinc-500"
            />

          </div>


          {/* TRIP INFORMATION */}

          <div className="p-4">

            <p
              className="
                truncate
                text-sm
                font-semibold
                text-zinc-950
              "
            >

              {tripName}

            </p>


            <p
              className="
                mt-1
                text-xs
                leading-5
                text-zinc-500
              "
            >

              Good friends.

              <br />

              Great places.

              <br />

              Lasting memories.

            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}