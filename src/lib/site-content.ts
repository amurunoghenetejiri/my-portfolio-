import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { refreshSignedUrl } from "@/lib/admin-helpers";
import { SOCIALS as FALLBACK_SOCIALS } from "@/components/portfolio/assets";

export type Social = { name: string; href: string; icon: string };

export type SiteProfile = {
  id: string;
  full_name: string | null;
  position: string | null;
  biography: string | null;
  intro: string | null;
  motto: string | null;
  company_name: string | null;
  company_logo_url: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  cv_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  socials: Social[] | null;
};

export function useSiteProfile() {
  return useQuery({
    queryKey: ["site-profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_profile").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data as SiteProfile | null;
    },
    staleTime: 30_000,
  });
}

export function useContactInfo() {
  const { data } = useSiteProfile();
  const email = data?.contact_email?.trim() || "d4techsupports@gmail.com";
  const phone = data?.contact_phone?.trim() || "";
  const waHref = phone
    ? `https://wa.me/${phone.replace(/[^0-9]/g, "")}`
    : "https://wa.me/";
  const dbSocials = (data?.socials ?? []).filter((s): s is Social => !!s?.href && !!s?.icon);
  const socials: Social[] = dbSocials.length > 0 ? dbSocials : (FALLBACK_SOCIALS as unknown as Social[]);
  return { email, phone, waHref, socials };
}

/** Resolve a possibly-expired signed URL from Supabase storage to a fresh one. */
export function useResolvedImage(src: string | null | undefined) {
  const [resolved, setResolved] = useState<string | null>(src ?? null);
  useEffect(() => {
    let mounted = true;
    refreshSignedUrl(src).then((u) => { if (mounted) setResolved(u); });
    return () => { mounted = false; };
  }, [src]);
  return resolved;
}
