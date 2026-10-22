import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;
const KEY_LENGTH = 64;

/** Hashes a password as "scrypt$<salt>$<hash>" (both base64url). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = await scrypt(password, Buffer.from(salt, "base64url"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** A readable temporary password for admin-led resets, e.g. "amber-7Kq2-tree". */
export function temporaryPassword(): string {
  const words = ["amber", "arbor", "branch", "canopy", "grove", "leaf", "root", "cedar", "maple", "oak"];
  const pick = () => words[randomBytes(1)[0] % words.length];
  return `${pick()}-${randomBytes(3).toString("base64url")}-${pick()}`;
}

export const PASSWORD_MIN = 10;

export function passwordProblem(password: string): string | null {
  if (password.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (password.length > 200) return "That password is too long.";
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) return "Use a mix of letters and numbers.";
  return null;
}
