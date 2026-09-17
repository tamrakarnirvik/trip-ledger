"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  LogOut,
} from "lucide-react";

import {
  authClient,
} from "@/lib/auth-client";

export function LogoutButton({
  name,
}: {
  name: string;
}) {
  const router =
    useRouter();

  const [
    loading,
    setLoading,
  ] = useState(false);

  async function logout() {
    setLoading(true);

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(
            "/login"
          );

          router.refresh();
        },
      },
    });

    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">

      <span className="hidden text-sm text-zinc-500 sm:block">
        {name}
      </span>

      <button
        type="button"
        onClick={logout}
        disabled={loading}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950 active:scale-[0.98] disabled:opacity-50"
      >
        <LogOut size={15} />

        {loading
          ? "..."
          : "Logout"}
      </button>

    </div>
  );
}