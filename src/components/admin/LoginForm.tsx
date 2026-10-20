"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RPC } from "@/lib/supabase/config";
import { createAdminBrowserClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const supabase = createAdminBrowserClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    if (signInError) {
      setPending(false);
      setError("That email and password don’t match. Please try again.");
      return;
    }

    // The login system is shared with other sites: check this account is an Axon Arbor admin.
    const { data: isAdmin } = await supabase.rpc(RPC.isAdmin);
    if (!isAdmin) {
      await supabase.auth.signOut();
      setPending(false);
      setError("This account doesn’t have access to the Axon Arbor admin. Ask your site owner to add you.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="eyebrow text-grey-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 block w-full border border-grey-300 px-4 py-3 text-base focus:border-ink focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="password" className="eyebrow text-grey-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 block w-full border border-grey-300 px-4 py-3 text-base focus:border-ink focus:outline-none"
        />
      </div>
      {error && (
        <p role="alert" className="flex gap-2 text-sm text-ink">
          <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 bg-amber" />
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="eyebrow w-full bg-ink px-6 py-4 text-paper transition-colors hover:bg-amber hover:text-ink disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
