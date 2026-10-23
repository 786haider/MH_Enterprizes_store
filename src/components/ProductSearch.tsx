"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
export function ProductSearch({ initial = "", large = false }: { initial?: string; large?: boolean }) {
  const [q, setQ] = useState(initial);
  const router = useRouter();
  return (
    <form role="search" onSubmit={(e) => { e.preventDefault(); const v = q.trim(); if (v) router.push(`/search?q=${encodeURIComponent(v)}`); }} className="relative w-full">
      <label htmlFor={large ? "search-lg" : undefined} className="sr-only">Search products</label>
      <input id={large ? "search-lg" : undefined} value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search name, SKU, brand, size…" className="input pr-11" maxLength={100} />
      <button type="submit" aria-label="Search" className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-navy"><Search size={18} /></button>
    </form>
  );
}
