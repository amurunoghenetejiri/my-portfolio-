import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, slugify } from "@/lib/admin-helpers";
import { Card, Text, TextArea, ImageField, Toast } from "./dashboard.profile";
import { Eye, EyeOff, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/blog")({
  component: BlogPage,
});

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  category: string | null;
  is_published: boolean;
  published_at: string | null;
};

function BlogPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Post> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<Post>) => {
      const slug = p.slug || slugify(p.title ?? "");
      const published_at = p.is_published && !p.published_at ? new Date().toISOString() : p.published_at ?? null;
      const payload = { ...p, slug, published_at };
      if (p.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { title, ...rest } = payload;
        const { error } = await supabase.from("blog_posts").insert({ ...rest, title: title! });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); setEditing(null); },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-blog"] }),
  });

  const togglePublish = useMutation({
    mutationFn: async (p: Post) => {
      const { error } = await supabase.from("blog_posts").update({
        is_published: !p.is_published,
        published_at: !p.is_published ? new Date().toISOString() : p.published_at,
      }).eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-blog"] }),
  });

  if (editing) return <PostEditor initial={editing} onCancel={() => setEditing(null)} onSave={(p) => save.mutate(p)} saving={save.isPending} error={save.error as Error | null} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">{data?.length ?? 0} post{(data?.length ?? 0) === 1 ? "" : "s"}</p>
        </div>
        <button onClick={() => setEditing({ title: "", excerpt: "", content: "", is_published: false })} className="btn-emerald">
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      {isLoading ? (
        <div className="grid place-items-center h-40"><Loader2 className="h-6 w-6 animate-spin text-emerald-300" /></div>
      ) : (
        <div className="space-y-3">
          {data?.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-4 border border-emerald-400/10 flex flex-wrap items-center gap-4">
              <div className="h-16 w-24 rounded-xl overflow-hidden bg-card/40 grid place-items-center shrink-0">
                {p.featured_image_url ? <img src={p.featured_image_url} alt="" className="h-full w-full object-cover" /> : <span className="text-[10px] text-muted-foreground">No image</span>}
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold">{p.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${p.is_published ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/30" : "bg-card/40 text-muted-foreground border border-border/40"}`}>
                    {p.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                {p.category && <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-gradient mt-1">{p.category}</div>}
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{p.excerpt}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => togglePublish.mutate(p)} className="text-xs text-muted-foreground hover:text-emerald-300 inline-flex items-center gap-1 px-2 py-1">
                  {p.is_published ? <><EyeOff className="h-3 w-3" /> Unpublish</> : <><Eye className="h-3 w-3" /> Publish</>}
                </button>
                <button onClick={() => setEditing(p)} className="text-xs text-emerald-300 inline-flex items-center gap-1 px-2 py-1"><Pencil className="h-3 w-3" /> Edit</button>
                <button onClick={() => { if (confirm(`Delete "${p.title}"?`)) remove.mutate(p.id); }} className="text-xs text-red-300 inline-flex items-center gap-1 px-2 py-1"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PostEditor({ initial, onCancel, onSave, saving, error }: {
  initial: Partial<Post>;
  onCancel: () => void;
  onSave: (p: Partial<Post>) => void;
  saving: boolean;
  error: Error | null;
}) {
  const [p, setP] = useState<Partial<Post>>(initial);
  const update = <K extends keyof Post>(k: K, v: Post[K]) => setP((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between gap-3">
        <div>
          <button onClick={onCancel} className="text-xs text-muted-foreground hover:text-foreground">← Back to blog</button>
          <h1 className="mt-1 font-display text-3xl font-bold">{p.id ? "Edit post" : "New post"}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="btn-ghost-metal"><X className="h-4 w-4" /> Cancel</button>
          <button onClick={() => onSave(p)} disabled={saving || !p.title} className="btn-emerald disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
          </button>
        </div>
      </div>

      {error && <Toast tone="error">{error.message}</Toast>}

      <Card title="Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Text label="Title" value={p.title ?? ""} onChange={(v) => update("title", v)} />
          <Text label="Category" value={p.category ?? ""} onChange={(v) => update("category", v as string)} />
          <Text label="Slug (auto if blank)" value={p.slug ?? ""} onChange={(v) => update("slug", v)} />
        </div>
        <TextArea label="Excerpt" value={p.excerpt ?? ""} onChange={(v) => update("excerpt", v)} rows={2} />
        <TextArea label="Content (Markdown supported)" value={p.content ?? ""} onChange={(v) => update("content", v)} rows={12} />
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!p.is_published} onChange={(e) => update("is_published", e.target.checked)} /> Published
        </label>
      </Card>

      <Card title="Featured image">
        <ImageField
          label="Featured image"
          value={p.featured_image_url ?? null}
          onFile={async (f) => update("featured_image_url", await uploadMedia(f, "blog"))}
          onClear={() => update("featured_image_url", null)}
        />
      </Card>
    </div>
  );
}
