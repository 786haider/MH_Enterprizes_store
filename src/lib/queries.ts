import { cache } from "react";
import { createClient } from "./supabase/server";
import { DEFAULT_SETTINGS, hasSupabase } from "./config";
import { DEMO_BRANDS, DEMO_CATEGORIES, DEMO_PRODUCTS } from "./demo-data";
import { PAGE_SIZE, type Brand, type Category, type Product, type ProductFilters, type Settings } from "@/types";

const SELECT = "*, brand:brands(name,slug), category:categories!products_category_id_fkey(name,slug), subcategory:categories!products_subcategory_id_fkey(name,slug), images:product_images(id,url,alt,sort_order)";
const norm = (p: Product): Product => ({ ...p, images: [...(p.images ?? [])].sort((a, b) => a.sort_order - b.sort_order), specs: p.specs ?? {}, available_colors: p.available_colors ?? [] });
const safe = (s: string) => s.replace(/[%,()*\\]/g, " ").trim();

export const getSettings = cache(async (): Promise<Settings> => {
  if (!hasSupabase) return DEFAULT_SETTINGS;
  const { data } = await createClient().from("store_settings").select("*").eq("id", 1).single();
  return { ...DEFAULT_SETTINGS, ...(data ?? {}) } as Settings;
});
export const getCategories = cache(async (): Promise<Category[]> => {
  if (!hasSupabase) return DEMO_CATEGORIES;
  const { data } = await createClient().from("categories").select("*").order("sort_order").order("name");
  return (data ?? []) as Category[];
});
export const getBrands = cache(async (): Promise<Brand[]> => {
  if (!hasSupabase) return DEMO_BRANDS;
  const { data } = await createClient().from("brands").select("*").order("name");
  return (data ?? []) as Brand[];
});

export async function getProducts(f: ProductFilters): Promise<{ products: Product[]; total: number; pages: number }> {
  const page = Math.max(1, f.page ?? 1);
  const cats = await getCategories();
  const cat = f.category ? cats.find((c) => c.slug === f.category) : undefined;
  const brands = f.brand ? await getBrands() : [];
  const brand = f.brand ? brands.find((b) => b.slug === f.brand) : undefined;
  if ((f.category && !cat) || (f.brand && !brand)) return { products: [], total: 0, pages: 1 };
  const words = f.q ? safe(f.q).toLowerCase().split(/\s+/).filter(Boolean).slice(0, 8) : [];

  if (!hasSupabase) {
    let list = DEMO_PRODUCTS.filter((p) => {
      const hay = `${p.name} ${p.sku} ${p.brand?.name ?? ""} ${p.manufacturer ?? ""} ${p.category?.name ?? ""} ${p.subcategory?.name ?? ""} ${p.color ?? ""} ${p.size ?? ""} ${p.finish ?? ""} ${p.material ?? ""} ${JSON.stringify(p.specs)}`.toLowerCase();
      const ci = (a: string | null, b?: string) => !b || (a ?? "").toLowerCase().includes(b.toLowerCase());
      return words.every((w) => hay.includes(w)) && (!cat || (cat.parent_id ? p.subcategory_id === cat.id : p.category_id === cat.id)) &&
        (!brand || p.brand_id === brand.id) && ci(p.size, f.size) && ci(p.color, f.color) && ci(p.finish, f.finish) && ci(p.material, f.material) && ci(p.grade, f.grade) &&
        (!f.availability || p.stock_status === f.availability) && (f.minPrice == null || (p.price ?? -1) >= f.minPrice) && (f.maxPrice == null || (p.price != null && p.price <= f.maxPrice));
    });
    list = list.sort((a, b) => f.sort === "name" ? a.name.localeCompare(b.name) : f.sort === "price_asc" ? (a.price ?? 1e12) - (b.price ?? 1e12) : f.sort === "price_desc" ? (b.price ?? -1) - (a.price ?? -1) : b.created_at.localeCompare(a.created_at));
    return { products: list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total: list.length, pages: Math.max(1, Math.ceil(list.length / PAGE_SIZE)) };
  }

  let q = createClient().from("products").select(SELECT, { count: "exact" });
  if (!f.includeDrafts) q = q.eq("status", "published");
  for (const w of words) q = q.ilike("search_text", `%${w}%`);
  if (cat) q = cat.parent_id ? q.eq("subcategory_id", cat.id) : q.eq("category_id", cat.id);
  if (brand) q = q.eq("brand_id", brand.id);
  if (f.size) q = q.ilike("size", `%${safe(f.size)}%`);
  if (f.color) q = q.ilike("color", `%${safe(f.color)}%`);
  if (f.finish) q = q.ilike("finish", `%${safe(f.finish)}%`);
  if (f.material) q = q.ilike("material", `%${safe(f.material)}%`);
  if (f.grade) q = q.ilike("grade", `%${safe(f.grade)}%`);
  if (f.availability) q = q.eq("stock_status", f.availability);
  if (f.minPrice != null) q = q.gte("price", f.minPrice);
  if (f.maxPrice != null) q = q.lte("price", f.maxPrice);
  q = f.sort === "name" ? q.order("name") : f.sort === "price_asc" ? q.order("price", { ascending: true, nullsFirst: false }) : f.sort === "price_desc" ? q.order("price", { ascending: false, nullsFirst: false }) : q.order("created_at", { ascending: false });
  const { data, count } = await q.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  const total = count ?? 0;
  return { products: ((data ?? []) as unknown as Product[]).map(norm), total, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getFeatured(limit = 8): Promise<Product[]> {
  if (!hasSupabase) return DEMO_PRODUCTS.filter((p) => p.featured).slice(0, limit);
  const { data } = await createClient().from("products").select(SELECT).eq("status", "published").eq("featured", true).order("created_at", { ascending: false }).limit(limit);
  return ((data ?? []) as unknown as Product[]).map(norm);
}

export async function getProductBySlug(slug: string): Promise<{ product: Product | null; redirectTo?: string }> {
  if (!hasSupabase) return { product: DEMO_PRODUCTS.find((p) => p.slug === slug) ?? null };
  const sb = createClient();
  const { data } = await sb.from("products").select(SELECT).eq("slug", slug).eq("status", "published").maybeSingle();
  if (data) return { product: norm(data as unknown as Product) };
  const { data: r } = await sb.from("slug_redirects").select("product_id").eq("old_slug", slug).maybeSingle();
  if (r) {
    const { data: p } = await sb.from("products").select("slug").eq("id", r.product_id).eq("status", "published").maybeSingle();
    if (p) return { product: null, redirectTo: p.slug };
  }
  return { product: null };
}

export async function getRelated(p: Product, limit = 4): Promise<Product[]> {
  if (!hasSupabase) return DEMO_PRODUCTS.filter((x) => x.id !== p.id && x.category_id === p.category_id).slice(0, limit);
  let q = createClient().from("products").select(SELECT).eq("status", "published").neq("id", p.id).limit(limit);
  q = p.subcategory_id ? q.eq("subcategory_id", p.subcategory_id) : p.category_id ? q.eq("category_id", p.category_id) : q;
  const { data } = await q;
  return ((data ?? []) as unknown as Product[]).map(norm);
}
export async function getSimilar(p: Product, limit = 4): Promise<Product[]> {
  if (!hasSupabase) return DEMO_PRODUCTS.filter((x) => x.id !== p.id && (x.brand_id === p.brand_id || x.color === p.color)).slice(0, limit);
  let q = createClient().from("products").select(SELECT).eq("status", "published").neq("id", p.id).limit(limit);
  if (p.brand_id) q = q.eq("brand_id", p.brand_id); else if (p.color) q = q.ilike("color", p.color);
  const { data } = await q;
  return ((data ?? []) as unknown as Product[]).map(norm);
}
export async function getFacets() {
  const uniq = (a: (string | null)[]) => Array.from(new Set(a.filter(Boolean) as string[])).sort();
  let rows: Pick<Product, "size" | "color" | "finish" | "material" | "grade">[] = DEMO_PRODUCTS;
  if (hasSupabase) {
    const { data } = await createClient().from("products").select("size,color,finish,material,grade").eq("status", "published").limit(2000);
    rows = (data ?? []) as typeof rows;
  }
  return { sizes: uniq(rows.map((r) => r.size)), colors: uniq(rows.map((r) => r.color)), finishes: uniq(rows.map((r) => r.finish)), materials: uniq(rows.map((r) => r.material)), grades: uniq(rows.map((r) => r.grade)) };
}
export async function getSitemapProducts(): Promise<{ slug: string; updated_at: string }[]> {
  if (!hasSupabase) return DEMO_PRODUCTS.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
  const { data } = await createClient().from("products").select("slug,updated_at").eq("status", "published");
  return data ?? [];
}
export const parseFilters = (sp: Record<string, string | string[] | undefined>): ProductFilters => {
  const g = (k: string) => { const v = sp[k]; return (Array.isArray(v) ? v[0] : v)?.trim() || undefined; };
  const n = (k: string) => { const v = g(k); const x = v ? Number(v) : NaN; return Number.isFinite(x) && x >= 0 ? x : undefined; };
  const sort = g("sort");
  return { q: g("q")?.slice(0, 100), category: g("category"), brand: g("brand"), size: g("size"), color: g("color"), finish: g("finish"), material: g("material"), grade: g("grade"),
    availability: g("availability"), minPrice: n("minPrice"), maxPrice: n("maxPrice"), page: n("page") ? Math.floor(n("page")!) : 1,
    sort: sort === "name" || sort === "price_asc" || sort === "price_desc" ? sort : "newest" };
};
