import type { Brand, Category, Product } from "@/types";
// SAMPLE DATA ONLY — shown when Supabase is not configured. Not real inventory, brands or prices.
const cat = (id: string, name: string, slug: string, parent: string | null, o: number): Category => ({ id, name, slug, parent_id: parent, description: null, sort_order: o });
export const DEMO_CATEGORIES: Category[] = [
  cat("c1", "Tiles", "tiles", null, 1), cat("c2", "Sanitary Ware", "sanitary-ware", null, 2), cat("c3", "Bathroom Fittings", "bathroom-fittings", null, 3),
  cat("c4", "Kitchen Products", "kitchen-products", null, 4), cat("c5", "Accessories & Other", "accessories", null, 5),
  cat("s1", "Floor Tiles", "floor-tiles", "c1", 1), cat("s2", "Wall Tiles", "wall-tiles", "c1", 2), cat("s3", "Porcelain Tiles", "porcelain-tiles", "c1", 3),
  cat("s4", "Ceramic Tiles", "ceramic-tiles", "c1", 4), cat("s5", "Bathroom Tiles", "bathroom-tiles", "c1", 5), cat("s6", "Kitchen Tiles", "kitchen-tiles", "c1", 6),
  cat("s7", "Wash Basins", "wash-basins", "c2", 1), cat("s8", "Toilets & Commodes", "toilets-commodes", "c2", 2),
  cat("s9", "Showers & Faucets", "showers-faucets", "c3", 1), cat("s10", "Kitchen Sinks", "kitchen-sinks", "c4", 1),
];
export const DEMO_BRANDS: Brand[] = [
  { id: "b1", name: "Sample Brand A", slug: "sample-brand-a", logo_url: null, website: null },
  { id: "b2", name: "Sample Brand B", slug: "sample-brand-b", logo_url: null, website: null },
  { id: "b3", name: "Sample Brand C", slug: "sample-brand-c", logo_url: null, website: null },
];
const base = { manufacturer: null, model_number: null, description: "Sample demonstration product. Replace with real catalog data from the admin dashboard.", material: null, grade: null, available_colors: [], unit: null, finish: null, style: null, discount_price: null, quantity: null, min_order_qty: null, care_instructions: null, seo_title: null, seo_description: null, status: "published" as const, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-01-01T00:00:00Z", images: [], featured: false, new_arrival: false };
const mk = (i: number, name: string, sub: string, main: string, brand: number, o: Partial<Product>): Product => ({
  ...base, id: `p${i}`, name, sku: `SAMPLE-${String(i).padStart(3, "0")}`, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  category_id: main, subcategory_id: sub, brand_id: DEMO_BRANDS[brand].id, brand: { name: DEMO_BRANDS[brand].name, slug: DEMO_BRANDS[brand].slug },
  color: null, size: null, price: null, price_unit: null, stock_status: null, specs: {}, ...o,
  category: DEMO_CATEGORIES.find((c) => c.id === main) ?? null, subcategory: DEMO_CATEGORIES.find((c) => c.id === sub) ?? null,
  created_at: `2025-01-${String(i).padStart(2, "0")}T00:00:00Z`,
});
export const DEMO_PRODUCTS: Product[] = [
  mk(1, "Sample Grey Floor Tile", "s1", "c1", 0, { color: "Grey", size: "24 × 24 in", finish: "Matt", material: "Porcelain", featured: true, new_arrival: true, specs: { "Tile type": "Floor", Thickness: "9 mm", "Pieces per box": "4" } }),
  mk(2, "Sample Marble-Look Wall Tile", "s2", "c1", 1, { color: "White", size: "12 × 24 in", finish: "Glossy", material: "Ceramic", featured: true }),
  mk(3, "Sample Porcelain Slab Tile", "s3", "c1", 0, { color: "Beige", size: "24 × 48 in", finish: "Polished", material: "Porcelain", featured: true }),
  mk(4, "Sample Bathroom Wall Tile", "s5", "c1", 2, { color: "White", size: "12 × 18 in", finish: "Glossy", material: "Ceramic" }),
  mk(5, "Sample Wash Basin", "s7", "c2", 1, { color: "White", size: "550 × 420 mm", material: "Ceramic", featured: true, specs: { "Installation type": "Countertop" } }),
  mk(6, "Sample Two-Piece Commode", "s8", "c2", 2, { color: "White", material: "Ceramic", specs: { "Flush type": "Dual flush" }, new_arrival: true }),
  mk(7, "Sample Basin Mixer Faucet", "s9", "c3", 1, { color: "Gold", material: "Brass", featured: true }),
  mk(8, "Sample Stainless Kitchen Sink", "s10", "c4", 2, { color: "Steel", material: "Stainless steel", size: "32 × 18 in" }),
];
