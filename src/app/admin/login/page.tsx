import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-grey-50 px-5 py-16">
      <div className="w-full max-w-md">
        <p className="eyebrow flex items-center gap-3 text-grey-600">
          <span aria-hidden="true" className="h-0.5 w-6 bg-amber" />
          Axon Arbor admin
        </p>
        <h1 className="mt-5 font-serif text-4xl tracking-tight">Sign in to edit your website</h1>
        <p className="mt-3 text-grey-600">
          Use the email and password set up for you. Only approved Axon Arbor admins can sign in here.
        </p>
        <div className="mt-10 border border-grey-200 bg-paper p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
