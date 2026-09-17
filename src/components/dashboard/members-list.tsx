"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  MoreHorizontal,
  RotateCcw,
  Trash2,
  UsersRound,
} from "lucide-react";

import {
  motion,
} from "motion/react";

import {
  Modal,
} from "@/components/ui/modal";

import {
  formatDateTime,
  formatMoney,
} from "@/lib/format";

import type {
  Member,
} from "@/types/trip";


type MembersListProps = {
  members: Member[];
  contributionPerPerson: number;
  canManage: boolean;
};


export function MembersList({
  members,
  contributionPerPerson,
  canManage,
}: MembersListProps) {
  const router =
    useRouter();


  const [
    selectedMemberId,
    setSelectedMemberId,
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


  const selectedMember =
    members.find(
      (member) =>
        member.id ===
        selectedMemberId
    ) ?? null;


  async function handleEdit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    if (!selectedMember) {
      return;
    }


    const form =
      event.currentTarget;


    const formData =
      new FormData(form);


    const name =
      String(
        formData.get("name") ?? ""
      ).trim();


    try {
      setLoading(true);
      setError("");


      const response =
        await fetch(
          `/api/members/${selectedMember.id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
            }),
          }
        );


      const data =
        await response
          .json()
          .catch(() => null);


      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Unable to update member."
        );
      }


      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update member."
      );
    } finally {
      setLoading(false);
    }
  }


  async function handleDeleteMember() {
    if (!selectedMember) {
      return;
    }


    const confirmed =
      window.confirm(
        `Delete ${selectedMember.name} and all of their payment records?`
      );


    if (!confirmed) {
      return;
    }


    try {
      setLoading(true);


      const response =
        await fetch(
          `/api/members/${selectedMember.id}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response
          .json()
          .catch(() => null);


      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Unable to delete member."
        );
      }


      setSelectedMemberId(
        null
      );


      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete member."
      );
    } finally {
      setLoading(false);
    }
  }


  async function handleDeletePayment(
    contributionId: string,
    amount: number
  ) {
    const confirmed =
      window.confirm(
        `Reverse the payment of ${formatMoney(
          amount
        )}?`
      );


    if (!confirmed) {
      return;
    }


    try {
      setLoading(true);


      const response =
        await fetch(
          `/api/contributions/${contributionId}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response
          .json()
          .catch(() => null);


      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Unable to reverse payment."
        );
      }


      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to reverse payment."
      );
    } finally {
      setLoading(false);
    }
  }


  function openMember(
    memberId: string
  ) {
    setError("");

    setSelectedMemberId(
      memberId
    );
  }


  return (
    <>

      {/* =================================
          MEMBERS SECTION
      ================================= */}

      <motion.section
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.34,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="
          overflow-hidden
          rounded-[24px]
          border
          border-zinc-200
          bg-white
          shadow-sm
        "
      >

        {/* HEADER */}

        <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6">

          <div className="flex min-w-0 items-center gap-3">

            {/* ICON */}

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
              <UsersRound
                size={18}
                strokeWidth={1.8}
              />
            </div>


            {/* TITLE */}

            <div className="min-w-0">

              <h2 className="text-base font-semibold text-zinc-950">
                Members
              </h2>

              <p className="mt-0.5 hidden text-xs text-zinc-500 sm:block">
                Contribution status for everyone.
              </p>

            </div>

          </div>


          {/* MEMBER COUNT */}

          <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600">
            {members.length} members
          </span>

        </div>


        {/* =================================
            DESKTOP TABLE
        ================================= */}

        <div className="hidden px-5 pb-5 md:block sm:px-6">

          <div className="overflow-hidden rounded-xl border border-zinc-100">

            <table className="w-full table-fixed border-collapse">

              {/* TABLE HEADER */}

              <thead className="bg-zinc-50">

                <tr className="text-left">

                  <th className="w-[6%] px-3 py-3 text-xs font-medium text-zinc-500">
                    #
                  </th>

                  <th className="w-[24%] px-3 py-3 text-xs font-medium text-zinc-500">
                    Member
                  </th>

                  <th className="w-[25%] px-3 py-3 text-xs font-medium text-zinc-500">
                    Contribution
                  </th>

                  <th className="w-[16%] px-3 py-3 text-xs font-medium text-zinc-500">
                    Status
                  </th>

                  <th className="w-[19%] px-3 py-3 text-xs font-medium text-zinc-500">
                    Remaining
                  </th>

                  <th className="w-[10%] px-3 py-3 text-right text-xs font-medium text-zinc-500">
                    Actions
                  </th>

                </tr>

              </thead>


              {/* TABLE BODY */}

              <tbody className="divide-y divide-zinc-100">

                {members.map(
                  (
                    member,
                    index
                  ) => {
                    const remaining =
                      Math.max(
                        contributionPerPerson -
                          member.amountPaid,
                        0
                      );


                    const isPaid =
                      member.amountPaid >=
                      contributionPerPerson;


                    const isPartial =
                      member.amountPaid >
                        0 &&
                      !isPaid;


                    const status =
                      isPaid
                        ? "Paid"
                        : isPartial
                          ? "Partial"
                          : "Pending";


                    const statusClasses =
                      isPaid
                        ? "bg-emerald-50 text-emerald-700"
                        : isPartial
                          ? "bg-amber-50 text-amber-700"
                          : "bg-zinc-100 text-zinc-600";


                    return (
                      <tr
                        key={
                          member.id
                        }
                        className="transition hover:bg-zinc-50/70"
                      >

                        {/* NUMBER */}

                        <td className="px-3 py-3 text-sm text-zinc-500">
                          {index + 1}
                        </td>


                        {/* MEMBER */}

                        <td className="px-3 py-3">

                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-semibold text-violet-700">
                              {member.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>


                            <p className="truncate text-sm font-medium text-zinc-800">
                              {
                                member.name
                              }
                            </p>

                          </div>

                        </td>


                        {/* CONTRIBUTION */}

                        <td className="px-3 py-3">

                          <p className="whitespace-nowrap text-sm text-zinc-500">

                            {formatMoney(
                              member.amountPaid
                            )}

                            {" / "}

                            {formatMoney(
                              contributionPerPerson
                            )}

                          </p>

                        </td>


                        {/* STATUS */}

                        <td className="px-3 py-3">

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-3
                              py-1
                              text-xs
                              font-medium
                              ${statusClasses}
                            `}
                          >
                            {status}
                          </span>

                        </td>


                        {/* REMAINING */}

                        <td className="px-3 py-3">

                          <p
                            className={`whitespace-nowrap text-sm ${
                              isPaid
                                ? "text-emerald-700"
                                : "text-zinc-500"
                            }`}
                          >
                            {isPaid
                              ? "Completed"
                              : formatMoney(
                                  remaining
                                )}
                          </p>

                        </td>


                        {/* ACTION */}

                        <td className="px-3 py-3 text-right">

                          {canManage ? (
                            <button
                              type="button"
                              onClick={() =>
                                openMember(
                                  member.id
                                )
                              }
                              className="
                                inline-flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                text-zinc-400
                                transition
                                hover:bg-zinc-100
                                hover:text-zinc-950
                              "
                              aria-label={`Manage ${member.name}`}
                            >
                              <MoreHorizontal
                                size={17}
                              />
                            </button>
                          ) : (
                            <span className="text-sm text-zinc-300">
                              —
                            </span>
                          )}

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =================================
            MOBILE MEMBER LIST
        ================================= */}

        <div className="divide-y divide-zinc-100 md:hidden">

          {members.map(
            (
              member,
              index
            ) => {
              const remaining =
                Math.max(
                  contributionPerPerson -
                    member.amountPaid,
                  0
                );


              const isPaid =
                member.amountPaid >=
                contributionPerPerson;


              const isPartial =
                member.amountPaid >
                  0 &&
                !isPaid;


              const status =
                isPaid
                  ? "Paid"
                  : isPartial
                    ? "Partial"
                    : "Pending";


              const statusClasses =
                isPaid
                  ? "bg-emerald-50 text-emerald-700"
                  : isPartial
                    ? "bg-amber-50 text-amber-700"
                    : "bg-zinc-100 text-zinc-600";


              return (
                <motion.div
                  key={
                    member.id
                  }
                  initial={{
                    opacity: 0,
                    x: -8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    delay:
                      0.38 +
                      index *
                        0.035,
                  }}
                  className="px-5 py-4"
                >

                  {/* TOP ROW */}

                  <div className="flex items-center gap-3">

                    {/* AVATAR */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-sm font-semibold text-violet-700">
                      {member.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>


                    {/* NAME */}

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-medium text-zinc-900">
                        {
                          member.name
                        }
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {formatMoney(
                          member.amountPaid
                        )}
                        {" / "}
                        {formatMoney(
                          contributionPerPerson
                        )}
                      </p>

                    </div>


                    {/* STATUS */}

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClasses}`}
                    >
                      {status}
                    </span>


                    {/* ACTION */}

                    {canManage && (
                      <button
                        type="button"
                        onClick={() =>
                          openMember(
                            member.id
                          )
                        }
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-950"
                        aria-label={`Manage ${member.name}`}
                      >
                        <MoreHorizontal
                          size={17}
                        />
                      </button>
                    )}

                  </div>


                  {/* REMAINING */}

                  <div className="mt-3 flex items-center justify-between pl-[52px]">

                    <span className="text-[11px] text-zinc-400">
                      Remaining
                    </span>

                    <span
                      className={`text-xs font-medium ${
                        isPaid
                          ? "text-emerald-700"
                          : "text-zinc-600"
                      }`}
                    >
                      {isPaid
                        ? "Completed"
                        : formatMoney(
                            remaining
                          )}
                    </span>

                  </div>

                </motion.div>
              );
            }
          )}

        </div>

      </motion.section>


      {/* =================================
          MEMBER MANAGEMENT MODAL
      ================================= */}

      <Modal
        open={
          selectedMember !==
          null
        }
        onClose={() => {
          if (!loading) {
            setSelectedMemberId(
              null
            );
          }
        }}
        title={
          selectedMember?.name ??
          "Member"
        }
        description="Contribution details and payment history."
      >

        {selectedMember && (
          <>

            {/* CONTRIBUTION STATUS */}

            <div className="rounded-2xl bg-zinc-50 p-4">

              <p className="text-xs font-medium text-zinc-500">
                Total paid
              </p>


              <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">

                {formatMoney(
                  selectedMember.amountPaid
                )}

                <span className="text-sm font-normal text-zinc-400">
                  {" "}
                  /{" "}
                  {formatMoney(
                    contributionPerPerson
                  )}
                </span>

              </p>


              <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-200">

                <div
                  className="h-full rounded-full bg-zinc-900 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (
                        selectedMember.amountPaid /
                        contributionPerPerson
                      ) *
                        100,
                      100
                    )}%`,
                  }}
                />

              </div>


              <p className="mt-3 text-xs text-zinc-500">

                {selectedMember.amountPaid >=
                contributionPerPerson
                  ? "Contribution completed."
                  : `${formatMoney(
                      contributionPerPerson -
                        selectedMember.amountPaid
                    )} remaining`}

              </p>

            </div>


            {/* PAYMENT HISTORY */}

            <div className="mt-6">

              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Payment History
              </h3>


              {selectedMember
                .contributions
                .length === 0 ? (

                <div className="mt-3 rounded-2xl border border-dashed border-zinc-200 p-5 text-center text-sm text-zinc-500">
                  No payments recorded yet.
                </div>

              ) : (

                <div className="mt-3 divide-y divide-zinc-100 rounded-2xl border border-zinc-200">

                  {selectedMember
                    .contributions
                    .map(
                      (
                        contribution
                      ) => (

                        <div
                          key={
                            contribution.id
                          }
                          className="flex items-center gap-3 p-3.5"
                        >

                          <div className="min-w-0 flex-1">

                            <p className="text-sm font-semibold text-zinc-950">
                              {formatMoney(
                                contribution.amount
                              )}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {formatDateTime(
                                contribution.createdAt
                              )}
                            </p>

                          </div>


                          <button
                            type="button"
                            disabled={
                              loading
                            }
                            onClick={() =>
                              handleDeletePayment(
                                contribution.id,
                                contribution.amount
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40"
                            title="Reverse payment"
                          >
                            <RotateCcw
                              size={
                                15
                              }
                            />
                          </button>

                        </div>

                      )
                    )}

                </div>

              )}

            </div>


            {/* EDIT MEMBER */}

            <form
              onSubmit={
                handleEdit
              }
              className="mt-6"
            >

              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Edit Member
              </h3>


              <label
                htmlFor="edit-member-name"
                className="mt-3 block text-xs font-medium text-zinc-600"
              >
                Name
              </label>


              <input
                id="edit-member-name"
                name="name"
                type="text"
                defaultValue={
                  selectedMember.name
                }
                className="mt-2 w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
                required
              />


              {error && (
                <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}


              <button
                type="submit"
                disabled={
                  loading
                }
                className="mt-3 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </form>


            {/* DELETE MEMBER */}

            <div className="mt-6 border-t border-zinc-100 pt-5">

              <button
                type="button"
                disabled={
                  loading
                }
                onClick={
                  handleDeleteMember
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-40"
              >
                <Trash2
                  size={
                    15
                  }
                />

                Delete Member
              </button>


              <p className="mt-2 text-center text-[11px] leading-4 text-zinc-400">
                This also removes the member&apos;s payment history.
              </p>

            </div>

          </>
        )}

      </Modal>

    </>
  );
}