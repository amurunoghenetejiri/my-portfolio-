import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Briefcase, Check, Download, Inbox, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Notif = {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  actor_name: string | null;
  actor_email: string | null;
  read: boolean;
  created_at: string;
  ref_id: string | null;
};

const KIND_ICON: Record<string, typeof Bell> = {
  message: Mail,
  lead: Briefcase,
  cv_download: Download,
  whatsapp_click: Inbox,
  email_click: Mail,
  project_view: Inbox,
};

const KIND_LINK: Record<string, string> = {
  message: "/dashboard/messages",
  lead: "/dashboard/leads",
};

export function NotificationBell() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const { data } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as Notif[];
    },
    refetchOnWindowFocus: true,
  });

  const unread = data?.filter((n) => !n.read).length ?? 0;

  const markRead = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("notifications").update({ read: true }).in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-notifications"] }),
  });

  useEffect(() => {
    const channel = supabase
      .channel("admin-notifications-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-notifications"] });
        qc.invalidateQueries({ queryKey: ["admin-stats"] });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () =>
        qc.invalidateQueries({ queryKey: ["admin-messages"] }),
      )
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "leads" }, () =>
        qc.invalidateQueries({ queryKey: ["admin-leads"] }),
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card/40 hover:border-emerald-400/50 transition"
      >
        <Bell className="h-4 w-4 text-muted-foreground" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-emerald-500 text-black text-[10px] font-bold ring-2 ring-background">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] max-h-[70vh] overflow-y-auto rounded-2xl border border-emerald-400/20 bg-card/95 backdrop-blur-xl shadow-[0_20px_50px_-10px_rgba(0,0,0,.6)] z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
            <div className="font-display text-sm font-semibold">Notifications</div>
            {unread > 0 && (
              <button
                onClick={() => markRead.mutate((data ?? []).filter((n) => !n.read).map((n) => n.id))}
                className="text-[11px] uppercase tracking-widest text-emerald-gradient hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          {(data?.length ?? 0) === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">All quiet.</div>
          ) : (
            <ul className="divide-y divide-border/40">
              {data?.map((n) => {
                const Icon = KIND_ICON[n.kind] ?? Bell;
                const to = KIND_LINK[n.kind];
                const inner = (
                  <div className="flex items-start gap-3 px-4 py-3 hover:bg-emerald-400/5 transition">
                    <div className={`h-9 w-9 rounded-xl grid place-items-center border ${n.read ? "border-border/60 bg-card/40" : "border-emerald-400/40 bg-emerald-400/10"}`}>
                      <Icon className={`h-4 w-4 ${n.read ? "text-muted-foreground" : "text-emerald-300"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm ${n.read ? "text-muted-foreground" : "text-foreground"} truncate`}>{n.title}</div>
                      {n.body && <div className="text-xs text-muted-foreground truncate">{n.body}</div>}
                      <div className="text-[10px] text-muted-foreground/70 mt-0.5">{new Date(n.created_at).toLocaleString()}</div>
                    </div>
                    {!n.read && (
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); markRead.mutate([n.id]); }}
                        title="Mark as read"
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition text-muted-foreground hover:text-emerald-300"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
                return (
                  <li key={n.id} className="group">
                    {to ? (
                      <Link to={to} onClick={() => { setOpen(false); if (!n.read) markRead.mutate([n.id]); }}>
                        {inner}
                      </Link>
                    ) : (
                      <div onClick={() => { if (!n.read) markRead.mutate([n.id]); }}>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <div className="border-t border-border/40 px-4 py-2 text-center">
            <Link to="/dashboard/notifications" onClick={() => setOpen(false)} className="text-xs text-emerald-gradient hover:underline">
              View all →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
