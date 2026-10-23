import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { getBrands, getCategories, getSitemapProducts } from "@/lib/queries";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, brands, cats] = await Promise.all([getSitemapProducts(), getBrands(), getCategories()]);
  const staticPaths = ["", "/products", "/tiles", "/sanitary-ware", "/bathroom-fittings", "/kitchen-products", "/brands", "/about", "/contact", "/privacy-policy", "/terms-and-conditions"];
  return [
    ...staticPaths.map((p) => ({ url: SITE_URL + p, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...cats.filter((c) => c.parent_id).map((c) => ({ url: `${SITE_URL}/products?category=${c.slug}`, priority: 0.6 })),
    ...brands.map((b) => ({ url: `${SITE_URL}/brands/${b.slug}`, priority: 0.5 })),
    ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, lastModified: p.updated_at, priority: 0.8 })),
  ];
}
