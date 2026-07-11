import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { SOCIALS } from "./assets";
import { GlassCard, Section } from "./Section";
import { SocialIcon } from "./SocialIcon";

export function Contact() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
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
              <a href="mailto:contact@d4tech.dev" className="block text-sm hover:text-emerald-gradient transition">contact@d4tech.dev</a>
              <a href="https://wa.me/" className="block text-sm hover:text-emerald-gradient transition">WhatsApp Chat</a>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient">Social</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
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
          </div>
          <Field label="Subject" name="subject" type="text" placeholder="What is it about?" />
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
            <p className="text-xs text-muted-foreground">Responses within 24 hours.</p>
            <button type="submit" className="btn-emerald">
              {sent ? "Message sent ✓" : (<>Send message <Send className="h-4 w-4" /></>)}
            </button>
          </div>
        </motion.form>
      </div>
    </Section>
  );
}

function Field({ label, name, type, placeholder }: { label: string; name: string; type: string; placeholder: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs uppercase tracking-[0.24em] text-muted-foreground mb-2">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border/60 bg-card/40 backdrop-blur px-4 py-3 text-sm outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
      />
    </div>
  );
}
