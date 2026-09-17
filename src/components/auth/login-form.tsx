"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

import {
  authClient,
} from "@/lib/auth-client";


export function LoginForm() {
  const router =
    useRouter();


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    const form =
      event.currentTarget;


    const formData =
      new FormData(form);


    const email =
      String(
        formData.get("email") ?? ""
      ).trim();


    const password =
      String(
        formData.get("password") ?? ""
      );


    try {
      setLoading(true);
      setError("");


      const result =
        await authClient.signIn.email({
          email,
          password,
        });


      if (result.error) {
        setError(
          result.error.message ??
            "Unable to sign in."
        );

        return;
      }


      router.push("/");
      router.refresh();
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="mt-7"
    >

      {/* EMAIL */}

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-xs font-semibold text-zinc-600"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
        />
      </div>


      {/* PASSWORD */}

      <div className="mt-4">

        <label
          htmlFor="password"
          className="mb-2 block text-xs font-semibold text-zinc-600"
        >
          Password
        </label>


        <div className="relative">

          <input
            id="password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Your password"
            autoComplete="current-password"
            required
            minLength={8}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 pr-12 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
          />


          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) =>
                  !current
              )
            }
            className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            title={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >

            {showPassword ? (
              <EyeOff
                size={17}
                strokeWidth={1.8}
              />
            ) : (
              <Eye
                size={17}
                strokeWidth={1.8}
              />
            )}

          </button>

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {error}
        </p>
      )}


      {/* SIGN IN */}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <LockKeyhole
          size={16}
        />

        {loading
          ? "Signing in..."
          : "Sign In"}
      </button>

    </form>
  );
}