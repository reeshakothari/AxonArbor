import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EXPERTISE } from "@/lib/phase2/options";

type Point = { title: string; body: string };

export const CONSULTANT_BENEFITS: Point[] = [
  { title: "Vetted organisations only", body: "Every company is checked by Axon Arbor before it can see a single profile." },
  { title: "Your identity stays private", body: "Companies see your expertise and experience, not your name, photo or contact details, until you’re introduced." },
  { title: "Matched to real briefs", body: "Your profile is matched to company requests for the expertise you list, so the work comes to you." },
  { title: "You stay in control", body: "Edit your profile any time. Your day rate is never shown, and you can ask to be removed whenever you like." },
];

export const CONSULTANT_STEPS: Point[] = [
  { title: "Create your account", body: "Your name, email and a password. Under a minute." },
  { title: "Build your profile", body: "Expertise, industries, languages and a short bio. About ten minutes." },
  { title: "We review it", body: "Our team checks every profile before it goes live." },
  { title: "Get matched", body: "Your profile appears in matches for company requests that fit." },
];

export const COMPANY_BENEFITS: Point[] = [
  { title: "A reviewed network", body: "Every consultant profile is checked by Axon Arbor before it goes live." },
  { title: "Shortlists, not directories", body: "Tell us what you need and see the best-matched consultants, so you judge on expertise first." },
  { title: "The whole learning ecosystem", body: "Leadership, coaching, behavioural training, hospitality, Gen AI, Lean Six Sigma and more." },
  { title: "One partner throughout", body: "Axon Arbor handles the introduction, so you deal with one accountable team." },
];

export const COMPANY_STEPS: Point[] = [
  { title: "Register with your work email", body: "Company addresses only, which keeps the network genuine." },
  { title: "We verify your company", body: "Usually within one working day." },
  { title: "Share what you need", body: "The expertise, city and format you’re looking for." },
  { title: "Meet your matches", body: "Review the best fits and ask Axon Arbor for an introduction." },
];

/** Dark band of numbered reasons to join. */
export function BenefitsBand({ eyebrow, heading, points }: { eyebrow: string; heading: string; points: Point[] }) {
  return (
    <section className="bg-ink text-paper">
      <Container className="py-20 sm:py-24">
        <Eyebrow tone="dark">{eyebrow}</Eyebrow>
        <h2 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">{heading}</h2>
        <ul className="mt-14 grid gap-px border border-grey-800 bg-grey-800 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => (
            <li key={p.title} className="bg-ink p-8">
              <p className="font-serif text-5xl text-amber">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-6 text-xl font-medium">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-grey-300">{p.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Numbered steps shown beside the sign-up form. */
export function Steps({ points }: { points: Point[] }) {
  return (
    <div className="border-l-4 border-amber bg-grey-50 p-8 lg:sticky lg:top-28">
      <p className="eyebrow text-grey-600">How it works</p>
      <ol className="mt-6 space-y-6">
        {points.map((p, i) => (
          <li key={p.title} className="flex gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center bg-ink font-label text-sm font-bold text-amber">{i + 1}</span>
            <div>
              <p className="font-medium text-ink">{p.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-grey-600">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** A form beside its "how it works" steps. */
export function FormWithSteps({ title, children, steps }: { title: string; children: ReactNode; steps: Point[] }) {
  return (
    <Container className="grid gap-14 py-20 sm:py-24 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <h2 className="mb-10 font-serif text-4xl tracking-tight">{title}</h2>
        {children}
      </div>
      <aside className="lg:col-span-5">
        <Steps points={steps} />
      </aside>
    </Container>
  );
}

export function ExpertiseTicker() {
  return (
    <div className="border-b border-grey-200 bg-grey-50">
      <Container className="flex flex-wrap gap-2 py-6">
        {EXPERTISE.map((e) => (
          <span key={e} className="border border-grey-300 bg-paper px-3 py-1.5 text-sm text-grey-700">
            {e}
          </span>
        ))}
      </Container>
    </div>
  );
}

function JoinCard({ href, eyebrow, title, body, cta, dark }: { href: string; eyebrow: string; title: string; body: string; cta: string; dark?: boolean }) {
  return (
    <Link
      href={href}
      className={`group flex flex-col justify-between gap-10 p-8 transition-colors sm:p-10 ${
        dark ? "bg-ink text-paper hover:bg-grey-900" : "bg-amber text-ink hover:bg-ink hover:text-paper"
      }`}
    >
      <div>
        <p className={`eyebrow ${dark ? "text-amber" : "text-ink/70 group-hover:text-amber"}`}>{eyebrow}</p>
        <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">{title}</h2>
        <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-grey-300" : "text-ink/80 group-hover:text-grey-300"}`}>{body}</p>
      </div>
      <span className="inline-flex items-center gap-3 font-label text-sm font-semibold tracking-[0.16em] uppercase">
        {cta}
        <svg aria-hidden="true" viewBox="0 0 16 10" className="h-3 w-5 transition-transform group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M0 5h14M10 1l4 4-4 4" />
        </svg>
      </span>
    </Link>
  );
}

/** The two big "new here?" cards on the sign-in page. */
export function JoinCards() {
  return (
    <div>
      <p className="eyebrow mb-5 text-grey-600">New to Axon Arbor?</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <JoinCard
          href="/join/consultant"
          eyebrow="For consultants"
          title="Join the network"
          body="Be matched to vetted organisations looking for your expertise, with your identity private until you’re introduced."
          cta="Join as a consultant"
          dark
        />
        <JoinCard
          href="/join/company"
          eyebrow="For companies"
          title="Find the right expert"
          body="Register with your work email and get shortlists of reviewed consultants matched to what you need."
          cta="Register your company"
        />
      </div>
    </div>
  );
}
