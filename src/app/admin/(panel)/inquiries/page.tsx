import { requireAdmin } from "@/lib/auth";
import { deleteInquiry, toggleInquiry } from "../../actions";
import { ConfirmButton } from "@/components/admin/Bits";
export default async function InquiriesAdmin() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(200);
  return <div className="max-w-4xl"><h1 className="text-4xl">Customer inquiries</h1>
    <ul className="mt-6 space-y-3">{(data ?? []).map((i) => <li key={i.id} className={`border bg-white p-4 text-sm ${i.handled ? "border-line opacity-70" : "border-gold"}`}>
      <p className="font-semibold text-navy">{i.name} · <a href={`tel:${i.phone}`} className="underline">{i.phone}</a>{i.email && <> · <a href={`mailto:${i.email}`} className="underline">{i.email}</a></>}</p>
      <p className="text-xs text-muted">{new Date(i.created_at).toLocaleString()} · {i.inquiry_type}{i.product_ref ? ` · Product: ${i.product_ref}` : ""}</p>
      <p className="mt-2 whitespace-pre-line">{i.message}</p>
      <div className="mt-3 flex gap-4"><form action={toggleInquiry}><input type="hidden" name="id" value={i.id} /><input type="hidden" name="value" value={String(!i.handled)} /><button className="underline">{i.handled ? "Mark as open" : "Mark as handled"}</button></form>
        <form action={deleteInquiry}><input type="hidden" name="id" value={i.id} /><ConfirmButton message="Delete this inquiry?" className="text-red-700 underline">Delete</ConfirmButton></form></div></li>)}
      {!data?.length && <li className="text-muted">No inquiries yet.</li>}</ul></div>;
}
