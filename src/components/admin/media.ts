"use client";

import { MEDIA_BUCKET, MEDIA_FOLDER } from "@/lib/supabase/config";
import { createAdminBrowserClient } from "@/lib/supabase/browser";

export type MediaItem = { name: string; src: string; width: number; height: number; builtIn?: boolean };

/** Images that ship with the site, so admins can reuse them. */
export const BUILT_IN_IMAGES: MediaItem[] = [
  { name: "Logo", src: "/brand/logo.png", width: 690, height: 615 },
  { name: "Richa Singh", src: "/people/richa.webp", width: 640, height: 800 },
  { name: "Suresh Tripathi", src: "/people/suresh.webp", width: 480, height: 600 },
  { name: "Shailesh Singh", src: "/people/shailesh.webp", width: 480, height: 600 },
  { name: "Vikas Baijal", src: "/people/vikas.webp", width: 480, height: 600 },
  { name: "Swati Adhikary", src: "/people/swati.webp", width: 480, height: 600 },
  { name: "Vipul Jain", src: "/people/vipul.webp", width: 480, height: 600 },
  { name: "Vikram Nandwani", src: "/people/vikram.webp", width: 480, height: 600 },
  { name: "R. SreeKumar", src: "/people/sreekumar.webp", width: 480, height: 600 },
  { name: "Vineet Saraiwala", src: "/people/vineet.webp", width: 480, height: 600 },
  { name: "Luxury", src: "/hospitality/luxury.webp", width: 690, height: 792 },
  { name: "Restaurant", src: "/hospitality/restaurant.webp", width: 690, height: 1032 },
  { name: "Retail", src: "/hospitality/retail.webp", width: 690, height: 1031 },
  { name: "Strengthscape", src: "/partners/strengthscape.png", width: 637, height: 187 },
  { name: "London Speaker Bureau", src: "/partners/london-speakers-bureau.webp", width: 600, height: 600 },
].map((item) => ({ ...item, builtIn: true }));

export const MAX_UPLOAD_MB = 10;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif", "image/svg+xml"];
export const ACCEPT_ATTR = ACCEPTED.join(",");

function readDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth || 1200, height: img.naturalHeight || 800 });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: 1200, height: 800 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

function slug(name: string) {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "jpg";
  return `${base || "image"}.${ext}`;
}

/** Uploads an image to the Axon Arbor media bucket. Dimensions are stored in the file name. */
export async function uploadImage(file: File): Promise<MediaItem> {
  if (!ACCEPTED.includes(file.type)) throw new Error("Please choose a PNG, JPG, WebP, GIF, AVIF or SVG image.");
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) throw new Error(`Images must be smaller than ${MAX_UPLOAD_MB} MB.`);

  const { width, height } = await readDimensions(file);
  const path = `${MEDIA_FOLDER}/${Date.now()}-${width}x${height}-${slug(file.name)}`;
  const supabase = createAdminBrowserClient();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { name: file.name, src: data.publicUrl, width, height };
}

const DIMENSIONS_RE = /^\d+-(\d+)x(\d+)-(.+)$/;

export async function listUploads(): Promise<MediaItem[]> {
  const supabase = createAdminBrowserClient();
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list(MEDIA_FOLDER, { limit: 500, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw new Error(`Could not load images: ${error.message}`);
  return (data ?? [])
    .filter((f) => f.name && !f.name.startsWith("."))
    .map((f) => {
      const match = f.name.match(DIMENSIONS_RE);
      const { publicUrl } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(`${MEDIA_FOLDER}/${f.name}`).data;
      return {
        name: match?.[3] ?? f.name,
        src: publicUrl,
        width: match ? Number(match[1]) : 1200,
        height: match ? Number(match[2]) : 800,
      };
    });
}

export async function deleteUpload(src: string) {
  const marker = `/${MEDIA_BUCKET}/`;
  const path = decodeURIComponent(src.slice(src.indexOf(marker) + marker.length));
  const supabase = createAdminBrowserClient();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw new Error(`Could not delete: ${error.message}`);
}
