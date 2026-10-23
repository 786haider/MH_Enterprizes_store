import type { Metadata } from "next";
import type { Product, Settings } from "@/types";
import { SITE_URL } from "./config";
export function pageMeta(o: { title: string; description: string; path: string; noindex?: boolean; image?: string }): Metadata {
  return {
    title: o.title, description: o.description, alternates: { canonical: o.path },
    robots: o.noindex ? { index: false, follow: true } : undefined,
    openGraph: { title: o.title, description: o.description, url: o.path, type: "website", images: o.image ? [o.image] : ["/logo.png"] },
    twitter: { card: "summary_large_image", title: o.title, description: o.description },
  };
}
export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: SITE_URL + it.path })),
});
// Only emits values that are really stored — no invented ratings/reviews/offers.
export function productLd(p: Product) {
  const ld: Record<string, unknown> = { "@context": "https://schema.org", "@type": "Product", name: p.name, sku: p.sku, url: `${SITE_URL}/products/${p.slug}` };
  if (p.description) ld.description = p.description;
  if (p.images.length) ld.image = p.images.map((i) => i.url);
  if (p.brand) ld.brand = { "@type": "Brand", name: p.brand.name };
  if (p.color) ld.color = p.color;
  if (p.material) ld.material = p.material;
  const price = p.discount_price ?? p.price;
  if (price != null) {
    const availability = p.stock_status === "in_stock" || p.stock_status === "low_stock" ? "https://schema.org/InStock" : p.stock_status === "out_of_stock" ? "https://schema.org/OutOfStock" : p.stock_status === "on_order" ? "https://schema.org/BackOrder" : undefined;
    ld.offers = { "@type": "Offer", price, priceCurrency: "PKR", url: `${SITE_URL}/products/${p.slug}`, ...(availability ? { availability } : {}) };
  }
  return ld;
}
export function orgLd(s: Settings) {
  const ld: Record<string, unknown> = { "@context": "https://schema.org", "@type": "HomeAndConstructionBusiness", name: s.business_name, url: SITE_URL, logo: `${SITE_URL}/logo.png` };
  if (s.phone) ld.telephone = s.phone;
  if (s.email) ld.email = s.email;
  if (s.address) ld.address = { "@type": "PostalAddress", streetAddress: s.address, ...(s.city ? { addressLocality: s.city } : {}) };
  const same = [s.facebook, s.instagram].filter(Boolean);
  if (same.length) ld.sameAs = same;
  return ld;
}
