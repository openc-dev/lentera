-- ============================================================================
-- LENTERA QA SUITE — MOCK LAB ASSETS SEED SCRIPT
-- Scope: Menyediakan data inventaris alat lab tiruan untuk pengujian PPL
-- Catatan: Seluruh data uji diawali dengan kode "QA-MOCK-" agar mudah dipilah
-- ============================================================================

-- 1. Insert Kategori Uji (Jika belum ada)
INSERT INTO categories (id, name, description)
VALUES 
  ('cat-qa-camera', 'Kamera & Optik (QA Uji)', 'Kategori aset untuk pengujian laboratorium multimedia'),
  ('cat-qa-audio', 'Audio & Mikrofon (QA Uji)', 'Kategori aset audio untuk pengujian peminjaman'),
  ('cat-qa-iot', 'Perangkat IoT & Sensor (QA Uji)', 'Kategori modul embedded untuk simulasi konkurensi')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Aset Laboratorium Dummy untuk Pengujian
INSERT INTO assets (id, name, category_id, serial_number, status, condition, notes)
VALUES 
  ('asset-qa-001', 'Sony Alpha A7 III (Uji-01)', 'cat-qa-camera', 'SN-QA-SONY-001', 'available', 'good', 'Aset uji untuk skenario peminjaman normal'),
  ('asset-qa-002', 'Canon EOS R6 (Uji-02)', 'cat-qa-camera', 'SN-QA-CANON-002', 'available', 'good', 'Aset uji untuk skenario peminjaman normal'),
  ('asset-qa-003', 'Tripod Manfrotto Pro (Uji-03)', 'cat-qa-camera', 'SN-QA-TRIPOD-003', 'borrowed', 'good', 'Aset uji berstatus BORROWED untuk uji penolakan pinjam'),
  ('asset-qa-004', 'Rode Wireless GO II (Uji-04)', 'cat-qa-audio', 'SN-QA-RODE-004', 'available', 'good', 'Aset uji audio untuk skenario pengembalian cepat'),
  ('asset-qa-005', 'ESP32 DevKit V1 (Uji-05)', 'cat-qa-iot', 'SN-QA-ESP32-005', 'maintenance', 'fair', 'Aset uji berstatus MAINTENANCE untuk verifikasi status guard')
ON CONFLICT (id) DO UPDATE 
SET 
  status = EXCLUDED.status,
  condition = EXCLUDED.condition;

-- Catatan Eksekusi:
-- Script ini dapat dijalankan langsung di Supabase SQL Editor untuk mereset data uji ke status awal.
