"use client";

import Link from "next/link";

/** Friendly error screen for the admin (e.g. Supabase not configured or unreachable). */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const missingKey = /SUPABASE_SECRET_KEY/.test(error.message);
  const missingTables = /schema cache|does not exist|axon_arbor/.test(error.message);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-grey-50 px-5 py-16">
      <div className="w-full max-w-xl border border-grey-200 bg-paper p-8">
        <p className="eyebrow flex items-center gap-3 text-grey-600">
          <span aria-hidden="true" className="h-0.5 w-6 bg-amber" />
          Admin
        </p>
        <h1 className="mt-4 font-serif text-3xl tracking-tight">
          {missingKey
            ? "The database key isn’t set up yet"
            : missingTables
              ? "The database tables haven’t been created yet"
              : "Something went wrong"}
        </h1>
        <p className="mt-3 leading-relaxed text-grey-600">
          {missingKey
            ? "Add SUPABASE_SECRET_KEY to the environment (.env.local, and the hosting settings on Vercel), then reload."
            : missingTables
              ? "Run the SQL in supabase/migrations on the Supabase project, then reload."
              : "Please try again. If it keeps happening, contact your developer."}
        </p>
        <div className="mt-8 flex gap-3">
          <button onClick={reset} className="eyebrow bg-ink px-5 py-3 text-paper hover:bg-amber hover:text-ink">
            Try again
          </button>
          <Link href="/admin/login" className="eyebrow border border-grey-300 px-5 py-3 hover:border-ink">
            Sign-in page
          </Link>
        </div>
      </div>
    </div>
  );
}
