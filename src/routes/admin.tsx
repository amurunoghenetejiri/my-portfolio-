import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LOGO_URL, BRAND } from "@/components/portfolio/assets";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — D4 TECH" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminAuthPage,
});

function AdminAuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        setInfo("Account created. Signing in…");
      }
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr) throw signInErr;
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh grid place-items-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-noise opacity-40" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-emerald-500/15 blur-[120px] -z-10" />

      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center gap-2.5 justify-center">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-black ring-1 ring-emerald-400/40 overflow-hidden">
            <img src={LOGO_URL} alt="" className="h-10 w-10 object-cover" />
          </span>
          <span className="font-display font-bold tracking-widest text-metallic">{BRAND.name}</span>
        </Link>

        <div className="glass rounded-3xl p-8 border border-emerald-400/10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-emerald-gradient">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin Access
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold">
            {mode === "signin" ? "Sign in" : "First-time setup"}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {mode === "signin"
              ? "Enter your credentials to manage your portfolio."
              : "Create the admin account. Only the first signup receives admin access."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Input icon={<Mail className="h-4 w-4" />} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Input icon={<Lock className="h-4 w-4" />} label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

            {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</div>}
            {info && <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">{info}</div>}

            <button type="submit" disabled={loading} className="btn-emerald w-full justify-center disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? "Sign in" : "Create admin"}
            </button>
          </form>

          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }}
            className="mt-4 w-full text-xs text-muted-foreground hover:text-emerald-gradient transition"
          >
            {mode === "signin" ? "First time here? Create the admin account →" : "← Back to sign in"}
          </button>
        </div>

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-emerald-gradient transition">
          ← Back to public site
        </Link>
      </div>
    </div>
  );
}

function Input({ label, icon, type, value, onChange, placeholder }: {
  label: string; icon: React.ReactNode; type: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.24em] text-muted-foreground mb-2">{label}</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-3 grid place-items-center text-muted-foreground">{icon}</span>
        <input
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-border/60 bg-card/40 backdrop-blur pl-10 pr-4 py-3 text-sm outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
        />
      </div>
    </div>
  );
}
