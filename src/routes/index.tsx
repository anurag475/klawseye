import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ReferenceScreen } from "@/components/storefront/reference-screen";
import { products } from "@/components/storefront/products";
import { BookingAndCustom } from "@/components/storefront/booking-and-custom";
type BagItem = { id: number; size: string; quantity: number };
export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ meta: [
    { title: "KLAWSEYE — Nails & Lashes | Delhi-NCR & Pan-India" },
    { name: "description", content: "Shop handmade luxury press-on nails, custom 3D nail art, and studio lashes. Your vision, your klaws. Prepaid pan-India shipping." },
    { property: "og:title", content: "KLAWSEYE — Klaws That Are Uniquely Yours" },
    { property: "og:description", content: "Discover reusable handmade press-ons, bespoke fantasy nails, and Delhi-NCR studio services." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { property: "og:image", content: "https://lh3.googleusercontent.com/aida-public/AB6AXuDehO8ctqqKbOVFHOTCKjUfppQIYHLBmSQVmXcYmcXkWVT7QIBbgNKXhIVYkCvjVZ-L7hkPuP_u4uhSv2tcsR6UXM9PSjKoleolEE5T8KVDjS3Rc21MT3wW6rZk43PjWAhdAprNGWLAzz73j1lHdofkc87MYHWNetB-oKSw4FgL7N5xjeRfz_bLeh_dS3OFHCX461eyi1MQH1FbpfyT0H21PlS0Egt7biVfyhm4wUOBLrOF_LMx4EO2Xw" },
    { name: "twitter:image", content: "https://lh3.googleusercontent.com/aida-public/AB6AXuDehO8ctqqKbOVFHOTCKjUfppQIYHLBmSQVmXcYmcXkWVT7QIBbgNKXhIVYkCvjVZ-L7hkPuP_u4uhSv2tcsR6UXM9PSjKoleolEE5T8KVDjS3Rc21MT3wW6rZk43PjWAhdAprNGWLAzz73j1lHdofkc87MYHWNetB-oKSw4FgL7N5xjeRfz_bLeh_dS3OFHCX461eyi1MQH1FbpfyT0H21PlS0Egt7biVfyhm4wUOBLrOF_LMx4EO2Xw" },
  ] }),
});
function Index() {
  const [filter, setFilter] = useState("ALL SETS");
  const [saved, setSaved] = useState<number[]>([]);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [sizes, setSizes] = useState<Record<number, string>>({});
  const [panel, setPanel] = useState("");
  const [query, setQuery] = useState("");
  const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
  function add(id: number) {
    const size = sizes[id] ?? (id === 6 || id === 8 || id === 10 ? "Size: M" : "Size: S");
    if (size === "Custom Sizing") { window.open("https://www.instagram.com/klawseye/", "_blank", "noopener,noreferrer"); return; }
    setBag(current => {
      const existing = current.find(item => item.id === id && item.size === size);
      return existing ? current.map(item => item === existing ? {...item, quantity: item.quantity + 1} : item) : [...current, {id, size, quantity: 1}];
    });
    setPanel("bag");
  }
  function changeQuantity(index: number, delta: number) {
    setBag(current => current.map((item, i) => i === index ? {...item, quantity: item.quantity + delta} : item).filter(item => item.quantity > 0));
  }
  function newsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    if (input?.value) window.location.href = `mailto:orders@klawseye.com?subject=Secret%20Drops%20Mailing%20List&body=${encodeURIComponent(`Please add ${input.value} to the KLAWSEYE gang list.`)}`;
  }
  const searchResults = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
  const total = bag.reduce((sum, item) => sum + (products.find(product => product.id === item.id)?.price ?? 0) * item.quantity, 0);
  return <>
    <ReferenceScreen extra={<BookingAndCustom />} filter={filter} saved={saved} bagCount={bag.reduce((sum, item) => sum + item.quantity, 0)} onFilter={setFilter} onAdd={add} onSave={id => setSaved(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id])} onSize={(id, size) => setSizes(current => ({...current, [id]: size}))} onPanel={setPanel} onNewsletter={newsletter} />
    <Dialog open={Boolean(panel)} onOpenChange={open => { if (!open) setPanel(""); }}>
      <DialogContent className="shop-modal">
        <DialogTitle>{panel === "bag" ? "YOUR BAG 🛍️" : panel === "search" ? "FIND YOUR KLAWS" : panel === "wishlist" ? "YOUR FAVOURITES ♡" : "ORDER DETAILS"}</DialogTitle>
        <DialogDescription>{panel === "bag" ? "Handmade with love. Prepaid & pan-India shipping." : panel === "search" ? "Handmade press-on collections" : panel === "wishlist" ? "Your saved handmade sets" : "KLAWSEYE shipping & studio policies"}</DialogDescription>
        {panel === "search" && <input className="shop-input" aria-label="Search collections" placeholder="Chrome, gingham, celestial…" value={query} onChange={event => setQuery(event.target.value)} autoFocus />}
        {(panel === "search" || panel === "wishlist") && <div>{(panel === "search" ? searchResults : products.filter(product => saved.includes(product.id))).map(product => <div className="bag-row" key={product.id}><img src={product.image} alt={product.name} /><div><h3>{product.name}</h3><p>{money(product.price)}</p></div><Button variant="ghost" size="icon" aria-label={`Add ${product.name} to bag`} onClick={() => add(product.id)}><ShoppingBag /></Button></div>)}{(panel === "wishlist" && saved.length === 0 || panel === "search" && searchResults.length === 0) && <div className="empty-bag"><Heart className="mx-auto mb-3" />{panel === "wishlist" ? "No favourites yet." : "No sets found."}</div>}</div>}
        {panel === "bag" && <>{bag.length === 0 ? <div className="empty-bag"><ShoppingBag className="mx-auto mb-3" />Your bag is waiting for its first set.</div> : <>{bag.map((item, index) => { const product = products.find(value => value.id === item.id); if (!product) return null; return <div className="bag-row" key={`${item.id}-${item.size}`}><img src={product.image} alt={product.name} /><div><h3>{product.name}</h3><p className="text-xs text-muted-foreground">{item.size}</p><p>{money(product.price)}</p><div className="flex items-center gap-2 mt-1"><Button size="icon" variant="ghost" aria-label={`Decrease ${product.name} quantity`} onClick={() => changeQuantity(index, -1)}><Minus /></Button><span>{item.quantity}</span><Button size="icon" variant="ghost" aria-label={`Increase ${product.name} quantity`} onClick={() => changeQuantity(index, 1)}><Plus /></Button></div></div><Button variant="ghost" size="icon" aria-label={`Remove ${product.name}`} onClick={() => setBag(current => current.filter((_, i) => i !== index))}><Trash2 /></Button></div>; })}<div className="bag-total"><span>Subtotal</span><span>{money(total)}</span></div><Button asChild variant="reference" size="reference" className="shop-action"><a href={`mailto:orders@klawseye.com?subject=KLAWSEYE%20Order&body=${encodeURIComponent(bag.map(item => `${products.find(product => product.id === item.id)?.name} — ${item.size} × ${item.quantity}`).join("\n") + `\nSubtotal: ${money(total)}\nPlease confirm shipping and payment details.`)}`}>REQUEST ORDER BY EMAIL ✨</a></Button><p className="text-xs text-muted-foreground">Shipping and payment confirmed by the studio before your order is placed.</p></>}<Button variant="outline" onClick={() => setPanel("")}>KEEP EXPLORING</Button></>}
        {panel === "policies" && <div className="space-y-4"><p>Prepaid orders only. Pan-India shipping is available.</p><p>Custom sets are handcrafted and dispatched in 3–5 working days.</p><p>Studio bookings require a prepaid advance. The exact address is sent after confirmation.</p><p>For shipping charges and hygiene or return questions, contact orders@klawseye.com before ordering.</p></div>}
      </DialogContent>
    </Dialog>
  </>;
}
