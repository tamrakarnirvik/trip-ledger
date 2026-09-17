"use client";

import {
  Check,
  Clock3,
  UsersRound,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  formatMoney,
} from "@/lib/format";


type ContributionProgressProps = {
  collected: number;
  expected: number;
  fullyPaidMembers: number;
  totalMembers: number;
};


export function ContributionProgress({
  collected,
  expected,
  fullyPaidMembers,
  totalMembers,
}: ContributionProgressProps) {
  const percentage =
    expected > 0
      ? Math.min(
          Math.round(
            (collected / expected) *
              100
          ),
          100
        )
      : 0;


  const remaining =
    Math.max(
      expected - collected,
      0
    );


  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.18,
        duration: 0.4,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="
        rounded-[24px]
        border
        border-zinc-200
        bg-white
        p-5
        shadow-sm
      "
    >

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">

        <div>

          <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
            Contribution Progress
          </h2>


          <p className="mt-1.5 text-sm text-zinc-500">
            {formatMoney(
              collected
            )}{" "}
            collected from{" "}
            {formatMoney(
              expected
            )}
          </p>

        </div>


        <p className="text-2xl font-semibold tracking-tight text-zinc-950">
          {percentage}%
        </p>

      </div>


      {/* PROGRESS BAR */}

      <div className="mt-6">

        <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100">

          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${percentage}%`,
            }}
            transition={{
              duration: 0.7,
              delay: 0.25,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="h-full rounded-full bg-zinc-950"
          />

        </div>

      </div>


      {/* PROGRESS DETAILS */}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">

        {/* FULLY PAID */}

        <div className="rounded-2xl bg-zinc-50 p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Check
                size={19}
                strokeWidth={2}
              />
            </div>


            <div>

              <p className="text-xs text-zinc-500">
                Fully paid
              </p>

              <p className="mt-1 text-lg font-semibold text-zinc-950">
                {fullyPaidMembers} /{" "}
                {totalMembers}
              </p>

            </div>

          </div>

        </div>


        {/* STILL TO COLLECT */}

        <div className="rounded-2xl bg-zinc-50 p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Clock3
                size={19}
                strokeWidth={2}
              />
            </div>


            <div>

              <p className="text-xs text-zinc-500">
                Still to collect
              </p>

              <p className="mt-1 text-lg font-semibold text-zinc-950">
                {formatMoney(
                  remaining
                )}
              </p>

            </div>

          </div>

        </div>


        {/* GROUP MEMBERS */}

        <div className="rounded-2xl bg-zinc-50 p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <UsersRound
                size={19}
                strokeWidth={2}
              />
            </div>


            <div>

              <p className="text-xs text-zinc-500">
                Group members
              </p>

              <p className="mt-1 text-lg font-semibold text-zinc-950">
                {totalMembers}
              </p>

            </div>

          </div>

        </div>

      </div>

    </motion.section>
  );
}