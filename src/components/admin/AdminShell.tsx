import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Bell, Briefcase, FileText, Handshake, Home, Image as ImageIcon, Inbox, LogOut, ScrollText, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BRAND } from "@/components/portfolio/assets";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import { NotificationBell } from "./NotificationBell";

type NavItem = { to: string; label: string; icon: typeof Home; exact?: boolean };
const nav: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: Home, exact: true },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/projects", label: "Projects", icon: Briefcase },
  { to: "/dashboard/blog", label: "Blog", icon: FileText },
  { to: "/dashboard/messages", label: "Messages", icon: Inbox },
  { to: "/dashboard/leads", label: "Hire Me", icon: Handshake },
  { to: "/dashboard/media", label: "Media Library", icon: ImageIcon },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/cv", label: "CV", icon: ScrollText },
];

export function AdminShell() {
  const { logoUrl } = useSiteAssets();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin", replace: true });
  };
  return (
    <div className="min-h-dvh bg-background text-foreground grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="hidden md:flex flex-col border-r border-border/40 bg-card/30 backdrop-blur">
        <Link to="/" className="flex items-center gap-2.5 px-5 py-5 border-b border-border/40">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-black ring-1 ring-emerald-400/40 overflow-hidden">
            <img src={logoUrl} alt="" className="h-9 w-9 object-cover" />
          </span>
          <div>
            <div className="font-display font-bold tracking-widest text-sm text-metallic">{BRAND.name}</div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-emerald-gradient">Admin</div>
          </div>
        </Link>
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/30"
                    : "text-muted-foreground hover:bg-card/50 hover:text-foreground border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={signOut}
          className="m-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-red-300 hover:bg-red-500/10 transition"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>

      <div className="flex flex-col min-h-dvh">
        <header className="flex items-center justify-between border-b border-border/40 px-4 py-3 bg-card/30 backdrop-blur">
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <img src={logoUrl} alt="" className="h-7 w-7 rounded-full" />
            <span className="font-display font-bold text-sm">{BRAND.name} Admin</span>
          </Link>
          <div className="hidden md:block text-xs uppercase tracking-[0.28em] text-muted-foreground">Control Center</div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button onClick={signOut} className="md:hidden text-muted-foreground"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>
        <nav className="md:hidden flex overflow-x-auto gap-1 px-3 py-2 border-b border-border/40 bg-card/20">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} className={`shrink-0 px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${active ? "bg-emerald-400/20 text-emerald-300" : "text-muted-foreground"}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
