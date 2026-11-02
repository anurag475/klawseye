import { useSyncExternalStore } from "react";
import { products, sizeOptions } from "./products";

export type BagItem = { id: number; size: string; quantity: number };
export type Panel = "" | "bag" | "search" | "wishlist";
type ShopState = { saved: number[]; bag: BagItem[]; sizes: Record<number, string>; panel: Panel };

// Shopping session shared by every page, so the bag survives client-side navigation.
const empty: ShopState = { saved: [], bag: [], sizes: {}, panel: "" };
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
  sizeOf: (id: number) => state.sizes[id] ?? defaultSize,
  setSize: (id: number, size: string) => update({ sizes: { ...state.sizes, [id]: size } }),
  open: (panel: Panel) => update({ panel }),
  toggleSaved: (id: number) => update({ saved: state.saved.includes(id) ? state.saved.filter(value => value !== id) : [...state.saved, id] }),
  add(id: number) {
    const size = shop.sizeOf(id);
    const unpriced = products.find(product => product.id === id)?.price === undefined;
    if (size === "Custom Sizing" || unpriced) {
      window.open("https://www.instagram.com/klawseye/", "_blank", "noopener,noreferrer");
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
