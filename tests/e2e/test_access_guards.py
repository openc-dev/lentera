"""
Access & Session Guard Tests — UI Level
=======================================
Domain : @tests/e2e/
Acuan  : @../../audit/specs/validation_rules.md  §1 (Pilihan Aset) & §2 (Guard)
         @../../TEST_PLAN.md §2.1 (Kiosk Gateway Session & QR Token Rotation)

Sifat  : NEGATIF / GUARD — tidak ada data yang ditulis.
         Kasus-kasus ini memverifikasi bahwa halaman formulir menolak akses
         langsung (*direct URL guard*) tanpa token sesi yang sah.
"""

from __future__ import annotations

import time

import pytest
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

# Teks penolakan persis seperti yang dideklarasikan di halaman formulir.
DENIED_BORROW = "Akses ditolak. Token sesi tidak ditemukan."
DENIED_RETURN = "Akses ditolak. Token sesi tidak ditemukan."
SCAN_NO_TOKEN = "Token QR tidak ditemukan"

WAIT = 12


def _wait_for_text(driver, text: str, timeout: int = WAIT) -> bool:
    try:
        WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located(
                (By.XPATH, f"//*[contains(normalize-space(.), {text!r})]")
            )
        )
        return True
    except TimeoutException:
        return False


@pytest.mark.guard
class TestDirectUrlGuards:
    """Direct URL guard: membuka halaman formulir tanpa token sesi."""

    def test_borrow_form_rejects_access_without_token(self, driver, base_url):
        """/form/borrow tanpa submission_token -> ditolak (spek §1: aset wajib lewat sesi)."""
        driver.get(f"{base_url}/form/borrow")
        assert _wait_for_text(driver, DENIED_BORROW), (
            "Formulir pinjam tidak menolak akses tanpa token sesi. "
            "Halaman yang tampil: " + driver.find_element(By.TAG_NAME, "body").text[:400]
        )

    def test_return_form_rejects_access_without_token(self, driver, base_url):
        """/form/return tanpa submission_token -> ditolak."""
        driver.get(f"{base_url}/form/return")
        assert _wait_for_text(driver, DENIED_RETURN), (
            "Formulir pengembalian tidak menolak akses tanpa token sesi."
        )

    def test_borrow_form_rejects_garbage_token(self, driver, base_url):
        """Token bukan HMAC sah -> API menolak (401) dan formulir beralih ke state error.

        Catatan orisinalitas: komponen merender formulir SEBENTAR sebelum
        permintaan `form-options` gagal (state awal `loadingOptions=false`
        karena `submission_token` ada). Karena itu assert-nya menunggu state
        error terpasang lebih dulu, baru memastikan formulir sudah tidak ada.
        """
        driver.get(f"{base_url}/form/borrow?submission_token=definitely-not-a-valid-token")

        assert _wait_for_text(driver, "Format token tidak valid"), (
            "Formulir pinjam tidak menampilkan penolakan token. Halaman: "
            + driver.find_element(By.TAG_NAME, "body").text[:400]
        )
        assert not _asset_selector_present(driver), (
            "Pemilih alat masih dirender setelah token ditolak."
        )

    @pytest.mark.xfail(
        strict=True,
        reason=(
            "BUG-SCAN-001: /scan tanpa parameter `token` nyangkut di spinner selamanya. "
            "State `loading` diinisialisasi `!qrToken` (true) dan useEffect melakukan "
            "early-return tanpa pernah mengubahnya, sehingga cabang `error` tidak pernah "
            "dirender. Pesan 'Token QR tidak ditemukan' ada di state tapi tak terlihat. "
            "Lihat test pembanding di bawah untuk bukti perilaku aktual."
        ),
    )
    def test_scan_page_without_token_shows_error(self, driver, base_url):
        """/scan tanpa parameter token -> SEHARUSNYA menampilkan pesan kesalahan pindai."""
        driver.get(f"{base_url}/scan")
        assert _wait_for_text(driver, SCAN_NO_TOKEN), (
            "Halaman scan tidak menampilkan pesan 'token tidak ditemukan'."
        )

    @pytest.mark.known_bug
    def test_scan_page_actual_behaviour_is_infinite_spinner(self, driver, base_url):
        """BUKTI PERILAKU AKTUAL (BUG-SCAN-001): halaman berhenti di spinner.

        Dipakai sebagai lampiran laporan: membuktikan bahwa cabang loading
        dirender dan cabang error tidak pernah tercapai.
        """
        driver.get(f"{base_url}/scan")
        assert _wait_for_text(driver, "Memvalidasi QR Code"), (
            "Spinner tidak tampil — perilaku mungkin sudah berubah, perbarui temuan ini."
        )
        # Beri waktu bagi permintaan/efek untuk menyelesaikan keadaannya.
        time.sleep(4)
        assert not _wait_for_text(driver, SCAN_NO_TOKEN, timeout=2), (
            "Pesan error kini tampil — BUG-SCAN-001 sepertinya sudah diperbaiki. "
            "Hapus penanda xfail pada test pembanding."
        )


def _has_asset_selector(driver) -> bool:
    """True bila select pemilih alat sudah dirender di DOM (menunggu hingga 6 dtk)."""
    try:
        WebDriverWait(driver, 6).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'select[name="code"]'))
        )
        return True
    except TimeoutException:
        return False


def _asset_selector_present(driver) -> bool:
    """Pemeriksaan SEGERA tanpa jeda — dipakai setelah state diketahui stabil."""
    return bool(driver.find_elements(By.CSS_SELECTOR, 'select[name="code"]'))


@pytest.mark.guard
class TestFormStructure:
    """Struktur formulir wajib sesuai sebagaimana dideklarasikan di spek §1.

    Token sah dipakai HANYA agar halaman dirender. Pemuatan daftar alat
    memakai endpoint GET read-only (`/assets/form-options`, `/categories`)
    sehingga tidak ada data yang berubah.
    """

    # Kolom wajib pada spek §1 — nama atribut sesuai app/form/borrow/page.tsx
    REQUIRED_FIELDS = (
        "category_filter",
        "code",
        "student_name",
        "student_npm",
        "student_prodi",
        "student_class",
        "subject",
        "lecturer",
        "return_date",
        "return_time",
    )

    def _open_borrow_form(self, driver, base_url, gateway_secret):
        from gateway_token import make_token

        token = make_token(gateway_secret, ttl_minutes=15)
        driver.get(f"{base_url}/form/borrow?submission_token={token}")
        WebDriverWait(driver, WAIT).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "form"))
        )

    def test_borrow_form_declares_all_spec_fields(self, driver, base_url, gateway_secret):
        """Seluruh kolom wajib spek §1 tersedia pada DOM formulir peminjaman."""
        self._open_borrow_form(driver, base_url, gateway_secret)
        names = {
            el.get_attribute("name")
            for el in driver.find_elements(By.CSS_SELECTOR, "form [name]")
        }
        missing = [f for f in self.REQUIRED_FIELDS if f not in names]
        assert not missing, f"Kolom wajib spek §1 tidak ditemukan pada DOM: {missing}"

    def test_borrow_form_npm_input_has_no_format_restriction(self, driver, base_url, gateway_secret):
        """BUG YANG DIDOKUMENTASIKAN (spek §1 vs implementasi).

        Spek mewajibkan NPM berupa tepat 11 digit angka. Input NPM pada
        formulir hanya memakai `required` — tanpa `pattern`, `minlength`,
        maupun `maxlength`. Ketiadaan pembatasan format ini yang membuat
        nilai di luar partisi ekuivalen (mis. `12345`) diterima peramban.
        """
        self._open_borrow_form(driver, base_url, gateway_secret)
        npm = driver.find_element(By.CSS_SELECTOR, 'input[name="student_npm"]')
        assert npm.get_attribute("required") is not None, "Input NPM kehilangan atribut required."
        assert npm.get_attribute("pattern") in (None, ""), (
            "Input NPM ternyata memakai pattern — perbarui temuan ini."
        )
        assert npm.get_attribute("maxlength") in (None, ""), (
            "Input NPM ternyata memakai maxlength — perbarui temuan ini."
        )
        # Bukti runtime: nilai di luar partisi ekuivalen lolos validasi peramban.
        npm.clear()
        npm.send_keys("12345")
        invalid = driver.execute_script(
            "return arguments[0].validity.valid;", npm
        )
        assert invalid is True, (
            "Input NPM menolak '12345' — berarti validasi format sudah ada, "
            "hapus penanda known_bug pada spek."
        )
