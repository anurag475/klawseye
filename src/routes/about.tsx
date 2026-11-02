import { createFileRoute } from "@tanstack/react-router";
import { AboutSections } from "@/components/storefront/about-sections";
import { SiteShell } from "@/components/storefront/site-shell";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({ meta: [
    { title: "About KLAWSEYE — The #KlawedGang" },
    { name: "description", content: "Meet KLAWSEYE: handmade press-on nails from Delhi-NCR, our community, and how to join the team." },
  ] }),
});

function AboutPage() {
  return <SiteShell><AboutSections /></SiteShell>;
}
