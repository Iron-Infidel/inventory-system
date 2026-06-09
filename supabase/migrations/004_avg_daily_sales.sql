-- Migration 004: Add avg_90_day_sales to products
-- Used to calculate days of stock remaining for the daily Slack report.
-- low_stock_threshold is now interpreted as DAYS (not units).
-- Default: alert when < 60 days of available stock remaining.
-- Run in Supabase SQL Editor. Safe to re-run.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS avg_90_day_sales numeric(10,2) DEFAULT 0;

-- Update default for low_stock_threshold to 60 days
ALTER TABLE products ALTER COLUMN low_stock_threshold SET DEFAULT 60;

GRANT ALL ON TABLE products TO anon, authenticated, service_role;

-- ── Populate avg_90_day_sales from ops spreadsheet col M (as of 2026-06-03) ──
-- Source: combined Amazon + Shopify 90-day average sales per SKU
UPDATE products SET avg_90_day_sales = 132.5  WHERE asin = 'B0FFP5FB72';
UPDATE products SET avg_90_day_sales = 509    WHERE asin = 'B0FFNXDT9M';
UPDATE products SET avg_90_day_sales = 271.5  WHERE asin = 'B0FFNNSTXT';
UPDATE products SET avg_90_day_sales = 741    WHERE asin = 'B0C644YWHK';
UPDATE products SET avg_90_day_sales = 2343   WHERE asin = 'B09NP7WW8H';
UPDATE products SET avg_90_day_sales = 3152   WHERE asin = 'B09NPBX66R';
UPDATE products SET avg_90_day_sales = 264.5  WHERE asin = 'B0DK67367D';
UPDATE products SET avg_90_day_sales = 909    WHERE asin = 'B0BNW978Q5';
UPDATE products SET avg_90_day_sales = 310    WHERE asin = 'B0FPRM8W9Y';
UPDATE products SET avg_90_day_sales = 901.5  WHERE asin = 'B0BQCZ5TW4';
UPDATE products SET avg_90_day_sales = 558    WHERE asin = 'B0BNW85SBK';
UPDATE products SET avg_90_day_sales = 871    WHERE asin = 'B09NP9HXK5';
UPDATE products SET avg_90_day_sales = 1357   WHERE asin = 'B09NP9MDQM';
UPDATE products SET avg_90_day_sales = 543    WHERE asin = 'B0FPRLJ8J8';
UPDATE products SET avg_90_day_sales = 2692.5 WHERE asin = 'B09NP98QBR';
UPDATE products SET avg_90_day_sales = 871.5  WHERE asin = 'B0B3NHNDH9';
UPDATE products SET avg_90_day_sales = 308.5  WHERE asin = 'B0DK673M16';
UPDATE products SET avg_90_day_sales = 137    WHERE asin = 'B0FPRHJ1RR';
UPDATE products SET avg_90_day_sales = 151.5  WHERE asin = 'B0FPRKSG1K';
UPDATE products SET avg_90_day_sales = 356.5  WHERE asin = 'B0BNW9GWKM';
UPDATE products SET avg_90_day_sales = 622.5  WHERE asin = 'B0B44TBCBQ';
UPDATE products SET avg_90_day_sales = 212    WHERE asin = 'B0B3NHXH6F';
UPDATE products SET avg_90_day_sales = 171.5  WHERE asin = 'B0BR1L7L13';
UPDATE products SET avg_90_day_sales = 51.5   WHERE asin = 'B09NP79SBC';
UPDATE products SET avg_90_day_sales = 49.5   WHERE asin = 'B0B3NHK26J';
UPDATE products SET avg_90_day_sales = 284    WHERE asin = 'B0B3NJMGBX';
UPDATE products SET avg_90_day_sales = 139.5  WHERE asin = 'B0B3NJTDQL';
UPDATE products SET avg_90_day_sales = 138.5  WHERE asin = 'B0B3NJW9V5';
UPDATE products SET avg_90_day_sales = 38.5   WHERE asin = 'B09XJQMKYW';
UPDATE products SET avg_90_day_sales = 72.5   WHERE asin = 'B09XJRZ8HW';
UPDATE products SET avg_90_day_sales = 118.5  WHERE asin = 'B0BR1JFY1M';
UPDATE products SET avg_90_day_sales = 100    WHERE asin = 'B0FPSSF4K5';
UPDATE products SET avg_90_day_sales = 45     WHERE asin = 'B0FPSDDQYZ';
UPDATE products SET avg_90_day_sales = 50.5   WHERE asin = 'B0FPSN883Q';
UPDATE products SET avg_90_day_sales = 39     WHERE asin = 'B0FPSFRQ5C';
UPDATE products SET avg_90_day_sales = 470.5  WHERE asin = 'B0DG3M2V4L';
UPDATE products SET avg_90_day_sales = 348.5  WHERE asin = 'B0DG3TMWD1';
UPDATE products SET avg_90_day_sales = 264    WHERE asin = 'B0DG3SQJ9F';
UPDATE products SET avg_90_day_sales = 206.5  WHERE asin = 'B0DG3LMBSP';
UPDATE products SET avg_90_day_sales = 183.5  WHERE asin = 'B0CMDWWWJT';
UPDATE products SET avg_90_day_sales = 433.5  WHERE asin = 'B0C63Y5BDL';
UPDATE products SET avg_90_day_sales = 1005   WHERE asin = 'B0C647DMSV';
UPDATE products SET avg_90_day_sales = 94.5   WHERE asin = 'B0DK66ZH8Y';
UPDATE products SET avg_90_day_sales = 444.5  WHERE asin = 'B0CMF53HHN';
UPDATE products SET avg_90_day_sales = 185    WHERE asin = 'B0FPRLKSJL';
UPDATE products SET avg_90_day_sales = 212    WHERE asin = 'B0DK674TRK';
UPDATE products SET avg_90_day_sales = 248.5  WHERE asin = 'B0FPRK5YZG';
UPDATE products SET avg_90_day_sales = 1026   WHERE asin = 'B0C6438XD3';
UPDATE products SET avg_90_day_sales = 80.5   WHERE asin = 'B0DK65Y29T';
UPDATE products SET avg_90_day_sales = 184    WHERE asin = 'B0FPRKSZM1';
UPDATE products SET avg_90_day_sales = 199    WHERE asin = 'B0CMDPVP1N';
UPDATE products SET avg_90_day_sales = 278    WHERE asin = 'B0CMDJGLWN';
UPDATE products SET avg_90_day_sales = 37     WHERE asin = 'B0DKGD2GV1';
UPDATE products SET avg_90_day_sales = 99.5   WHERE asin = 'B0DKGDNR3Q';
UPDATE products SET avg_90_day_sales = 103    WHERE asin = 'B0DKGCW9WQ';
UPDATE products SET avg_90_day_sales = 50.5   WHERE asin = 'B0DKGFS48K';
UPDATE products SET avg_90_day_sales = 69.5   WHERE asin = 'B0DKGDJYL5';
UPDATE products SET avg_90_day_sales = 106    WHERE asin = 'B0FPSCY7CR';
UPDATE products SET avg_90_day_sales = 29.5   WHERE asin = 'B0FPSRPHTG';
UPDATE products SET avg_90_day_sales = 42     WHERE asin = 'B0FPS8J68D';
UPDATE products SET avg_90_day_sales = 23.5   WHERE asin = 'B0FPSRJR6T';
