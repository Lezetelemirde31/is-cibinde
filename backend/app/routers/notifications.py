from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import DbDep, get_current_user
from app.models import User
from app.schemas import NotificationOut
from app.services import notifications as notifications_service

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationOut])
def list_notifications(user: User = Depends(get_current_user), db: Session = DbDep):
    return notifications_service.list_notifications(db, user.id)


@router.get("/unread-count")
def unread_count(user: User = Depends(get_current_user), db: Session = DbDep):
    return {"count": notifications_service.unread_count(db, user.id)}


@router.post("/read-all")
def read_all(user: User = Depends(get_current_user), db: Session = DbDep):
    notifications_service.mark_all_read(db, user.id)
    return {"ok": True}
