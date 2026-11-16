"""
HTTP Status Contract & BVA Tests
=================================
Domain : @tests/e2e/
Acuan  : @../../audit/specs/validation_rules.md §1 (NPM, Pilihan Aset) & §2 (Guard)
         @../../TEST_PLAN.md §3.C (API Status Contracts: 200/400/401/409)

JAMINAN TANPA MUTASI DATA
-------------------------
Urutan validasi pada app/api/borrow/route.ts adalah:

    (1) cek kelengkapan field      -> 400
    (2) verifikasi token gateway   -> 401
    (3) klaim aset (available)     -> 404 / 409   <-- menulis status aset
    (4) insert transaksi           -> 201         <-- menulis baris transaksi

Karena itu seluruh kasus di bawah berhenti SEBELUM langkah (3):
  * token tidak sah  -> berhenti di langkah (2), tidak ada tulisan.
  * aset tidak ada   -> langkah (3) tidak menemukan baris, tidak ada tulisan.

Tidak ada satu pun test di file ini yang mengubah status aset.
"""

from __future__ import annotations

import pytest
import requests

from gateway_token import (
    make_expired_token,
    make_malformed_token,
    make_tampered_token,
    make_token,
    make_wrong_secret_token,
    make_wrong_type_token,
)

# Payload minimal agar lolos langkah (1) cek kelengkapan field.
def _payload(token: str, asset_code: str = "ASSET-TIDAK-ADA-9999") -> dict:
    return {
        "asset_code": asset_code,
        "student_name": "Mu'adz Hudzaifah",
        "student_npm": "24903460014",
        "student_prodi": "TRM",
        "student_class": "TRM3A1",
        "subject": "Pengujian Perangkat Lunak",
        "lecturer": "Charmiyanti Nurkentjana Aju",
        "expected_return_at": None,
        "submission_token": token,
    }


# --------------------------------------------------------------------------
# Gateway validate contract
# --------------------------------------------------------------------------
@pytest.mark.api
class TestGatewayValidateContract:

    def test_validate_without_token_returns_400(self, base_url):
        r = requests.get(f"{base_url}/api/gateway/validate", timeout=20)
        assert r.status_code == 400, f"Didapat {r.status_code}, diharapkan 400."
        assert r.json()["status"] == "error"

    def test_validate_with_malformed_token_returns_401(self, base_url):
        r = requests.get(
            f"{base_url}/api/gateway/validate",
            params={"token": make_malformed_token()},
            timeout=20,
        )
        assert r.status_code == 401, f"Didapat {r.status_code}, diharapkan 401."


# --------------------------------------------------------------------------
# Token forgery resistance — deterministik, tidak menunggu kedaluwarsa
# --------------------------------------------------------------------------
@pytest.mark.api
@pytest.mark.guard
class TestTokenForgeryResistance:

    @pytest.mark.parametrize(
        "token_kind,expected_message",
        [
            ("expired", "kadaluarsa"),
            ("tampered", "tidak sah"),
            ("wrong_type", "Tipe token"),
            ("wrong_secret", "tidak sah"),
            ("malformed", "Format token"),
        ],
        ids=["expired", "tampered-signature", "wrong-type", "wrong-secret", "malformed"],
    )
    def test_borrow_rejects_invalid_token(self, base_url, gateway_secret, token_kind, expected_message):
        """Semua varian token tidak sah ditolak di langkah (2) -> 401, tanpa tulisan data."""
        builders = {
            "expired": lambda: make_expired_token(gateway_secret),
            "tampered": lambda: make_tampered_token(gateway_secret),
            "wrong_type": lambda: make_wrong_type_token(gateway_secret),
            "wrong_secret": make_wrong_secret_token,
            "malformed": make_malformed_token,
        }
        token = builders[token_kind]()
        r = requests.post(f"{base_url}/api/borrow", json=_payload(token), timeout=20)

        assert r.status_code == 401, (
            f"Varian token '{token_kind}' tidak ditolak (didapat {r.status_code}). "
            f"Respons: {r.text[:300]}"
        )
        assert expected_message.lower() in r.json().get("message", "").lower(), (
            f"Pesan penolakan tidak sesuai untuk '{token_kind}': {r.text[:300]}"
        )

    def test_expired_token_is_rejected_without_waiting(self, base_url, gateway_secret):
        """Token kedaluwarsa dibuat deterministik (exp di masa lalu) — tanpa jeda waktu."""
        token = make_expired_token(gateway_secret, expired_minutes_ago=5)
        r = requests.post(f"{base_url}/api/borrow", json=_payload(token), timeout=20)
        assert r.status_code == 401
        assert "kadaluarsa" in r.json()["message"].lower()


# --------------------------------------------------------------------------
# Field completeness contract
# --------------------------------------------------------------------------
@pytest.mark.api
class TestFieldCompleteness:

    @pytest.mark.parametrize(
        "missing_field",
        ["asset_code", "student_name", "student_npm"],
        ids=["asset_code", "student_name", "student_npm"],
    )
    def test_missing_required_field_returns_400(self, base_url, gateway_secret, missing_field):
        """Langkah (1): field wajib yang kosong -> 400 sebelum verifikasi token."""
        payload = _payload(make_token(gateway_secret))
        payload[missing_field] = ""
        r = requests.post(f"{base_url}/api/borrow", json=payload, timeout=20)
        assert r.status_code == 400, f"Didapat {r.status_code}, diharapkan 400."
        assert "tidak lengkap" in r.json()["message"].lower()


# --------------------------------------------------------------------------
# BOUNDARY VALUE ANALYSIS — NPM (spek §1)
# --------------------------------------------------------------------------
# Spek §1 menetapkan: "Panjang tepat 11 digit. Batas: 10 digit (min-1),
# 11 digit (valid), 12 digit (max+1)" dan tindakan sistem:
#   "Wajib tolak dengan pesan: 'NPM wajib berupa 11 digit angka'"
#
# Metode pembuktian yang AMAN:
#   token sah  +  asset_code yang tidak ada
#   -> lolos langkah (1) dan (2), berhenti di langkah (3) dengan 404.
#   Jika validasi NPM ada, ia berada di langkah (1) dan akan menghasilkan 400.
#   Karena itu 404 (bukan 400) membuktikan validasi format NPM tidak ada,
#   tanpa pernah menulis apa pun.
NPM_PARTITIONS = [
    ("min-1  (10 digit)", "1234567890", False),
    ("valid  (11 digit)", "24903460014", True),
    ("max+1  (12 digit)", "123456789012", False),
    ("huruf  (alfabet)", "ABC12345678", False),
    ("terlalu pendek", "12345", False),
    ("karakter spesial", "249034600!4", False),
]


@pytest.mark.bva
@pytest.mark.api
@pytest.mark.known_bug
class TestNpmBoundaryValueAnalysis:

    @pytest.mark.parametrize("label, npm, is_valid_per_spec", NPM_PARTITIONS)
    def test_npm_partition_is_not_rejected(self, base_url, gateway_secret, label, npm, is_valid_per_spec):
        """spek §1 vs implementasi — seluruh partisi menghasilkan 404, bukan 400.

        KESIMPULAN: format NPM tidak divalidasi sama sekali di lapis server,
        baik untuk nilai valid maupun tidak valid. Nilai di luar partisi
        ekuivalen (mis. `12345`) diterima sistem.
        """
        payload = _payload(make_token(gateway_secret))
        payload["student_npm"] = npm
        r = requests.post(f"{base_url}/api/borrow", json=payload, timeout=20)

        #404 = aset tidak ada; membuktikan permintaan melewati pemeriksaan field.
        assert r.status_code == 404, (
            f"[{label}] Didapat {r.status_code} (bukan 404). "
            f"Respons: {r.text[:300]}"
        )
        message = r.json().get("message", "")
        assert "npm" not in message.lower(), (
            f"[{label}] Sistem ternyata MENOLAK NPM: '{message}'. "
            "Validasi format sudah diimplementasikan — perbarui temuan ini."
        )
        if not is_valid_per_spec:
            # Catat eksplisit bahwa nilai tidak-valid tidak ditolak.
            assert r.status_code != 400, f"[{label}] Nilai tidak valid seharusnya ditolak 400."


@pytest.mark.bva
@pytest.mark.api
@pytest.mark.known_bug
def test_npm_error_message_specified_by_spec_is_absent(base_url, gateway_secret):
    """Pesan wajib spek §1: 'NPM wajib berupa 11 digit angka' tidak pernah muncul."""
    forbidden = "NPM wajib berupa 11 digit angka"
    for npm in ("12345", "ABC12345678", "123456789012"):
        payload = _payload(make_token(gateway_secret))
        payload["student_npm"] = npm
        r = requests.post(f"{base_url}/api/borrow", json=payload, timeout=20)
        assert forbidden.lower() not in r.text.lower(), (
            f"Pesan spek muncul untuk NPM '{npm}': {r.text[:300]}"
        )
