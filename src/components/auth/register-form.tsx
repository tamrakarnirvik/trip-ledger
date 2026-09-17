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
  UserPlus,
} from "lucide-react";

import {
  authClient,
} from "@/lib/auth-client";


export function RegisterForm() {
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


    const name =
      String(
        formData.get("name") ?? ""
      ).trim();


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
        await authClient.signUp.email({
          name,
          email,
          password,
        });


      if (result.error) {
        setError(
          result.error.message ??
            "Unable to create account."
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

      {/* NAME */}

      <div>
        <label
          htmlFor="register-name"
          className="mb-2 block text-xs font-semibold text-zinc-600"
        >
          Name
        </label>

        <input
          id="register-name"
          name="name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          required
          className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
        />
      </div>


      {/* EMAIL */}

      <div className="mt-4">
        <label
          htmlFor="register-email"
          className="mb-2 block text-xs font-semibold text-zinc-600"
        >
          Email
        </label>

        <input
          id="register-email"
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
          htmlFor="register-password"
          className="mb-2 block text-xs font-semibold text-zinc-600"
        >
          Password
        </label>


        <div className="relative">

          <input
            id="register-password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
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


      {/* CREATE ACCOUNT */}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <UserPlus
          size={16}
        />

        {loading
          ? "Creating..."
          : "Create Account"}
      </button>

    </form>
  );
}