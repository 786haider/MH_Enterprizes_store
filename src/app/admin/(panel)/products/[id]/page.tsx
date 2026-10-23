import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";
import { ConfirmButton, Notice } from "@/components/admin/Bits";
import { deleteImage, moveImage, replaceImage } from "../../../actions";
import type { Brand, Category, Product } from "@/types";
export default async function EditProduct({ params, searchParams }: { params: { id: string }; searchParams: { msg?: string; error?: string } }) {
  const { supabase } = await requireAdmin();
  const { data: p } = await supabase.from("products").select("*, images:product_images(id,url,alt,sort_order)").eq("id", params.id).maybeSingle();
  if (!p) notFound();
  const product = { ...p, images: [...(p.images ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order) } as Product;
  const [{ data: c }, { data: b }] = await Promise.all([supabase.from("categories").select("*").order("sort_order"), supabase.from("brands").select("*").order("name")]);
  return <div className="max-w-4xl"><div className="mb-6 flex items-center justify-between"><h1 className="text-4xl">Edit product</h1>{product.status === "published" && <Link href={`/products/${product.slug}`} target="_blank" className="btn-outline">View on site</Link>}</div>
    <Notice msg={searchParams.msg} error={searchParams.error} />
    <ProductForm product={product} categories={(c ?? []) as Category[]} brands={(b ?? []) as Brand[]} />
    <section className="mt-12" aria-labelledby="imgs"><h2 id="imgs" className="text-2xl">Manage images</h2>
      {product.images.length === 0 && <p className="mt-2 text-sm text-muted">No images yet. Upload some using the form above.</p>}
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{product.images.map((im, i) => (
        <li key={im.id} className="border border-line bg-white p-3"><div className="relative aspect-square"><Image src={im.url} alt={im.alt ?? ""} fill sizes="250px" className="object-cover" /></div>
          <p className="mt-2 text-xs text-muted">{i === 0 ? "Main image" : `Image ${i + 1}`}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {i > 0 && <form action={moveImage}><input type="hidden" name="id" value={im.id} /><input type="hidden" name="product_id" value={product.id} /><input type="hidden" name="dir" value="up" /><button className="underline">Move earlier</button></form>}
            {i < product.images.length - 1 && <form action={moveImage}><input type="hidden" name="id" value={im.id} /><input type="hidden" name="product_id" value={product.id} /><input type="hidden" name="dir" value="down" /><button className="underline">Move later</button></form>}
            <form action={deleteImage}><input type="hidden" name="id" value={im.id} /><input type="hidden" name="product_id" value={product.id} /><ConfirmButton message="Remove this image?" className="text-red-700 underline">Delete</ConfirmButton></form></div>
          <form action={replaceImage} className="mt-2 flex gap-2"><input type="hidden" name="id" value={im.id} /><input type="hidden" name="product_id" value={product.id} /><input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/avif" aria-label="Replacement image" className="w-full text-xs" /><button className="btn-outline !min-h-[32px] !px-2 text-xs">Replace</button></form></li>))}</ul></section></div>;
}
