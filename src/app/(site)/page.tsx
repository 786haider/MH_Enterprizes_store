import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { BrandCard } from "@/components/BrandCard";
import { ProductGrid } from "@/components/ProductGrid";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { HOME_CATEGORIES } from "@/lib/config";
import { getBrands, getFeatured, getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const revalidate = 300;
export const metadata = pageMeta({ title: "Tiles, Sanitary Ware & Ceramics", description: "Discover floor tiles, wall tiles, porcelain and ceramic tiles, wash basins, toilets, faucets, showers and kitchen sinks at MH Enterprises.", path: "/" });
// Add licensed/own images to /public/gallery and list them here to show the inspiration gallery.
const GALLERY: { src: string; alt: string }[] = [];
const STRENGTHS = [
  ["Wide product variety", "Tiles, ceramics, sanitary ware, fittings and kitchen products in one place."],
  ["Quality-focused selection", "Products chosen with durability and finish in mind."],
  ["Styles and finishes", "Matt, glossy, polished and more, in many sizes and colors."],
  ["Helpful support", "Talk to our team to compare options and plan quantities."],
  ["Easy inquiries", "Send a product inquiry on WhatsApp in one tap."],
];

export default async function Home() {
  const [settings, featured, brands] = await Promise.all([getSettings(), getFeatured(), getBrands()]);
  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <h1 className="max-w-xl text-5xl !leading-[1.05] !text-white sm:text-6xl">Transform Your Spaces with Premium Tiles &amp; Sanitary Ware</h1>
            <div className="rule-gold mt-6" />
            <p className="mt-6 max-w-lg text-lg text-white/80">Discover quality tiles, elegant ceramics, and modern sanitary solutions for bathrooms, kitchens, and every corner of your space.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/products" className="btn-gold">Explore Products</Link><Link href="/contact" className="btn border border-white/60 text-white hover:bg-white hover:text-navy">Contact Our Team</Link></div>
          </div>
          {/* Tile-swatch mosaic echoing the logo's marble, stone and travertine samples. Replace with showroom photography when available. */}
          <div aria-hidden className="grid grid-cols-3 gap-2 sm:gap-3">
            {["#F2F0EC", "#8E9096", "#D9C9A8", "#B58A35", "#102C50", "#E4E7EC", "#D9C9A8", "#F2F0EC", "#8E9096"].map((c, i) => (
              <div key={i} className="aspect-square border border-white/10 shadow-soft" style={{ backgroundColor: c, backgroundImage: i % 2 ? "linear-gradient(135deg,rgba(255,255,255,.35),transparent 55%)" : "linear-gradient(45deg,transparent 45%,rgba(0,0,0,.08) 46%,transparent 48%)" }} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-x pt-20" aria-labelledby="cats"><h2 id="cats" className="text-4xl">Shop by category</h2><div className="rule-gold mt-3" />
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">{HOME_CATEGORIES.map(([n, s], i) => <li key={s}><CategoryCard name={n} slug={s} index={i} /></li>)}</ul></section>

      <section className="container-x pt-20" aria-labelledby="feat"><div className="flex items-end justify-between"><div><h2 id="feat" className="text-4xl">Featured products</h2><div className="rule-gold mt-3" /></div><Link href="/products" className="text-sm font-semibold text-gold-dark hover:underline">View all</Link></div>
        <div className="mt-8">{featured.length ? <ProductGrid products={featured} settings={settings} /> : <p className="text-muted">Featured products will appear here once they are marked as featured in the admin dashboard.</p>}</div></section>

      {brands.length > 0 && <section className="container-x pt-20" aria-labelledby="brands"><h2 id="brands" className="text-4xl">Shop by brand</h2><div className="rule-gold mt-3" />
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{brands.slice(0, 6).map((b) => <li key={b.id}><BrandCard brand={b} /></li>)}</ul></section>}

      <section className="mt-20 bg-paper py-16" aria-labelledby="why"><div className="container-x"><h2 id="why" className="text-4xl">Why choose MH Enterprises?</h2><div className="rule-gold mt-3" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{STRENGTHS.map(([t, d]) => <li key={t} className="border-t-2 border-gold bg-white p-5 shadow-soft"><h3 className="text-xl">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></li>)}</ul></div></section>

      {GALLERY.length > 0 && <section className="container-x pt-20" aria-labelledby="gal"><h2 id="gal" className="text-4xl">Inspiration gallery</h2><div className="rule-gold mt-3" />
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">{GALLERY.map((g) => <li key={g.src}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={g.src} alt={g.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" /></li>)}</ul></section>}

      <section className="container-x pt-20"><div className="bg-navy px-6 py-14 text-center text-white sm:px-12">
        <h2 className="text-4xl !text-white">Looking for the Perfect Tiles or Sanitary Products?</h2><div className="rule-gold mx-auto mt-4" />
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/products" className="btn-gold">Browse Products</Link><WhatsAppButton settings={settings} label="Contact Us on WhatsApp" /></div></div></section>
    </>
  );
}
