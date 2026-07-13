import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BRAND } from "./assets";
import { useSiteAssets } from "@/hooks/useSiteAssets";

export function Loader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const { logoUrl } = useSiteAssets();

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1800;
    const tick = (t: number) => {
      const p = Math.min(100, Math.round(((t - start) / dur) * 100));
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 260);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          aria-hidden={done}
        >
          <div className="absolute inset-0 opacity-40 grid-noise" />
          <div className="relative flex h-52 w-52 items-center justify-center">
            <div className="absolute inset-0 rounded-full animate-spin-slow"
              style={{
                background: "conic-gradient(from 0deg, transparent 0deg, oklch(0.78 0.24 148) 90deg, transparent 200deg)",
                mask: "radial-gradient(circle, transparent 62%, black 63%, black 100%)",
                WebkitMask: "radial-gradient(circle, transparent 62%, black 63%, black 100%)",
                filter: "drop-shadow(0 0 24px oklch(0.78 0.24 148 / 0.7))",
              }}
            />
            <div className="absolute inset-3 rounded-full border border-emerald-400/20 animate-pulse-ring" />
            <motion.img
              src={logoUrl}
              alt="D4 TECH"
              className="relative h-32 w-32 rounded-full object-cover"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ filter: "drop-shadow(0 0 20px oklch(0.78 0.24 148 / 0.55))" }}
            />
          </div>
          <div className="mt-8 flex flex-col items-center gap-1">
            <div className="font-display text-2xl font-bold tracking-widest text-metallic">
              {BRAND.name}
            </div>
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient">
              {BRAND.motto}
            </div>
          </div>
          <div className="mt-10 flex w-64 flex-col items-center gap-2">
            <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-200"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="font-mono text-xs tabular-nums text-white/70">{pct}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
