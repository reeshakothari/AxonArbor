import type { HomeContent } from "./types";

export const home: HomeContent = {
  meta: {
    title: "Learning & Development Solutions",
    description:
      "Axon Arbor replaces 8–10 fragmented L&D vendors with one partner: assessment, capability building, leadership journeys, coaching and culture, designed and delivered as one ecosystem.",
    path: "/",
  },

  hero: {
    eyebrow: ["Learning", "Leadership", "Belonging"],
    heading: "The Learning & Development partner that works for you.",
    lede: "Axon Arbor is a Learning & Development solutions company. We design, deliver and integrate every part of capability building, so learning becomes a business advantage rather than a reactive function.",
    primaryCta: { label: "Schedule a Consultation", href: "/contact" },
    secondaryCta: { label: "See the problem we solve", href: "#problem" },
  },

  problem: {
    eyebrow: "The problem",
    heading: "The Hidden Cost of Fragmented Learning",
    lede: "Most CLOs and CHROs juggle eight to ten learning vendors at once. Each one solves a slice of the problem. None of them sees the whole.",
    stat: { value: "8–10", label: "vendors on a typical CLO’s roster" },
    resolvedStat: { value: "1", label: "partner. One connected ecosystem." },
    vendors: [
      "Leadership",
      "Compliance",
      "POSH",
      "Culture",
      "Coaching",
      "Assessments",
      "E-learning",
      "Speakers",
      "Offsites",
      "DEI&B",
    ],
    painPoints: [
      {
        title: "The silo effect",
        body: "Every vendor works in isolation, with its own brief, its own calendar and its own idea of success.",
        vendors: [4, 6, 7, 8],
      },
      {
        title: "No single view of impact",
        body: "Data sits with each provider in a different format, so no one can say what learning is doing for the business.",
        vendors: [5, 6, 4],
      },
      {
        title: "Uneven vendor quality",
        body: "Standards vary from one partner to the next, and so does the experience of your people.",
        vendors: [1, 2, 7, 9],
      },
      {
        title: "Weak integration",
        body: "Leadership, compliance and culture programmes rarely connect, so one never reinforces another.",
        vendors: [0, 1, 3],
      },
    ],
    resolution:
      "Axon Arbor exists to turn learning into a business advantage: a strategic driver of organisational success, not a reactive function.",
  },

  pullQuote: {
    parts: [
      { text: "Learning becomes operationally " },
      { text: "heavy", tone: "heavy" },
      { text: " but strategically " },
      { text: "light.", tone: "light" },
    ],
    caption: "The hidden cost of fragmented learning",
  },

  ecosystem: {
    eyebrow: "The solution",
    heading: "One Partner, Complete Learning Ecosystem",
    lede: "One accountable partner for every part of capability building, from the first diagnostic to the last offsite.",
    pillars: [
      {
        title: "One Stop Shop",
        body: "A full-stack L&D partner that designs, delivers and integrates every aspect of capability building. No more vendor juggling.",
      },
      {
        title: "Tailored Solutions",
        body: "We have a knack for reading the pulse of your stakeholders and drawing meaning from diverse sources of information, then designing around what we hear.",
      },
      {
        title: "Subject Matter Experts",
        body: "Highly experienced consultants, coaches and SMEs who have spent years honing their craft, matched to each brief to strengthen your internal brand.",
      },
    ],
  },

  capabilityStack: {
    eyebrow: "Our offerings",
    heading: "The Axon Arbor 360 Capability Stack",
    lede: "Four layers that work as one system, from understanding where you are today to changing how your organisation works.",
    columns: [
      {
        title: "Assess & Diagnose",
        items: [
          "Assessments",
          "Culture surveys",
          "Competency mapping",
          "Coaching",
        ],
      },
      {
        title: "Build Capability",
        items: [
          "E-modules",
          "Micro-learning",
          "Leadership journeys",
          "Case-study methodology",
          "Soft skills",
          "Technical training",
          "POSH training",
          "Gen AI-enabled role plays",
        ],
      },
      {
        title: "Enable at Scale",
        items: [
          "Celebrity & industry speakers",
          "Employer branding",
          "Internal campaigns",
        ],
      },
      {
        title: "Drive Culture & Engagement",
        items: [
          "Team building",
          "CXO offsites",
          "Diversity, Equity, Inclusion & Belonging interventions",
        ],
      },
    ],
  },

  beyondTraining: {
    eyebrow: "Beyond training",
    heading: "Creating moments that move people",
    items: [
      {
        title: "Diversity, Equity & Inclusion",
        body: "Building truly inclusive cultures where everyone can thrive.",
        href: "/programmes#diversity-equity-inclusion",
      },
      {
        title: "Celebrity & Industry Experts",
        body: "Learn from the best. Speakers who turn an event into something people remember.",
        href: "/about#partners",
      },
      {
        title: "Executive Coaching",
        body: "Coaching for leaders, grounded in the Appreciative Inquiry model.",
        href: "/programmes#coaching-mentoring-assessment",
      },
    ],
  },

  cta: {
    heading: "Make learning your business advantage.",
    body: "Tell us where you are today. We’ll show you what one connected learning ecosystem could look like for your organisation.",
    cta: { label: "Schedule a Consultation", href: "/contact" },
  },
};
