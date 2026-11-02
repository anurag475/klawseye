import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { HeroMedia } from "./hero-media";
import { EraWord, HeroDeck } from "./hero-deck";
import { categories, formatPrice, preparationTime, preparationTimeBusy, products, sizeOptions, type Product } from "./products";
import { defaultSize, shop, useShop } from "./shop-store";
import { BouncyTitle, CategoryBar, KlawRoulette, tiltHandlers } from "./shop-interactions";

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
<li><strong>{"5+"}</strong><span>{"wears per set"}</span></li>
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

function ProductCard({ product }: { product: Product }) {
  const { saved, sizes } = useShop();
  const isSaved = saved.includes(product.id);
  return (
<article className="product-card bg-card rounded-3xl p-3.5 border-3 border-brandBlue shadow-sticker group" data-product-card={product.id} {...tiltHandlers()}>
<span aria-hidden="true" className="product-gloss" />
<div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-brandBlush mb-4">
<img alt={`${product.name} press-on nail set`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={product.image} loading="lazy" />
{product.badge && <span className="absolute top-3 left-3 bg-card/95 text-brandBlue text-[11px] font-bold px-2.5 py-1 rounded-full border border-brandBlue">{product.badge}</span>}
</div>
<div className="flex justify-between items-start gap-3 mb-1">
<h4 className="font-display text-base text-brandBlue leading-tight">{product.name}</h4>
<span className="font-body font-bold text-sm text-brandBlue bg-brandBlush px-2.5 py-0.5 rounded-full whitespace-nowrap">{formatPrice(product.price)}</span>
</div>
<p className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[2rem]">{product.description}</p>
<div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-2">
<select aria-label={`Select nail size for ${product.name}`} className="product-size text-xs py-2 px-3 rounded-full border-2 border-brandBlue bg-card font-medium focus:ring-0 text-brandBlue" value={sizes[product.id] ?? defaultSize} onChange={event => shop.setSize(product.id, event.target.value)}>
{sizeOptions.map(option => <option key={option} value={option}>{option.replace(/ \(.*\)/, "")}</option>)}
</select>
<Button className="flex-1 bg-brandBlue text-primary-foreground font-bold text-xs py-2.5 rounded-full hover:bg-brandRose transition-colors" onClick={() => shop.add(product.id)} variant="reference" size="reference">{product.price === undefined ? "DM TO ORDER" : "ADD TO BAG"}</Button>
</div>
<Button variant="reference" size="reference" className="product-heart" aria-label={`Save ${product.name}`} aria-pressed={isSaved} onClick={() => shop.toggleSaved(product.id)}><span key={String(isSaved)} className="product-heart-icon">{isSaved ? "♥" : "♡"}</span>{isSaved && <span aria-hidden="true" className="product-heart-burst" />}</Button>
</article>
  );
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
  const items = products.filter(product => product.category === category.name || product.alsoIn?.includes(category.name));
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
</div>
</section>
  );
}
