export const CSV_COLUMNS = ["name", "sku", "category_slug", "subcategory_slug", "brand", "manufacturer", "description", "material", "grade", "color", "size", "finish", "style", "price", "discount_price", "price_unit", "stock_status", "featured", "new_arrival", "status"] as const;
export const CSV_TEMPLATE = CSV_COLUMNS.join(",") + "\nSample Grey Floor Tile,SAMPLE-001,tiles,floor-tiles,Sample Brand,,Short description,Porcelain,,Grey,24 x 24 in,Matt,,,,,in_stock,false,false,draft\n";

export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []; let row: string[] = [], cur = "", q = false;
  const s = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '"') { if (s[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && s[i + 1] === "\n") i++; row.push(cur); cur = ""; if (row.some((x) => x.trim())) rows.push(row); row = []; }
    else cur += c;
  }
  row.push(cur); if (row.some((x) => x.trim())) rows.push(row);
  const [head, ...body] = rows; if (!head) return [];
  const keys = head.map((h) => h.trim().toLowerCase());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}
export const toCsv = (rows: (string | number | boolean | null | undefined)[][]) => rows.map((r) => r.map((v) => { const s = v == null ? "" : String(v); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(",")).join("\n");

export type CsvProduct = { name: string; sku: string; category_slug: string; subcategory_slug: string; brand: string; manufacturer: string; description: string; material: string; grade: string; color: string; size: string; finish: string; style: string; price_unit: string; price: number | null; discount_price: number | null; stock_status: "in_stock" | "low_stock" | "out_of_stock" | "on_order" | null; featured: boolean; new_arrival: boolean; status: "draft" | "published" };
export function validateCsvRows(rows: Record<string, string>[], existingSkus: Set<string>) {
  const valid: CsvProduct[] = []; const errors: string[] = []; const seen = new Set<string>();
  rows.forEach((r, i) => {
    const line = i + 2; const bad: string[] = [];
    if (!r.name) bad.push("name is required");
    if (!r.sku) bad.push("sku is required");
    const sku = (r.sku ?? "").toLowerCase();
    if (sku && existingSkus.has(sku)) bad.push(`SKU “${r.sku}” already exists`);
    if (sku && seen.has(sku)) bad.push(`SKU “${r.sku}” is duplicated in the file`);
    const num = (v: string, label: string) => { if (!v) return null; const n = Number(v); if (!Number.isFinite(n) || n < 0) { bad.push(`${label} “${v}” is not a valid price`); return null; } return n; };
    const price = num(r.price, "price"), discount = num(r.discount_price, "discount_price");
    if (price != null && discount != null && discount > price) bad.push("discount_price is higher than price");
    const st = r.stock_status; if (st && !["in_stock", "low_stock", "out_of_stock", "on_order"].includes(st)) bad.push(`stock_status “${st}” is invalid`);
    const status = r.status || "draft"; if (!["draft", "published"].includes(status)) bad.push(`status “${status}” must be draft or published`);
    if (bad.length) { errors.push(`Row ${line}: ${bad.join("; ")}`); return; }
    seen.add(sku);
    valid.push({ name: r.name, sku: r.sku, category_slug: r.category_slug, subcategory_slug: r.subcategory_slug, brand: r.brand, manufacturer: r.manufacturer, description: r.description, material: r.material, grade: r.grade, color: r.color, size: r.size, finish: r.finish, style: r.style, price_unit: r.price_unit,
      price, discount_price: discount, stock_status: (st || null) as CsvProduct["stock_status"], featured: r.featured === "true", new_arrival: r.new_arrival === "true", status: status as "draft" | "published" });
  });
  return { valid, errors };
}
