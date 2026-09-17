import type { ReactNode } from "react";
import * as motion from "motion/react-client";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  highlight?: boolean;
  delay?: number;
};

export function StatCard({
  title,
  value,
  description,
  icon,
  highlight = false,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -3,
        transition: {
          duration: 0.18,
        },
      }}
      className={`rounded-3xl border p-5 ${
        highlight
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white text-zinc-950"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p
          className={`text-sm font-medium ${
            highlight
              ? "text-zinc-400"
              : "text-zinc-500"
          }`}
        >
          {title}
        </p>

        <motion.div
          whileHover={{
            rotate: 4,
            scale: 1.05,
          }}
          transition={{
            duration: 0.2,
          }}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
            highlight
              ? "bg-white/10 text-white"
              : "bg-zinc-100 text-zinc-700"
          }`}
        >
          {icon}
        </motion.div>
      </div>

      <div className="mt-7">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {value}
        </h2>

        <p
          className={`mt-2 text-xs ${
            highlight
              ? "text-zinc-400"
              : "text-zinc-500"
          }`}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}