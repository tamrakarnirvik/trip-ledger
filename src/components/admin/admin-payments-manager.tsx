"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  RotateCcw,
  Search,
  WalletCards,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  Modal,
} from "@/components/ui/modal";

import {
  formatDateTime,
  formatMoney,
} from "@/lib/format";


type Payment = {
  id: string;
  amount: number;
  createdAt: string;

  member: {
    id: string;
    name: string;
  };
};


type Member = {
  id: string;
  name: string;
  amountPaid: number;
};


type AdminPaymentsManagerProps = {
  payments: Payment[];
  members: Member[];
};


export function AdminPaymentsManager({
  payments,
  members,
}: AdminPaymentsManagerProps) {
  const router =
    useRouter();


  const [
    search,
    setSearch,
  ] =
    useState("");


  const [
    memberFilter,
    setMemberFilter,
  ] =
    useState("ALL");


  const [
    selectedPayment,
    setSelectedPayment,
  ] =
    useState<Payment | null>(
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


  const filteredPayments =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();


      return payments.filter(
        (payment) => {

          const matchesSearch =
            !query ||
            payment.member.name
              .toLowerCase()
              .includes(
                query
              );


          const matchesMember =
            memberFilter ===
              "ALL" ||
            payment.member.id ===
              memberFilter;


          return (
            matchesSearch &&
            matchesMember
          );
        }
      );
    }, [
      payments,
      search,
      memberFilter,
    ]);


  async function handleReverse() {
    if (
      !selectedPayment
    ) {
      return;
    }


    try {
      setLoading(
        true
      );

      setError(
        ""
      );


      const response =
        await fetch(
          `/api/contributions/${selectedPayment.id}`,
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


      if (
        !response.ok
      ) {
        throw new Error(
          data?.error ??
            "Unable to reverse payment."
        );
      }


      setSelectedPayment(
        null
      );


      router.refresh();

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to reverse payment."
      );
    } finally {
      setLoading(
        false
      );
    }
  }


  return (
    <>

      <section
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

        <div
          className="
            border-b
            border-zinc-100

            p-5

            sm:p-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            <div>

              <div className="flex items-center gap-2">

                <WalletCards
                  size={17}
                  className="text-zinc-400"
                />

                <h2 className="text-base font-semibold">
                  Payment History
                </h2>

              </div>


              <p className="mt-1 text-xs text-zinc-500">
                {payments.length} payment records
              </p>

            </div>


            <div
              className="
                flex
                flex-col
                gap-2

                sm:flex-row
              "
            >

              <div className="relative">

                <Search
                  size={15}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-zinc-400
                  "
                />


                <input
                  value={
                    search
                  }
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Search member..."
                  className="
                    h-10
                    w-full

                    rounded-xl

                    border
                    border-zinc-200

                    bg-zinc-50

                    pl-9
                    pr-3

                    text-sm

                    outline-none

                    focus:border-zinc-400
                    focus:bg-white

                    sm:w-56
                  "
                />

              </div>


              <select
                value={
                  memberFilter
                }
                onChange={(
                  event
                ) =>
                  setMemberFilter(
                    event
                      .target
                      .value
                  )
                }
                className="
                  h-10

                  rounded-xl

                  border
                  border-zinc-200

                  bg-white

                  px-3

                  text-xs
                  font-medium

                  outline-none
                "
              >

                <option value="ALL">
                  All members
                </option>


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

          </div>

        </div>


        {/* DESKTOP */}

        <div className="hidden md:block">

          <table className="w-full text-left">

            <thead>

              <tr
                className="
                  border-b
                  border-zinc-100

                  text-[11px]
                  uppercase
                  tracking-wide
                  text-zinc-400
                "
              >

                <th className="px-6 py-3">
                  Member
                </th>

                <th className="px-4 py-3">
                  Amount
                </th>

                <th className="px-4 py-3">
                  Recorded
                </th>

                <th className="px-6 py-3 text-right">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredPayments.map(
                (payment) => (

                  <tr
                    key={
                      payment.id
                    }
                    className="
                      border-b
                      border-zinc-100

                      last:border-0

                      hover:bg-zinc-50/60
                    "
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center

                            rounded-xl

                            bg-emerald-50

                            text-xs
                            font-semibold
                            text-emerald-700
                          "
                        >
                          {payment.member.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>


                        <span className="text-sm font-medium">
                          {
                            payment.member.name
                          }
                        </span>

                      </div>

                    </td>


                    <td
                      className="
                        px-4
                        py-4

                        text-sm
                        font-semibold
                        tabular-nums
                      "
                    >
                      {formatMoney(
                        payment.amount
                      )}
                    </td>


                    <td className="px-4 py-4 text-xs text-zinc-500">
                      {formatDateTime(
                        payment.createdAt
                      )}
                    </td>


                    <td className="px-6 py-4 text-right">

                      <button
                        type="button"
                        onClick={() => {
                          setError(
                            ""
                          );

                          setSelectedPayment(
                            payment
                          );
                        }}
                        className="
                          inline-flex
                          h-9
                          w-9
                          items-center
                          justify-center

                          rounded-xl

                          text-zinc-400

                          transition

                          hover:bg-amber-50
                          hover:text-amber-700
                        "
                        title="Reverse payment"
                      >

                        <RotateCcw
                          size={15}
                        />

                      </button>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>


        {/* MOBILE */}

        <div className="divide-y divide-zinc-100 md:hidden">

          {filteredPayments.map(
            (payment) => (

              <div
                key={
                  payment.id
                }
                className="flex items-center gap-3 p-4"
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center

                    rounded-xl

                    bg-emerald-50

                    text-xs
                    font-semibold
                    text-emerald-700
                  "
                >
                  {payment.member.name
                    .charAt(0)
                    .toUpperCase()}
                </div>


                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-medium">
                    {payment.member.name}
                  </p>


                  <p className="mt-1 text-[11px] text-zinc-500">
                    {formatDateTime(
                      payment.createdAt
                    )}
                  </p>

                </div>


                <div className="text-right">

                  <p className="text-sm font-semibold">
                    {formatMoney(
                      payment.amount
                    )}
                  </p>


                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPayment(
                        payment
                      )
                    }
                    className="
                      mt-1

                      text-[10px]
                      font-medium
                      text-amber-700
                    "
                  >
                    Reverse
                  </button>

                </div>

              </div>
            )
          )}

        </div>


        {filteredPayments.length ===
          0 && (

          <div className="px-6 py-12 text-center">

            <WalletCards
              size={24}
              className="mx-auto text-zinc-300"
            />

            <p className="mt-3 text-sm font-medium text-zinc-700">
              No payments found
            </p>

          </div>

        )}

      </section>


      {/* REVERSE CONFIRMATION */}

      <Modal
        open={
          selectedPayment !==
          null
        }
        onClose={() => {
          if (
            !loading
          ) {
            setSelectedPayment(
              null
            );
          }
        }}
        title="Reverse payment"
        description="Remove this contribution from the trip."
      >

        {selectedPayment && (
          <div>

            <div
              className="
                rounded-2xl
                bg-amber-50
                p-4
              "
            >

              <p className="text-xs text-amber-700">
                Payment from
              </p>


              <p className="mt-1 text-sm font-semibold text-amber-950">
                {selectedPayment.member.name}
              </p>


              <p className="mt-3 text-2xl font-semibold text-amber-950">
                {formatMoney(
                  selectedPayment.amount
                )}
              </p>

            </div>


            <p className="mt-4 text-xs leading-5 text-zinc-500">
              Reversing this payment will reduce the member&apos;s total contribution.
            </p>


            {error && (
              <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </p>
            )}


            <div className="mt-5 flex gap-2">

              <button
                type="button"
                onClick={() =>
                  setSelectedPayment(
                    null
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
                "
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleReverse
                }
                disabled={
                  loading
                }
                className="
                  flex-1

                  rounded-xl

                  bg-amber-600

                  px-4
                  py-3

                  text-sm
                  font-medium
                  text-white

                  transition

                  hover:bg-amber-700

                  disabled:opacity-40
                "
              >

                {loading
                  ? "Reversing..."
                  : "Reverse Payment"}

              </button>

            </div>

          </div>
        )}

      </Modal>

    </>
  );
}