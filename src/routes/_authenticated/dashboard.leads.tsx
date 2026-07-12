import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Archive, Briefcase, Loader2, Mail, Phone, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/leads")({
  component: LeadsPage,
});

type Lead = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  project_type: string | null;
  budget: string | null;
  preferred_contact: string | null;
  description: string;
  status: string;
  created_at: string;
};

const STATUSES = ["all", "new", "read", "archived"] as const;

function LeadsPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Lead | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (!term) return true;
      return [l.full_name, l.email, l.company, l.country, l.project_type, l.description].some((v) =>
        (v ?? "").toLowerCase().includes(term),
      );
    });
  }, [data, q, status]);

  const setStatusMut = useMutation({
    mutationFn: async ({ id, next }: { id: string; next: string }) => {
      const { error } = await supabase.from("leads").update({ status: next }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-leads"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-leads"] }); setSelected(null); },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Hire Me Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">Project inquiries submitted through the Hire Me form.</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, project…"
            className="w-full rounded-full border border-border/60 bg-card/40 backdrop-blur pl-10 pr-4 py-2 text-sm outline-none focus:border-emerald-400/60"
          />
        </div>
        <div className="flex rounded-full border border-border/60 bg-card/40 p-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1 rounded-full text-xs uppercase tracking-widest transition ${
                status === s ? "bg-emerald-400/20 text-emerald-300" : "text-muted-foreground hover:text-foreground"
              }`}
            >{s}</button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid place-items-center h-40"><Loader2 className="h-6 w-6 animate-spin text-emerald-300" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center border border-emerald-400/10">
          <Briefcase className="mx-auto h-8 w-8 text-emerald-300 mb-3" />
          <p className="text-sm text-muted-foreground">No leads match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
          <div className="space-y-2 lg:max-h-[70vh] lg:overflow-y-auto pr-2">
            {filtered.map((l) => (
              <button
                key={l.id}
                onClick={() => { setSelected(l); if (l.status === "new") setStatusMut.mutate({ id: l.id, next: "read" }); }}
                className={`w-full text-left rounded-2xl p-4 border transition ${
                  selected?.id === l.id ? "border-emerald-400/50 bg-emerald-400/5" : "border-emerald-400/10 glass hover:border-emerald-400/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-display font-semibold text-sm">{l.full_name}</div>
                  {l.status === "new" && <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{l.email}</div>
                <div className="text-xs mt-2 line-clamp-1 text-emerald-gradient">{l.project_type || "Project inquiry"} · {l.budget || "—"}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{new Date(l.created_at).toLocaleString()}</div>
              </button>
            ))}
          </div>

          <div className="glass rounded-2xl p-6 border border-emerald-400/10">
            {selected ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-semibold">{selected.full_name}</h2>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selected.company && <span>{selected.company} · </span>}
                      {selected.country || "—"} · {new Date(selected.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <a href={`mailto:${selected.email}?subject=Re: your ${selected.project_type || "project"} inquiry`} className="btn-emerald">
                      <Mail className="h-4 w-4" /> Email
                    </a>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} className="btn-ghost-metal">
                        <Phone className="h-4 w-4" /> Call
                      </a>
                    )}
                    {selected.status !== "archived" && (
                      <button onClick={() => setStatusMut.mutate({ id: selected.id, next: "archived" })} className="btn-ghost-metal">
                        <Archive className="h-4 w-4" /> Archive
                      </button>
                    )}
                    <button onClick={() => { if (confirm("Delete lead?")) remove.mutate(selected.id); }} className="btn-ghost-metal text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <Meta label="Email" value={selected.email} />
                  <Meta label="Phone" value={selected.phone} />
                  <Meta label="Company" value={selected.company} />
                  <Meta label="Country" value={selected.country} />
                  <Meta label="Project Type" value={selected.project_type} />
                  <Meta label="Budget" value={selected.budget} />
                  <Meta label="Preferred Contact" value={selected.preferred_contact} />
                  <Meta label="Status" value={selected.status} />
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2">Description</div>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">{selected.description}</p>
                </div>
              </div>
            ) : (
              <div className="grid place-items-center h-full text-sm text-muted-foreground">Select a lead to see details.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/30 px-3 py-2">
      <div className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">{label}</div>
      <div className="text-sm mt-0.5 truncate">{value || "—"}</div>
    </div>
  );
}
