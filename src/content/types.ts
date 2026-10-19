/**
 * Content model for the marketing site. Every page reads its copy from typed
 * objects in src/content so the source can later move to a CMS or Supabase
 * without touching components.
 */

export type Link = {
  label: string;
  href: string;
};

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type SectionIntro = {
  eyebrow?: string;
  heading: string;
  lede?: string;
};

export type PageMeta = {
  title: string;
  description: string;
  path: string;
};

export type IconName = "one-stop" | "tailored" | "experts" | "inclusion" | "speaker" | "coaching";

export type Item = {
  title: string;
  body: string;
  icon?: IconName;
};

export type LinkedItem = Item & { href?: string };

export type PainPoint = Item & {
  /** Indices into ProblemContent.vendors that this pain point highlights. */
  vendors: number[];
};

export type QuotePart = {
  text: string;
  tone?: "heavy" | "light";
};

export type CapabilityColumn = {
  title: string;
  items: string[];
};

export type HeroContent = {
  eyebrow: string[];
  heading: string;
  lede: string;
  primaryCta: Link;
  secondaryCta: Link;
};

export type ProblemContent = SectionIntro & {
  stat: { value: string; label: string };
  resolvedStat: { value: string; label: string };
  vendors: string[];
  painPoints: PainPoint[];
  resolution: string;
};

export type CtaContent = {
  heading: string;
  body: string;
  cta: Link;
};

export type HomeContent = {
  meta: PageMeta;
  hero: HeroContent;
  problem: ProblemContent;
  pullQuote: { parts: QuotePart[]; caption: string };
  ecosystem: SectionIntro & { pillars: Item[] };
  capabilityStack: SectionIntro & { columns: CapabilityColumn[] };
  beyondTraining: SectionIntro & { items: LinkedItem[] };
  cta: CtaContent;
};

export type Person = {
  name: string;
  role?: string;
  bio: string;
  image?: ImageAsset;
};

export type Partner = {
  kind: string;
  name: string;
  paragraphs: string[];
  list?: string[];
  stats?: { value: string; label: string }[];
  logo: ImageAsset;
};

export type PageHeaderContent = SectionIntro & { eyebrow: string };

export type Programme = {
  id: string;
  title: string;
  body: string;
  listLabel?: string;
  list?: string[];
};

export type ProgrammesContent = {
  meta: PageMeta;
  header: PageHeaderContent;
  intro: string[];
  areas: SectionIntro & { items: string[]; note: string };
  programmes: SectionIntro & { items: Programme[] };
  cta: CtaContent;
};

export type HospitalitySegment = {
  id: string;
  title: string;
  paragraphs: string[];
  specialisms: string[];
  image?: ImageAsset;
};

export type HospitalityContent = {
  meta: PageMeta;
  header: PageHeaderContent;
  intro: string[];
  segments: HospitalitySegment[];
  cta: CtaContent;
};

export type AboutContent = {
  meta: PageMeta;
  header: PageHeaderContent;
  founder: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    name: string;
    role: string;
    image: ImageAsset;
  };
  advisors: SectionIntro & { people: Person[] };
  facilitators: SectionIntro & { people: Person[] };
  partners: SectionIntro & { items: Partner[] };
  cta: CtaContent;
};

export type ContactContent = {
  meta: PageMeta;
  header: PageHeaderContent;
  form: {
    submitLabel: string;
    successHeading: string;
    successBody: string;
  };
};

export type SignInContent = {
  meta: PageMeta;
  header: PageHeaderContent;
};
