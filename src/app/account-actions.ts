"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCOUNT_TABLES, getCurrentAccount, getConsultantProfile } from "@/lib/accounts/data";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/accounts/password";
import { ACCOUNT_COOKIE, accountCookieOptions, createAccountToken, type AccountRole } from "@/lib/accounts/session";
import {
  CITIES,
  DAY_RATE_BANDS,
  DELIVERY_MODES,
  EMAIL_RE,
  emailDomain,
  EMPLOYEE_BANDS,
  EXPERTISE,
  isWorkEmail,
} from "@/lib/phase2/options";
import { createServiceClient } from "@/lib/supabase/admin";
import { MEDIA_BUCKET } from "@/lib/supabase/config";

export type FormState = { error: string | null; fieldErrors?: Record<string, string>; ok?: string };

const db = () => createServiceClient();
const text = (form: FormData, key: string, max = 300) => String(form.get(key) ?? "").trim().slice(0, max);
const nullable = (value: string) => (value ? value : null);
const slowDown = () => new Promise((resolve) => setTimeout(resolve, 700));

async function startSession(id: string, role: AccountRole) {
  (await cookies()).set(ACCOUNT_COOKIE, createAccountToken(id, role), accountCookieOptions);
}

async function emailTaken(email: string) {
  const { data } = await db().from(ACCOUNT_TABLES.accounts).select("id").eq("email", email).maybeSingle();
  return Boolean(data);
}

/* ---------- sign up ---------- */

export async function signUpConsultant(_prev: FormState, form: FormData): Promise<FormState> {
  if (text(form, "website_url")) return { error: null }; // honeypot
  const fullName = text(form, "full_name", 120);
  const email = text(form, "email", 200).toLowerCase();
  const password = String(form.get("password") ?? "");
  const fieldErrors: Record<string, string> = {};
  if (!fullName) fieldErrors.full_name = "Please enter your full name.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Please enter a valid email address.";
  const pw = passwordProblem(password);
  if (pw) fieldErrors.password = pw;
  if (form.get("terms") !== "on") fieldErrors.terms = "Please agree to continue.";
  if (Object.keys(fieldErrors).length) return { error: "Please check the highlighted fields.", fieldErrors };
  if (await emailTaken(email)) return { error: "An account with this email already exists. Try signing in." };

  const { data, error } = await db()
    .from(ACCOUNT_TABLES.accounts)
    // Consultants can use their account straight away; their profile goes live only after admin approval.
    .insert({ email, password_hash: await hashPassword(password), role: "consultant", status: "approved" })
    .select("id")
    .single();
  if (error || !data) return { error: "Sorry, we couldn’t create your account. Please try again." };
  await db().from(ACCOUNT_TABLES.consultants).insert({ account_id: data.id, full_name: fullName });
  await startSession(data.id, "consultant");
  redirect("/account");
}

export async function signUpCompany(_prev: FormState, form: FormData): Promise<FormState> {
  if (text(form, "website_url")) return { error: null }; // honeypot
  const values = {
    company_name: text(form, "company_name", 160),
    website: text(form, "website", 300),
    industry: text(form, "industry", 120),
    city: text(form, "city", 80),
    employee_count: text(form, "employee_count", 40),
    contact_name: text(form, "contact_name", 120),
    contact_role: text(form, "contact_role", 120),
    phone: text(form, "phone", 30),
  };
  const email = text(form, "email", 200).toLowerCase();
  const password = String(form.get("password") ?? "");
  const fieldErrors: Record<string, string> = {};
  if (!values.company_name) fieldErrors.company_name = "Please enter your company name.";
  if (!values.contact_name) fieldErrors.contact_name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Please enter a valid email address.";
  else if (!isWorkEmail(email)) fieldErrors.email = "Please use your company email address (not Gmail, Yahoo, Outlook or similar).";
  if (values.employee_count && !EMPLOYEE_BANDS.includes(values.employee_count as never)) fieldErrors.employee_count = "Please choose from the list.";
  if (values.city && !CITIES.includes(values.city as never)) fieldErrors.city = "Please choose from the list.";
  const pw = passwordProblem(password);
  if (pw) fieldErrors.password = pw;
  if (form.get("terms") !== "on") fieldErrors.terms = "Please agree to continue.";
  if (Object.keys(fieldErrors).length) return { error: "Please check the highlighted fields.", fieldErrors };
  if (await emailTaken(email)) return { error: "An account with this email already exists. Try signing in." };

  const { data, error } = await db()
    .from(ACCOUNT_TABLES.accounts)
    .insert({ email, password_hash: await hashPassword(password), role: "company", status: "pending" })
    .select("id")
    .single();
  if (error || !data) return { error: "Sorry, we couldn’t create your account. Please try again." };
  await db()
    .from(ACCOUNT_TABLES.companies)
    .insert({
      account_id: data.id,
      email_domain: emailDomain(email),
      company_name: values.company_name,
      contact_name: values.contact_name,
      website: nullable(values.website),
      industry: nullable(values.industry),
      city: nullable(values.city),
      employee_count: nullable(values.employee_count),
      contact_role: nullable(values.contact_role),
      phone: nullable(values.phone),
    });
  await startSession(data.id, "company");
  redirect("/account");
}

/* ---------- sign in / out ---------- */

export async function signInAccount(_prev: FormState, form: FormData): Promise<FormState> {
  const email = text(form, "email", 200).toLowerCase();
  const password = String(form.get("password") ?? "");
  const { data } = await db()
    .from(ACCOUNT_TABLES.accounts)
    .select("id, role, status, password_hash")
    .eq("email", email)
    .maybeSingle();
  if (!data || !(await verifyPassword(password, data.password_hash))) {
    await slowDown();
    return { error: "That email and password don’t match. Please try again." };
  }
  if (data.status === "suspended") return { error: "This account has been paused. Please contact Axon Arbor." };
  await db().from(ACCOUNT_TABLES.accounts).update({ last_login_at: new Date().toISOString() }).eq("id", data.id);
  await startSession(data.id, data.role as AccountRole);
  redirect("/account");
}

export async function signOutAccount() {
  (await cookies()).delete({ name: ACCOUNT_COOKIE, path: "/" });
  redirect("/sign-in");
}

export async function changePassword(_prev: FormState, form: FormData): Promise<FormState> {
  const account = await getCurrentAccount();
  if (!account) return { error: "Please sign in again." };
  const current = String(form.get("current_password") ?? "");
  const next = String(form.get("new_password") ?? "");
  const { data } = await db().from(ACCOUNT_TABLES.accounts).select("password_hash").eq("id", account.id).single();
  if (!data || !(await verifyPassword(current, data.password_hash))) return { error: "Your current password isn’t right." };
  const pw = passwordProblem(next);
  if (pw) return { error: pw };
  await db()
    .from(ACCOUNT_TABLES.accounts)
    .update({ password_hash: await hashPassword(next), updated_at: new Date().toISOString() })
    .eq("id", account.id);
  return { error: null, ok: "Password changed." };
}

/* ---------- consultant profile ---------- */

const REQUIRED_PROFILE_FIELDS = ["full_name", "phone", "city", "expertise", "years_experience", "industries", "delivery_mode", "languages", "bio"] as const;

function readProfile(form: FormData) {
  const expertise = [text(form, "expertise_1", 80), text(form, "expertise_2", 80), text(form, "expertise_3", 80)]
    .filter(Boolean)
    .filter((e, i, all) => all.indexOf(e) === i);
  const years = text(form, "years_experience", 3);
  return {
    full_name: text(form, "full_name", 120),
    phone: nullable(text(form, "phone", 30)),
    city: nullable(text(form, "city", 80)),
    expertise,
    years_experience: years === "" ? null : Number(years),
    industries: nullable(text(form, "industries", 300)),
    delivery_mode: nullable(text(form, "delivery_mode", 20)),
    languages: nullable(text(form, "languages", 200)),
    bio: nullable(text(form, "bio", 600)),
    linkedin_url: nullable(text(form, "linkedin_url", 300)),
    certifications: nullable(text(form, "certifications", 300)),
    notable_clients: nullable(text(form, "notable_clients", 300)),
    day_rate_band: nullable(text(form, "day_rate_band", 60)),
    availability: nullable(text(form, "availability", 120)),
    photo_url: nullable(text(form, "photo_url", 500)),
    consent: form.get("consent") === "on",
  };
}

function profileErrors(p: ReturnType<typeof readProfile>, submitting: boolean) {
  const e: Record<string, string> = {};
  if (p.city && !CITIES.includes(p.city as never)) e.city = "Please choose from the list.";
  if (p.expertise.some((x) => !EXPERTISE.includes(x as never))) e.expertise_1 = "Please choose from the list.";
  if (p.delivery_mode && !DELIVERY_MODES.includes(p.delivery_mode as never)) e.delivery_mode = "Please choose from the list.";
  if (p.day_rate_band && !DAY_RATE_BANDS.includes(p.day_rate_band as never)) e.day_rate_band = "Please choose from the list.";
  if (p.years_experience !== null && (!Number.isInteger(p.years_experience) || p.years_experience < 0 || p.years_experience > 60)) {
    e.years_experience = "Enter a whole number between 0 and 60.";
  }
  if (p.linkedin_url && !/^https?:\/\//.test(p.linkedin_url)) e.linkedin_url = "Start the link with https://";
  if (submitting) {
    for (const key of REQUIRED_PROFILE_FIELDS) {
      const v = p[key];
      if (v === null || v === "" || (Array.isArray(v) && v.length === 0)) e[key === "expertise" ? "expertise_1" : key] = "Required before you submit.";
    }
    if (!p.consent) e.consent = "Please agree so we can share your profile with companies.";
  }
  return e;
}

/** intent: "save" keeps a draft; "submit" sends the profile to Axon Arbor for approval. */
export async function saveConsultantProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const account = await getCurrentAccount();
  if (!account || account.role !== "consultant") return { error: "Please sign in again." };
  const current = await getConsultantProfile(account.id);
  const submitting = form.get("intent") === "submit";
  const profile = readProfile(form);
  const fieldErrors = profileErrors(profile, submitting);
  if (Object.keys(fieldErrors).length) return { error: "Please check the highlighted fields.", fieldErrors };

  const status = current?.profile_status ?? "draft";
  // Submitting (or editing a live profile) sends it back to Axon Arbor for review.
  const nextStatus = submitting || status === "live" ? "pending" : status === "removed" ? "draft" : status;
  const { error } = await db()
    .from(ACCOUNT_TABLES.consultants)
    .update({
      ...profile,
      profile_status: nextStatus,
      submitted_at: nextStatus === "pending" ? new Date().toISOString() : current?.submitted_at ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("account_id", account.id);
  if (error) return { error: "Sorry, we couldn’t save your profile. Please try again." };
  refresh();
  return {
    error: null,
    ok:
      nextStatus === "pending"
        ? "Saved and sent to Axon Arbor for approval. We’ll review it shortly."
        : "Draft saved. Submit it for approval when you’re ready.",
  };
}

export async function requestProfileRemoval(): Promise<FormState> {
  const account = await getCurrentAccount();
  if (!account || account.role !== "consultant") return { error: "Please sign in again." };
  await db()
    .from(ACCOUNT_TABLES.consultants)
    .update({ profile_status: "removal_requested", updated_at: new Date().toISOString() })
    .eq("account_id", account.id);
  refresh();
  return { error: null, ok: "Removal requested. Axon Arbor will confirm shortly." };
}

export async function createProfilePhotoUpload(file: { type: string; size: number }) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "consultant") return { ok: false as const, error: "Please sign in again." };
  const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[file.type];
  if (!ext) return { ok: false as const, error: "Please choose a JPG, PNG or WebP photo." };
  if (file.size > 5 * 1024 * 1024) return { ok: false as const, error: "Photos must be smaller than 5 MB." };
  const path = `consultants/${account.id}/${Date.now()}.${ext}`;
  const bucket = createServiceClient().storage.from(MEDIA_BUCKET);
  const { data, error } = await bucket.createSignedUploadUrl(path);
  if (error || !data) return { ok: false as const, error: "Upload failed. Please try again." };
  return { ok: true as const, path: data.path, token: data.token, publicUrl: bucket.getPublicUrl(data.path).data.publicUrl };
}

/* ---------- company profile ---------- */

export async function saveCompanyProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const account = await getCurrentAccount();
  if (!account || account.role !== "company") return { error: "Please sign in again." };
  const companyName = text(form, "company_name", 160);
  const contactName = text(form, "contact_name", 120);
  if (!companyName || !contactName) return { error: "Company name and contact name are required." };
  const employeeCount = text(form, "employee_count", 40);
  const city = text(form, "city", 80);
  if (employeeCount && !EMPLOYEE_BANDS.includes(employeeCount as never)) return { error: "Please choose a company size from the list." };
  if (city && !CITIES.includes(city as never)) return { error: "Please choose a city from the list." };
  const { error } = await db()
    .from(ACCOUNT_TABLES.companies)
    .update({
      company_name: companyName,
      contact_name: contactName,
      website: nullable(text(form, "website", 300)),
      industry: nullable(text(form, "industry", 120)),
      city: nullable(city),
      employee_count: nullable(employeeCount),
      contact_role: nullable(text(form, "contact_role", 120)),
      phone: nullable(text(form, "phone", 30)),
      updated_at: new Date().toISOString(),
    })
    .eq("account_id", account.id);
  return error ? { error: "Sorry, we couldn’t save. Please try again." } : { error: null, ok: "Company details saved." };
}
