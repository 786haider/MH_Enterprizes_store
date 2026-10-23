import Link from "next/link";
export function Breadcrumbs({ items }: { items: { name: string; path?: string }[] }) {
  return <nav aria-label="Breadcrumb" className="text-sm text-muted"><ol className="flex flex-wrap items-center gap-x-2">
    {items.map((it, i) => <li key={i} className="flex items-center gap-2">{it.path ? <Link href={it.path} className="hover:text-gold-dark">{it.name}</Link> : <span aria-current="page" className="text-navy">{it.name}</span>}{i < items.length - 1 && <span aria-hidden>/</span>}</li>)}
  </ol></nav>;
}
