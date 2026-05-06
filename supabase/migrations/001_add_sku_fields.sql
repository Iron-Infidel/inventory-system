-- Migration 001: Add SKU identifier fields to products, add manufacturer_type, rename manufacturers
-- Run this in Supabase SQL Editor BEFORE running seed.sql

-- ─────────────────────────────────────────────
-- Add SKU identifier columns to products
-- ─────────────────────────────────────────────
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS fba_sku text,
  ADD COLUMN IF NOT EXISTS g10_sku text,
  ADD COLUMN IF NOT EXISTS shopify_sku text;

-- ─────────────────────────────────────────────
-- Add manufacturer_type to manufacturers
-- Values: 'bottle', 'sleeve', 'patch', 'accessory'
-- ─────────────────────────────────────────────
ALTER TABLE manufacturers
  ADD COLUMN IF NOT EXISTS manufacturer_type text;

-- ─────────────────────────────────────────────
-- Update generic seed names → real names
-- ─────────────────────────────────────────────
UPDATE manufacturers SET name = 'Northfox',  manufacturer_type = 'bottle'  WHERE name = 'Bottle Manufacturer';
UPDATE manufacturers SET name = 'Pinstar',   manufacturer_type = 'patch'   WHERE name = 'Patch Manufacturer';
UPDATE manufacturers SET name = 'Dione',     manufacturer_type = 'sleeve'  WHERE name = 'Sleeve Manufacturer';
