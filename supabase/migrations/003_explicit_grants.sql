-- Migration 003: Explicit Data API grants for all tables
-- Required ahead of Supabase's October 30, 2026 enforcement change.
-- New projects after May 30, 2026 require explicit GRANT before tables
-- are accessible via PostgREST / supabase-js / GraphQL.
--
-- Safe to re-run — GRANT is idempotent.
-- Run this in Supabase SQL Editor.

-- ── Tables from schema.sql ───────────────────────────────────────────────────
GRANT ALL ON TABLE manufacturers        TO anon, authenticated, service_role;
GRANT ALL ON TABLE products             TO anon, authenticated, service_role;
GRANT ALL ON TABLE manufacturer_sku_map TO anon, authenticated, service_role;
GRANT ALL ON TABLE inventory_snapshots  TO anon, authenticated, service_role;
GRANT ALL ON TABLE g10_latest           TO anon, authenticated, service_role;
GRANT ALL ON TABLE forecasts            TO anon, authenticated, service_role;
GRANT ALL ON TABLE orders               TO anon, authenticated, service_role;
GRANT ALL ON TABLE order_line_items     TO anon, authenticated, service_role;
GRANT ALL ON TABLE config               TO anon, authenticated, service_role;

-- ── Tables from migration 002 ────────────────────────────────────────────────
GRANT ALL ON TABLE purchase_orders  TO anon, authenticated, service_role;
GRANT ALL ON TABLE po_line_items    TO anon, authenticated, service_role;
