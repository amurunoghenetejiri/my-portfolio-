import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { LOGO_URL, BRAND } from "./assets";

const INTRO_MS = 4000;
const LOAD_MS = 8000;

export function Loader() {
  const [pct, setPct] = useState(0);
  const [stage, setStage] = useState<"intro" | "loading">("intro");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const introTimer = setTimeout(() => setStage("loading"), INTRO_MS);
    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (stage !== "loading") return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(100, Math.round(((t - start) / LOAD_MS) * 100));
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 500);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  // Deterministic particle positions (avoids SSR/CSR hydration mismatch)
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const seed = i * 9973;
        const x = ((seed * 31) % 1000) / 10; // 0..100
        const y = ((seed * 17) % 1000) / 10;
        const delay = ((seed * 7) % 4000) / 1000;
        const dur = 5 + ((seed * 3) % 5000) / 1000;
        const size = 1 + ((seed * 5) % 30) / 10;
        return { x, y, delay, dur, size };
      }),
    [],
  );

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black"
          aria-hidden={done}
        >
          {/* Ambient background */}
          <div className="absolute inset-0 opacity-40 grid-noise" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, oklch(0.78 0.24 148 / 0.10), transparent 60%)",
            }}
          />

          {/* Floating particles */}
          <div className="pointer-events-none absolute inset-0">
            {particles.map((p, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-emerald-300"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  filter: "drop-shadow(0 0 6px oklch(0.78 0.24 148 / 0.8))",
                }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.9, 0], y: [-8, -40, -80] }}
                transition={{
                  duration: p.dur,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Logo cluster */}
          <motion.div
            className="relative flex h-56 w-56 items-center justify-center"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Rotating emerald ring — always on */}
            <div
              className="absolute inset-0 rounded-full animate-spin-slow"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, oklch(0.78 0.24 148) 90deg, transparent 210deg)",
                mask: "radial-gradient(circle, transparent 62%, black 63%, black 100%)",
                WebkitMask:
                  "radial-gradient(circle, transparent 62%, black 63%, black 100%)",
                filter: "drop-shadow(0 0 28px oklch(0.78 0.24 148 / 0.75))",
              }}
            />

            {/* Metallic silver ring */}
            <div
              className="absolute inset-2 rounded-full"
              style={{
                background:
                  "conic-gradient(from 180deg, transparent 0deg, oklch(0.86 0.008 220 / 0.6) 60deg, transparent 140deg)",
                mask: "radial-gradient(circle, transparent 68%, black 69%, black 100%)",
                WebkitMask:
                  "radial-gradient(circle, transparent 68%, black 69%, black 100%)",
                animation: "spin-slow 12s linear infinite reverse",
              }}
            />

            {/* Progress ring — only visible in stage 2 */}
            <AnimatePresence>
              {stage === "loading" && (
                <motion.svg
                  key="progress"
                  className="absolute inset-0 -rotate-90"
                  viewBox="0 0 100 100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="oklch(0.98 0.005 160 / 0.08)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="oklch(0.78 0.24 148)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={`${(pct / 100) * 289.03} 289.03`}
                    style={{
                      filter:
                        "drop-shadow(0 0 6px oklch(0.78 0.24 148 / 0.9))",
                      transition: "stroke-dasharray 0.2s linear",
                    }}
                  />
                </motion.svg>
              )}
            </AnimatePresence>

            <div className="absolute inset-3 rounded-full border border-emerald-400/20 animate-pulse-ring" />

            <motion.img
              src={LOGO_URL}
              alt="D4 TECH"
              className="relative h-32 w-32 rounded-full object-cover"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                filter: "drop-shadow(0 0 24px oklch(0.78 0.24 148 / 0.6))",
              }}
            />
          </motion.div>

          {/* Brand */}
          <motion.div
            className="mt-8 flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
          >
            <div className="font-display text-3xl font-bold tracking-[0.18em] text-metallic">
              {BRAND.name}
            </div>
            <div className="text-[11px] uppercase tracking-[0.32em] text-emerald-gradient">
              {BRAND.motto}
            </div>
          </motion.div>

          {/* Progress — only in stage 2 */}
          <div className="mt-10 h-12 w-64">
            <AnimatePresence>
              {stage === "loading" && (
                <motion.div
                  key="bar"
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-200"
                      style={{
                        width: `${pct}%`,
                        transition: "width 0.2s linear",
                        boxShadow:
                          "0 0 12px oklch(0.78 0.24 148 / 0.9)",
                      }}
                    />
                  </div>
                  <div className="font-mono text-xs tabular-nums tracking-widest text-white/70">
                    {pct.toString().padStart(3, "0")}%
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
