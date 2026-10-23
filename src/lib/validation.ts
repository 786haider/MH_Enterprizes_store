import { z } from "zod";
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(25).regex(/^[+\d][\d\s()-]+$/, "Use digits, spaces, + or -"),
  email: z.string().trim().email("Enter a valid email").max(160).optional().or(z.literal("")),
  inquiry_type: z.enum(["Product inquiry", "Price & availability", "Bulk order", "General question"]),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(3000),
  product_ref: z.string().trim().max(120).optional().or(z.literal("")),
  website: z.string().max(0).optional(), // honeypot: must stay empty
  startedAt: z.number().optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

const optNum = z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().nonnegative().nullable());
const optInt = z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().nonnegative().nullable());
const optStr = z.preprocess((v) => (typeof v === "string" && v.trim() ? v.trim() : null), z.string().max(5000).nullable());
export const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200),
  sku: z.string().trim().min(1, "SKU is required").max(80),
  category_id: optStr, subcategory_id: optStr, brand_id: optStr,
  manufacturer: optStr, model_number: optStr, description: optStr, material: optStr, grade: optStr, color: optStr,
  size: optStr, unit: optStr, finish: optStr, style: optStr, price_unit: optStr, care_instructions: optStr, seo_title: optStr, seo_description: optStr,
  price: optNum, discount_price: optNum, quantity: optInt, min_order_qty: optInt,
  stock_status: z.preprocess((v) => (v ? v : null), z.enum(["in_stock", "low_stock", "out_of_stock", "on_order"]).nullable()),
  status: z.enum(["draft", "published"]),
}).refine((d) => d.discount_price == null || d.price == null || d.discount_price <= d.price, { message: "Discount price cannot exceed price", path: ["discount_price"] });
