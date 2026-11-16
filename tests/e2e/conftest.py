"""
Lentera E2E Test Suite — Shared Fixtures
========================================
Domain     : @tests/e2e/
Lead       : Mu'adz Hudzaifah (Perancang Arsitektur Pengujian & Automasi)
Acuan      : @../../audit/specs/validation_rules.md
Target     : lentera-frontend (Next.js 16) — dev server lokal

Seluruh fixture di file ini DETERMINISTIK dan tidak menulis data:
- Akses dijaga lewat token gateway yang ditandatangani HMAC (stateless).
- Tidak ada skenario yang mengubah status aset pada langkah fixture.
"""

from __future__ import annotations

import os
from pathlib import Path

import pytest
from selenium import webdriver
from selenium.webdriver.edge.options import Options as EdgeOptions

# --- Path resolution -------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parents[2]
FRONTEND_DIR = REPO_ROOT / "lentera-frontend"
ENV_FILE = FRONTEND_DIR / ".env"
SPECS_FILE = REPO_ROOT / "audit" / "specs" / "validation_rules.md"


def load_env_file(path: Path) -> dict[str, str]:
    """Parse a dotenv-style file without adding a third-party dependency."""
    values: dict[str, str] = {}
    if not path.is_file():
        return values
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


# File .env milik aplikasi dibaca sebagai fallback, env eksternal tetap menang.
_FILE_ENV = load_env_file(ENV_FILE)


def env(name: str, default: str = "") -> str:
    return os.environ.get(name) or _FILE_ENV.get(name, default)


# --- Konstanta suite -------------------------------------------------------
BASE_URL = env("LENTERA_BASE_URL", "http://localhost:3000").rstrip("/")
GATEWAY_SECRET = env("GATEWAY_SECRET")
SUPABASE_URL = env("NEXT_PUBLIC_SUPABASE_URL")

# TTL token yang dipakai suite (menit) — cukup panjang untuk satu sesi run.
TOKEN_TTL_MINUTES = int(env("LENTERA_TOKEN_TTL_MINUTES", "15"))


@pytest.fixture(scope="session")
def base_url() -> str:
    """Origin aplikasi yang diuji (dev server lokal / staging)."""
    return BASE_URL


@pytest.fixture(scope="session")
def gateway_secret() -> str:
    """Secret HMAC untuk menandatangani token gateway."""
    if not GATEWAY_SECRET:
        pytest.skip("GATEWAY_SECRET tidak tersedia — tes token dilewati.")
    return GATEWAY_SECRET


@pytest.fixture(scope="session")
def env_report() -> dict[str, str]:
    """Ringkasan lingkungan untuk lampiran laporan (tanpa membocorkan secret)."""
    return {
        "base_url": BASE_URL,
        "env_file": str(ENV_FILE),
        "env_file_loaded": str(ENV_FILE.is_file()),
        "supabase_configured": bool(SUPABASE_URL),
        "gateway_secret_configured": bool(GATEWAY_SECRET),
        "specs_file": str(SPECS_FILE),
        "specs_file_exists": str(SPECS_FILE.is_file()),
    }


def _build_edge_options() -> EdgeOptions:
    options = EdgeOptions()
    # Headless default agar bisa jalan di pipeline; set LENTERA_HEADED=1 untuk inspeksi visual.
    if env("LENTERA_HEADED", "0") != "1":
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1366,900")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # Stabilisasi di mesin Windows/WSL
    options.add_argument("--disable-extensions")
    options.add_argument("--remote-allow-origins=*")
    return options


@pytest.fixture(scope="function")
def driver():
    """WebDriver Edge — Selenium Manager mengambil msedgedriver secara otomatis."""
    try:
        drv = webdriver.Edge(options=_build_edge_options())
    except Exception as exc:  # pragma: no cover - depends on host environment
        pytest.skip(f"WebDriver Edge tidak tersedia: {exc}")
    drv.set_page_load_timeout(30)
    drv.implicitly_wait(5)
    try:
        yield drv
    finally:
        drv.quit()


@pytest.fixture(scope="session")
def suite_metadata() -> dict[str, str]:
    """Metadata suite untuk ditulis ke artefak laporan.

    Catatan: nama fixture TIDAK boleh diawali `pytest_` karena pytest
    menganggapnya sebagai hook dan akan gagal memuat conftest.
    """
    return {
        "suite": "lentera-e2e",
        "branch": "qa/ppl-audit",
        "standard": "ISO/IEC/IEEE 29119",
    }
