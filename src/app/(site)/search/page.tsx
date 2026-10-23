import { CatalogView } from "@/components/CatalogView";
import { parseFilters } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
type SP = { searchParams: Record<string, string | string[] | undefined> };
export const metadata = pageMeta({ title: "Search Results", description: "Search the MH Enterprises catalog.", path: "/search", noindex: true });
export default function SearchPage({ searchParams }: SP) {
  const filters = parseFilters(searchParams);
  return (
    <div className="container-x py-10">
      <h1 className="mb-8 text-4xl sm:text-5xl">{filters.q ? `Results for “${filters.q}”` : "Search products"}</h1>
      <CatalogView filters={filters} basePath="/search" />
    </div>
  );
}
