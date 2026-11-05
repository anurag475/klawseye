import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, products, productSlug } from "./products";
import { shop } from "./shop-store";

// Studio sets with real photos, in the order they're dealt.
const featured = [18, 17, 16, 14, 12, 13, 15, 11].map(id => products.find(product => product.id === id)!).filter(Boolean);

/** Fanned deck of the studio's newest sets: auto-shuffles, click or swipe to deal one forward. */
export function HeroDeck() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef<number | null>(null);
  const swiped = useRef(false);
  const navigate = useNavigate();
  const count = featured.length;
  const go = (dir: number) => setActive(i => (i + dir + count) % count);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive(i => (i + 1) % count), 3800);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  const onPointerDown = (event: PointerEvent) => { drag.current = event.clientX; };
  const onPointerUp = (event: PointerEvent) => {
    if (drag.current === null) return;
    const dx = event.clientX - drag.current;
    drag.current = null;
    swiped.current = Math.abs(dx) > 50;
    if (swiped.current) go(dx < 0 ? 1 : -1);
  };

  const current = featured[active]!;

  return (
<div className="hero-deck" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
<div className="hero-arch" aria-hidden="true" />
<span className="hero-deck-sticker hero-deck-sticker-a font-handwritten" aria-hidden="true">{"100% reusable ♡"}</span>
<span className="hero-deck-sticker hero-deck-sticker-b font-handwritten" aria-hidden="true">{"new drop ✦"}</span>

<div className="hero-deck-cards" role="group" aria-roledescription="carousel" aria-label="New studio sets" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
{featured.map((product, index) => {
  const offset = ((index - active + count + Math.floor(count / 2)) % count) - Math.floor(count / 2);
  const isActive = offset === 0;
  return (
<button
  key={product.id}
  type="button"
  className="hero-deck-card"
  data-active={isActive || undefined}
  style={{ "--offset": offset, "--abs": Math.abs(offset), zIndex: 10 - Math.abs(offset) } as CSSProperties}
  aria-label={isActive ? `${product.name}, ${formatPrice(product.price)}` : `Show ${product.name}`}
  aria-current={isActive || undefined}
  tabIndex={isActive ? 0 : -1}
  onClick={() => {
    // A swipe ends in a click on the same card; only a real click should open the set.
    if (swiped.current) { swiped.current = false; return; }
    if (isActive) void navigate({ to: "/set/$slug", params: { slug: productSlug(product) } });
    else setActive(index);
  }}
>
<img src={product.image} alt={`${product.name} press-on nail set`} draggable={false} loading={index < 2 ? "eager" : "lazy"} />
</button>
  );
})}
</div>

<div className="hero-deck-info" aria-live="polite">
<Button variant="reference" size="reference" className="hero-deck-arrow" aria-label="Previous set" onClick={() => go(-1)}><ChevronLeft className="w-5 h-5" /></Button>
<div key={current.id} className="hero-deck-label">
<Link to="/set/$slug" params={{ slug: productSlug(current) }} className="font-display text-brandBlue text-base leading-tight hover:text-brandRose">{current.name}</Link>
<span className="font-body text-xs text-copy">{`${current.category?.toLowerCase()} · ${formatPrice(current.price)}`}</span>
</div>
<Button variant="reference" size="reference" className="hero-deck-add" aria-label={`Add ${current.name} to bag`} onClick={() => shop.add(current.id)}><ShoppingBag className="w-4 h-4" /></Button>
<Button variant="reference" size="reference" className="hero-deck-arrow" aria-label="Next set" onClick={() => go(1)}><ChevronRight className="w-5 h-5" /></Button>
</div>
</div>
  );
}

const eras = ["chrome", "cottagecore", "y2k", "desi", "gothic", "main character"];

/** Cycling word in the hero tagline. */
export function EraWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex(i => (i + 1) % eras.length), 2200);
    return () => window.clearInterval(timer);
  }, []);
  return <span className="hero-era" aria-live="off"><span key={eras[index]} className="hero-era-word">{eras[index]}</span></span>;
}
