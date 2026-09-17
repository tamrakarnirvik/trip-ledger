"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  Banknote,
  FileText,
  Plus,
  ReceiptText,
  UserPlus,
} from "lucide-react";

import {
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


  function openModal(
    modal: ModalType
  ) {
    setError("");

    setActiveModal(
      modal
    );
  }


  function closeModal() {
    if (loading) {
      return;
    }

    setError("");

    setActiveModal(
      null
    );
  }


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


  async function handleAddMember(
    event:
      React.FormEvent<HTMLFormElement>
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
      setLoading(true);
      setError("");


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
      setLoading(false);
    }
  }


  async function handlePayment(
    event:
      React.FormEvent<HTMLFormElement>
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
      setLoading(true);
      setError("");


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
      setLoading(false);
    }
  }


  async function handleExpense(
    event:
      React.FormEvent<HTMLFormElement>
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
      setLoading(true);
      setError("");


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
      setLoading(false);
    }
  }


  const inputClasses =
    "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100";


  const labelClasses =
    "mb-2 block text-xs font-semibold text-zinc-600";


  return (
    <>

      {/* =================================
          ACTION BUTTONS
          Mobile = fixed bottom navigation
          Desktop = original button row
      ================================= */}

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
          delay: 0.1,
          duration: 0.4,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="
          fixed
          inset-x-0
          bottom-0
          z-50

          border-t
          border-zinc-200
          bg-white/95

          px-2
          pt-2
          pb-[calc(env(safe-area-inset-bottom)+0.55rem)]

          shadow-[0_-8px_25px_rgba(0,0,0,0.06)]
          backdrop-blur-xl

          md:static
          md:z-auto
          md:border-0
          md:bg-transparent
          md:p-0
          md:shadow-none
          md:backdrop-blur-none
        "
      >

        <div
          className="
            mx-auto
            grid
            w-full
            max-w-md
            grid-cols-4
            gap-1

            md:mx-0
            md:flex
            md:max-w-none
            md:flex-wrap
            md:gap-2
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
              flex
              h-14
              min-w-0
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              px-1
              text-[10px]
              font-medium
              leading-tight
              text-zinc-600
              transition

              hover:bg-zinc-100
              active:scale-[0.97]

              md:inline-flex
              md:h-auto
              md:min-h-10
              md:flex-row
              md:gap-2
              md:rounded-xl
              md:border
              md:border-zinc-200
              md:bg-white
              md:px-4
              md:py-2.5
              md:text-sm
              md:font-medium
              md:text-zinc-700

              md:hover:border-zinc-300
              md:hover:bg-zinc-50
              md:active:scale-[0.98]
            "
          >
            <UserPlus
              size={18}
              strokeWidth={1.8}
              className="shrink-0 md:h-4 md:w-4"
            />

            <span className="text-center">
              Add Member
            </span>
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
              flex
              h-14
              min-w-0
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              px-1
              text-[10px]
              font-medium
              leading-tight
              text-zinc-600
              transition

              hover:bg-zinc-100
              active:scale-[0.97]

              disabled:cursor-not-allowed
              disabled:opacity-40

              md:inline-flex
              md:h-auto
              md:min-h-10
              md:flex-row
              md:gap-2
              md:rounded-xl
              md:border
              md:border-zinc-200
              md:bg-white
              md:px-4
              md:py-2.5
              md:text-sm
              md:font-medium
              md:text-zinc-700

              md:hover:border-zinc-300
              md:hover:bg-zinc-50
              md:active:scale-[0.98]
            "
          >
            <Banknote
              size={18}
              strokeWidth={1.8}
              className="shrink-0 md:h-4 md:w-4"
            />

            <span className="text-center">
              Record Payment
            </span>
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
              flex
              h-14
              min-w-0
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              bg-zinc-900
              px-1
              text-[10px]
              font-medium
              leading-tight
              text-white
              transition

              hover:bg-zinc-800
              active:scale-[0.97]

              md:inline-flex
              md:h-auto
              md:min-h-10
              md:flex-row
              md:gap-2
              md:px-4
              md:py-2.5
              md:text-sm
              md:font-medium
              md:active:scale-[0.98]
            "
          >
            <Plus
              size={18}
              strokeWidth={1.8}
              className="shrink-0 md:h-4 md:w-4"
            />

            <span className="text-center">
              Add Expense
            </span>
          </button>


          {/* REPORT */}

          <Link
            href="/report"
            className="
              flex
              h-14
              min-w-0
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              px-1
              text-[10px]
              font-medium
              leading-tight
              text-zinc-600
              transition

              hover:bg-zinc-100
              active:scale-[0.97]

              md:inline-flex
              md:h-auto
              md:min-h-10
              md:flex-row
              md:gap-2
              md:rounded-xl
              md:border
              md:border-zinc-200
              md:bg-white
              md:px-4
              md:py-2.5
              md:text-sm
              md:font-medium
              md:text-zinc-700

              md:hover:border-zinc-300
              md:hover:bg-zinc-50
              md:active:scale-[0.98]
            "
          >
            <FileText
              size={18}
              strokeWidth={1.8}
              className="shrink-0 md:h-4 md:w-4"
            />

            <span className="text-center">
              Report
            </span>
          </Link>

        </div>

      </motion.div>


      {/* =================================
          ADD MEMBER MODAL
      ================================= */}

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
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}


          <div className="mt-6 flex gap-2">

            <button
              type="button"
              onClick={
                closeModal
              }
              className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                loading
              }
              className="flex-1 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading
                ? "Adding..."
                : "Add Member"}
            </button>

          </div>

        </form>
      </Modal>


      {/* =================================
          RECORD PAYMENT MODAL
      ================================= */}

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
              required
            />


            {selectedMember && (
              <p className="mt-2 text-xs text-zinc-500">

                Paid{" "}
                {formatMoney(
                  selectedMember.amountPaid
                )}

                {" · "}

                Remaining{" "}
                {formatMoney(
                  remaining
                )}

              </p>
            )}

          </div>


          {error && (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}


          <div className="mt-6 flex gap-2">

            <button
              type="button"
              onClick={
                closeModal
              }
              className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
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
              className="flex-1 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "Saving..."
                : "Save Payment"}
            </button>

          </div>

        </form>
      </Modal>


      {/* =================================
          ADD EXPENSE MODAL
      ================================= */}

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


          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

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
                required
              />

            </div>


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


          {error && (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}


          <div className="mt-6 flex gap-2">

            <button
              type="button"
              onClick={
                closeModal
              }
              className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                loading
              }
              className="flex-1 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
            >
              <ReceiptText
                size={15}
                className="mr-2 inline"
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