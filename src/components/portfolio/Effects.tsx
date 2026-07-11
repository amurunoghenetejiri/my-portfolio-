import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const w = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX: w }}
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 shadow-[0_0_14px_rgba(52,211,153,.7)]"
    />
  );
}

export function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 800);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 20, pointerEvents: show ? "auto" : "none" }}
      transition={{ duration: 0.35 }}
      className="fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full glass-strong hover:border-emerald-400/60"
    >
      <ArrowUp className="h-4 w-4" />
    </motion.button>
  );
}

export function CursorGlow() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    Object.assign(el.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "420px",
      height: "420px",
      borderRadius: "9999px",
      pointerEvents: "none",
      zIndex: "1",
      transform: "translate(-50%, -50%)",
      background:
        "radial-gradient(circle, oklch(0.78 0.24 148 / 0.16) 0%, oklch(0.78 0.24 148 / 0.06) 30%, transparent 60%)",
      transition: "transform 120ms ease-out, opacity 200ms",
      mixBlendMode: "screen",
    } as CSSStyleDeclaration);
    document.body.appendChild(el);

    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      el.remove();
    };
  }, []);
  return null;
}
