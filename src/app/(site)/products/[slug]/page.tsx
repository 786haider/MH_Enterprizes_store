import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelated, getSettings, getSimilar } from "@/lib/queries";
import { breadcrumbLd, pageMeta, productLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import { formatPrice } from "@/lib/utils";
import { STOCK_LABEL } from "@/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductSpecifications } from "@/components/ProductSpecifications";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CopyLink } from "@/components/CopyLink";
import { ProductGrid } from "@/components/ProductGrid";
import { RecentlyViewed } from "@/components/RecentlyViewed";

type P = { params: { slug: string } };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { product: p } = await getProductBySlug(params.slug);
  if (!p) return { title: "Product not found", robots: { index: false } };
  return pageMeta({ title: p.seo_title || `${p.name}${p.brand ? ` by ${p.brand.name}` : ""}`, description: p.seo_description || p.description?.slice(0, 155) || `${p.name} available at MH Enterprises. Contact us for price and availability.`, path: `/products/${p.slug}`, image: p.images[0]?.url });
}
export default async function ProductPage({ params }: P) {
  const { product: p, redirectTo } = await getProductBySlug(params.slug);
  if (redirectTo) permanentRedirect(`/products/${redirectTo}`);
  if (!p) notFound();
  const [settings, related, similar] = await Promise.all([getSettings(), getRelated(p), getSimilar(p)]);
  const relatedIds = new Set(related.map((r) => r.id));
  const similarOnly = similar.filter((s) => !relatedIds.has(s.id));
  const crumbs = [{ name: "Home", path: "/" }, { name: "Products", path: "/products" },
    ...(p.category ? [{ name: p.category.name, path: `/${p.category.slug}` }] : []), { name: p.name, path: `/products/${p.slug}` }];
  const price = p.discount_price ?? p.price;
  return (
    <div className="container-x py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([productLd(p), breadcrumbLd(crumbs)]) }} />
      <Breadcrumbs items={crumbs.map((c, i) => (i === crumbs.length - 1 ? { name: c.name } : c))} />
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={p.images} name={p.name} />
        <div>
          {p.brand && <Link href={`/brands/${p.brand.slug}`} className="text-sm font-medium text-gold-dark hover:underline">{p.brand.name}</Link>}
          <h1 className="mt-1 text-4xl sm:text-5xl">{p.name}</h1>
          <p className="mt-2 text-sm text-muted">SKU: {p.sku}{p.manufacturer ? ` · ${p.manufacturer}` : ""}</p>
          <div className="mt-5 border-y border-line py-4">
            {price != null ? <p className="text-3xl font-semibold text-navy">PKR {formatPrice(price)}{p.price_unit && <span className="text-base font-normal text-muted"> / {p.price_unit}</span>}{p.discount_price != null && p.price != null && <s className="ml-3 text-lg font-normal text-muted">{formatPrice(p.price)}</s>}</p> : <p className="text-lg text-navy">Contact us for the latest price.</p>}
            {p.stock_status && <p className="mt-1 text-sm text-muted">{STOCK_LABEL[p.stock_status]}</p>}
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {([["Size", p.size], ["Color", p.color], ["Finish", p.finish], ["Material", p.material], ["Quality / grade", p.grade]] as const).filter(([, v]) => v).map(([k, v]) => <div key={k}><dt className="text-muted">{k}</dt><dd className="font-medium text-navy">{v}</dd></div>)}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3"><WhatsAppButton settings={settings} product={p} label="Inquire on WhatsApp" /><CopyLink url={`${SITE_URL}/products/${p.slug}`} /></div>
        </div>
      </div>
      {p.description && <section className="mt-14 max-w-3xl"><h2 className="text-3xl">Description</h2><p className="mt-3 whitespace-pre-line leading-relaxed">{p.description}</p></section>}
      <section className="mt-12 max-w-3xl"><h2 className="mb-4 text-3xl">Specifications</h2><ProductSpecifications product={p} />
        {p.care_instructions && <><h3 className="mt-8 text-2xl">Care instructions</h3><p className="mt-2 whitespace-pre-line">{p.care_instructions}</p></>}</section>
      {related.length > 0 && <section className="mt-16"><h2 className="mb-5 text-3xl">Related products</h2><ProductGrid products={related} settings={settings} /></section>}
      {similarOnly.length > 0 && <section className="mt-16"><h2 className="mb-5 text-3xl">Similar products</h2><ProductGrid products={similarOnly} settings={settings} /></section>}
      <RecentlyViewed current={{ slug: p.slug, name: p.name }} />
    </div>
  );
}
