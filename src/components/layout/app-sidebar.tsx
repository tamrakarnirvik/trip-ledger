import Link from "next/link";

import {
  FileText,
  LayoutDashboard,
  Mountain,
  ReceiptText,
  Settings2,
  UsersRound,
} from "lucide-react";

type AppSidebarProps = {
  tripName: string;
};

export function AppSidebar({
  tripName,
}: AppSidebarProps) {
  return (
    <aside
      className="
        fixed inset-y-0 left-0 z-40
        hidden w-[220px]
        flex-col
        border-r border-zinc-200
        bg-white
        px-4 py-5
        lg:flex
      "
    >
      {/* LOGO */}

      <div className="flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white">
          <Mountain
            size={18}
            strokeWidth={1.8}
          />
        </div>

        <span className="text-lg font-semibold tracking-tight text-zinc-950">
          Trip Ledger
        </span>
      </div>


      {/* NAVIGATION */}

      <nav className="mt-8 space-y-1">

        <Link
          href="/"
          className="
            flex items-center gap-3
            rounded-xl
            bg-zinc-100
            px-3 py-3
            text-sm font-medium
            text-zinc-950
          "
        >
          <LayoutDashboard size={18} />

          Dashboard
        </Link>


        <Link
          href="#members"
          className="
            flex items-center gap-3
            rounded-xl
            px-3 py-3
            text-sm font-medium
            text-zinc-500
            transition
            hover:bg-zinc-50
            hover:text-zinc-950
          "
        >
          <UsersRound size={18} />

          Members
        </Link>


        <Link
          href="#expenses"
          className="
            flex items-center gap-3
            rounded-xl
            px-3 py-3
            text-sm font-medium
            text-zinc-500
            transition
            hover:bg-zinc-50
            hover:text-zinc-950
          "
        >
          <ReceiptText size={18} />

          Expenses
        </Link>


        <Link
          href="/report"
          className="
            flex items-center gap-3
            rounded-xl
            px-3 py-3
            text-sm font-medium
            text-zinc-500
            transition
            hover:bg-zinc-50
            hover:text-zinc-950
          "
        >
          <FileText size={18} />

          Reports
        </Link>


        <Link
          href="#trip-settings"
          className="
            flex items-center gap-3
            rounded-xl
            px-3 py-3
            text-sm font-medium
            text-zinc-500
            transition
            hover:bg-zinc-50
            hover:text-zinc-950
          "
        >
          <Settings2 size={18} />

          Trip Settings
        </Link>

      </nav>


      {/* BOTTOM TRIP CARD */}

      <div className="mt-auto">

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">

          <div className="flex h-20 items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
            <Mountain
              size={32}
              strokeWidth={1.4}
              className="text-zinc-500"
            />
          </div>

          <div className="p-4">

            <p className="text-sm font-semibold text-zinc-950">
              {tripName}
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
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