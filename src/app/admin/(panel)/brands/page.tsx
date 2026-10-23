import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { deleteBrand, saveBrand } from "../../actions";
import { ConfirmButton, Notice } from "@/components/admin/Bits";
import type { Brand } from "@/types";
export default async function BrandsAdmin({ searchParams: sp }: { searchParams: { msg?: string; error?: string } }) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("brands").select("*").order("name"); const brands = (data ?? []) as Brand[];
  const Row = ({ b }: { b?: Brand }) => (
    <form action={saveBrand} encType="multipart/form-data" className="grid items-end gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
      {b && <input type="hidden" name="id" value={b.id} />}
      <div><label className="label text-xs">Brand name</label><input name="name" defaultValue={b?.name} required className="input" /></div>
      <div><label className="label text-xs">Website (optional)</label><input name="website" defaultValue={b?.website ?? ""} className="input" /></div>
      <div><label className="label text-xs">Logo (only if you may use it)</label><input type="file" name="logo" accept="image/jpeg,image/png,image/webp,image/avif" className="input py-2 text-xs" /></div>
      <button className={b ? "btn-navy" : "btn-gold"}>{b ? "Save" : "Add"}</button></form>);
  return <div className="max-w-5xl"><h1 className="text-4xl">Brands</h1><Notice msg={sp.msg} error={sp.error} />
    <section className="mt-6 border border-line bg-white p-4"><h2 className="mb-3 text-xl">Add brand</h2><Row /></section>
    <ul className="mt-6 space-y-3">{brands.map((b) => <li key={b.id} className="border border-line bg-white p-4">{b.logo_url && <Image src={b.logo_url} alt={`${b.name} logo`} width={80} height={40} className="mb-2 h-10 w-auto object-contain" />}<Row b={b} />
      <form action={deleteBrand} className="mt-2"><input type="hidden" name="id" value={b.id} /><ConfirmButton message={`Delete brand “${b.name}”? Its products stay but become unbranded.`} className="text-sm text-red-700 underline">Delete</ConfirmButton></form></li>)}</ul></div>;
}
