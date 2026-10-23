import { requireAdmin } from "@/lib/auth";
import { deleteCategory, saveCategory } from "../../actions";
import { ConfirmButton, Notice } from "@/components/admin/Bits";
import type { Category } from "@/types";
export default async function CategoriesAdmin({ searchParams: sp }: { searchParams: { msg?: string; error?: string } }) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order").order("name");
  const cats = (data ?? []) as Category[]; const mains = cats.filter((c) => !c.parent_id);
  const Row = ({ c }: { c?: Category }) => (
    <form action={saveCategory} className="grid items-end gap-2 sm:grid-cols-[1fr_1fr_1fr_80px_auto]">
      {c && <input type="hidden" name="id" value={c.id} />}
      <div><label className="label text-xs">Name</label><input name="name" defaultValue={c?.name} required className="input" /></div>
      <div><label className="label text-xs">Slug</label><input name="slug" defaultValue={c?.slug} className="input" placeholder="auto" /></div>
      <div><label className="label text-xs">Parent</label><select name="parent_id" defaultValue={c?.parent_id ?? ""} className="input"><option value="">— Main category —</option>{mains.filter((m) => m.id !== c?.id).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
      <div><label className="label text-xs">Order</label><input name="sort_order" type="number" defaultValue={c?.sort_order ?? 0} className="input" /></div>
      <button className={c ? "btn-navy" : "btn-gold"}>{c ? "Save" : "Add"}</button></form>);
  return <div className="max-w-5xl"><h1 className="text-4xl">Categories</h1><Notice msg={sp.msg} error={sp.error} />
    <section className="mt-6 border border-line bg-white p-4"><h2 className="mb-3 text-xl">Add category or subcategory</h2><Row /></section>
    <ul className="mt-6 space-y-3">{cats.map((c) => <li key={c.id} className={`border border-line bg-white p-4 ${c.parent_id ? "ml-6" : ""}`}><Row c={c} />
      <form action={deleteCategory} className="mt-2"><input type="hidden" name="id" value={c.id} /><ConfirmButton message={`Delete “${c.name}”?`} className="text-sm text-red-700 underline">Delete</ConfirmButton></form></li>)}</ul></div>;
}
