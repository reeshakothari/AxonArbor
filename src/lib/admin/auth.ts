import "server-only";
import { redirect } from "next/navigation";
import { RPC } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";

export type AdminSession = {
  supabase: Awaited<ReturnType<typeof createSessionClient>>;
  user: { id: string; email: string };
};

/**
 * Data access layer for the admin: resolves the signed-in user and checks the
 * Axon Arbor allowlist. Every admin page and server action calls this, so
 * authorisation never relies on the client.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: isAdmin, error } = await supabase.rpc(RPC.isAdmin);
  if (error || !isAdmin) return null;

  return { supabase, user: { id: user.id, email: user.email ?? "" } };
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
