import { getSettings } from "@/lib/queries";
import { orgLd } from "@/lib/seo";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AnnouncementBar } from "./AnnouncementBar";
import { FloatingWhatsApp } from "./WhatsAppButton";
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (<>
    <AnnouncementBar text={settings.announcement} />
    <Header settings={settings} />
    <main id="main">{children}</main>
    <Footer settings={settings} />
    <FloatingWhatsApp settings={settings} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd(settings)) }} />
  </>);
}
