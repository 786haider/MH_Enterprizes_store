import { requireAdmin } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Brand, Category } from "@/types";
export default async function NewProduct() {
  const { supabase } = await requireAdmin();
  const [{ data: c }, { data: b }] = await Promise.all([supabase.from("categories").select("*").order("sort_order"), supabase.from("brands").select("*").order("name")]);
  return <div className="max-w-4xl"><h1 className="mb-6 text-4xl">Add product</h1><ProductForm categories={(c ?? []) as Category[]} brands={(b ?? []) as Brand[]} /></div>;
}
