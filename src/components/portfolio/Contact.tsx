import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useContactInfo } from "@/lib/site-content";
import { GlassCard, Section } from "./Section";
import { SocialIcon } from "./SocialIcon";

export function Contact() {
  const { email, waHref, socials } = useContactInfo();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const emailVal = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim() || null;
    const subject = String(fd.get("subject") || "").trim() || null;
    const message = String(fd.get("message") || "").trim();
    if (!name || !emailVal || !message) { setError("Please fill in all required fields."); setState("error"); return; }
    setState("sending");
    setError(null);
    const { error: err } = await supabase.from("messages").insert({ name, email: emailVal, phone, subject, message });
    if (err) { setError(err.message); setState("error"); return; }
    setState("sent");
    form.reset();
    setTimeout(() => setState("idle"), 4000);
  };

  return (
    <Section
      id="contact"
      eyebrow="Get in touch"
      title={<>Let's build <span className="text-emerald-gradient">something remarkable</span>.</>}
      subtitle="Tell me about your idea, product, or brand. I read every message personally."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <GlassCard>
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient">Direct</div>
            <div className="mt-3 space-y-2">
              <a href={`mailto:${email}`} className="block text-sm hover:text-emerald-gradient transition">{email}</a>
              <a href={waHref} target="_blank" rel="noreferrer" className="block text-sm hover:text-emerald-gradient transition">WhatsApp Chat</a>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient">Social</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.name + s.href}
                  href={s.href}
                  aria-label={s.name}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card/40 hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-[0_10px_28px_-12px_rgba(52,211,153,.7)] transition-all"
                >
                  <SocialIcon name={s.icon} className="h-4 w-4 text-muted-foreground group-hover:text-emerald-300 transition" />
                </a>
              ))}
            </div>
          </GlassCard>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={onSubmit}
          className="lg:col-span-3 glass rounded-3xl p-6 sm:p-8 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name" name="name" type="text" placeholder="Your full name" />
            <Field label="Email" name="email" type="email" placeholder="you@example.com" />
            <Field label="Phone" name="phone" type="tel" placeholder="+234 …" required={false} />
            <Field label="Subject" name="subject" type="text" placeholder="What is it about?" required={false} />
          </div>
          <div>
            <label htmlFor="message" className="block text-xs uppercase tracking-[0.24em] text-muted-foreground mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              placeholder="Tell me about your project…"
              className="w-full rounded-2xl border border-border/60 bg-card/40 backdrop-blur px-4 py-3 text-sm outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">{error ?? "Responses within 24 hours."}</p>
            <button type="submit" disabled={state === "sending"} className="btn-emerald disabled:opacity-60">
              {state === "sending" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>)
                : state === "sent" ? "Message sent ✓"
                : (<>Send message <Send className="h-4 w-4" /></>)}
            </button>
          </div>
        </motion.form>
      </div>
    </Section>
  );
}

function Field({ label, name, type, placeholder, required = true }: { label: string; name: string; type: string; placeholder: string; required?: boolean }) {
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
