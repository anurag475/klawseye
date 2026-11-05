import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { formatPrice, productSlug, sizeOptions, type Product } from "./products";
import { addLabel, defaultSize, shop, useShop } from "./shop-store";
import { tiltHandlers } from "./shop-interactions";

export function ProductCard({ product }: { product: Product }) {
  const { saved, sizes } = useShop();
  const isSaved = saved.includes(product.id);
  const size = sizes[product.id] ?? defaultSize;
  const slug = productSlug(product);
  return (
<article className="product-card bg-card rounded-3xl p-3.5 border-3 border-brandBlue shadow-sticker group" data-product-card={product.id} {...tiltHandlers()}>
<span aria-hidden="true" className="product-gloss" />
<Link to="/set/$slug" params={{ slug }} className="relative block aspect-[4/5] rounded-2xl overflow-hidden bg-brandBlush mb-4" aria-label={`View ${product.name}`}>
<img alt={`${product.name} press-on nail set`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={product.image} loading="lazy" />
{product.badge && <span className="absolute top-3 left-3 bg-card/95 text-brandBlue text-[11px] font-bold px-2.5 py-1 rounded-full border border-brandBlue">{product.badge}</span>}
</Link>
<div className="flex justify-between items-start gap-3 mb-1">
<h4 className="font-display text-base text-brandBlue leading-tight"><Link to="/set/$slug" params={{ slug }} className="hover:text-brandRose transition-colors">{product.name}</Link></h4>
<span className="font-body font-bold text-sm text-brandBlue bg-brandBlush px-2.5 py-0.5 rounded-full whitespace-nowrap">{formatPrice(product.price)}</span>
</div>
<p className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[2rem]">{product.description}</p>
<div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-2">
{!product.readyToShip && <select aria-label={`Select nail size for ${product.name}`} className="product-size text-xs py-2 px-3 rounded-full border-2 border-brandBlue bg-card font-medium focus:ring-0 text-brandBlue" value={size} onChange={event => shop.setSize(product.id, event.target.value)}>
{sizeOptions.map(option => <option key={option} value={option}>{option.replace(/ \(.*\)/, "")}</option>)}
</select>}
<Button className="flex-1 bg-brandBlue text-primary-foreground font-bold text-xs py-2.5 rounded-full hover:bg-brandRose transition-colors" onClick={() => shop.add(product.id)} variant="reference" size="reference">{addLabel(product, size)}</Button>
</div>
<Button variant="reference" size="reference" className="product-heart" aria-label={`Save ${product.name}`} aria-pressed={isSaved} onClick={() => shop.toggleSaved(product.id)}><span key={String(isSaved)} className="product-heart-icon">{isSaved ? "♥" : "♡"}</span>{isSaved && <span aria-hidden="true" className="product-heart-burst" />}</Button>
</article>
  );
}
