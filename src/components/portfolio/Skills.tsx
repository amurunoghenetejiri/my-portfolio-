import { motion } from "framer-motion";
import { Section } from "./Section";

const skills = [
  { name: "React", level: 95 },
  { name: "JavaScript", level: 94 },
  { name: "TypeScript", level: 90 },
  { name: "HTML", level: 98 },
  { name: "CSS", level: 95 },
  { name: "UI/UX Design", level: 92 },
  { name: "Graphic Design", level: 96 },
  { name: "Branding", level: 90 },
  { name: "API Integration", level: 88 },
  { name: "Supabase", level: 87 },
  { name: "AI Integration", level: 85 },
  { name: "Prompt Engineering", level: 89 },
  { name: "Responsive Web Design", level: 96 },
];

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title={<>Tools of the <span className="text-emerald-gradient">trade</span>.</>}
      subtitle="A cross-disciplinary toolkit spanning engineering, design, and AI."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.5 }}
            className="glass rounded-2xl p-5 hover:border-emerald-400/50 transition"
          >
            <div className="flex items-center justify-between">
              <div className="font-display font-medium">{s.name}</div>
              <div className="text-xs text-emerald-gradient font-mono tabular-nums">{s.level}%</div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-200 shadow-[0_0_16px_rgba(52,211,153,.6)]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
