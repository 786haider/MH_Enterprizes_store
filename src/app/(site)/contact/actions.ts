"use server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/config";
import { contactSchema, type ContactInput } from "@/lib/validation";

export async function submitInquiry(input: ContactInput): Promise<{ ok: boolean; message: string }> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const d = parsed.data;
  // Spam protection: honeypot + minimum fill time. (Add a CAPTCHA/rate limit at the edge for heavier traffic.)
  if (d.website) return { ok: true, message: "Thank you! We will contact you soon." };
  if (d.startedAt && Date.now() - d.startedAt < 3000) return { ok: false, message: "That was very fast — please try again." };
  if (!hasSupabase) return { ok: false, message: "Demo mode: connect Supabase to receive inquiries." };
  const { error } = await createClient().from("inquiries").insert({ name: d.name, phone: d.phone, email: d.email || null, inquiry_type: d.inquiry_type, message: d.message, product_ref: d.product_ref || null });
  if (error) return { ok: false, message: "We couldn’t send your inquiry. Please try again or contact us on WhatsApp." };
  return { ok: true, message: "Thank you! Your inquiry has been received and we will contact you soon." };
}
