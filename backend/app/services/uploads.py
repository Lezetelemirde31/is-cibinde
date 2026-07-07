import re

import boto3
from botocore.config import Config as BotoConfig

from app.config import settings
from app.utils import nanoid

UploadKind = str

KIND_RULES: dict[str, dict] = {
    "cv": {"prefix": "cv", "max_bytes": 8_000_000, "types": ["application/pdf"]},
    "document": {"prefix": "documents", "max_bytes": 10_000_000, "types": ["application/pdf"]},
    "logo": {
        "prefix": "logos",
        "max_bytes": 2_000_000,
        "types": ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    },
    "avatar": {
        "prefix": "avatars",
        "max_bytes": 2_000_000,
        "types": ["image/png", "image/jpeg", "image/webp"],
    },
}


def _r2_client():
    if not (settings.r2_account_id and settings.r2_access_key_id and settings.r2_secret_access_key):
        return None
    return boto3.client(
        "s3",
        endpoint_url=f"https://{settings.r2_account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
        region_name="auto",
        config=BotoConfig(signature_version="s3v4"),
    )


def validate_upload(kind: str, content_type: str, size: int) -> dict:
    rule = KIND_RULES.get(kind)
    if not rule:
        return {"ok": False, "error": "Naməlum fayl növü"}
    if content_type not in rule["types"]:
        return {"ok": False, "error": "Bu fayl növü qəbul edilmir"}
    if size > rule["max_bytes"]:
        return {"ok": False, "error": "Fayl həddindən böyükdür"}
    return {"ok": True, "rule": rule}


def create_upload_url(*, kind: str, owner_id, content_type: str, size: int, ext: str) -> dict:
    client = _r2_client()
    if not client or not settings.r2_bucket:
        return {"ok": False, "error": "Fayl saxlama konfiqurasiya edilməyib"}

    check = validate_upload(kind, content_type, size)
    if not check["ok"]:
        return check

    safe_ext = re.sub(r"[^a-z0-9]", "", ext.lower())
    key = f"{check['rule']['prefix']}/{owner_id}/{nanoid(16)}.{safe_ext}"

    upload_url = client.generate_presigned_url(
        "put_object",
        Params={"Bucket": settings.r2_bucket, "Key": key, "ContentType": content_type},
        ExpiresIn=600,
    )
    public_url = (
        f"{settings.r2_public_url}/{key}"
        if settings.r2_public_url
        else f"https://{settings.r2_account_id}.r2.cloudflarestorage.com/{settings.r2_bucket}/{key}"
    )
    return {"ok": True, "upload_url": upload_url, "key": key, "public_url": public_url}
