import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard, Section } from "./Section";
import { SafeImage } from "./SafeImage";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category: string | null;
  published_at: string | null;
};

export function Blog() {
  const { data, isLoading } = useQuery({
    queryKey: ["public-blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,title,slug,excerpt,featured_image_url,category,published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(9);
      if (error) throw error;
      return (data ?? []) as Post[];
    },
    staleTime: 30_000,
  });

  const posts = data ?? [];

  return (
    <Section
      id="blog"
      eyebrow="From the blog"
      title={<>Ideas, essays & <span className="text-emerald-gradient">field notes</span>.</>}
      subtitle="Long-form writing on technology, programming, AI, business, and design."
    >
      {isLoading ? (
        <div className="grid place-items-center h-40"><Loader2 className="h-6 w-6 animate-spin text-emerald-300" /></div>
      ) : posts.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center border border-emerald-400/10">
          <div className="text-sm text-muted-foreground">New writing is on the way. Check back soon.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((p, i) => {
            const date = p.published_at ? new Date(p.published_at).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "";
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
              >
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="block group">
                  <GlassCard className="h-full">
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-emerald-500/25 to-emerald-900/20 border border-emerald-400/20">
                      {p.featured_image_url ? (
                        <SafeImage src={p.featured_image_url} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 grid-noise opacity-40" />
                      )}
                      {p.category && (
                        <div className="absolute top-3 left-3 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-emerald-300">
                          {p.category}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {date && <span>{date}</span>}
                      <span className="h-1 w-1 rounded-full bg-emerald-400/70" />
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {readTime(p.excerpt)} min</span>
                    </div>
                    <div className="mt-2 font-display text-lg font-semibold group-hover:text-emerald-gradient transition">{p.title}</div>
                    {p.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>}
                    <div className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-300">
                      Read more <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </Section>
  );
}

function readTime(excerpt: string | null): number {
  const words = (excerpt ?? "").split(/\s+/).length;
  return Math.max(3, Math.min(12, Math.round(words / 40) + 3));
}
