import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { importCsv } from "../../actions";
import { ActionForm, Submit } from "@/components/admin/Bits";
import { CSV_COLUMNS } from "@/lib/csv";
export default async function ImportAdmin() {
  await requireAdmin();
  return <div className="max-w-3xl"><h1 className="text-4xl">Import / export</h1>
    <div className="mt-6 flex flex-wrap gap-3"><a href="/admin/csv?type=template" className="btn-outline">Download CSV template</a><a href="/admin/csv?type=export" className="btn-outline">Export all products</a></div>
    <section className="mt-8 border border-line bg-white p-5"><h2 className="text-2xl">Import products</h2>
      <p className="mt-2 text-sm text-muted">Columns: {CSV_COLUMNS.join(", ")}. Required: name and sku. Rows with invalid prices or duplicate SKUs are skipped and listed. Images are added afterwards on each product. Category columns use slugs (see <Link href="/admin/categories" className="underline">Categories</Link>).</p>
      <ActionForm action={importCsv} className="mt-4 space-y-3"><input type="file" name="file" accept=".csv,text/csv" required className="input py-2" aria-label="CSV file" /><Submit>Import CSV</Submit></ActionForm></section></div>;
}
