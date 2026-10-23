export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 90);
export const formatPrice = (n: number) => new Intl.NumberFormat("en-PK", { maximumFractionDigits: 2 }).format(n);
export const PRICE_CURRENCY = "PKR";
export const str = (v: FormDataEntryValue | null) => (typeof v === "string" && v.trim() ? v.trim() : null);
