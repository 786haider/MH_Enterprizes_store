import { requireAdmin } from "@/lib/auth";
import { saveSettings } from "../../actions";
import { Notice, Submit } from "@/components/admin/Bits";
import type { Settings } from "@/types";
export default async function SettingsAdmin({ searchParams: sp }: { searchParams: { msg?: string; error?: string } }) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("store_settings").select("*").eq("id", 1).single(); const s = (data ?? {}) as Settings;
  const F = ({ n, l, area, hint }: { n: keyof Settings; l: string; area?: boolean; hint?: string }) => <div><label htmlFor={n} className="label">{l}</label>{area ? <textarea id={n} name={n} rows={3} defaultValue={(s[n] as string) ?? ""} className="input py-2" /> : <input id={n} name={n} defaultValue={(s[n] as string) ?? ""} className="input" />}{hint && <p className="mt-1 text-xs text-muted">{hint}</p>}</div>;
  return <div className="max-w-3xl"><h1 className="text-4xl">Store settings</h1><Notice msg={sp.msg} error={sp.error} />
    <form action={saveSettings} encType="multipart/form-data" className="mt-6 grid gap-4 sm:grid-cols-2">
      <F n="business_name" l="Business name" /><F n="tagline" l="Tagline" /><F n="phone" l="Contact number" /><F n="whatsapp" l="WhatsApp number" hint="International format, digits only, e.g. 923001234567" />
      <F n="email" l="Email" /><F n="city" l="City / service area" hint="Used in local SEO schema once filled in" /><div className="sm:col-span-2"><F n="address" l="Address" area /></div>
      <div className="sm:col-span-2"><F n="hours" l="Store hours" area /></div><F n="facebook" l="Facebook URL" /><F n="instagram" l="Instagram URL" />
      <div className="sm:col-span-2"><F n="map_embed_url" l="Google Maps embed URL" hint="Only add your real location (Google Maps → Share → Embed a map → copy the src URL)" /></div>
      <div className="sm:col-span-2"><F n="announcement" l="Homepage announcement" hint="Leave empty to hide the bar" /></div>
      <F n="seo_title" l="Default SEO title" /><F n="seo_description" l="Default SEO description" />
      <div className="sm:col-span-2"><label htmlFor="logo" className="label">Replace logo (optional)</label><input id="logo" type="file" name="logo" accept="image/jpeg,image/png,image/webp,image/avif" className="input py-2" /></div>
      <div className="sm:col-span-2"><Submit>Save settings</Submit></div></form></div>;
}
