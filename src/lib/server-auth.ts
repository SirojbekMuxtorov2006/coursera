import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Role } from "@/generated/prisma";

export type AuthedSession = NonNullable<Awaited<ReturnType<typeof getServerSession>>> & {
  user: {
    id: string;
    role: Role;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
};

export async function getAuthedSession(): Promise<AuthedSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session as AuthedSession;
}

export async function requireUser(): Promise<AuthedSession> {
  const session = await getAuthedSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireAdmin(): Promise<AuthedSession> {
  const session = await requireUser();
  if (session.user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session;
}

