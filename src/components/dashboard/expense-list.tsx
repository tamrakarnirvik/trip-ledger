"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  BedDouble,
  Car,
  Coffee,
  Eye,
  MoreHorizontal,
  Pencil,
  ReceiptText,
  Shapes,
  Ticket,
  Trash2,
  Utensils,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

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


type ExpenseModalView =
  | "details"
  | "edit";


const categoryLabels: Record<
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


function getCategoryStyle(
  category: ExpenseCategory
) {
  switch (category) {

    case "FOOD":
      return {
        wrapper:
          "bg-amber-50 text-amber-700",
      };


    case "DRINKS":
      return {
        wrapper:
          "bg-sky-50 text-sky-700",
      };


    case "ACCOMMODATION":
      return {
        wrapper:
          "bg-violet-50 text-violet-700",
      };


    case "TRANSPORT":
      return {
        wrapper:
          "bg-emerald-50 text-emerald-700",
      };


    case "ENTERTAINMENT":
      return {
        wrapper:
          "bg-rose-50 text-rose-700",
      };


    default:
      return {
        wrapper:
          "bg-zinc-100 text-zinc-600",
      };
  }
}


function CategoryIcon({
  category,
  size = 17,
}: {
  category: ExpenseCategory;
  size?: number;
}) {

  switch (category) {

    case "FOOD":
      return (
        <Utensils
          size={size}
          strokeWidth={1.8}
        />
      );


    case "DRINKS":
      return (
        <Coffee
          size={size}
          strokeWidth={1.8}
        />
      );


    case "ACCOMMODATION":
      return (
        <BedDouble
          size={size}
          strokeWidth={1.8}
        />
      );


    case "TRANSPORT":
      return (
        <Car
          size={size}
          strokeWidth={1.8}
        />
      );


    case "ENTERTAINMENT":
      return (
        <Ticket
          size={size}
          strokeWidth={1.8}
        />
      );


    default:
      return (
        <Shapes
          size={size}
          strokeWidth={1.8}
        />
      );
  }
}


export function ExpenseList({
  expenses,
  canManage,
}: ExpenseListProps) {

  const router =
    useRouter();


  const [
    selectedExpense,
    setSelectedExpense,
  ] =
    useState<Expense | null>(
      null
    );


  const [
    modalView,
    setModalView,
  ] =
    useState<ExpenseModalView>(
      "details"
    );


  const [
    openMenuId,
    setOpenMenuId,
  ] =
    useState<string | null>(
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


  /*
   * Close action dropdown
   * when clicking outside.
   */
  useEffect(() => {

    if (!openMenuId) {
      return;
    }


    function handlePointerDown(
      event: PointerEvent
    ) {

      const target =
        event.target as HTMLElement;


      const menu =
        target.closest(
          "[data-expense-menu]"
        );


      const clickedMenuId =
        menu?.getAttribute(
          "data-expense-menu"
        );


      if (
        clickedMenuId !==
        openMenuId
      ) {
        setOpenMenuId(
          null
        );
      }

    }


    function handleKeyDown(
      event: KeyboardEvent
    ) {

      if (
        event.key ===
        "Escape"
      ) {
        setOpenMenuId(
          null
        );
      }

    }


    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );


      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [
    openMenuId,
  ]);


  function toggleExpenseMenu(
    expenseId: string
  ) {

    setOpenMenuId(
      (current) =>
        current === expenseId
          ? null
          : expenseId
    );

  }


  function openExpense(
    expense: Expense,
    view: ExpenseModalView
  ) {

    setError("");

    setOpenMenuId(
      null
    );

    setModalView(
      view
    );

    setSelectedExpense(
      expense
    );

  }


  function closeExpense() {

    if (loading) {
      return;
    }


    setSelectedExpense(
      null
    );

    setModalView(
      "details"
    );

    setError("");

  }


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

      setLoading(true);


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


      setOpenMenuId(
        null
      );


      if (
        selectedExpense?.id ===
        expense.id
      ) {

        setSelectedExpense(
          null
        );

      }


      router.refresh();

    } catch (error) {

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete expense."
      );

    } finally {

      setLoading(false);

    }

  }


  async function handleEdit(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    if (!selectedExpense) {
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
          `/api/expenses/${selectedExpense.id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
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


      setSelectedExpense(
        null
      );


      setModalView(
        "details"
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

      {/* =================================
          RECENT EXPENSES
      ================================= */}

      <motion.section
        initial={{
          opacity: 0,
          y: 14,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.42,
          delay: 0.32,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="
          relative
          rounded-[24px]
          border
          border-zinc-200
          bg-white
          shadow-sm
        "
      >

        {/* HEADER */}

        <div className="flex items-start justify-between gap-4 px-5 py-4.5 sm:px-6">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">

              <ReceiptText
                size={17}
                strokeWidth={1.8}
              />

            </div>


            <div className="min-w-0">

              <h2 className="text-base font-semibold tracking-tight text-zinc-950">
                Recent Expenses
              </h2>


              <p className="mt-0.5 hidden text-xs text-zinc-500 sm:block">
                Where the trip money has gone.
              </p>

            </div>

          </div>


          <div className="flex shrink-0 items-center gap-2">

            <span className="hidden rounded-full bg-zinc-100 px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 sm:inline-flex">

              {expenses.length}{" "}

              {expenses.length === 1
                ? "expense"
                : "expenses"}

            </span>


            <Link
              href="/report"
              className="
                inline-flex
                items-center
                rounded-lg
                px-2.5
                py-1.5
                text-xs
                font-medium
                text-zinc-500
                transition
                hover:bg-zinc-100
                hover:text-zinc-950
              "
            >
              View all
            </Link>

          </div>

        </div>


        {/* =================================
            EMPTY STATE
        ================================= */}

        {expenses.length ===
        0 ? (

          <div className="px-6 py-10 text-center">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">

              <ReceiptText
                size={20}
              />

            </div>


            <p className="mt-3 text-sm font-medium text-zinc-600">
              No expenses yet
            </p>


            <p className="mt-1 text-xs text-zinc-400">
              Expenses recorded for this trip will appear here.
            </p>

          </div>

        ) : (

          /* =================================
             EXPENSE ROWS
          ================================= */

          <div className="px-5 pb-5 sm:px-6">

            <div className="divide-y divide-zinc-100 overflow-visible rounded-xl border border-zinc-100">

              {expenses.map(
                (
                  expense,
                  index
                ) => {

                  const style =
                    getCategoryStyle(
                      expense.category
                    );


                  return (

                    <motion.div
                      key={
                        expense.id
                      }
                      initial={{
                        opacity: 0,
                        x: 8,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration:
                          0.3,

                        delay:
                          0.4 +
                          index *
                            0.035,

                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                      className="
                        group
                        relative
                        flex
                        items-center
                        gap-3
                        px-3.5
                        py-3
                        transition-colors
                        duration-150
                        hover:bg-zinc-50/60

                        sm:px-4
                      "
                    >

                      {/* CATEGORY ICON */}

                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          ${style.wrapper}
                        `}
                      >

                        <CategoryIcon
                          category={
                            expense.category
                          }
                        />

                      </div>


                      {/* TITLE / META */}

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-medium text-zinc-900">

                          {
                            expense.title
                          }

                        </p>


                        <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] text-zinc-500">

                          <span className="truncate">

                            {
                              categoryLabels[
                                expense
                                  .category
                              ]
                            }

                          </span>


                          <span className="text-zinc-300">
                            ·
                          </span>


                          <span className="shrink-0">

                            {formatDate(
                              expense.date
                            )}

                          </span>

                        </div>

                      </div>


                      {/* AMOUNT */}

                      <p
                        className="
                          shrink-0
                          whitespace-nowrap
                          text-sm
                          font-semibold
                          tabular-nums
                          text-zinc-900
                        "
                      >

                        {formatMoney(
                          expense.amount
                        )}

                      </p>


                      {/* ACTION */}

                      {canManage && (

                        <div
                          className="relative shrink-0"
                          data-expense-menu={
                            expense.id
                          }
                        >

                          <button
                            type="button"
                            onClick={() =>
                              toggleExpenseMenu(
                                expense.id
                              )
                            }
                            className={`
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-lg
                              transition

                              ${
                                openMenuId ===
                                expense.id
                                  ? "bg-zinc-100 text-zinc-950"
                                  : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950"
                              }
                            `}
                            aria-label={`Actions for ${expense.title}`}
                            aria-haspopup="menu"
                            aria-expanded={
                              openMenuId ===
                              expense.id
                            }
                          >

                            <MoreHorizontal
                              size={17}
                            />

                          </button>


                          {/* DROPDOWN */}

                          {openMenuId ===
                            expense.id && (

                            <motion.div
                              initial={{
                                opacity:
                                  0,

                                scale:
                                  0.96,

                                y:
                                  -4,
                              }}
                              animate={{
                                opacity:
                                  1,

                                scale:
                                  1,

                                y:
                                  0,
                              }}
                              transition={{
                                duration:
                                  0.14,
                              }}
                              role="menu"
                              className="
                                absolute
                                right-0
                                top-9
                                z-50
                                w-44
                                overflow-hidden
                                rounded-xl
                                border
                                border-zinc-200
                                bg-white
                                p-1.5
                                text-left
                                shadow-[0_14px_40px_rgba(0,0,0,0.12)]
                              "
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  openExpense(
                                    expense,
                                    "details"
                                  )
                                }
                                className="
                                  flex
                                  w-full
                                  items-center
                                  gap-2.5
                                  rounded-lg
                                  px-3
                                  py-2
                                  text-xs
                                  font-medium
                                  text-zinc-700
                                  transition
                                  hover:bg-zinc-50
                                "
                              >

                                <Eye
                                  size={
                                    14
                                  }
                                />

                                View details

                              </button>


                              <button
                                type="button"
                                onClick={() =>
                                  openExpense(
                                    expense,
                                    "edit"
                                  )
                                }
                                className="
                                  flex
                                  w-full
                                  items-center
                                  gap-2.5
                                  rounded-lg
                                  px-3
                                  py-2
                                  text-xs
                                  font-medium
                                  text-zinc-700
                                  transition
                                  hover:bg-zinc-50
                                "
                              >

                                <Pencil
                                  size={
                                    14
                                  }
                                />

                                Edit expense

                              </button>


                              <div className="my-1 border-t border-zinc-100" />


                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    expense
                                  )
                                }
                                className="
                                  flex
                                  w-full
                                  items-center
                                  gap-2.5
                                  rounded-lg
                                  px-3
                                  py-2
                                  text-xs
                                  font-medium
                                  text-red-600
                                  transition
                                  hover:bg-red-50
                                "
                              >

                                <Trash2
                                  size={
                                    14
                                  }
                                />

                                Delete expense

                              </button>

                            </motion.div>

                          )}

                        </div>

                      )}

                    </motion.div>

                  );

                }
              )}

            </div>

          </div>

        )}

      </motion.section>


      {/* =================================
          EXPENSE DETAILS / EDIT MODAL
      ================================= */}

      <Modal
        open={
          selectedExpense !==
          null
        }
        onClose={
          closeExpense
        }
        title={
          modalView ===
          "edit"
            ? "Edit expense"
            : selectedExpense
                ?.title ??
              "Expense"
        }
        description={
          modalView ===
          "edit"
            ? "Update the expense details."
            : "Expense information."
        }
      >

        {selectedExpense && (
          <>

            {/* =============================
                DETAILS
            ============================= */}

            {modalView ===
              "details" && (

              <div>

                {/* CATEGORY */}

                <div className="flex items-center gap-3">

                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl

                      ${
                        getCategoryStyle(
                          selectedExpense
                            .category
                        ).wrapper
                      }
                    `}
                  >

                    <CategoryIcon
                      category={
                        selectedExpense.category
                      }
                      size={19}
                    />

                  </div>


                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-zinc-900">

                      {
                        selectedExpense.title
                      }

                    </p>


                    <p className="mt-1 text-xs text-zinc-500">

                      {
                        categoryLabels[
                          selectedExpense
                            .category
                        ]
                      }

                    </p>

                  </div>

                </div>


                {/* DETAILS GRID */}

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl bg-zinc-50 p-4">

                    <p className="text-xs text-zinc-500">
                      Amount
                    </p>


                    <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-950">

                      {formatMoney(
                        selectedExpense.amount
                      )}

                    </p>

                  </div>


                  <div className="rounded-2xl bg-zinc-50 p-4">

                    <p className="text-xs text-zinc-500">
                      Date
                    </p>


                    <p className="mt-1 text-sm font-semibold text-zinc-950">

                      {formatDate(
                        selectedExpense.date
                      )}

                    </p>

                  </div>

                </div>


                {/* ACTIONS */}

                {canManage && (

                  <div className="mt-5 grid grid-cols-2 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setModalView(
                          "edit"
                        )
                      }
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-zinc-200
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-zinc-700
                        transition
                        hover:bg-zinc-50
                      "
                    >

                      <Pencil
                        size={15}
                      />

                      Edit

                    </button>


                    <button
                      type="button"
                      disabled={
                        loading
                      }
                      onClick={() =>
                        handleDelete(
                          selectedExpense
                        )
                      }
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-red-700
                        transition
                        hover:bg-red-100
                        disabled:opacity-40
                      "
                    >

                      <Trash2
                        size={15}
                      />

                      Delete

                    </button>

                  </div>

                )}

              </div>

            )}


            {/* =============================
                EDIT
            ============================= */}

            {modalView ===
              "edit" && (

              <form
                onSubmit={
                  handleEdit
                }
              >

                {/* TITLE */}

                <div>

                  <label
                    htmlFor="edit-expense-title"
                    className={
                      labelClasses
                    }
                  >
                    Expense
                  </label>


                  <input
                    key={
                      `${selectedExpense.id}-title`
                    }
                    id="edit-expense-title"
                    name="title"
                    defaultValue={
                      selectedExpense.title
                    }
                    className={
                      inputClasses
                    }
                    required
                  />

                </div>


                {/* CATEGORY */}

                <div className="mt-4">

                  <label
                    htmlFor="edit-expense-category"
                    className={
                      labelClasses
                    }
                  >
                    Category
                  </label>


                  <select
                    id="edit-expense-category"
                    name="category"
                    defaultValue={
                      selectedExpense.category
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


                {/* AMOUNT + DATE */}

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="edit-expense-amount"
                      className={
                        labelClasses
                      }
                    >
                      Amount
                    </label>


                    <input
                      id="edit-expense-amount"
                      name="amount"
                      type="number"
                      min="1"
                      defaultValue={
                        selectedExpense.amount
                      }
                      className={
                        inputClasses
                      }
                      required
                    />

                  </div>


                  <div>

                    <label
                      htmlFor="edit-expense-date"
                      className={
                        labelClasses
                      }
                    >
                      Date
                    </label>


                    <input
                      id="edit-expense-date"
                      name="date"
                      type="date"
                      defaultValue={
                        selectedExpense.date
                      }
                      className={
                        inputClasses
                      }
                      required
                    />

                  </div>

                </div>


                {/* ERROR */}

                {error && (

                  <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">

                    {error}

                  </p>

                )}


                {/* BUTTONS */}

                <div className="mt-6 flex gap-2">

                  <button
                    type="button"
                    disabled={
                      loading
                    }
                    onClick={() =>
                      setModalView(
                        "details"
                      )
                    }
                    className="
                      flex-1
                      rounded-xl
                      border
                      border-zinc-200
                      px-4
                      py-3
                      text-sm
                      font-medium
                      text-zinc-700
                      transition
                      hover:bg-zinc-50
                      disabled:opacity-40
                    "
                  >
                    Back
                  </button>


                  <button
                    type="submit"
                    disabled={
                      loading
                    }
                    className="
                      flex-1
                      rounded-xl
                      bg-zinc-900
                      px-4
                      py-3
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-zinc-800
                      disabled:opacity-50
                    "
                  >

                    {loading
                      ? "Saving..."
                      : "Save changes"}

                  </button>

                </div>

              </form>

            )}

          </>
        )}

      </Modal>

    </>
  );
}