import { createFileRoute } from "@tanstack/react-router";
import { ClientTestimonials } from "@/components/storefront/client-testimonials";
import { HomeHero, ProductCatalogue } from "@/components/storefront/home-sections";
import { SiteShell } from "@/components/storefront/site-shell";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ meta: [
    { title: "KLAWSEYE — Nails & Lashes | Delhi-NCR & Pan-India" },
    { name: "description", content: "Shop handmade luxury press-on nails, custom 3D nail art, and studio lashes. Your vision, your klaws. Prepaid pan-India shipping." },
    { property: "og:title", content: "KLAWSEYE — Klaws That Are Uniquely Yours" },
    { property: "og:description", content: "Discover reusable handmade press-ons, bespoke fantasy nails, and Delhi-NCR studio services." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { property: "og:image", content: "/WhatsApp Image 2026-10-13 at 1.39.19 PM.jpeg" },
    { name: "twitter:image", content: "/WhatsApp Image 2026-10-13 at 1.39.19 PM.jpeg" },
  ] }),
});

function Index() {
  return <SiteShell><HomeHero /><ClientTestimonials /><ProductCatalogue /></SiteShell>;
}
