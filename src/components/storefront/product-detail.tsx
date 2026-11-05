import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, PackageCheck, Recycle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ProductCard } from "./product-card";
import { categories, formatPrice, preparationTime, preparationTimeBusy, productSlug, setsInCategory, shippingCharge, sizeOptions, sizingKit, wearsPerSet, type Product } from "./products";
import { addLabel, defaultSize, shop, useShop } from "./shop-store";

type Slide = { src: string; kind: "photo" | "zoom" | "real"; alt: string; label: string };

/** Studio photo, then a close-up of the same photo, then any real-life photos of the set. */
function slidesFor(product: Product): Slide[] {
  if (product.readyToShip) return [{ src: product.image, kind: "photo", alt: product.name, label: product.name }];
  return [
    { src: product.image, kind: "photo", alt: `${product.name} press-on nail set`, label: "Full set" },
    { src: product.image, kind: "zoom", alt: `Close-up of the ${product.name} set`, label: "Close-up" },
    ...(product.realLifeImages ?? []).map((src, i): Slide => ({ src, kind: "real", alt: `${product.name} worn by a client`, label: `On real hands ${i + 1}` })),
  ];
}

function ProductGallery({ product }: { product: Product }) {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const slides = slidesFor(product);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActive(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api]);

  return (
<div className="product-gallery">
<Carousel setApi={setApi} opts={{ loop: true }} aria-label={`Photos of ${product.name}`}>
<CarouselContent className="ml-0">
{slides.map((slide, index) => (
<CarouselItem key={`${slide.kind}-${slide.src}`} className="pl-0">
<div className="product-slide" data-kind={slide.kind}>
<img src={slide.src} alt={slide.alt} style={slide.kind === "zoom" ? { transformOrigin: product.zoomFocus ?? "center" } : undefined} loading={index === 0 ? "eager" : "lazy"} />
</div>
</CarouselItem>
))}
</CarouselContent>
{slides.length > 1 && <>
<button type="button" className="product-gallery-arrow is-prev" aria-label="Previous photo" onClick={() => api?.scrollPrev()}><ChevronLeft className="w-5 h-5" /></button>
<button type="button" className="product-gallery-arrow is-next" aria-label="Next photo" onClick={() => api?.scrollNext()}><ChevronRight className="w-5 h-5" /></button>
<span className="product-gallery-count" aria-live="polite">{`${slides[active]?.label} · ${active + 1} / ${slides.length}`}</span>
</>}
</Carousel>
{slides.length > 1 && <div className="product-thumbs">
{slides.map((slide, index) => (
<button key={`${slide.kind}-${slide.src}`} type="button" className="product-thumb product-slide" data-kind={slide.kind} aria-label={`Show ${slide.label}`} aria-current={index === active || undefined} onClick={() => api?.scrollTo(index)}>
<img src={slide.src} alt="" style={slide.kind === "zoom" ? { transformOrigin: product.zoomFocus ?? "center" } : undefined} loading="lazy" />
</button>
))}
</div>}
</div>
  );
}

/** Full page for one set: gallery, sizing, adding to the bag and what to expect from the order. */
export function ProductDetail({ product }: { product: Product }) {
  const { saved, sizes } = useShop();
  const size = sizes[product.id] ?? defaultSize;
  const isSaved = saved.includes(product.id);
  const category = categories.find(value => value.name === product.category);
  const related = product.category ? setsInCategory(product.category).filter(value => value.id !== product.id).slice(0, 4) : [];

  return <>
<section className="product-page py-10 sm:py-14 bg-brandSoftWhite" data-purpose="product-detail">
<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
<Link to="/" hash={category?.slug ?? "shop"} className="product-back"><ArrowLeft className="w-4 h-4" />{category ? `Back to ${category.name}` : "Back to the shop"}</Link>

<div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start mt-5">
<ProductGallery product={product} />

<div className="product-info">
{category && <p className="font-handwritten text-brandRose font-bold text-lg">{category.name.toLowerCase()}</p>}
<h1 className="font-display text-3xl sm:text-4xl text-brandBlue leading-tight">{product.name}</h1>
<p className="product-price">{formatPrice(product.price)}</p>
<p className="font-body text-copy leading-relaxed">{product.description}</p>

{!product.readyToShip && <label className="block font-semibold text-sm text-brandBlue">{"Choose your size"}
<select className="shop-input mt-2" value={size} onChange={event => shop.setSize(product.id, event.target.value)}>
{sizeOptions.map(option => <option key={option} value={option}>{option}</option>)}
</select>
</label>}
{!product.readyToShip && <p className="text-xs text-muted-foreground">{"Not sure? "}<Link to="/set/$slug" params={{ slug: productSlug(sizingKit) }} className="font-bold text-brandRose underline">{`Get a sizing kit (${formatPrice(sizingKit.price)})`}</Link>{" or read the "}<Link to="/faq" hash="sizing" className="font-bold text-brandRose underline">{"size guide"}</Link>{"."}</p>}

<div className="flex items-center gap-3">
<Button variant="reference" size="reference" className="product-add" onClick={() => shop.add(product.id)}>{addLabel(product, size)}</Button>
<Button variant="reference" size="reference" className="product-save" aria-label={`Save ${product.name}`} aria-pressed={isSaved} onClick={() => shop.toggleSaved(product.id)}>{isSaved ? "♥" : "♡"}</Button>
</div>

<ul className="product-facts">
{product.readyToShip
  ? <li><PackageCheck aria-hidden="true" /><span><strong>{"Ready to ship"}</strong>{" No preparation time needed."}</span></li>
  : <>
<li><Clock aria-hidden="true" /><span><strong>{`${preparationTime} preparation`}</strong>{` Handmade to order, ${preparationTimeBusy} during busy periods.`}</span></li>
<li><Recycle aria-hidden="true" /><span><strong>{`${wearsPerSet} wears`}</strong>{" Expected from each set with gentle removal."}</span></li>
</>}
<li><Truck aria-hidden="true" /><span><strong>{`Shipping from ${formatPrice(shippingCharge)}`}</strong>{" Per order, pan-India. Express available at checkout."}</span></li>
</ul>
</div>
</div>
</div>
</section>

{related.length > 0 && category && <section className="py-12 bg-brandBlush border-t-2 border-brandBlue" data-purpose="product-related">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<h2 className="font-display text-2xl sm:text-3xl text-brandBlue mb-6">{`MORE FROM ${category.name}`}</h2>
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
{related.map(value => <ProductCard key={value.id} product={value} />)}
</div>
</div>
</section>}
  </>;
}
