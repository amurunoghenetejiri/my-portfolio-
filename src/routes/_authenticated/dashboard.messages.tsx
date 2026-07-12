import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, Loader2, Mail, Reply, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/messages")({
  component: MessagesPage,
});

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

function MessagesPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Message | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Message[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("messages").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-messages"] }); setSelected(null); },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Inbox from your public contact form.</p>
      </div>

      {isLoading ? (
        <div className="grid place-items-center h-40"><Loader2 className="h-6 w-6 animate-spin text-emerald-300" /></div>
      ) : (data?.length ?? 0) === 0 ? (
        <div className="glass rounded-2xl p-10 text-center border border-emerald-400/10">
          <Mail className="mx-auto h-8 w-8 text-emerald-300 mb-3" />
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
          <div className="space-y-2 lg:max-h-[70vh] lg:overflow-y-auto pr-2">
            {data?.map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelected(m); if (m.status === "new") setStatus.mutate({ id: m.id, status: "read" }); }}
                className={`w-full text-left rounded-2xl p-4 border transition ${
                  selected?.id === m.id ? "border-emerald-400/50 bg-emerald-400/5" : "border-emerald-400/10 glass hover:border-emerald-400/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-display font-semibold text-sm">{m.name}</div>
                  {m.status === "new" && <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{m.email}</div>
                <div className="text-xs mt-2 line-clamp-1">{m.subject || m.message}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{new Date(m.created_at).toLocaleString()}</div>
              </button>
            ))}
          </div>

          <div className="glass rounded-2xl p-6 border border-emerald-400/10">
            {selected ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-semibold">{selected.subject || "(no subject)"}</h2>
                    <div className="text-xs text-muted-foreground mt-1">From <span className="text-emerald-gradient">{selected.name}</span> · {selected.email}</div>
                    <div className="text-xs text-muted-foreground">{new Date(selected.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "your message")}`} className="btn-emerald">
                      <Reply className="h-4 w-4" /> Reply
                    </a>
                    {selected.status !== "archived" && (
                      <button onClick={() => setStatus.mutate({ id: selected.id, status: "archived" })} className="btn-ghost-metal">
                        <Check className="h-4 w-4" /> Archive
                      </button>
                    )}
                    <button onClick={() => { if (confirm("Delete message?")) remove.mutate(selected.id); }} className="btn-ghost-metal text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed pt-4 border-t border-border/40">{selected.message}</div>
              </div>
            ) : (
              <div className="grid place-items-center h-full text-sm text-muted-foreground">Select a message to read.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
