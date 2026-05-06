-- Iron Infidel Ops — Product Seed Data
-- Source: SKU Map tab, "Iron Infidel Stock Keeping and Reorder.xlsx"
-- Run AFTER schema.sql and migrations/001_add_sku_fields.sql
-- Safe to re-run — uses ON CONFLICT DO UPDATE

-- ═══════════════════════════════════════════════════════════════
-- STEP 1 — INSERT ALL PRODUCTS
-- Columns: asin, name, product_line, fba_sku, g10_sku, shopify_sku,
--          requires_patch, is_active
-- units_per_carton, cbm_per_carton, sales_pct, moq: left NULL —
-- fill in via SKU Management screen
-- ═══════════════════════════════════════════════════════════════

INSERT INTO products (asin, name, product_line, fba_sku, g10_sku, shopify_sku, requires_patch, is_active)
VALUES

-- ── 128oz Battle Bottles (Northfox) ──────────────────────────
('B0FFP5FB72',  '128oz Battle Bottle - Betsy',           '128oz Battle Bottle', 'BB128-GRY-IB',       'BB128-GRY-IB',       'BB128-GRY-IB',       true, true),
('B0FFNXDT9M',  '128oz Battle Bottle - Black Camo',      '128oz Battle Bottle', 'BB128-MCB',           'BB128-MCB',           'BB128-MCB',           true, true),
('B0FFNNSTXT',  '128oz Battle Bottle - OCP',             '128oz Battle Bottle', 'BB128-OCP',           'BB128-OCP',           'BB128-OCP',           true, true),

-- ── 64oz Battle Bottles (Northfox) ───────────────────────────
('B0C644YWHK',  '64oz Battle Bottle - Arctic Camo',       '64oz Battle Bottle', 'BBS2L-ARC-CAMO-FBA',  'BBS2L-ARCTIC',        'BBS2L-ARCTIC',        true, true),
('B09NP7WW8H',  '64oz Battle Bottle - Betsy',             '64oz Battle Bottle', 'BBS2L-GRY-IB-FBA',   'BBS2L-GRY-IB',        'BBS2L-GRY-IB',        true, true),
('B09NPBX66R',  '64oz Battle Bottle - Black Camo',        '64oz Battle Bottle', 'BBS2L-MCB-FBA',       'BBS-2L-OCPB',         'BBS-2L-OCPB',         true, true),
('B0DK67367D',  '64oz Battle Bottle - Blue Line',         '64oz Battle Bottle', 'BBS2L-TBL-FBA',       'BBS-2L-TBL',          'BBS-2L-TBL',          true, true),
('B0BNW978Q5',  '64oz Battle Bottle - Brown Recluse',     '64oz Battle Bottle', 'BBS2L-BLK-TAN-FBA',   'BBS-2L-BLKTAN',       'BBS-2L-BLKTAN',       true, true),
('B0FPRM8W9Y',  '64oz Battle Bottle - Cobalt',            '64oz Battle Bottle', 'BBS-2L-BLKBLU-FBA',   'BBS-2L-BLKBLU',       'BBS-2L-BLKBLU',       true, true),
('B0BQCZ5TW4',  '64oz Battle Bottle - Earned Not Given',  '64oz Battle Bottle', 'BBS2L-GREY-BJJ-FBA',  'BBS2L-GREY-BJJ',      'BBS2L-GREY-BJJ',      true, true),
('B0BNW85SBK',  '64oz Battle Bottle - Gangrene',          '64oz Battle Bottle', 'BBS2L-GRN-BLK-FBA',   'BBS-2L-GRNBLK',       'BBS-2L-GRNBLK',       true, true),
('B09NP9HXK5',  '64oz Battle Bottle - Join or Die',       '64oz Battle Bottle', 'BBS2L-BLK-JD-FBA',    'BBS2L-BLK-JD',        'BBS2L-BLK-JD',        true, true),
('B09NP9MDQM',  '64oz Battle Bottle - Live Free',         '64oz Battle Bottle', 'BBS2L-GRN-LF-FBA',    'BBS2L-GRN-LF',        'BBS2L-GRN-LF',        true, true),
('B0FPRLJ8J8',  '64oz Battle Bottle - MARPAT',            '64oz Battle Bottle', 'BBS-2L-TAN-MRPT-FBA', 'BBS-2L-TAN-MRPT',     'BBS-2L-TAN-MRPT',     true, true),
('B09NP98QBR',  '64oz Battle Bottle - OCP',               '64oz Battle Bottle', 'BBS2L-MC-FBA',        'BBS-2L-OCP',          'BBS-2L-OCP',          true, true),
('B0B3NHNDH9',  '64oz Battle Bottle - Overland Green',    '64oz Battle Bottle', 'BBS2L-OVLDG-FBA',     'BBS-2L-TOPOG',        'BBS-2L-TOPOG',        true, true),
('B0DK673M16',  '64oz Battle Bottle - Red Line',          '64oz Battle Bottle', 'BBS2L-TRL-FBA',       'BBS-2L-TRL',          'BBS-2L-TRL',          true, true),
('B0FPRHJ1RR',  '64oz Battle Bottle - Twilight',          '64oz Battle Bottle', 'BBS-2L-BLKPUR-FBA',   'BBS-2L-BLKPUR',       'BBS-2L-BLKPUR',       true, true),
('B0FPRKSG1K',  '64oz Battle Bottle - Valkyrie',          '64oz Battle Bottle', 'BBS-2L-BLKPNK-FBA',   'BBS-2L-BLKPNK',       'BBS-2L-BLKPNK',       true, true),
('B0BNW9GWKM',  '64oz Battle Bottle - Widowmaker',        '64oz Battle Bottle', 'BBS2L-BLK-GRN-FBA',   'BBS-2L-BLKGRN',       'BBS-2L-BLKGRN',       true, true),
('B0B44TBCBQ',  '64oz Battle Bottle - Woodland Camo',     '64oz Battle Bottle', 'BBS2L-WDLDC-FBA',     'BBS-2L-WDLDC',        'BBS-2L-WDLDC',        true, true),

-- ── 64oz Sleeve Only (Dione) ─────────────────────────────────
('B0B3NHXH6F',  '64oz Sleeve Only - Black Betsy',              '64oz Sleeve Only', 'BBS-BLK-BTSY',        'BBS-BLK-BTSY',        'BBS-BLK-BTSY',        true, true),
('B0BR1L7L13',  '64oz Sleeve Only - Black Camo w/Cap',         '64oz Sleeve Only', 'BBS-MCB',             'BBS-MCB',             'BBS-MCB',             true, true),
('B09NP79SBC',  '64oz Sleeve Only - Earned Not Given Black',   '64oz Sleeve Only', 'BBS-BLK-BJJ-1',       'BBS32-BJJ-BLK',       'BBS-BLK-BJJ',         true, true),
('B0B3NHK26J',  '64oz Sleeve Only - Earned Not Given Grey',    '64oz Sleeve Only', 'BBS-GRY-BJJ',         'BBS-GRY-BJJ',         'BBS-GRY-BJJ',         true, true),
('B0B3NJMGBX',  '64oz Sleeve Only - Join or Die Tan',          '64oz Sleeve Only', 'BBS-TAN-JOD',         'BBS-TAN-JOD',         'BBS-TAN-JOD',         true, true),
('B0B3NJTDQL',  '64oz Sleeve Only - Live Free Black',          '64oz Sleeve Only', 'BBS-BLK-LF',          'BBS-BLK-LF',          'BBS-BLK-LF',          true, true),
('B0B3NJW9V5',  '64oz Sleeve Only - Overland Black',           '64oz Sleeve Only', 'BBS-BLK-OVLD',        'BBS-BLK-OVLD',        'BBS-BLK-OVLD',        true, true),
('B09XJQMKYW',  '64oz Sleeve Only - Sleep Deprived Black',     '64oz Sleeve Only', 'BBS-BLK-SLEEPDEP',    'BBSLVE-2L-BLK-SD',    'BBSLVE-2L-BLK-SD',    true, true),
('B09XJRZ8HW',  '64oz Sleeve Only - Sleep Deprived OD Green',  '64oz Sleeve Only', 'BBS-ODG-SLEEPDEP',    'BBSLVE-2L-GRN-SD',    'BBSLVE-2L-GRN-SD',    true, true),
('B0BR1JFY1M',  '64oz Sleeve Only - Woodland Camo',            '64oz Sleeve Only', 'BBS-WOOD-CAMO',       'BBS-WOODLAND',        'BBS-WOODLAND',        true, true),
('B0FPSSF4K5',  '64oz Sleeve Only - Tiger Stripe Green',       '64oz Sleeve Only', 'BBS-GRN-TS',          'BBS-GRN-TS',          'BBS-GRN-TS',          true, true),
('B0FPSDDQYZ',  '64oz Sleeve Only - Ruthless Rose',            '64oz Sleeve Only', 'BBS-PNKCAM',          'BBS-PNKCAM',          'BBS-PNKCAM',          true, true),
('B0FPSN883Q',  '64oz Sleeve Only - Ultraviolet',              '64oz Sleeve Only', 'BBS-PURCAM',          'BBS-PURCAM',          'BBS-PURCAM',          true, true),
('B0FPSFRQ5C',  '64oz Sleeve Only - Deep Water',               '64oz Sleeve Only', 'BBS-BLUCAM',          'BBS-BLUCAM',          'BBS-BLUCAM',          true, true),

-- ── 64oz Workforce Bottles (Northfox) ────────────────────────
('B0DG3M2V4L',  '64oz Workforce Bottle - Black',   '64oz Workforce Bottle', 'BBS-2L-JBBLK', 'BBS-2L-JBBLK', 'BBS-2L-JBBLK', true, true),
('B0DG3TMWD1',  '64oz Workforce Bottle - Orange',  '64oz Workforce Bottle', 'BBS-2L-JBORG', 'BBS-2L-JBORG', 'BBS-2L-JBORG', true, true),
('B0DG3SQJ9F',  '64oz Workforce Bottle - Red',     '64oz Workforce Bottle', 'BBS-2L-JBRED', 'BBS-2L-JBRED', 'BBS-2L-JBRED', true, true),
('B0DG3LMBSP',  '64oz Workforce Bottle - Yellow',  '64oz Workforce Bottle', 'BBS-2L-JBYLW', 'BBS-2L-JBYLW', 'BBS-2L-JBYLW', true, true),

-- ── 32oz Battle Bottles (Northfox) ───────────────────────────
('B0CMDWWWJT',  '32oz Battle Bottle - Arctic Camo',      '32oz Battle Bottle', 'BBS32-ARCCAMO-FBA',  'BB32-ARCTICCAMO', 'BB32-ARCTICCAMO', true, true),
('B0C63Y5BDL',  '32oz Battle Bottle - Betsy',            '32oz Battle Bottle', 'BBS32-BETSY-FBA',    'BB32-BTSY',       'BB32-BTSY',       true, true),
('B0C647DMSV',  '32oz Battle Bottle - Black Camo',       '32oz Battle Bottle', 'BBS32-MCB-FBA',      'BB32-CAMOBLK',    'BB32-CAMOBLK',    true, true),
('B0DK66ZH8Y',  '32oz Battle Bottle - Blue Line',        '32oz Battle Bottle', 'BBS32-TBL-FBA',      'BB32-TBL',        'BB32-TBL',        true, true),
('B0CMF53HHN',  '32oz Battle Bottle - Brown Recluse',    '32oz Battle Bottle', 'BBS32-BRECLUSE-FBA', 'BB32-RECLUSE',    'BB32-RECLUSE',    true, true),
('B0FPRLKSJL',  '32oz Battle Bottle - Cobalt',           '32oz Battle Bottle', 'BBS32-BLKBLU-FBA',   'BB32-BLKBLU',     'BB32-BLKBLU',     true, true),
('B0DK674TRK',  '32oz Battle Bottle - Earned Not Given', '32oz Battle Bottle', 'BBS32-BJJ-GRY-FBA',  'BB32-BJJ-GRY',    'BB32-BJJ-GRY',    true, true),
('B0FPRK5YZG',  '32oz Battle Bottle - MARPAT',           '32oz Battle Bottle', 'BBS32-TAN-MRPT-FBA', 'BB32-TAN-MRPT',   'BB32-MRPT',       true, true),
('B0C6438XD3',  '32oz Battle Bottle - OCP',              '32oz Battle Bottle', 'BBS32-OCP-FBA',      'BB32-OCP',        'BB32-OCP',        true, true),
('B0DK65Y29T',  '32oz Battle Bottle - Red Line',         '32oz Battle Bottle', 'BBS32-TRL-FBA',      'BB32-TRL',        'BB32-TRL',        true, true),
('B0FPRKSZM1',  '32oz Battle Bottle - Twilight',         '32oz Battle Bottle', 'BBS32-BLKPUR-FBA',   'BB32-BLKPUR',     'BB32-BLKPUR',     true, true),
('B0CMDPVP1N',  '32oz Battle Bottle - Valkyrie',         '32oz Battle Bottle', 'BBS32-BLK-PINK-FBA', 'BB32-BLKPNK',     'BB32-BLKPNK',     true, true),
('B0CMDJGLWN',  '32oz Battle Bottle - Widowmaker',       '32oz Battle Bottle', 'BBS32-WIDOWM-FBA',   'BB32-WMAKER',     'BB32-WMAKER',     true, true),

-- ── 32oz Sleeve Only (Dione) ─────────────────────────────────
('B0DKGD2GV1',  '32oz Sleeve Only - Earned Not Given Black',       '32oz Sleeve Only', 'BBS32-BJJ-BLK',    'BBS32-BJJ-BLK',    'BBS32-BJJ-BLK',    true, true),
('B0DKGDNR3Q',  '32oz Sleeve Only - Join or Die Black',            '32oz Sleeve Only', 'BBS32-JOD-BLK',    'BBS32-JOD-BLK',    'BBS32-JOD-BLK',    true, true),
('B0DKGCW9WQ',  '32oz Sleeve Only - Live Free Green',              '32oz Sleeve Only', 'BBS32-LF-GRN',     'BBS32-LF-GRN',     'BBS32-LF-GRN',     true, true),
('B0DKGFS48K',  '32oz Sleeve Only - Overland Green',               '32oz Sleeve Only', 'BBS32-OVL-GRN',    'BBS32-OVL-GRN',    'BBS32-OVL-GRN',    true, true),
('B0DKGDJYL5',  '32oz Sleeve Only - Join or Die Tan',              '32oz Sleeve Only', 'BSS32-JOD-TAN',    'BSS32-JOD-TAN',    'BBS32-JOD-TAN',    true, true),
('B0FPSCY7CR',  '32oz Sleeve Only - Tiger Stripe Green',           '32oz Sleeve Only', 'BBS32-GRN-TS',     'BBS32-GRN-TS',     'BBS32-GRN-TS',     true, true),
('B0FPSRPHTG',  '32oz Sleeve Only - Ruthless Rose',                '32oz Sleeve Only', 'BBS32-PNKCAM',     'BBS32-PNKCAM',     'BBS32-PNKCAM',     true, true),
('B0FPS8J68D',  '32oz Sleeve Only - Ultraviolet',                  '32oz Sleeve Only', 'BBS32-PURCAM',     'BBS32-PURCAM',     'BBS32-PURCAM',     true, true),
('B0FPSRJR6T',  '32oz Sleeve Only - Deep Water',                   '32oz Sleeve Only', 'BBS32-BLUCAM',     'BBS32-BLUCAM',     'BBS32-BLUCAM',     true, true)

ON CONFLICT (asin) DO UPDATE SET
  name         = EXCLUDED.name,
  product_line = EXCLUDED.product_line,
  fba_sku      = EXCLUDED.fba_sku,
  g10_sku      = EXCLUDED.g10_sku,
  shopify_sku  = EXCLUDED.shopify_sku,
  requires_patch = EXCLUDED.requires_patch,
  is_active    = EXCLUDED.is_active,
  updated_at   = now();


-- ═══════════════════════════════════════════════════════════════
-- STEP 2 — NORTHFOX PRIMARY SKU MAP
-- Bottles (128oz, 64oz Battle, 64oz Workforce, 32oz Battle)
-- manufacturer_sku = the code Northfox uses on PO line items
-- ═══════════════════════════════════════════════════════════════

INSERT INTO manufacturer_sku_map (product_id, manufacturer_id, manufacturer_sku)
SELECT p.id, m.id, v.mfr_sku
FROM (VALUES
  -- 128oz
  ('B0FFP5FB72', 'BB128-Betsy'),
  ('B0FFNXDT9M', 'BB128-BlackCamo'),
  ('B0FFNNSTXT', 'BB128-OCP'),
  -- 64oz Battle
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
  -- 64oz Workforce
  ('B0DG3M2V4L', '64-WF-Black'),
  ('B0DG3TMWD1', '64-WF-Orange'),
  ('B0DG3SQJ9F', '64-WF-Red'),
  ('B0DG3LMBSP', '64-WF-Yellow'),
  -- 32oz Battle
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
  ('B0CMDJGLWN', 'SKU2-Widowmaker')
) AS v(asin, mfr_sku)
JOIN products p ON p.asin = v.asin
CROSS JOIN (SELECT id FROM manufacturers WHERE name = 'Northfox') m
ON CONFLICT (product_id, manufacturer_id) DO UPDATE SET
  manufacturer_sku = EXCLUDED.manufacturer_sku;


-- ═══════════════════════════════════════════════════════════════
-- STEP 3 — DIONE PRIMARY SKU MAP
-- Sleeves (64oz Sleeve Only, 32oz Sleeve Only)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO manufacturer_sku_map (product_id, manufacturer_id, manufacturer_sku)
SELECT p.id, m.id, v.mfr_sku
FROM (VALUES
  -- 64oz Sleeves
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
  -- 32oz Sleeves
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
ON CONFLICT (product_id, manufacturer_id) DO UPDATE SET
  manufacturer_sku = EXCLUDED.manufacturer_sku;


-- ═══════════════════════════════════════════════════════════════
-- STEP 4 — PINSTAR PATCH SKU MAP
-- Every bottle AND sleeve gets a paired patch (requires_patch = true)
-- manufacturer_sku = the Pinstar code for that patch design
-- ═══════════════════════════════════════════════════════════════

INSERT INTO manufacturer_sku_map (product_id, manufacturer_id, manufacturer_sku)
SELECT p.id, m.id, v.patch_sku
FROM (VALUES
  -- 128oz Bottles
  ('B0FFP5FB72',  'PATCH-LOGO-BLK'),
  ('B0FFNXDT9M',  'PATCH-LOGO-BLK'),
  ('B0FFNNSTXT',  'PATCH-LOGO-TAN'),
  -- 64oz Battle Bottles
  ('B0C644YWHK',  'MP-ARCTFLG-GRY'),
  ('B09NP7WW8H',  'PATCH-LOGO-BLK'),
  ('B09NPBX66R',  'PATCH-LOGO-BLK'),
  ('B0DK67367D',  'MP-TBLFLAG'),
  ('B0BNW978Q5',  'PATCH-LOGO-BRN'),
  ('B0FPRM8W9Y',  'MP-WTP-BLU'),
  ('B0BQCZ5TW4',  'MP-WHTFLG'),
  ('B0BNW85SBK',  'PATCH-LOGO-GANG'),
  ('B09NP9HXK5',  'MP-GRYCAMO'),
  ('B09NP9MDQM',  'MP-CAMOFLG'),
  ('B0FPRLJ8J8',  'MP-MRPT-TAN'),
  ('B09NP98QBR',  'PATCH-LOGO-TAN'),
  ('B0B3NHNDH9',  'PATCH-OVLD-GRN'),
  ('B0DK673M16',  'MP-TRLFLAG'),
  ('B0FPRHJ1RR',  'MP-WTP-PUR'),
  ('B0FPRKSG1K',  'MP-WTP-PNK'),
  ('B0BNW9GWKM',  'PATCH-LOGO-GN'),
  ('B0B44TBCBQ',  'MP-CAMOFLG'),
  -- 64oz Sleeves
  ('B0B3NHXH6F',  'PATCH-LOGO-RWB'),
  ('B0BR1L7L13',  'PATCH-LOGO-BLK'),
  ('B09NP79SBC',  'MP-WHTFLG'),
  ('B0B3NHK26J',  'MP-WHTFLG'),
  ('B0B3NJMGBX',  'PATCH-LOGO-BRN'),
  ('B0B3NJTDQL',  'MP-GRYCAMO'),
  ('B0B3NJW9V5',  'PATCH-OVLD-BLK'),
  ('B09XJQMKYW',  'MP-GRYCAMO'),
  ('B09XJRZ8HW',  'MP-CAMOFLG'),
  ('B0BR1JFY1M',  'MP-CAMOFLG'),
  ('B0FPSSF4K5',  'MP-TS-GRN'),
  ('B0FPSDDQYZ',  'MP-WTP-PNK'),
  ('B0FPSN883Q',  'MP-WTP-PUR'),
  ('B0FPSFRQ5C',  'MP-WTP-BLU'),
  -- 64oz Workforce Bottles
  ('B0DG3M2V4L',  'MP-BUILT'),
  ('B0DG3TMWD1',  'MP-BUILT'),
  ('B0DG3SQJ9F',  'MP-BUILT'),
  ('B0DG3LMBSP',  'MP-BUILT'),
  -- 32oz Battle Bottles
  ('B0CMDWWWJT',  'MP-VERT-ARCT'),
  ('B0C63Y5BDL',  'MP-VERT-BETS'),
  ('B0C647DMSV',  'MP-VERT-MCB'),
  ('B0DK66ZH8Y',  'MP-VERT-TBL'),
  ('B0CMF53HHN',  'MP-VERT-RECLUSE'),
  ('B0FPRLKSJL',  'MP-VERT-WTP-BLU'),
  ('B0DK674TRK',  'MP-VERT-BJJ'),
  ('B0FPRK5YZG',  'MP-VERT-MRPT-TAN'),
  ('B0C6438XD3',  'MP-VERT-OCP'),
  ('B0DK65Y29T',  'MP-VERT-TRL'),
  ('B0FPRKSZM1',  'MP-VERT-WTP-PUR'),
  ('B0CMDPVP1N',  'MP-VERT-WTP-PNK'),
  ('B0CMDJGLWN',  'MP-VERT-WIDOW'),
  -- 32oz Sleeves
  ('B0DKGD2GV1',  'MP-VERT-BJJ'),
  ('B0DKGDNR3Q',  'MP-VERT-JOD'),
  ('B0DKGCW9WQ',  'MP-VERT-LF'),
  ('B0DKGFS48K',  'MP-VERT-OVLD'),
  ('B0DKGDJYL5',  'MP-VERT-JOD-TAN'),
  ('B0FPSCY7CR',  'MP-VERT-TS-GRN'),
  ('B0FPSRPHTG',  'MP-VERT-WTP-PNK'),
  ('B0FPS8J68D',  'MP-VERT-WTP-PUR'),
  ('B0FPSRJR6T',  'MP-VERT-WTP-BLU')
) AS v(asin, patch_sku)
JOIN products p ON p.asin = v.asin
CROSS JOIN (SELECT id FROM manufacturers WHERE name = 'Pinstar') m
ON CONFLICT (product_id, manufacturer_id) DO UPDATE SET
  manufacturer_sku = EXCLUDED.manufacturer_sku;
