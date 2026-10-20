import "server-only";
import { createServiceClient, serviceKeyConfigured } from "@/lib/supabase/admin";
import { TABLES } from "@/lib/supabase/config";

export type SetupProblem = "missing-key" | "missing-tables" | "unreachable" | null;

/** Checks the admin can reach its Supabase tables, so pages can explain what's missing. */
export async function checkSetup(): Promise<SetupProblem> {
  if (!serviceKeyConfigured()) return "missing-key";
  const { error } = await createServiceClient().from(TABLES.content).select("key").limit(1);
  if (!error) return null;
  if (error.code === "PGRST205" || error.code === "42P01" || /schema cache|does not exist/i.test(error.message)) {
    return "missing-tables";
  }
  console.error("[admin] Supabase check failed:", error.message);
  return "unreachable";
}
