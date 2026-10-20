import { AdminShell } from "@/components/admin/AdminShell";
import { contentPages, type ContentKey } from "@/content/registry";
import { requireAdmin } from "@/lib/admin/auth";
import { countNewSubmissions, getUnpublishedKeys } from "@/lib/admin/data";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const [unpublished, newEnquiries] = await Promise.all([
    getUnpublishedKeys(session).catch((): ContentKey[] => []),
    countNewSubmissions(session).catch(() => 0),
  ]);
  const changedPages = contentPages.filter((p) => unpublished.includes(p.key)).map((p) => p.title);

  return (
    <AdminShell email={session.user.email} changedPages={changedPages} newEnquiries={newEnquiries}>
      {children}
    </AdminShell>
  );
}
