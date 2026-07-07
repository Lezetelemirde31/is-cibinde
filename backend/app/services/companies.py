from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Company, Job


def list_companies(db: Session, *, q: str | None = None, page: int = 1, page_size: int = 12):
    page = max(1, page)
    page_size = min(48, page_size or 12)

    open_jobs_subquery = (
        select(func.count())
        .select_from(Job)
        .where(Job.company_id == Company.id, Job.status == "active")
        .correlate(Company)
        .scalar_subquery()
    )

    stmt = select(Company, open_jobs_subquery.label("open_jobs")).where(Company.status == "verified")
    if q:
        stmt = stmt.where(Company.name.ilike(f"%{q}%"))

    rows = db.execute(
        stmt.order_by(Company.created_at.desc()).limit(page_size).offset((page - 1) * page_size)
    ).all()

    items = [
        {
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "logo_url": c.logo_url,
            "industry": c.industry,
            "city": c.city,
            "open_jobs": open_jobs,
        }
        for c, open_jobs in rows
    ]
    return {"items": items, "page": page, "page_size": page_size}


def get_company_by_slug(db: Session, slug: str):
    company = db.scalar(select(Company).where(Company.slug == slug))
    if not company:
        return None
    open_jobs = db.scalars(
        select(Job)
        .where(Job.company_id == company.id, Job.status == "active")
        .order_by(Job.published_at.desc())
    ).all()
    return {"company": company, "open_jobs": open_jobs}


def company_for_owner(db: Session, owner_id):
    return db.scalar(select(Company).where(Company.owner_id == owner_id))
