import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Copy,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/lib/admin-helpers";

export const Route = createFileRoute("/_authenticated/dashboard/media")({
  head: () => ({
    meta: [
      { title: "Media Library — D4 TECH Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MediaLibraryPage,
});

const FOLDERS = ["all", "avatar_url", "cover_url", "company_logo_url", "projects", "blog", "gallery", "testimonials"] as const;
type Folder = (typeof FOLDERS)[number];

type MediaItem = {
  name: string;
  path: string;
  url: string;
  size: number;
  updated_at: string;
  contentType?: string;
};

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function isImage(name: string, contentType?: string) {
  if (contentType?.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(name);
}

function MediaLibraryPage() {
  const qc = useQueryClient();
  const [folder, setFolder] = useState<Folder>("all");
  const [q, setQ] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadFolder, setUploadFolder] = useState<Exclude<Folder, "all">>("gallery");

  const { data, isLoading } = useQuery({
    queryKey: ["media-library", folder],
    queryFn: async () => {
      const folders =
        folder === "all"
          ? (FOLDERS.filter((f) => f !== "all") as Exclude<Folder, "all">[])
          : [folder];

      const items: MediaItem[] = [];
      for (const f of folders) {
        const { data: entries, error } = await supabase.storage
          .from("media")
          .list(f, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
        if (error) continue;
        for (const entry of entries ?? []) {
          if (entry.name === ".emptyFolderPlaceholder") continue;
          const path = `${f}/${entry.name}`;
          const { data: signed } = await supabase.storage
            .from("media")
            .createSignedUrl(path, TEN_YEARS);
          items.push({
            name: entry.name,
            path,
            url: signed?.signedUrl ?? "",
            size: (entry.metadata as { size?: number } | null)?.size ?? 0,
            updated_at: entry.updated_at ?? entry.created_at ?? "",
            contentType: (entry.metadata as { mimetype?: string } | null)?.mimetype,
          });
        }
      }
      return items;
    },
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data ?? [];
    return (data ?? []).filter((m) => m.name.toLowerCase().includes(term) || m.path.toLowerCase().includes(term));
  }, [data, q]);

  const remove = useMutation({
    mutationFn: async (path: string) => {
      const { error } = await supabase.storage.from("media").remove([path]);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media-library"] }),
  });

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file, uploadFolder);
      }
      qc.invalidateQueries({ queryKey: ["media-library"] });
    } finally {
      setUploading(false);
    }
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Media Library</h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            All images and files uploaded through the dashboard. Upload once here and the long-lived
            signed URL works everywhere — preview and production.
          </p>
        </div>
        <label
          className={`btn-emerald cursor-pointer ${uploading ? "opacity-70 pointer-events-none" : ""}`}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload files
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              void onUpload(e.target.files);
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search files…"
            className="w-full rounded-full border border-border/60 bg-card/40 backdrop-blur pl-10 pr-4 py-2 text-sm outline-none focus:border-emerald-400/60"
          />
        </div>
        <div className="flex flex-wrap gap-1 rounded-2xl border border-border/60 bg-card/40 p-1">
          {FOLDERS.map((f) => (
            <button
              key={f}
              onClick={() => setFolder(f)}
              className={`px-3 py-1.5 rounded-xl text-xs uppercase tracking-widest transition ${
                folder === f
                  ? "bg-emerald-400/20 text-emerald-300"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f.replace("_url", "").replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Upload to:</span>
          <select
            value={uploadFolder}
            onChange={(e) => setUploadFolder(e.target.value as Exclude<Folder, "all">)}
            className="rounded-xl border border-border/60 bg-card/40 px-3 py-1.5 text-xs outline-none focus:border-emerald-400/60"
          >
            {FOLDERS.filter((f) => f !== "all").map((f) => (
              <option key={f} value={f}>
                {f.replace("_url", "").replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid place-items-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-300" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border border-emerald-400/10">
          <ImageIcon className="mx-auto h-8 w-8 text-emerald-300 mb-3" />
          <p className="text-sm text-muted-foreground">No media in this folder yet. Upload something to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((m) => (
            <div key={m.path} className="glass rounded-2xl border border-emerald-400/10 overflow-hidden group">
              <div className="aspect-square bg-black/40 grid place-items-center relative">
                {isImage(m.name, m.contentType) ? (
                  <img
                    src={m.url}
                    alt={m.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-xs text-muted-foreground p-4 text-center break-all">{m.name}</div>
                )}
              </div>
              <div className="p-3 space-y-1">
                <div className="text-xs font-medium truncate" title={m.name}>{m.name}</div>
                <div className="text-[10px] text-muted-foreground flex items-center justify-between">
                  <span>{humanSize(m.size)}</span>
                  <span className="truncate max-w-[60%]" title={m.path}>{m.path.split("/")[0]}</span>
                </div>
                <div className="flex items-center gap-1 pt-2">
                  <button
                    onClick={() => void copy(m.url)}
                    title="Copy URL"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 hover:border-emerald-400/60 text-muted-foreground hover:text-emerald-300 transition"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noreferrer"
                    title="Open"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 hover:border-emerald-400/60 text-muted-foreground hover:text-emerald-300 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={m.url}
                    download={m.name}
                    title="Download"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 hover:border-emerald-400/60 text-muted-foreground hover:text-emerald-300 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${m.name}?`)) remove.mutate(m.path);
                    }}
                    title="Delete"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 hover:border-red-500/60 text-muted-foreground hover:text-red-300 transition ml-auto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
