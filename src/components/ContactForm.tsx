"use client";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { submitInquiry } from "@/app/(site)/contact/actions";

export function ContactForm({ productRef = "" }: { productRef?: string }) {
  const started = useRef(Date.now());
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, start] = useTransition();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), defaultValues: { inquiry_type: "Product inquiry", product_ref: productRef, email: "", website: "" } });
  const err = (m?: string) => m && <p role="alert" className="field-error">{m}</p>;
  return (
    <form noValidate onSubmit={handleSubmit((v) => start(async () => { const r = await submitInquiry({ ...v, startedAt: started.current }); setResult(r); if (r.ok) reset(); }))} className="space-y-4">
      <div><label htmlFor="c-name" className="label">Name *</label><input id="c-name" className="input" autoComplete="name" {...register("name")} aria-invalid={!!errors.name} />{err(errors.name?.message)}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="c-phone" className="label">Phone number *</label><input id="c-phone" type="tel" className="input" autoComplete="tel" {...register("phone")} aria-invalid={!!errors.phone} />{err(errors.phone?.message)}</div>
        <div><label htmlFor="c-email" className="label">Email (optional)</label><input id="c-email" type="email" className="input" autoComplete="email" {...register("email")} />{err(errors.email?.message)}</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="c-type" className="label">Inquiry type</label><select id="c-type" className="input" {...register("inquiry_type")}>{["Product inquiry", "Price & availability", "Bulk order", "General question"].map((o) => <option key={o}>{o}</option>)}</select></div>
        <div><label htmlFor="c-ref" className="label">Product name or code (optional)</label><input id="c-ref" className="input" {...register("product_ref")} /></div>
      </div>
      <div><label htmlFor="c-msg" className="label">Message *</label><textarea id="c-msg" rows={5} className="input py-2" {...register("message")} aria-invalid={!!errors.message} />{err(errors.message?.message)}</div>
      <div aria-hidden className="absolute -left-[9999px]"><label>Leave empty<input tabIndex={-1} autoComplete="off" {...register("website")} /></label></div>
      <button type="submit" disabled={pending} className="btn-gold">{pending ? "Sending…" : "Send inquiry"}</button>
      {result && <p role={result.ok ? "status" : "alert"} className={result.ok ? "text-green-700" : "text-red-700"}>{result.message}</p>}
    </form>
  );
}
