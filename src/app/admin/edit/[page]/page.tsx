import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InlineEditor } from "@/components/admin/editor/InlineEditor";
import { findPage } from "@/components/admin/editor/pages";
import { contentDefaults, type ContentKey } from "@/content/registry";
import { requireAdmin } from "@/lib/admin/auth";
import { getAllDraftContent, getUnpublishedKeys } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Edit website" };

export default async function EditPage({ params }: { params: Promise<{ page: string }> }) {
  const { page: pageId } = await params;
  if (!findPage(pageId)) notFound();

  const session = await requireAdmin();
  const [docs, unpublished] = await Promise.all([
    getAllDraftContent(session).catch(() => contentDefaults),
    getUnpublishedKeys(session).catch((): ContentKey[] => []),
  ]);

  return <InlineEditor key={pageId} pageId={pageId} initialDocs={docs} initialUnpublished={unpublished} />;
}
