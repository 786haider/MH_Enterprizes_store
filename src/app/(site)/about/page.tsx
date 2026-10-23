import Link from "next/link";
import { getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({ title: "About Us", description: "MH Enterprises supplies tiles, ceramics, sanitary ware, bathroom fittings and kitchen products.", path: "/about" });
export default async function About() {
  const s = await getSettings();
  return <div className="container-x max-w-3xl py-12"><h1 className="text-4xl sm:text-5xl">About {s.business_name}</h1><div className="rule-gold mt-4" />
    <div className="mt-8 space-y-4 leading-relaxed"><p>{s.business_name} is a retailer and supplier of tiles, ceramics, sanitary ware, bathroom fittings and related finishing products for homes and construction projects.</p>
      <p>Browse our catalog online, then send us an inquiry on WhatsApp or through the contact form for the latest prices, availability and advice on choosing the right products.</p>
      <p className="text-sm text-muted">Store history, team and location details can be added here by editing this page’s content.</p></div>
    <Link href="/contact" className="btn-gold mt-8">Contact our team</Link></div>;
}
