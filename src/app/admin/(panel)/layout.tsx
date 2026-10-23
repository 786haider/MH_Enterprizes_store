import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
export const metadata: Metadata = { title: { absolute: "Admin | MH Enterprises" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <div className="flex min-h-screen flex-col bg-paper lg:flex-row"><AdminSidebar /><div className="flex-1 p-4 sm:p-8">{children}</div></div>;
}
