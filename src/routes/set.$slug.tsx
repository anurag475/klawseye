import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductDetail } from "@/components/storefront/product-detail";
import { findProductBySlug, formatPrice } from "@/components/storefront/products";
import { SiteShell } from "@/components/storefront/site-shell";

export const Route = createFileRoute("/set/$slug")({
  loader: ({ params }) => {
    const product = findProductBySlug(params.slug);
    if (!product) throw notFound();
    return product;
  },
  component: SetPage,
  head: ({ loaderData: product }) => ({
    meta: product
      ? [
          { title: `${product.name} — KLAWSEYE` },
          { name: "description", content: `${product.description} ${formatPrice(product.price)}.` },
          { property: "og:title", content: `${product.name} — KLAWSEYE` },
          { property: "og:description", content: product.description },
          { property: "og:image", content: product.image },
        ]
      : [],
  }),
});

function SetPage() {
  const product = Route.useLoaderData();
  return <SiteShell><ProductDetail key={product.id} product={product} /></SiteShell>;
}
