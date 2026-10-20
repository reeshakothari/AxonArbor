import type { Metadata } from "next";
import { EnquiriesTable } from "@/components/admin/EnquiriesTable";
import { requireAdmin } from "@/lib/admin/auth";
import { getSubmissions } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Enquiries" };

export default async function EnquiriesPage() {
  const session = await requireAdmin();
  const submissions = await getSubmissions(session);
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-4xl tracking-tight">Enquiries</h1>
      <p className="mt-2 text-grey-600">Everything sent through the website’s contact form.</p>
      <EnquiriesTable submissions={submissions} />
    </div>
  );
}
