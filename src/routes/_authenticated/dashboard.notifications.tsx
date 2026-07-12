import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Briefcase, Check, Download, Loader2, Mail, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/notifications")({
  component: NotificationsPage,
});

const ICONS: Record<string, typeof Bell> = {
  message: Mail,
  lead: Briefcase,
  cv_download: Download,
  whatsapp_click: Bell,
  email_click: Mail,
  project_view: Bell,
};

const LINKS: Record<string, string> = {
  message: "/dashboard/messages",
  lead: "/dashboard/leads",
};

function NotificationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-notifications-full"],
    queryFn: async () => {
      const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data as {
        id: string; kind: string; title: string; body: string | null;
        actor_name: string | null; actor_email: string | null; read: boolean; created_at: string;
      }[];
    },
  });

  const markRead = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("notifications").update({ read: true }).in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-notifications-full"] });
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-notifications-full"] });
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
  });

  const unreadIds = (data ?? []).filter((n) => !n.read).map((n) => n.id);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Every event that happens on your site.</p>
        </div>
        {unreadIds.length > 0 && (
          <button onClick={() => markRead.mutate(unreadIds)} className="btn-ghost-metal">
            <Check className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid place-items-center h-40"><Loader2 className="h-6 w-6 animate-spin text-emerald-300" /></div>
      ) : (data?.length ?? 0) === 0 ? (
        <div className="glass rounded-2xl p-10 text-center border border-emerald-400/10">
          <Bell className="mx-auto h-8 w-8 text-emerald-300 mb-3" />
          <p className="text-sm text-muted-foreground">No notifications yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {data!.map((n) => {
            const Icon = ICONS[n.kind] ?? Bell;
            const to = LINKS[n.kind];
            return (
              <li key={n.id} className={`glass rounded-2xl border transition ${n.read ? "border-border/40" : "border-emerald-400/30 bg-emerald-400/5"}`}>
                <div className="flex items-start gap-4 p-4">
                  <div className={`h-11 w-11 rounded-2xl grid place-items-center border ${n.read ? "border-border/60 bg-card/40" : "border-emerald-400/40 bg-emerald-400/10"}`}>
                    <Icon className={`h-5 w-5 ${n.read ? "text-muted-foreground" : "text-emerald-300"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold">{n.title}</div>
                    {n.body && <div className="text-sm text-muted-foreground truncate">{n.body}</div>}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mt-1">
                      <span>{new Date(n.created_at).toLocaleString()}</span>
                      {n.actor_email && <span>· {n.actor_email}</span>}
                      <span className="uppercase tracking-widest text-emerald-gradient">{n.kind.replace(/_/g, " ")}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {to && <Link to={to} className="btn-ghost-metal text-xs">Open</Link>}
                    {!n.read && (
                      <button onClick={() => markRead.mutate([n.id])} className="btn-ghost-metal text-xs">
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => remove.mutate(n.id)} className="btn-ghost-metal text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
