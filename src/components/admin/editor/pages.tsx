import type { ContentKey, ContentMap } from "@/content/registry";
import { AboutView } from "@/views/AboutView";
import { ContactView } from "@/views/ContactView";
import { HomeView } from "@/views/HomeView";
import { HospitalityView } from "@/views/HospitalityView";
import { NotFoundView } from "@/views/NotFoundView";
import { ProgrammesView } from "@/views/ProgrammesView";
import { SignInView } from "@/views/SignInView";

export type EditablePage = {
  id: string;
  title: string;
  /** Public URL, used to open the live page. */
  path: string | null;
  /** Content documents shown in the side panel for this page. */
  docs: ContentKey[];
};

export const EDITABLE_PAGES: EditablePage[] = [
  { id: "home", title: "Home", path: "/", docs: ["home", "programmes", "site"] },
  { id: "programmes", title: "Our Programmes", path: "/programmes", docs: ["programmes", "site"] },
  { id: "hospitality", title: "The Hospitality Vertical", path: "/hospitality", docs: ["hospitality", "site"] },
  { id: "about", title: "About Us", path: "/about", docs: ["about", "site"] },
  { id: "contact", title: "Contact Us", path: "/contact", docs: ["contact", "site"] },
  { id: "sign-in", title: "Sign-in page", path: "/sign-in", docs: ["sign-in", "site"] },
  { id: "not-found", title: "404 page", path: null, docs: ["site"] },
];

export function findPage(id: string) {
  return EDITABLE_PAGES.find((p) => p.id === id);
}

/** Maps a public URL to the editor page for it (for following links in preview). */
export function pageForPath(pathname: string) {
  return EDITABLE_PAGES.find((p) => p.path === pathname);
}

export function renderPage(id: string, d: ContentMap) {
  switch (id) {
    case "home":
      return <HomeView home={d.home} programmes={d.programmes} />;
    case "programmes":
      return <ProgrammesView programmes={d.programmes} />;
    case "hospitality":
      return <HospitalityView hospitality={d.hospitality} />;
    case "about":
      return <AboutView about={d.about} />;
    case "contact":
      return <ContactView contact={d.contact} site={d.site} />;
    case "sign-in":
      return <SignInView signIn={d["sign-in"]} site={d.site} />;
    default:
      return <NotFoundView site={d.site} />;
  }
}
