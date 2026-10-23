# MH Enterprises — Tiles, Sanitary Ware & Ceramics

Next.js 14.2.15 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres, Auth, Storage) · Zod · React Hook Form · Lucide.

> **Status:** this code was written without network access, so `npm install`, `npm run build`, linting and browser testing have **not** been run. Run the checklist in "First run" and expect to fix a few small type/lint issues.

## 1. Local setup
1. `npm install`
2. `cp .env.example .env.local`
3. **Demo mode:** leave Supabase variables empty and run `npm run dev` → the public site works with clearly labelled *sample* products. The admin needs Supabase.
4. **Real mode:** create a free Supabase project, then fill `.env.local` (Project Settings → API: URL and anon key). Only the anon key is used; no service-role key exists anywhere in this project.

## 2. Database
In Supabase → SQL Editor run, in order:
1. `supabase/migrations/001_schema.sql` (tables, indexes, search trigger, RLS, storage bucket + policies)
2. `supabase/seed.sql` (your category structure; no fake products)

## 3. Create the first administrator
1. Supabase → Authentication → Users → *Add user* (email + strong password, tick auto-confirm). Disable public sign-ups under Authentication → Providers → Email.
2. SQL Editor: `update public.profiles set role = 'admin' where email = 'you@example.com';`
3. Open `/admin/login`. Roles can only be changed with SQL by the project owner; there is no in-app way to self-promote.

Security model: `/admin/*` is gated by middleware, every admin page and server action calls `requireAdmin()`, input is validated with Zod on the server, uploads are limited to JPG/PNG/WebP/AVIF ≤ 5 MB, and Row Level Security allows writes only when `is_admin()` is true.

## 4. Managing the catalog
- **Admin → Settings:** business name, logo, phone, **WhatsApp number (digits, e.g. 923001234567)**, email, address, city, hours, social links, announcement bar, SEO defaults. Footer, contact page, WhatsApp buttons and structured data all read from here; empty fields are simply not shown.
- **Categories/Brands:** add, edit, reorder (Order field), delete. A category in use cannot be deleted until its products and subcategories are reassigned.
- **Add product:** fill the form, add specs as `Name: value` lines (tile thickness, pieces per box, flush type, warranty… — only what you enter appears), upload images, choose Draft or Published. Draft products are invisible publicly (enforced by RLS).
- **Images:** reorder, replace, delete on the product edit page. First image is the main image.
- **CSV:** Admin → Import / export. Download the template, fill it, upload. Invalid prices and duplicate SKUs are reported per row and skipped.
- **Inquiries:** contact-form submissions are stored and shown in Admin → Inquiries.

## 5. Things you must supply
Real photos (hero/gallery/products), brand logos you are allowed to use, address/phone/WhatsApp. The hero uses a tile-swatch mosaic in place of a photo; the inspiration gallery stays hidden until you add images to `GALLERY` in `src/app/(site)/page.tsx`. Local-SEO wording (e.g. "Tiles and Sanitary Store in Karachi") should only be added once you confirm the city/service area; set City in Settings and add the wording to About/home copy.

## 6. Deploy (Vercel + Supabase)
1. Push to GitHub, import in Vercel.
2. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (your final https URL), optional `NEXT_PUBLIC_GA_ID`.
3. Supabase → Authentication → URL Configuration: set Site URL to the same domain.
4. Custom domain: Vercel → Settings → Domains → add domain, create the DNS records Vercel shows, then update `NEXT_PUBLIC_SITE_URL` and redeploy.
5. **Search Console:** add the domain property, verify via DNS TXT, submit `https://yourdomain/sitemap.xml`. **Analytics:** set `NEXT_PUBLIC_GA_ID` (GA4 `G-XXXX`).

## 7. First-run checklist (not yet performed)
`npm run typecheck && npm run lint && npm run build`, then test: all public pages, combined filters, product detail, add/edit/delete product, image upload/removal, categories/brands, CSV import/export, contact form, WhatsApp links, mobile layout, draft products hidden when logged out, Lighthouse.

## Known limitations
- Contact inquiries are saved to the database; email notification is not implemented (add Resend/SMTP in `src/app/(site)/contact/actions.ts`).
- Spam protection is a honeypot + minimum-fill-time check; add Cloudflare Turnstile/rate limiting if spam appears.
- Product filters are a server-rendered form (Apply button) rather than live-updating.
- Legal pages are generic templates, not legal advice.
- Prices display in PKR; change in `src/lib/utils.ts` / `seo.ts` if needed.
# MH_Enterprizes_store
