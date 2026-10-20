import type { Metadata } from "next";
import Link from "next/link";
import { contentPages } from "@/content/registry";
import { requireAdmin } from "@/lib/admin/auth";
import { getSubmissions, getUnpublishedKeys, getVersions } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Dashboard" };

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function AdminDashboard() {
  const session = await requireAdmin();
  const [submissions, unpublished, versions] = await Promise.all([
    getSubmissions(session).catch(() => []),
    getUnpublishedKeys(session).catch(() => []),
    getVersions(session).catch(() => []),
  ]);
  const newCount = submissions.filter((s) => s.status === "new").length;
  const editablePages = [
    ...contentPages.filter((p) => p.path),
    { key: "not-found", title: "404 page", description: "Shown when a link is broken.", path: null },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-4xl tracking-tight">Welcome back</h1>
      <p className="mt-2 text-grey-600">Edit any page by clicking on it, then publish when you’re happy.</p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/edit/home"
          className="group flex flex-col justify-between bg-ink p-7 text-paper transition-colors hover:bg-grey-900 md:col-span-1"
        >
          <span className="eyebrow text-amber">Start here</span>
          <span className="mt-10 font-serif text-3xl">Edit your website →</span>
          <span className="mt-2 text-sm text-grey-300">Click any text or image on the page to change it.</span>
        </Link>
        <Link href="/admin/enquiries" className="border border-grey-200 bg-paper p-7 transition-colors hover:border-ink">
          <span className="eyebrow text-grey-500">Enquiries</span>
          <span className="mt-6 block font-label text-5xl font-bold">{newCount}</span>
          <span className="mt-1 block text-sm text-grey-600">
            new {newCount === 1 ? "enquiry" : "enquiries"} · {submissions.length} in total
          </span>
        </Link>
        <Link href="/admin/history" className="border border-grey-200 bg-paper p-7 transition-colors hover:border-ink">
          <span className="eyebrow text-grey-500">Last published</span>
          <span className="mt-6 block font-serif text-2xl">
            {versions[0] ? dateFmt.format(new Date(versions[0].published_at)) : "Not yet"}
          </span>
          <span className="mt-1 block text-sm text-grey-600">
            {unpublished.length > 0 ? `${unpublished.length} page(s) with unpublished changes` : "Everything is live"}
          </span>
        </Link>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="eyebrow text-grey-500">Pages</h2>
          <ul className="mt-4 divide-y divide-grey-200 border border-grey-200 bg-paper">
            {editablePages.map((page) => (
              <li key={page.key}>
                <Link
                  href={`/admin/edit/${page.key}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-grey-50"
                >
                  <span>
                    <span className="block font-medium">{page.title}</span>
                    <span className="block text-sm text-grey-600">{page.description}</span>
                  </span>
                  {unpublished.includes(page.key as never) ? (
                    <span className="eyebrow shrink-0 bg-amber px-2 py-1 text-[0.6rem] text-ink">Edited</span>
                  ) : (
                    <span aria-hidden="true" className="text-grey-400">
                      →
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-grey-600">
            The menu, footer, logo and contact details are site-wide: edit them on any page.
          </p>
        </section>

        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="eyebrow text-grey-500">Latest enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm underline underline-offset-4">
              See all
            </Link>
          </div>
          {submissions.length === 0 ? (
            <p className="mt-4 border border-dashed border-grey-300 bg-paper p-6 text-grey-600">
              No enquiries yet. Messages sent from the contact form will appear here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-grey-200 border border-grey-200 bg-paper">
              {submissions.slice(0, 6).map((s) => (
                <li key={s.id} className="px-5 py-4">
                  <Link href={`/admin/enquiries?open=${s.id}`} className="block">
                    <span className="flex items-center gap-2">
                      {s.status === "new" && <span aria-label="New" className="size-2 rounded-full bg-amber" />}
                      <span className="font-medium">{s.name}</span>
                      <span className="text-sm text-grey-500">· {s.organisation}</span>
                      <span className="ml-auto shrink-0 text-xs text-grey-500">
                        {dateFmt.format(new Date(s.created_at))}
                      </span>
                    </span>
                    <span className="mt-1 line-clamp-1 block text-sm text-grey-600">{s.message}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
