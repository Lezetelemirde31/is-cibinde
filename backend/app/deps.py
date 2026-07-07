from collections.abc import Generator

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app import clerk
from app.database import get_db
from app.models import User
from app.services.users import ensure_local_user

DbDep = Depends(get_db)


def _bearer_token(request: Request) -> str | None:
    header = request.headers.get("authorization") or request.headers.get("Authorization")
    if not header or not header.lower().startswith("bearer "):
        return None
    return header.split(" ", 1)[1].strip() or None


def get_optional_user(request: Request, db: Session = DbDep) -> User | None:
    token = _bearer_token(request)
    if not token:
        return None
    payload = clerk.verify_session_token(token)
    return ensure_local_user(db, clerk_id=payload.clerk_user_id)


def get_current_user(request: Request, db: Session = DbDep) -> User:
    user = get_optional_user(request, db)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sessiya tapılmadı")
    if user.status == "suspended":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Hesab dayandırılıb")
    return user


def require_roles(*roles: str):
    def dependency(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="İcazə yoxdur")
        return user

    return dependency


def require_onboarded(user: User = Depends(get_current_user)) -> User:
    if not user.onboarding_completed_at:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Profil tamamlanmayıb")
    return user
