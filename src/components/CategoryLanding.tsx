import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogView } from "./CatalogView";
import { Breadcrumbs } from "./Breadcrumbs";
import { MAIN_CATEGORY_PAGES } from "@/lib/config";
import { getCategories, parseFilters } from "@/lib/queries";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export function categoryMetadata(slug: string) {
  const c = MAIN_CATEGORY_PAGES[slug];
  return pageMeta({ title: `${c.title} — Shop Online & Inquire`, description: c.blurb + " Browse the full range at MH Enterprises.", path: `/${slug}` });
}
export async function CategoryLanding({ slug, searchParams }: { slug: string; searchParams: Record<string, string | string[] | undefined> }) {
  const meta = MAIN_CATEGORY_PAGES[slug];
  const cats = await getCategories();
  const main = cats.find((c) => c.slug === slug);
  if (!meta) notFound();
  const filters = { ...parseFilters(searchParams), category: slug };
  const subs = main ? cats.filter((c) => c.parent_id === main.id) : [];
  return (
    <div className="container-x py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: "Home", path: "/" }, { name: meta.title, path: `/${slug}` }])) }} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: meta.title }]} />
      <section className="mt-4 mb-8 border-l-2 border-gold bg-paper px-6 py-8"><h1 className="text-4xl sm:text-5xl">{meta.title}</h1><p className="mt-2 max-w-xl text-muted">{meta.blurb}</p>
        {subs.length > 0 && <ul className="mt-4 flex flex-wrap gap-2">{subs.map((s) => <li key={s.id}><Link href={`/products?category=${s.slug}`} className="inline-block border border-line bg-white px-3 py-1.5 text-sm hover:border-gold">{s.name}</Link></li>)}</ul>}
      </section>
      <CatalogView filters={filters} basePath={`/${slug}`} />
    </div>
  );
}
