import type { Metadata } from "next";
import { ApprovalsBoard } from "@/components/admin/ApprovalsBoard";
import { getAllAccounts } from "@/lib/accounts/admin";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Approvals" };

export default async function ApprovalsPage() {
  const session = await requireAdmin();
  const rows = await getAllAccounts(session).catch(() => null);
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-4xl tracking-tight">Approvals</h1>
      <p className="mt-2 text-grey-600">New companies, consultant profiles and removal requests waiting for a decision, plus every account.</p>
      {rows ? (
        <ApprovalsBoard rows={rows} />
      ) : (
        <p className="mt-8 border-l-4 border-amber bg-paper px-5 py-4 text-grey-700">
          The accounts tables aren’t set up yet. Run the migration <code>20261022000000_axon_arbor_accounts.sql</code> in the Supabase SQL editor.
        </p>
      )}
    </div>
  );
}
