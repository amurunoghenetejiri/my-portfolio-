import { motion } from "framer-motion";
import { Lightbulb, Award, ShieldCheck, Zap } from "lucide-react";
import { BRAND, LOGO_URL } from "./assets";
import { GlassCard, Section } from "./Section";

const values = [
  { icon: Lightbulb, title: "Innovation", desc: "We ship what didn't exist yesterday." },
  { icon: Award, title: "Excellence", desc: "Craft over shortcuts. Every pixel, every line." },
  { icon: ShieldCheck, title: "Integrity", desc: "Honest work, honest partnerships." },
  { icon: Zap, title: "Reliability", desc: "Systems that stay up when it matters." },
];

const stack = [
  "React", "TypeScript", "JavaScript", "Node.js", "Supabase",
  "GitHub", "Lovable", "Vercel", "AI APIs",
];

export function Company() {
  return (
    <Section
      id="company"
      eyebrow="The Company"
      title={<>{BRAND.name} — <span className="text-emerald-gradient">a technology studio</span>.</>}
      subtitle="We design, build, and ship software, brands, and AI-powered products for ambitious founders and teams."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Logo showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5"
        >
          <div className="relative aspect-square rounded-3xl overflow-hidden glass p-8 flex items-center justify-center">
            <div className="absolute -inset-16 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute inset-8 rounded-full border border-emerald-400/20 animate-pulse-ring" />
            <img
              src={LOGO_URL}
              alt="D4 TECH logo"
              className="relative w-full max-w-sm h-auto object-contain drop-shadow-[0_0_40px_rgba(52,211,153,.4)]"
              loading="lazy"
            />
          </div>
        </motion.div>

        <div className="lg:col-span-7 space-y-4">
          <GlassCard>
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient">Our Story</div>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {BRAND.name} was founded by Amurun Destiny to close the gap between world-class product thinking
              and elegant execution. What began as a designer's obsession with quality became a full-stack
              technology company delivering fintech, AI, and premium web experiences.
            </p>
          </GlassCard>

          <div className="grid sm:grid-cols-2 gap-4">
            <GlassCard>
              <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient">Mission</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Create innovative digital solutions that empower people and businesses to thrive in the modern world.
              </p>
            </GlassCard>
            <GlassCard>
              <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient">Vision</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Become the leading African-born technology brand shaping how the world builds premium software.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="mt-12">
        <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient font-semibold mb-5">Core Values</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <GlassCard className="h-full">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-400/25 to-emerald-500/5 border border-emerald-400/30 mb-3">
                  <v.icon className="h-5 w-5 text-emerald-300" />
                </div>
                <div className="font-display font-semibold">{v.title}</div>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stack */}
      <div className="mt-10">
        <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient font-semibold mb-5">Technology Stack</div>
        <div className="flex flex-wrap gap-2">
          {stack.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="glass rounded-full px-4 py-2 text-sm text-metallic hover:border-emerald-400/60 transition"
            >
              {s}
            </motion.span>
          ))}
        </div>
      </div>
    </Section>
  );
}
