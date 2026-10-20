import type { HospitalityContent } from "./types";

export const hospitality: HospitalityContent = {
  meta: {
    title: "The Hospitality Vertical",
    description:
      "Training for luxury brands, hotels, restaurants and retail: brand standards, mystery audits, front-line and leadership training, sales and service excellence.",
    path: "/hospitality",
  },

  header: {
    eyebrow: "The Hospitality Vertical",
    heading: "The Hospitality Edge",
    lede: "Where experiences define loyalty, training is a strategic lever and the operating system of service excellence. It directly shapes guest satisfaction scores, repeat business and brand equity.",
  },

  intro: [
    "Structured training builds service intuition, emotional intelligence and operational precision, so teams anticipate needs rather than react to them.",
    "Organisations that prioritise continuous learning create differentiated service standards, stronger teams and measurable commercial outcomes across every customer interaction.",
  ],
  specialismsLabel: "We specialise in",

  segments: [
    {
      id: "luxury",
      title: "Luxury Segment",
      paragraphs: [
        "Luxury service turns on discretion, personalisation and refined communication. We teach teams the global codes of luxury across fashion, travel and lifestyle, and the skills to engage confidently with high-net-worth clients.",
        "Effective training builds cultural fluency, attention to detail and depth of relationship, driving brand prestige, client loyalty and high-value repeat business.",
      ],
      specialisms: [],
      image: {
        src: "/hospitality/luxury.webp",
        alt: "A black luxury saloon car parked on a city street",
        width: 690,
        height: 792,
      },
    },
    {
      id: "hotels-restaurants",
      title: "Hotels & Restaurants",
      paragraphs: [
        "Front-of-house staff must balance efficiency with warmth, while back-of-house teams keep quality and presentation consistent. Effective training aligns both functions, creating a seamless experience that meets and exceeds guest expectations.",
      ],
      specialisms: [
        "Brand standards",
        "Mystery audits",
        "Front-line team training",
        "Leadership training for the next line of General Managers",
      ],
      image: {
        src: "/hospitality/restaurant.webp",
        alt: "A warmly lit restaurant interior with set tables and banquette seating",
        width: 690,
        height: 1032,
      },
    },
    {
      id: "retail",
      title: "Retail",
      paragraphs: [
        "Well-trained associates understand product narratives, read customer intent and personalise every interaction. Our programmes help them ask the right questions, recommend authentically and build trust without appearing pushy.",
      ],
      specialisms: [
        "Sales training",
        "Handling difficult situations",
        "Communication",
        "POSH",
        "Team building",
      ],
      image: {
        src: "/hospitality/retail.webp",
        alt: "A bright fashion boutique with mannequins and rails of clothing",
        width: 690,
        height: 1031,
      },
    },
  ],

  cta: {
    heading: "Raise the standard of every guest interaction.",
    body: "From the front desk to the boardroom, we’ll design training around your brand.",
    cta: { label: "Schedule a Consultation", href: "/contact" },
  },
};
