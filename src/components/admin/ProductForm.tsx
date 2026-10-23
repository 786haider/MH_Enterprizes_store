"use client";
import Link from "next/link";
import type { Brand, Category, Product } from "@/types";
import { saveProduct } from "@/app/admin/actions";
import { ActionForm, Submit } from "./Bits";

const F = ({ label, name, v, type = "text", hint, req }: { label: string; name: string; v?: string | number | null; type?: string; hint?: string; req?: boolean }) => (
  <div><label htmlFor={name} className="label">{label}{req && " *"}</label><input id={name} name={name} type={type} step={type === "number" ? "any" : undefined} min={type === "number" ? 0 : undefined} defaultValue={v ?? ""} required={req} className="input" />{hint && <p className="mt-1 text-xs text-muted">{hint}</p>}</div>
);
export function ProductForm({ product: p, categories, brands }: { product?: Product; categories: Category[]; brands: Brand[] }) {
  const mains = categories.filter((c) => !c.parent_id), subs = categories.filter((c) => c.parent_id);
  const specs = p ? Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join("\n") : "";
  return (
    <ActionForm action={saveProduct} className="space-y-8">
      {p && <input type="hidden" name="id" value={p.id} />}
      <fieldset className="grid gap-4 sm:grid-cols-2"><legend className="mb-2 font-serif text-2xl text-navy">Basics</legend>
        <F label="Product name" name="name" v={p?.name} req /><F label="SKU / product code" name="sku" v={p?.sku} req />
        <F label="URL slug" name="slug" v={p?.slug} hint="Leave empty to generate from the name. Changing it keeps a redirect from the old URL." />
        <div><label htmlFor="brand_id" className="label">Brand</label><select id="brand_id" name="brand_id" defaultValue={p?.brand_id ?? ""} className="input"><option value="">— None —</option>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
        <div><label htmlFor="category_id" className="label">Main category</label><select id="category_id" name="category_id" defaultValue={p?.category_id ?? ""} className="input"><option value="">— None —</option>{mains.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label htmlFor="subcategory_id" className="label">Subcategory</label><select id="subcategory_id" name="subcategory_id" defaultValue={p?.subcategory_id ?? ""} className="input"><option value="">— None —</option>{subs.map((c) => <option key={c.id} value={c.id}>{mains.find((m) => m.id === c.parent_id)?.name} › {c.name}</option>)}</select></div>
        <F label="Manufacturer / company" name="manufacturer" v={p?.manufacturer} /><F label="Model number" name="model_number" v={p?.model_number} />
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-3"><legend className="mb-2 font-serif text-2xl text-navy">Attributes</legend>
        <F label="Size / dimensions" name="size" v={p?.size} /><F label="Unit of measurement" name="unit" v={p?.unit} /><F label="Color" name="color" v={p?.color} />
        <F label="Available colors" name="available_colors" v={p?.available_colors.join(", ")} hint="Comma separated" /><F label="Finish" name="finish" v={p?.finish} /><F label="Material" name="material" v={p?.material} />
        <F label="Quality / grade" name="grade" v={p?.grade} /><F label="Style / design" name="style" v={p?.style} /><F label="Minimum order quantity" name="min_order_qty" type="number" v={p?.min_order_qty} />
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-3"><legend className="mb-2 font-serif text-2xl text-navy">Price &amp; stock</legend>
        <F label="Price (PKR)" name="price" type="number" v={p?.price} hint="Leave empty to show “Contact us for the latest price”" /><F label="Discount price" name="discount_price" type="number" v={p?.discount_price} /><F label="Price unit" name="price_unit" v={p?.price_unit} hint="piece, box, sq ft, sq m" />
        <div><label htmlFor="stock_status" className="label">Stock status</label><select id="stock_status" name="stock_status" defaultValue={p?.stock_status ?? ""} className="input"><option value="">Not shown</option><option value="in_stock">In stock</option><option value="low_stock">Low stock</option><option value="on_order">Available on order</option><option value="out_of_stock">Out of stock</option></select></div>
        <F label="Quantity in stock" name="quantity" type="number" v={p?.quantity} />
      </fieldset>
      <fieldset className="space-y-4"><legend className="mb-2 font-serif text-2xl text-navy">Details</legend>
        <div><label htmlFor="description" className="label">Description</label><textarea id="description" name="description" rows={5} defaultValue={p?.description ?? ""} className="input py-2" /></div>
        <div><label htmlFor="specs" className="label">Technical specifications</label><textarea id="specs" name="specs" rows={6} defaultValue={specs} className="input py-2 font-mono" placeholder={"Thickness: 9 mm\nPieces per box: 4\nCoverage per box: 1.44 sq m\nFlush type: Dual flush"} /><p className="mt-1 text-xs text-muted">One “Name: value” per line. Only what you enter is shown on the website (tile type, water absorption, slip resistance, installation type, warranty…).</p></div>
        <div><label htmlFor="care_instructions" className="label">Care instructions</label><textarea id="care_instructions" name="care_instructions" rows={3} defaultValue={p?.care_instructions ?? ""} className="input py-2" /></div>
      </fieldset>
      <fieldset><legend className="mb-2 font-serif text-2xl text-navy">Images</legend>
        <input type="file" name="images" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="input py-2" aria-label="Upload product images" /><p className="mt-1 text-xs text-muted">JPG, PNG, WebP or AVIF, up to 5 MB each. {p ? "Manage existing images below the form." : "Add more after saving."}</p></fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2"><legend className="mb-2 font-serif text-2xl text-navy">SEO &amp; publishing</legend>
        <F label="SEO title" name="seo_title" v={p?.seo_title} /><F label="SEO description" name="seo_description" v={p?.seo_description} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={p?.featured} className="h-4 w-4" /> Featured on homepage</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="new_arrival" defaultChecked={p?.new_arrival} className="h-4 w-4" /> New arrival</label>
        <div><label htmlFor="status" className="label">Status</label><select id="status" name="status" defaultValue={p?.status ?? "draft"} className="input"><option value="draft">Draft (hidden)</option><option value="published">Published</option></select></div>
      </fieldset>
      <div className="flex gap-3"><Submit>Save product</Submit><Link href="/admin/products" className="btn-outline">Cancel</Link></div>
    </ActionForm>
  );
}
