import type { Product, Settings } from "@/types";
import { SITE_URL } from "./config";
export const cleanNumber = (n: string | null | undefined) => (n ? n.replace(/\D/g, "") : "");
export function whatsappUrl(settings: Pick<Settings, "whatsapp">, message: string): string | null {
  const num = cleanNumber(settings.whatsapp);
  if (num.length < 8) return null;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}
export function productMessage(p: Pick<Product, "name" | "sku" | "size" | "slug">, businessName = "MH Enterprises") {
  const parts = [`Hello ${businessName}, I am interested in ${p.name}.`, `Product code: ${p.sku}.`];
  if (p.size) parts.push(`Size: ${p.size}.`);
  parts.push("Please share the latest price, availability, and further details.", `Product link: ${SITE_URL}/products/${p.slug}`);
  return parts.join(" ");
}
export const generalMessage = (businessName = "MH Enterprises") => `Hello ${businessName}, I would like to enquire about your products.`;
