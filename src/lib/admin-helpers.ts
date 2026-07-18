import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Upload a file to the `media` bucket. Returns a long-lived signed URL. */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  return uploadTo("media", file, folder);
}

/** Upload a file to the `cv` bucket. Returns a long-lived signed URL. */
export async function uploadCv(file: File): Promise<string> {
  return uploadTo("cv", file, "cv");
}

async function uploadTo(bucket: "media" | "cv", file: File, folder: string) {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, TEN_YEARS);
  if (signErr) throw signErr;
  return data.signedUrl;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/**
 * Given a possibly-expired Supabase signed URL, extract its object path and
 * return a fresh signed URL. Falls back to the original url if it isn't a
 * recognisable signed URL.
 */
export async function refreshSignedUrl(
  url: string | null | undefined,
  bucket: "media" | "cv" = "media",
  expiresIn: number = 60 * 60 * 24 * 7,
): Promise<string | null> {
  if (!url) return null;
  const match = url.match(/\/storage\/v1\/object\/sign\/([^/]+)\/([^?]+)/);
  if (!match) return url;
  const [, b, path] = match;
  const { data, error } = await supabase.storage
    .from(b as "media" | "cv")
    .createSignedUrl(decodeURIComponent(path), expiresIn);
  if (error || !data) return url;
  return data.signedUrl;
}


