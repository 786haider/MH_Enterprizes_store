import { Suspense } from "react";
import type { ProductFilters as F } from "@/types";
import { PAGE_SIZE } from "@/types";
import { getBrands, getCategories, getFacets, getProducts, getSettings } from "@/lib/queries";
import { ProductFilters } from "./ProductFilters";
import { GridSkeleton, ProductGrid } from "./ProductGrid";
import { Pagination } from "./Pagination";

async function Results({ filters, basePath }: { filters: F; basePath: string }) {
  const [{ products, total, pages }, settings] = await Promise.all([getProducts(filters), getSettings()]);
  const page = Math.min(filters.page ?? 1, pages);
  const params = Object.fromEntries(Object.entries(filters).map(([k, v]) => [k, v == null ? undefined : String(v)]));
  return (<>
    <p className="mb-4 text-sm text-muted" aria-live="polite">{total === 0 ? "No products found" : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total} products`}</p>
    <ProductGrid products={products} settings={settings} />
    <Pagination page={page} pages={pages} basePath={basePath} params={params} />
  </>);
}
export async function CatalogView({ filters, basePath }: { filters: F; basePath: string }) {
  const [categories, brands, facets] = await Promise.all([getCategories(), getBrands(), getFacets()]);
  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside><ProductFilters basePath={basePath} filters={filters} categories={categories} brands={brands} facets={facets} /></aside>
      <div><Suspense key={JSON.stringify(filters)} fallback={<GridSkeleton />}><Results filters={filters} basePath={basePath} /></Suspense></div>
    </div>
  );
}
