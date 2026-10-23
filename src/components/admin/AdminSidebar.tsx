import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";
const LINKS = [["Dashboard", "/admin"], ["Products", "/admin/products"], ["Add product", "/admin/products/new"], ["Categories", "/admin/categories"], ["Brands", "/admin/brands"], ["Inquiries", "/admin/inquiries"], ["Import / export", "/admin/import"], ["Store settings", "/admin/settings"]];
export function AdminSidebar() {
  return (
    <aside className="bg-navy text-white lg:min-h-screen lg:w-60 lg:shrink-0">
      <div className="flex items-center gap-3 p-4"><span className="bg-white p-1"><Image src="/logo.png" alt="MH Enterprises" width={40} height={40} className="h-10 w-10" /></span><span className="font-serif text-lg">Admin</span></div>
      <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-2 pb-3 lg:block lg:space-y-1">
        {LINKS.map(([l, h]) => <Link key={h} href={h} className="block whitespace-nowrap px-3 py-2 text-sm hover:bg-navy-2">{l}</Link>)}
        <Link href="/" target="_blank" className="block whitespace-nowrap px-3 py-2 text-sm text-gold-light hover:bg-navy-2">View website</Link>
        <form action={signOut}><button className="block w-full px-3 py-2 text-left text-sm hover:bg-navy-2">Sign out</button></form>
      </nav>
    </aside>
  );
}
