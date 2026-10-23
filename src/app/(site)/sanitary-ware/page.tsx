import { CategoryLanding, categoryMetadata } from "@/components/CategoryLanding";
type SP = { searchParams: Record<string, string | string[] | undefined> };
export const generateMetadata = () => categoryMetadata("sanitary-ware");
export default function Page({ searchParams }: SP) { return <CategoryLanding slug="sanitary-ware" searchParams={searchParams} />; }
