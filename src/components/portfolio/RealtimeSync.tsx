import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribes to Supabase Realtime for public content tables and invalidates
 * the relevant React Query caches so the public site auto-refreshes whenever
 * the admin edits anything.
 */
export function RealtimeSync() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("public-content-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => {
        qc.invalidateQueries({ queryKey: ["public-projects"] });
        qc.invalidateQueries({ queryKey: ["public-project"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "blog_posts" }, () => {
        qc.invalidateQueries({ queryKey: ["public-blog"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "site_profile" }, () => {
        qc.invalidateQueries({ queryKey: ["public-cv-url"] });
        qc.invalidateQueries({ queryKey: ["site-profile"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return null;
}
