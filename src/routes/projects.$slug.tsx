import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, Github, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SafeImage } from "@/components/portfolio/SafeImage";
import { Navbar } from "@/components/portfolio/Navbar";
import { Footer } from "@/components/portfolio/Footer";
import { HireMeDialog } from "@/components/portfolio/HireMeDialog";
import { CursorGlow, ScrollProgress, ScrollToTop } from "@/components/portfolio/Effects";

export const Route = createFileRoute("/projects/$slug")({
  ssr: false,
  component: ProjectDetail,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — D4 TECH` },
      { name: "description", content: "Project details and case study by D4 TECH." },
    ],
  }),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-dvh grid place-items-center p-8 text-center">
      <div>
        <div className="text-sm text-red-300 mb-3">{error.message}</div>
        <button onClick={reset} className="btn-emerald">Retry</button>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-dvh grid place-items-center p-8 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Project not found</h1>
        <Link to="/" className="btn-emerald mt-4 inline-flex">Back home</Link>
      </div>
    </div>
  ),
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("is_hidden", false)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading) {
    return <div className="min-h-dvh grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-300" /></div>;
  }
  if (error || !data) return null;

  const p = data;
  const images: string[] = Array.isArray(p.images) ? (p.images as unknown[]).filter((v): v is string => typeof v === "string") : [];

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) window.history.back();
              else window.location.href = "/#projects";
            }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-emerald-gradient mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to portfolio
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            {p.category && <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient">{p.category}</div>}
            {p.status && <StatusBadge status={p.status} />}
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.05]">{p.title}</h1>
          {p.description && <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">{p.description}</p>}

          {p.collaborated_with && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-4 py-2 text-xs">
              <span className="text-muted-foreground uppercase tracking-[0.2em]">Collaborated with</span>
              <span className="text-emerald-gradient font-semibold">{p.collaborated_with}</span>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {p.live_url && (
              <a href={p.live_url} target="_blank" rel="noreferrer" className="btn-emerald">
                Visit Website <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            {p.github_url && (
              <a href={p.github_url} target="_blank" rel="noreferrer" className="btn-ghost-metal">
                <Github className="h-4 w-4" /> View Code
              </a>
            )}
            <button type="button" data-hire-me className="btn-ghost-metal">Hire Me for Similar</button>
          </div>


          {p.thumbnail_url && (
            <div className="mt-12 rounded-3xl overflow-hidden border border-emerald-400/20 aspect-[16/9] bg-card/40">
              <SafeImage src={p.thumbnail_url} alt={p.title} className="h-full w-full object-cover" loading="eager" />
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {p.technologies && p.technologies.length > 0 && (
              <div className="glass rounded-2xl p-6 border border-emerald-400/10 md:col-span-2">
                <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient mb-3">Tech stack</div>
                <div className="flex flex-wrap gap-2">
                  {p.technologies.map((t: string) => (
                    <span key={t} className="text-xs rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1.5 text-emerald-200">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {p.features && p.features.length > 0 && (
              <div className="glass rounded-2xl p-6 border border-emerald-400/10">
                <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient mb-3">Key features</div>
                <ul className="space-y-2 text-sm">
                  {p.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {images.length > 0 && (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((src, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-emerald-400/10 aspect-video">
                  <SafeImage src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
      <HireMeDialog />
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const tone =
    s.includes("progress") ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
    : s.includes("ongoing") ? "border-sky-400/40 bg-sky-400/10 text-sky-200"
    : s.includes("plan") ? "border-slate-400/40 bg-slate-400/10 text-slate-200"
    : "border-emerald-400/40 bg-emerald-400/10 text-emerald-200";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {status}
    </span>
  );
}

