"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/config";
import { ProductSearch } from "./ProductSearch";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);
  const close = () => setOpen(false);
  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-nav" className="flex h-11 w-11 items-center justify-center text-navy"><Menu /></button>
      {open && (
        <div id="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] overflow-y-auto bg-white">
          <div className="container-x flex h-16 items-center justify-between"><span className="font-serif text-xl font-semibold text-navy">Menu</span>
            <button type="button" onClick={close} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center text-navy"><X /></button></div>
          <div className="container-x space-y-6 pb-10 pt-2">
            <div onClick={(e) => (e.target as HTMLElement).closest("a,button[type=submit]") && close()}><ProductSearch /></div>
            <ul className="divide-y divide-line">
              {NAV.map((item) => (
                <li key={item.href} className="py-3">
                  <Link href={item.href} onClick={close} className="block text-lg font-semibold text-navy">{item.label}</Link>
                  {"children" in item && <ul className="mt-2 space-y-1 pl-3">{item.children.map(([l, s]) => <li key={s}><Link onClick={close} href={`/products?category=${s}`} className="block py-1.5 text-sm text-muted">{l}</Link></li>)}</ul>}
                </li>
              ))}
              {[["About Us", "/about"], ["Contact Us", "/contact"], ["All Products", "/products"]].map(([l, h]) => <li key={h} className="py-3"><Link href={h} onClick={close} className="block text-lg font-semibold text-navy">{l}</Link></li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
