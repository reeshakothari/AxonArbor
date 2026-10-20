import type { Metadata } from "next";
import { HistoryList } from "@/components/admin/HistoryList";
import { requireAdmin } from "@/lib/admin/auth";
import { getVersions } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Publish history" };

export default async function HistoryPage() {
  const session = await requireAdmin();
  const versions = await getVersions(session);
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-4xl tracking-tight">Publish history</h1>
      <p className="mt-2 text-grey-600">
        Every time you publish, a copy of the whole website is kept here. Restoring loads an old version into the
        editor so you can check it, then publish it again.
      </p>
      <HistoryList versions={versions} />
    </div>
  );
}
