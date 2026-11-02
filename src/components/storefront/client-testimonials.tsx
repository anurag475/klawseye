import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type Testimonial = {
  image: string;
  alt: string;
  /** Studio caption for the set in the photo. */
  set: string;
  /** Client's Instagram handle, once they've agreed to be featured. */
  client?: string;
  /** The client's own words. Only add real quotes, sent by the client. */
  quote?: string;
};

// Client photos from real KLAWSEYE wearers. Add `client` and `quote` as each client shares theirs.
const testimonials: Testimonial[] = [
  { image: "/clients/client-01.jpg", alt: "Client wearing yellow polka-dot French tips with hand-painted blueberries", set: "Blueberry polka French" },
  { image: "/clients/client-02.jpg", alt: "Client wearing red and blush ombré press-ons with 3D bows and gold stars", set: "Ruby bow ombré" },
  { image: "/clients/client-03.jpg", alt: "Client showing a mismatched set of butterflies, chrome stars and jelly swirls", set: "Garden party mix & match" },
  { image: "/clients/client-04.jpg", alt: "Client wearing monochrome chrome French tips with silver charms", set: "Silver noir chrome" },
  { image: "/clients/client-05.jpg", alt: "Client wearing a mismatched set with chrome swirls, blue stars on black and silver-wired red and pink nails", set: "Chrome candy mix" },
  { image: "/clients/client-06.jpg", alt: "Client wearing long nude stilettos with 3D pink petals, gold filigree and gemstones", set: "Petal & gold stilettos" },
  { image: "/clients/client-07.jpg", alt: "Client wearing cherry red cat-eye almonds with gold crosses, hearts and stars", set: "Cherry heart cat-eye" },
  { image: "/clients/client-08.jpg", alt: "Client wearing short playful nails in teal, mustard and navy with 3D flowers, stars and polka dots", set: "Sunny pop shorties" },
];

// Bulbs along a sagging wire, as [x%, y px] points.
const bulbs = Array.from({ length: 23 }, (_, i) => {
  const t = i / 22;
  return [2 + t * 96, 18 + Math.sin(t * Math.PI * 3) ** 2 * 34] as const;
});

/** String of warm fairy lights draped across the top of the wall. */
function FairyLights() {
  const wire = bulbs.map(([x, y], i) => `${i ? "L" : "M"}${x * 10} ${y - 6}`).join(" ");
  return (
<div className="client-love-lights" aria-hidden="true">
<svg viewBox="0 0 1000 70" preserveAspectRatio="none"><path d={wire} /></svg>
{bulbs.map(([x, y], i) => <span key={i} style={{ left: `${x}%`, top: y, animationDelay: `${(i * 0.37) % 2.4}s` }} />)}
</div>
  );
}

/** Wall of client polaroids; each one lifts on hover and opens full size on click. */
export function ClientTestimonials() {
  const [open, setOpen] = useState<number | null>(null);
  const count = testimonials.length;
  const step = (dir: 1 | -1) => setOpen(i => (i === null ? i : (i + dir + count) % count));
  const current = open === null ? null : testimonials[open]!;

  return (
<section className="client-love overflow-hidden" data-purpose="client-testimonials">
<FairyLights />

<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-24">
<div className="client-love-signs">
<div className="client-love-plaque" aria-hidden="true">
<span className="client-love-plaque-string" />
<img src="/WhatsApp Image 2026-10-13 at 3.32.28 PM.jpeg" alt="" />
</div>
<h2 className="client-love-neon">{"klaws in the wild"}</h2>
<p className="client-love-sub font-handwritten">{"real clients, real hands — tag @klawseye to land on our wall ♡"}</p>
</div>

<ul className="client-wall">
{testimonials.map((item, index) => (
<li key={item.image}>
<button type="button" className="client-polaroid" onClick={() => setOpen(index)} aria-label={`View ${item.set} full size`}>
<span aria-hidden="true" className={index % 3 === 1 ? "client-polaroid-pin" : "client-polaroid-tape"} />
<span className="client-polaroid-photo">
<img src={item.image} alt={item.alt} loading="lazy" />
<span aria-hidden="true" className="client-polaroid-zoom"><Expand className="w-4 h-4" /></span>
</span>
<span className="client-polaroid-caption">
<span className="font-handwritten">{item.set}</span>
{item.quote && <span className="client-polaroid-quote">{`“${item.quote}”`}</span>}
<span className="client-polaroid-client">{item.client ?? "KLAWSEYE client"}</span>
</span>
</button>
</li>
))}
</ul>
</div>
<div aria-hidden="true" className="client-love-baseboard" />

<Dialog open={open !== null} onOpenChange={value => { if (!value) setOpen(null); }}>
<DialogContent className="client-lightbox" onKeyDown={event => { if (event.key === "ArrowRight") step(1); if (event.key === "ArrowLeft") step(-1); }}>
{current && <>
<DialogTitle className="font-display text-brandBlue text-xl">{current.set}</DialogTitle>
<DialogDescription className="sr-only">{current.alt}</DialogDescription>
<img key={current.image} src={current.image} alt={current.alt} className="client-lightbox-img" />
{current.quote && <p className="font-body text-brandBlue">{`“${current.quote}”`}</p>}
<div className="flex items-center justify-between gap-3">
<Button variant="reference" size="reference" className="client-love-arrow" aria-label="Previous client photo" onClick={() => step(-1)}><ChevronLeft className="w-5 h-5" /></Button>
<span className="font-body font-bold text-sm text-copy">{`${current.client ?? "KLAWSEYE client"} · ${open! + 1} / ${count}`}</span>
<Button variant="reference" size="reference" className="client-love-arrow" aria-label="Next client photo" onClick={() => step(1)}><ChevronRight className="w-5 h-5" /></Button>
</div>
</>}
</DialogContent>
</Dialog>
</section>
  );
}
