import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { NAV } from "@/lib/config";
import type { Settings } from "@/types";
import { ProductSearch } from "./ProductSearch";
import { MobileMenu } from "./MobileMenu";
import { WhatsAppButton } from "./WhatsAppButton";

export function Header({ settings }: { settings: Settings }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-x flex h-16 items-center gap-4 lg:h-20">
        <Link href="/" className="shrink-0" aria-label={`${settings.business_name} home`}>
          <Image src={settings.logo_url || "/logo.png"} alt={`${settings.business_name} logo`} width={72} height={72} priority className="h-14 w-14 object-contain lg:h-16 lg:w-16" />
        </Link>
        <nav aria-label="Primary" className="ml-2 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <div key={item.href} className="group relative">
              <Link href={item.href} className="site-nav-link">{item.label}</Link>
              {"children" in item && (
                <div className="invisible absolute left-0 top-full min-w-56 translate-y-1 border border-line bg-white py-2 opacity-0 shadow-soft transition-[opacity,transform,visibility] duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map(([label, slug]) => <Link key={slug} href={`/products?category=${slug}`} className="block px-4 py-2 text-sm transition-colors hover:bg-paper hover:text-gold-dark">{label}</Link>)}
                </div>
              )}
            </div>
          ))}
          <Link href="/about" className="site-nav-link">About</Link>
        </nav>
        <div className="ml-auto hidden w-64 xl:block"><ProductSearch /></div>
        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <Link href="/contact" className="btn-outline hidden !min-h-[40px] sm:inline-flex"><Phone size={15} aria-hidden /> Contact</Link>
          <WhatsAppButton settings={settings} label="WhatsApp" className="hidden !min-h-[40px] md:inline-flex" />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
