"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Banknote,
  Plus,
  ReceiptText,
  UserPlus,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  Modal,
} from "@/components/ui/modal";

import {
  formatMoney,
} from "@/lib/format";


type ActionMode =
  | "member"
  | "payment"
  | "expense";


type Member = {
  id: string;
  name: string;
  amountPaid: number;
};


type AdminCreateActionProps = {
  mode: ActionMode;
  tripId: string;
  members?: Member[];
  contributionPerPerson?: number;
};


function getToday() {
  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}


export function AdminCreateAction({
  mode,
  tripId,
  members = [],
  contributionPerPerson = 0,
}: AdminCreateActionProps) {
  const router =
    useRouter();


  const [
    open,
    setOpen,
  ] =
    useState(false);


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
      members[0]?.id ??
        ""
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


    if (
      !response.ok
    ) {
      throw new Error(
        data?.error ??
          "Unable to save."
      );
    }
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    const form =
      event.currentTarget;


    const formData =
      new FormData(
        form
      );


    try {
      setLoading(
        true
      );

      setError(
        ""
      );


      if (
        mode ===
        "member"
      ) {
        await sendRequest(
          "/api/members",
          {
            name:
              String(
                formData.get(
                  "name"
                ) ?? ""
              ).trim(),

            tripId,
          }
        );
      }


      if (
        mode ===
        "payment"
      ) {
        await sendRequest(
          "/api/contributions",
          {
            memberId:
              String(
                formData.get(
                  "memberId"
                ) ?? ""
              ),

            amount:
              Number(
                formData.get(
                  "amount"
                )
              ),
          }
        );
      }


      if (
        mode ===
        "expense"
      ) {
        await sendRequest(
          "/api/expenses",
          {
            title:
              String(
                formData.get(
                  "title"
                ) ?? ""
              ),

            category:
              String(
                formData.get(
                  "category"
                ) ?? ""
              ),

            amount:
              Number(
                formData.get(
                  "amount"
                )
              ),

            date:
              String(
                formData.get(
                  "date"
                ) ?? ""
              ),

            tripId,
          }
        );
      }


      form.reset();


      setOpen(
        false
      );


      router.refresh();

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save."
      );
    } finally {
      setLoading(
        false
      );
    }
  }


  const inputClasses =
    "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100";


  let buttonLabel =
    "Add";


  if (
    mode ===
    "member"
  ) {
    buttonLabel =
      "Add Member";
  }


  if (
    mode ===
    "payment"
  ) {
    buttonLabel =
      "Record Payment";
  }


  if (
    mode ===
    "expense"
  ) {
    buttonLabel =
      "Add Expense";
  }


  return (
    <>

      <button
        type="button"
        onClick={() => {
          setError(
            ""
          );

          setOpen(
            true
          );
        }}
        disabled={
          mode ===
            "payment" &&
          members.length ===
            0
        }
        className="
          inline-flex
          h-10
          items-center
          gap-2

          rounded-xl

          bg-zinc-950

          px-4

          text-sm
          font-medium
          text-white

          transition

          hover:bg-zinc-800

          active:scale-[0.98]

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >

        {mode ===
          "member" && (
          <UserPlus
            size={16}
          />
        )}


        {mode ===
          "payment" && (
          <Banknote
            size={16}
          />
        )}


        {mode ===
          "expense" && (
          <Plus
            size={16}
          />
        )}


        {buttonLabel}

      </button>


      <Modal
        open={
          open
        }
        onClose={() => {
          if (
            !loading
          ) {
            setOpen(
              false
            );

            setError(
              ""
            );
          }
        }}
        title={
          buttonLabel
        }
        description={
          mode === "member"
            ? "Add another member to the trip."
            : mode ===
                "payment"
              ? "Record a contribution received from a member."
              : "Record a new trip expense."
        }
      >

        <form
          onSubmit={
            handleSubmit
          }
        >

          {/* MEMBER FORM */}

          {mode ===
            "member" && (
            <div>

              <label className="mb-2 block text-xs font-semibold text-zinc-600">
                Name
              </label>


              <input
                name="name"
                type="text"
                placeholder="Member name"
                className={
                  inputClasses
                }
                autoFocus
                required
              />

            </div>
          )}


          {/* PAYMENT FORM */}

          {mode ===
            "payment" && (
            <>

              <div>

                <label className="mb-2 block text-xs font-semibold text-zinc-600">
                  Member
                </label>


                <select
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

                <label className="mb-2 block text-xs font-semibold text-zinc-600">
                  Amount
                </label>


                <input
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
                  <div
                    className="
                      mt-3
                      flex
                      justify-between

                      rounded-xl
                      bg-zinc-50

                      px-3
                      py-2.5

                      text-xs
                    "
                  >

                    <span className="text-zinc-500">
                      Paid{" "}
                      {formatMoney(
                        selectedMember.amountPaid
                      )}
                    </span>


                    <span className="font-medium text-zinc-700">
                      {formatMoney(
                        remaining
                      )}{" "}
                      left
                    </span>

                  </div>
                )}

              </div>

            </>
          )}


          {/* EXPENSE FORM */}

          {mode ===
            "expense" && (
            <>

              <div>

                <label className="mb-2 block text-xs font-semibold text-zinc-600">
                  Expense
                </label>


                <input
                  name="title"
                  placeholder="e.g. Villa rent"
                  className={
                    inputClasses
                  }
                  required
                />

              </div>


              <div className="mt-4">

                <label className="mb-2 block text-xs font-semibold text-zinc-600">
                  Category
                </label>


                <select
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


              <div className="mt-4 grid grid-cols-2 gap-3">

                <div>

                  <label className="mb-2 block text-xs font-semibold text-zinc-600">
                    Amount
                  </label>


                  <input
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

                  <label className="mb-2 block text-xs font-semibold text-zinc-600">
                    Date
                  </label>


                  <input
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

            </>
          )}


          {error && (
            <p
              className="
                mt-3

                rounded-xl
                bg-red-50

                px-3
                py-2

                text-xs
                text-red-700
              "
            >
              {error}
            </p>
          )}


          <div className="mt-5 flex gap-2">

            <button
              type="button"
              onClick={() =>
                setOpen(
                  false
                )
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
              "
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                loading ||
                (
                  mode ===
                    "payment" &&
                  remaining <=
                    0
                )
              }
              className="
                flex-1

                rounded-xl

                bg-zinc-950

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
                : buttonLabel}

            </button>

          </div>


          {mode ===
            "expense" && (
            <ReceiptText
              className="hidden"
            />
          )}

        </form>

      </Modal>

    </>
  );
}