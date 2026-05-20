-- Migration 002: Purchase Orders + vendor address fields
-- Run in Supabase SQL Editor. Safe to re-run — all statements are idempotent.

-- ─────────────────────────────────────────────
-- Add address fields to manufacturers
-- ─────────────────────────────────────────────
ALTER TABLE manufacturers
  ADD COLUMN IF NOT EXISTS address_line1 text,
  ADD COLUMN IF NOT EXISTS address_line2 text,
  ADD COLUMN IF NOT EXISTS city         text,
  ADD COLUMN IF NOT EXISTS country      text,
  ADD COLUMN IF NOT EXISTS phone        text;

-- ─────────────────────────────────────────────
-- Purchase Orders
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchase_orders (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number         text,
  po_date           date NOT NULL DEFAULT current_date,
  exw_date          date,
  manufacturer_id   uuid REFERENCES manufacturers(id),
  ship_to           text DEFAULT 'Amazon AWD or G10 Fulfillment',
  ship_via          text DEFAULT 'Ocean',
  fob               text,
  freight_forwarder text,
  tax_amount        numeric(10,2) DEFAULT 0,
  shipping_amount   numeric(10,2) DEFAULT 0,
  other_amount      numeric(10,2) DEFAULT 0,
  comments          text,
  status            text DEFAULT 'draft' CHECK (status IN ('draft','sent','confirmed','cancelled')),
  created_by        text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- PO Line Items
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS po_line_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id            uuid REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id       uuid REFERENCES products(id),
  line_number      integer,
  description      text,
  manufacturer_sku text,
  qty              integer NOT NULL DEFAULT 0,
  unit_price       numeric(10,4) DEFAULT 0,
  created_at       timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE po_line_items   ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='purchase_orders' AND policyname='authenticated_full_access'
  ) THEN
    CREATE POLICY "authenticated_full_access" ON purchase_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='po_line_items' AND policyname='authenticated_full_access'
  ) THEN
    CREATE POLICY "authenticated_full_access" ON po_line_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;
