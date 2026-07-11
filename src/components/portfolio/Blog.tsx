import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { GlassCard, Section } from "./Section";

const posts = [
  { cat: "Technology", title: "Why 2026 belongs to premium software.", read: "6 min", date: "Jul 2026" },
  { cat: "Programming", title: "Shipping React apps that feel native.", read: "8 min", date: "Jun 2026" },
  { cat: "Artificial Intelligence", title: "Prompt engineering in production.", read: "5 min", date: "May 2026" },
  { cat: "Business", title: "How D4 TECH prices premium work.", read: "4 min", date: "May 2026" },
  { cat: "Design", title: "The metallic emerald design system.", read: "7 min", date: "Apr 2026" },
  { cat: "Technology", title: "Building fintech on Supabase.", read: "9 min", date: "Mar 2026" },
];

export function Blog() {
  return (
    <Section
      id="blog"
      eyebrow="From the blog"
      title={<>Ideas, essays & <span className="text-emerald-gradient">field notes</span>.</>}
      subtitle="Long-form writing on technology, programming, AI, business, and design."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((p, i) => (
          <motion.a
            key={p.title}
            href="#"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="block group"
          >
            <GlassCard className="h-full">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-emerald-500/25 to-emerald-900/20 border border-emerald-400/20">
                <div className="absolute inset-0 grid-noise opacity-40" />
                <div className="absolute top-3 left-3 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-emerald-300">
                  {p.cat}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{p.date}</span>
                <span className="h-1 w-1 rounded-full bg-emerald-400/70" />
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.read}</span>
              </div>
              <div className="mt-2 font-display text-lg font-semibold group-hover:text-emerald-gradient transition">
                {p.title}
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-300">
                Read more <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </GlassCard>
          </motion.a>
        ))}
      </div>
    </Section>
  );
}
