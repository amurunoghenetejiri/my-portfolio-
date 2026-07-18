import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "./Section";
import { SafeImage } from "./SafeImage";

type GalleryItem = {
  id: string;
  title: string;
  category: string | null;
  image_url: string;
  description: string | null;
};

export function Gallery() {
  const { data, isLoading } = useQuery({
    queryKey: ["public-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("id,title,category,image_url,description")
        .eq("is_hidden", false)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as GalleryItem[];
    },
    staleTime: 30_000,
  });

  const items = data ?? [];

  return (
    <Section
      id="gallery"
      eyebrow="Gallery"
      title={<>Selected <span className="text-emerald-gradient">visual work</span>.</>}
      subtitle="A collection of brand systems, UI, and design artefacts."
    >
      {isLoading ? (
        <div className="grid place-items-center h-40"><Loader2 className="h-6 w-6 animate-spin text-emerald-300" /></div>
      ) : items.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center border border-emerald-400/10">
          <div className="text-sm text-muted-foreground">Gallery is being curated. Check back soon.</div>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 9) * 0.05, duration: 0.5 }}
              className="break-inside-avoid"
            >
              <div className="relative rounded-2xl overflow-hidden glass p-1 group">
                <div className="relative rounded-xl overflow-hidden border border-emerald-400/20">
                  <SafeImage src={it.image_url} alt={it.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    {it.category && <div className="text-[10px] uppercase tracking-[0.28em] text-emerald-300">{it.category}</div>}
                    <div className="mt-1 font-display text-lg font-semibold text-metallic">{it.title}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  );
}
