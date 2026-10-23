import { LegalPage } from "@/components/LegalPage";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({ title: "Terms and Conditions", description: "Terms of use for the MH Enterprises website.", path: "/terms-and-conditions" });
export default function Page() {
  return <LegalPage title="Terms and conditions">
    <h2>Product information</h2><p>We aim to keep product details accurate, but colors, shades and finishes can differ from on-screen images. Please confirm details before purchase.</p>
    <h2>Prices and availability</h2><p>Prices and stock can change. Contact us for the latest price and availability; an inquiry is not an order or a guarantee of supply.</p>
    <h2>Use of this website</h2><p>Content on this site belongs to MH Enterprises or its respective owners and may not be copied without permission.</p></LegalPage>;
}
