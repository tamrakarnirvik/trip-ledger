"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Modal,
} from "@/components/ui/modal";

import {
  formatDate,
  formatMoney,
} from "@/lib/format";

import type {
  Expense,
  ExpenseCategory,
} from "@/types/trip";

type ExpenseListProps = {
  expenses: Expense[];
  canManage: boolean;
};

const categoryLabels: Record<
  ExpenseCategory,
  string
> = {
  ACCOMMODATION:
    "Accommodation",
  FOOD: "Food",
  DRINKS: "Drinks",
  TRANSPORT: "Transport",
  ENTERTAINMENT:
    "Entertainment",
  OTHER: "Other",
};

export function ExpenseList({
  expenses,
  canManage,
}: ExpenseListProps) {
  const router =
    useRouter();

  const [
    editingExpense,
    setEditingExpense,
  ] =
    useState<Expense | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function handleDelete(
    expense: Expense
  ) {
    const confirmed =
      window.confirm(
        `Delete "${expense.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `/api/expenses/${expense.id}`,
          {
            method:
              "DELETE",
          }
        );

      const data =
        await response
          .json()
          .catch(
            () => null
          );

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Unable to delete expense."
        );
      }

      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete expense."
      );
    }
  }

  async function handleEdit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editingExpense) {
      return;
    }

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `/api/expenses/${editingExpense.id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title:
                formData.get(
                  "title"
                ),

              category:
                formData.get(
                  "category"
                ),

              amount:
                Number(
                  formData.get(
                    "amount"
                  )
                ),

              date:
                formData.get(
                  "date"
                ),
            }),
          }
        );

      const data =
        await response
          .json()
          .catch(
            () => null
          );

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Unable to update expense."
        );
      }

      setEditingExpense(
        null
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update expense."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100";

  const labelClasses =
    "mb-2 block text-xs font-semibold text-zinc-600";

  return (
    <>
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
          delay: 0.44,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="overflow-hidden rounded-3xl border border-zinc-200 bg-white"
      >
        <div className="border-b border-zinc-100 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-950">
                Recent Expenses
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Where the trip
                money has gone.
              </p>
            </div>

            <span className="text-xs font-medium text-zinc-500">
              {
                expenses.length
              }{" "}
              {expenses.length ===
              1
                ? "expense"
                : "expenses"}
            </span>
          </div>
        </div>

        {expenses.length ===
        0 ? (
          <div className="px-6 py-10 text-center text-sm text-zinc-500">
            No expenses
            recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {expenses.map(
              (
                expense,
                index
              ) => (
                <motion.div
                  key={
                    expense.id
                  }
                  initial={{
                    opacity: 0,
                    x: 10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration:
                      0.32,

                    delay:
                      0.5 +
                      index *
                        0.05,

                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  className="group flex items-center gap-3 px-5 py-4 transition hover:bg-zinc-50 sm:px-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-100">
                    <span className="h-2 w-2 rounded-full bg-zinc-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-950">
                      {
                        expense.title
                      }
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {
                        categoryLabels[
                          expense
                            .category
                        ]
                      }
                      {" · "}
                      {formatDate(
                        expense.date
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <p className="mr-1 text-sm font-semibold text-zinc-950">
                      {formatMoney(
                        expense.amount
                      )}
                    </p>

                    {canManage && (
  <>
    <button
      type="button"
      onClick={() => {
        setError("");

        setEditingExpense(
          expense
        );
      }}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white hover:text-zinc-900"
      aria-label={`Edit ${expense.title}`}
    >
      <Pencil
        size={14}
      />
    </button>

    <button
      type="button"
      onClick={() =>
        handleDelete(
          expense
        )
      }
      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
      aria-label={`Delete ${expense.title}`}
    >
      <Trash2
        size={14}
      />
    </button>
  </>
)}
                  </div>
                </motion.div>
              )
            )}
          </div>
        )}
      </motion.section>

      <Modal
        open={
          editingExpense !==
          null
        }
        onClose={() => {
          if (!loading) {
            setEditingExpense(
              null
            );
          }
        }}
        title="Edit expense"
        description="Correct the expense details."
      >
        {editingExpense && (
          <form
            onSubmit={
              handleEdit
            }
          >
            <div>
              <label
                htmlFor="edit-title"
                className={
                  labelClasses
                }
              >
                Expense
              </label>

              <input
                id="edit-title"
                name="title"
                defaultValue={
                  editingExpense.title
                }
                className={
                  inputClasses
                }
                required
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="edit-category"
                className={
                  labelClasses
                }
              >
                Category
              </label>

              <select
                id="edit-category"
                name="category"
                defaultValue={
                  editingExpense.category
                }
                className={
                  inputClasses
                }
              >
                <option value="FOOD">
                  Food
                </option>

                <option value="DRINKS">
                  Drinks
                </option>

                <option value="ACCOMMODATION">
                  Accommodation
                </option>

                <option value="TRANSPORT">
                  Transport
                </option>

                <option value="ENTERTAINMENT">
                  Entertainment
                </option>

                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="edit-amount"
                  className={
                    labelClasses
                  }
                >
                  Amount
                </label>

                <input
                  id="edit-amount"
                  name="amount"
                  type="number"
                  min="1"
                  defaultValue={
                    editingExpense.amount
                  }
                  className={
                    inputClasses
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="edit-date"
                  className={
                    labelClasses
                  }
                >
                  Date
                </label>

                <input
                  id="edit-date"
                  name="date"
                  type="date"
                  defaultValue={
                    editingExpense.date
                  }
                  className={
                    inputClasses
                  }
                  required
                />
              </div>
            </div>

            {error && (
              <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setEditingExpense(
                    null
                  )
                }
                className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  loading
                }
                className="flex-1 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}