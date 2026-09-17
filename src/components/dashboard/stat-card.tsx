"use client";

import type {
  ReactNode,
} from "react";

import {
  motion,
} from "motion/react";


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
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay,
        duration: 0.4,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className={[
        "rounded-[24px] border p-5 shadow-sm transition",
        highlight
          ? "border-zinc-900 bg-zinc-950 text-white"
          : "border-zinc-200 bg-white text-zinc-950",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">

        {/* TEXT */}

        <div className="min-w-0">

          <p
            className={[
              "text-sm font-medium",
              highlight
                ? "text-zinc-300"
                : "text-zinc-500",
            ].join(" ")}
          >
            {title}
          </p>


          <h3
            className="
              mt-4
              text-[1.75rem]
              font-semibold
              leading-tight
              tracking-tight

              lg:text-[1.9rem]
            "
          >
            {value}
          </h3>


          <p
            className={[
              "mt-2 text-xs leading-5",
              highlight
                ? "text-zinc-400"
                : "text-zinc-500",
            ].join(" ")}
          >
            {description}
          </p>

        </div>


        {/* ICON */}

        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            highlight
              ? "bg-white/10 text-white"
              : "bg-zinc-50 text-zinc-500",
          ].join(" ")}
        >
          {icon}
        </div>

      </div>
    </motion.div>
  );
}