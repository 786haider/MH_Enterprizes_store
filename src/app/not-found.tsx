import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";
import { ProductSearch } from "@/components/ProductSearch";
export default function NotFound() {
  return <SiteChrome><div className="container-x py-24 text-center"><p className="font-serif text-7xl text-gold">404</p><h1 className="mt-2 text-4xl">We couldn’t find that page</h1><p className="mx-auto mt-3 max-w-md text-muted">The page may have moved or the product is no longer listed. Search the catalog or browse all products.</p>
    <div className="mx-auto mt-6 max-w-sm"><ProductSearch /></div><Link href="/products" className="btn-gold mt-6">Browse all products</Link></div></SiteChrome>;
}
