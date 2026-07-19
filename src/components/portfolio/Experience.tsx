import { motion } from "framer-motion";
import { Briefcase, Code2, Palette, PenTool } from "lucide-react";
import { GlassCard, Section } from "./Section";

const roles = [
  { icon: Briefcase, title: "Founder & CEO", org: "D4 TECH", period: "2026 — Present", desc: "Leading strategy, engineering, and design across all D4 TECH products and client engagements." },
  { icon: Code2, title: "Software Developer", org: "Independent / D4 TECH", period: "2024 — Present", desc: "Building modern web applications with React, TypeScript, and Supabase for startups and businesses." },
  { icon: PenTool, title: "UI/UX Designer", org: "Independent / D4 TECH", period: "2023 — Present", desc: "Designing intuitive product interfaces and end-to-end user experiences for web and mobile." },
  { icon: Palette, title: "Graphic Designer", org: "Independent", period: "2021 — Present", desc: "Crafting logos, brand identities, flyers, posters, and marketing collateral for global clients." },
];

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title={<>A track record of <span className="text-emerald-gradient">shipping</span>.</>}
      subtitle="Multi-disciplinary roles across engineering, design, and leadership."
    >
      <div className="relative">
        <div className="absolute left-4 sm:left-6 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-emerald-400/50 to-transparent" />
        <div className="space-y-6">
          {roles.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="relative pl-12 sm:pl-16"
            >
              <div className="absolute left-2.5 sm:left-4.5 top-6 grid h-4 w-4 place-items-center rounded-full bg-emerald-400 shadow-[0_0_20px_4px_rgba(52,211,153,.6)]">
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
              </div>
              <GlassCard>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 border border-emerald-400/30">
                      <r.icon className="h-5 w-5 text-emerald-300" />
                    </div>
                    <div>
                      <div className="font-display font-semibold">{r.title}</div>
                      <div className="text-xs text-muted-foreground">{r.org}</div>
                    </div>
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald-gradient">{r.period}</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
