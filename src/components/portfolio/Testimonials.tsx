import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { Section } from "./Section";

const items = [
  { quote: "D4 TECH turned our messy MVP into a premium fintech product our users trust. The bar of craft is real.", name: "Chidera O.", role: "Founder, PayFlow" },
  { quote: "Destiny operates as founder, engineer and designer at once — rare, and it shows in the final work.", name: "Amaka N.", role: "Head of Product, Lumen" },
  { quote: "The website D4 TECH built for us tripled conversions in the first month. Genuinely a competitive edge.", name: "Kelvin A.", role: "CEO, Nova Growth" },
  { quote: "Every deliverable is on time, on brand, and pixel-perfect. It's what world-class looks like.", name: "Ifeoma D.", role: "Marketing Lead, Ridge" },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, []);

  const cur = items[i];

  return (
    <Section
      id="testimonials"
      eyebrow="Testimonials"
      title={<>Words from <span className="text-emerald-gradient">the people we build for</span>.</>}
      subtitle="Founders and teams who've partnered with D4 TECH."
    >
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute -inset-6 rounded-3xl bg-emerald-500/10 blur-3xl -z-10" />
        <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <Quote className="absolute top-6 right-6 h-16 w-16 text-emerald-400/10" />
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-display text-xl sm:text-2xl leading-relaxed text-metallic">
                &ldquo;{cur.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-primary-foreground font-display font-bold">
                  {cur.name.charAt(0)}
                </div>
                <div>
                  <div className="font-display font-semibold">{cur.name}</div>
                  <div className="text-xs text-muted-foreground">{cur.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-1.5">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Show testimonial ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-emerald-400" : "w-1.5 bg-white/20"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setI((v) => (v - 1 + items.length) % items.length)}
                aria-label="Previous"
                className="grid h-9 w-9 place-items-center rounded-full border border-border/60 hover:border-emerald-400/60 transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setI((v) => (v + 1) % items.length)}
                aria-label="Next"
                className="grid h-9 w-9 place-items-center rounded-full border border-border/60 hover:border-emerald-400/60 transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
