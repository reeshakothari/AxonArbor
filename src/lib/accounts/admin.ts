import "server-only";
import type { AdminSession } from "@/lib/admin/auth";
import { ACCOUNT_TABLES, type Account, type CompanyProfile, type ConsultantProfile } from "./data";

export type AdminAccountRow = Account & {
  consultant: ConsultantProfile | null;
  company: CompanyProfile | null;
};

const COLUMNS = "id, email, role, status, created_at, reviewed_at, review_note, last_login_at";

/** Every consultant and company account with its profile, newest first. */
export async function getAllAccounts({ supabase }: AdminSession): Promise<AdminAccountRow[]> {
  const [accounts, consultants, companies] = await Promise.all([
    supabase.from(ACCOUNT_TABLES.accounts).select(COLUMNS).order("created_at", { ascending: false }),
    supabase.from(ACCOUNT_TABLES.consultants).select("*"),
    supabase.from(ACCOUNT_TABLES.companies).select("*"),
  ]);
  if (accounts.error) throw accounts.error;
  const byId = <T extends { account_id: string }>(rows: T[] | null) => new Map((rows ?? []).map((r) => [r.account_id, r]));
  const c = byId(consultants.data as ConsultantProfile[] | null);
  const co = byId(companies.data as CompanyProfile[] | null);
  return (accounts.data as Account[]).map((a) => ({ ...a, consultant: c.get(a.id) ?? null, company: co.get(a.id) ?? null }));
}

/** Items waiting for an admin decision: new companies, submitted profiles and removal requests. */
export async function countPendingApprovals({ supabase }: AdminSession): Promise<number> {
  const [companies, profiles] = await Promise.all([
    supabase.from(ACCOUNT_TABLES.accounts).select("id", { count: "exact", head: true }).eq("role", "company").eq("status", "pending"),
    supabase
      .from(ACCOUNT_TABLES.consultants)
      .select("account_id", { count: "exact", head: true })
      .in("profile_status", ["pending", "removal_requested"]),
  ]);
  return (companies.count ?? 0) + (profiles.count ?? 0);
}
