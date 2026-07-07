import re
import secrets
import string
import unicodedata

_TRANSLIT = str.maketrans(
    {
        "ə": "e", "ç": "c", "ş": "s", "ğ": "g", "ı": "i", "ö": "o", "ü": "u",
        "Ə": "e", "Ç": "c", "Ş": "s", "Ğ": "g", "İ": "i", "Ö": "o", "Ü": "u",
    }
)

_ALPHABET = string.ascii_lowercase + string.digits


def slugify(value: str) -> str:
    value = value.translate(_TRANSLIT).lower()
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"(^-|-$)+", "", value)
    return value[:200]


def nanoid(size: int = 6) -> str:
    return "".join(secrets.choice(_ALPHABET) for _ in range(size))
