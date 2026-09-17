"use client";

import type {
  ReactNode,
} from "react";

import {
  motion,
} from "motion/react";


type StatTone =
  | "violet"
  | "emerald"
  | "rose"
  | "blue";


type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;

  highlight?: boolean;

  tone?: StatTone;

  delay?: number;
};


const toneStyles: Record<
  StatTone,
  {
    icon: string;
    accent: string;
  }
> = {

  violet: {
    icon:
      "bg-violet-50 text-violet-700",

    accent:
      "bg-violet-500",
  },


  emerald: {
    icon:
      "bg-emerald-50 text-emerald-700",

    accent:
      "bg-emerald-500",
  },


  rose: {
    icon:
      "bg-rose-50 text-rose-700",

    accent:
      "bg-rose-500",
  },


  blue: {
    icon:
      "bg-sky-50 text-sky-700",

    accent:
      "bg-sky-500",
  },

};


export function StatCard({
  title,
  value,
  description,
  icon,

  highlight = false,

  tone = "blue",

  delay = 0,
}: StatCardProps) {

  const toneStyle =
    toneStyles[tone];


  return (

    <motion.div
      initial={{
        opacity: 0,
        y: 12,
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
      whileHover={{
        y: -2,
      }}
      className={`
        relative
        h-full
        min-h-[148px]
        overflow-hidden
        rounded-[24px]
        border
        p-4
        transition-shadow
        duration-200

        sm:min-h-[160px]
        sm:p-5

        ${
          highlight
            ? `
              border-zinc-900
              bg-zinc-950
              text-white
              shadow-[0_10px_30px_rgba(0,0,0,0.10)]
            `
            : `
              border-zinc-200
              bg-white
              text-zinc-950
              shadow-sm
              hover:shadow-md
            `
        }
      `}
    >

      {/* subtle decorative background */}

      {highlight && (

        <div
          className="
            pointer-events-none
            absolute
            -right-8
            -top-8
            h-28
            w-28
            rounded-full
            bg-white/[0.035]
          "
        />

      )}


      <div className="relative flex h-full flex-col">

        {/* TOP */}

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              {/* SMALL ACCENT */}

              {!highlight && (

                <span
                  className={`
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    ${toneStyle.accent}
                  `}
                />

              )}


              <p
                className={`
                  truncate
                  text-[11px]
                  font-medium

                  sm:text-xs

                  ${
                    highlight
                      ? "text-zinc-300"
                      : "text-zinc-500"
                  }
                `}
              >

                {title}

              </p>

            </div>

          </div>


          {/* ICON */}

          <div
            className={`
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl

              sm:h-10
              sm:w-10

              ${
                highlight
                  ? "bg-white/10 text-white"
                  : toneStyle.icon
              }
            `}
          >

            {icon}

          </div>

        </div>


        {/* VALUE */}

        <div className="mt-4">

          <p
            className={`
              whitespace-nowrap
              text-[1.35rem]
              font-semibold
              leading-none
              tracking-tight
              tabular-nums

              sm:text-[1.65rem]
              xl:text-[1.75rem]

              ${
                highlight
                  ? "text-white"
                  : "text-zinc-950"
              }
            `}
          >

            {value}

          </p>

        </div>


        {/* DESCRIPTION */}

        <div className="mt-auto pt-3">

          <p
            className={`
              text-[10px]
              leading-4

              sm:text-xs
              sm:leading-5

              ${
                highlight
                  ? "text-zinc-400"
                  : "text-zinc-500"
              }
            `}
          >

            {description}

          </p>

        </div>

      </div>

    </motion.div>

  );
}