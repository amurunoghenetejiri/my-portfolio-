import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, slugify } from "@/lib/admin-helpers";
import { Card, Text, TextArea, ImageField, Toast } from "./dashboard.profile";
import { Eye, EyeOff, Loader2, Pencil, Plus, Save, Star, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/projects")({
  component: ProjectsPage,
});

type Project = {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  images: string[] | null;
  description: string;
  technologies: string[];
  features: string[];
  github_url: string | null;
  live_url: string | null;
  category: string | null;
  collaborated_with: string | null;
  status: string | null;
  sort_order: number;
  is_featured: boolean;
  is_hidden: boolean;
};

function ProjectsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Project> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<Project>) => {
      const slug = p.slug || slugify(p.title ?? "");
      const payload = { ...p, slug };
      if (p.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { title, ...rest } = payload;
        const { error } = await supabase.from("projects").insert({ ...rest, title: title! });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); setEditing(null); },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Project> }) => {
      const { error } = await supabase.from("projects").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });

  if (editing) return <ProjectEditor initial={editing} onCancel={() => setEditing(null)} onSave={(p) => save.mutate(p)} saving={save.isPending} error={save.error as Error | null} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">{data?.length ?? 0} project{(data?.length ?? 0) === 1 ? "" : "s"}</p>
        </div>
        <button onClick={() => setEditing({ title: "", description: "", technologies: [], features: [], images: [], sort_order: 0, status: "completed", is_featured: false, is_hidden: false })} className="btn-emerald">
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      {isLoading ? (
        <div className="grid place-items-center h-40"><Loader2 className="h-6 w-6 animate-spin text-emerald-300" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((p) => (
            <div key={p.id} className="glass rounded-2xl overflow-hidden border border-emerald-400/10">
              <div className="aspect-video bg-card/40 grid place-items-center overflow-hidden">
                {p.thumbnail_url ? <img src={p.thumbnail_url} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-muted-foreground">No image</span>}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-sm">{p.title}</h3>
                  <div className="flex gap-1">
                    {p.is_featured && <Star className="h-3.5 w-3.5 text-amber-300" />}
                    {p.is_hidden && <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                  </div>
                </div>
                {p.category && <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-gradient">{p.category}</div>}
                <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1 pt-2 border-t border-border/40">
                  <button onClick={() => setEditing(p)} className="text-xs text-emerald-300 hover:underline inline-flex items-center gap-1"><Pencil className="h-3 w-3" /> Edit</button>
                  <button onClick={() => toggle.mutate({ id: p.id, patch: { is_featured: !p.is_featured } })} className="text-xs text-muted-foreground hover:text-amber-300 inline-flex items-center gap-1 ml-auto"><Star className="h-3 w-3" /> {p.is_featured ? "Unfeature" : "Feature"}</button>
                  <button onClick={() => toggle.mutate({ id: p.id, patch: { is_hidden: !p.is_hidden } })} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">{p.is_hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}{p.is_hidden ? "Show" : "Hide"}</button>
                  <button onClick={() => { if (confirm(`Delete "${p.title}"?`)) remove.mutate(p.id); }} className="text-xs text-red-300 hover:underline inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectEditor({ initial, onCancel, onSave, saving, error }: {
  initial: Partial<Project>;
  onCancel: () => void;
  onSave: (p: Partial<Project>) => void;
  saving: boolean;
  error: Error | null;
}) {
  const [p, setP] = useState<Partial<Project>>(initial);
  const update = <K extends keyof Project>(k: K, v: Project[K]) => setP((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between gap-3">
        <div>
          <button onClick={onCancel} className="text-xs text-muted-foreground hover:text-foreground">← Back to projects</button>
          <h1 className="mt-1 font-display text-3xl font-bold">{p.id ? "Edit project" : "New project"}</h1>
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
          <Text label="Project name *" value={p.title ?? ""} onChange={(v) => update("title", v)} />
          <Text label="Live / Website Link *" value={p.live_url ?? ""} onChange={(v) => update("live_url", v)} />
          <Text label="Category" value={p.category ?? ""} onChange={(v) => update("category", v)} />
          <Text label="GitHub URL" value={p.github_url ?? ""} onChange={(v) => update("github_url", v)} />
          <Text label="Collaborated with" value={p.collaborated_with ?? ""} onChange={(v) => update("collaborated_with", v)} />
          <div>
            <label className="block text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-1.5">Project status</label>
            <select
              value={p.status ?? "completed"}
              onChange={(e) => update("status", e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-card/40 px-3 py-2 text-sm outline-none focus:border-emerald-400/60"
            >
              <option value="completed">Completed</option>
              <option value="in progress">In Progress</option>
              <option value="ongoing">Ongoing</option>
              <option value="planned">Planned</option>
            </select>
          </div>
          <Text label="Slug (optional, auto)" value={p.slug ?? ""} onChange={(v) => update("slug", v)} />
          <Text label="Sort order" value={String(p.sort_order ?? 0)} onChange={(v) => update("sort_order", Number(v) || 0)} />
        </div>

        <TextArea label="Description" value={p.description ?? ""} onChange={(v) => update("description", v)} rows={5} />
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!p.is_featured} onChange={(e) => update("is_featured", e.target.checked)} /> Featured</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!p.is_hidden} onChange={(e) => update("is_hidden", e.target.checked)} /> Hide from public</label>
        </div>
      </Card>

      <Card title="Thumbnail">
        <ImageField label="Thumbnail" value={p.thumbnail_url ?? null} onFile={async (f) => update("thumbnail_url", await uploadMedia(f, "projects"))} onClear={() => update("thumbnail_url", null)} />
      </Card>

      <Card title="Tech stack">
        <TagList value={p.technologies ?? []} onChange={(v) => update("technologies", v)} placeholder="React, TypeScript, Supabase…" />
      </Card>

      <Card title="Key features">
        <TagList value={p.features ?? []} onChange={(v) => update("features", v)} placeholder="Real-time sync, AI search…" />
      </Card>
    </div>
  );
}

function TagList({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState("");
  const add = () => { if (!input.trim()) return; onChange([...value, input.trim()]); setInput(""); };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
            {t}
            <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="hover:text-red-300"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} placeholder={placeholder} className="flex-1 rounded-xl border border-border/60 bg-card/40 px-3 py-2 text-sm outline-none focus:border-emerald-400/60" />
        <button onClick={add} className="btn-ghost-metal"><Plus className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
