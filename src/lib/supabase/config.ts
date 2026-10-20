/**
 * Supabase project "supabase-charcoal-planet". The URL and publishable key are
 * public by design (row-level security protects the data), so they default to
 * the project's values and can be overridden per environment.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://geajhjiceaocsljqffkh.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_P-ONqhtWLdZaCjojq53oeA_MwZetJy2";

/** All Axon Arbor objects are prefixed: the project is shared with other sites. */
export const TABLES = {
  content: "axon_arbor_content",
  versions: "axon_arbor_content_versions",
  submissions: "axon_arbor_submissions",
} as const;

export const RPC = {
  publish: "axon_arbor_publish",
  discardDraft: "axon_arbor_discard_draft",
  restoreVersion: "axon_arbor_restore_version",
} as const;

export const MEDIA_BUCKET = "axon-arbor-media";
export const MEDIA_FOLDER = "uploads";

/** Cache tag on all published content; the admin's Publish action expires it. */
export const CONTENT_TAG = "axon-arbor-content";
