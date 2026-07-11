import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <div className="text-xs uppercase tracking-[0.32em] text-emerald-gradient font-semibold">
              {eyebrow}
            </div>
          )}
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-base text-muted-foreground max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}

export function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`glass rounded-3xl p-6 transition-all duration-500 ${
        hover ? "hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_30px_60px_-24px_rgba(52,211,153,.35)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
