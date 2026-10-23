import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const count = async (t: string, f?: (q: any) => any) => { const q = supabase.from(t).select("id", { count: "exact", head: true }); const { count } = await (f ? f(q) : q); return count ?? 0; };
  const [pub, draft, cats, brands, newInq] = await Promise.all([count("products", (q) => q.eq("status", "published")), count("products", (q) => q.eq("status", "draft")), count("categories"), count("brands"), count("inquiries", (q) => q.eq("handled", false))]);
  const { data: recent } = await supabase.from("products").select("id,name,sku,status,created_at").order("created_at", { ascending: false }).limit(6);
  const stats = [["Published products", pub], ["Draft products", draft], ["Categories", cats], ["Brands", brands], ["Open inquiries", newInq]] as const;
  return <div><h1 className="text-4xl">Dashboard</h1>
    <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{stats.map(([l, n]) => <li key={l} className="border-t-2 border-gold bg-white p-5 shadow-soft"><p className="text-3xl font-semibold text-navy">{n}</p><p className="text-sm text-muted">{l}</p></li>)}</ul>
    <div className="mt-8 flex flex-wrap gap-3"><Link href="/admin/products/new" className="btn-gold">Add product</Link><Link href="/admin/import" className="btn-outline">Import CSV</Link><Link href="/admin/inquiries" className="btn-outline">View inquiries</Link></div>
    <h2 className="mt-10 text-2xl">Recently added</h2>
    <ul className="mt-3 divide-y divide-line border border-line bg-white">{(recent ?? []).map((p) => <li key={p.id} className="flex items-center justify-between p-3 text-sm"><Link href={`/admin/products/${p.id}`} className="font-medium text-navy hover:underline">{p.name} <span className="text-muted">({p.sku})</span></Link><span className="text-muted">{p.status}</span></li>)}{!recent?.length && <li className="p-4 text-sm text-muted">No products yet.</li>}</ul></div>;
}
