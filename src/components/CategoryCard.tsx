import Link from "next/link";
const SWATCH = ["#F2F0EC", "#8E9096", "#D9C9A8", "#102C50", "#E4E7EC", "#B58A35"];
export function CategoryCard({ name, slug, index, image }: { name: string; slug: string; index: number; image?: string }) {
  const dark = [3, 5].includes(index % 6);
  return (
    <Link href={`/products?category=${slug}`} className="group relative flex aspect-[4/3] items-end overflow-hidden border border-line p-4" style={image ? { backgroundImage: `url(${image})`, backgroundSize: "cover" } : { backgroundColor: SWATCH[index % 6] }}>
      {!image && <span aria-hidden className="absolute inset-0 opacity-30 [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:50%_50%]" />}
      <span className={`relative font-serif text-2xl font-semibold leading-tight ${dark ? "text-white" : "text-navy"}`}>{name}<span className="mt-2 block h-0.5 w-8 bg-gold transition-all group-hover:w-16" /></span>
    </Link>
  );
}
