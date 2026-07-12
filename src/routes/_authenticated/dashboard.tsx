import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — D4 TECH Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminShell,
});
