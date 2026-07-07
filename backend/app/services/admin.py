from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import AuditLog, Company, Job, User
from app.services.jobs import set_job_status
from app.services.notifications import create_notification


def log_action(db: Session, *, actor_id, action: str, entity_type: str, entity_id) -> None:
    db.add(AuditLog(actor_id=actor_id, action=action, entity_type=entity_type, entity_id=str(entity_id)))
    db.commit()


def moderate_job(db: Session, *, staff_id, job_id, status: str) -> dict:
    job = db.get(Job, job_id)
    if not job:
        return {"ok": False, "error": "Vakansiya tapılmadı"}

    set_job_status(db, job_id, status)
    log_action(db, actor_id=staff_id, action=f"job_{status}", entity_type="job", entity_id=job_id)

    if status == "active":
        create_notification(
            db,
            user_id=job.posted_by_id,
            type="job_approved",
            title="Vakansiya təsdiqləndi",
            body=f'"{job.title}" vakansiyası dərc edildi.',
            href="/dashboard/employer/jobs",
        )
    elif status == "rejected":
        create_notification(
            db,
            user_id=job.posted_by_id,
            type="system",
            title="Vakansiya rədd edildi",
            body=f'"{job.title}" vakansiyası moderasiyadan keçmədi.',
            href="/dashboard/employer/jobs",
        )
    return {"ok": True}


def set_company_status(db: Session, *, staff_id, company_id, status: str) -> dict:
    company = db.get(Company, company_id)
    if not company:
        return {"ok": False, "error": "Şirkət tapılmadı"}

    company.status = status
    company.verified_at = datetime.now(timezone.utc) if status == "verified" else None
    db.commit()
    log_action(db, actor_id=staff_id, action=f"company_{status}", entity_type="company", entity_id=company_id)

    if status == "verified":
        create_notification(
            db,
            user_id=company.owner_id,
            type="company_verified",
            title="Şirkət təsdiqləndi",
            body=f"{company.name} yoxlanıldı və təsdiqləndi.",
            href="/dashboard/employer/jobs",
        )
    return {"ok": True}


def set_user_role(db: Session, *, staff_id, user_id, role: str) -> dict:
    if str(user_id) == str(staff_id):
        return {"ok": False, "error": "Öz rolunu dəyişə bilməzsən"}
    user = db.get(User, user_id)
    if not user:
        return {"ok": False, "error": "İstifadəçi tapılmadı"}
    user.role = role
    db.commit()
    log_action(db, actor_id=staff_id, action=f"role_{role}", entity_type="user", entity_id=user_id)
    return {"ok": True}


def toggle_user_status(db: Session, *, staff_id, user_id) -> dict:
    if str(user_id) == str(staff_id):
        return {"ok": False, "error": "Öz hesabını dayandıra bilməzsən"}
    user = db.get(User, user_id)
    if not user:
        return {"ok": False, "error": "İstifadəçi tapılmadı"}
    next_status = "active" if user.status == "suspended" else "suspended"
    user.status = next_status
    db.commit()
    log_action(db, actor_id=staff_id, action=f"user_{next_status}", entity_type="user", entity_id=user_id)
    return {"ok": True}


def list_jobs_for_moderation(db: Session, limit: int = 100):
    rows = db.execute(
        select(Job, Company).join(Company, Job.company_id == Company.id).order_by(Job.created_at.desc()).limit(limit)
    ).all()
    return [
        {
            "id": job.id,
            "title": job.title,
            "slug": job.slug,
            "status": job.status,
            "created_at": job.created_at,
            "company_name": company.name,
        }
        for job, company in rows
    ]


def list_companies_for_moderation(db: Session, limit: int = 100):
    return db.scalars(select(Company).order_by(Company.created_at.desc()).limit(limit)).all()


def list_users_for_admin(db: Session, limit: int = 200):
    return db.scalars(select(User).order_by(User.created_at.desc()).limit(limit)).all()
