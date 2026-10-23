"use server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/config";
import { productSchema } from "@/lib/validation";
import { slugify, str } from "@/lib/utils";
import { parseCsv, validateCsvRows } from "@/lib/csv";

export type FormState = { error?: string; ok?: string; errors?: string[] };
const BUCKET = "product-images";
const MAX_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
const refresh = () => { revalidatePath("/", "layout"); };

// ---------- Auth ----------
export async function signIn(_: FormState, fd: FormData): Promise<FormState> {
  if (!hasSupabase) return { error: "Supabase is not configured. See the README." };
  const { error } = await createClient().auth.signInWithPassword({ email: String(fd.get("email") ?? ""), password: String(fd.get("password") ?? "") });
  if (error) return { error: "Invalid email or password." };
  redirect("/admin");
}
export async function signOut() { await createClient().auth.signOut(); redirect("/admin/login"); }

// ---------- Images ----------
async function uploadImages(supabase: ReturnType<typeof createClient>, productId: string, files: File[], alt: string) {
  const real = files.filter((f) => f && f.size > 0);
  for (const f of real) {
    if (!TYPES[f.type]) return `“${f.name}” is not allowed. Use JPG, PNG, WebP or AVIF.`;
    if (f.size > MAX_BYTES) return `“${f.name}” is larger than 5 MB.`;
  }
  const { data: last } = await supabase.from("product_images").select("sort_order").eq("product_id", productId).order("sort_order", { ascending: false }).limit(1);
  let order = (last?.[0]?.sort_order ?? -1) + 1;
  for (const f of real) {
    const path = `${productId}/${randomUUID()}.${TYPES[f.type]}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, f, { contentType: f.type });
    if (error) return `Upload failed: ${error.message}`;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    await supabase.from("product_images").insert({ product_id: productId, url: data.publicUrl, storage_path: path, alt, sort_order: order++ });
  }
  return null;
}
export async function deleteImage(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(fd.get("id")), productId = String(fd.get("product_id"));
  const { data } = await supabase.from("product_images").select("storage_path").eq("id", id).single();
  if (data?.storage_path) await supabase.storage.from(BUCKET).remove([data.storage_path]);
  await supabase.from("product_images").delete().eq("id", id);
  refresh(); redirect(`/admin/products/${productId}?msg=Image removed`);
}
export async function moveImage(fd: FormData) {
  const { supabase } = await requireAdmin();
  const productId = String(fd.get("product_id")), id = String(fd.get("id")), dir = String(fd.get("dir"));
  const { data } = await supabase.from("product_images").select("id,sort_order").eq("product_id", productId).order("sort_order");
  const list = data ?? []; const i = list.findIndex((x) => x.id === id); const j = dir === "up" ? i - 1 : i + 1;
  if (i >= 0 && j >= 0 && j < list.length) {
    [list[i], list[j]] = [list[j], list[i]];
    await Promise.all(list.map((x, n) => supabase.from("product_images").update({ sort_order: n }).eq("id", x.id)));
  }
  refresh(); redirect(`/admin/products/${productId}`);
}
export async function replaceImage(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(fd.get("id")), productId = String(fd.get("product_id")), f = fd.get("file") as File;
  if (!f || f.size === 0 || !TYPES[f.type] || f.size > MAX_BYTES) redirect(`/admin/products/${productId}?error=Choose a JPG, PNG, WebP or AVIF file under 5 MB`);
  const { data: old } = await supabase.from("product_images").select("storage_path").eq("id", id).single();
  const path = `${productId}/${randomUUID()}.${TYPES[f.type]}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, f, { contentType: f.type });
  if (error) redirect(`/admin/products/${productId}?error=${encodeURIComponent(error.message)}`);
  await supabase.from("product_images").update({ url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl, storage_path: path }).eq("id", id);
  if (old?.storage_path) await supabase.storage.from(BUCKET).remove([old.storage_path]);
  refresh(); redirect(`/admin/products/${productId}?msg=Image replaced`);
}

// ---------- Products ----------
const KEYS = ["name", "sku", "category_id", "subcategory_id", "brand_id", "manufacturer", "model_number", "description", "material", "grade", "color", "size", "unit", "finish", "style", "price_unit", "care_instructions", "seo_title", "seo_description", "price", "discount_price", "quantity", "min_order_qty", "stock_status", "status"];
const parseSpecs = (t: string | null): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const line of (t ?? "").split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i < 1) continue;
    const k = line.slice(0, i).trim(), v = line.slice(i + 1).trim();
    if (k && v) out[k] = v;
  }
  return out;
};

export async function saveProduct(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = str(fd.get("id"));
  const parsed = productSchema.safeParse(Object.fromEntries(KEYS.map((k) => [k, fd.get(k) ?? ""])));
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(" · ") };
  const row = {
    ...parsed.data, featured: fd.get("featured") === "on", new_arrival: fd.get("new_arrival") === "on",
    available_colors: (str(fd.get("available_colors")) ?? "").split(",").map((c) => c.trim()).filter(Boolean),
    specs: parseSpecs(str(fd.get("specs"))),
  };
  let slug = slugify(str(fd.get("slug")) ?? row.name) || slugify(row.sku);
  const { data: clash } = await supabase.from("products").select("id").eq("slug", slug).neq("id", id ?? "00000000-0000-0000-0000-000000000000").maybeSingle();
  if (clash) slug = `${slug}-${slugify(row.sku)}`;
  let productId = id;
  if (id) {
    const { data: old } = await supabase.from("products").select("slug").eq("id", id).single();
    const { error } = await supabase.from("products").update({ ...row, slug }).eq("id", id);
    if (error) return { error: error.code === "23505" ? "That SKU or slug already exists." : error.message };
    if (old && old.slug !== slug) await supabase.from("slug_redirects").upsert({ old_slug: old.slug, product_id: id });
  } else {
    const { data, error } = await supabase.from("products").insert({ ...row, slug }).select("id").single();
    if (error) return { error: error.code === "23505" ? "That SKU or slug already exists." : error.message };
    productId = data.id;
  }
  const imgErr = await uploadImages(supabase, productId!, fd.getAll("images") as File[], row.name);
  refresh();
  if (imgErr) redirect(`/admin/products/${productId}?error=${encodeURIComponent("Product saved, but: " + imgErr)}`);
  redirect(`/admin/products/${productId}?msg=Saved`);
}
export async function deleteProduct(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(fd.get("id"));
  const { data: imgs } = await supabase.from("product_images").select("storage_path").eq("product_id", id);
  const paths = (imgs ?? []).map((i) => i.storage_path).filter(Boolean) as string[];
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
  await supabase.from("products").delete().eq("id", id);
  refresh(); redirect("/admin/products?msg=Product deleted");
}
export async function duplicateProduct(fd: FormData) {
  const { supabase } = await requireAdmin();
  const { data: p } = await supabase.from("products").select("*").eq("id", String(fd.get("id"))).single();
  if (!p) redirect("/admin/products?error=Product not found");
  const { id: _i, created_at: _c, updated_at: _u, search_text: _s, ...rest } = p;
  const suffix = randomUUID().slice(0, 4);
  const { data, error } = await supabase.from("products").insert({ ...rest, name: `${p.name} (copy)`, sku: `${p.sku}-COPY-${suffix}`, slug: `${p.slug}-copy-${suffix}`, status: "draft", featured: false }).select("id").single();
  if (error) redirect(`/admin/products?error=${encodeURIComponent(error.message)}`);
  refresh(); redirect(`/admin/products/${data.id}?msg=Duplicated as draft. Update the SKU and images.`);
}
export async function setProductFlag(fd: FormData) {
  const { supabase } = await requireAdmin();
  const field = String(fd.get("field")); const id = String(fd.get("id"));
  if (field === "status") await supabase.from("products").update({ status: String(fd.get("value")) === "published" ? "published" : "draft" }).eq("id", id);
  else if (field === "featured" || field === "new_arrival") await supabase.from("products").update({ [field]: String(fd.get("value")) === "true" }).eq("id", id);
  refresh(); redirect("/admin/products");
}

// ---------- Categories ----------
export async function saveCategory(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd.get("id")), name = str(fd.get("name"));
  if (!name) redirect("/admin/categories?error=Name is required");
  const row = { name, slug: slugify(str(fd.get("slug")) ?? name), parent_id: str(fd.get("parent_id")), sort_order: Number(fd.get("sort_order") || 0), description: str(fd.get("description")) };
  const { error } = id ? await supabase.from("categories").update(row).eq("id", id) : await supabase.from("categories").insert(row);
  refresh(); redirect(`/admin/categories?${error ? "error=" + encodeURIComponent(error.code === "23505" ? "Slug already exists" : error.message) : "msg=Saved"}`);
}
export async function deleteCategory(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(fd.get("id"));
  const [{ count: pc }, { count: cc }] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).or(`category_id.eq.${id},subcategory_id.eq.${id}`),
    supabase.from("categories").select("id", { count: "exact", head: true }).eq("parent_id", id)]);
  if (pc || cc) redirect(`/admin/categories?error=${encodeURIComponent(`In use by ${pc ?? 0} product(s) and ${cc ?? 0} subcategor${cc === 1 ? "y" : "ies"}. Reassign them first.`)}`);
  await supabase.from("categories").delete().eq("id", id);
  refresh(); redirect("/admin/categories?msg=Category deleted");
}

// ---------- Brands ----------
export async function saveBrand(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd.get("id")), name = str(fd.get("name"));
  if (!name) redirect("/admin/brands?error=Name is required");
  const row: Record<string, unknown> = { name, slug: slugify(name), website: str(fd.get("website")) };
  const logo = fd.get("logo") as File | null;
  if (logo && logo.size > 0) {
    if (!TYPES[logo.type] || logo.size > MAX_BYTES) redirect("/admin/brands?error=Logo must be JPG, PNG, WebP or AVIF under 5 MB");
    const path = `brands/${randomUUID()}.${TYPES[logo.type]}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, logo, { contentType: logo.type });
    if (error) redirect(`/admin/brands?error=${encodeURIComponent(error.message)}`);
    row.logo_url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }
  const { error } = id ? await supabase.from("brands").update(row).eq("id", id) : await supabase.from("brands").insert(row);
  refresh(); redirect(`/admin/brands?${error ? "error=" + encodeURIComponent(error.code === "23505" ? "Brand already exists" : error.message) : "msg=Saved"}`);
}
export async function deleteBrand(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("brands").delete().eq("id", String(fd.get("id")));
  refresh(); redirect("/admin/brands?msg=Brand deleted (its products are now unbranded)");
}

// ---------- Settings ----------
export async function saveSettings(fd: FormData) {
  const { supabase } = await requireAdmin();
  const keys = ["business_name", "tagline", "phone", "whatsapp", "email", "address", "city", "hours", "facebook", "instagram", "map_embed_url", "announcement", "seo_title", "seo_description"];
  const row: Record<string, unknown> = Object.fromEntries(keys.map((k) => [k, str(fd.get(k))]));
  if (!row.business_name) row.business_name = "MH Enterprises";
  for (const k of ["facebook", "instagram", "map_embed_url"]) if (row[k] && !/^https:\/\//.test(String(row[k]))) redirect(`/admin/settings?error=${encodeURIComponent(k + " must start with https://")}`);
  const logo = fd.get("logo") as File | null;
  if (logo && logo.size > 0) {
    if (!TYPES[logo.type] || logo.size > MAX_BYTES) redirect("/admin/settings?error=Logo must be JPG, PNG, WebP or AVIF under 5 MB");
    const path = `site/logo-${randomUUID()}.${TYPES[logo.type]}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, logo, { contentType: logo.type });
    if (error) redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
    row.logo_url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }
  const { error } = await supabase.from("store_settings").update({ ...row, updated_at: new Date().toISOString() }).eq("id", 1);
  refresh(); redirect(`/admin/settings?${error ? "error=" + encodeURIComponent(error.message) : "msg=Settings saved"}`);
}

// ---------- Inquiries ----------
export async function toggleInquiry(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("inquiries").update({ handled: String(fd.get("value")) === "true" }).eq("id", String(fd.get("id")));
  redirect("/admin/inquiries");
}
export async function deleteInquiry(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("inquiries").delete().eq("id", String(fd.get("id")));
  redirect("/admin/inquiries");
}

// ---------- CSV import ----------
export async function importCsv(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const file = fd.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Choose a CSV file." };
  if (file.size > 2 * 1024 * 1024) return { error: "CSV is larger than 2 MB." };
  const rows = parseCsv(await file.text());
  const [{ data: cats }, { data: brands }, { data: skus }] = await Promise.all([
    supabase.from("categories").select("id,slug,parent_id"), supabase.from("brands").select("id,name"), supabase.from("products").select("sku")]);
  const { valid, errors } = validateCsvRows(rows, new Set((skus ?? []).map((s) => s.sku.toLowerCase())));
  const brandMap = new Map((brands ?? []).map((b) => [b.name.toLowerCase(), b.id]));
  const catMap = new Map((cats ?? []).map((c) => [c.slug, c]));
  const slugs = new Set<string>();
  const inserts = [];
  for (const r of valid) {
    let brand_id: string | null = null;
    if (r.brand) {
      brand_id = brandMap.get(r.brand.toLowerCase()) ?? null;
      if (!brand_id) { const { data } = await supabase.from("brands").insert({ name: r.brand, slug: slugify(r.brand) }).select("id").single(); brand_id = data?.id ?? null; if (brand_id) brandMap.set(r.brand.toLowerCase(), brand_id); }
    }
    const sub = r.subcategory_slug ? catMap.get(r.subcategory_slug) : undefined;
    const main = r.category_slug ? catMap.get(r.category_slug) : sub?.parent_id ? { id: sub.parent_id } : undefined;
    let slug = slugify(r.name); if (slugs.has(slug)) slug += "-" + slugify(r.sku); slugs.add(slug);
    inserts.push({ name: r.name, sku: r.sku, slug, category_id: main?.id ?? null, subcategory_id: sub?.id ?? null, brand_id, manufacturer: r.manufacturer || null, description: r.description || null,
      material: r.material || null, grade: r.grade || null, color: r.color || null, size: r.size || null, finish: r.finish || null, style: r.style || null,
      price: r.price, discount_price: r.discount_price, price_unit: r.price_unit || null, stock_status: r.stock_status, featured: r.featured, new_arrival: r.new_arrival, status: r.status });
  }
  if (inserts.length) {
    const { error } = await supabase.from("products").insert(inserts);
    if (error) return { error: `Database rejected the import: ${error.message} (slug collisions with existing products are a common cause)` };
  }
  refresh();
  return { ok: `Imported ${inserts.length} product(s). ${errors.length} row(s) skipped.`, errors: errors.slice(0, 50) };
}
