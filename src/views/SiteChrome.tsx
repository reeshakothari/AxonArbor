import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import type { SiteContent } from "@/content/types";

/** Header, main landmark and footer around every public page. */
export function SiteChrome({ site, children }: { site: SiteContent; children: ReactNode }) {
  return (
    <>
      <Header site={site} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer site={site} />
    </>
  );
}
