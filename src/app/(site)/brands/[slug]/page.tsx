import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CatalogView } from "@/components/CatalogView";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getBrands, parseFilters } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
type P = { params: { slug: string }; searchParams: Record<string, string | string[] | undefined> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const b = (await getBrands()).find((x) => x.slug === params.slug);
  return b ? pageMeta({ title: `${b.name} Tiles & Sanitary Products`, description: `Browse ${b.name} products at MH Enterprises.`, path: `/brands/${b.slug}` }) : { title: "Brand not found" };
}
export default async function BrandPage({ params, searchParams }: P) {
  const b = (await getBrands()).find((x) => x.slug === params.slug);
  if (!b) notFound();
  return <div className="container-x py-10"><Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Brands", path: "/brands" }, { name: b.name }]} />
    <h1 className="mt-4 mb-8 text-4xl sm:text-5xl">{b.name}</h1><CatalogView filters={{ ...parseFilters(searchParams), brand: b.slug }} basePath={`/brands/${b.slug}`} /></div>;
}
