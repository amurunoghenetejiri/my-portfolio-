import { motion } from "framer-motion";
import { ArrowUpRight, Github, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard, Section } from "./Section";
import { SafeImage } from "./SafeImage";

type DbProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  technologies: string[] | null;
  features: string[] | null;
  github_url: string | null;
  live_url: string | null;
  category: string | null;
  is_hidden: boolean | null;
  is_featured: boolean | null;
  sort_order: number | null;
};

const FALLBACK: DbProject[] = [
  {
    id: "f1", title: "DATA4ME", slug: "data4me",
    description: "A modern data services platform enabling everyday users to purchase data, airtime, and digital services with a premium experience.",
    thumbnail_url: null,
    technologies: ["React", "TypeScript", "Supabase", "Paystack"],
    features: ["Wallet system", "Instant delivery", "Transaction history", "Admin controls"],
    github_url: null, live_url: null, category: "Fintech",
    is_hidden: false, is_featured: true, sort_order: 0,
  },
  {
    id: "f2", title: "D4 TECH Official Website", slug: "d4-tech-website",
    description: "The corporate website for D4 TECH — premium, futuristic, glassmorphism-driven brand experience.",
    thumbnail_url: null,
    technologies: ["React", "TanStack", "Framer Motion", "Tailwind"],
    features: ["Loading animation", "Cursor glow", "Scroll animations", "Fully responsive"],
    github_url: null, live_url: null, category: "Web",
    is_hidden: false, is_featured: false, sort_order: 1,
  },
];

export function Projects() {
  const { data, isLoading } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id,title,slug,description,thumbnail_url,technologies,features,github_url,live_url,category,is_hidden,is_featured,sort_order")
        .eq("is_hidden", false)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbProject[];
    },
    staleTime: 60_000,
  });

  const projects = (data && data.length > 0) ? data : FALLBACK;

  return (
    <Section
      id="projects"
      eyebrow="Featured Projects"
      title={<>Work I'm <span className="text-emerald-gradient">proud of</span>.</>}
      subtitle="A selection of platforms, products, and brand systems shipped through D4 TECH."
    >
      {isLoading ? (
        <div className="grid place-items-center h-40"><Loader2 className="h-6 w-6 animate-spin text-emerald-300" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
            >
              <GlassCard className="h-full group overflow-hidden flex flex-col">
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/25 to-emerald-800/10 border border-emerald-400/20 mb-5 block"
                >
                  {p.thumbnail_url ? (
                    <SafeImage src={p.thumbnail_url} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <>
                      <div className="absolute inset-0 grid-noise opacity-40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="font-display text-3xl sm:text-4xl font-bold text-metallic tracking-tight text-center px-6">{p.title}</div>
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="grid h-9 w-9 place-items-center rounded-full glass hover:border-emerald-400/60">
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="grid h-9 w-9 place-items-center rounded-full glass hover:border-emerald-400/60">
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </Link>

                <div className="flex-1 flex flex-col">
                  <div className="font-display text-xl font-semibold">{p.title}</div>
                  {p.category && <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-gradient mt-0.5">{p.category}</div>}
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.description}</p>

                  {p.technologies && p.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.technologies.map((t) => (
                        <span key={t} className="text-[10px] uppercase tracking-widest rounded-full border border-emerald-400/30 bg-emerald-400/5 px-2 py-1 text-emerald-300">{t}</span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex gap-2 flex-wrap">
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noreferrer" className="btn-emerald text-xs py-2 px-4">
                        Visit Website <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <Link to="/projects/$slug" params={{ slug: p.slug }} className="btn-ghost-metal text-xs py-2 px-4">
                      View Details
                    </Link>
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noreferrer" className="btn-ghost-metal text-xs py-2 px-4">
                        <Github className="h-3.5 w-3.5" /> Code
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  );
}
