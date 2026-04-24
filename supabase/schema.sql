-- Iron Infidel Ops Platform — Database Schema

-- ─────────────────────────────────────────────
-- MANUFACTURERS
-- ─────────────────────────────────────────────
create table manufacturers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_email text,
  notes text,
  created_at timestamptz default now()
);

insert into manufacturers (name) values
  ('Bottle Manufacturer'),
  ('Patch Manufacturer'),
  ('Sleeve Manufacturer');

-- ─────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────
create table products (
  id uuid primary key default gen_random_uuid(),
  asin text unique not null,
  name text not null,
  product_line text not null,
  sales_pct numeric(5,2) default 0,
  units_per_carton integer,
  cbm_per_carton numeric(8,4),
  moq integer,
  low_stock_threshold integer default 50,
  requires_patch boolean default true,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- MANUFACTURER SKU MAPPING
-- Each product gets one row per manufacturer it involves.
-- Bottles: 2 rows (bottle mfr + patch mfr)
-- Sleeves: 2 rows (sleeve mfr + patch mfr)
-- ─────────────────────────────────────────────
create table manufacturer_sku_map (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  manufacturer_id uuid references manufacturers(id) on delete cascade,
  manufacturer_sku text not null,
  created_at timestamptz default now(),
  unique(product_id, manufacturer_id)
);

-- ─────────────────────────────────────────────
-- INVENTORY SNAPSHOTS (daily, per SKU)
-- ─────────────────────────────────────────────
create table inventory_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null,
  product_id uuid references products(id) on delete cascade,
  fba_qty integer default 0,
  awd_qty integer default 0,
  g10_qty integer default 0,
  total_qty integer generated always as (fba_qty + awd_qty + g10_qty) stored,
  created_at timestamptz default now(),
  unique(snapshot_date, product_id)
);

-- ─────────────────────────────────────────────
-- G10 LATEST (most recent push from G10 webhook)
-- ─────────────────────────────────────────────
create table g10_latest (
  id uuid primary key default gen_random_uuid(),
  item_id text unique not null,
  available_qty integer not null,
  received_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- FORECASTS (per SKU, updated periodically)
-- ─────────────────────────────────────────────
create table forecasts (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  forecast_date date not null,
  low integer,
  mid integer,
  high integer,
  created_at timestamptz default now(),
  unique(product_id, forecast_date)
);

-- ─────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────
create type order_scenario as enum ('low', 'mid', 'high');
create type order_status as enum ('draft', 'submitted', 'confirmed');
create type container_type as enum ('20ft', '40ft', '40hq', '45hq');

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_date date not null default current_date,
  scenario order_scenario not null default 'mid',
  status order_status not null default 'draft',
  cbm_total numeric(8,2),
  container_recommendation container_type,
  notes text,
  created_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- ORDER LINE ITEMS
-- ─────────────────────────────────────────────
create table order_line_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  qty_ordered integer not null default 0,
  cartons numeric(8,2),
  cbm numeric(8,4),
  created_at timestamptz default now(),
  unique(order_id, product_id)
);

-- ─────────────────────────────────────────────
-- CONFIG (key/value store for system settings)
-- ─────────────────────────────────────────────
create table config (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

insert into config (key, value) values
  ('report_recipients', 'mike@ironinfidel.com,jackson@ironinfidel.com'),
  ('report_time_et', '05:00'),
  ('g10_push_time_et', '04:00'),
  ('container_20ft_cbm', '33'),
  ('container_40ft_cbm', '67.6'),
  ('container_40hq_cbm', '76.4'),
  ('container_45hq_cbm', '86');

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- Enable RLS on all tables (auth handled by Supabase Auth)
-- ─────────────────────────────────────────────
alter table manufacturers enable row level security;
alter table products enable row level security;
alter table manufacturer_sku_map enable row level security;
alter table inventory_snapshots enable row level security;
alter table g10_latest enable row level security;
alter table forecasts enable row level security;
alter table orders enable row level security;
alter table order_line_items enable row level security;
alter table config enable row level security;

-- Allow authenticated users full access to all tables
create policy "authenticated_full_access" on manufacturers for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on products for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on manufacturer_sku_map for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on inventory_snapshots for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on g10_latest for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on forecasts for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on orders for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on order_line_items for all to authenticated using (true) with check (true);
create policy "authenticated_full_access" on config for all to authenticated using (true) with check (true);
