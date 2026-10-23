import { LegalPage } from "@/components/LegalPage";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({ title: "Privacy Policy", description: "How MH Enterprises collects and uses your information.", path: "/privacy-policy" });
export default function Page() {
  return <LegalPage title="Privacy policy">
    <p>When you send an inquiry we collect the details you provide (name, phone number, optional email, message and product reference) so we can respond to you.</p>
    <h2>How we use information</h2><p>We use inquiry details only to reply to your request and manage product inquiries. We do not sell your personal information.</p>
    <h2>Cookies and analytics</h2><p>The site stores a small list of recently viewed products in your browser. If analytics is enabled, anonymous usage data may be collected.</p>
    <h2>Your choices</h2><p>Contact us to request correction or deletion of your inquiry details.</p></LegalPage>;
}
