import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import {
  AdminSectionNav,
} from "@/components/admin/admin-section-nav";

import {
  AppSidebar,
} from "@/components/layout/app-sidebar";


type AdminPageShellProps = {
  tripName: string;
  title: string;
  description: string;
  children: ReactNode;
};


export function AdminPageShell({
  tripName,
  title,
  description,
  children,
}: AdminPageShellProps) {
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

        {/* HEADER */}

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

                sm:text-3xl
              "
            >
              {title}
            </h1>


            <p
              className="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              {description}
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


        <AdminSectionNav />


        <div className="mt-5">
          {children}
        </div>

      </div>

    </main>
  );
}