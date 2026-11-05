import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CustomStudioIntro } from "@/components/storefront/custom-studio";
import { CustomRequestForm } from "@/components/storefront/booking-and-custom";
import { describeDesign, type Design } from "@/components/storefront/nail-design";
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
  const [sentDesign, setSentDesign] = useState<{ design?: Design; brief: string; sent: number }>({ brief: "", sent: 0 });
  // `count` changes on every tap, so tapping the same look twice deals it again
  const [look, setLook] = useState({ id: "", count: 0 });
  const sendDesign = (design: Design) => {
    setSentDesign(current => ({ design, brief: describeDesign(design), sent: current.sent + 1 }));
    requestAnimationFrame(() => {
      document.getElementById("customise")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("custom-requirements")?.focus({ preventScroll: true });
    });
  };
  return <SiteShell><CustomStudioIntro onLook={id => setLook(current => ({ id, count: current.count + 1 }))} /><NailDesigner look={look} onUseDesign={sendDesign} /><CustomRequestForm brief={sentDesign.brief} sent={sentDesign.sent} design={sentDesign.design} /></SiteShell>;
}
