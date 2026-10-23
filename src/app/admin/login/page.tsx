"use client";
import { ActionForm, Submit } from "@/components/admin/Bits";
import { signIn } from "../actions";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
function Inner() {
  const forbidden = useSearchParams().get("error") === "forbidden";
  return <ActionForm action={signIn} className="space-y-4">
    {forbidden && <p role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">This account is not an administrator.</p>}
    <div><label htmlFor="email" className="label">Email</label><input id="email" name="email" type="email" required autoComplete="email" className="input" /></div>
    <div><label htmlFor="password" className="label">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="input" /></div>
    <Submit className="btn-navy w-full">Sign in</Submit></ActionForm>;
}
export default function Login() {
  return <div className="flex min-h-screen items-center justify-center bg-paper p-4"><div className="w-full max-w-sm border border-line bg-white p-8 shadow-soft"><h1 className="mb-6 text-3xl">Admin sign in</h1><Suspense><Inner /></Suspense></div></div>;
}
