"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

const inputClass = "mt-2 block w-full border border-grey-300 px-4 py-3 text-base focus:border-ink focus:outline-none";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, { error: null });

  return (
    <form action={action} className="space-y-6">
      <div>
        <label htmlFor="username" className="eyebrow text-grey-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className="eyebrow text-grey-700">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </div>
      {state.error && (
        <p role="alert" className="flex gap-2 text-sm text-ink">
          <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 bg-amber" />
          {state.error}
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
