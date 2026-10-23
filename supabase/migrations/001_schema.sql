-- MH Enterprises schema. Run in Supabase SQL Editor (or `supabase db push`).
create extension if not exists pg_trgm;

-- ---------- Profiles & roles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'viewer' check (role in ('viewer','admin')),
  created_at timestamptz not null default now()
);
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role) values (new.id, new.email, 'viewer');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- Categories & brands ----------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.categories(id) on delete restrict,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index categories_parent_idx on public.categories(parent_id);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  website text,
  created_at timestamptz not null default now()
);

-- ---------- Products ----------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text not null unique,
  slug text not null unique,
  category_id uuid references public.categories(id) on delete restrict,
  subcategory_id uuid references public.categories(id) on delete restrict,
  brand_id uuid references public.brands(id) on delete set null,
  manufacturer text,
  model_number text,
  description text,
  material text,
  grade text,
  color text,
  available_colors text[] not null default '{}',
  size text,
  unit text,
  finish text,
  style text,
  price numeric(12,2) check (price is null or price >= 0),
  discount_price numeric(12,2) check (discount_price is null or discount_price >= 0),
  price_unit text,
  stock_status text check (stock_status in ('in_stock','low_stock','out_of_stock','on_order')),
  quantity int check (quantity is null or quantity >= 0),
  min_order_qty int check (min_order_qty is null or min_order_qty > 0),
  featured boolean not null default false,
  new_arrival boolean not null default false,
  -- Category-specific attributes, e.g. {"Thickness":"9 mm","Pieces per box":"4","Flush type":"Dual"}
  specs jsonb not null default '{}'::jsonb,
  care_instructions text,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft','published')),
  search_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (discount_price is null or price is null or discount_price <= price)
);
create index products_status_idx on public.products(status);
create index products_category_idx on public.products(category_id);
create index products_subcategory_idx on public.products(subcategory_id);
create index products_brand_idx on public.products(brand_id);
create index products_featured_idx on public.products(featured) where featured;
create index products_created_idx on public.products(created_at desc);
create index products_price_idx on public.products(price);
create index products_search_trgm on public.products using gin (search_text gin_trgm_ops);

-- Denormalised searchable text (name, sku, brand, manufacturer, category, specs...).
create or replace function public.products_build_search() returns trigger language plpgsql as $$
declare b text; c text; sc text;
begin
  select name into b from public.brands where id = new.brand_id;
  select name into c from public.categories where id = new.category_id;
  select name into sc from public.categories where id = new.subcategory_id;
  new.search_text := lower(concat_ws(' ', new.name, new.sku, new.model_number, b, new.manufacturer, c, sc,
    new.description, new.material, new.grade, new.color, array_to_string(new.available_colors,' '),
    new.size, new.finish, new.style, new.specs::text));
  new.updated_at := now();
  return new;
end $$;
create trigger products_search_trg before insert or update on public.products
  for each row execute function public.products_build_search();

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  storage_path text,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index product_images_product_idx on public.product_images(product_id, sort_order);

-- Keeps old slugs so renamed products redirect (301) instead of 404.
create table public.slug_redirects (
  old_slug text primary key,
  product_id uuid not null references public.products(id) on delete cascade
);

-- ---------- Settings (single row) ----------
create table public.store_settings (
  id int primary key default 1 check (id = 1),
  business_name text not null default 'MH Enterprises',
  tagline text default 'Premium Tiles, Sanitary Ware & Ceramics',
  logo_url text,
  phone text, whatsapp text, email text, address text, city text, hours text,
  facebook text, instagram text, map_embed_url text,
  announcement text,
  seo_title text, seo_description text,
  updated_at timestamptz not null default now()
);
insert into public.store_settings (id) values (1);

-- ---------- Inquiries ----------
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  inquiry_type text,
  message text not null,
  product_ref text,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.slug_redirects enable row level security;
alter table public.store_settings enable row level security;
alter table public.inquiries enable row level security;

create policy "own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
-- (no insert/update policy: roles can only be changed with SQL by the project owner)

create policy "public read categories" on public.categories for select using (true);
create policy "admin write categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "public read brands" on public.brands for select using (true);
create policy "admin write brands" on public.brands for all using (public.is_admin()) with check (public.is_admin());

create policy "public read published products" on public.products for select using (status = 'published' or public.is_admin());
create policy "admin write products" on public.products for all using (public.is_admin()) with check (public.is_admin());

create policy "public read images of published products" on public.product_images for select
  using (public.is_admin() or exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy "admin write images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());

create policy "public read redirects" on public.slug_redirects for select using (true);
create policy "admin write redirects" on public.slug_redirects for all using (public.is_admin()) with check (public.is_admin());

create policy "public read settings" on public.store_settings for select using (true);
create policy "admin update settings" on public.store_settings for update using (public.is_admin()) with check (public.is_admin());

create policy "anyone can submit inquiry" on public.inquiries for insert
  with check (char_length(name) between 1 and 120 and char_length(message) between 5 and 3000 and handled = false);
create policy "admin read inquiries" on public.inquiries for select using (public.is_admin());
create policy "admin update inquiries" on public.inquiries for update using (public.is_admin()) with check (public.is_admin());
create policy "admin delete inquiries" on public.inquiries for delete using (public.is_admin());

-- ---------- Storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images','product-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;

create policy "public read product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "admin upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "admin update product images" on storage.objects for update using (bucket_id = 'product-images' and public.is_admin());
create policy "admin delete product images" on storage.objects for delete using (bucket_id = 'product-images' and public.is_admin());
