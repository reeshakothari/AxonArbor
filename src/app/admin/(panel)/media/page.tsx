import type { Metadata } from "next";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Images" };

export default async function MediaPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-4xl tracking-tight">Images</h1>
      <p className="mt-2 mb-8 text-grey-600">
        Upload images here, or straight from the page editor by clicking any image on the site.
      </p>
      <MediaLibrary />
    </div>
  );
}
