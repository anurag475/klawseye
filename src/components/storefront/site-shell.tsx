import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatPrice, preparationTime, preparationTimeBusy, products } from "./products";
import { shop, useShop } from "./shop-store";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function ShopDialog() {
  const { panel, bag, saved } = useShop();
  const [query, setQuery] = useState("");
  const searchResults = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
  const total = bag.reduce((sum, item) => sum + (products.find(product => product.id === item.id)?.price ?? 0) * item.quantity, 0);
  const listed = panel === "search" ? searchResults : products.filter(product => saved.includes(product.id));
  const orderBody = bag.map(item => `${products.find(product => product.id === item.id)?.name} — ${item.size} × ${item.quantity}`).join("\n") + `\nSubtotal: ${money(total)}\nPlease confirm shipping and payment details.`;

  return (
    <Dialog open={Boolean(panel)} onOpenChange={open => { if (!open) shop.open(""); }}>
      <DialogContent className="shop-modal">
        <DialogTitle>{panel === "bag" ? "YOUR BAG 🛍️" : panel === "search" ? "FIND YOUR KLAWS" : "YOUR FAVOURITES ♡"}</DialogTitle>
        <DialogDescription>{panel === "bag" ? "Handmade to order. Prepaid & pan-India shipping." : panel === "search" ? "Handmade press-on collections" : "Your saved handmade sets"}</DialogDescription>
        {panel === "search" && <input className="shop-input" aria-label="Search collections" placeholder="Chrome, gingham, celestial…" value={query} onChange={event => setQuery(event.target.value)} autoFocus />}
        {(panel === "search" || panel === "wishlist") && <div>
          {listed.map(product => <div className="bag-row" key={product.id}><img src={product.image} alt={product.name} /><div><h3>{product.name}</h3><p>{formatPrice(product.price)}</p></div><Button variant="ghost" size="icon" aria-label={`Add ${product.name} to bag`} onClick={() => shop.add(product.id)}><ShoppingBag /></Button></div>)}
          {listed.length === 0 && <div className="empty-bag"><Heart className="mx-auto mb-3" />{panel === "wishlist" ? "No favourites yet." : "No sets found."}</div>}
        </div>}
        {panel === "bag" && <>
          {bag.length === 0 ? <div className="empty-bag"><ShoppingBag className="mx-auto mb-3" />Your bag is waiting for its first set.</div> : <>
            {bag.map((item, index) => {
              const product = products.find(value => value.id === item.id);
              if (!product) return null;
              return <div className="bag-row" key={`${item.id}-${item.size}`}><img src={product.image} alt={product.name} /><div><h3>{product.name}</h3><p className="text-xs text-muted-foreground">{item.size}</p><p>{formatPrice(product.price)}</p><div className="flex items-center gap-2 mt-1"><Button size="icon" variant="ghost" aria-label={`Decrease ${product.name} quantity`} onClick={() => shop.changeQuantity(index, -1)}><Minus /></Button><span>{item.quantity}</span><Button size="icon" variant="ghost" aria-label={`Increase ${product.name} quantity`} onClick={() => shop.changeQuantity(index, 1)}><Plus /></Button></div></div><Button variant="ghost" size="icon" aria-label={`Remove ${product.name}`} onClick={() => shop.remove(index)}><Trash2 /></Button></div>;
            })}
            <div className="bag-total"><span>Subtotal</span><span>{money(total)}</span></div>
            <p className="prep-note !mt-0">{`✂ Each set is handmade to order: please allow ${preparationTime} (${preparationTimeBusy} in busy periods) before dispatch. Express shipping doesn't shorten preparation.`}</p>
            <Button asChild variant="reference" size="reference" className="shop-action"><a href={`mailto:orders@klawseye.com?subject=KLAWSEYE%20Order&body=${encodeURIComponent(orderBody)}`}>REQUEST ORDER BY EMAIL ✨</a></Button>
            <p className="text-xs text-muted-foreground">Shipping and payment confirmed by the studio before your order is placed.</p>
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
