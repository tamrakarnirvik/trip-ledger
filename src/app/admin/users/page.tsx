import {
  redirect,
} from "next/navigation";

import {
  AdminPageShell,
} from "@/components/admin/admin-page-shell";

import {
  AdminUserManager,
} from "@/components/admin/admin-user-manager";

import {
  getCurrentSession,
} from "@/lib/session";

import prisma from "@/lib/prisma";


export const dynamic =
  "force-dynamic";


export default async function AdminUsersPage() {
  const session =
    await getCurrentSession();


  if (!session) {
    redirect(
      "/login"
    );
  }


  if (
    session.user.role !==
    "TREASURER"
  ) {
    redirect(
      "/"
    );
  }


  const [
    users,
    trip,
  ] =
    await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },

        orderBy: {
          createdAt:
            "desc",
        },
      }),

      prisma.trip.findFirst({
        select: {
          name: true,
        },
      }),
    ]);


  const serializedUsers =
    users.map(
      (user) => ({
        ...user,

        createdAt:
          user.createdAt.toISOString(),
      })
    );


  return (
    <AdminPageShell
      tripName={
        trip?.name ??
        "Trip Ledger"
      }
      title="Users"
      description="Manage registered accounts and access roles."
    >

      <AdminUserManager
        users={
          serializedUsers
        }
        currentUserId={
          session.user.id
        }
      />

    </AdminPageShell>
  );
}