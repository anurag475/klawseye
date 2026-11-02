import { Fragment, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Shuffle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, formatPrice, products } from "./products";
import { shop } from "./shop-store";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Section title whose letters drop in one by one and jiggle under the pointer. */
export function BouncyTitle({ text }: { text: string }) {
  return (
<h2 className="shop-title font-display text-3xl sm:text-5xl text-brandBlue tracking-normal" aria-label={text}>
{text.split(" ").map((word, w, words) => <Fragment key={w}>
<span className="inline-block whitespace-nowrap" aria-hidden="true">
{[...word].map((letter, i) => <span key={i} className="shop-title-letter" style={{ "--i": words.slice(0, w).join("").length + i } as CSSProperties}>{letter}</span>)}
</span>
{w < words.length - 1 && " "}
</Fragment>)}
</h2>
  );
}

/** Pointer-following 3D tilt and polish gloss for product cards (fine pointers only). */
export function tiltHandlers() {
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || reducedMotion()) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
    card.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    card.style.setProperty("--gx", `${x * 100}%`);
    card.style.setProperty("--gy", `${y * 100}%`);
    card.dataset["tilting"] = "";
  };
  const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    card.style.removeProperty("--rx");
    card.style.removeProperty("--ry");
    delete card.dataset["tilting"];
  };
  return { onPointerMove, onPointerLeave };
}

/** Sticky category chips with a sliding pill that follows the category in view. */
export function CategoryBar() {
  const barRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState("");
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const blocks = categories.map(category => document.getElementById(category.slug)).filter((el): el is HTMLElement => Boolean(el));
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => visible.set(entry.target.id, entry.isIntersecting));
      setActive(blocks.find(block => visible.get(block.id))?.id ?? "");
    }, { rootMargin: "-160px 0px -55% 0px" });
    blocks.forEach(block => io.observe(block));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const bar = barRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-chip="${active || "all"}"]`);
    if (!bar || !chip) return;
    const place = () => setPill({ left: chip.offsetLeft, width: chip.offsetWidth });
    place();
    bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.offsetWidth / 2, behavior: reducedMotion() ? "auto" : "smooth" });
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
<nav ref={barRef} aria-label="Shop categories" className="category-bar">
{pill && <span aria-hidden="true" className="category-pill" style={{ translate: `${pill.left}px 0`, width: pill.width }} />}
<a href="#shop" data-chip="all" className="category-chip" aria-current={active === "" ? "true" : undefined}>{"ALL SETS"}</a>
{categories.map(category => <a key={category.slug} href={`#${category.slug}`} data-chip={category.slug} className="category-chip" aria-current={active === category.slug ? "true" : undefined}>{category.name}</a>)}
</nav>
  );
}

/** "Can't decide?" slot machine that shuffles through sets and lands on one. */
export function KlawRoulette() {
  const [index, setIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState(false);
  const timer = useRef(0);
  const product = products[index]!;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const spin = () => {
    if (spinning) return;
    const target = (index + 1 + Math.floor(Math.random() * (products.length - 1))) % products.length;
    setLanded(false);
    if (reducedMotion()) { setIndex(target); setLanded(true); return; }
    setSpinning(true);
    const steps = products.length * 2 + ((target - index + products.length) % products.length);
    let step = 0;
    const tick = () => {
      step += 1;
      setIndex(current => (current + 1) % products.length);
      if (step >= steps) { setSpinning(false); setLanded(true); return; }
      // ease out: each frame waits a little longer than the last
      timer.current = window.setTimeout(tick, 45 + Math.pow(step / steps, 3) * 260);
    };
    tick();
  };

  const viewSet = () => {
    const card = document.querySelector<HTMLElement>(`[data-product-card="${product.id}"]`);
    if (!card) return;
    card.scrollIntoView({ block: "center", behavior: reducedMotion() ? "auto" : "smooth" });
    card.classList.remove("is-spotlit");
    void card.offsetWidth;
    card.classList.add("is-spotlit");
  };

  return (
<div className="klaw-roulette" data-spinning={spinning || undefined} data-landed={landed || undefined}>
<div className="klaw-roulette-copy">
<p className="font-handwritten text-brandRose font-bold text-lg">{"can't decide? ✦"}</p>
<h3 className="font-display text-2xl sm:text-3xl text-brandBlue leading-tight">{"KLAW ROULETTE"}</h3>
<p className="font-body text-sm text-copy mt-1 mb-4">{"Spin the wheel and let the klaws pick your next set."}</p>
<div className="flex flex-wrap gap-2">
<Button onClick={spin} disabled={spinning} variant="reference" size="reference" className="klaw-roulette-spin"><Shuffle className="w-4 h-4" />{spinning ? "SPINNING…" : landed ? "SPIN AGAIN" : "SPIN FOR ME"}</Button>
{landed && <>
<Button onClick={() => shop.add(product.id)} variant="reference" size="reference" className="klaw-roulette-add">{product.price === undefined ? "DM TO ORDER" : "ADD TO BAG"}</Button>
<Button onClick={viewSet} variant="reference" size="reference" className="klaw-roulette-view">{"VIEW SET"}</Button>
</>}
</div>
</div>
<div className="klaw-roulette-window">
<img key={landed ? `landed-${product.id}` : undefined} src={product.image} alt={landed ? `${product.name} press-on nail set` : ""} />
{landed && <span className="klaw-roulette-stamp"><Sparkles className="w-3.5 h-3.5" />{"IT'S A MATCH"}</span>}
<div className="klaw-roulette-label" aria-live={spinning ? "off" : "polite"}>
<span className="font-display text-sm text-brandBlue leading-tight">{spinning || landed ? product.name : "WHO WILL IT BE?"}</span>
{landed && <span className="font-body font-bold text-xs text-brandRose">{formatPrice(product.price)}</span>}
</div>
</div>
</div>
  );
}
