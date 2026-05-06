-- Iron Infidel Ops — Complete Product Seed Data
-- Source: SKU Map tab, "Iron Infidel Stock Keeping and Reorder.xlsx"
-- Run AFTER schema.sql and migrations/001_add_sku_fields.sql
-- Safe to re-run — uses ON CONFLICT DO UPDATE / DO NOTHING
--
-- Products by section:
--   128oz Battle Bottle     3 SKUs  (Northfox bottles + Pinstar patches)
--   64oz Battle Bottle     18 SKUs  (Northfox bottles + Pinstar patches)
--   64oz Sleeve Only       14 SKUs  (Dione sleeves   + Pinstar patches)
--   64oz Workforce Bottle   4 SKUs  (Northfox bottles + Pinstar patches)
--   32oz Battle Bottle     13 SKUs  (Northfox bottles + Pinstar patches)
--   32oz Sleeve Only        9 SKUs  (Dione sleeves   + Pinstar patches)
--   Tactical Tumblers       2 SKUs  (Northfox, no patch)
--   Assault Belt           18 SKUs  (Amazing Industries, no patch)
--   Recon Belt             12 SKUs  (Amazing Industries, no patch)
--   Wrist Wraps             6 SKUs  (Amazing Industries, no patch)
--   Wrist Straps            7 SKUs  (Amazing Industries, no patch)
--   Knee Sleeves           10 SKUs  (Amazing Industries, no patch)
--   Carbon Hand Grips       3 SKUs  (Amazing, inactive — not currently sold)
--   Resistance Bands       10 SKUs  (Skyhope, no patch)
--   Band Handles            2 SKUs  (Huasheng, no patch)
--   PVC Patches (standalone)41 SKUs (Pinstar, no patch — these ARE patches)
--   ─────────────────────────────────
--   TOTAL                 172 SKUs


-- ═══════════════════════════════════════════════════════════════════════
-- STEP 1 — INSERT ALL PRODUCTS
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO products (asin, name, product_line, fba_sku, g10_sku, shopify_sku, requires_patch, is_active)
VALUES

-- ── 128oz Battle Bottles (Northfox) ──────────────────────────────────
('B0FFP5FB72', '128oz Battle Bottle - Betsy',      '128oz Battle Bottle', 'BB128-GRY-IB', 'BB128-GRY-IB', 'BB128-GRY-IB', true, true),
('B0FFNXDT9M', '128oz Battle Bottle - Black Camo', '128oz Battle Bottle', 'BB128-MCB',     'BB128-MCB',     'BB128-MCB',     true, true),
('B0FFNNSTXT', '128oz Battle Bottle - OCP',        '128oz Battle Bottle', 'BB128-OCP',     'BB128-OCP',     'BB128-OCP',     true, true),

-- ── 64oz Battle Bottles (Northfox) ───────────────────────────────────
('B0C644YWHK', '64oz Battle Bottle - Arctic Camo',      '64oz Battle Bottle', 'BBS2L-ARC-CAMO-FBA',  'BBS2L-ARCTIC',    'BBS2L-ARCTIC',    true, true),
('B09NP7WW8H', '64oz Battle Bottle - Betsy',             '64oz Battle Bottle', 'BBS2L-GRY-IB-FBA',    'BBS2L-GRY-IB',    'BBS2L-GRY-IB',    true, true),
('B09NPBX66R', '64oz Battle Bottle - Black Camo',        '64oz Battle Bottle', 'BBS2L-MCB-FBA',        'BBS-2L-OCPB',     'BBS-2L-OCPB',     true, true),
('B0DK67367D', '64oz Battle Bottle - Blue Line',         '64oz Battle Bottle', 'BBS2L-TBL-FBA',        'BBS-2L-TBL',      'BBS-2L-TBL',      true, true),
('B0BNW978Q5', '64oz Battle Bottle - Brown Recluse',     '64oz Battle Bottle', 'BBS2L-BLK-TAN-FBA',    'BBS-2L-BLKTAN',   'BBS-2L-BLKTAN',   true, true),
('B0FPRM8W9Y', '64oz Battle Bottle - Cobalt',            '64oz Battle Bottle', 'BBS-2L-BLKBLU-FBA',    'BBS-2L-BLKBLU',   'BBS-2L-BLKBLU',   true, true),
('B0BQCZ5TW4', '64oz Battle Bottle - Earned Not Given',  '64oz Battle Bottle', 'BBS2L-GREY-BJJ-FBA',   'BBS2L-GREY-BJJ',  'BBS2L-GREY-BJJ',  true, true),
('B0BNW85SBK', '64oz Battle Bottle - Gangrene',          '64oz Battle Bottle', 'BBS2L-GRN-BLK-FBA',    'BBS-2L-GRNBLK',   'BBS-2L-GRNBLK',   true, true),
('B09NP9HXK5', '64oz Battle Bottle - Join or Die',       '64oz Battle Bottle', 'BBS2L-BLK-JD-FBA',     'BBS2L-BLK-JD',    'BBS2L-BLK-JD',    true, true),
('B09NP9MDQM', '64oz Battle Bottle - Live Free',         '64oz Battle Bottle', 'BBS2L-GRN-LF-FBA',     'BBS2L-GRN-LF',    'BBS2L-GRN-LF',    true, true),
('B0FPRLJ8J8', '64oz Battle Bottle - MARPAT',            '64oz Battle Bottle', 'BBS-2L-TAN-MRPT-FBA',  'BBS-2L-TAN-MRPT', 'BBS-2L-TAN-MRPT', true, true),
('B09NP98QBR', '64oz Battle Bottle - OCP',               '64oz Battle Bottle', 'BBS2L-MC-FBA',          'BBS-2L-OCP',      'BBS-2L-OCP',      true, true),
('B0B3NHNDH9', '64oz Battle Bottle - Overland Green',    '64oz Battle Bottle', 'BBS2L-OVLDG-FBA',       'BBS-2L-TOPOG',    'BBS-2L-TOPOG',    true, true),
('B0DK673M16', '64oz Battle Bottle - Red Line',          '64oz Battle Bottle', 'BBS2L-TRL-FBA',         'BBS-2L-TRL',      'BBS-2L-TRL',      true, true),
('B0FPRHJ1RR', '64oz Battle Bottle - Twilight',          '64oz Battle Bottle', 'BBS-2L-BLKPUR-FBA',     'BBS-2L-BLKPUR',   'BBS-2L-BLKPUR',   true, true),
('B0FPRKSG1K', '64oz Battle Bottle - Valkyrie',          '64oz Battle Bottle', 'BBS-2L-BLKPNK-FBA',     'BBS-2L-BLKPNK',   'BBS-2L-BLKPNK',   true, true),
('B0BNW9GWKM', '64oz Battle Bottle - Widowmaker',        '64oz Battle Bottle', 'BBS2L-BLK-GRN-FBA',     'BBS-2L-BLKGRN',   'BBS-2L-BLKGRN',   true, true),
('B0B44TBCBQ', '64oz Battle Bottle - Woodland Camo',     '64oz Battle Bottle', 'BBS2L-WDLDC-FBA',       'BBS-2L-WDLDC',    'BBS-2L-WDLDC',    true, true),

-- ── 64oz Sleeve Only (Dione) ─────────────────────────────────────────
('B0B3NHXH6F', '64oz Sleeve Only - Black Betsy',             '64oz Sleeve Only', 'BBS-BLK-BTSY',     'BBS-BLK-BTSY',     'BBS-BLK-BTSY',     true, true),
('B0BR1L7L13', '64oz Sleeve Only - Black Camo w/Cap',        '64oz Sleeve Only', 'BBS-MCB',           'BBS-MCB',           'BBS-MCB',           true, true),
('B09NP79SBC', '64oz Sleeve Only - Earned Not Given Black',  '64oz Sleeve Only', 'BBS-BLK-BJJ-1',    'BBS32-BJJ-BLK',    'BBS-BLK-BJJ',      true, true),
('B0B3NHK26J', '64oz Sleeve Only - Earned Not Given Grey',   '64oz Sleeve Only', 'BBS-GRY-BJJ',      'BBS-GRY-BJJ',      'BBS-GRY-BJJ',      true, true),
('B0B3NJMGBX', '64oz Sleeve Only - Join or Die Tan',         '64oz Sleeve Only', 'BBS-TAN-JOD',      'BBS-TAN-JOD',      'BBS-TAN-JOD',      true, true),
('B0B3NJTDQL', '64oz Sleeve Only - Live Free Black',         '64oz Sleeve Only', 'BBS-BLK-LF',       'BBS-BLK-LF',       'BBS-BLK-LF',       true, true),
('B0B3NJW9V5', '64oz Sleeve Only - Overland Black',          '64oz Sleeve Only', 'BBS-BLK-OVLD',     'BBS-BLK-OVLD',     'BBS-BLK-OVLD',     true, true),
('B09XJQMKYW', '64oz Sleeve Only - Sleep Deprived Black',    '64oz Sleeve Only', 'BBS-BLK-SLEEPDEP', 'BBSLVE-2L-BLK-SD', 'BBSLVE-2L-BLK-SD', true, true),
('B09XJRZ8HW', '64oz Sleeve Only - Sleep Deprived OD Green', '64oz Sleeve Only', 'BBS-ODG-SLEEPDEP', 'BBSLVE-2L-GRN-SD', 'BBSLVE-2L-GRN-SD', true, true),
('B0BR1JFY1M', '64oz Sleeve Only - Woodland Camo',           '64oz Sleeve Only', 'BBS-WOOD-CAMO',    'BBS-WOODLAND',     'BBS-WOODLAND',     true, true),
('B0FPSSF4K5', '64oz Sleeve Only - Tiger Stripe Green',      '64oz Sleeve Only', 'BBS-GRN-TS',       'BBS-GRN-TS',       'BBS-GRN-TS',       true, true),
('B0FPSDDQYZ', '64oz Sleeve Only - Ruthless Rose',           '64oz Sleeve Only', 'BBS-PNKCAM',       'BBS-PNKCAM',       'BBS-PNKCAM',       true, true),
('B0FPSN883Q', '64oz Sleeve Only - Ultraviolet',             '64oz Sleeve Only', 'BBS-PURCAM',       'BBS-PURCAM',       'BBS-PURCAM',       true, true),
('B0FPSFRQ5C', '64oz Sleeve Only - Deep Water',              '64oz Sleeve Only', 'BBS-BLUCAM',       'BBS-BLUCAM',       'BBS-BLUCAM',       true, true),

-- ── 64oz Workforce Bottles (Northfox) ────────────────────────────────
('B0DG3M2V4L', '64oz Workforce Bottle - Black',  '64oz Workforce Bottle', 'BBS-2L-JBBLK', 'BBS-2L-JBBLK', 'BBS-2L-JBBLK', true, true),
('B0DG3TMWD1', '64oz Workforce Bottle - Orange', '64oz Workforce Bottle', 'BBS-2L-JBORG', 'BBS-2L-JBORG', 'BBS-2L-JBORG', true, true),
('B0DG3SQJ9F', '64oz Workforce Bottle - Red',    '64oz Workforce Bottle', 'BBS-2L-JBRED', 'BBS-2L-JBRED', 'BBS-2L-JBRED', true, true),
('B0DG3LMBSP', '64oz Workforce Bottle - Yellow', '64oz Workforce Bottle', 'BBS-2L-JBYLW', 'BBS-2L-JBYLW', 'BBS-2L-JBYLW', true, true),

-- ── 32oz Battle Bottles (Northfox) ───────────────────────────────────
('B0CMDWWWJT', '32oz Battle Bottle - Arctic Camo',      '32oz Battle Bottle', 'BBS32-ARCCAMO-FBA',   'BB32-ARCTICCAMO', 'BB32-ARCTICCAMO', true, true),
('B0C63Y5BDL', '32oz Battle Bottle - Betsy',            '32oz Battle Bottle', 'BBS32-BETSY-FBA',     'BB32-BTSY',       'BB32-BTSY',       true, true),
('B0C647DMSV', '32oz Battle Bottle - Black Camo',       '32oz Battle Bottle', 'BBS32-MCB-FBA',       'BB32-CAMOBLK',    'BB32-CAMOBLK',    true, true),
('B0DK66ZH8Y', '32oz Battle Bottle - Blue Line',        '32oz Battle Bottle', 'BBS32-TBL-FBA',       'BB32-TBL',        'BB32-TBL',        true, true),
('B0CMF53HHN', '32oz Battle Bottle - Brown Recluse',    '32oz Battle Bottle', 'BBS32-BRECLUSE-FBA',  'BB32-RECLUSE',    'BB32-RECLUSE',    true, true),
('B0FPRLKSJL', '32oz Battle Bottle - Cobalt',           '32oz Battle Bottle', 'BBS32-BLKBLU-FBA',    'BB32-BLKBLU',     'BB32-BLKBLU',     true, true),
('B0DK674TRK', '32oz Battle Bottle - Earned Not Given', '32oz Battle Bottle', 'BBS32-BJJ-GRY-FBA',   'BB32-BJJ-GRY',    'BB32-BJJ-GRY',    true, true),
('B0FPRK5YZG', '32oz Battle Bottle - MARPAT',           '32oz Battle Bottle', 'BBS32-TAN-MRPT-FBA',  'BB32-TAN-MRPT',   'BB32-MRPT',       true, true),
('B0C6438XD3', '32oz Battle Bottle - OCP',              '32oz Battle Bottle', 'BBS32-OCP-FBA',       'BB32-OCP',        'BB32-OCP',        true, true),
('B0DK65Y29T', '32oz Battle Bottle - Red Line',         '32oz Battle Bottle', 'BBS32-TRL-FBA',       'BB32-TRL',        'BB32-TRL',        true, true),
('B0FPRKSZM1', '32oz Battle Bottle - Twilight',         '32oz Battle Bottle', 'BBS32-BLKPUR-FBA',    'BB32-BLKPUR',     'BB32-BLKPUR',     true, true),
('B0CMDPVP1N', '32oz Battle Bottle - Valkyrie',         '32oz Battle Bottle', 'BBS32-BLK-PINK-FBA',  'BB32-BLKPNK',     'BB32-BLKPNK',     true, true),
('B0CMDJGLWN', '32oz Battle Bottle - Widowmaker',       '32oz Battle Bottle', 'BBS32-WIDOWM-FBA',    'BB32-WMAKER',     'BB32-WMAKER',     true, true),

-- ── 32oz Sleeve Only (Dione) ─────────────────────────────────────────
('B0DKGD2GV1', '32oz Sleeve Only - Earned Not Given Black', '32oz Sleeve Only', 'BBS32-BJJ-BLK',  'BBS32-BJJ-BLK',  'BBS32-BJJ-BLK',  true, true),
('B0DKGDNR3Q', '32oz Sleeve Only - Join or Die Black',     '32oz Sleeve Only', 'BBS32-JOD-BLK',  'BBS32-JOD-BLK',  'BBS32-JOD-BLK',  true, true),
('B0DKGCW9WQ', '32oz Sleeve Only - Live Free Green',       '32oz Sleeve Only', 'BBS32-LF-GRN',   'BBS32-LF-GRN',   'BBS32-LF-GRN',   true, true),
('B0DKGFS48K', '32oz Sleeve Only - Overland Green',        '32oz Sleeve Only', 'BBS32-OVL-GRN',  'BBS32-OVL-GRN',  'BBS32-OVL-GRN',  true, true),
('B0DKGDJYL5', '32oz Sleeve Only - Join or Die Tan',       '32oz Sleeve Only', 'BSS32-JOD-TAN',  'BSS32-JOD-TAN',  'BBS32-JOD-TAN',  true, true),
('B0FPSCY7CR', '32oz Sleeve Only - Tiger Stripe Green',    '32oz Sleeve Only', 'BBS32-GRN-TS',   'BBS32-GRN-TS',   'BBS32-GRN-TS',   true, true),
('B0FPSRPHTG', '32oz Sleeve Only - Ruthless Rose',         '32oz Sleeve Only', 'BBS32-PNKCAM',   'BBS32-PNKCAM',   'BBS32-PNKCAM',   true, true),
('B0FPS8J68D', '32oz Sleeve Only - Ultraviolet',           '32oz Sleeve Only', 'BBS32-PURCAM',   'BBS32-PURCAM',   'BBS32-PURCAM',   true, true),
('B0FPSRJR6T', '32oz Sleeve Only - Deep Water',            '32oz Sleeve Only', 'BBS32-BLUCAM',   'BBS32-BLUCAM',   'BBS32-BLUCAM',   true, true),

-- ── Tactical Tumblers (Northfox — no patch pair) ─────────────────────
('B0DSLZZ7XF', '40oz Tumbler - Black', 'Tactical Tumblers', 'TT40-SL-BLK-FBA', 'TT40-SL-BLK', 'TT40-SL-BLK', false, true),
('B0DSM13KRZ', '40oz Tumbler - White', 'Tactical Tumblers', 'TT40-SL-WHT-FBA', 'TT40-SL-WHT', 'TT40-SL-WHT', false, true),

-- ── Assault Belts — Leather Lever (Amazing Industries) ───────────────
-- PLG Green colorway
('B0CVJR7PHS', 'Assault Belt - PLG Green XL', 'Assault Belt', 'WLB-PLG-GRY-XL-FBA', null, 'WLB-PLG-GRY-XL', false, true),
('B0CVJKYZN8', 'Assault Belt - PLG Green M',  'Assault Belt', 'WLB-PLG-GRY-M-FBA',  null, 'WLB-PLG-GRY-M',  false, true),
('B0CVBN9GXK', 'Assault Belt - PLG Green L',  'Assault Belt', 'WLB-PLG-GRY-L-FBA',  null, 'WLB-PLG-GRY-L',  false, true),
-- PLG Grey colorway
('B0CVJK41K7', 'Assault Belt - PLG Grey XL',  'Assault Belt', 'WLB-PLG-GRN-XL-FBA', null, 'WLB-PLG-GRN-XL', false, true),
('B0CVJLBMCM', 'Assault Belt - PLG Grey M',   'Assault Belt', 'WLB-PLG-GRN-M-FBA',  null, 'WLB-PLG-GRN-M',  false, true),
('B0CVJJTKW8', 'Assault Belt - PLG Grey L',   'Assault Belt', 'WLB-PLG-GRN-L-FBA',  null, 'WLB-PLG-GRN-L',  false, true),
-- FAFO Black
('B0CVBNCMD7', 'Assault Belt - FAFO Black XXL', 'Assault Belt', 'WLB-FAFO-BLK-XXL-FBA', null, 'WLB-FAFO-BLK-XXL', false, true),
('B0CVBNR16M', 'Assault Belt - FAFO Black XS',  'Assault Belt', 'WLB-FAFO-BLK-XS-FBA',  null, 'WLB-FAFO-BLK-XS',  false, true),
('B0CVBMRZ51', 'Assault Belt - FAFO Black XL',  'Assault Belt', 'WLB-FAFO-BLK-XL-FBA',  null, 'WLB-FAFO-BLK-XL',  false, true),
('B0CVCC3G1T', 'Assault Belt - FAFO Black S',   'Assault Belt', 'WLB-FAFO-BLK-S-FBA',   null, 'WLB-FAFO-BLK-S',   false, true),
('B0CVC5S5GD', 'Assault Belt - FAFO Black M',   'Assault Belt', 'WLB-FAFO-BLK-M-FBA',   null, 'WLB-FAFO-BLK-M',   false, true),
('B0CVBP9QY9', 'Assault Belt - FAFO Black L',   'Assault Belt', 'WLB-FAFO-BLK-L-FBA',   null, 'WLB-FAFO-BLK-L',   false, true),
-- We The People Black
('B0CVC9TKW9', 'Assault Belt - WTP Black XXL',  'Assault Belt', 'WLB-1776-BLK-XXL-FBA', null, 'WLB-1776-BLK-XXL', false, true),
('B0CVBMX86N', 'Assault Belt - WTP Black XS',   'Assault Belt', 'WLB-1776-BLK-XS-FBA',  null, 'WLB-1776-BLK-XS',  false, true),
('B0CVBNLBPG', 'Assault Belt - WTP Black XL',   'Assault Belt', 'WLB-1776-BLK-XL-FBA',  null, 'WLB-1776-BLK-XL',  false, true),
('B0CVBN4558', 'Assault Belt - WTP Black S',    'Assault Belt', 'WLB-1776-BLK-S-FBA',   null, 'WLB-1776-BLK-S',   false, true),
('B0CVBNR3GG', 'Assault Belt - WTP Black M',    'Assault Belt', 'WLB-1776-BLK-M-FBA',   null, 'WLB-1776-BLK-M',   false, true),
('B0CVBNH8Y4', 'Assault Belt - WTP Black L',    'Assault Belt', 'WLB-1776-BLK-L-FBA',   null, 'WLB-1776-BLK-L',   false, true),

-- ── Recon Belts — EVA Nylon (Amazing Industries) ─────────────────────
-- FAFO Black
('B0F3PZYWHK', 'Recon Belt - FAFO Black XXL', 'Recon Belt', 'ELB-FAFO-BLK-XXL-FBA', null, 'ELB-FAFO-BLK-XXL', false, true),
('B0F3PM71H9', 'Recon Belt - FAFO Black XS',  'Recon Belt', 'ELB-FAFO-BLK-XS-FBA',  null, 'ELB-FAFO-BLK-XS',  false, true),
('B0F3Q11723', 'Recon Belt - FAFO Black XL',  'Recon Belt', 'ELB-FAFO-BLK-XL-FBA',  null, 'ELB-FAFO-BLK-XL',  false, true),
('B0F3Q7NFD9', 'Recon Belt - FAFO Black S',   'Recon Belt', 'ELB-FAFO-BLK-S-FBA',   null, 'ELB-FAFO-BLK-S',   false, true),
('B0F3Q21LZD', 'Recon Belt - FAFO Black M',   'Recon Belt', 'ELB-FAFO-BLK-M-FBA',   null, 'ELB-FAFO-BLK-M',   false, true),
('B0F3PQX6Z6', 'Recon Belt - FAFO Black L',   'Recon Belt', 'ELB-FAFO-BLK-L-FBA',   null, 'ELB-FAFO-BLK-L',   false, true),
-- We The People Black
('B0F3PQW1KF', 'Recon Belt - WTP Black XXL',  'Recon Belt', 'ELB-1776-BLK-XXL-FBA', null, 'ELB-1776-BLK-XXL', false, true),
('B0F3PWQQW6', 'Recon Belt - WTP Black XS',   'Recon Belt', 'ELB-1776-BLK-XS-FBA',  null, 'ELB-1776-BLK-XS',  false, true),
('B0F3PT2SZ9', 'Recon Belt - WTP Black XL',   'Recon Belt', 'ELB-1776-BLK-XL-FBA',  null, 'ELB-1776-BLK-XL',  false, true),
('B0F3Q1DX61', 'Recon Belt - WTP Black S',    'Recon Belt', 'ELB-1776-BLK-S-FBA',   null, 'ELB-1776-BLK-S',   false, true),
('B0F3PS9YK3', 'Recon Belt - WTP Black M',    'Recon Belt', 'ELB-1776-BLK-M-FBA',   null, 'ELB-1776-BLK-M',   false, true),
('B0F3Q4NFS5', 'Recon Belt - WTP Black L',    'Recon Belt', 'ELB-1776-BLK-L-FBA',   null, 'ELB-1776-BLK-L',   false, true),

-- ── Wrist Wraps (Amazing Industries) ─────────────────────────────────
('B0BT95YWRB', 'Wrist Wraps 18" - OD Green',     'Wrist Wraps', 'WW-18-ODG-FBA',   'WW-18-OD',  'WW-18-OD',   false, true),
('B0BT8Z76MX', 'Wrist Wraps 18" - Stealth Black', 'Wrist Wraps', '53-T10G-DPLS',   'WW-18-BLK', 'WW-18-BLK',  false, true),
('B08HPLR7S2', 'Wrist Wraps 18" - 1776',          'Wrist Wraps', 'WW-18-1776-FBA', null,         'WW-24-1776', false, true),
('B08CJHWV66', 'Wrist Wraps 18" - Black Camo',    'Wrist Wraps', 'WW-18-MCB-FBA',  null,         'WW-24-MCB',  false, true),
('B086WRHD2N', 'Wrist Wraps 18" - Camo',          'Wrist Wraps', 'WW-18-OCP-FBA',  null,         'WW-24-MC',   false, true),
('B08HQ275XW', 'Wrist Wraps 18" - Thin Blue Line', 'Wrist Wraps', 'WW-18-TBL-FBA', null,         'WW-24-TBL',  false, true),

-- ── Wrist Straps (Amazing Industries) ────────────────────────────────
('B0FDSVCQWR', 'Cotton Wrist Straps - 1776',     'Wrist Straps', 'WS-C-1776-FBA',  null,       'WS-C-1776-FBA', false, true),
('B0FDTFKLRY', 'Cotton Wrist Straps - Black Camo','Wrist Straps', 'WS-C-MCB-FBA',   null,       'WS-C-MCB-FBA',  false, true),
('B09MG115VX', 'Nylon Wrist Straps - 1776',      'Wrist Straps', '2F-RLSE-1L7C',   'WS-N-1776','WS-N-1776',     false, true),
('B08QZ9ZG6P', 'Nylon Wrist Straps - Black Camo','Wrist Straps', 'WZ-0IH9-SH7A',   'WS-N-MCB', 'WS-N-MCB',      false, true),
('B08QYVZGZV', 'Nylon Wrist Straps - OCP',       'Wrist Straps', 'NO-C90L-YBXH',   'WS-N-MC',  'WS-N-MC',       false, true),
('B0BKTLC489', 'Nylon Wrist Straps - Black',     'Wrist Straps', 'L1-MNLW-GW44',   'WS-N-BLK', 'WS-N-BLK',      false, true),
('B0BKTLRZQR', 'Nylon Wrist Straps - OD Green',  'Wrist Straps', 'UE-8JKU-EJSJ',   'WS-N-OD',  'WS-N-OD',       false, true),

-- ── Knee Sleeves (Amazing Industries) ────────────────────────────────
-- Logo Black
('B0FXNLN9KT', 'Knee Sleeves - Logo Black XXL', 'Knee Sleeves', 'KS-LOGO-BLK-XXL', null,        'KS-LOGO-BLK-XXL', false, true),
('B0FXNJSHDK', 'Knee Sleeves - Logo Black XL',  'Knee Sleeves', 'KS-LOGO-BLK-XL',  null,        'KS-LOGO-BLK-XL',  false, true),
('B0FXNLM5JH', 'Knee Sleeves - Logo Black L',   'Knee Sleeves', 'KS-LOGO-BLK-L',   null,        'KS-LOGO-BLK-L',   false, true),
('B0FXNKRV43', 'Knee Sleeves - Logo Black M',   'Knee Sleeves', 'KS-LOGO-BLK-M',   null,        'KS-LOGO-BLK-M',   false, true),
('B0FXNPXR71', 'Knee Sleeves - Logo Black S',   'Knee Sleeves', 'KS-LOGO-BLK-S',   null,        'KS-LOGO-BLK-S',   false, true),
-- FAFO Black
('B0CGCKKSG1', 'Knee Sleeves - FAFO Black XXL', 'Knee Sleeves', 'LKS-FAFO-BLK-XXL', 'KS-FAFO-13', 'KS-FAFO-13', false, true),
('B0CGCBGM6N', 'Knee Sleeves - FAFO Black XL',  'Knee Sleeves', 'LKS-FAFO-BLK-XL',  'KS-FAFO-10', 'KS-FAFO-10', false, true),
('B0CGCFYXYX', 'Knee Sleeves - FAFO Black L',   'Knee Sleeves', 'LKS-FAFO-BLK-L',   'KS-FAFO-7',  'KS-FAFO-7',  false, true),
('B0CGCD17FL', 'Knee Sleeves - FAFO Black M',   'Knee Sleeves', 'LKS-FAFO-BLK-M',   'KS-FAFO-4',  'KS-FAFO-4',  false, true),
('B0CGCQ1NRN', 'Knee Sleeves - FAFO Black S',   'Knee Sleeves', 'LKS-FAFO-BLK-S',   'KS-FAFO-1',  'KS-FAFO-1',  false, true),

-- ── Carbon Hand Grips (Amazing — marked inactive) ─────────────────────
('B0FXNLJZ5L', 'Carbon Hand Grips - Black XL', 'Carbon Hand Grips', 'CGF-BLK-XL', null, null,        false, false),
('B0FXNLQY2P', 'Carbon Hand Grips - Black L',  'Carbon Hand Grips', 'CFG-BLK-L',  null, 'CFG-BLK-L', false, false),
('B0FXNJVGX1', 'Carbon Hand Grips - Black S',  'Carbon Hand Grips', 'CFG-BLK-S',  null, 'CFG-BLK-M', false, false),

-- ── Resistance Bands (Skyhope) ────────────────────────────────────────
('B09MG45KP3', 'Resistance Bands - 5 Band Set Gunmetal', 'Resistance Bands', 'DIPPED-5SET-BG-UPC',  'RB-D-5SET-GGREY',    'RB-D-5SET-GGREY',    false, true),
('B081F25FYP', 'Resistance Bands - 5 Band Set Camo',    'Resistance Bands', 'DIPPED-5SET-UPC',     'RB-D-5SET-CAMO',     'RB-D-5SET-CAMO',     false, true),
('B081F25RB7', 'Resistance Bands - 4 Band Set Camo',    'Resistance Bands', 'DIPPED-4SET-UPC',     'RB-D-4SET-CAMO',     'RB-D-4SET-CAMO',     false, true),
('B09MG4DCCR', 'Resistance Bands - 3 Band Set Camo',    'Resistance Bands', 'DIPPED-3SET-UPC',     'RB-D-3SET-CAMO',     'RB-D-3SET-CAMO',     false, true),
('B081DZDCHM', 'Resistance Band - Khaki 64mm',          'Resistance Bands', 'FR-FOQG-ENKS',        'RB-D-64MM-KHAKI',    'RB-D-64MM-KHAKI',    false, true),
('B081F2JXPN', 'Resistance Band - Ranger Green 45mm',   'Resistance Bands', 'GD-02YF-E5ZL',        'RB-D-45MM-RANGERG',  'RB-D-45MM-RANGERG',  false, true),
('B081F2DK7J', 'Resistance Band - Flat Dark Earth 29mm','Resistance Bands', 'N2-WLV4-XBOQ',        'RB-D-29MM-FDE',      'RB-D-29MM-FDE',      false, true),
('B081F1GW99', 'Resistance Band - OD Green 16mm',       'Resistance Bands', '9M-LFZF-05DU',        'RB-D-16MM-ODGREEN',  'RB-D-16MM-ODGREEN',  false, true),
('B081F23BZ7', 'Resistance Band - Tundra 13mm',         'Resistance Bands', '33-GRVT-UYNQ',        'RB-D-13MM-TUNDRA',   'RB-D-13MM-TUNDRA',   false, true),
('B0BXM3913Q', 'Resistance Band - Coyote 6mm',          'Resistance Bands', 'RB-D-6MM-COYOTE-FBA', 'RB-D-6MM-COYOTE',    'RB-D-6MM-COYOTE',    false, true),

-- ── Band Handles (Huasheng) ───────────────────────────────────────────
('B08R2C11MR', 'Band Handles & Anchor - OCP',        'Band Handles', 'LI-71UA-RB0N', 'RBA-MC-DAHAB',  'RBA-MC-DAHAB',  false, true),
('B0C4WLJK5M', 'Band Handles & Anchor - Black Camo', 'Band Handles', '33-1M9P-0BXV', 'RBA-MCB-DAHAB', 'RBA-MCB-DAHAB', false, true),

-- ── PVC Patches — Standalone (Pinstar) ───────────────────────────────
-- Bundle packs
('B0G2ZY84MF', 'Patch - Bundle - F Around',        'PVC Patches', 'MP-BNDL-FAFO', 'MP-BNDL-FAFO', 'MP-BNDL-FAFO', false, true),
('B0G31F42K9', 'Patch - Bundle - Memes',            'PVC Patches', 'MP-BNDL-MEME', 'MP-BNDL-MEME', 'MP-BNDL-MEME', false, true),
('B0G318NLRR', 'Patch - Bundle - Defender',         'PVC Patches', 'MP-BNDL-DEF',  'MP-BNDL-DEF',  'MP-BNDL-DEF',  false, true),
('B0G2ZV2YGZ', 'Patch - Bundle - Mama Bear',        'PVC Patches', 'MP-BNDL-MOM',  'MP-BNDL-MOM',  'MP-BNDL-MOM',  false, true),
('B0G31C2HYV', 'Patch - Bundle - First Responder',  'PVC Patches', 'MP-BNDL-1ST',  'MP-BNDL-1ST',  'MP-BNDL-1ST',  false, true),
-- Individual patches
('B0G31LGBB8', 'Patch - Ace of Spades Vertical',    'PVC Patches', 'MP-VERT-ACE',     'MP-VERT-ACE',     'MP-VERT-ACE',     false, true),
('B0G2ZDX1LM', 'Patch - 1776 Original FAFO',        'PVC Patches', 'MP-OGFAFO',       'MP-OGFAFO',       'MP-OGFAFO',       false, true),
('B0G2ZY181X', 'Patch - Hold The Line',             'PVC Patches', 'MP-TBL-HTL',      'MP-TBL-HTL',      'MP-TBL-HTL',      false, true),
('B0G31B4QPP', 'Patch - Courage Duty Honor',        'PVC Patches', 'MP-TRL-CDH',      'MP-TRL-CDH',      'MP-TRL-CDH',      false, true),
('B0G31LCKBF', 'Patch - Embrace The Suck',          'PVC Patches', 'MP-SUCK',         'MP-SUCK',         'MP-SUCK',         false, true),
('B0G2ZY5DPQ', 'Patch - Blackbeard',                'PVC Patches', 'MP-BLKBEARD',     'MP-BLKBEARD',     'MP-BLKBEARD',     false, true),
('B0G2ZJYW48', 'Patch - Did You Die',               'PVC Patches', 'MP-THIN-BDYD',    'MP-THIN-BDYD',    'MP-THIN-BDYD',    false, true),
('B0G31HJF9W', 'Patch - Send It',                  'PVC Patches', 'MP-THIN-SENDIT',  'MP-THIN-SENDIT',  'MP-THIN-SENDIT',  false, true),
('B0G2ZJW5MF', 'Patch - Safety Last',              'PVC Patches', 'MP-THIN-SAFETY',  'MP-THIN-SAFETY',  'MP-THIN-SAFETY',  false, true),
('B0G316W76D', 'Patch - No Step',                  'PVC Patches', 'MP-SNEK',         'MP-SNEK',         'MP-SNEK',         false, true),
('B0G2ZVBWZQ', 'Patch - Faith Family Freedom',     'PVC Patches', 'MP-FLG-FFF',      'MP-FLG-FFF',      'MP-FLG-FFF',      false, true),
('B0G31C9924', 'Patch - Red Cross',                'PVC Patches', 'MP-REDX',         'MP-REDX',         'MP-REDX',         false, true),
('B0G2ZSBBQD', 'Patch - Mama Bear',                'PVC Patches', 'MP-MAMAB',        'MP-MAMAB',        'MP-MAMAB',        false, true),
('B0G2ZMVNT6', 'Patch - Rose',                     'PVC Patches', 'MP-ROSE',         'MP-ROSE',         'MP-ROSE',         false, true),
('B0G317L2BX', 'Patch - Dumpster Fire',            'PVC Patches', 'MP-DFIRE',        'MP-DFIRE',        'MP-DFIRE',        false, true),
('B0G31FT488', 'Patch - Multicolor Stripe Flag',   'PVC Patches', 'MP-FLG-MULTI',    'MP-FLG-MULTI',    'MP-FLG-MULTI',    false, true),
('B0C2B6GP7B', 'Patch - Black FAFO',               'PVC Patches', 'PATCH-FAFO-BLK',  'PATCH-FAFO-BLK',  'PATCH-FAFO-BLK',  false, true),
('B0C2B51PKP', 'Patch - Black GML',                'PVC Patches', 'PATCH-GML-BLK',   'PATCH-GML-BLK',   'PATCH-GML-BLK',   false, true),
('B0C2B7HK5H', 'Patch - Black LOD',                'PVC Patches', 'PATCH-LOD-BLK',   'PATCH-LOD-BLK',   'PATCH-LOD-BLK',   false, true),
('B0B62ZFSKX', 'Patch - Black Logo',               'PVC Patches', 'VJ-DCNX-1ZA1',    'PATCH-LOGO-BLK',  'PATCH-LOGO-BLK',  false, true),
('B093P8BXVD', 'Patch - Black Round Logo',         'PVC Patches', 'EZ-50H0-AMNA',    'MPDC-LOGO-BLK',   'MPDC-LOGO-BLK',   false, true),
('B0B62YR5LM', 'Patch - Gray Camo Flag',           'PVC Patches', '1A-DGS6-TLY9',    'MP-GRYCAMO',      'MP-GRYCAMO',      false, true),
('B0B62ZWBWY', 'Patch - Green Flag',               'PVC Patches', 'LN-8CXG-T6YT',    'MP-GRNFLG',       'MP-GRNFLG',       false, true),
('B0C29X7Q3C', 'Patch - Green GML',                'PVC Patches', 'PATCH-GML-GRN',   'PATCH-GML-GRN',   'PATCH-GML-GRN',   false, true),
('B0C2B2KW5S', 'Patch - Green LOD',                'PVC Patches', 'PATCH-LOD-GRN',   'PATCH-LOD-GRN',   'PATCH-LOD-GRN',   false, true),
('B0B62ZMDMC', 'Patch - Green Logo',               'PVC Patches', 'N2-TRJM-ES1M',    'PATCH-LOGO-GN',   'PATCH-LOGO-GN',   false, true),
('B0D1J2CZ7V', 'Patch - Green Overland',           'PVC Patches', 'PATCH-OVLD-GRN',  'PATCH-OVLD-GRN',  'PATCH-OVLD-GRN',  false, true),
('B093PKYRCH', 'Patch - Green Round Logo',         'PVC Patches', 'U5-1IUG-0N0D',    'MPDC-LOGO-GRN',   'MPDC-LOGO-GRN',   false, true),
('B0B62ZH194', 'Patch - Green Camo Flag',          'PVC Patches', 'UE-8GCD-4ZRW',    'MP-CAMOFLG',      'MP-CAMOFLG',      false, true),
('B0B6322L54', 'Patch - RWB Logo',                 'PVC Patches', 'UV-3T5L-P6SR',    'PATCH-LOGO-RWB',  'PATCH-LOGO-RWB',  false, true),
('B0C29W79H1', 'Patch - Tan GML',                  'PVC Patches', 'PATCH-GML-TAN',   'PATCH-GML-TAN',   'PATCH-GML-TAN',   false, true),
('B0C29SWMMC', 'Patch - Tan LOD',                  'PVC Patches', 'PATCH-LOD-TAN',   'PATCH-LOD-TAN',   'PATCH-LOD-TAN',   false, true),
('B0B62Z77W4', 'Patch - Tan Logo',                 'PVC Patches', 'C5-872U-QA9W',    'PATCH-LOGO-TAN',  'PATCH-LOGO-TAN',  false, true),
('B0C2B3V5W7', 'Patch - Black Toxic',              'PVC Patches', 'PATCH-TOXIC',     'PATCH-TOXIC',     'PATCH-TOXIC',     false, true),
('B093PPF6FF', 'Patch - Round Bundle 2 Pack',      'PVC Patches', 'DH-9S9A-2LBH',    'MPDC-LOGO-BLGR2', 'MPDC-LOGO-BLGR2', false, true),
('B0DFMRTQ73', 'Patch - Backbone of America',      'PVC Patches', 'PATCH-BACKBONE-BLK-FBA', 'PATCH-BACKBONE-BLK', 'MP-BBOA', false, true)

ON CONFLICT (asin) DO UPDATE SET
  name           = EXCLUDED.name,
  product_line   = EXCLUDED.product_line,
  fba_sku        = EXCLUDED.fba_sku,
  g10_sku        = EXCLUDED.g10_sku,
  shopify_sku    = EXCLUDED.shopify_sku,
  requires_patch = EXCLUDED.requires_patch,
  is_active      = EXCLUDED.is_active,
  updated_at     = now();


-- ═══════════════════════════════════════════════════════════════════════
-- STEP 2 — MANUFACTURER SKU MAP: NORTHFOX (bottles)
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO manufacturer_sku_map (product_id, manufacturer_id, manufacturer_sku)
SELECT p.id, m.id, v.mfr_sku
FROM (VALUES
  ('B0FFP5FB72', 'BB128-Betsy'),
  ('B0FFNXDT9M', 'BB128-BlackCamo'),
  ('B0FFNNSTXT', 'BB128-OCP'),
  ('B0C644YWHK', 'SKU1-ArcticCamo'),
  ('B09NP7WW8H', 'SKU1-BetsyXH'),
  ('B09NPBX66R', 'SKU1-BlackCamo'),
  ('B0DK67367D', 'SKU1-BlueLine'),
  ('B0BNW978Q5', 'SKU1-Recluse'),
  ('B0FPRM8W9Y', 'SKU1-Cobalt'),
  ('B0BQCZ5TW4', 'SKU1-BJJ'),
  ('B0BNW85SBK', 'SKU1-Gangrene'),
  ('B09NP9HXK5', 'SKU1-JoinOrDieXH'),
  ('B09NP9MDQM', 'SKU1-LiveFreeXH'),
  ('B0FPRLJ8J8', 'SKU1-MARPAT'),
  ('B09NP98QBR', 'SKU1-OCP'),
  ('B0B3NHNDH9', 'SKU1-Overland'),
  ('B0DK673M16', 'SKU1-RedLine'),
  ('B0FPRHJ1RR', 'SKU1-Twilight'),
  ('B0FPRKSG1K', 'SKU1-Valkyrie'),
  ('B0BNW9GWKM', 'SKU1-Widowmaker'),
  ('B0B44TBCBQ', 'SKU1-Woodland'),
  ('B0DG3M2V4L', '64-WF-Black'),
  ('B0DG3TMWD1', '64-WF-Orange'),
  ('B0DG3SQJ9F', '64-WF-Red'),
  ('B0DG3LMBSP', '64-WF-Yellow'),
  ('B0CMDWWWJT', 'SKU2-ArcticCamo'),
  ('B0C63Y5BDL', 'SKU2-Betsy'),
  ('B0C647DMSV', 'SKU2-BlackCamo'),
  ('B0DK66ZH8Y', 'SKU2-BlueLine'),
  ('B0CMF53HHN', 'SKU2-Recluse'),
  ('B0FPRLKSJL', 'SKU2-Cobalt'),
  ('B0DK674TRK', 'SKU2-BJJ'),
  ('B0FPRK5YZG', 'SKU2-MARPAT'),
  ('B0C6438XD3', 'SKU2-OCP'),
  ('B0DK65Y29T', 'SKU2-RedLine'),
  ('B0FPRKSZM1', 'SKU2-Twilight'),
  ('B0CMDPVP1N', 'SKU2-Valkyrie'),
  ('B0CMDJGLWN', 'SKU2-Widowmaker'),
  ('B0DSLZZ7XF', '40ozSleeve-Black'),
  ('B0DSM13KRZ', '40ozSleeve-OffWhite')
) AS v(asin, mfr_sku)
JOIN products p ON p.asin = v.asin
CROSS JOIN (SELECT id FROM manufacturers WHERE name = 'Northfox') m
ON CONFLICT (product_id, manufacturer_id) DO UPDATE SET manufacturer_sku = EXCLUDED.manufacturer_sku;


-- ═══════════════════════════════════════════════════════════════════════
-- STEP 3 — MANUFACTURER SKU MAP: DIONE (sleeves)
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO manufacturer_sku_map (product_id, manufacturer_id, manufacturer_sku)
SELECT p.id, m.id, v.mfr_sku
FROM (VALUES
  ('B0B3NHXH6F', '64Slv-BlkBetsy'),
  ('B0BR1L7L13', '64Slv-BlackCamo+Cap'),
  ('B09NP79SBC', '64Slv-BJJ-Grey'),
  ('B0B3NHK26J', '64Slv-BJJ-Black'),
  ('B0B3NJMGBX', '64Slv-JoD-TanXH'),
  ('B0B3NJTDQL', '64Slv-LiveFreeBlkXH'),
  ('B0B3NJW9V5', '64Slv-Overland-Blk'),
  ('B09XJQMKYW', '64Slv-SleepDep-BlkXH'),
  ('B09XJRZ8HW', '64Slv-SleepDep-GrnXH'),
  ('B0BR1JFY1M', '64Slv-WoodCamo'),
  ('B0FPSSF4K5', '64Slv-TigerGreen'),
  ('B0FPSDDQYZ', '64Slv-PinkCamo'),
  ('B0FPSN883Q', '64Slv-PurpleCamo'),
  ('B0FPSFRQ5C', '64Slv-BlueCamo'),
  ('B0DKGD2GV1', '32Slv-BJJ-Black'),
  ('B0DKGDNR3Q', '32Slv-JoD-Tan'),
  ('B0DKGCW9WQ', '32Slv-LiveFreeGrn'),
  ('B0DKGFS48K', '32Slv-Overland-Grn'),
  ('B0DKGDJYL5', '32Slv-JoD-Tan'),
  ('B0FPSCY7CR', '32Slv-TigerGreen'),
  ('B0FPSRPHTG', '32Slv-PinkCamo'),
  ('B0FPS8J68D', '32Slv-PurpleCamo'),
  ('B0FPSRJR6T', '32Slv-BlueCamo')
) AS v(asin, mfr_sku)
JOIN products p ON p.asin = v.asin
CROSS JOIN (SELECT id FROM manufacturers WHERE name = 'Dione') m
ON CONFLICT (product_id, manufacturer_id) DO UPDATE SET manufacturer_sku = EXCLUDED.manufacturer_sku;


-- ═══════════════════════════════════════════════════════════════════════
-- STEP 4 — MANUFACTURER SKU MAP: PINSTAR patches (paired with bottles/sleeves)
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO manufacturer_sku_map (product_id, manufacturer_id, manufacturer_sku)
SELECT p.id, m.id, v.patch_sku
FROM (VALUES
  ('B0FFP5FB72', 'PATCH-LOGO-BLK'),   ('B0FFNXDT9M', 'PATCH-LOGO-BLK'),   ('B0FFNNSTXT', 'PATCH-LOGO-TAN'),
  ('B0C644YWHK', 'MP-ARCTFLG-GRY'),   ('B09NP7WW8H', 'PATCH-LOGO-BLK'),   ('B09NPBX66R', 'PATCH-LOGO-BLK'),
  ('B0DK67367D', 'MP-TBLFLAG'),        ('B0BNW978Q5', 'PATCH-LOGO-BRN'),   ('B0FPRM8W9Y', 'MP-WTP-BLU'),
  ('B0BQCZ5TW4', 'MP-WHTFLG'),         ('B0BNW85SBK', 'PATCH-LOGO-GANG'),  ('B09NP9HXK5', 'MP-GRYCAMO'),
  ('B09NP9MDQM', 'MP-CAMOFLG'),        ('B0FPRLJ8J8', 'MP-MRPT-TAN'),      ('B09NP98QBR', 'PATCH-LOGO-TAN'),
  ('B0B3NHNDH9', 'PATCH-OVLD-GRN'),   ('B0DK673M16', 'MP-TRLFLAG'),        ('B0FPRHJ1RR', 'MP-WTP-PUR'),
  ('B0FPRKSG1K', 'MP-WTP-PNK'),        ('B0BNW9GWKM', 'PATCH-LOGO-GN'),    ('B0B44TBCBQ', 'MP-CAMOFLG'),
  ('B0B3NHXH6F', 'PATCH-LOGO-RWB'),   ('B0BR1L7L13', 'PATCH-LOGO-BLK'),   ('B09NP79SBC', 'MP-WHTFLG'),
  ('B0B3NHK26J', 'MP-WHTFLG'),         ('B0B3NJMGBX', 'PATCH-LOGO-BRN'),   ('B0B3NJTDQL', 'MP-GRYCAMO'),
  ('B0B3NJW9V5', 'PATCH-OVLD-BLK'),   ('B09XJQMKYW', 'MP-GRYCAMO'),        ('B09XJRZ8HW', 'MP-CAMOFLG'),
  ('B0BR1JFY1M', 'MP-CAMOFLG'),        ('B0FPSSF4K5', 'MP-TS-GRN'),         ('B0FPSDDQYZ', 'MP-WTP-PNK'),
  ('B0FPSN883Q', 'MP-WTP-PUR'),        ('B0FPSFRQ5C', 'MP-WTP-BLU'),
  ('B0DG3M2V4L', 'MP-BUILT'),          ('B0DG3TMWD1', 'MP-BUILT'),           ('B0DG3SQJ9F', 'MP-BUILT'),
  ('B0DG3LMBSP', 'MP-BUILT'),
  ('B0CMDWWWJT', 'MP-VERT-ARCT'),      ('B0C63Y5BDL', 'MP-VERT-BETS'),      ('B0C647DMSV', 'MP-VERT-MCB'),
  ('B0DK66ZH8Y', 'MP-VERT-TBL'),       ('B0CMF53HHN', 'MP-VERT-RECLUSE'),   ('B0FPRLKSJL', 'MP-VERT-WTP-BLU'),
  ('B0DK674TRK', 'MP-VERT-BJJ'),       ('B0FPRK5YZG', 'MP-VERT-MRPT-TAN'), ('B0C6438XD3', 'MP-VERT-OCP'),
  ('B0DK65Y29T', 'MP-VERT-TRL'),       ('B0FPRKSZM1', 'MP-VERT-WTP-PUR'),   ('B0CMDPVP1N', 'MP-VERT-WTP-PNK'),
  ('B0CMDJGLWN', 'MP-VERT-WIDOW'),
  ('B0DKGD2GV1', 'MP-VERT-BJJ'),       ('B0DKGDNR3Q', 'MP-VERT-JOD'),       ('B0DKGCW9WQ', 'MP-VERT-LF'),
  ('B0DKGFS48K', 'MP-VERT-OVLD'),      ('B0DKGDJYL5', 'MP-VERT-JOD-TAN'),   ('B0FPSCY7CR', 'MP-VERT-TS-GRN'),
  ('B0FPSRPHTG', 'MP-VERT-WTP-PNK'),   ('B0FPS8J68D', 'MP-VERT-WTP-PUR'),   ('B0FPSRJR6T', 'MP-VERT-WTP-BLU')
) AS v(asin, patch_sku)
JOIN products p ON p.asin = v.asin
CROSS JOIN (SELECT id FROM manufacturers WHERE name = 'Pinstar') m
ON CONFLICT (product_id, manufacturer_id) DO UPDATE SET manufacturer_sku = EXCLUDED.manufacturer_sku;


-- ═══════════════════════════════════════════════════════════════════════
-- STEP 5 — MANUFACTURER SKU MAP: AMAZING INDUSTRIES (lifting gear)
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO manufacturer_sku_map (product_id, manufacturer_id, manufacturer_sku)
SELECT p.id, m.id, v.mfr_sku
FROM (VALUES
  -- Assault Belts
  ('B0CVJR7PHS', 'WLB-PLG-GRY-XL'),  ('B0CVJKYZN8', 'WLB-PLG-GRY-M'),  ('B0CVBN9GXK', 'WLB-PLG-GRY-L'),
  ('B0CVJK41K7', 'WLB-PLG-GRN-XL'),  ('B0CVJLBMCM', 'WLB-PLG-GRN-M'),  ('B0CVJJTKW8', 'WLB-PLG-GRN-L'),
  ('B0CVBNCMD7', 'WLB-FAFO-BLK-XXL'),('B0CVBNR16M', 'WLB-FAFO-BLK-XS'),('B0CVBMRZ51', 'WLB-FAFO-BLK-XL'),
  ('B0CVCC3G1T', 'WLB-FAFO-BLK-S'),  ('B0CVC5S5GD', 'WLB-FAFO-BLK-M'), ('B0CVBP9QY9', 'WLB-FAFO-BLK-L'),
  ('B0CVC9TKW9', 'WLB-1776-BLK-XXL'),('B0CVBMX86N', 'WLB-1776-BLK-XS'),('B0CVBNLBPG', 'WLB-1776-BLK-XL'),
  ('B0CVBN4558', 'WLB-1776-BLK-S'),  ('B0CVBNR3GG', 'WLB-1776-BLK-M'), ('B0CVBNH8Y4', 'WLB-1776-BLK-L'),
  -- Recon Belts
  ('B0F3PZYWHK', 'NLB-FAFO-BLK-XXL'),('B0F3PM71H9', 'NLB-FAFO-BLK-XS'),('B0F3Q11723', 'NLB-FAFO-BLK-XL'),
  ('B0F3Q7NFD9', 'NLB-FAFO-BLK-S'),  ('B0F3Q21LZD', 'NLB-FAFO-BLK-M'), ('B0F3PQX6Z6', 'NLB-FAFO-BLK-L'),
  ('B0F3PQW1KF', 'NLB-1776-BLK-XXL'),('B0F3PWQQW6', 'NLB-1776-BLK-XS'),('B0F3PT2SZ9', 'NLB-1776-BLK-XL'),
  ('B0F3Q1DX61', 'NLB-1776-BLK-S'),  ('B0F3PS9YK3', 'NLB-1776-BLK-M'), ('B0F3Q4NFS5', 'NLB-1776-BLK-L'),
  -- Wrist Wraps
  ('B0BT95YWRB', 'WW-18-ODG'),  ('B0BT8Z76MX', 'WW-18-BLK'),  ('B08HPLR7S2', 'WW-18-1776'),
  ('B08CJHWV66', 'WW-18-BlkCamo'), ('B086WRHD2N', 'WW-18-OCP'), ('B08HQ275XW', 'WW-18-TBL'),
  -- Wrist Straps
  ('B0FDSVCQWR', 'WS-C-1776'),   ('B0FDTFKLRY', 'WS-C-BlkCamo'), ('B09MG115VX', 'WS-N-1776'),
  ('B08QZ9ZG6P', 'WS-N-BlkCamo'),('B08QYVZGZV', 'WS-N-OCP'),    ('B0BKTLC489', 'WS-N-BLK'),
  ('B0BKTLRZQR', 'WS-N-ODG'),
  -- Knee Sleeves
  ('B0FXNLN9KT', 'KS-LOGO-BLK-XXL'),('B0FXNJSHDK', 'KS-LOGO-BLK-XL'),('B0FXNLM5JH', 'KS-LOGO-BLK-L'),
  ('B0FXNKRV43', 'KS-LOGO-BLK-M'),  ('B0FXNPXR71', 'KS-LOGO-BLK-S'),
  ('B0CGCKKSG1', 'KS-FAFO-BLK-XXL'),('B0CGCBGM6N', 'KS-FAFO-BLK-XL'),('B0CGCFYXYX', 'KS-FAFO-BLK-L'),
  ('B0CGCD17FL', 'KS-FAFO-BLK-M'),  ('B0CGCQ1NRN', 'KS-FAFO-BLK-S'),
  -- Carbon Hand Grips (inactive)
  ('B0FXNLJZ5L', 'CGF-BLK-XL'), ('B0FXNLQY2P', 'CFG-BLK-L'), ('B0FXNJVGX1', 'CFG-BLK-S')
) AS v(asin, mfr_sku)
JOIN products p ON p.asin = v.asin
CROSS JOIN (SELECT id FROM manufacturers WHERE name = 'Amazing Industries') m
ON CONFLICT (product_id, manufacturer_id) DO UPDATE SET manufacturer_sku = EXCLUDED.manufacturer_sku;


-- ═══════════════════════════════════════════════════════════════════════
-- STEP 6 — MANUFACTURER SKU MAP: SKYHOPE (resistance bands)
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO manufacturer_sku_map (product_id, manufacturer_id, manufacturer_sku)
SELECT p.id, m.id, v.mfr_sku
FROM (VALUES
  ('B09MG45KP3', 'Gunmetal Grey 5 Set'), ('B081F25FYP', 'Camo 5 Set'),
  ('B081F25RB7', 'Camo 4 Set'),          ('B09MG4DCCR', 'Camo 3 Set'),
  ('B081DZDCHM', 'Khaki 64mm'),          ('B081F2JXPN', 'Ranger Green 45mm'),
  ('B081F2DK7J', 'FDE 29mm'),            ('B081F1GW99', 'OD Green 16mm'),
  ('B081F23BZ7', 'Tundra 13mm'),         ('B0BXM3913Q', 'Coyote 6mm')
) AS v(asin, mfr_sku)
JOIN products p ON p.asin = v.asin
CROSS JOIN (SELECT id FROM manufacturers WHERE name = 'Skyhope') m
ON CONFLICT (product_id, manufacturer_id) DO UPDATE SET manufacturer_sku = EXCLUDED.manufacturer_sku;


-- ═══════════════════════════════════════════════════════════════════════
-- STEP 7 — MANUFACTURER SKU MAP: HUASHENG (band handles)
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO manufacturer_sku_map (product_id, manufacturer_id, manufacturer_sku)
SELECT p.id, m.id, v.mfr_sku
FROM (VALUES
  ('B08R2C11MR', 'BandHandles-OCP'),
  ('B0C4WLJK5M', 'BandHandles-MCB')
) AS v(asin, mfr_sku)
JOIN products p ON p.asin = v.asin
CROSS JOIN (SELECT id FROM manufacturers WHERE name = 'Huasheng') m
ON CONFLICT (product_id, manufacturer_id) DO UPDATE SET manufacturer_sku = EXCLUDED.manufacturer_sku;


-- ═══════════════════════════════════════════════════════════════════════
-- STEP 8 — MANUFACTURER SKU MAP: PINSTAR (standalone patch products)
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO manufacturer_sku_map (product_id, manufacturer_id, manufacturer_sku)
SELECT p.id, m.id, v.mfr_sku
FROM (VALUES
  ('B0G2ZY84MF', 'MP-BNDL-FAFO'),  ('B0G31F42K9', 'MP-BNDL-MEME'),  ('B0G318NLRR', 'MP-BNDL-DEF'),
  ('B0G2ZV2YGZ', 'MP-BNDL-MOM'),   ('B0G31C2HYV', 'MP-BNDL-1ST'),   ('B0G31LGBB8', 'MP-VERT-ACE'),
  ('B0G2ZDX1LM', 'MP-OGFAFO'),     ('B0G2ZY181X', 'MP-TBL-HTL'),    ('B0G31B4QPP', 'MP-TRL-CDH'),
  ('B0G31LCKBF', 'MP-SUCK'),        ('B0G2ZY5DPQ', 'MP-BLKBEARD'),   ('B0G2ZJYW48', 'MP-THIN-BDYD'),
  ('B0G31HJF9W', 'MP-THIN-SENDIT'),('B0G2ZJW5MF', 'MP-THIN-SAFETY'),('B0G316W76D', 'MP-SNEK'),
  ('B0G2ZVBWZQ', 'MP-FLG-FFF'),    ('B0G31C9924', 'MP-REDX'),        ('B0G2ZSBBQD', 'MP-MAMAB'),
  ('B0G2ZMVNT6', 'MP-ROSE'),        ('B0G317L2BX', 'MP-DFIRE'),       ('B0G31FT488', 'MP-FLG-MULTI'),
  ('B0C2B6GP7B', 'PATCH-FAFO-BLK'),('B0C2B51PKP', 'PATCH-GML-BLK'), ('B0C2B7HK5H', 'PATCH-LOD-BLK'),
  ('B0B62ZFSKX', 'PATCH-LOGO-BLK'),('B093P8BXVD', 'MPDC-LOGO-BLK'), ('B0B62YR5LM', 'MP-GRYCAMO'),
  ('B0B62ZWBWY', 'MP-GRNFLG'),      ('B0C29X7Q3C', 'PATCH-GML-GRN'), ('B0C2B2KW5S', 'PATCH-LOD-GRN'),
  ('B0B62ZMDMC', 'PATCH-LOGO-GN'),  ('B0D1J2CZ7V', 'PATCH-OVLD-GRN'),('B093PKYRCH', 'MPDC-LOGO-GRN'),
  ('B0B62ZH194', 'MP-CAMOFLG'),     ('B0B6322L54', 'PATCH-LOGO-RWB'),('B0C29W79H1', 'PATCH-GML-TAN'),
  ('B0C29SWMMC', 'PATCH-LOD-TAN'),  ('B0B62Z77W4', 'PATCH-LOGO-TAN'),('B0C2B3V5W7', 'PATCH-TOXIC'),
  ('B093PPF6FF', 'MPDC-LOGO-2PK'),  ('B0DFMRTQ73', 'MP-BBOA')
) AS v(asin, mfr_sku)
JOIN products p ON p.asin = v.asin
CROSS JOIN (SELECT id FROM manufacturers WHERE name = 'Pinstar') m
ON CONFLICT (product_id, manufacturer_id) DO UPDATE SET manufacturer_sku = EXCLUDED.manufacturer_sku;
