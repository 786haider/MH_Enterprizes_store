import { BrandCard } from "@/components/BrandCard";
import { getBrands } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({ title: "Brands", description: "Browse tiles, sanitary ware and fittings by brand at MH Enterprises.", path: "/brands" });
export default async function BrandsPage() {
  const brands = await getBrands();
  return <div className="container-x py-12"><h1 className="text-4xl sm:text-5xl">Brands</h1>
    {brands.length ? <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{brands.map((b) => <li key={b.id}><BrandCard brand={b} /></li>)}</ul> : <p className="mt-6 text-muted">No brands have been added yet.</p>}</div>;
}
