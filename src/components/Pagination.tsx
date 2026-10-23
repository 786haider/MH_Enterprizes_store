import Link from "next/link";
export function Pagination({ page, pages, basePath, params }: { page: number; pages: number; basePath: string; params: Record<string, string | undefined> }) {
  if (pages <= 1) return null;
  const href = (p: number) => { const u = new URLSearchParams(); Object.entries(params).forEach(([k, v]) => v && k !== "page" && u.set(k, v)); if (p > 1) u.set("page", String(p)); const s = u.toString(); return s ? `${basePath}?${s}` : basePath; };
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  return <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
    {page > 1 && <Link href={href(page - 1)} rel="prev" className="btn-outline !px-3">Previous</Link>}
    {nums.map((n, i) => <span key={n} className="flex items-center gap-2">{i > 0 && nums[i - 1] !== n - 1 && <span aria-hidden>…</span>}
      <Link href={href(n)} aria-current={n === page ? "page" : undefined} className={n === page ? "btn-navy !px-3" : "btn-outline !px-3"}>{n}</Link></span>)}
    {page < pages && <Link href={href(page + 1)} rel="next" className="btn-outline !px-3">Next</Link>}
  </nav>;
}
