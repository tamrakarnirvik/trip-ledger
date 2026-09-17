import * as motion from "motion/react-client";

import {
  formatMoney,
} from "@/lib/format";

import type {
  Expense,
  ExpenseCategory,
} from "@/types/trip";

type ExpenseSummaryProps = {
  expenses: Expense[];
};

const labels: Record<
  ExpenseCategory,
  string
> = {
  ACCOMMODATION:
    "Accommodation",

  FOOD:
    "Food",

  DRINKS:
    "Drinks",

  TRANSPORT:
    "Transport",

  ENTERTAINMENT:
    "Entertainment",

  OTHER:
    "Other",
};

const categoryOrder:
  ExpenseCategory[] = [
    "ACCOMMODATION",
    "FOOD",
    "DRINKS",
    "TRANSPORT",
    "ENTERTAINMENT",
    "OTHER",
  ];

export function ExpenseSummary({
  expenses,
}: ExpenseSummaryProps) {
  const total =
    expenses.reduce(
      (
        sum,
        expense
      ) =>
        sum +
        expense.amount,
      0
    );

  const summaries =
    categoryOrder
      .map(
        (category) => {
          const amount =
            expenses
              .filter(
                (expense) =>
                  expense.category ===
                  category
              )
              .reduce(
                (
                  sum,
                  expense
                ) =>
                  sum +
                  expense.amount,
                0
              );

          return {
            category,
            amount,
          };
        }
      )
      .filter(
        (item) =>
          item.amount > 0
      );

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: 0.5,
      }}
      className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6"
    >

      <div className="flex items-start justify-between gap-4">

        <div>

          <h2 className="text-base font-semibold text-zinc-950">
            Spending by Category
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Breakdown of trip expenses.
          </p>

        </div>

        <p className="text-sm font-semibold text-zinc-950">
          {formatMoney(
            total
          )}
        </p>

      </div>

      {summaries.length ===
      0 ? (

        <p className="mt-6 text-sm text-zinc-500">
          No expenses recorded yet.
        </p>

      ) : (

        <div className="mt-6 space-y-5">

          {summaries.map(
            (
              item,
              index
            ) => {

              const percentage =
                total === 0
                  ? 0
                  : Math.round(
                      (
                        item.amount /
                        total
                      ) *
                        100
                    );

              return (
                <div
                  key={
                    item.category
                  }
                >

                  <div className="flex items-center justify-between gap-3">

                    <p className="text-sm font-medium text-zinc-700">
                      {
                        labels[
                          item
                            .category
                        ]
                      }
                    </p>

                    <div className="text-right">

                      <p className="text-sm font-semibold text-zinc-950">
                        {formatMoney(
                          item.amount
                        )}
                      </p>

                      <p className="text-[11px] text-zinc-400">
                        {
                          percentage
                        }
                        %
                      </p>

                    </div>

                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${percentage}%`,
                      }}
                      transition={{
                        duration:
                          0.7,

                        delay:
                          0.55 +
                          index *
                            0.07,
                      }}
                      className="h-full rounded-full bg-zinc-800"
                    />

                  </div>

                </div>
              );
            }
          )}

        </div>

      )}

    </motion.section>
  );
}