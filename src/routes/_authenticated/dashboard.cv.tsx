import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadCv } from "@/lib/admin-helpers";
import { Card, Toast } from "./dashboard.profile";
import { ExternalLink, FileText, Loader2, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/cv")({
  component: CvPage,
});

function CvPage() {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["site-profile", "cv"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_profile").select("id, cv_url").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const setCvUrl = useMutation({
    mutationFn: async (url: string | null) => {
      if (!data?.id) throw new Error("Profile missing");
      const { error } = await supabase.from("site_profile").update({ cv_url: url }).eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-profile", "cv"] }),
  });

  const onUpload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const url = await uploadCv(file);
      await setCvUrl.mutateAsync(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">CV / Resume</h1>
        <p className="mt-1 text-sm text-muted-foreground">Upload the PDF that visitors will download from your public site.</p>
      </div>

      {error && <Toast tone="error">{error}</Toast>}

      <Card title="Current CV">
        {data?.cv_url ? (
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 grid place-items-center">
              <FileText className="h-6 w-6 text-emerald-300" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="font-display font-semibold">CV uploaded</div>
              <a href={data.cv_url} target="_blank" rel="noreferrer" className="text-xs text-emerald-gradient hover:underline inline-flex items-center gap-1">
                Open current CV <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <button onClick={() => setCvUrl.mutate(null)} className="btn-ghost-metal text-red-300"><Trash2 className="h-4 w-4" /> Remove</button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No CV uploaded yet.</p>
        )}
      </Card>

      <Card title={data?.cv_url ? "Replace CV" : "Upload CV"}>
        <label className="btn-emerald cursor-pointer inline-flex">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? "Uploading…" : "Choose PDF"}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              await onUpload(f);
              e.currentTarget.value = "";
            }}
          />
        </label>
        <p className="mt-3 text-xs text-muted-foreground">PDF only. Max ~10 MB recommended.</p>
      </Card>
    </div>
  );
}
