# LAPORAN SPRINT PERTEMUAN 08
## AUTOMASI PENGUJIAN E2E: GUARD AKSES, KONTRAK API, DAN BOUNDARY VALUE ANALYSIS
> **Mata Kuliah:** Pengujian Perangkat Lunak (KB260004 &middot; 2 SKS)  
> **Kelompok:** 1 (TRM3A1) &middot; TA 2026/2027  
> **Dosen Pengampu:** Charmiyanti Nurkentjana Aju, S.Kom., M.Kom.  
> **Tanggal Sesi:** Senin, 16 November 2026 (Pertemuan Ke-8)  
> **Branch:** `qa/ppl-audit` &middot; **Commit:** `b14d3a2`  
> **Standar Acuan:** ISO/IEC/IEEE 29119 &middot; IEEE 829  

---

### 1. RINGKASAN EKSEKUTIF

Pada sesi ini Kelompok 1 menyelesaikan **suite otomasi pengujian ujung-ke-ujung (E2E) pertama** untuk platform Lentera. Suite ditulis dengan **Python 3.14 + pytest 9.2 + Selenium 4.52**, dijalankan terhadap **dev server Next.js 16 lokal**, dan seluruh asersinya dirujuk langsung ke spesifikasi batas nilai di `@../../audit/specs/validation_rules.md`.

Hasil akhir eksekusi: **25 kasus uji — 24 lulus, 1 *expected failure* (xfail), exit code 0, durasi ±109 detik.** Satu xfail tersebut bukan kegagalan suite, melainkan **dokumentasi resmi atas cacat nyata sistem** (BUG-SCAN-001) yang dibuktikan oleh tes pembanding di bawahnya.

Seluruh skenario bersifat **negatif/guard/BVA tanpa mutasi data**: tidak ada satu pun request yang mengubah status aset maupun baris transaksi pada basis data bersama tim.

Tiga temuan cacat/kelemahan dilaporkan pada bagian 6.

---

### 2. ARTEFAK YANG DILAPORKAN

**A. Suite Pengujian (`@../../tests/e2e/` — kavling Mu'adz):**

| Berkas | Peran |
|---|---|
| `conftest.py` | Fixture deterministik: `base_url`, `gateway_secret`, `driver` (Edge headless), pembaca `.env` |
| `gateway_token.py` | Pemalsu token HMAC gateway (kadaluarsa/tampered/tipe salah/secret salah/rusak) |
| `test_access_guards.py` | 7 kasus — guard URL langsung, struktur formulir, bukti BUG-SCAN-001 |
| `test_api_contracts.py` | 18 kasus — kontrak status HTTP, resistensi token, BVA NPM |
| `pytest.ini` | Marker: `guard`, `bva`, `api`, `known_bug` |
| `requirements.txt` | selenium, pytest, requests |

**B. Bukti Eksekusi (`@./` — kavling laporan):**

| Berkas | Isi |
|---|---|
| `HASIL_EKSEKUSI_P8.txt` | Log terminal lengkap `-v` (5.255 byte, UTF-8 bersih, exit code 0) |
| `@../../tests/e2e/results/junit.xml` | Artefak JUnit XML untuk integrasi mesin/laporan lanjutan |

---

### 3. LINGKUNGAN EKSEKUSI & PERSIAPAN

| Komponen | Nilai |
|---|---|
| Target sistem | `lentera-frontend` — Next.js 16.2.4 (Turbopack), React 19, TypeScript |
| Mode server | `next dev` lokal, `http://localhost:3000` |
| Peramban / driver | Microsoft Edge headless (Selenium Manager otomatis) |
| Python | 3.14.7 di dalam `.venv` (dibuat dengan `uv 0.12.19`) |
| Paket JS | `npm ci` — 371 paket (3 menit, cache hangat 106 MB) |
| Konfigurasi | 5 kunci `.env` terverifikasi valid (bukan placeholder) |

**Hambatan teknis yang terselesaikan (dicatat untuk reproduktifitas):**

1. **Repo berada pada path UNC WSL** (`\\wsl.localhost\...`). Dev server Next.js **tidak dapat berjalan dari path tersebut** — file watcher gagal dengan `EISDIR` berulang → *restart loop* 8× → seluruh request *timeout*.  
   **Solusi:** salinan kerja `lentera-frontend` (503 MB) dibuat di `C:\Users\Zahraan Dzakii\lentera-run\lentera-frontend` dan dev server dijalankan di sana. Salinan hanya untuk runtime lokal, **tidak masuk git**; suite tetap dibaca dan dijalankan dari repo asli.
2. **Cache `.next` korup** setelah *restart loop* menyebabkan error resolve `tailwindcss`. Dihapus (`rm -rf .next`) lalu server start bersih: `Ready in 1924ms`, **0 error watcher**, semua route menjawab benar (`/form/borrow` 200, `/form/return` 200, `/scan` 200, `/api/gateway/validate` tanpa token → 400).
3. **Konvensi pytest:** nama fixture tidak boleh diawali `pytest_` (diparse sebagai *hook*) — diperbaiki menjadi `suite_metadata`.

**Perintah reproduksi:**

```bash
# 1. terminal A — dev server (dari salinan Windows)
cd C:\Users\Zahraan Dzakii\lentera-run\lentera-frontend && npm run dev

# 2. terminal B — suite
cd tests/e2e
.venv\Scripts\python.exe -m pytest -v --tb=short --junitxml=results/junit.xml
```

---

### 4. METODOLOGI & JAMINAN TANPA MUTASI DATA

**Acuan asersi:** `@../../audit/specs/validation_rules.md` (spek §1 NPM & Pilihan Aset, spek §2 Guard).

**Invarian keamanan yang dipatuhi seluruh kasus uji** — berdasarkan urutan validasi pada `app/api/borrow/route.ts`:

```
(1) cek kelengkapan field   → 400
(2) verifikasi token gateway→ 401
(3) klaim aset (available)  → 404 / 409   ← TULISAN DATA
(4) insert transaksi        → 201         ← TULISAN DATA
```

* Token **tidak sah** → berhenti di langkah (2).
* `asset_code` **tidak ada** → langkah (3) tidak menemukan baris, tidak ada tulisan.
* **Tidak pernah** mengirim kombinasi *token valid + aset tersedia nyata*.

Konsekuensinya, pembuktian pelanggaran spek NPM menjadi aman dan deterministik: jika validasi NPM ada, ia berada di langkah (1) dan akan menjawab **400**; kenyataannya semua partisi menjawab **404** (lolos langkah (1)–(2), berhenti di langkah (3)) → **bukti sah bahwa validasi NPM tidak ada, tanpa mutasi apa pun.**

**Teknik yang dipakai:**
* **Guard / Negative testing** — akses langsung tanpa token, token sampah, token kadaluarsa.
* **Boundary Value Analysis** — partisi NPM: 10 digit (min-1), 11 digit (valid), 12 digit (max+1), alfabet, terlalu pendek, karakter spesial.
* **Token deterministik** — token kadaluarsa dibuat dengan `exp` di masa lalu (tanpa menunggu waktu); token *tampered* dibuat dengan membalik 1 byte signature (lolos cek panjang, ditolak `timingSafeEqual`).

---

### 5. HASIL EKSEKUSI

**Ringkasan:** `24 passed, 1 xfailed in 108.81s` — **exit code 0**.

| # | Grup kasus uji | Marker | Jumlah | Hasil |
|---|---|---|---|---|
| 1 | Guard URL langsung (`/form/borrow`, `/form/return`, `/scan`) | `guard` | 4 | 3 lulus, **1 xfail** |
| 2 | Bukti perilaku aktual `/scan` (BUG-SCAN-001) | `known_bug` | 1 | lulus |
| 3 | Struktur formulir & atribut NPM di DOM | `guard` | 2 | lulus |
| 4 | Kontrak `GET /api/gateway/validate` (400/401) | `api` | 2 | lulus |
| 5 | Resistensi pemalsuan token (5 varian + kadaluarsa tanpa jeda) | `guard, api` | 6 | lulus |
| 6 | Kontrak kelengkapan field (400) | `api` | 3 | lulus |
| 7 | **BVA NPM** (6 partisi + pesan wajib spek) | `bva, api, known_bug` | 7 | lulus |
| | **Total** | | **25** | **24 lulus + 1 xfail** |

**Catatan hasil penting:**

* Seluruh **5 varian token tidak sah** (kadaluarsa, signature diubah, tipe salah, secret salah, format rusak) ditolak **401** dengan pesan yang sesuai — lapisan kriptografi gateway bekerja sebagaimana dirancang.
* Seluruh **6 partisi NPM** menghasilkan **404, bukan 400** — memvalidasi temuan №2 pada bagian 6.
* Tes `test_npm_input_has_no_format_restriction` membuktikan di sisi peramban: `input[name=student_npm]` hanya memiliki atribut `required` (tanpa `pattern`/`minlength`/`maxlength`), dan nilai `12345` dinyatakan **valid** oleh Constraint Validation API (`validity.valid === true`).

---

### 6. TEMUAN CACAT & KELEMAHAN

#### Temuan №1 — BUG-SCAN-001: Halaman `/scan` nyangkut di *spinner* selamanya
* **Kelas:** Cacat fungsional (guard) &middot; **Severity:** Sedang–Tinggi (pengguna terkunci tanpa umpan balik)
* **Kondisi:** Buka `http://localhost:3000/scan` **tanpa** parameter `token`.
* **Perilaku aktual:** halaman menampilkan `Memvalidasi QR Code...` selamanya. Pesan `Token QR tidak ditemukan` tidak pernah muncul meski sudah menunggu.
* **Bukti HTML (respons server):**

  | Teks di HTML | Ada? |
  |---|---|
  | `Memvalidasi QR Code...` (spinner) | ✅ |
  | `Token QR tidak ditemukan` | ❌ |
  | `Akses Diterima` | ❌ |

* **Akar masalah** — `lentera-frontend/app/scan/page.tsx`:

  ```tsx
  const [loading, setLoading] = useState(!qrToken);   // tanpa token → loading = true
  const [error, setError] = useState(qrToken ? '' : 'Token QR tidak ditemukan...');
  useEffect(() => {
    if (!qrToken) return;   // ← early-return; loading tidak pernah menjadi false
    ...
  }, [qrToken]);
  ```

  Karena `loading` tetap `true`, komponen selalu merender cabang spinner dan **tidak pernah mencapai cabang `error`** — pesan penolakan tersimpan di state tetapi tak pernah tampil.
* **Status di suite:** ditandai `xfail(strict=True)` pada `test_scan_page_without_token_shows_error`, didampingi tes pembanding `test_scan_page_actual_behaviour_is_infinite_spinner` (lolos) sebagai bukti perilaku. `strict=True` memaksa tes otomatis **gagal** begitu cacat diperbaiki, sehingga marker wajib dihapus.
* **Usulan perbaikan:** set `setLoading(false)` pada cabang `if (!qrToken)` (atau inisialisasi `loading` dengan `Boolean(qrToken)` + render `error` saat token kosong).

#### Temuan №2 — Validasi format NPM tidak diimplementasikan (pelanggaran spek §1)
* **Kelas:** Pelanggaran spesifikasi &middot; **Severity:** Tinggi (integritas data transaksi)
* **Spek** (`@../../audit/specs/validation_rules.md` baris 12): NPM wajib **tepat 11 digit angka**; batas 10 (min-1) dan 12 (max+1); tindakan sistem: *"Wajib tolak dengan pesan: 'NPM wajib berupa 11 digit angka'"*.
* **Kenapa ini berbahaya:** guard pengembalian (spek baris 33) membandingkan NPM peminjam aktif — bila format bebas, input seperti `12345` diterima dan memicu pencocokan yang tidak bermakna.

| Partisi (BVA) | Nilai | Seharusnya (spek) | Aktual |
|---|---|---|---|
| min-1 (10 digit) | `1234567890` | 400 tolak | **404 (diterima)** |
| valid (11 digit) | `24903460014` | lanjut | 404 (karena aset uji tidak ada) |
| max+1 (12 digit) | `123456789012` | 400 tolak | **404 (diterima)** |
| alfabet | `ABC12345678` | 400 tolak | **404 (diterima)** |
| terlalu pendek | `12345` | 400 tolak | **404 (diterima)** |
| karakter spesial | `249034600!4` | 400 tolak | **404 (diterima)** |

* Pesan wajib `"NPM wajib berupa 11 digit angka"` **tidak pernah muncul** pada seluruh partisi.
* **Dua lapis terbukti tidak memvalidasi:** (a) server — semua partisi lolos cek field; (b) peramban — `input[student_npm]` tanpa `pattern`/`minlength`/`maxlength`.
* **Usulan perbaikan:** tambah pola `pattern="[0-9]{11}"` + `maxlength/minlength` di form, **dan** pemeriksaan `/^\\d{11}$/` di langkah (1) `app/api/borrow/route.ts` (validasi klien saja tidak cukup).

#### Temuan №3 — Secret gateway dengan *hardcoded fallback* untuk mode non-produksi
* **Kelas:** Kelemahan keamanan (defence-in-depth) &middot; **Severity:** Rendah–Sedang
* **Lokasi** — `lentera-frontend/lib/gateway-token.ts` baris 3–12:

  ```ts
  const secret = process.env.GATEWAY_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: GATEWAY_SECRET or SUPABASE_SERVICE_ROLE_KEY must be defined in production.');
    }
    return 'lentera-dev-fallback-gateway-secret-2026';   // ← literal tercatat di git
  }
  ```

* **Dampak:** apabila `GATEWAY_SECRET` tidak ter-set di lingkungan non-produksi (dev/staging), secret menjadi **diketahui publik lewat repositori** → siapa pun dapat memalsukan token gateway yang valid. Pola serupa ada di `lib/auth-server.ts` baris 10 (`lentera-dev-fallback-admin-secret-2026`).
* **Catatan mitigasi yang sudah ada:** cabang `production` melempar error (gagal-cetak) — jadi produksi aman *asalkan* `NODE_ENV` benar.
* **Usulan perbaikan:** hapus literal dan gagalkan start di semua mode bila secret kosong, atau generate secret acak per-install; setidaknya tandai sebagai `TODO(security)` dan pantau lewat GitHub Issue.

---

### 7. BUKTI EKSEKUSI (EKSTRAK)

Dari `HASIL_EKSEKUSI_P8.txt` (tanggal eksekusi 2026-11-16, branch `qa/ppl-audit`, commit `b14d3a2`):

```text
platform win32 -- Python 3.14.7, pytest-9.2.0, pluggy-1.7.0
collected 25 items

test_access_guards.py::TestDirectUrlGuards::test_borrow_form_rejects_access_without_token PASSED
test_access_guards.py::TestDirectUrlGuards::test_return_form_rejects_access_without_token PASSED
test_access_guards.py::TestDirectUrlGuards::test_borrow_form_rejects_garbage_token PASSED
test_access_guards.py::TestDirectUrlGuards::test_scan_page_without_token_shows_error XFAIL
test_access_guards.py::TestDirectUrlGuards::test_scan_page_actual_behaviour_is_infinite_spinner PASSED
test_access_guards.py::TestFormStructure::test_borrow_form_declares_all_spec_fields PASSED
test_access_guards.py::TestFormStructure::test_borrow_form_npm_input_has_no_format_restriction PASSED
test_api_contracts.py::TestNpmBoundaryValueAnalysis::test_npm_partition_is_not_rejected[min-1  (10 digit)-1234567890-False] PASSED
test_api_contracts.py::TestNpmBoundaryValueAnalysis::test_npm_partition_is_not_rejected[valid  (11 digit)-24903460014-True] PASSED
test_api_contracts.py::TestNpmBoundaryValueAnalysis::test_npm_partition_is_not_rejected[max+1  (12 digit)-123456789012-False] PASSED
test_api_contracts.py::TestNpmBoundaryValueAnalysis::test_npm_partition_is_not_rejected[huruf  (alfabet)-ABC12345678-False] PASSED
test_api_contracts.py::TestNpmBoundaryValueAnalysis::test_npm_partition_is_not_rejected[terlalu pendek-12345-False] PASSED
test_api_contracts.py::TestNpmBoundaryValueAnalysis::test_npm_partition_is_not_rejected[karakter spesial-249034600!4-False] PASSED
...
=========================== short test summary info ===========================
XFAIL test_access_guards.py::TestDirectUrlGuards::test_scan_page_without_token_shows_error - BUG-SCAN-001: /scan tanpa parameter `token` nyangkut di spinner selamanya. ...
================== 24 passed, 1 xfailed in 108.81s (0:01:48) ==================

EXIT CODE: 0
```

*(Daftar lengkap 25 baris hasil tersedia pada `HASIL_EKSEKUSI_P8.txt`.)*

---

### 8. RENCANA KERJA PERTEMUAN BERIKUTNYA
- **Buka GitHub Issue** untuk BUG-SCAN-001, pelanggaran validasi NPM, dan *hardcoded fallback secret* (penemuan manual Syifa ditautkan lewat `ref #N`).
- **Regressi positif terbatas** pada data buatan sendiri (khususnya alur *return* yang cocok-NPM) setelah cella mutasi diizinkan.
- **Perluas suite** ke `app/api/return/route.ts` (guard NPM peminjam aktif) dan kontrak `409` status aset.
- **Integrasi bukti** ke `SLIDES_P8.md` (diagram Mermaid alur guard token dari `@../../audit/diagrams`).
