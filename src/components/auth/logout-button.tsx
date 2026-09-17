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


type LogoutButtonProps = {
  name?: string | null;
};


export function LogoutButton({
  name,
}: LogoutButtonProps) {
  const router =
    useRouter();


  const [
    loading,
    setLoading,
  ] = useState(false);


  async function handleLogout() {
    try {
      setLoading(true);

      await authClient.signOut();

      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex min-w-0 items-center gap-2">

      {/* LOGGED-IN USER NAME */}

      {name && (
        <span className="text-sm font-medium text-zinc-600">
          {name}
        </span>
      )}


      {/* LOGOUT BUTTON */}

      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="inline-flex h-10 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:scale-[0.98] disabled:opacity-50"
      >
        <LogOut
          size={16}
          strokeWidth={1.8}
        />

        <span>
          {loading
            ? "Logging out..."
            : "Logout"}
        </span>
      </button>

    </div>
  );
}