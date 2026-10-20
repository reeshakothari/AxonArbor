import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Axon Arbor admin" },
  robots: { index: false, follow: false },
};

function AdminLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-grey-50">
      <p className="eyebrow animate-pulse text-grey-500">Loading…</p>
    </div>
  );
}

/** Admin pages read the session cookie, so they stream in behind this boundary. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<AdminLoading />}>{children}</Suspense>;
}
