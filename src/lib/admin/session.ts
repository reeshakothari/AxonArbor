import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Admin login without Supabase Auth: credentials come from the environment
 * (ADMIN_USERNAME / ADMIN_PASSWORD) and a signed, http-only cookie keeps the
 * admin signed in.
 */

export const SESSION_COOKIE = "aa_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

type Payload = { u: string; exp: number };

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET is missing or too short. Set it in .env.local.");
  }
  return value;
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  // Compare equal-length buffers so timing doesn't reveal the length either.
  const len = Math.max(ab.length, bb.length, 1);
  const pa = Buffer.alloc(len);
  const pb = Buffer.alloc(len);
  ab.copy(pa);
  bb.copy(pb);
  return timingSafeEqual(pa, pb) && ab.length === bb.length;
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

/** True when the username and password match the ones in the environment. */
export function checkCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedUser || !expectedPass) return false;
  // Evaluate both so a wrong username takes as long as a wrong password.
  const userOk = safeEqual(username.trim().toLowerCase(), expectedUser.trim().toLowerCase());
  const passOk = safeEqual(password, expectedPass);
  return userOk && passOk;
}

export function createSessionToken(username: string): string {
  const payload: Payload = { u: username, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

/** The signed-in admin's username, or null if the token is missing, forged or expired. */
export function readSessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature || !safeEqual(signature, sign(body))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
    if (typeof payload.u !== "string" || payload.exp < Date.now() / 1000) return null;
    // A changed username in the environment invalidates old sessions.
    if (payload.u.toLowerCase() !== (process.env.ADMIN_USERNAME ?? "").toLowerCase()) return null;
    return payload.u;
  } catch {
    return null;
  }
}
