export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "on_order";
export type Category = { id: string; name: string; slug: string; parent_id: string | null; description: string | null; sort_order: number };
export type Brand = { id: string; name: string; slug: string; logo_url: string | null; website: string | null };
export type ProductImage = { id?: string; url: string; alt: string | null; sort_order: number; storage_path?: string | null };
export type Product = {
  id: string; name: string; sku: string; slug: string;
  category_id: string | null; subcategory_id: string | null; brand_id: string | null;
  manufacturer: string | null; model_number: string | null; description: string | null;
  material: string | null; grade: string | null; color: string | null; available_colors: string[];
  size: string | null; unit: string | null; finish: string | null; style: string | null;
  price: number | null; discount_price: number | null; price_unit: string | null;
  stock_status: StockStatus | null; quantity: number | null; min_order_qty: number | null;
  featured: boolean; new_arrival: boolean; specs: Record<string, string>;
  care_instructions: string | null; seo_title: string | null; seo_description: string | null;
  status: "draft" | "published"; created_at: string; updated_at: string;
  brand?: Pick<Brand, "name" | "slug"> | null;
  category?: Pick<Category, "name" | "slug"> | null;
  subcategory?: Pick<Category, "name" | "slug"> | null;
  images: ProductImage[];
};
export type Settings = {
  business_name: string; tagline: string | null; logo_url: string | null; phone: string | null; whatsapp: string | null;
  email: string | null; address: string | null; city: string | null; hours: string | null; facebook: string | null;
  instagram: string | null; map_embed_url: string | null; announcement: string | null; seo_title: string | null; seo_description: string | null;
};
export type ProductFilters = {
  q?: string; category?: string; brand?: string; size?: string; color?: string; finish?: string; material?: string;
  grade?: string; minPrice?: number; maxPrice?: number; availability?: string; sort?: "newest" | "name" | "price_asc" | "price_desc"; page?: number;
  includeDrafts?: boolean;
};
export const PAGE_SIZE = 12;
export const STOCK_LABEL: Record<StockStatus, string> = { in_stock: "In stock", low_stock: "Low stock", out_of_stock: "Out of stock", on_order: "Available on order" };
