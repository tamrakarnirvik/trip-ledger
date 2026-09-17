
"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Settings2,
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


type TripSettingsProps = {
  tripId: string;
  contributionPerPerson: number;
};


export function TripSettings({
  tripId,
  contributionPerPerson,
}: TripSettingsProps) {
  const router =
    useRouter();


  const [
    open,
    setOpen,
  ] = useState(false);


  const [
    amount,
    setAmount,
  ] = useState(
    contributionPerPerson.toString()
  );


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  async function handleSave(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");


    const numericAmount =
      Number(amount);


    if (
      !Number.isInteger(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      setError(
        "Enter a valid amount."
      );

      return;
    }


    try {
      setLoading(true);


      const response =
        await fetch(
          `/api/trips/${tripId}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                contributionPerPerson:
                  numericAmount,
              }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update amount."
        );
      }


      setOpen(false);

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }


  function openSettings() {
    setAmount(
      contributionPerPerson.toString()
    );

    setError("");

    setOpen(true);
  }


  return (
    <>
      <motion.button
  type="button"
  onClick={openSettings}

  initial={{
    opacity: 0,
    y: 10,
  }}

  animate={{
    opacity: 1,
    y: 0,
  }}

  transition={{
    duration: 0.45,
    delay: 0.18,
    ease: [
      0.22,
      1,
      0.36,
      1,
    ],
  }}

  whileHover={{
    y: -2,
  }}

  whileTap={{
    scale: 0.98,
  }}

  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
>
  <Settings2
    size={17}
  />

  Trip Settings
</motion.button>


      <Modal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        title="Trip Settings"
      >

        <form
          onSubmit={
            handleSave
          }
          className="space-y-5"
        >

          <div>
            <p className="text-sm text-zinc-500">
              Change how much each
              member is expected to
              contribute.
            </p>
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-800">
              Contribution per person
            </label>


            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                Rs.
              </span>


              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(
                  event
                ) =>
                  setAmount(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-12 pr-4 text-sm text-zinc-950 outline-none transition focus:border-zinc-400"
                placeholder="3500"
                required
              />

            </div>
          </div>


          <div className="rounded-xl bg-zinc-50 px-4 py-3">

            <p className="text-xs text-zinc-500">
              Current amount
            </p>

            <p className="mt-1 text-sm font-semibold text-zinc-900">
              {formatMoney(
                contributionPerPerson
              )}{" "}
              per person
            </p>

          </div>


          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}


          <div className="flex gap-3">

            <button
              type="button"
              onClick={() =>
                setOpen(false)
              }
              disabled={loading}
              className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </Modal>
    </>
  );
}