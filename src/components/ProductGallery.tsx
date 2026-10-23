"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Expand, X } from "lucide-react";
import type { ProductImage as Img } from "@/types";
import { ProductImage } from "./ProductImage";

export function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); if (e.key === "ArrowRight") setI((x) => (x + 1) % images.length); if (e.key === "ArrowLeft") setI((x) => (x - 1 + images.length) % images.length); };
    document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k);
  }, [open, images.length]);
  const cur = images[i];
  return (
    <div>
      <div className="relative aspect-square overflow-hidden border border-line bg-paper">
        <ProductImage src={cur?.url} alt={cur?.alt || name} sizes="(min-width:1024px) 50vw, 100vw" priority />
        {cur && <button type="button" onClick={() => setOpen(true)} aria-label="Expand image" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center bg-white/90 text-navy hover:bg-white"><Expand size={18} /></button>}
      </div>
      {images.length > 1 && <ul className="mt-3 flex gap-2 overflow-x-auto">{images.map((im, n) => (
        <li key={im.url}><button type="button" onClick={() => setI(n)} aria-label={`Show image ${n + 1}`} aria-current={n === i} className={`relative block h-20 w-20 overflow-hidden border-2 ${n === i ? "border-gold" : "border-line"}`}><Image src={im.url} alt="" fill sizes="80px" className="object-cover" /></button></li>))}</ul>}
      {open && cur && (
        <div role="dialog" aria-modal="true" aria-label={`${name} image`} className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/95 p-4" onClick={() => setOpen(false)}>
          <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-white"><X /></button>
          <div className="relative h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}><Image src={cur.url} alt={cur.alt || name} fill sizes="100vw" className="object-contain" /></div>
        </div>)}
    </div>
  );
}
