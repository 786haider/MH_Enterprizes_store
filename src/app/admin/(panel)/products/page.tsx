import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { duplicateProduct, deleteProduct, setProductFlag } from "../../actions";
import { ConfirmButton, Notice } from "@/components/admin/Bits";
type SP = { searchParams: { q?: string; category?: string; brand?: string; status?: string; msg?: string; error?: string } };
export default async function ProductsAdmin({ searchParams: sp }: SP) {
  const { supabase } = await requireAdmin();
  const [{ data: cats }, { data: brands }] = await Promise.all([supabase.from("categories").select("id,name").is("parent_id", null).order("sort_order"), supabase.from("brands").select("id,name").order("name")]);
  let q = supabase.from("products").select("id,name,sku,status,featured,price,brand:brands(name),category:categories!products_category_id_fkey(name)").order("created_at", { ascending: false }).limit(200);
  if (sp.q) q = q.ilike("search_text", `%${sp.q.replace(/[%,()*\\]/g, " ").trim().toLowerCase()}%`);
  if (sp.category) q = q.eq("category_id", sp.category);
  if (sp.brand) q = q.eq("brand_id", sp.brand);
  if (sp.status === "draft" || sp.status === "published") q = q.eq("status", sp.status);
  const { data: products } = await q;
  const post = (action: (fd: FormData) => Promise<void>, id: string, extra: Record<string, string>, label: string) => (
    <form action={action}><input type="hidden" name="id" value={id} />{Object.entries(extra).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}<button className="text-navy underline">{label}</button></form>);
  return <div><div className="flex items-center justify-between"><h1 className="text-4xl">Products</h1><Link href="/admin/products/new" className="btn-gold">Add product</Link></div>
    <Notice msg={sp.msg} error={sp.error} />
    <form className="my-6 grid gap-3 sm:grid-cols-5"><input name="q" defaultValue={sp.q} placeholder="Search…" aria-label="Search products" className="input sm:col-span-2" />
      <select name="category" defaultValue={sp.category ?? ""} aria-label="Category" className="input"><option value="">All categories</option>{cats?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <select name="brand" defaultValue={sp.brand ?? ""} aria-label="Brand" className="input"><option value="">All brands</option>{brands?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
      <select name="status" defaultValue={sp.status ?? ""} aria-label="Status" className="input"><option value="">Any status</option><option value="published">Published</option><option value="draft">Draft</option></select>
      <button className="btn-navy sm:col-span-5 sm:w-40">Filter</button></form>
    <div className="overflow-x-auto border border-line bg-white"><table className="w-full text-left text-sm"><thead className="bg-paper text-navy"><tr>{["Product", "SKU", "Brand", "Category", "Status", "Actions"].map((h) => <th key={h} scope="col" className="px-3 py-3">{h}</th>)}</tr></thead>
      <tbody className="divide-y divide-line">{(products ?? []).map((p: any) => <tr key={p.id}>
        <td className="px-3 py-3 font-medium"><Link href={`/admin/products/${p.id}`} className="text-navy hover:underline">{p.name}</Link>{p.featured && <span className="ml-2 bg-gold-light px-1.5 text-xs">Featured</span>}</td>
        <td className="px-3 py-3">{p.sku}</td><td className="px-3 py-3">{p.brand?.name ?? "—"}</td><td className="px-3 py-3">{p.category?.name ?? "—"}</td><td className="px-3 py-3">{p.status}</td>
        <td className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-3"><Link href={`/admin/products/${p.id}`} className="text-navy underline">Edit</Link>
          {post(setProductFlag, p.id, { field: "status", value: p.status === "published" ? "draft" : "published" }, p.status === "published" ? "Unpublish" : "Publish")}
          {post(setProductFlag, p.id, { field: "featured", value: String(!p.featured) }, p.featured ? "Unfeature" : "Feature")}
          {post(duplicateProduct, p.id, {}, "Duplicate")}
          <form action={deleteProduct}><input type="hidden" name="id" value={p.id} /><ConfirmButton message={`Delete “${p.name}” and its images? This cannot be undone.`} className="text-red-700 underline">Delete</ConfirmButton></form></td></tr>)}
        {!products?.length && <tr><td colSpan={6} className="p-6 text-center text-muted">No products match. <Link href="/admin/products/new" className="underline">Add one</Link>.</td></tr>}</tbody></table></div></div>;
}
