import Link from "next/link";
import type { Brand, Category, ProductFilters as F } from "@/types";

type Facets = { sizes: string[]; colors: string[]; finishes: string[]; materials: string[]; grades: string[] };
const Select = ({ name, label, options, value }: { name: string; label: string; options: string[]; value?: string }) => (
  <div><label htmlFor={`f-${name}`} className="label">{label}</label>
    <select id={`f-${name}`} name={name} defaultValue={value ?? ""} className="input"><option value="">Any</option>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
);
/** Server-rendered GET form: filters combine, are shareable in the URL, and work without JS. */
export function ProductFilters({ basePath, filters, categories, brands, facets }: { basePath: string; filters: F; categories: Category[]; brands: Brand[]; facets: Facets }) {
  const mains = categories.filter((c) => !c.parent_id);
  return (
    <details className="border border-line bg-white lg:open:block" open>
      <summary className="flex min-h-[48px] cursor-pointer items-center px-4 font-serif text-xl text-navy transition-colors hover:text-gold-dark lg:pointer-events-none">Filters</summary>
      <form method="get" action={basePath} className="space-y-4 border-t border-line p-4">
        <div><label htmlFor="f-q" className="label">Search</label><input id="f-q" name="q" defaultValue={filters.q} className="input" placeholder="Name, SKU, brand…" /></div>
        <div><label htmlFor="f-category" className="label">Category</label>
          <select id="f-category" name="category" defaultValue={filters.category ?? ""} className="input"><option value="">All categories</option>
            {mains.map((m) => <optgroup key={m.id} label={m.name}><option value={m.slug}>All {m.name}</option>{categories.filter((c) => c.parent_id === m.id).map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</optgroup>)}</select></div>
        <div><label htmlFor="f-brand" className="label">Brand</label>
          <select id="f-brand" name="brand" defaultValue={filters.brand ?? ""} className="input"><option value="">All brands</option>{brands.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}</select></div>
        <Select name="size" label="Size" options={facets.sizes} value={filters.size} />
        <Select name="color" label="Color" options={facets.colors} value={filters.color} />
        <Select name="finish" label="Finish" options={facets.finishes} value={filters.finish} />
        <Select name="material" label="Material" options={facets.materials} value={filters.material} />
        <Select name="grade" label="Quality / grade" options={facets.grades} value={filters.grade} />
        <div className="grid grid-cols-2 gap-2">
          <div><label htmlFor="f-min" className="label">Min price</label><input id="f-min" name="minPrice" type="number" min={0} step="any" defaultValue={filters.minPrice} className="input" /></div>
          <div><label htmlFor="f-max" className="label">Max price</label><input id="f-max" name="maxPrice" type="number" min={0} step="any" defaultValue={filters.maxPrice} className="input" /></div>
        </div>
        <div><label htmlFor="f-av" className="label">Availability</label>
          <select id="f-av" name="availability" defaultValue={filters.availability ?? ""} className="input"><option value="">Any</option><option value="in_stock">In stock</option><option value="low_stock">Low stock</option><option value="on_order">Available on order</option><option value="out_of_stock">Out of stock</option></select></div>
        <div><label htmlFor="f-sort" className="label">Sort by</label>
          <select id="f-sort" name="sort" defaultValue={filters.sort ?? "newest"} className="input"><option value="newest">Newest</option><option value="name">Name (A–Z)</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></div>
        <div className="flex gap-2"><button type="submit" className="btn-gold flex-1">Apply filters</button><Link href={basePath} className="btn-outline">Clear all</Link></div>
      </form>
    </details>
  );
}
