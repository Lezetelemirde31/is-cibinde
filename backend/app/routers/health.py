from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.deps import DbDep

router = APIRouter(tags=["health"])


@router.get("/health")
def health(db: Session = DbDep):
    try:
        db.execute(text("select 1"))
        return {"status": "ok", "db": "up"}
    except Exception:
        return {"status": "degraded", "db": "down"}
