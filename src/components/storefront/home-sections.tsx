import { Link } from "@tanstack/react-router";
import { HeroMedia } from "./hero-media";
import { EraWord, HeroDeck } from "./hero-deck";
import { categories, preparationTime, preparationTimeBusy, setsInCategory, sizingKit, wearsPerSet } from "./products";
import { ProductCard } from "./product-card";
import { BouncyTitle, CategoryBar, KlawRoulette } from "./shop-interactions";

export function HomeHero() {
  return <>
<section className="hero-v2 relative overflow-hidden border-b-2 border-brandBlue" data-purpose="hero-editorial">
<span aria-hidden="true" className="hero-v2-watermark">{"KLAWSEYE"}</span>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
<div className="hero-v2-grid">

<div className="hero-v2-copy">
<div className="inline-flex items-center gap-2 bg-card border-2 border-brandBlue px-4 py-1 rounded-full shadow-sticker">
<span className="w-2.5 h-2.5 rounded-full bg-brandRose animate-pulse"></span>
<span className="font-body font-semibold text-xs uppercase text-brandBlue">{"Handmade press-ons & lashes · Delhi-NCR"}</span>
</div>
<h1 className="hero-title font-display text-brandBlue"><span>{"KLAWS THAT"}</span><span>{"ARE "}<span className="hero-scribble text-brandRose">{"UNIQUELY"}</span></span><span className="hero-indent">{"YOURS ✦"}</span></h1>
<p className="hero-v2-era font-handwritten">{"made for your "}<EraWord />{" era"}</p>
<p className="font-body text-lg text-copy max-w-lg leading-relaxed">{"Salon-quality reusable sets, hand-sculpted 3D art and fully custom orders, painted by hand for every version of you."}</p>

<div className="flex flex-wrap items-center gap-4">
<a className="hero-v2-cta" href="#shop"><span>{"SHOP THE KLAWS"}</span><span aria-hidden="true" className="hero-v2-cta-star">{"✦"}</span></a>
<Link className="hero-v2-cta-alt" to="/custom" hash="designer">{"DESIGN YOUR OWN"}</Link>
</div>

<ul className="hero-v2-perks">
<li><strong>{wearsPerSet}</strong><span>{"wears per set"}</span></li>
<li><strong>{preparationTime}</strong><span>{"handmade to order"}</span></li>
<li><strong>{"Pan-India"}</strong><span>{"prepaid shipping"}</span></li>
</ul>
</div>

<div className="hero-v2-media">
<HeroMedia fallback={<HeroDeck />} />
</div>

</div>
</div>
</section>

<section className="bg-brandBlush border-b-2 border-brandBlue py-3.5 overflow-hidden" data-purpose="marquee-ticker">
<div className="flex whitespace-nowrap animate-marquee font-display text-lg sm:text-xl text-brandBlue tracking-normal uppercase">
<span className="mx-4">{"YOUR NAILS, YOUR RULES ✦"}</span>
<span className="mx-4">{"MADE FOR EVERY VERSION OF YOU ✦"}</span>
<span className="mx-4">{"LITTLE DETAILS, BIG PERSONALITY ✦"}</span>
<span className="mx-4">{"100% REUSABLE PRESS-ONS ✦"}</span>
<span className="mx-4">{"HANDMADE WITH LOVE ✦"}</span>
<span className="mx-4">{"YOUR NAILS, YOUR RULES ✦"}</span>
<span className="mx-4">{"MADE FOR EVERY VERSION OF YOU ✦"}</span>
<span className="mx-4">{"LITTLE DETAILS, BIG PERSONALITY ✦"}</span>
<span className="mx-4">{"100% REUSABLE PRESS-ONS ✦"}</span>
<span className="mx-4">{"HANDMADE WITH LOVE ✦"}</span>
</div>
</section>
  </>;
}

export function ProductCatalogue() {
  return (
<section className="py-16 sm:py-20 bg-brandSoftWhite" data-purpose="shop-catalogue" id="shop">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="shop-intro text-center max-w-2xl mx-auto mb-8">
<span aria-hidden="true" className="shop-sparkle shop-sparkle-a">{"✦"}</span>
<span aria-hidden="true" className="shop-sparkle shop-sparkle-b">{"✧"}</span>
<span aria-hidden="true" className="shop-sparkle shop-sparkle-c">{"✦"}</span>
<span className="inline-block bg-brandBlush text-brandBlue font-body font-bold text-xs px-3.5 py-1 rounded-full border border-brandGingham uppercase mb-3">{"HANDMADE PRESS-ON SETS"}</span>
<BouncyTitle text="SHOP THE KLAWS" />
<p className="font-body text-copy mt-3 text-base">{"Every set is sculpted and painted by hand, just for you."}</p>
<p className="prep-note">{`✂ Made to order: please allow ${preparationTime} for preparation (${preparationTimeBusy} in busy periods) before your set ships. `}<Link to="/faq" hash="preparation">{"Read why"}</Link></p>
</div>

<KlawRoulette />

<CategoryBar />

{categories.map(category => {
  const items = setsInCategory(category.name);
  return (
<div key={category.slug} id={category.slug} className="category-block">
<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
<div>
<h3 className="font-display text-2xl sm:text-3xl text-brandBlue">{category.name}</h3>
<p className="font-body text-sm text-copy">{category.blurb}</p>
</div>
{items.length > 0 && <span className="font-handwritten text-brandRose font-bold">{`${items.length} ${items.length === 1 ? "set" : "sets"} ✦`}</span>}
</div>
{items.length > 0 ? (
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
{items.map(product => <ProductCard key={product.id} product={product} />)}
</div>
) : (
<div className="category-soon">
<p className="font-display text-brandBlue">{"NEW SETS LANDING SOON ✨"}</p>
<p className="font-body text-sm text-copy">{"Want something from this edit now? "}<Link to="/custom">{"Request a custom set"}</Link>{"."}</p>
</div>
)}
</div>
  );
})}

<div id="sizing-kit" className="category-block">
<div className="mb-6">
<h3 className="font-display text-2xl sm:text-3xl text-brandBlue">{"NOT SURE OF YOUR SIZE?"}</h3>
<p className="font-body text-sm text-copy">{"Sizing kits are ready to ship, so they skip the handmade preparation time."}</p>
</div>
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
<ProductCard product={sizingKit} />
</div>
</div>
</div>
</section>
  );
}
