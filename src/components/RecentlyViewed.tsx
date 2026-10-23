"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
type Item = { slug: string; name: string };
const KEY = "mh-recent";
export function RecentlyViewed({ current }: { current: Item }) {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    try {
      const all: Item[] = JSON.parse(localStorage.getItem(KEY) || "[]");
      setItems(all.filter((i) => i.slug !== current.slug).slice(0, 5));
      localStorage.setItem(KEY, JSON.stringify([current, ...all.filter((i) => i.slug !== current.slug)].slice(0, 10)));
    } catch { /* storage unavailable */ }
  }, [current]);
  if (!items.length) return null;
  return <section aria-labelledby="recent" className="mt-16"><h2 id="recent" className="text-3xl">Recently viewed</h2><ul className="mt-4 flex flex-wrap gap-2">{items.map((i) => <li key={i.slug}><Link href={`/products/${i.slug}`} className="inline-block border border-line px-3 py-2 text-sm hover:border-gold">{i.name}</Link></li>)}</ul></section>;
}
