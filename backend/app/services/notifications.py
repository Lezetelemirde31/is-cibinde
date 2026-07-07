from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Notification


def create_notification(
    db: Session, *, user_id, type: str, title: str, body: str | None = None, href: str | None = None
) -> None:
    db.add(Notification(user_id=user_id, type=type, title=title, body=body, href=href))
    db.commit()


def list_notifications(db: Session, user_id, limit: int = 30):
    return db.scalars(
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
    ).all()


def unread_count(db: Session, user_id) -> int:
    return (
        db.scalar(
            select(func.count())
            .select_from(Notification)
            .where(Notification.user_id == user_id, Notification.read_at.is_(None))
        )
        or 0
    )


def mark_all_read(db: Session, user_id) -> None:
    from datetime import datetime, timezone

    db.execute(
        Notification.__table__.update()
        .where(Notification.user_id == user_id, Notification.read_at.is_(None))
        .values(read_at=datetime.now(timezone.utc))
    )
    db.commit()
