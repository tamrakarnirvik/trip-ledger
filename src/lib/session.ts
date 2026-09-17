import {
  headers,
} from "next/headers";

import {
  auth,
} from "@/lib/auth";

export async function getCurrentSession() {
  return auth.api.getSession({
    headers:
      await headers(),
  });
}

export async function getTreasurerSession() {
  const session =
    await getCurrentSession();

  if (!session) {
    return null;
  }

  if (
    session.user.role !==
    "TREASURER"
  ) {
    return null;
  }

  return session;
}