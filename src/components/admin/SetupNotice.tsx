import type { SetupProblem } from "@/lib/admin/setup";

const COPY: Record<Exclude<SetupProblem, null>, { title: string; body: string }> = {
  "missing-key": {
    title: "One more step: connect the database",
    body: "Add the Supabase secret key as SUPABASE_SECRET_KEY in .env.local (and in the Vercel project’s environment variables), then reload this page.",
  },
  "missing-tables": {
    title: "One more step: create the database tables",
    body: "Run the SQL file in supabase/migrations on the “supabase-charcoal-planet” project, then reload this page.",
  },
  unreachable: {
    title: "Can’t reach the database right now",
    body: "Supabase didn’t respond. Check the secret key is correct and try again in a minute.",
  },
};

export function SetupNotice({ problem }: { problem: Exclude<SetupProblem, null> }) {
  const { title, body } = COPY[problem];
  return (
    <div className="flex min-h-dvh items-center justify-center bg-grey-50 px-5 py-16">
      <div className="w-full max-w-xl border border-grey-200 bg-paper p-8">
        <p className="eyebrow flex items-center gap-3 text-grey-600">
          <span aria-hidden="true" className="h-0.5 w-6 bg-amber" />
          Admin setup
        </p>
        <h1 className="mt-4 font-serif text-3xl tracking-tight">{title}</h1>
        <p className="mt-3 leading-relaxed text-grey-600">{body}</p>
        <p className="mt-6 text-sm text-grey-500">You’re signed in. Nothing else needs to change.</p>
      </div>
    </div>
  );
}
