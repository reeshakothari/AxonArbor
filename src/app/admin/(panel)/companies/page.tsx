import type { Metadata } from "next";
import { ApprovalsBoard } from "@/components/admin/ApprovalsBoard";
import { getAccountsByRole } from "@/lib/accounts/admin";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Companies" };

export default async function CompaniesPage() {
  const session = await requireAdmin();
  const rows = await getAccountsByRole(session, "company").catch(() => null);
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-4xl tracking-tight">Companies</h1>
      <p className="mt-2 text-grey-600">Organisations that have registered with a work email. Approve them to give them access.</p>
      {rows ? (
        <ApprovalsBoard rows={rows} role="company" />
      ) : (
        <p className="mt-8 border-l-4 border-amber bg-paper px-5 py-4 text-grey-700">Couldn’t load the accounts. Please refresh the page.</p>
      )}
    </div>
  );
}
