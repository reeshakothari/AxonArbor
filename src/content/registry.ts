import { about } from "./about";
import { contact, signIn } from "./contact";
import { home } from "./home";
import { hospitality } from "./hospitality";
import { programmes } from "./programmes";
import { site } from "./site";
import type {
  AboutContent,
  ContactContent,
  HomeContent,
  HospitalityContent,
  ProgrammesContent,
  SignInContent,
  SiteContent,
} from "./types";

/** Every editable content document, keyed as stored in Supabase. */
export type ContentMap = {
  site: SiteContent;
  home: HomeContent;
  programmes: ProgrammesContent;
  hospitality: HospitalityContent;
  about: AboutContent;
  contact: ContactContent;
  "sign-in": SignInContent;
};

export type ContentKey = keyof ContentMap;

/** Defaults shipped with the code; stored edits are merged over these. */
export const contentDefaults: ContentMap = {
  site,
  home,
  programmes,
  hospitality,
  about,
  contact,
  "sign-in": signIn,
};

/** How each document appears in the admin dashboard, in sidebar order. */
export const contentPages: {
  key: ContentKey;
  title: string;
  description: string;
  path: string | null;
}[] = [
  {
    key: "site",
    title: "Site-wide settings",
    description: "Logo, menu, footer, contact details and the 404 page.",
    path: null,
  },
  { key: "home", title: "Home", description: "Hero, problem section, solution, offerings and more.", path: "/" },
  { key: "programmes", title: "Our Programmes", description: "Facilitator areas and signature programmes.", path: "/programmes" },
  { key: "hospitality", title: "The Hospitality Vertical", description: "Luxury, hotels and restaurants, retail.", path: "/hospitality" },
  { key: "about", title: "About Us", description: "Founder, advisors, facilitators and partners.", path: "/about" },
  { key: "contact", title: "Contact Us", description: "Form labels, messages and contact panel.", path: "/contact" },
  { key: "sign-in", title: "Sign-in page", description: "The sign-in page for consultants and companies.", path: "/sign-in" },
];

export function isContentKey(value: string): value is ContentKey {
  return value in contentDefaults;
}
