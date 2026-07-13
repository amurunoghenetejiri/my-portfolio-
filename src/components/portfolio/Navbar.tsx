import { motion, AnimatePresence } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LOGO_URL, NAV_SECTIONS, BRAND } from "./assets";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    NAV_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`glass flex items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all ${
            scrolled ? "shadow-2xl" : ""
          }`}
        >
          <a href="#home" className="flex items-center gap-2.5 shrink-0 group">
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-black ring-1 ring-emerald-400/40 overflow-hidden">
              <img src={LOGO_URL} alt="D4 TECH logo" className="h-9 w-9 object-cover" />
              <span className="absolute inset-0 rounded-full ring-2 ring-emerald-400/0 group-hover:ring-emerald-400/60 transition" />
            </span>
            <span className="font-display font-bold tracking-widest text-sm text-metallic hidden sm:block">
              {BRAND.name}
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{s.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card/40 hover:border-emerald-400/60 transition"
            >
              {light ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a href="#contact" className="btn-emerald hidden md:inline-flex text-xs py-2 px-4">
              Hire Me
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="lg:hidden grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card/40"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="absolute right-0 top-0 h-full w-[78%] max-w-sm glass-strong border-l border-emerald-400/20 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={LOGO_URL} alt="" className="h-8 w-8 rounded-full" />
                  <span className="font-display font-bold tracking-widest text-sm text-metallic">
                    {BRAND.name}
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border/60"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col">
                {NAV_SECTIONS.map((s, i) => (
                  <motion.a
                    key={s.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="border-b border-border/40 py-3 text-lg font-display hover:text-emerald-gradient"
                  >
                    {s.label}
                  </motion.a>
                ))}
              </nav>
              <a href="#contact" onClick={() => setOpen(false)} className="btn-emerald mt-8 w-full">
                Hire Me
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
