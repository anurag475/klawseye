import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CustomStudioIntro } from "@/components/storefront/custom-studio";
import { CustomRequestForm } from "@/components/storefront/booking-and-custom";
import { NailDesigner } from "@/components/storefront/nail-designer";
import { SiteShell } from "@/components/storefront/site-shell";

export const Route = createFileRoute("/custom")({
  component: CustomPage,
  head: () => ({ meta: [
    { title: "Custom Nail Sets — KLAWSEYE" },
    { name: "description", content: "Send your inspiration and get a fully bespoke, handmade press-on set sized to you." },
  ] }),
});

function CustomPage() {
  // `sent` changes on every send, so sending the same design twice still refills the form
  const [design, setDesign] = useState({ brief: "", sent: 0 });
  const sendDesign = (brief: string) => {
    setDesign(current => ({ brief, sent: current.sent + 1 }));
    requestAnimationFrame(() => {
      document.getElementById("customise")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("custom-requirements")?.focus({ preventScroll: true });
    });
  };
  return <SiteShell><CustomStudioIntro /><NailDesigner onUseDesign={sendDesign} /><CustomRequestForm brief={design.brief} sent={design.sent} /></SiteShell>;
}
