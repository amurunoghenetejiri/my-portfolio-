import { BRAND, LOGO_URL, NAV_SECTIONS } from "./assets";
import { SocialIcon } from "./SocialIcon";
import { useContactInfo } from "@/lib/site-content";

export function Footer() {
  const { socials } = useContactInfo();
  return (
    <footer className="relative border-t border-border/40 pt-16 pb-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-black ring-1 ring-emerald-400/40 overflow-hidden shadow-[0_0_18px_-2px_rgba(52,211,153,.55)]">
                <img src={LOGO_URL} alt="D4 TECH" className="h-11 w-11 rounded-full object-cover" />
              </span>
              <div>
                <div className="font-display font-bold tracking-widest text-metallic">{BRAND.name}</div>
                <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient">{BRAND.motto}</div>
              </div>
            </div>
            <p className="mt-5 text-sm text-muted-foreground max-w-md leading-relaxed">
              A premium technology studio founded by {BRAND.ceo} — building software, brands, and AI-powered
              products for ambitious founders and teams.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.name + s.href}
                  href={s.href}
                  aria-label={s.name}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card/40 hover:-translate-y-0.5 hover:border-emerald-400/60 transition-all"
                >
                  <SocialIcon name={s.icon} className="h-4 w-4 text-muted-foreground group-hover:text-emerald-300" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient mb-4">Quick Links</div>
            <div className="grid grid-cols-2 gap-2">
              {NAV_SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="text-sm text-muted-foreground hover:text-emerald-gradient transition">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient mb-4">Legal</div>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-emerald-gradient transition">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-emerald-gradient transition">Terms & Conditions</a>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-emerald-gradient transition">Contact</a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground">
          <div>© 2026 {BRAND.name}. All rights reserved.</div>
          <div>Designed & engineered by {BRAND.ceo}.</div>
        </div>
      </div>
    </footer>
  );
}
