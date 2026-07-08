from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Application, Company, Job, SavedJob, User


def candidate_stats(db: Session, user_id) -> dict:
    apps = db.scalar(
        select(func.count()).select_from(Application).where(Application.candidate_id == user_id)
    )
    saved = db.scalar(select(func.count()).select_from(SavedJob).where(SavedJob.user_id == user_id))
    active = db.scalar(
        select(func.count())
        .select_from(Application)
        .where(
            Application.candidate_id == user_id,
            Application.status.in_(["shortlisted", "interview", "offer"]),
        )
    )
    return {"apps": apps or 0, "saved": saved or 0, "active": active or 0}


def employer_stats(db: Session, user_id) -> dict:
    company = db.scalar(select(Company.id).where(Company.owner_id == user_id))
    open_jobs = db.scalar(
        select(func.count())
        .select_from(Job)
        .where(Job.posted_by_id == user_id, Job.status == "active")
    )
    total_apps = db.scalar(
        select(func.count())
        .select_from(Application)
        .join(Job, Application.job_id == Job.id)
        .where(Job.posted_by_id == user_id)
    )
    return {"has_company": company is not None, "open_jobs": open_jobs or 0, "total_apps": total_apps or 0}


def employer_analytics(db: Session, owner_id) -> dict:
    jobs = db.scalars(
        select(Job).where(Job.posted_by_id == owner_id).order_by(Job.created_at.desc())
    ).all()
    total_views = sum(j.view_count for j in jobs)
    total_apps = sum(j.application_count for j in jobs)
    active = sum(1 for j in jobs if j.status == "active")
    return {
        "totals": {
            "active_jobs": active,
            "total_views": total_views,
            "total_applications": total_apps,
        },
        "jobs": [
            {
                "id": j.id,
                "title": j.title,
                "slug": j.slug,
                "status": j.status,
                "views": j.view_count,
                "applications": j.application_count,
            }
            for j in jobs
        ],
    }


def staff_stats(db: Session) -> dict:
    pending_jobs = db.scalar(
        select(func.count()).select_from(Job).where(Job.status.in_(["pending_review", "draft"]))
    )
    pending_companies = db.scalar(
        select(func.count())
        .select_from(Company)
        .where(Company.status.in_(["pending_verification", "unverified"]))
    )
    total_users = db.scalar(select(func.count()).select_from(User))
    return {
        "pending_jobs": pending_jobs or 0,
        "pending_companies": pending_companies or 0,
        "total_users": total_users or 0,
    }
