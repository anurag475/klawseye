import { createFileRoute } from "@tanstack/react-router";
import { FaqPolicies } from "@/components/storefront/faq-policies";
import { SiteShell } from "@/components/storefront/site-shell";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({ meta: [
    { title: "FAQ & Policies — KLAWSEYE" },
    { name: "description", content: "Preparation timelines, shipping, sizing and studio policies for KLAWSEYE handmade press-on nails." },
  ] }),
});

function FaqPage() {
  return <SiteShell><FaqPolicies /></SiteShell>;
}
