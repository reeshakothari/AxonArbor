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
    labels: {
      name: "Full name",
      organisation: "Organisation",
      role: "Role",
      email: "Work email",
      phone: "Phone",
      message: "How can we help?",
    },
    requiredNote: "Fields marked * are required.",
    submitLabel: "Send message",
    sendingLabel: "Sending…",
    successHeading: "Thank you. We’ve received your message.",
    successBody: "Someone from the Axon Arbor team will be in touch shortly.",
    sendAnotherLabel: "Send another message",
    errorMessage: "Sorry, something went wrong. Please try again, or email us directly.",
  },
  details: {
    visitHeading: "Visit",
    emailHeading: "Email",
    callHeading: "Call",
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
  button: { label: "Back to home", href: "/" },
  helpText: "Need access sooner? Email us and we’ll set you up.",
};
