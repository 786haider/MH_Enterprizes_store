import Image from "next/image";
import Link from "next/link";
import type { Settings } from "@/types";
import { cleanNumber } from "@/lib/whatsapp";

export function Footer({ settings: s }: { settings: Settings }) {
  const wa = cleanNumber(s.whatsapp);
  return (
    <footer className="mt-24 bg-navy text-white/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="inline-block bg-white p-2"><Image src={s.logo_url || "/logo.png"} alt={`${s.business_name} logo`} width={96} height={96} className="h-24 w-24 object-contain" /></div>
          <p className="mt-4 max-w-xs text-sm">{s.business_name} — {s.tagline ?? "tiles, ceramics and sanitary ware"}. Browse the catalog and send us an inquiry for the latest prices and availability.</p>
        </div>
        <nav aria-label="Product categories"><h2 className="font-serif text-lg !text-gold-light">Products</h2><ul className="mt-3 space-y-2 text-sm">
          {[["Tiles", "/tiles"], ["Sanitary Ware", "/sanitary-ware"], ["Bathroom Fittings", "/bathroom-fittings"], ["Kitchen Products", "/kitchen-products"], ["Brands", "/brands"]].map(([l, h]) => <li key={h}><Link href={h} className="hover:text-gold-light">{l}</Link></li>)}</ul></nav>
        <nav aria-label="Useful links"><h2 className="font-serif text-lg !text-gold-light">Useful links</h2><ul className="mt-3 space-y-2 text-sm">
          {[["All Products", "/products"], ["About Us", "/about"], ["Contact Us", "/contact"], ["Privacy Policy", "/privacy-policy"], ["Terms & Conditions", "/terms-and-conditions"]].map(([l, h]) => <li key={h}><Link href={h} className="hover:text-gold-light">{l}</Link></li>)}</ul></nav>
        <div><h2 className="font-serif text-lg !text-gold-light">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {s.address && <li>{s.address}{s.city ? `, ${s.city}` : ""}</li>}
            {s.phone && <li><a href={`tel:${s.phone.replace(/\s/g, "")}`} className="hover:text-gold-light">{s.phone}</a></li>}
            {wa && <li><a href={`https://wa.me/${wa}`} className="hover:text-gold-light" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>}
            {s.email && <li><a href={`mailto:${s.email}`} className="hover:text-gold-light">{s.email}</a></li>}
            {s.hours && <li className="whitespace-pre-line">{s.hours}</li>}
            {s.facebook && <li><a href={s.facebook} rel="noopener noreferrer" target="_blank" className="hover:text-gold-light">Facebook</a></li>}
            {s.instagram && <li><a href={s.instagram} rel="noopener noreferrer" target="_blank" className="hover:text-gold-light">Instagram</a></li>}
            {!s.address && !s.phone && !wa && !s.email && <li><Link href="/contact" className="hover:text-gold-light">Use our contact form</Link></li>}
          </ul></div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">© {new Date().getFullYear()} {s.business_name}. All rights reserved.</div>
    </footer>
  );
}
