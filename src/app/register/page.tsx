import {
  redirect,
} from "next/navigation";

import {
  RegisterForm,
} from "@/components/auth/register-form";

export default function RegisterPage() {
  if (
    process.env.ALLOW_SIGNUP !==
    "true"
  ) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4 py-10">

      <div className="w-full max-w-sm">

        <div className="mb-7 text-center">

          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-lg font-semibold text-white">
            T
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            TripLedger
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
            Treasurer Setup
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Create the account that will manage this trip.
          </p>

        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7">

          <RegisterForm />

        </div>

      </div>

    </main>
  );
}