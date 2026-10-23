import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@/types";
export function BrandCard({ brand }: { brand: Brand }) {
  return <Link href={`/brands/${brand.slug}`} className="flex h-28 items-center justify-center border border-line bg-white p-4 text-center transition duration-300 ease-out hover:-translate-y-1 hover:border-gold hover:shadow-soft">
    {brand.logo_url ? <Image src={brand.logo_url} alt={brand.name} width={160} height={80} className="max-h-16 w-auto object-contain" /> : <span className="font-serif text-xl text-navy">{brand.name}</span>}</Link>;
}
