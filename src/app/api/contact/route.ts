import { normaliseContact, validateContact } from "@/lib/contact-validation";
import { TABLES } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Receives contact form submissions: validates them and stores them in
 * Supabase, where admins read them at /admin/enquiries.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field.
  if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
    return Response.json({ ok: true });
  }

  const data = normaliseContact(body);
  const errors = validateContact(data);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  // Stored for the admin dashboard (/admin/enquiries). The anonymous role may
  // only insert, never read, so no enquiry data is returned here.
  const { error } = await createPublicClient()
    .from(TABLES.submissions)
    .insert({
      name: data.name,
      organisation: data.organisation,
      role: data.role || null,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
    });

  if (error) {
    console.error("[contact] Could not store enquiry:", error.message, { email: data.email });
    return Response.json({ ok: false, error: "Could not send your message." }, { status: 503 });
  }

  // TODO: also notify the team by email.
  return Response.json({ ok: true });
}
