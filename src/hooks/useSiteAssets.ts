import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LOGO_URL as FALLBACK_LOGO, CEO_URL as FALLBACK_CEO } from "@/components/portfolio/assets";

/**
 * Reads brand images from `site_profile` so they render everywhere the same way.
 *
 * The bundled `.asset.json` pointers resolve to Lovable's `/__l5e/...` CDN, which
 * only serves on Lovable-hosted domains — that's why images vanish after a Vercel
 * deploy. Uploads done via /dashboard/profile land in Supabase Storage with
 * absolute `https://…supabase.co/...` URLs that work anywhere. This hook prefers
 * the DB value when present and only falls back to the bundled pointer.
 */
export function useSiteAssets() {
  const { data } = useQuery({
    queryKey: ["site-assets"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_profile")
        .select("avatar_url, company_logo_url")
        .limit(1)
        .maybeSingle();
      return data ?? null;
    },
    staleTime: 60_000,
  });

  return {
    logoUrl: data?.company_logo_url || FALLBACK_LOGO,
    ceoUrl: data?.avatar_url || FALLBACK_CEO,
  };
}
