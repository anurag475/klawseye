import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { charmOptions, shades } from "@/components/storefront/design-options";
import { findProductBySlug, nailRemover, orderCharges, prepDisclaimer, preparationTime, preparationTimeBusy, products, productSlug, sets, shippingCharge, shippingOptions, sizingKit, wearsPerSet } from "@/components/storefront/products";
import { addLabel, shop } from "@/components/storefront/shop-store";
import { routeTree } from "@/routeTree.gen";

describe("studio terms", () => {
  it("matches what the studio confirmed", () => {
    expect(preparationTime).toBe("2–4 weeks");
    expect(preparationTimeBusy).toBe("up to 5 weeks");
    expect(wearsPerSet).toBe("6+");
    expect(shippingCharge).toBe(85);
    expect(prepDisclaimer).toBe("Each set is handmade to order. Please allow 2–4 weeks for preparation before dispatch. During busy periods, this may extend to 5 weeks. Express shipping does not reduce the preparation time.");
  });
});

describe("checkout charges", () => {
  it("matches the prices the studio confirmed", () => {
    expect(nailRemover.price).toBe(150);
    expect(shippingOptions.map(option => [option.id, option.price])).toEqual([
      ["standard", 85],
      ["express-south", 450],
      ["express-north", 350],
    ]);
  });

  it("adds the chosen shipping and add-on to the total", () => {
    expect(orderCharges(1000, "standard", false).total).toBe(1085);
    expect(orderCharges(1000, "standard", true).total).toBe(1235);
    expect(orderCharges(1000, "express-south", false).total).toBe(1450);
    expect(orderCharges(1000, "express-north", true).total).toBe(1500);
  });

  it("starts on standard shipping with no add-on", () => {
    const { shipping, withRemover } = shop.snapshot();
    expect(shipping).toBe("standard");
    expect(withRemover).toBe(false);
  });
});

describe("product pages", () => {
  it("gives every product a unique address that finds it again", () => {
    const slugs = products.map(productSlug);
    expect(new Set(slugs).size).toBe(products.length);
    products.forEach(product => expect(findProductBySlug(productSlug(product))).toBe(product));
    expect(findProductBySlug("not-a-set")).toBeUndefined();
  });

  it("routes /set/:slug to the product page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/set/blue-nova").at(-1)?.routeId).toBe("/set/$slug");
  });
});

describe("sizing kit", () => {
  it("is sold as a ready-to-ship product, separate from the handmade sets", () => {
    expect(sizingKit.price).toBeGreaterThan(0);
    expect(sizingKit.readyToShip).toBe(true);
    expect(sets).not.toContain(sizingKit);
  });
});

describe("adding to the bag", () => {
  const set = sets.find(product => product.price !== undefined)!;
  const bagged = (id: number) => shop.snapshot().bag.filter(item => item.id === id);

  beforeEach(() => {
    shop.snapshot().bag.forEach(() => shop.remove(0));
    shop.setSize(set.id, "Size: M (16, 12, 13, 12, 9mm)");
  });

  it("adds a set with its chosen size", () => {
    shop.add(set.id);
    expect(bagged(set.id)).toEqual([{ id: set.id, size: "Size: M (16, 12, 13, 12, 9mm)", quantity: 1 }]);
  });

  it("adds the sizing kit without a size", () => {
    shop.add(sizingKit.id);
    expect(bagged(sizingKit.id)).toEqual([{ id: sizingKit.id, size: "", quantity: 1 }]);
  });

  it("sends custom sizing to Instagram and says so on the button", () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    shop.setSize(set.id, "Custom Sizing");
    expect(addLabel(set, "Custom Sizing")).toBe("DM FOR SIZING");
    shop.add(set.id);
    expect(open).toHaveBeenCalledOnce();
    expect(bagged(set.id)).toEqual([]);
    open.mockRestore();
  });
});

describe("designer options", () => {
  it("has shades in each family the studio offers", () => {
    expect(new Set(shades.map(shade => shade.family))).toEqual(new Set(["solid", "catEye", "jelly"]));
  });

  it("includes cross and star charms, each with something to show", () => {
    expect(charmOptions.map(charm => charm.id)).toEqual(expect.arrayContaining(["cross", "star"]));
    charmOptions.forEach(charm => expect(charm.image ?? charm.art).toBeTruthy());
  });
});
