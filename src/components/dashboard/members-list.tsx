"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Eye,
  History,
  MoreHorizontal,
  Pencil,
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


type MemberModalView =
  | "overview"
  | "history"
  | "edit";


const avatarStyles = [
  "bg-violet-50 text-violet-700",
  "bg-sky-50 text-sky-700",
  "bg-emerald-50 text-emerald-700",
  "bg-amber-50 text-amber-700",
  "bg-rose-50 text-rose-700",
  "bg-indigo-50 text-indigo-700",
];


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
    modalView,
    setModalView,
  ] =
    useState<MemberModalView>(
      "overview"
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


  const selectedMember =
    members.find(
      (member) =>
        member.id ===
        selectedMemberId
    ) ?? null;


  /*
   * Close the small action menu when
   * clicking somewhere else.
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
          "[data-member-menu]"
        );


      const clickedMenuId =
        menu?.getAttribute(
          "data-member-menu"
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
        event.key === "Escape"
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


  function openMember(
    memberId: string,
    view: MemberModalView =
      "overview"
  ) {
    setError("");

    setOpenMenuId(
      null
    );

    setModalView(
      view
    );

    setSelectedMemberId(
      memberId
    );
  }


  function toggleMemberMenu(
    memberId: string
  ) {
    setOpenMenuId(
      (current) =>
        current === memberId
          ? null
          : memberId
    );
  }


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

      setModalView(
        "overview"
      );
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

      {/* =================================
          MEMBERS
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
          delay: 0.34,
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

        <div className="flex items-center justify-between gap-4 px-5 py-4.5 sm:px-6">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <UsersRound
                size={17}
                strokeWidth={1.8}
              />
            </div>


            <div className="min-w-0">

              <h2 className="text-base font-semibold tracking-tight text-zinc-950">
                Members
              </h2>

              <p className="mt-0.5 hidden text-xs text-zinc-500 sm:block">
                Contribution status for everyone.
              </p>

            </div>

          </div>


          <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600">
            {members.length} members
          </span>

        </div>


        {/* =================================
            DESKTOP TABLE
        ================================= */}

        <div className="hidden px-5 pb-5 md:block sm:px-6">

          <div className="rounded-xl border border-zinc-100">

            <table className="w-full table-fixed border-collapse">

              <thead>

                <tr className="bg-zinc-50/80">

                  <th className="w-[6%] px-3 py-2.5 text-left text-[11px] font-medium text-zinc-500">
                    #
                  </th>


                  <th className="w-[25%] px-3 py-2.5 text-left text-[11px] font-medium text-zinc-500">
                    Member
                  </th>


                  <th className="w-[24%] px-3 py-2.5 text-right text-[11px] font-medium text-zinc-500">
                    Contribution
                  </th>


                  <th className="w-[15%] px-3 py-2.5 text-center text-[11px] font-medium text-zinc-500">
                    Status
                  </th>


                  <th className="w-[20%] px-3 py-2.5 text-right text-[11px] font-medium text-zinc-500">
                    Remaining
                  </th>


                  <th className="w-[10%] px-3 py-2.5 text-right text-[11px] font-medium text-zinc-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-zinc-100">

                {members.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center"
                    >

                      <UsersRound
                        size={24}
                        className="mx-auto text-zinc-300"
                      />

                      <p className="mt-3 text-sm font-medium text-zinc-600">
                        No members yet
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        Add your first trip member to get started.
                      </p>

                    </td>

                  </tr>

                ) : (

                  members.map(
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


                      const avatarClass =
                        avatarStyles[
                          index %
                            avatarStyles.length
                        ];


                      return (
                        <tr
                          key={
                            member.id
                          }
                          className="
                            group
                            transition-colors
                            duration-150
                            hover:bg-zinc-50/60
                          "
                        >

                          {/* NUMBER */}

                          <td className="px-3 py-2.5 text-sm tabular-nums text-zinc-400">
                            {index +
                              1}
                          </td>


                          {/* MEMBER */}

                          <td className="px-3 py-2.5">

                            <div className="flex min-w-0 items-center gap-2.5">

                              <div
                                className={`
                                  flex
                                  h-8
                                  w-8
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  text-xs
                                  font-semibold
                                  ${avatarClass}
                                `}
                              >
                                {member.name
                                  .charAt(
                                    0
                                  )
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

                          <td className="px-3 py-2.5 text-right">

                            <span className="whitespace-nowrap text-sm font-medium tabular-nums text-zinc-600">

                              {formatMoney(
                                member.amountPaid
                              )}

                              <span className="mx-1 text-zinc-300">
                                /
                              </span>

                              {formatMoney(
                                contributionPerPerson
                              )}

                            </span>

                          </td>


                          {/* STATUS */}

                          <td className="px-3 py-2.5 text-center">

                            <span
                              className={`
                                inline-flex
                                rounded-full
                                px-2.5
                                py-1
                                text-[11px]
                                font-medium
                                ${statusClasses}
                              `}
                            >
                              {status}
                            </span>

                          </td>


                          {/* REMAINING */}

                          <td className="px-3 py-2.5 text-right">

                            <span
                              className={`
                                whitespace-nowrap
                                text-sm
                                font-medium
                                tabular-nums

                                ${
                                  isPaid
                                    ? "text-emerald-700"
                                    : "text-zinc-600"
                                }
                              `}
                            >
                              {isPaid
                                ? "Completed"
                                : formatMoney(
                                    remaining
                                  )}
                            </span>

                          </td>


                          {/* ACTION */}

                          <td className="relative px-3 py-2.5 text-right">

                            {canManage ? (

                              <div
                                className="relative inline-block"
                                data-member-menu={
                                  member.id
                                }
                              >

                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleMemberMenu(
                                      member.id
                                    )
                                  }
                                  className={`
                                    inline-flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    transition

                                    ${
                                      openMenuId ===
                                      member.id
                                        ? "bg-zinc-100 text-zinc-900"
                                        : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                                    }
                                  `}
                                  aria-label={`Actions for ${member.name}`}
                                  aria-haspopup="menu"
                                  aria-expanded={
                                    openMenuId ===
                                    member.id
                                  }
                                >
                                  <MoreHorizontal
                                    size={17}
                                  />
                                </button>


                                {/* DROPDOWN */}

                                {openMenuId ===
                                  member.id && (

                                  <motion.div
                                    initial={{
                                      opacity: 0,
                                      scale:
                                        0.96,
                                      y: -4,
                                    }}
                                    animate={{
                                      opacity: 1,
                                      scale:
                                        1,
                                      y: 0,
                                    }}
                                    transition={{
                                      duration:
                                        0.14,
                                    }}
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
                                    role="menu"
                                  >

                                    <button
                                      type="button"
                                      onClick={() =>
                                        openMember(
                                          member.id,
                                          "overview"
                                        )
                                      }
                                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
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
                                        openMember(
                                          member.id,
                                          "history"
                                        )
                                      }
                                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
                                    >
                                      <History
                                        size={
                                          14
                                        }
                                      />

                                      Payment history
                                    </button>


                                    <button
                                      type="button"
                                      onClick={() =>
                                        openMember(
                                          member.id,
                                          "edit"
                                        )
                                      }
                                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
                                    >
                                      <Pencil
                                        size={
                                          14
                                        }
                                      />

                                      Edit member
                                    </button>

                                  </motion.div>
                                )}

                              </div>

                            ) : (

                              <span className="text-sm text-zinc-300">
                                —
                              </span>

                            )}

                          </td>

                        </tr>
                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =================================
            MOBILE
        ================================= */}

        <div className="divide-y divide-zinc-100 md:hidden">

          {members.length ===
          0 ? (

            <div className="px-5 py-10 text-center">

              <UsersRound
                size={24}
                className="mx-auto text-zinc-300"
              />

              <p className="mt-3 text-sm font-medium text-zinc-600">
                No members yet
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                Add your first trip member.
              </p>

            </div>

          ) : (

            members.map(
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


                const avatarClass =
                  avatarStyles[
                    index %
                      avatarStyles.length
                  ];


                return (
                  <div
                    key={
                      member.id
                    }
                    className="relative px-5 py-3.5 transition-colors hover:bg-zinc-50/60"
                  >

                    <div className="flex items-center gap-3">

                      {/* AVATAR */}

                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          text-xs
                          font-semibold
                          ${avatarClass}
                        `}
                      >
                        {member.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>


                      {/* MEMBER INFO */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2">

                          <p className="truncate text-sm font-medium text-zinc-900">
                            {
                              member.name
                            }
                          </p>


                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusClasses}`}
                          >
                            {status}
                          </span>

                        </div>


                        <p className="mt-1 whitespace-nowrap text-xs font-medium tabular-nums text-zinc-500">

                          {formatMoney(
                            member.amountPaid
                          )}

                          <span className="mx-1 text-zinc-300">
                            /
                          </span>

                          {formatMoney(
                            contributionPerPerson
                          )}

                        </p>

                      </div>


                      {/* MOBILE ACTION MENU */}

                      {canManage && (

                        <div
                          className="relative"
                          data-member-menu={
                            member.id
                          }
                        >

                          <button
                            type="button"
                            onClick={() =>
                              toggleMemberMenu(
                                member.id
                              )
                            }
                            className={`
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              transition

                              ${
                                openMenuId ===
                                member.id
                                  ? "bg-zinc-100 text-zinc-900"
                                  : "text-zinc-400"
                              }
                            `}
                            aria-label={`Actions for ${member.name}`}
                          >
                            <MoreHorizontal
                              size={17}
                            />
                          </button>


                          {openMenuId ===
                            member.id && (

                            <motion.div
                              initial={{
                                opacity:
                                  0,
                                scale:
                                  0.96,
                                y: -4,
                              }}
                              animate={{
                                opacity:
                                  1,
                                scale:
                                  1,
                                y: 0,
                              }}
                              className="
                                absolute
                                right-0
                                top-9
                                z-50
                                w-44
                                rounded-xl
                                border
                                border-zinc-200
                                bg-white
                                p-1.5
                                shadow-xl
                              "
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  openMember(
                                    member.id,
                                    "overview"
                                  )
                                }
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
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
                                  openMember(
                                    member.id,
                                    "history"
                                  )
                                }
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                              >
                                <History
                                  size={
                                    14
                                  }
                                />

                                Payment history
                              </button>


                              <button
                                type="button"
                                onClick={() =>
                                  openMember(
                                    member.id,
                                    "edit"
                                  )
                                }
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                              >
                                <Pencil
                                  size={
                                    14
                                  }
                                />

                                Edit member
                              </button>

                            </motion.div>
                          )}

                        </div>

                      )}

                    </div>


                    {/* REMAINING */}

                    <div className="mt-2.5 flex items-center justify-between pl-12">

                      <span className="text-[11px] text-zinc-400">
                        Remaining
                      </span>


                      <span
                        className={`
                          text-xs
                          font-medium
                          tabular-nums

                          ${
                            isPaid
                              ? "text-emerald-700"
                              : "text-zinc-600"
                          }
                        `}
                      >
                        {isPaid
                          ? "Completed"
                          : formatMoney(
                              remaining
                            )}
                      </span>

                    </div>

                  </div>
                );
              }
            )

          )}

        </div>

      </motion.section>


      {/* =================================
          MEMBER MODAL
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

            setModalView(
              "overview"
            );
          }
        }}
        title={
          selectedMember?.name ??
          "Member"
        }
        description="Member contribution and payment information."
      >

        {selectedMember && (
          <>

            {/* MODAL NAVIGATION */}

            <div className="mb-5 grid grid-cols-3 rounded-xl bg-zinc-100 p-1">

              <button
                type="button"
                onClick={() =>
                  setModalView(
                    "overview"
                  )
                }
                className={`
                  rounded-lg
                  px-2
                  py-2
                  text-xs
                  font-medium
                  transition

                  ${
                    modalView ===
                    "overview"
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900"
                  }
                `}
              >
                Overview
              </button>


              <button
                type="button"
                onClick={() =>
                  setModalView(
                    "history"
                  )
                }
                className={`
                  rounded-lg
                  px-2
                  py-2
                  text-xs
                  font-medium
                  transition

                  ${
                    modalView ===
                    "history"
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900"
                  }
                `}
              >
                Payments
              </button>


              <button
                type="button"
                onClick={() =>
                  setModalView(
                    "edit"
                  )
                }
                className={`
                  rounded-lg
                  px-2
                  py-2
                  text-xs
                  font-medium
                  transition

                  ${
                    modalView ===
                    "edit"
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900"
                  }
                `}
              >
                Edit
              </button>

            </div>


            {/* =================================
                OVERVIEW
            ================================= */}

            {modalView ===
              "overview" && (

              <div>

                <div className="rounded-2xl bg-zinc-50 p-4">

                  <div className="flex items-end justify-between gap-4">

                    <div>

                      <p className="text-xs font-medium text-zinc-500">
                        Total paid
                      </p>


                      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-zinc-950">

                        {formatMoney(
                          selectedMember.amountPaid
                        )}

                      </p>

                    </div>


                    <p className="text-sm font-medium tabular-nums text-zinc-400">

                      /{" "}

                      {formatMoney(
                        contributionPerPerson
                      )}

                    </p>

                  </div>


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


                  <div className="mt-3 flex items-center justify-between gap-3">

                    <span className="text-xs text-zinc-500">
                      Contribution progress
                    </span>


                    <span className="text-xs font-medium tabular-nums text-zinc-700">

                      {selectedMember.amountPaid >=
                      contributionPerPerson
                        ? "Completed"
                        : `${formatMoney(
                            Math.max(
                              contributionPerPerson -
                                selectedMember.amountPaid,
                              0
                            )
                          )} remaining`}

                    </span>

                  </div>

                </div>


                <div className="mt-4 grid grid-cols-2 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      setModalView(
                        "history"
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-3 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                  >
                    <History
                      size={15}
                    />

                    Payments
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setModalView(
                        "edit"
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-3 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                  >
                    <Pencil
                      size={15}
                    />

                    Edit member
                  </button>

                </div>

              </div>
            )}


            {/* =================================
                PAYMENT HISTORY
            ================================= */}

            {modalView ===
              "history" && (

              <div>

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="text-sm font-semibold text-zinc-900">
                      Payment history
                    </h3>

                    <p className="mt-1 text-xs text-zinc-500">
                      All recorded contributions from this member.
                    </p>

                  </div>


                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600">
                    {
                      selectedMember
                        .contributions
                        .length
                    }
                  </span>

                </div>


                {selectedMember
                  .contributions
                  .length ===
                0 ? (

                  <div className="mt-4 rounded-2xl border border-dashed border-zinc-200 px-5 py-8 text-center">

                    <History
                      size={22}
                      className="mx-auto text-zinc-300"
                    />

                    <p className="mt-3 text-sm font-medium text-zinc-600">
                      No payments yet
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                      Payments recorded for this member will appear here.
                    </p>

                  </div>

                ) : (

                  <div className="mt-4 divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200">

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
                            className="flex items-center gap-3 px-4 py-3"
                          >

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                              <span className="text-sm font-semibold">
                                +
                              </span>
                            </div>


                            <div className="min-w-0 flex-1">

                              <p className="text-sm font-semibold tabular-nums text-zinc-900">
                                {formatMoney(
                                  contribution.amount
                                )}
                              </p>


                              <p className="mt-0.5 text-[11px] text-zinc-500">
                                {formatDateTime(
                                  contribution.createdAt
                                )}
                              </p>

                            </div>


                            {canManage && (

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
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40"
                                title="Reverse payment"
                              >
                                <RotateCcw
                                  size={
                                    14
                                  }
                                />
                              </button>

                            )}

                          </div>

                        )
                      )}

                  </div>

                )}

              </div>
            )}


            {/* =================================
                EDIT
            ================================= */}

            {modalView ===
              "edit" && (

              <div>

                <form
                  onSubmit={
                    handleEdit
                  }
                >

                  <h3 className="text-sm font-semibold text-zinc-900">
                    Edit member
                  </h3>


                  <p className="mt-1 text-xs text-zinc-500">
                    Update this member&apos;s information.
                  </p>


                  <label
                    htmlFor="edit-member-name"
                    className="mt-5 block text-xs font-medium text-zinc-600"
                  >
                    Name
                  </label>


                  <input
                    key={
                      selectedMember.id
                    }
                    id="edit-member-name"
                    name="name"
                    type="text"
                    defaultValue={
                      selectedMember.name
                    }
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
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
                    className="mt-4 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : "Save changes"}
                  </button>

                </form>


                {/* DANGER ZONE */}

                {canManage && (

                  <div className="mt-6 border-t border-zinc-100 pt-5">

                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                      Danger zone
                    </p>


                    <button
                      type="button"
                      disabled={
                        loading
                      }
                      onClick={
                        handleDeleteMember
                      }
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-40"
                    >
                      <Trash2
                        size={15}
                      />

                      Delete member
                    </button>


                    <p className="mt-2 text-center text-[11px] leading-4 text-zinc-400">
                      This also removes the member&apos;s payment history.
                    </p>

                  </div>

                )}

              </div>
            )}

          </>
        )}

      </Modal>

    </>
  );
}