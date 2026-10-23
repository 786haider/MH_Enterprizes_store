import { CategoryLanding, categoryMetadata } from "@/components/CategoryLanding";
type SP = { searchParams: Record<string, string | string[] | undefined> };
export const generateMetadata = () => categoryMetadata("bathroom-fittings");
export default function Page({ searchParams }: SP) { return <CategoryLanding slug="bathroom-fittings" searchParams={searchParams} />; }
