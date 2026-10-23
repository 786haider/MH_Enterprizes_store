import Link from "next/link";
import type { Product, Settings } from "@/types";
import { ProductCard } from "./ProductCard";
export function ProductGrid({ products, settings }: { products: Product[]; settings: Settings }) {
  if (!products.length) return (
    <div className="border border-dashed border-line p-10 text-center"><h2 className="text-2xl">No products match your search</h2><p className="mt-2 text-muted">Try fewer words or remove a filter.</p><Link href="/products" className="btn-gold mt-5">Clear all filters</Link></div>
  );
  return <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 xl:grid-cols-3">{products.map((p) => <ProductCard key={p.id} product={p} settings={settings} />)}</div>;
}
export function GridSkeleton({ n = 6 }: { n?: number }) {
  return <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading products">{Array.from({ length: n }).map((_, i) => <div key={i} className="border border-line p-4"><div className="skeleton aspect-square" /><div className="skeleton mt-4 h-4 w-2/3" /><div className="skeleton mt-2 h-4 w-1/2" /></div>)}</div>;
}
