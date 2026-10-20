"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isContentKey } from "@/content/registry";
import { getAdminSession } from "@/lib/admin/auth";
import { stripMarkers } from "@/lib/stega";
import { CONTENT_TAG, RPC, TABLES } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

const SESSION_EXPIRED = "Your session has expired. Please sign in again.";
const MAX_DOCUMENT_BYTES = 500_000;

/** Removes any inline-editor markers that slipped into a value. */
function clean(value: unknown): unknown {
  if (typeof value === "string") return stripMarkers(value);
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clean(v)]));
  }
  return value;
}

/** Saves edited pages as drafts. Nothing changes on the live site until publish. */
export async function saveDrafts(changes: { key: string; data: unknown }[]): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: SESSION_EXPIRED };
  if (changes.length === 0) return { ok: true };

  const rows = [];
  for (const { key, data } of changes) {
    if (!isContentKey(key)) return { ok: false, error: `Unknown page “${key}”.` };
    const cleaned = clean(data);
    if (JSON.stringify(cleaned).length > MAX_DOCUMENT_BYTES) {
      return { ok: false, error: `The “${key}” page is too large to save.` };
    }
    rows.push({
      key,
      status: "draft",
      data: cleaned,
      updated_at: new Date().toISOString(),
      updated_by: session.user.id,
    });
  }

  const { error } = await session.supabase.from(TABLES.content).upsert(rows, { onConflict: "key,status" });
  return error ? { ok: false, error: `Could not save: ${error.message}` } : { ok: true };
}

/** Makes every draft live and refreshes the public site's cache. */
export async function publishSite(): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: SESSION_EXPIRED };

  const { error } = await session.supabase.rpc(RPC.publish);
  if (error) return { ok: false, error: `Could not publish: ${error.message}` };

  updateTag(CONTENT_TAG);
  return { ok: true };
}

/** Throws away unpublished edits, resetting drafts to the live site. */
export async function discardDrafts(): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: SESSION_EXPIRED };
  const { error } = await session.supabase.rpc(RPC.discardDraft);
  return error ? { ok: false, error: `Could not discard: ${error.message}` } : { ok: true };
}

/** Loads an earlier published version into the drafts, ready to review and publish. */
export async function restoreVersion(versionId: number): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: SESSION_EXPIRED };
  const { error } = await session.supabase.rpc(RPC.restoreVersion, { version_id: versionId });
  return error ? { ok: false, error: `Could not restore: ${error.message}` } : { ok: true };
}

export async function updateSubmission(
  id: string,
  patch: { status?: "new" | "read" | "archived"; notes?: string | null },
): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: SESSION_EXPIRED };
  const { error } = await session.supabase.from(TABLES.submissions).update(patch).eq("id", id);
  return error ? { ok: false, error: `Could not update: ${error.message}` } : { ok: true };
}

export async function deleteSubmission(id: string): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: SESSION_EXPIRED };
  const { error } = await session.supabase.from(TABLES.submissions).delete().eq("id", id);
  return error ? { ok: false, error: `Could not delete: ${error.message}` } : { ok: true };
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
