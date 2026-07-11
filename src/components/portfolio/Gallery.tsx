import { motion } from "framer-motion";
import { Section } from "./Section";

const items = [
  { title: "Logo Designs", tag: "Branding", h: "tall" },
  { title: "Brand Systems", tag: "Identity", h: "short" },
  { title: "Flyers", tag: "Print", h: "med" },
  { title: "Posters", tag: "Print", h: "tall" },
  { title: "Website Mockups", tag: "Web", h: "med" },
  { title: "UI Designs", tag: "Product", h: "short" },
  { title: "Software Screens", tag: "Product", h: "tall" },
  { title: "Social Design", tag: "Marketing", h: "med" },
  { title: "Motion Studies", tag: "Motion", h: "short" },
];

const heights: Record<string, string> = {
  short: "aspect-[4/3]",
  med: "aspect-square",
  tall: "aspect-[3/4]",
};

const tints = [
  "from-emerald-500/30 via-emerald-700/10 to-black/40",
  "from-emerald-300/25 via-emerald-800/15 to-black/40",
  "from-emerald-400/25 via-slate-800/20 to-black/40",
  "from-emerald-500/20 via-emerald-900/20 to-black/40",
];

export function Gallery() {
  return (
    <Section
      id="gallery"
      eyebrow="Gallery"
      title={<>Selected <span className="text-emerald-gradient">visual work</span>.</>}
      subtitle="A masonry of brand systems, UI, and design artefacts."
    >
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className="break-inside-avoid"
          >
            <div className={`relative ${heights[it.h]} rounded-2xl overflow-hidden glass p-1 group cursor-pointer`}>
              <div className={`relative h-full w-full rounded-xl overflow-hidden bg-gradient-to-br ${tints[i % tints.length]} border border-emerald-400/20`}>
                <div className="absolute inset-0 grid-noise opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-emerald-300">{it.tag}</div>
                    <div className="mt-2 font-display text-xl font-semibold text-metallic">{it.title}</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
