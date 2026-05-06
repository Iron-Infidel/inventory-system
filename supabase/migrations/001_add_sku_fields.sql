-- Migration 001: Add SKU identifier fields, manufacturer_type, rename/add manufacturers
-- Run this in Supabase SQL Editor BEFORE running seed.sql
-- Safe to re-run — all statements are idempotent

-- ─────────────────────────────────────────────
-- Add SKU identifier columns to products
-- ─────────────────────────────────────────────
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS fba_sku text,
  ADD COLUMN IF NOT EXISTS g10_sku text,
  ADD COLUMN IF NOT EXISTS shopify_sku text;

-- ─────────────────────────────────────────────
-- Add manufacturer_type to manufacturers
-- ─────────────────────────────────────────────
ALTER TABLE manufacturers
  ADD COLUMN IF NOT EXISTS manufacturer_type text;

-- ─────────────────────────────────────────────
-- Rename generic seed names → real names
-- ─────────────────────────────────────────────
UPDATE manufacturers SET name = 'Northfox',  manufacturer_type = 'bottle'  WHERE name = 'Bottle Manufacturer';
UPDATE manufacturers SET name = 'Pinstar',   manufacturer_type = 'patch'   WHERE name = 'Patch Manufacturer';
UPDATE manufacturers SET name = 'Dione',     manufacturer_type = 'sleeve'  WHERE name = 'Sleeve Manufacturer';

-- ─────────────────────────────────────────────
-- Add accessory manufacturers (safe — only inserts if name not yet present)
-- ─────────────────────────────────────────────
INSERT INTO manufacturers (name, manufacturer_type)
SELECT 'Amazing Industries', 'accessory'
WHERE NOT EXISTS (SELECT 1 FROM manufacturers WHERE name = 'Amazing Industries');

INSERT INTO manufacturers (name, manufacturer_type)
SELECT 'Skyhope', 'accessory'
WHERE NOT EXISTS (SELECT 1 FROM manufacturers WHERE name = 'Skyhope');

INSERT INTO manufacturers (name, manufacturer_type)
SELECT 'Huasheng', 'accessory'
WHERE NOT EXISTS (SELECT 1 FROM manufacturers WHERE name = 'Huasheng');

INSERT INTO manufacturers (name, manufacturer_type)
SELECT 'Diamond Eyes', 'accessory'
WHERE NOT EXISTS (SELECT 1 FROM manufacturers WHERE name = 'Diamond Eyes');
