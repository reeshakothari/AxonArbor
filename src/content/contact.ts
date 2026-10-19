import type { ContactContent, SignInContent } from "./types";

export const contact: ContactContent = {
  meta: {
    title: "Contact Us",
    description:
      "Schedule a consultation with Axon Arbor. Jaypee Wishtown, Sector 128, Noida. info@axonarbor.in",
    path: "/contact",
  },
  header: {
    eyebrow: "Contact us",
    heading: "Schedule a consultation",
    lede: "Tell us about your organisation and what you’d like to achieve. We’ll get back to you as soon as possible.",
  },
  form: {
    submitLabel: "Send message",
    successHeading: "Thank you. We’ve received your message.",
    successBody: "Someone from the Axon Arbor team will be in touch shortly.",
  },
};

export const signIn: SignInContent = {
  meta: {
    title: "Sign in",
    description: "Client and consultant dashboards are coming soon.",
    path: "/sign-in",
  },
  header: {
    eyebrow: "Coming soon",
    heading: "Dashboards are on their way.",
    lede: "Soon, consultants and client organisations will be able to sign in here to follow programmes, people and impact in one place.",
  },
};
