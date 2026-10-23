import { CatalogView } from "@/components/CatalogView";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getCategories, parseFilters } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
type SP = { searchParams: Record<string, string | string[] | undefined> };

export async function generateMetadata({ searchParams }: SP): Promise<Metadata> {
  const f = parseFilters(searchParams);
  const cat = f.category ? (await getCategories()).find((c) => c.slug === f.category) : undefined;
  const filtered = Object.entries(f).some(([k, v]) => v && !["page", "sort", "category"].includes(k));
  const title = cat ? `${cat.name} — Tiles & Sanitary Products` : "All Products — Tiles, Sanitary Ware & Ceramics";
  return pageMeta({ title, description: cat ? `Browse ${cat.name.toLowerCase()} from MH Enterprises. Filter by brand, size, color and finish.` : "Browse tiles, ceramics, sanitary ware, bathroom fittings and kitchen products.", path: cat ? `/products?category=${cat.slug}` : "/products", noindex: filtered });
}
export default async function ProductsPage({ searchParams }: SP) {
  const filters = parseFilters(searchParams);
  const cat = filters.category ? (await getCategories()).find((c) => c.slug === filters.category) : undefined;
  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Products", path: cat ? "/products" : undefined }, ...(cat ? [{ name: cat.name }] : [])]} />
      <h1 className="mt-4 mb-8 text-4xl sm:text-5xl">{cat ? cat.name : "All products"}</h1>
      <CatalogView filters={filters} basePath="/products" />
    </div>
  );
}
