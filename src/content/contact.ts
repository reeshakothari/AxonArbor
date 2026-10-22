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
    privacyNote: "We’ll use your details only to reply to your enquiry. See our",
    privacyLinkLabel: "Privacy Policy",
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
    description: "Sign in to your Axon Arbor consultant or company account.",
    path: "/sign-in",
  },
  header: {
    eyebrow: "Sign in",
    heading: "Welcome back.",
    lede: "Consultants and client organisations sign in here to manage their profile and account.",
  },
  button: { label: "Sign in", href: "/account" },
  helpText: "Forgotten your password? Email us and we’ll reset it for you:",
};
