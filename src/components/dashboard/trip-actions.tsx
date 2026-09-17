"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Banknote,
  FileText,
  Plus,
  ReceiptText,
  UserPlus,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  Modal,
} from "@/components/ui/modal";

import {
  formatMoney,
} from "@/lib/format";


type Member = {
  id: string;
  name: string;
  amountPaid: number;
};


type TripActionsProps = {
  tripId: string;
  members: Member[];
  contributionPerPerson: number;
};


type ModalType =
  | "member"
  | "payment"
  | "expense"
  | null;


/*
 * Get today's date in YYYY-MM-DD
 * format for the expense form.
 */
function getToday() {
  const today =
    new Date();


  const year =
    today.getFullYear();


  const month =
    String(
      today.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      today.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${year}-${month}-${day}`;
}


export function TripActions({
  tripId,
  members,
  contributionPerPerson,
}: TripActionsProps) {

  const router =
    useRouter();


  const [
    activeModal,
    setActiveModal,
  ] =
    useState<ModalType>(
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


  const [
    selectedMemberId,
    setSelectedMemberId,
  ] =
    useState(
      members[0]?.id ?? ""
    );


  const selectedMember =
    useMemo(
      () =>
        members.find(
          (member) =>
            member.id ===
            selectedMemberId
        ),
      [
        members,
        selectedMemberId,
      ]
    );


  const remaining =
    selectedMember
      ? Math.max(
          contributionPerPerson -
            selectedMember.amountPaid,
          0
        )
      : 0;


  /*
   * Open one of the action modals.
   */
  function openModal(
    modal: ModalType
  ) {
    setError("");

    setActiveModal(
      modal
    );
  }


  /*
   * Close active modal.
   */
  function closeModal() {
    if (loading) {
      return;
    }


    setError("");

    setActiveModal(
      null
    );
  }


  /*
   * Shared POST helper.
   */
  async function sendRequest(
    url: string,
    body: object
  ) {
    const response =
      await fetch(
        url,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              body
            ),
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
          "Something went wrong."
      );
    }


    return data;
  }


  /*
   * ADD MEMBER
   */
  async function handleAddMember(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    const form =
      event.currentTarget;


    const formData =
      new FormData(
        form
      );


    const name =
      String(
        formData.get(
          "name"
        ) ?? ""
      ).trim();


    try {

      setLoading(
        true
      );

      setError(
        ""
      );


      await sendRequest(
        "/api/members",
        {
          name,
          tripId,
        }
      );


      form.reset();


      setActiveModal(
        null
      );


      router.refresh();

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Unable to add member."
      );

    } finally {

      setLoading(
        false
      );

    }
  }


  /*
   * RECORD PAYMENT
   */
  async function handlePayment(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    const form =
      event.currentTarget;


    const formData =
      new FormData(
        form
      );


    const memberId =
      String(
        formData.get(
          "memberId"
        ) ?? ""
      );


    const amount =
      Number(
        formData.get(
          "amount"
        )
      );


    try {

      setLoading(
        true
      );

      setError(
        ""
      );


      await sendRequest(
        "/api/contributions",
        {
          memberId,
          amount,
        }
      );


      setActiveModal(
        null
      );


      router.refresh();

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Unable to record payment."
      );

    } finally {

      setLoading(
        false
      );

    }
  }


  /*
   * ADD EXPENSE
   */
  async function handleExpense(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    const form =
      event.currentTarget;


    const formData =
      new FormData(
        form
      );


    const title =
      String(
        formData.get(
          "title"
        ) ?? ""
      );


    const category =
      String(
        formData.get(
          "category"
        ) ?? ""
      );


    const amount =
      Number(
        formData.get(
          "amount"
        )
      );


    const date =
      String(
        formData.get(
          "date"
        ) ?? ""
      );


    try {

      setLoading(
        true
      );

      setError(
        ""
      );


      await sendRequest(
        "/api/expenses",
        {
          title,
          category,
          amount,
          date,
          tripId,
        }
      );


      form.reset();


      setActiveModal(
        null
      );


      router.refresh();

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Unable to add expense."
      );

    } finally {

      setLoading(
        false
      );

    }
  }


  const inputClasses =
    "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100";


  const labelClasses =
    "mb-2 block text-xs font-semibold text-zinc-600";


  return (
    <>

      {/* ==========================================
          DESKTOP ACTION BUTTONS
          Hidden below md
      ========================================== */}

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
          delay: 0.1,
          duration: 0.35,
        }}
        className="
          hidden
          flex-wrap
          items-center
          gap-2

          md:flex
        "
      >

        {/* ADD MEMBER */}

        <button
          type="button"
          onClick={() =>
            openModal(
              "member"
            )
          }
          className="
            inline-flex
            min-h-10
            items-center
            gap-2
            rounded-xl
            border
            border-zinc-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-zinc-700
            transition

            hover:border-zinc-300
            hover:bg-zinc-50

            active:scale-[0.98]
          "
        >

          <UserPlus
            size={16}
          />

          Add Member

        </button>


        {/* RECORD PAYMENT */}

        <button
          type="button"
          onClick={() =>
            openModal(
              "payment"
            )
          }
          disabled={
            members.length ===
            0
          }
          className="
            inline-flex
            min-h-10
            items-center
            gap-2
            rounded-xl
            border
            border-zinc-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-zinc-700
            transition

            hover:border-zinc-300
            hover:bg-zinc-50

            active:scale-[0.98]

            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >

          <Banknote
            size={16}
          />

          Record Payment

        </button>


        {/* ADD EXPENSE */}

        <button
          type="button"
          onClick={() =>
            openModal(
              "expense"
            )
          }
          className="
            inline-flex
            min-h-10
            items-center
            gap-2
            rounded-xl
            bg-zinc-900
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            transition

            hover:bg-zinc-800

            active:scale-[0.98]
          "
        >

          <Plus
            size={16}
          />

          Add Expense

        </button>


        {/* REPORT */}

        <Link
          href="/report"
          className="
            inline-flex
            min-h-10
            items-center
            gap-2
            rounded-xl
            border
            border-zinc-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-zinc-700
            transition

            hover:border-zinc-300
            hover:bg-zinc-50

            active:scale-[0.98]
          "
        >

          <FileText
            size={16}
          />

          Report

        </Link>

      </motion.div>


      {/* ==========================================
          MOBILE FLOATING NAVIGATION
      ========================================== */}

      <AnimatePresence>

        {activeModal ===
          null && (

          <div
            className="
              fixed
              inset-x-3
              bottom-[calc(env(safe-area-inset-bottom)+0.75rem)]
              z-50
              mx-auto
              max-w-md

              md:hidden
            "
          >

            <motion.nav
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
              exit={{
                opacity: 0,
                y: 14,
                scale: 0.98,
              }}
              transition={{
                duration: 0.22,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              aria-label="Trip actions"
              className="
                grid
                grid-cols-4
                items-end

                rounded-[22px]
                border
                border-zinc-200/90

                bg-white/95

                px-1.5
                pb-1.5
                pt-1.5

                shadow-[0_14px_45px_rgba(0,0,0,0.14)]

                backdrop-blur-xl
              "
            >

              {/* =========================
                  MEMBER
              ========================= */}

              <button
                type="button"
                onClick={() =>
                  openModal(
                    "member"
                  )
                }
                className="
                  group
                  flex
                  min-w-0
                  flex-col
                  items-center
                  justify-center
                  gap-1

                  rounded-2xl

                  px-1
                  py-2

                  text-zinc-500

                  transition

                  active:scale-95
                  active:bg-zinc-100
                "
              >

                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-xl

                    transition

                    group-active:bg-zinc-200
                    group-active:text-zinc-950
                  "
                >

                  <UserPlus
                    size={18}
                    strokeWidth={1.8}
                  />

                </div>


                <span
                  className="
                    max-w-full
                    truncate
                    text-[10px]
                    font-medium
                    leading-none
                  "
                >
                  Member
                </span>

              </button>


              {/* =========================
                  PAYMENT
              ========================= */}

              <button
                type="button"
                disabled={
                  members.length ===
                  0
                }
                onClick={() =>
                  openModal(
                    "payment"
                  )
                }
                className="
                  group
                  flex
                  min-w-0
                  flex-col
                  items-center
                  justify-center
                  gap-1

                  rounded-2xl

                  px-1
                  py-2

                  text-zinc-500

                  transition

                  active:scale-95
                  active:bg-zinc-100

                  disabled:pointer-events-none
                  disabled:opacity-30
                "
              >

                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-xl

                    transition

                    group-active:bg-zinc-200
                    group-active:text-zinc-950
                  "
                >

                  <Banknote
                    size={18}
                    strokeWidth={1.8}
                  />

                </div>


                <span
                  className="
                    max-w-full
                    truncate
                    text-[10px]
                    font-medium
                    leading-none
                  "
                >
                  Payment
                </span>

              </button>


              {/* =========================
                  ADD EXPENSE
                  Primary mobile action
              ========================= */}

              <button
                type="button"
                onClick={() =>
                  openModal(
                    "expense"
                  )
                }
                className="
                  group
                  relative
                  flex
                  min-w-0
                  flex-col
                  items-center
                  justify-end
                  gap-1

                  rounded-2xl

                  px-1
                  pb-2

                  text-zinc-950

                  transition

                  active:scale-[0.97]
                "
              >

                <div
                  className="
                    -mt-5
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center

                    rounded-2xl

                    border-[4px]
                    border-white

                    bg-zinc-950
                    text-white

                    shadow-[0_8px_22px_rgba(0,0,0,0.22)]

                    transition

                    group-active:scale-95
                    group-active:bg-zinc-800
                  "
                >

                  <Plus
                    size={21}
                    strokeWidth={2}
                  />

                </div>


                <span
                  className="
                    max-w-full
                    truncate
                    text-[10px]
                    font-semibold
                    leading-none
                  "
                >
                  Expense
                </span>

              </button>


              {/* =========================
                  REPORT
              ========================= */}

              <Link
                href="/report"
                className="
                  group
                  flex
                  min-w-0
                  flex-col
                  items-center
                  justify-center
                  gap-1

                  rounded-2xl

                  px-1
                  py-2

                  text-zinc-500

                  transition

                  active:scale-95
                  active:bg-zinc-100
                "
              >

                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-xl

                    transition

                    group-active:bg-zinc-200
                    group-active:text-zinc-950
                  "
                >

                  <FileText
                    size={18}
                    strokeWidth={1.8}
                  />

                </div>


                <span
                  className="
                    max-w-full
                    truncate
                    text-[10px]
                    font-medium
                    leading-none
                  "
                >
                  Report
                </span>

              </Link>

            </motion.nav>

          </div>

        )}

      </AnimatePresence>


      {/* ==========================================
          ADD MEMBER MODAL
      ========================================== */}

      <Modal
        open={
          activeModal ===
          "member"
        }
        onClose={
          closeModal
        }
        title="Add member"
        description="Add another person to the trip."
      >

        <form
          onSubmit={
            handleAddMember
          }
        >

          <label
            className={
              labelClasses
            }
            htmlFor="member-name"
          >
            Name
          </label>


          <input
            id="member-name"
            name="name"
            type="text"
            placeholder="e.g. Rohan"
            className={
              inputClasses
            }
            autoFocus
            required
          />


          {error && (

            <p
              className="
                mt-3
                rounded-xl
                bg-red-50
                px-3
                py-2
                text-sm
                text-red-700
              "
            >
              {error}
            </p>

          )}


          <div className="mt-5 flex gap-2">

            <button
              type="button"
              onClick={
                closeModal
              }
              disabled={
                loading
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
              Cancel
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
                ? "Adding..."
                : "Add Member"}

            </button>

          </div>

        </form>

      </Modal>


      {/* ==========================================
          RECORD PAYMENT MODAL
      ========================================== */}

      <Modal
        open={
          activeModal ===
          "payment"
        }
        onClose={
          closeModal
        }
        title="Record payment"
        description="Add money received from a trip member."
      >

        <form
          onSubmit={
            handlePayment
          }
        >

          {/* MEMBER */}

          <div>

            <label
              className={
                labelClasses
              }
              htmlFor="payment-member"
            >
              Member
            </label>


            <select
              id="payment-member"
              name="memberId"
              value={
                selectedMemberId
              }
              onChange={(
                event
              ) =>
                setSelectedMemberId(
                  event
                    .target
                    .value
                )
              }
              className={
                inputClasses
              }
              required
            >

              {members.map(
                (member) => (

                  <option
                    key={
                      member.id
                    }
                    value={
                      member.id
                    }
                  >
                    {
                      member.name
                    }
                  </option>

                )
              )}

            </select>

          </div>


          {/* AMOUNT */}

          <div className="mt-4">

            <label
              className={
                labelClasses
              }
              htmlFor="payment-amount"
            >
              Amount
            </label>


            <input
              id="payment-amount"
              name="amount"
              type="number"
              min="1"
              max={
                remaining ||
                undefined
              }
              placeholder="3500"
              className={
                inputClasses
              }
              inputMode="numeric"
              required
            />


            {selectedMember && (

              <div
                className="
                  mt-3
                  flex
                  items-center
                  justify-between
                  gap-3
                  rounded-xl
                  bg-zinc-50
                  px-3
                  py-2.5
                "
              >

                <div>

                  <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                    Paid
                  </p>

                  <p className="mt-0.5 text-xs font-semibold tabular-nums text-zinc-700">
                    {formatMoney(
                      selectedMember.amountPaid
                    )}
                  </p>

                </div>


                <div className="text-right">

                  <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                    Remaining
                  </p>

                  <p className="mt-0.5 text-xs font-semibold tabular-nums text-zinc-700">
                    {formatMoney(
                      remaining
                    )}
                  </p>

                </div>

              </div>

            )}

          </div>


          {error && (

            <p
              className="
                mt-3
                rounded-xl
                bg-red-50
                px-3
                py-2
                text-sm
                text-red-700
              "
            >
              {error}
            </p>

          )}


          <div className="mt-5 flex gap-2">

            <button
              type="button"
              onClick={
                closeModal
              }
              disabled={
                loading
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
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                loading ||
                remaining <=
                  0
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

                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >

              {loading
                ? "Saving..."
                : "Save Payment"}

            </button>

          </div>

        </form>

      </Modal>


      {/* ==========================================
          ADD EXPENSE MODAL
      ========================================== */}

      <Modal
        open={
          activeModal ===
          "expense"
        }
        onClose={
          closeModal
        }
        title="Add expense"
        description="Record money spent for the trip."
      >

        <form
          onSubmit={
            handleExpense
          }
        >

          {/* EXPENSE TITLE */}

          <div>

            <label
              className={
                labelClasses
              }
              htmlFor="expense-title"
            >
              Expense
            </label>


            <input
              id="expense-title"
              name="title"
              type="text"
              placeholder="e.g. Chicken"
              className={
                inputClasses
              }
              autoFocus
              required
            />

          </div>


          {/* CATEGORY */}

          <div className="mt-4">

            <label
              className={
                labelClasses
              }
              htmlFor="expense-category"
            >
              Category
            </label>


            <select
              id="expense-category"
              name="category"
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

          <div
            className="
              mt-4
              grid
              grid-cols-2
              gap-3
            "
          >

            {/* AMOUNT */}

            <div>

              <label
                className={
                  labelClasses
                }
                htmlFor="expense-amount"
              >
                Amount
              </label>


              <input
                id="expense-amount"
                name="amount"
                type="number"
                min="1"
                placeholder="2500"
                className={
                  inputClasses
                }
                inputMode="numeric"
                required
              />

            </div>


            {/* DATE */}

            <div>

              <label
                className={
                  labelClasses
                }
                htmlFor="expense-date"
              >
                Date
              </label>


              <input
                id="expense-date"
                name="date"
                type="date"
                defaultValue={
                  getToday()
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

            <p
              className="
                mt-3
                rounded-xl
                bg-red-50
                px-3
                py-2
                text-sm
                text-red-700
              "
            >
              {error}
            </p>

          )}


          {/* BUTTONS */}

          <div className="mt-5 flex gap-2">

            <button
              type="button"
              onClick={
                closeModal
              }
              disabled={
                loading
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
              Cancel
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

              <ReceiptText
                size={15}
                className="mr-1.5 inline"
              />


              {loading
                ? "Adding..."
                : "Add Expense"}

            </button>

          </div>

        </form>

      </Modal>

    </>
  );
}