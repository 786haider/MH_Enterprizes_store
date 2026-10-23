"use client";
import { useFormState, useFormStatus } from "react-dom";
import type { FormState } from "@/app/admin/actions";

export function Submit({ children, className = "btn-gold" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={className}>{pending ? "Working…" : children}</button>;
}
export function ConfirmButton({ message, children, className = "btn-outline !text-red-700 !border-red-300" }: { message: string; children: React.ReactNode; className?: string }) {
  return <button type="submit" className={className} onClick={(e) => { if (!window.confirm(message)) e.preventDefault(); }}>{children}</button>;
}
export function Notice({ msg, error }: { msg?: string; error?: string }) {
  if (!msg && !error) return null;
  return <p role={error ? "alert" : "status"} className={`mb-4 border px-4 py-3 text-sm ${error ? "border-red-300 bg-red-50 text-red-800" : "border-green-300 bg-green-50 text-green-800"}`}>{error ?? msg}</p>;
}
export function ActionForm({ action, children, className }: { action: (s: FormState, fd: FormData) => Promise<FormState>; children: React.ReactNode; className?: string }) {
  const [state, formAction] = useFormState(action, {} as FormState);
  return <form action={formAction} className={className}>{state.error && <Notice error={state.error} />}{state.ok && <Notice msg={state.ok} />}
    {state.errors?.length ? <ul className="mb-4 max-h-48 overflow-auto border border-line bg-paper p-3 text-xs">{state.errors.map((e) => <li key={e}>{e}</li>)}</ul> : null}{children}</form>;
}
