import Link from "next/link";
import type { Product, Settings } from "@/types";
import { STOCK_LABEL } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "./ProductImage";
import { WhatsAppButton } from "./WhatsAppButton";

export function ProductCard({ product: p, settings }: { product: Product; settings: Settings }) {
  const price = p.discount_price ?? p.price;
  return (
    <article className="group flex flex-col border border-line bg-white transition-shadow hover:shadow-soft">
      <Link href={`/products/${p.slug}`} className="relative block aspect-square overflow-hidden bg-paper" aria-label={p.name}>
        <ProductImage src={p.images[0]?.url} alt={p.images[0]?.alt || p.name} />
        {p.new_arrival && <span className="absolute left-0 top-3 bg-gold px-2 py-1 text-xs font-semibold text-white">New</span>}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-muted">{[p.brand?.name, p.subcategory?.name ?? p.category?.name].filter(Boolean).join(" · ")}</p>
        <h3 className="mt-1 text-xl leading-tight"><Link href={`/products/${p.slug}`} className="hover:text-gold-dark">{p.name}</Link></h3>
        <p className="mt-1 text-sm text-muted">{[p.size, p.color].filter(Boolean).join(" · ")}</p>
        <div className="mt-2 text-sm">
          {price != null ? <span className="font-semibold text-navy">PKR {formatPrice(price)}{p.price_unit ? <span className="font-normal text-muted"> / {p.price_unit}</span> : null}{p.discount_price != null && p.price != null && <s className="ml-2 font-normal text-muted">{formatPrice(p.price)}</s>}</span> : <span className="text-muted">Contact us for the latest price</span>}
          {p.stock_status && <span className="ml-2 text-xs text-muted">{STOCK_LABEL[p.stock_status]}</span>}
        </div>
        <div className="mt-auto grid gap-2 pt-4">
          <Link href={`/products/${p.slug}`} className="btn-outline">View details</Link>
          <WhatsAppButton settings={settings} product={p} />
        </div>
      </div>
    </article>
  );
}
