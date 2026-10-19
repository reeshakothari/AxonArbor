/**
 * Contact form schema, shared by the client form and the route handler so
 * both enforce exactly the same rules.
 */

export const contactFields = [
  { name: "name", noun: "your full name", label: "Full name", type: "text", autoComplete: "name", required: true, max: 120 },
  { name: "organisation", noun: "your organisation", label: "Organisation", type: "text", autoComplete: "organization", required: true, max: 160 },
  { name: "role", noun: "your role", label: "Role", type: "text", autoComplete: "organization-title", required: false, max: 120 },
  { name: "email", noun: "your work email", label: "Work email", type: "email", autoComplete: "email", required: true, max: 200 },
  { name: "phone", noun: "your phone number", label: "Phone", type: "tel", autoComplete: "tel", required: false, max: 30 },
  { name: "message", noun: "a message", label: "How can we help?", type: "textarea", autoComplete: "off", required: true, max: 4000 },
] as const;

export type ContactFieldName = (typeof contactFields)[number]["name"];
export type ContactPayload = Record<ContactFieldName, string>;
export type ContactErrors = Partial<Record<ContactFieldName, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{7,20}$/;

export function normaliseContact(input: unknown): ContactPayload {
  const source = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  return Object.fromEntries(
    contactFields.map((f) => [f.name, typeof source[f.name] === "string" ? (source[f.name] as string).trim() : ""]),
  ) as ContactPayload;
}

export function validateContact(data: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of contactFields) {
    const value = data[field.name];
    if (field.required && !value) {
      errors[field.name] = `Please enter ${field.noun}.`;
    } else if (value.length > field.max) {
      errors[field.name] = `Please keep this under ${field.max} characters.`;
    }
  }
  if (!errors.email && data.email && !EMAIL.test(data.email)) {
    errors.email = "Please enter a valid email address, like name@company.com.";
  }
  if (!errors.phone && data.phone && !PHONE.test(data.phone)) {
    errors.phone = "Please enter a valid phone number, including the country code if outside India.";
  }
  if (!errors.message && data.message && data.message.length < 10) {
    errors.message = "Please tell us a little more (at least 10 characters).";
  }
  return errors;
}
