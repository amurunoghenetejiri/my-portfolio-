import { motion } from "framer-motion";
import { ArrowRight, Download, Eye, Mail, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BRAND, CEO_URL, SOCIALS } from "./assets";
import { SocialIcon } from "./SocialIcon";

export function Hero() {
  const { data: cvUrl } = useQuery({
    queryKey: ["public-cv-url"],
    queryFn: async () => {
      const { data } = await supabase.from("site_profile").select("cv_url").limit(1).maybeSingle();
      return data?.cv_url ?? null;
    },
    staleTime: 60_000,
  });

  const onDownloadCv = () => {
    if (!cvUrl) return;
    void supabase.from("notifications").insert({ kind: "cv_download", title: "CV downloaded" });
  };

  return (
    <section id="home" className="relative min-h-dvh flex items-center overflow-hidden pt-28 pb-16">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10 grid-noise opacity-60" />
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-24 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-[100px]" />
      </div>

      {/* Floating particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-emerald-300/70 shadow-[0_0_10px_2px_rgba(52,211,153,.9)]"
          style={{
            top: `${(i * 53) % 100}%`,
            left: `${(i * 37) % 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.9, 0.2],
          }}
          transition={{
            duration: 4 + (i % 5),
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="mx-auto max-w-7xl w-full px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span className="text-muted-foreground">{BRAND.role} · {BRAND.name}</span>
            </div>

            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02]">
              <span className="text-metallic">Amurun</span>{" "}
              <span className="text-emerald-gradient animate-gradient-x">Destiny</span>
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>{BRAND.course} Student</span>
              <span className="h-1 w-1 rounded-full bg-emerald-400/70" />
              <span>{BRAND.school}</span>
            </div>

            <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              &ldquo;{BRAND.intro}&rdquo;
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] text-emerald-gradient">
                {BRAND.motto}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projects" className="btn-emerald">
                View Portfolio <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={cvUrl || "#"}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => { if (!cvUrl) { e.preventDefault(); return; } }}
                className={`btn-ghost-metal ${!cvUrl ? "opacity-50 pointer-events-none" : ""}`}
              >
                <Eye className="h-4 w-4" /> View CV
              </a>
              <a
                href={cvUrl || "#"}
                download
                onClick={(e) => { if (!cvUrl) { e.preventDefault(); return; } onDownloadCv(); }}
                className={`btn-ghost-metal ${!cvUrl ? "opacity-50 pointer-events-none" : ""}`}
              >
                <Download className="h-4 w-4" /> Download CV
              </a>
              <button type="button" data-hire-me className="btn-emerald">Hire Me</button>
              <a href="#contact" className="btn-ghost-metal">
                <Mail className="h-4 w-4" /> Contact
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card/40 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-[0_10px_28px_-12px_rgba(52,211,153,.7)]"
                >
                  <SocialIcon name={s.icon} className="h-4 w-4 text-muted-foreground group-hover:text-emerald-300 transition" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="lg:col-span-6 order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-[280px] sm:w-[380px] md:w-[460px] lg:w-[520px] aspect-square animate-float">
              {/* Outer rotating conic ring */}
              <div
                className="absolute -inset-4 rounded-full animate-spin-slow"
                style={{
                  background:
                    "conic-gradient(from 90deg, transparent 0deg, oklch(0.78 0.24 148 / .9) 60deg, transparent 180deg, oklch(0.78 0.24 148 / .5) 260deg, transparent 340deg)",
                  mask: "radial-gradient(circle, transparent 68%, black 69%, black 74%, transparent 75%)",
                  WebkitMask: "radial-gradient(circle, transparent 68%, black 69%, black 74%, transparent 75%)",
                  filter: "drop-shadow(0 0 24px oklch(0.78 0.24 148 / 0.5))",
                }}
              />
              {/* Solid glow ring */}
              <div className="absolute inset-0 rounded-full ring-2 ring-emerald-400/70 shadow-[0_0_80px_-10px_rgba(52,211,153,.6),inset_0_0_60px_-10px_rgba(52,211,153,.35)]" />
              {/* Dashed inner ring */}
              <div className="absolute inset-2 rounded-full border border-dashed border-emerald-300/30 animate-pulse-ring" />
              {/* Portrait */}
              <div className="absolute inset-3 rounded-full overflow-hidden bg-black">
                <img
                  src={CEO_URL}
                  alt="Amurun Destiny — Founder & CEO of D4 TECH"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -left-4 top-8 glass rounded-2xl px-3 py-2 text-xs"
              >
                <div className="text-emerald-300 font-semibold">Founder & CEO</div>
                <div className="text-muted-foreground">D4 TECH</div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -right-4 bottom-10 glass rounded-2xl px-3 py-2 text-xs"
              >
                <div className="text-emerald-300 font-semibold">FUPRE</div>
                <div className="text-muted-foreground">Computer Engineering</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
