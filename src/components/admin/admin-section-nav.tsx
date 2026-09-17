"use client";

import Link from "next/link";

import {
  CreditCard,
  LayoutDashboard,
  ReceiptText,
  UserCog,
  UsersRound,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";


const items = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: UserCog,
  },
  {
    label: "Members",
    href: "/admin/members",
    icon: UsersRound,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Expenses",
    href: "/admin/expenses",
    icon: ReceiptText,
  },
];


export function AdminSectionNav() {
  const pathname =
    usePathname();


  return (
    <div
      className="
        mt-6
        overflow-x-auto
        border-b
        border-zinc-200
      "
    >
      <nav
        className="
          flex
          min-w-max
          gap-1
        "
        aria-label="Admin navigation"
      >

        {items.map(
          (item) => {

            const Icon =
              item.icon;


            const active =
              pathname ===
              item.href;


            return (
              <Link
                key={
                  item.href
                }
                href={
                  item.href
                }
                className={`
                  relative
                  flex
                  items-center
                  gap-2

                  rounded-t-xl

                  px-3.5
                  py-3

                  text-xs
                  font-medium

                  transition

                  sm:px-4
                  sm:text-sm

                  ${
                    active
                      ? "bg-white text-zinc-950"
                      : "text-zinc-500 hover:bg-white/70 hover:text-zinc-900"
                  }
                `}
              >

                <Icon
                  size={16}
                  strokeWidth={
                    active
                      ? 2
                      : 1.7
                  }
                />

                {item.label}


                {active && (
                  <span
                    className="
                      absolute
                      inset-x-3
                      bottom-0
                      h-0.5
                      rounded-full
                      bg-zinc-950
                    "
                  />
                )}

              </Link>
            );
          }
        )}

      </nav>
    </div>
  );
}