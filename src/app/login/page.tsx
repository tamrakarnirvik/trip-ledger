import Link from "next/link";

import {
  LoginForm,
} from "@/components/auth/login-form";

export default function LoginPage() {
  const signupEnabled =
    process.env.ALLOW_SIGNUP === "true";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4 py-10">

      <div className="w-full max-w-sm">

        {/* HEADER */}

        <div className="mb-7 text-center">

          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-lg font-semibold text-white">
            T
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            TripLedger
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Sign in to manage your trip fund.
          </p>

        </div>


        {/* LOGIN CARD */}

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7">

          <LoginForm />

          {/* REGISTER OPTION */}

          {signupEnabled && (
            <>
              <div className="my-6 flex items-center gap-3">

                <div className="h-px flex-1 bg-zinc-200" />

                <span className="text-xs text-zinc-400">
                  or
                </span>

                <div className="h-px flex-1 bg-zinc-200" />

              </div>

              <div className="text-center">

                <p className="mb-3 text-sm text-zinc-500">
                  Don&apos;t have an account yet?
                </p>

                <Link
                  href="/register"
                  className="flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.99]"
                >
                  Create Treasurer Account
                </Link>

              </div>
            </>
          )}

        </div>

      </div>

    </main>
  );
}