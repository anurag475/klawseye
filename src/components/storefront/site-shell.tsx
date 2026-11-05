import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatPrice, nailRemover, orderCharges, prepDisclaimer, products, productSlug, shippingOptionOf, shippingOptions, type Product } from "./products";
import { shop, useShop } from "./shop-store";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

/** Product name and photo that lead to the product page, closing the dialog on the way. */
function ProductLink({ product, children }: { product: Product; children: ReactNode }) {
  return <Link to="/set/$slug" params={{ slug: productSlug(product) }} onClick={() => shop.open("")}>{children}</Link>;
}

function ShopDialog() {
  const { panel, bag, saved, shipping, withRemover } = useShop();
  const [query, setQuery] = useState("");
  const searchResults = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
  const productOf = (id: number) => products.find(product => product.id === id);
  const subtotal = bag.reduce((sum, item) => sum + (productOf(item.id)?.price ?? 0) * item.quantity, 0);
  const { shippingPrice, addOnPrice, total } = orderCharges(subtotal, shipping, withRemover);
  const chosenShipping = shippingOptionOf(shipping);
  const shippingName = `${chosenShipping.label}, ${chosenShipping.detail}`;
  const hasReadyToShip = bag.some(item => productOf(item.id)?.readyToShip);
  const hasHandmade = bag.some(item => !productOf(item.id)?.readyToShip);
  const listed = panel === "search" ? searchResults : products.filter(product => saved.includes(product.id));
  const orderBody = bag.map(item => `${productOf(item.id)?.name}${item.size ? ` — ${item.size}` : ""} × ${item.quantity}`).join("\n") + `\nSubtotal: ${money(subtotal)}${withRemover ? `\nAdd-on, ${nailRemover.name}: ${money(addOnPrice)}` : ""}\n${shippingName}: ${money(shippingPrice)}\nTotal: ${money(total)}\nPlease confirm payment details.`;

  return (
    <Dialog open={Boolean(panel)} onOpenChange={open => { if (!open) shop.open(""); }}>
      <DialogContent className="shop-modal">
        <DialogTitle>{panel === "bag" ? "YOUR BAG 🛍️" : panel === "search" ? "FIND YOUR KLAWS" : "YOUR FAVOURITES ♡"}</DialogTitle>
        <DialogDescription>{panel === "bag" ? "Handmade to order. Prepaid & pan-India shipping." : panel === "search" ? "Handmade press-on collections" : "Your saved handmade sets"}</DialogDescription>
        {panel === "search" && <input className="shop-input" aria-label="Search collections" placeholder="Chrome, gingham, celestial…" value={query} onChange={event => setQuery(event.target.value)} autoFocus />}
        {(panel === "search" || panel === "wishlist") && <div>
          {listed.map(product => <div className="bag-row" key={product.id}><ProductLink product={product}><img src={product.image} alt={product.name} /></ProductLink><div><h3><ProductLink product={product}>{product.name}</ProductLink></h3><p>{formatPrice(product.price)}</p></div><Button variant="ghost" size="icon" aria-label={`Add ${product.name} to bag`} onClick={() => shop.add(product.id)}><ShoppingBag /></Button></div>)}
          {listed.length === 0 && <div className="empty-bag"><Heart className="mx-auto mb-3" />{panel === "wishlist" ? "No favourites yet." : "No sets found."}</div>}
        </div>}
        {panel === "bag" && <>
          {bag.length === 0 ? <div className="empty-bag"><ShoppingBag className="mx-auto mb-3" />Your bag is waiting for its first set.</div> : <>
            {bag.map((item, index) => {
              const product = products.find(value => value.id === item.id);
              if (!product) return null;
              return <div className="bag-row" key={`${item.id}-${item.size}`}><ProductLink product={product}><img src={product.image} alt={product.name} /></ProductLink><div><h3><ProductLink product={product}>{product.name}</ProductLink></h3>{item.size && <p className="text-xs text-muted-foreground">{item.size}</p>}<p>{formatPrice(product.price)}</p><div className="flex items-center gap-2 mt-1"><Button size="icon" variant="ghost" aria-label={`Decrease ${product.name} quantity`} onClick={() => shop.changeQuantity(index, -1)}><Minus /></Button><span>{item.quantity}</span><Button size="icon" variant="ghost" aria-label={`Increase ${product.name} quantity`} onClick={() => shop.changeQuantity(index, 1)}><Plus /></Button></div></div><Button variant="ghost" size="icon" aria-label={`Remove ${product.name}`} onClick={() => shop.remove(index)}><Trash2 /></Button></div>;
            })}
            <fieldset className="bag-options">
              <legend>Add-ons (optional)</legend>
              <label className="bag-option"><input type="checkbox" checked={withRemover} onChange={event => shop.setWithRemover(event.target.checked)} /><strong>{nailRemover.name}</strong><span className="bag-option-price">{money(nailRemover.price)}</span></label>
            </fieldset>
            <fieldset className="bag-options">
              <legend>Shipping</legend>
              {shippingOptions.map(option => <label className="bag-option" key={option.id}><input type="radio" name="bag-shipping" checked={shipping === option.id} onChange={() => shop.setShipping(option.id)} /><span><strong>{option.label}</strong><small>{option.detail}</small></span><span className="bag-option-price">{money(option.price)}</span></label>)}
            </fieldset>
            <div className="bag-line"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            {withRemover && <div className="bag-line"><span>{nailRemover.name}</span><span>{money(addOnPrice)}</span></div>}
            <div className="bag-line"><span>{shippingName}</span><span>{money(shippingPrice)}</span></div>
            <div className="bag-total"><span>Total</span><span>{money(total)}</span></div>
            {hasHandmade && <p className="prep-note !mt-0">{`✂ ${prepDisclaimer}`}</p>}
            {hasReadyToShip && <p className="prep-note !mt-0">{"📏 Sizing kits are ready to ship and don't need preparation time."}</p>}
            <Button asChild variant="reference" size="reference" className="shop-action"><a href={`mailto:orders@klawseye.com?subject=KLAWSEYE%20Order&body=${encodeURIComponent(orderBody)}`}>REQUEST ORDER BY EMAIL ✨</a></Button>
            <p className="text-xs text-muted-foreground">Payment confirmed by the studio before your order is placed.</p>
          </>}
          <Button variant="outline" onClick={() => shop.open("")}>KEEP EXPLORING</Button>
        </>}
      </DialogContent>
    </Dialog>
  );
}

function useScrollReveal(pathname: string) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const tag = (selector: string, cls: string, stagger = 0) => document.querySelectorAll<HTMLElement>(selector).forEach((el, i) => { el.classList.add(cls); if (stagger) el.style.transitionDelay = `${(i % 4) * stagger}ms`; });
    tag("section[data-purpose]:not([data-purpose='hero-editorial']) h2", "reveal-up");
    tag("[data-product-card], [data-purpose='community-reviews'] .grid > *, .client-wall > li", "reveal-up", 80);
    tag("[data-purpose='in-studio-services'] img", "reveal-mask");
    tag("#custom-studio .grid > *, [data-purpose='in-studio-services'] .grid > *", "reveal-up", 120);
    root.classList.add("motion-on");
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal-up:not(.is-in), .reveal-pop:not(.is-in), .reveal-mask:not(.is-in)").forEach(el => io.observe(el));
    let frame = 0;
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => root.style.setProperty("--hero-scroll", String(Math.min(window.scrollY, 800)))); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); root.classList.remove("motion-on"); };
  }, [pathname]);
}

// Scrolls to #hash targets once any open menu has released its scroll lock.
function useHashScroll(pathname: string, hash: string) {
  useEffect(() => {
    if (!hash) return;
    let frame = 0;
    const started = performance.now();
    const tick = () => {
      const target = document.getElementById(hash);
      const locked = document.body.hasAttribute("data-scroll-locked");
      if (target && !locked) target.scrollIntoView({ block: "start" });
      else if (performance.now() - started < 1500) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
}

/** Header, footer and bag dialog shared by every storefront page. */
export function SiteShell({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  useScrollReveal(pathname);
  useHashScroll(pathname, hash);
  return (
    <div className="reference-screen">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <ShopDialog />
    </div>
  );
}
