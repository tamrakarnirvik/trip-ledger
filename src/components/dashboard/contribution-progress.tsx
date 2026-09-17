import * as motion from "motion/react-client";

import { formatMoney } from "@/lib/format";

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
    expected === 0
      ? 0
      : Math.min(
          Math.round(
            (collected / expected) * 100
          ),
          100
        );

  const remaining = Math.max(
    expected - collected,
    0
  );

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Contribution Progress
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {formatMoney(collected)} collected
            from {formatMoney(expected)}
          </p>
        </div>

        <motion.span
          initial={{
            opacity: 0,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 0.55,
            duration: 0.35,
          }}
          className="text-2xl font-semibold tracking-tight text-zinc-950"
        >
          {percentage}%
        </motion.span>
      </div>

      <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-zinc-100">
        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${percentage}%`,
          }}
          transition={{
            duration: 0.9,
            delay: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="h-full rounded-full bg-zinc-900"
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.48,
            duration: 0.35,
          }}
          className="rounded-2xl bg-zinc-50 p-4"
        >
          <p className="text-xs font-medium text-zinc-500">
            Fully paid
          </p>

          <p className="mt-1 text-lg font-semibold text-zinc-950">
            {fullyPaidMembers} / {totalMembers}
          </p>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.54,
            duration: 0.35,
          }}
          className="rounded-2xl bg-zinc-50 p-4"
        >
          <p className="text-xs font-medium text-zinc-500">
            Still to collect
          </p>

          <p className="mt-1 text-lg font-semibold text-zinc-950">
            {formatMoney(remaining)}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}