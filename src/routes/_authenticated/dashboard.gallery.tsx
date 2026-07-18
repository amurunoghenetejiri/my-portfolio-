import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/lib/admin-helpers";
import { Card, Text, TextArea, ImageField, Toast } from "./dashboard.profile";
import { Eye, EyeOff, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/gallery")({
  component: GalleryPage,
});

type Item = {
  id: string;
  title: string;
  category: string | null;
  image_url: string;
  description: string | null;
  sort_order: number;
  is_hidden: boolean;
};

function GalleryPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Item> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Item[];
    },
  });

  const save = useMutation({
    mutationFn: async (it: Partial<Item>) => {
      if (!it.image_url || !it.title) throw new Error("Title and image are required.");
      if (it.id) {
        const { error } = await supabase.from("gallery_items").update(it).eq("id", it.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("gallery_items").insert({
          title: it.title,
          image_url: it.image_url,
          category: it.category ?? null,
          description: it.description ?? null,
          sort_order: it.sort_order ?? 0,
          is_hidden: it.is_hidden ?? false,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-gallery"] }); setEditing(null); },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-gallery"] }),
  });

  const toggleHidden = useMutation({
    mutationFn: async (it: Item) => {
      const { error } = await supabase.from("gallery_items").update({ is_hidden: !it.is_hidden }).eq("id", it.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-gallery"] }),
  });

  if (editing) {
    return <Editor initial={editing} onCancel={() => setEditing(null)} onSave={(v) => save.mutate(v)} saving={save.isPending} error={save.error as Error | null} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Gallery</h1>
          <p className="mt-1 text-sm text-muted-foreground">{data?.length ?? 0} item{(data?.length ?? 0) === 1 ? "" : "s"}</p>
        </div>
        <button onClick={() => setEditing({ title: "", category: "", image_url: "", description: "", sort_order: 0, is_hidden: false })} className="btn-emerald">
          <Plus className="h-4 w-4" /> New item
        </button>
      </div>

      {isLoading ? (
        <div className="grid place-items-center h-40"><Loader2 className="h-6 w-6 animate-spin text-emerald-300" /></div>
      ) : (data?.length ?? 0) === 0 ? (
        <div className="glass rounded-2xl p-10 text-center border border-emerald-400/10 text-sm text-muted-foreground">
          No gallery items yet. Click <span className="text-emerald-300">New item</span> to add your first upload.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((it) => (
            <div key={it.id} className="glass rounded-2xl overflow-hidden border border-emerald-400/10">
              <div className="aspect-video bg-card/40 overflow-hidden">
                {it.image_url ? <img src={it.image_url} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-muted-foreground">No image</span>}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-sm">{it.title}</h3>
                  {it.is_hidden && <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
                {it.category && <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-gradient">{it.category}</div>}
                <div className="flex flex-wrap gap-1 pt-2 border-t border-border/40">
                  <button onClick={() => setEditing(it)} className="text-xs text-emerald-300 hover:underline inline-flex items-center gap-1"><Pencil className="h-3 w-3" /> Edit</button>
                  <button onClick={() => toggleHidden.mutate(it)} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 ml-auto">{it.is_hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}{it.is_hidden ? "Show" : "Hide"}</button>
                  <button onClick={() => { if (confirm(`Delete "${it.title}"?`)) remove.mutate(it.id); }} className="text-xs text-red-300 hover:underline inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Editor({ initial, onCancel, onSave, saving, error }: {
  initial: Partial<Item>;
  onCancel: () => void;
  onSave: (v: Partial<Item>) => void;
  saving: boolean;
  error: Error | null;
}) {
  const [it, setIt] = useState<Partial<Item>>(initial);
  const update = <K extends keyof Item>(k: K, v: Item[K]) => setIt((prev) => ({ ...prev, [k]: v }));
  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between gap-3">
        <div>
          <button onClick={onCancel} className="text-xs text-muted-foreground hover:text-foreground">← Back to gallery</button>
          <h1 className="mt-1 font-display text-3xl font-bold">{it.id ? "Edit item" : "New item"}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="btn-ghost-metal"><X className="h-4 w-4" /> Cancel</button>
          <button onClick={() => onSave(it)} disabled={saving || !it.title || !it.image_url} className="btn-emerald disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
          </button>
        </div>
      </div>
      {error && <Toast tone="error">{error.message}</Toast>}
      <Card title="Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Text label="Title" value={it.title ?? ""} onChange={(v) => update("title", v)} />
          <Text label="Category (e.g. Website, Logo, Branding, UI/UX)" value={it.category ?? ""} onChange={(v) => update("category", v)} />
          <Text label="Sort order" value={String(it.sort_order ?? 0)} onChange={(v) => update("sort_order", Number(v) || 0)} />
        </div>
        <TextArea label="Description (optional)" value={it.description ?? ""} onChange={(v) => update("description", v)} rows={3} />
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!it.is_hidden} onChange={(e) => update("is_hidden", e.target.checked)} /> Hide from public
        </label>
      </Card>
      <Card title="Image">
        <ImageField label="Image" value={it.image_url ?? null} onFile={async (f) => update("image_url", await uploadMedia(f, "gallery"))} onClear={() => update("image_url", "")} />
      </Card>
    </div>
  );
}
