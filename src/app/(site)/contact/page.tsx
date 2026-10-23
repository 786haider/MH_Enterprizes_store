import { ContactForm } from "@/components/ContactForm";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({ title: "Contact Us", description: "Contact MH Enterprises for tiles, ceramics and sanitary ware — ask about prices, availability and bulk orders.", path: "/contact" });
export default async function ContactPage({ searchParams }: { searchParams: { product?: string } }) {
  const s = await getSettings();
  return (
    <div className="container-x py-12">
      <h1 className="text-4xl sm:text-5xl">Contact us</h1><div className="rule-gold mt-4" />
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <ContactForm productRef={searchParams.product?.slice(0, 120)} />
        <aside className="space-y-4 border border-line bg-paper p-6 text-sm">
          <h2 className="text-2xl">Store details</h2>
          {s.address && <p>{s.address}{s.city ? `, ${s.city}` : ""}</p>}
          {s.phone && <p>Phone: <a className="text-navy underline" href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a></p>}
          {s.email && <p>Email: <a className="text-navy underline" href={`mailto:${s.email}`}>{s.email}</a></p>}
          {s.hours && <p className="whitespace-pre-line">{s.hours}</p>}
          {!s.address && !s.phone && !s.email && <p className="text-muted">Store details will appear here once added in the admin dashboard. Please use the form.</p>}
          <WhatsAppButton settings={s} label="Chat on WhatsApp" className="w-full" />
          {s.map_embed_url && <iframe title="Store location map" src={s.map_embed_url} loading="lazy" className="h-64 w-full border-0" referrerPolicy="no-referrer-when-downgrade" />}
        </aside>
      </div>
    </div>
  );
}
