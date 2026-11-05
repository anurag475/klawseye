import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, ChevronRight, CreditCard, Instagram, Mail, MapPin, Menu, Recycle, Ruler, Scissors, Truck, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categories, formatPrice, preparationTime, productSlug, shippingCharge, sizingKit, wearsPerSet } from "./products";
import { shop, useShop } from "./shop-store";

const pages = [
  { to: "/custom", label: "CUSTOM SETS", hot: true },
  { to: "/studio", label: "STUDIO & BOOKING" },
  { to: "/about", label: "ABOUT US" },
  { to: "/faq", label: "FAQ & POLICIES" },
] as const;

// Morphs the header into a floating sticker capsule once scrolled, compacts it
// while scrolling down and restores it on the way back up (after 21st.dev's
// Morphing Scroll Navbar).
function useHeaderMorph() {
  const [state, setState] = useState({ floating: false, compact: false, progress: 0 });
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const delta = y - lastY;
      lastY = y;
      const floating = y > 40;
      const progress = max > 0 ? Math.min(1, y / max) : 0;
      setState(prev => ({ floating, progress, compact: floating && (delta > 4 || (delta >= -4 && prev.compact)) }));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);
  return state;
}

const sizingKitSlug = productSlug(sizingKit);

const announcements: { icon: LucideIcon; text: string; linkLabel?: string }[] = [
  { icon: Truck, text: `Pan-India shipping from ${formatPrice(shippingCharge)} · express available` },
  { icon: Ruler, text: `Sizing kits ${formatPrice(sizingKit.price)} · ready to ship`, linkLabel: "Shop kit" },
  { icon: Scissors, text: `Handmade to order in Delhi-NCR · ${preparationTime}` },
  { icon: Recycle, text: `Salon-grade press-ons, ${wearsPerSet} wears per set` },
  { icon: CreditCard, text: "Prepaid orders only" },
];

/** Slim utility bar: contact links either side, one rotating announcement in the middle. */
function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = announcements.length;
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex(i => (i + 1) % count), 4500);
    return () => window.clearInterval(timer);
  }, [paused, count]);
  const current = announcements[index]!;
  const Icon = current.icon;
  return (
<div className="announce-bar" role="region" aria-label="Store announcements" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
<div className="announce-inner">
<div className="announce-side">
<a href="https://www.instagram.com/klawseye/" target="_blank" rel="noopener noreferrer" className="announce-link"><Instagram aria-hidden="true" />{"@klawseye"}</a>
<span className="announce-sep" aria-hidden="true" />
<span className="announce-link"><MapPin aria-hidden="true" />{"Delhi-NCR studio"}</span>
</div>
<div className="announce-center">
<button type="button" className="announce-arrow" aria-label="Previous announcement" onClick={() => setIndex(i => (i - 1 + count) % count)}><ChevronLeft aria-hidden="true" /></button>
<p key={index} className="announce-message" aria-live="polite">
<Icon aria-hidden="true" className="announce-icon" />
<span>{current.text}</span>
{current.linkLabel && <Link to="/set/$slug" params={{ slug: sizingKitSlug }}>{current.linkLabel}</Link>}
</p>
<button type="button" className="announce-arrow" aria-label="Next announcement" onClick={() => setIndex(i => (i + 1) % count)}><ChevronRight aria-hidden="true" /></button>
</div>
<div className="announce-side announce-side-end">
<a href="mailto:orders@klawseye.com" className="announce-link"><Mail aria-hidden="true" />{"orders@klawseye.com"}</a>
</div>
</div>
</div>
  );
}

export function SiteHeader() {
  const bagCount = useShop().bag.reduce((sum, item) => sum + item.quantity, 0);
  const { floating, compact, progress } = useHeaderMorph();
  return <>
<AnnouncementBar />

<header className="site-header" data-floating={floating || undefined} data-compact={compact || undefined}>
<div className="site-header-shell">
<span aria-hidden="true" className="site-header-progress" style={{ transform: `scaleX(${progress})` }} />

<div className="flex items-center gap-2">
<Sheet>
<SheetTrigger asChild>
<Button aria-label="Open menu" className="site-icon-btn lg:hidden" variant="reference" size="reference"><Menu className="w-6 h-6" /></Button>
</SheetTrigger>
<SheetContent side="left" className="site-drawer bg-brandSoftWhite border-r-2 border-brandBlue w-[300px] overflow-y-auto">
<SheetTitle className="font-display text-brandBlue text-xl">{"MENU"}</SheetTitle>
<SheetDescription className="sr-only">{"Browse KLAWSEYE collections and pages"}</SheetDescription>
<nav aria-label="Mobile navigation" className="mt-6 space-y-6">
<div>
<p className="drawer-label">{"SHOP KLAWS"}</p>
<ul className="space-y-1">
<li><SheetClose asChild><Link to="/" hash="shop" className="drawer-link">{"All press-on sets"}</Link></SheetClose></li>
{categories.map(category => <li key={category.slug}><SheetClose asChild><Link to="/" hash={category.slug} className="drawer-link">{category.name}</Link></SheetClose></li>)}
<li><SheetClose asChild><Link to="/set/$slug" params={{ slug: sizingKitSlug }} className="drawer-link">{sizingKit.name}</Link></SheetClose></li>
</ul>
</div>
<div>
<p className="drawer-label">{"EXPLORE"}</p>
<ul className="space-y-1">
{pages.map(page => <li key={page.to}><SheetClose asChild><Link to={page.to} className="drawer-link" activeProps={{ className: "drawer-link-active" }}>{page.label}</Link></SheetClose></li>)}
</ul>
</div>
</nav>
</SheetContent>
</Sheet>

<Link className="site-logo" to="/" title="KLAWSEYE Homepage">
<img alt="KLAWSEYE nails & lashes" src="/WhatsApp Image 2026-10-13 at 3.32.28 PM.jpeg" />
</Link>
</div>

<nav aria-label="Main Navigation" className="site-nav hidden lg:flex">
<DropdownMenu modal={false}>
<DropdownMenuTrigger className="site-nav-link outline-none">{"SHOP KLAWS"}<ChevronDown className="site-nav-chevron" /></DropdownMenuTrigger>
<DropdownMenuContent align="start" className="site-dropdown">
<DropdownMenuItem asChild><Link to="/" hash="shop">{"All press-on sets"}</Link></DropdownMenuItem>
<DropdownMenuSeparator />
{categories.map(category => <DropdownMenuItem key={category.slug} asChild><Link to="/" hash={category.slug}>{category.name}</Link></DropdownMenuItem>)}
<DropdownMenuSeparator />
<DropdownMenuItem asChild><Link to="/set/$slug" params={{ slug: sizingKitSlug }}>{sizingKit.name}</Link></DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
{pages.map(page => <Link key={page.to} to={page.to} className="site-nav-link">{page.label}{"hot" in page && <span className="site-hot-tag">{"HOT"}</span>}</Link>)}
</nav>

<div className="flex items-center gap-1 sm:gap-2">

<Button aria-label="Search" className="site-icon-btn" onClick={() => shop.open("search")} variant="reference" size="reference">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65a7.5 7.5 0 010 10.7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
</svg>
</Button>

<Button aria-label="Wishlist" className="site-icon-btn site-icon-heart" onClick={() => shop.open("wishlist")} variant="reference" size="reference">
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
</svg>
</Button>

<Button aria-label={`Bag, ${bagCount} ${bagCount === 1 ? "item" : "items"}`} className="site-bag-btn" onClick={() => shop.open("bag")} variant="reference" size="reference">
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
</svg>
<span className="hidden sm:inline">{"BAG"}</span>
<span key={bagCount} className="site-bag-count" data-empty={bagCount === 0 || undefined}>{bagCount}</span>
</Button>
</div>
</div>
</header>
  </>;
}
