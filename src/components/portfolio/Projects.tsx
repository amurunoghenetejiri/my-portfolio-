import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { GlassCard, Section } from "./Section";

const projects = [
  {
    title: "DATA4ME",
    desc: "A modern data services platform enabling everyday users to purchase data, airtime, and digital services with a premium experience.",
    tech: ["React", "TypeScript", "Supabase", "Paystack"],
    features: ["Wallet system", "Instant delivery", "Transaction history", "Admin controls"],
    tint: "from-emerald-500/30 to-emerald-800/10",
  },
  {
    title: "D4 TECH Official Website",
    desc: "The corporate website for D4 TECH — premium, futuristic, glassmorphism-driven brand experience.",
    tech: ["React", "TanStack", "Framer Motion", "Tailwind"],
    features: ["Loading animation", "Cursor glow", "Scroll animations", "Fully responsive"],
    tint: "from-emerald-400/30 to-slate-800/10",
  },
  {
    title: "Graphic Design Portfolio",
    desc: "A curated showcase of logo, brand, poster, and flyer work spanning multiple industries.",
    tech: ["Photoshop", "Illustrator", "Figma"],
    features: ["Brand systems", "Marketing collateral", "Social design", "Print-ready assets"],
    tint: "from-emerald-300/25 to-emerald-900/10",
  },
  {
    title: "Software Projects",
    desc: "Dashboards, AI chat assistants, and internal tools built for real customers and internal teams.",
    tech: ["Node.js", "OpenAI", "Postgres", "Vercel"],
    features: ["AI assistants", "Realtime data", "Auth flows", "Analytics"],
    tint: "from-emerald-500/25 to-emerald-700/10",
  },
];

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Featured Projects"
      title={<>Work I'm <span className="text-emerald-gradient">proud of</span>.</>}
      subtitle="A selection of platforms, products, and brand systems shipped through D4 TECH."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
          >
            <GlassCard className="h-full group overflow-hidden">
              <div className={`relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br ${p.tint} border border-emerald-400/20 mb-5`}>
                <div className="absolute inset-0 grid-noise opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="font-display text-3xl sm:text-4xl font-bold text-metallic tracking-tight text-center px-6">
                    {p.title}
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href="#" className="grid h-9 w-9 place-items-center rounded-full glass hover:border-emerald-400/60">
                    <Github className="h-4 w-4" />
                  </a>
                  <a href="#" className="grid h-9 w-9 place-items-center rounded-full glass hover:border-emerald-400/60">
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="font-display text-xl font-semibold">{p.title}</div>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span key={t} className="text-[10px] uppercase tracking-widest rounded-full border border-emerald-400/30 bg-emerald-400/5 px-2 py-1 text-emerald-300">
                    {t}
                  </span>
                ))}
              </div>

              <ul className="mt-4 grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex gap-2">
                <a href="#" className="btn-emerald text-xs py-2 px-4">
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
                <a href="#" className="btn-ghost-metal text-xs py-2 px-4">
                  Live Demo <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
