import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { Product, Settings } from "@/types";
import { generalMessage, productMessage, whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Falls back to the contact page if no WhatsApp number is configured, so links are never broken. */
export function WhatsAppButton({ settings, product, label = "WhatsApp Inquiry", className }: { settings: Settings; product?: Pick<Product, "name" | "sku" | "size" | "slug">; label?: string; className?: string }) {
  const msg = product ? productMessage(product, settings.business_name) : generalMessage(settings.business_name);
  const url = whatsappUrl(settings, msg);
  const cls = cn("btn-wa", className);
  if (!url) return <Link href={product ? `/contact?product=${encodeURIComponent(product.sku)}` : "/contact"} className={cn("btn-navy", className)}>Send an inquiry</Link>;
  return <a href={url} target="_blank" rel="noopener noreferrer" className={cls}><MessageCircle size={16} aria-hidden /> {label}</a>;
}
export function FloatingWhatsApp({ settings }: { settings: Settings }) {
  const url = whatsappUrl(settings, generalMessage(settings.business_name));
  if (!url) return null;
  return <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1E8E4E] text-white shadow-soft hover:bg-[#177a42]"><MessageCircle aria-hidden /></a>;
}
