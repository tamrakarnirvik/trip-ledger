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
          delay: 0.38,
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
                Members
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Contribution status for everyone.
              </p>
            </div>

            <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600">
              {members.length} members
            </span>

          </div>

        </div>

        <div className="divide-y divide-zinc-100">

          {members.map(
            (member, index) => {
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
                member.amountPaid > 0 &&
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
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration:
                      0.32,

                    delay:
                      0.45 +
                      index *
                        0.04,
                  }}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-zinc-50 sm:px-6"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700">

                    {member.name
                      .charAt(0)
                      .toUpperCase()}

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-medium text-zinc-950">
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

                  <div className="flex items-center gap-2">

                    <div className="hidden flex-col items-end gap-1 sm:flex">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses}`}
                      >
                        {status}
                      </span>

                      {!isPaid &&
                        member.amountPaid >
                          0 && (
                          <span className="text-[11px] text-zinc-400">
                            {formatMoney(
                              remaining
                            )}{" "}
                            left
                          </span>
                        )}

                    </div>

                    {canManage && (
  <button
    type="button"
    onClick={() => {
      setError("");

      setSelectedMemberId(
        member.id
      );
    }}
    className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-white hover:text-zinc-950"
    aria-label={`Manage ${member.name}`}
  >
    <MoreHorizontal
      size={18}
    />
  </button>
)}

                  </div>

                </motion.div>
              );
            }
          )}

        </div>
      </motion.section>

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