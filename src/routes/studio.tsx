import { createFileRoute } from "@tanstack/react-router";
import { StudioExperience } from "@/components/storefront/studio-services";
import { SiteShell } from "@/components/storefront/site-shell";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
  head: () => ({ meta: [
    { title: "Studio & Booking — KLAWSEYE Delhi-NCR" },
    { name: "description", content: "Book Russian manicures, sculpted extensions, lash extensions and press-on fittings at the KLAWSEYE Delhi-NCR studio." },
  ] }),
});

function StudioPage() {
  return <SiteShell><StudioExperience /></SiteShell>;
}
