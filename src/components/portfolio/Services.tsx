import { motion } from "framer-motion";
import {
  Globe, Code2, Briefcase, User, Palette, Sparkles,
  ShieldCheck, Bot, CreditCard, LayoutDashboard, Database, PenTool,
} from "lucide-react";
import { GlassCard, Section } from "./Section";

const services = [
  { icon: Globe, title: "Website Development", desc: "Fast, SEO-ready sites built to convert." },
  { icon: Code2, title: "Web Applications", desc: "Scalable React/TS apps with real backends." },
  { icon: Briefcase, title: "Business Websites", desc: "Premium presence for ambitious brands." },
  { icon: User, title: "Portfolio Websites", desc: "Personal brands that stand out." },
  { icon: Palette, title: "Graphic Design", desc: "Print, social, and brand visuals." },
  { icon: Sparkles, title: "Logo Design", desc: "Marks that scale from favicon to billboard." },
  { icon: ShieldCheck, title: "Brand Identity", desc: "Systems, guidelines, and visual language." },
  { icon: Bot, title: "AI Chatbots", desc: "Smart assistants that actually help." },
  { icon: CreditCard, title: "Fintech Platforms", desc: "Wallets, dashboards, and payments." },
  { icon: LayoutDashboard, title: "Dashboard Development", desc: "Data-dense interfaces made simple." },
  { icon: Database, title: "Database Integration", desc: "Supabase, Postgres, secure by default." },
  { icon: PenTool, title: "UI/UX Design", desc: "Interfaces users love returning to." },
];

export function Services() {
  return (
    <Section
      id="services"
      eyebrow="Services"
      title={<>What <span className="text-emerald-gradient">we deliver</span>.</>}
      subtitle="A full-stack studio for software, brand, and AI-powered products."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          >
            <GlassCard className="h-full group relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-400/25 to-emerald-500/5 border border-emerald-400/30 mb-4">
                <s.icon className="h-5 w-5 text-emerald-300" />
              </div>
              <div className="font-display text-lg font-semibold">{s.title}</div>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
