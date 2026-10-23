import { CategoryLanding, categoryMetadata } from "@/components/CategoryLanding";
type SP = { searchParams: Record<string, string | string[] | undefined> };
export const generateMetadata = () => categoryMetadata("kitchen-products");
export default function Page({ searchParams }: SP) { return <CategoryLanding slug="kitchen-products" searchParams={searchParams} />; }
