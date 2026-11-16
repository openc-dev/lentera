"""
Gateway Token Forger — Deterministic Session Tokens for E2E
===========================================================
Domain : @tests/e2e/
Acuan  : lentera-frontend/lib/gateway-token.ts

Mengapa perlu memalsukan token?
-------------------------------
Token gateway Lentera bersifat STATELESS HMAC (bukan disimpan di database):

    token   = base64url(payload) + "." + base64url(HMAC-SHA256(payload, secret))
    payload = {"exp": <epoch ms>, "nonce": "<hex>", "type": "kiosk_gateway"}

Konsekuensinya, masa berlaku token dapat dibuat secara DETERMINISTIK tanpa
harus menunggu waktu: cukup menyetel `exp` ke masa lalu untuk memperoleh token
kadaluarsa, atau mengubah satu byte signature untuk memperoleh token curang.

Ini memungkinkan pengujian pertahanan berikut TANPA menunggu dan TANPA
menulis data apa pun ke basis data:
    * penolakan token kadaluarsa        -> HTTP 401
    * penolakan signature yang diubah   -> HTTP 401
    * penolakan tipe token yang salah   -> HTTP 401
    * penolakan format token rusak      -> HTTP 401
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import secrets
import time

TOKEN_TYPE = "kiosk_gateway"


def _b64url(data: bytes) -> str:
    """Setara dengan Buffer#toString('base64url') di Node.js (tanpa padding)."""
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _encode_payload(payload: dict) -> str:
    # JSON.stringify() menghasilkan JSON padat tanpa spasi.
    raw = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    return _b64url(raw)


def _sign(payload_encoded: str, secret: str) -> str:
    digest = hmac.new(secret.encode("utf-8"), payload_encoded.encode("utf-8"), hashlib.sha256).digest()
    return _b64url(digest)


def _payload(exp_epoch_ms: int) -> dict:
    # nonce 12 byte -> 24 karakter hex, identik dengan crypto.randomBytes(12).
    return {
        "exp": exp_epoch_ms,
        "nonce": secrets.token_hex(12),
        "type": TOKEN_TYPE,
    }


def make_token(secret: str, ttl_minutes: int = 15) -> str:
    """Token sah yang berlaku selama `ttl_minutes`."""
    payload = _payload(int(time.time() * 1000) + ttl_minutes * 60_000)
    encoded = _encode_payload(payload)
    return f"{encoded}.{_sign(encoded, secret)}"


def make_expired_token(secret: str, expired_minutes_ago: int = 5) -> str:
    """Token sah secara kriptografis tetapi `exp`-nya sudah lewat.

    Menyerang lapisan: `if (Date.now() > payload.exp)`.
    """
    payload = _payload(int(time.time() * 1000) - expired_minutes_ago * 60_000)
    encoded = _encode_payload(payload)
    return f"{encoded}.{_sign(encoded, secret)}"


def make_tampered_token(secret: str, ttl_minutes: int = 15) -> str:
    """Payload valid tetapi signature diganti — menyerang `timingSafeEqual`."""
    payload = _payload(int(time.time() * 1000) + ttl_minutes * 60_000)
    encoded = _encode_payload(payload)
    signature = _sign(encoded, secret)
    # Balik karakter pertama agar panjang tetap sama (lolos cek panjang).
    flipped = ("A" if signature[0] != "A" else "B") + signature[1:]
    return f"{encoded}.{flipped}"


def make_wrong_type_token(secret: str, ttl_minutes: int = 15) -> str:
    """Signature sah tetapi `type` bukan 'kiosk_gateway'.

    Menyerang lapisan: `if (payload.type !== 'kiosk_gateway')`.
    """
    payload = _payload(int(time.time() * 1000) + ttl_minutes * 60_000)
    payload["type"] = "session_token"
    encoded = _encode_payload(payload)
    return f"{encoded}.{_sign(encoded, secret)}"


def make_malformed_token() -> str:
    """Token tanpa pemisah '.' — menyerang `parts.length !== 2`."""
    return "not-a-valid-token"


def make_wrong_secret_token() -> str:
    """Token ditandatangani dengan secret lain — memalsukan penyerang luar."""
    payload = _payload(int(time.time() * 1000) + 15 * 60_000)
    encoded = _encode_payload(payload)
    return f"{encoded}.{_sign(encoded, 'attacker-controlled-secret')}"
