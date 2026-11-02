import { preparationTime, preparationTimeBusy } from "./products";

export function CustomStudioIntro() {
  return <>
<section className="py-20 bg-brandSoftWhite relative overflow-hidden" data-purpose="custom-order-flow" id="custom-studio">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

<div className="lg:col-span-5 relative order-2 lg:order-1">
<div className="bg-card p-6 rounded-3xl border-3 border-brandBlue shadow-sticker-lg rotate-[-1deg]">
<div className="washi-tape-pink w-28 h-6 absolute -top-3 left-10"></div>
<div className="flex items-center justify-between border-b pb-3 mb-4">
<span className="font-display text-sm text-brandBlue">{"CUSTOM MOODBOARD KIT"}</span>
<span className="font-handwritten text-xs font-bold text-brandRose">{"Step-by-step guide"}</span>
</div>

<div className="space-y-4">
<div className="flex items-start gap-4 p-3 bg-secondary/60 rounded-xl border border-brandGingham/40">
<div className="w-8 h-8 rounded-full bg-brandBlue text-primary-foreground font-bold flex items-center justify-center text-sm flex-shrink-0">{"\n                    1\n                  "}</div>
<div >
<h5 className="font-bold text-sm text-brandBlue">{"Snap or Save Your Inspo"}</h5>
<p className="text-xs text-muted-foreground">{"Send us screenshots from Pinterest, TikTok, or our Instagram feed."}</p>
</div>
</div>
<div className="flex items-start gap-4 p-3 bg-secondary/60 rounded-xl border border-brandGingham/40">
<div className="w-8 h-8 rounded-full bg-brandBlue text-primary-foreground font-bold flex items-center justify-center text-sm flex-shrink-0">{"\n                    2\n                  "}</div>
<div >
<h5 className="font-bold text-sm text-brandBlue">{"Measure With Sizing Coin"}</h5>
<p className="text-xs text-muted-foreground">{"Place a 5-rupee coin next to your bare hand or order our ₹149 sizing kit."}</p>
</div>
</div>
<div className="flex items-start gap-4 p-3 bg-secondary/60 rounded-xl border border-brandGingham/40">
<div className="w-8 h-8 rounded-full bg-brandBlue text-primary-foreground font-bold flex items-center justify-center text-sm flex-shrink-0">{"\n                    3\n                  "}</div>
<div >
<h5 className="font-bold text-sm text-brandBlue">{"Pick Shape & Length"}</h5>
<p className="text-xs text-muted-foreground">{"Almond, coffin, square, stiletto or oval. "}<a href="#designer" className="font-bold text-brandRose underline">{"Try them in the designer ↓"}</a></p>
</div>
</div>
<div className="flex items-start gap-4 p-3 bg-secondary/60 rounded-xl border border-brandGingham/40">
<div className="w-8 h-8 rounded-full bg-brandBlue text-primary-foreground font-bold flex items-center justify-center text-sm flex-shrink-0">{"\n                    4\n                  "}</div>
<div >
<h5 className="font-bold text-sm text-brandBlue">{"Handmade to Order & Shipped Pan-India"}</h5>
<p className="text-xs text-muted-foreground">{`Crafted with certified UV gel formulas over ${preparationTime} (${preparationTimeBusy} in busy periods), then shipped.`}</p>
</div>
</div>
</div>

<div className="mt-4 pt-3 border-t text-center">
<span className="font-handwritten text-sm text-brandBlue font-bold">{"\n                  ✨ \"No generic factory molds. Ever.\" ✨\n                "}</span>
</div>
</div>
</div>

<div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
<span className="inline-block bg-brandBlush text-brandBlue font-body font-bold text-xs px-3.5 py-1 rounded-full border border-brandGingham uppercase tracking-normalst">{"\n              BESPOKE NAIL ARCHITECTURE\n            "}</span>
<h2 className="font-display text-3xl sm:text-5xl text-brandBlue leading-tight tracking-normal">{"\n              YOUR VISION. YOUR KLAWS.\n            "}</h2>
<p className="font-body text-lg text-copy leading-relaxed">{"\n              Saved an intricate look that no standard store sells? Whether it's metallic cyber charms, delicate cottagecore cherries, or gothic blood tears, we bring your wildest hand concepts into wearable art.\n            "}</p>
<div className="grid grid-cols-2 gap-4 pt-2">
<div className="bg-card p-4 rounded-2xl border-2 border-brandBlue shadow-sticker">
<span className="text-2xl">{"📏"}</span>
<h4 className="font-display text-sm text-brandBlue mt-2">{"PERFECT 1:1 FIT"}</h4>
<p className="font-body text-xs text-muted-foreground mt-1">{"Guaranteed fit from thumb to pinky with millimeter precision."}</p>
</div>
<div className="bg-card p-4 rounded-2xl border-2 border-brandBlue shadow-sticker">
<span className="text-2xl">{"✨"}</span>
<h4 className="font-display text-sm text-brandBlue mt-2">{"DURABLE BUILD"}</h4>
<p className="font-body text-xs text-muted-foreground mt-1">{"Layered salon builder gel that resists chipping and snaps."}</p>
</div>
</div>
<div className="pt-4 flex flex-wrap items-center gap-4">
<a className="inline-flex items-center gap-2 bg-brandBlue text-primary-foreground font-body font-bold text-sm px-8 py-3.5 rounded-full border-2 border-brandBlue shadow-sticker hover:bg-brandRose transition-all" href="https://www.instagram.com/klawseye/" rel="noopener noreferrer" target="_blank">
<span >{"DM TO CUSTOMISE ON INSTAGRAM"}</span>
<span >{"💬"}</span>
</a>
<span className="text-xs text-muted-foreground font-medium">{"Or email your inspo images to orders@klawseye.com"}</span>
</div>
</div>
</div>
</div>
</section>
  </>;
}
