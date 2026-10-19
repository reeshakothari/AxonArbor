import type { Link } from "./types";

export const site = {
  name: "Axon Arbor",
  legalName: "Axon Arbor Consulting",
  tagline: "Learning · Leadership · Belonging",
  description:
    "Axon Arbor is a Learning & Development solutions company in Noida, India. One partner for assessment, capability building, leadership development, coaching and culture.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.axonarbor.in",
  logo: {
    src: "/brand/logo.png",
    alt: "Axon Arbor",
    width: 690,
    height: 615,
  },
  contact: {
    email: "info@axonarbor.in",
    phone: "+91 99997 12159",
    phoneHref: "tel:+919999712159",
    address: ["Jaypee Wishtown, Sector 128", "Noida, UP 201304", "India"],
  },
  copyright: "© Axon Arbor Consulting",
} as const;

export const mainNav: Link[] = [
  { label: "Home", href: "/" },
  { label: "Our Programmes", href: "/programmes" },
  { label: "The Hospitality Vertical", href: "/hospitality" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export const signInLink: Link = { label: "Sign in", href: "/sign-in" };
