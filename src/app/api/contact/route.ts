import { normaliseContact, validateContact } from "@/lib/contact-validation";

/**
 * Receives contact form submissions. For now it validates and logs; email
 * delivery will be wired in later.
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

  // TODO(phase 2): send email / store enquiry instead of logging.
  console.log("[contact] New enquiry", {
    ...data,
    receivedAt: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
