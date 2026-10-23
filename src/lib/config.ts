import type { Settings } from "@/types";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const DEFAULT_SETTINGS: Settings = {
  business_name: "MH Enterprises", tagline: "Premium Tiles, Sanitary Ware & Ceramics", logo_url: null,
  phone: null, whatsapp: null, email: null, address: null, city: null, hours: null, facebook: null, instagram: null,
  map_embed_url: null, announcement: "Sample announcement — edit this text in Admin → Store settings.",
  seo_title: null, seo_description: "Tiles, ceramics, sanitary ware, bathroom fittings and kitchen products from MH Enterprises.",
};
export const NAV = [
  { label: "Tiles", href: "/tiles", children: [["Floor Tiles", "floor-tiles"], ["Wall Tiles", "wall-tiles"], ["Porcelain Tiles", "porcelain-tiles"], ["Ceramic Tiles", "ceramic-tiles"], ["Bathroom Tiles", "bathroom-tiles"], ["Kitchen Tiles", "kitchen-tiles"]] },
  { label: "Sanitary Ware", href: "/sanitary-ware", children: [["Wash Basins", "wash-basins"], ["Toilets & Commodes", "toilets-commodes"]] },
  { label: "Bathroom Fittings", href: "/bathroom-fittings", children: [["Showers & Faucets", "showers-faucets"]] },
  { label: "Kitchen Products", href: "/kitchen-products", children: [["Kitchen Sinks", "kitchen-sinks"]] },
  { label: "Brands", href: "/brands" },
] as const;
export const HOME_CATEGORIES = [
  ["Floor Tiles", "floor-tiles"], ["Wall Tiles", "wall-tiles"], ["Porcelain Tiles", "porcelain-tiles"], ["Ceramic Tiles", "ceramic-tiles"],
  ["Bathroom Tiles", "bathroom-tiles"], ["Kitchen Tiles", "kitchen-tiles"], ["Sanitary Ware", "sanitary-ware"], ["Wash Basins", "wash-basins"],
  ["Toilets & Commodes", "toilets-commodes"], ["Bathroom Fittings", "bathroom-fittings"], ["Showers & Faucets", "showers-faucets"],
  ["Kitchen Sinks", "kitchen-sinks"], ["Accessories & Other", "accessories"],
] as const;
export const MAIN_CATEGORY_PAGES: Record<string, { title: string; blurb: string }> = {
  tiles: { title: "Tiles", blurb: "Floor, wall, porcelain and ceramic tiles for every room." },
  "sanitary-ware": { title: "Sanitary Ware", blurb: "Wash basins, toilets and commodes." },
  "bathroom-fittings": { title: "Bathroom Fittings", blurb: "Showers, faucets and finishing fittings." },
  "kitchen-products": { title: "Kitchen Products", blurb: "Kitchen sinks and related products." },
};
