"""Clerk integration: session-token verification and Backend API calls.

Next.js attaches the signed-in user's Clerk session token as a Bearer token on
every request to this API. We verify it locally against Clerk's JWKS (no
network round-trip per request beyond the cached key set) and use the
`sub` claim as the Clerk user id. Email and profile metadata are fetched from
the Clerk Backend API on first sight of a user (see services/users.py).
"""

import time
from typing import Any

import httpx
import jwt
from fastapi import HTTPException, status

from app.config import settings

CLERK_API_BASE = "https://api.clerk.com/v1"

_jwks_client: jwt.PyJWKClient | None = None
_jwks_client_created_at = 0.0
_JWKS_CLIENT_TTL_SECONDS = 3600


def _get_jwks_client() -> jwt.PyJWKClient:
    global _jwks_client, _jwks_client_created_at
    now = time.time()
    if _jwks_client is None or now - _jwks_client_created_at > _JWKS_CLIENT_TTL_SECONDS:
        jwks_url = f"{settings.clerk_issuer.rstrip('/')}/.well-known/jwks.json"
        _jwks_client = jwt.PyJWKClient(jwks_url)
        _jwks_client_created_at = now
    return _jwks_client


class TokenPayload:
    def __init__(self, claims: dict[str, Any]) -> None:
        self.claims = claims

    @property
    def clerk_user_id(self) -> str:
        return self.claims["sub"]


def verify_session_token(token: str) -> TokenPayload:
    try:
        signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=settings.clerk_issuer,
            options={"verify_aud": False},
        )
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session"
        ) from exc
    return TokenPayload(claims)


def _clerk_headers() -> dict[str, str]:
    return {"Authorization": f"Bearer {settings.clerk_secret_key}"}


def fetch_clerk_user(clerk_user_id: str) -> dict[str, Any]:
    resp = httpx.get(f"{CLERK_API_BASE}/users/{clerk_user_id}", headers=_clerk_headers(), timeout=10)
    resp.raise_for_status()
    return resp.json()


def primary_email_for(clerk_user: dict[str, Any]) -> str:
    email_addresses = clerk_user.get("email_addresses", [])
    primary_id = clerk_user.get("primary_email_address_id")
    primary = next((e for e in email_addresses if e.get("id") == primary_id), None)
    if primary is None and email_addresses:
        primary = email_addresses[0]
    return primary["email_address"] if primary else ""


def update_public_metadata(clerk_user_id: str, metadata: dict[str, Any]) -> None:
    httpx.patch(
        f"{CLERK_API_BASE}/users/{clerk_user_id}/metadata",
        headers=_clerk_headers(),
        json={"public_metadata": metadata},
        timeout=10,
    ).raise_for_status()
