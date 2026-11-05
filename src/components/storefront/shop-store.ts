import { useSyncExternalStore } from "react";
import { products, sizeOptions, type Product, type ShippingId } from "./products";

const instagramUrl = "https://www.instagram.com/klawseye/";

/** Sets without a price, or with custom sizing, are ordered over Instagram rather than through the bag. */
const ordersByDm = (product: Product, size: string) => product.price === undefined || (!product.readyToShip && size === "Custom Sizing");

/** Button text for adding a set, so it's clear beforehand when the button leads to Instagram. */
export function addLabel(product: Product, size: string) {
  if (product.price === undefined) return "DM TO ORDER";
  return ordersByDm(product, size) ? "DM FOR SIZING" : "ADD TO BAG";
}

export type BagItem = { id: number; size: string; quantity: number };
export type Panel = "" | "bag" | "search" | "wishlist";
type ShopState = { saved: number[]; bag: BagItem[]; sizes: Record<number, string>; panel: Panel; shipping: ShippingId; withRemover: boolean };

// Shopping session shared by every page, so the bag survives client-side navigation.
const empty: ShopState = { saved: [], bag: [], sizes: {}, panel: "", shipping: "standard", withRemover: false };
let state = empty;
const listeners = new Set<() => void>();

function update(next: Partial<ShopState>) {
  state = { ...state, ...next };
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const defaultSize = sizeOptions[0];

export const shop = {
  snapshot: () => state,
  sizeOf: (id: number) => state.sizes[id] ?? defaultSize,
  setSize: (id: number, size: string) => update({ sizes: { ...state.sizes, [id]: size } }),
  open: (panel: Panel) => update({ panel }),
  setShipping: (shipping: ShippingId) => update({ shipping }),
  setWithRemover: (withRemover: boolean) => update({ withRemover }),
  toggleSaved: (id: number) => update({ saved: state.saved.includes(id) ? state.saved.filter(value => value !== id) : [...state.saved, id] }),
  add(id: number) {
    const product = products.find(value => value.id === id);
    if (!product) return;
    const size = product.readyToShip ? "" : shop.sizeOf(id);
    if (ordersByDm(product, size)) {
      window.open(instagramUrl, "_blank", "noopener,noreferrer");
      return;
    }
    const existing = state.bag.find(item => item.id === id && item.size === size);
    update({
      bag: existing ? state.bag.map(item => (item === existing ? { ...item, quantity: item.quantity + 1 } : item)) : [...state.bag, { id, size, quantity: 1 }],
      panel: "bag",
    });
  },
  changeQuantity: (index: number, delta: number) =>
    update({ bag: state.bag.map((item, i) => (i === index ? { ...item, quantity: item.quantity + delta } : item)).filter(item => item.quantity > 0) }),
  remove: (index: number) => update({ bag: state.bag.filter((_, i) => i !== index) }),
};

export function useShop() {
  return useSyncExternalStore(subscribe, () => state, () => empty);
}
