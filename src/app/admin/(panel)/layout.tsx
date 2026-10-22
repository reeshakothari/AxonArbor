import { AdminShell } from "@/components/admin/AdminShell";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { contentPages, type ContentKey } from "@/content/registry";
import { countPendingApprovals } from "@/lib/accounts/admin";
import { requireAdmin } from "@/lib/admin/auth";
import { countNewSubmissions, getUnpublishedKeys } from "@/lib/admin/data";
import { checkSetup } from "@/lib/admin/setup";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const problem = await checkSetup();
  if (problem) return <SetupNotice problem={problem} />;
  const [unpublished, newEnquiries, pendingApprovals] = await Promise.all([
    getUnpublishedKeys(session).catch((): ContentKey[] => []),
    countNewSubmissions(session).catch(() => 0),
    countPendingApprovals(session).catch(() => 0),
  ]);
  const changedPages = contentPages.filter((p) => unpublished.includes(p.key)).map((p) => p.title);

  return (
    <AdminShell email={session.user.name} changedPages={changedPages} newEnquiries={newEnquiries} pendingApprovals={pendingApprovals}>
      {children}
    </AdminShell>
  );
}
