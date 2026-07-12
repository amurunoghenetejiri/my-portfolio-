import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Global Hire Me dialog. Opens whenever anything clicks an element with
 * `data-hire-me` attribute anywhere on the page, or when `#hire` is added
 * to the URL hash.
 */
export function HireMeDialog() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("[data-hire-me]")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onHash = () => { if (window.location.hash === "#hire") setOpen(true); };
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    if (window.location.hash === "#hire") history.replaceState(null, "", window.location.pathname);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      full_name: String(fd.get("full_name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim() || null,
      company: String(fd.get("company") || "").trim() || null,
      country: String(fd.get("country") || "").trim() || null,
      project_type: String(fd.get("project_type") || "").trim() || null,
      budget: String(fd.get("budget") || "").trim() || null,
      preferred_contact: String(fd.get("preferred_contact") || "").trim() || null,
      description: String(fd.get("description") || "").trim(),
    };
    if (!payload.full_name || !payload.email || !payload.description) {
      setError("Please fill in name, email, and project description.");
      setState("error");
      return;
    }
    setState("sending");
    setError(null);
    const { error: err } = await supabase.from("leads").insert(payload);
    if (err) { setError(err.message); setState("error"); return; }
    setState("sent");
    form.reset();
    setTimeout(() => { setState("idle"); close(); }, 2200);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl glass rounded-3xl border border-emerald-400/30 p-6 sm:p-8 max-h-[92dvh] overflow-y-auto"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card/40 hover:border-emerald-400/50 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6">
              <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient">Hire Me</div>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold">
                Let's build <span className="text-emerald-gradient">something powerful</span>.
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Tell me about your project. I respond personally within 24 hours.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name *" name="full_name" placeholder="Your full name" required />
                <Field label="Email *" name="email" type="email" placeholder="you@example.com" required />
                <Field label="Phone Number" name="phone" type="tel" placeholder="+234 …" />
                <Field label="Company Name" name="company" placeholder="Optional" />
                <Field label="Country" name="country" placeholder="Nigeria" />
                <SelectField label="Project Type" name="project_type" options={["Web App", "Mobile App", "Website", "Branding / Design", "AI / Automation", "Consulting", "Other"]} />
                <SelectField label="Budget" name="budget" options={["< $500", "$500 – $2,000", "$2,000 – $5,000", "$5,000 – $15,000", "$15,000+", "Discuss"]} />
                <SelectField label="Preferred Contact" name="preferred_contact" options={["Email", "WhatsApp", "Phone Call", "Any"]} />
              </div>
              <div>
                <label htmlFor="description" className="block text-xs uppercase tracking-[0.24em] text-muted-foreground mb-2">Project Description *</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  placeholder="What are you building? What outcome are you after? Any timing constraints?"
                  className="w-full rounded-2xl border border-border/60 bg-card/40 backdrop-blur px-4 py-3 text-sm outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-xs text-muted-foreground">{error ?? "Your details are kept private."}</p>
                <button type="submit" disabled={state === "sending"} className="btn-emerald disabled:opacity-60">
                  {state === "sending" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>)
                    : state === "sent" ? "Request sent ✓"
                    : (<>Send request <Send className="h-4 w-4" /></>)}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, name, type = "text", placeholder, required }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs uppercase tracking-[0.24em] text-muted-foreground mb-2">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border/60 bg-card/40 backdrop-blur px-4 py-3 text-sm outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
      />
    </div>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs uppercase tracking-[0.24em] text-muted-foreground mb-2">{label}</label>
      <select
        id={name}
        name={name}
        defaultValue=""
        className="w-full rounded-2xl border border-border/60 bg-card/40 backdrop-blur px-4 py-3 text-sm outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
      >
        <option value="" disabled>Select…</option>
        {options.map((o) => <option key={o} value={o} className="bg-black">{o}</option>)}
      </select>
    </div>
  );
}
