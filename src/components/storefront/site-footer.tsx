import type { FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { categories } from "./products";

function newsletter(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const input = event.currentTarget.querySelector("input");
  if (input?.value) window.location.href = `mailto:orders@klawseye.com?subject=Secret%20Drops%20Mailing%20List&body=${encodeURIComponent(`Please add ${input.value} to the KLAWSEYE gang list.`)}`;
}

export function SiteFooter() {
  return <>
<footer className="bg-brandSoftWhite text-brandDark border-t-2 border-brandBlue pt-16 pb-12" data-purpose="page-footer">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-brandGingham">

<div className="md:col-span-4 space-y-4">
<Link className="inline-block" to="/">
<img alt="KLAWSEYE Logo" className="h-16 w-16 object-contain" src="/WhatsApp Image 2026-10-13 at 3.32.28 PM.jpeg" />
</Link>
<p className="font-body text-sm text-muted-foreground max-w-sm leading-relaxed">{"\n            Klaws that are uniquely yours. Certified Nail Tech crafting handmade luxury press-on sets, 3D fantasy nails, and wispy lashes in Delhi-NCR with pan-India delivery.\n          "}</p>
<div className="flex items-center gap-3 pt-2">
<a aria-label="Instagram" className="w-9 h-9 rounded-full bg-card border-2 border-brandBlue flex items-center justify-center text-brandBlue hover:bg-brandBlush shadow-sm transition-colors" href="https://www.instagram.com/klawseye/" rel="noopener noreferrer" target="_blank">
<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
</a>
<a aria-label="Pinterest" className="w-9 h-9 rounded-full bg-card border-2 border-brandBlue flex items-center justify-center text-brandBlue hover:bg-brandBlush shadow-sm transition-colors" href="https://pinterest.com" rel="noopener noreferrer" target="_blank">
<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"></path></svg>
</a>
</div>
</div>

<div className="md:col-span-2 space-y-3">
<p className="font-display text-sm text-brandBlue tracking-normal">{"SHOP"}</p>
<ul className="space-y-2 text-sm text-muted-foreground font-medium">
<li ><Link className="hover:text-brandRose transition-colors" to="/" hash="shop">{"All Press-On Sets"}</Link></li>
{categories.map(category => <li key={category.slug}><Link className="hover:text-brandRose transition-colors" to="/" hash={category.slug}>{category.name}</Link></li>)}
<li ><Link className="hover:text-brandRose transition-colors" to="/custom">{"Custom Sets"}</Link></li>
</ul>
</div>

<div className="md:col-span-3 space-y-3">
<p className="font-display text-sm text-brandBlue tracking-normal">{"STUDIO & POLICIES"}</p>
<ul className="space-y-2 text-sm text-muted-foreground font-medium">
<li ><Link className="hover:text-brandRose transition-colors" to="/studio">{"Delhi-NCR Studio Booking"}</Link></li>
<li ><Link className="hover:text-brandRose transition-colors" to="/faq" hash="preparation">{"Order Preparation Timeline"}</Link></li>
<li ><Link className="hover:text-brandRose transition-colors" to="/faq" hash="shipping">{"Prepaid Orders & Shipping"}</Link></li>
<li ><Link className="hover:text-brandRose transition-colors" to="/faq" hash="sizing">{"Measurement & Size Guide"}</Link></li>
<li ><Link className="hover:text-brandRose transition-colors" to="/about">{"About KLAWSEYE"}</Link></li>
</ul>
</div>

<div className="md:col-span-3 space-y-4">
<p className="font-display text-sm text-brandBlue tracking-normal">{"SECRET DROPS 🎀"}</p>
<p className="text-xs text-muted-foreground">{"Be first to access 48-hour vault releases and get 10% off your first handmade order."}</p>
<form className="space-y-2" onSubmit={newsletter}>
<input aria-label="Email for Secret Drops" className="w-full text-xs px-3.5 py-2.5 rounded-full border-2 border-brandBlue bg-card focus:outline-none focus:ring-0" placeholder="Enter your email" type="email" required />
<Button className="w-full bg-brandBlue text-primary-foreground font-bold text-xs py-2.5 rounded-full border-2 border-brandBlue shadow-sticker hover:bg-brandRose transition-all" type="submit" variant="reference" size="reference">{"\n              JOIN GANG LIST ✨\n            "}</Button>
</form>
</div>
</div>

<div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
<p >{"© 2026 KLAWSEYE by Tea. All Rights Reserved. Delhi-NCR, India."}</p>
<p className="font-handwritten text-sm text-brandBlue font-bold">{"\n          Designed with attitude for the #KLAWEDGANG 💅✨\n        "}</p>
</div>
</div>
</footer>
  </>;
}
