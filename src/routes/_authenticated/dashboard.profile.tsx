import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, refreshSignedUrl } from "@/lib/admin-helpers";
import { Loader2, Save, Upload, Plus, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  component: ProfilePage,
});

type Social = { name: string; href: string; icon: string };

function ProfilePage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["site-profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_profile").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState<Record<string, unknown> | null>(null);
  useEffect(() => { if (data) setForm(data); }, [data]);

  const save = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      if (!data?.id) throw new Error("Profile row missing");
      const { error } = await supabase.from("site_profile").update(payload as never).eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-profile"] });
      qc.invalidateQueries({ queryKey: ["public-profile"] });
    },
  });

  if (isLoading || !form) return <div className="grid place-items-center h-64"><Loader2 className="h-6 w-6 animate-spin text-emerald-300" /></div>;

  const update = (k: string, v: unknown) => setForm((f) => ({ ...(f ?? {}), [k]: v }));
  const socials = (form.socials as Social[] | undefined) ?? [];

  const handleUpload = async (field: string, file: File) => {
    const url = await uploadMedia(file, field);
    update(field, url);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Editable content that powers the hero, about, and footer sections.</p>
        </div>
        <button onClick={() => save.mutate(form)} disabled={save.isPending} className="btn-emerald">
          {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
        </button>
      </div>

      {save.isSuccess && <Toast>Saved</Toast>}
      {save.error && <Toast tone="error">{(save.error as Error).message}</Toast>}

      <Card title="Basics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Text label="Full name" value={form.full_name as string} onChange={(v) => update("full_name", v)} />
          <Text label="Position" value={form.position as string} onChange={(v) => update("position", v)} />
          <Text label="School" value={form.school as string} onChange={(v) => update("school", v)} />
          <Text label="Course" value={form.course as string} onChange={(v) => update("course", v)} />
          <Text label="Company name" value={form.company_name as string} onChange={(v) => update("company_name", v)} />
          <Text label="Motto" value={form.motto as string} onChange={(v) => update("motto", v)} />
        </div>
        <TextArea label="Intro (short tagline for hero)" value={form.intro as string} onChange={(v) => update("intro", v)} rows={3} />
        <TextArea label="Biography (about section)" value={form.biography as string} onChange={(v) => update("biography", v)} rows={5} />
        <TextArea label="Education" value={form.education as string} onChange={(v) => update("education", v)} rows={3} />
      </Card>

      <Card title="Images">
        <ImageField label="Avatar / portrait" value={form.avatar_url as string | null} onFile={(f) => handleUpload("avatar_url", f)} onClear={() => update("avatar_url", null)} />
        <ImageField label="Cover image" value={form.cover_url as string | null} onFile={(f) => handleUpload("cover_url", f)} onClear={() => update("cover_url", null)} />
        <ImageField label="Company logo" value={form.company_logo_url as string | null} onFile={(f) => handleUpload("company_logo_url", f)} onClear={() => update("company_logo_url", null)} />
      </Card>

      <Card title="Social links">
        <div className="space-y-2">
          {socials.map((s, i) => (
            <div key={i} className="flex flex-wrap gap-2 items-end">
              <Text label="Name" value={s.name} onChange={(v) => update("socials", socials.map((x, j) => j === i ? { ...x, name: v } : x))} />
              <Text label="Icon key (github/linkedin/whatsapp/mail/instagram/facebook/x)" value={s.icon} onChange={(v) => update("socials", socials.map((x, j) => j === i ? { ...x, icon: v } : x))} />
              <Text label="URL" value={s.href} onChange={(v) => update("socials", socials.map((x, j) => j === i ? { ...x, href: v } : x))} />
              <button onClick={() => update("socials", socials.filter((_, j) => j !== i))} className="grid h-10 w-10 place-items-center rounded-full border border-red-500/30 text-red-300 hover:bg-red-500/10">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button onClick={() => update("socials", [...socials, { name: "", href: "", icon: "" }])} className="btn-ghost-metal">
            <Plus className="h-4 w-4" /> Add social link
          </button>
        </div>
      </Card>
    </div>
  );
}

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-3xl p-6 border border-emerald-400/10 space-y-4">
      <h2 className="font-display text-lg font-semibold text-metallic">{title}</h2>
      {children}
    </section>
  );
}

export function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="min-w-[180px] flex-1">
      <label className="block text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-1.5">{label}</label>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-border/60 bg-card/40 px-3 py-2 text-sm outline-none focus:border-emerald-400/60" />
    </div>
  );
}

export function TextArea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-1.5">{label}</label>
      <textarea rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-border/60 bg-card/40 px-3 py-2 text-sm outline-none focus:border-emerald-400/60" />
    </div>
  );
}

export function ImageField({ label, value, onFile, onClear }: { label: string; value: string | null; onFile: (f: File) => Promise<void> | void; onClear: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-2xl border border-border/60 bg-card/40 overflow-hidden grid place-items-center">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-muted-foreground">Empty</span>}
        </div>
        <label className="btn-ghost-metal cursor-pointer">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              try { await onFile(f); } finally { setBusy(false); e.currentTarget.value = ""; }
            }}
          />
        </label>
        {value && <button onClick={onClear} className="text-xs text-red-300 hover:underline">Remove</button>}
      </div>
    </div>
  );
}

export function Toast({ children, tone = "success" }: { children: React.ReactNode; tone?: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur ${
      tone === "success" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-red-500/30 bg-red-500/10 text-red-300"
    }`}>
      {children}
    </div>
  );
}
