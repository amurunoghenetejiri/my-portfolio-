import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SafeImage } from "@/components/portfolio/SafeImage";
import { Navbar } from "@/components/portfolio/Navbar";
import { Footer } from "@/components/portfolio/Footer";
import { HireMeDialog } from "@/components/portfolio/HireMeDialog";
import { CursorGlow, ScrollProgress, ScrollToTop } from "@/components/portfolio/Effects";

export const Route = createFileRoute("/blog/$slug")({
  ssr: false,
  component: BlogPost,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — D4 TECH Blog` },
      { name: "description", content: "Insights and essays from D4 TECH." },
    ],
  }),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-dvh grid place-items-center p-8 text-center">
      <div>
        <div className="text-sm text-red-300 mb-3">{error.message}</div>
        <button onClick={reset} className="btn-emerald">Retry</button>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-dvh grid place-items-center p-8 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Post not found</h1>
        <Link to="/" className="btn-emerald mt-4 inline-flex">Back home</Link>
      </div>
    </div>
  ),
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["public-blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) window.history.back();
    else window.location.href = "/#blog";
  };

  if (isLoading) return <div className="min-h-dvh grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-300" /></div>;
  if (!data) return null;

  const date = data.published_at ? new Date(data.published_at).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : "";

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="pt-32 pb-24">
        <article className="mx-auto max-w-3xl px-6">
          <button onClick={goBack} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-emerald-gradient mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to portfolio
          </button>

          {data.category && <div className="text-xs uppercase tracking-[0.28em] text-emerald-gradient mb-3">{data.category}</div>}
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.05]">{data.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            {date && <span>{date}</span>}
            <span className="h-1 w-1 rounded-full bg-emerald-400/70" />
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {Math.max(3, Math.round((data.content?.split(/\s+/).length ?? 0) / 200))} min read</span>
          </div>

          {data.featured_image_url && (
            <div className="mt-8 rounded-2xl overflow-hidden border border-emerald-400/10 aspect-[16/9]">
              <SafeImage src={data.featured_image_url} alt={data.title} className="h-full w-full object-cover" />
            </div>
          )}

          {data.excerpt && <p className="mt-8 text-lg text-muted-foreground leading-relaxed">{data.excerpt}</p>}

          <div className="mt-10 prose prose-invert max-w-none whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-foreground/90">
            {data.content}
          </div>
        </article>
      </main>
      <Footer />
      <ScrollToTop />
      <HireMeDialog />
    </>
  );
}
