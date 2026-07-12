import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, FileText, Inbox, User } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [projects, posts, messages, newMessages] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      return {
        projects: projects.count ?? 0,
        posts: posts.count ?? 0,
        messages: messages.count ?? 0,
        newMessages: newMessages.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Projects", value: stats?.projects ?? 0, icon: Briefcase, to: "/dashboard/projects" },
    { label: "Blog posts", value: stats?.posts ?? 0, icon: FileText, to: "/dashboard/blog" },
    { label: "Messages", value: stats?.messages ?? 0, icon: Inbox, to: "/dashboard/messages", accent: (stats?.newMessages ?? 0) > 0 ? `${stats?.newMessages} new` : undefined },
    { label: "Profile", value: "Edit", icon: User, to: "/dashboard/profile" },
  ] as const;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your portfolio content from a single place.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} to={c.to} className="glass rounded-2xl p-5 border border-emerald-400/10 hover:border-emerald-400/40 transition group">
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
          );
        })}
      </div>
    </div>
  );
}
