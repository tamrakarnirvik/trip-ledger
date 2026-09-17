"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  UserPlus,
} from "lucide-react";

import {
  authClient,
} from "@/lib/auth-client";

export function RegisterForm() {
  const router =
    useRouter();

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
          className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
        />
      </div>

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
          className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="register-password"
          className="mb-2 block text-xs font-semibold text-zinc-600"
        >
          Password
        </label>

        <input
          id="register-password"
          name="password"
          type="password"
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
          className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50"
      >
        <UserPlus size={16} />

        {loading
          ? "Creating..."
          : "Create Treasurer Account"}
      </button>

    </form>
  );
}