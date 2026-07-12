import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bell, Briefcase, FileText, Handshake, Inbox, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [projects, posts, messages, newMessages, leads, newLeads, unread] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("notifications").select("id", { count: "exact", head: true }).eq("read", false),
      ]);
      return {
        projects: projects.count ?? 0,
        posts: posts.count ?? 0,
        messages: messages.count ?? 0,
        newMessages: newMessages.count ?? 0,
        leads: leads.count ?? 0,
        newLeads: newLeads.count ?? 0,
        unread: unread.count ?? 0,
      };
    },
  });

  const { data: recent } = useQuery({
    queryKey: ["admin-recent-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, kind, title, body, created_at, read")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

  const cards = [
    { label: "Projects", value: stats?.projects ?? 0, icon: Briefcase, to: "/dashboard/projects" },
    { label: "Blog posts", value: stats?.posts ?? 0, icon: FileText, to: "/dashboard/blog" },
    { label: "Messages", value: stats?.messages ?? 0, icon: Inbox, to: "/dashboard/messages", accent: (stats?.newMessages ?? 0) > 0 ? `${stats?.newMessages} new` : undefined },
    { label: "Hire Me leads", value: stats?.leads ?? 0, icon: Handshake, to: "/dashboard/leads", accent: (stats?.newLeads ?? 0) > 0 ? `${stats?.newLeads} new` : undefined },
    { label: "Notifications", value: stats?.unread ?? 0, icon: Bell, to: "/dashboard/notifications", accent: "unread" },
    { label: "Profile", value: "Edit", icon: User, to: "/dashboard/profile" },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your D4 TECH control center.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link to={c.to} className="block glass rounded-2xl p-5 border border-emerald-400/10 hover:border-emerald-400/40 hover:-translate-y-0.5 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{c.label}</span>
                  <Icon className="h-4 w-4 text-emerald-300" />
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-metallic">{c.value}</span>
                  {"accent" in c && c.accent && <span className="text-xs text-emerald-300">{c.accent}</span>}
                </div>
                <div className="mt-3 text-xs text-muted-foreground group-hover:text-emerald-gradient transition">Open →</div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold mb-3">Recent activity</h2>
        {(recent?.length ?? 0) === 0 ? (
          <div className="glass rounded-2xl p-8 text-center border border-emerald-400/10 text-sm text-muted-foreground">
            Nothing yet — activity from your site will appear here.
          </div>
        ) : (
          <ul className="space-y-2">
            {recent!.map((r) => (
              <li key={r.id} className={`glass rounded-2xl border px-4 py-3 flex items-start gap-3 ${r.read ? "border-border/40" : "border-emerald-400/25 bg-emerald-400/5"}`}>
                <span className={`mt-1.5 h-2 w-2 rounded-full ${r.read ? "bg-muted-foreground/40" : "bg-emerald-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{r.title}</div>
                  {r.body && <div className="text-xs text-muted-foreground truncate">{r.body}</div>}
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{new Date(r.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
