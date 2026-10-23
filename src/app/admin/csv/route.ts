import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { CSV_COLUMNS, CSV_TEMPLATE, toCsv } from "@/lib/csv";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const { supabase } = await requireAdmin();
  const type = new URL(req.url).searchParams.get("type");
  const headers = (name: string) => ({ "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${name}"` });
  if (type === "template") return new NextResponse(CSV_TEMPLATE, { headers: headers("mh-products-template.csv") });
  const { data } = await supabase.from("products").select("*, brand:brands(name), category:categories!products_category_id_fkey(slug), subcategory:categories!products_subcategory_id_fkey(slug)").order("created_at");
  const rows = (data ?? []).map((p: any) => CSV_COLUMNS.map((c) => c === "category_slug" ? p.category?.slug : c === "subcategory_slug" ? p.subcategory?.slug : c === "brand" ? p.brand?.name : p[c]));
  return new NextResponse(toCsv([[...CSV_COLUMNS], ...rows]), { headers: headers("mh-products-export.csv") });
}
