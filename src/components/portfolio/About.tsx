import { motion } from "framer-motion";
import { GraduationCap, Target, Compass, Heart } from "lucide-react";
import { CEO_URL } from "./assets";
import { GlassCard, Section } from "./Section";

const timeline = [
  { year: "2019", title: "Started Graphic Design", desc: "Began crafting brands, logos, and visual identity systems." },
  { year: "2021", title: "Started Software Development", desc: "Dived into web technologies, React, and modern JavaScript." },
  { year: "2023", title: "Built DATA4ME", desc: "Launched a data-driven digital services platform for everyday users." },
  { year: "2025", title: "Founded D4 TECH", desc: "Established D4 TECH — creating solutions, powering lives." },
];

const pillars = [
  { icon: GraduationCap, title: "Education", desc: "Computer Engineering at FUPRE — building deep technical foundations." },
  { icon: Target, title: "Career Goals", desc: "Ship products that scale across Africa and the world through technology." },
  { icon: Compass, title: "Personal Mission", desc: "Bridge the gap between elegant design and powerful engineering." },
  { icon: Heart, title: "Vision", desc: "A future where world-class software is built and led from Africa." },
];

export function About() {
  return (
    <Section
      id="about"
      eyebrow="About Me"
      title={<>The person behind <span className="text-emerald-gradient">the code</span>.</>}
      subtitle="Software engineer, designer, and entrepreneur. I turn ideas into premium digital experiences."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-4"
        >
          <div className="relative rounded-3xl overflow-hidden glass p-3">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <img src={CEO_URL} alt="Amurun Destiny" className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-xs uppercase tracking-widest text-emerald-300">Amurun Destiny</div>
                <div className="text-lg font-display font-bold text-metallic">Founder & CEO — D4 TECH</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-8 space-y-6">
          <GlassCard>
            <h3 className="font-display text-xl font-semibold mb-3">Biography</h3>
            <p className="text-muted-foreground leading-relaxed">
              I'm a Computer Engineering student at Federal University of Petroleum Resources, Effurun (FUPRE),
              a self-taught software engineer, product designer, and the Founder & CEO of D4 TECH.
              I combine years of design experience with modern engineering to build products people love —
              from AI-powered platforms and fintech dashboards to premium business websites and brand identities.
            </p>
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <GlassCard className="h-full">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 border border-emerald-400/30 mb-3">
                    <p.icon className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div className="font-display font-semibold">{p.title}</div>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-16">
        <div className="text-xs uppercase tracking-[0.32em] text-emerald-gradient font-semibold mb-6">Journey</div>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-400/50 to-transparent md:-translate-x-1/2" />
          <div className="space-y-8">
            {timeline.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative grid md:grid-cols-2 gap-6 ${i % 2 === 1 ? "md:[&>*:first-child]:col-start-2" : ""}`}
              >
                <div className={`pl-12 md:pl-0 ${i % 2 === 1 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                  <div className="absolute left-4 md:left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-400 shadow-[0_0_20px_4px_rgba(52,211,153,.7)]" />
                  <GlassCard>
                    <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient">{t.year}</div>
                    <div className="mt-2 font-display text-lg font-semibold">{t.title}</div>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
