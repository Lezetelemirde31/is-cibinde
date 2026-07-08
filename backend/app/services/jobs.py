from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models import Category, Company, Job, SavedJob
from app.utils import nanoid, slugify


@dataclass
class JobFilters:
    q: str | None = None
    category_id: str | None = None
    employment_type: str | None = None
    city: str | None = None
    remote: bool = False
    experience_level: str | None = None
    salary_min: int | None = None
    page: int = 1
    page_size: int = 12


def list_jobs(db: Session, filters: JobFilters):
    page = max(1, filters.page)
    page_size = min(50, filters.page_size or 12)

    conditions = [Job.status == "active"]
    if filters.q:
        term = f"%{filters.q}%"
        conditions.append(or_(Job.title.ilike(term), Job.description.ilike(term)))
    if filters.category_id:
        conditions.append(Job.category_id == filters.category_id)
    if filters.employment_type:
        conditions.append(Job.employment_type == filters.employment_type)
    if filters.experience_level:
        conditions.append(Job.experience_level == filters.experience_level)
    if filters.city:
        conditions.append(Job.city.ilike(f"%{filters.city}%"))
    if filters.remote:
        conditions.append(Job.is_remote.is_(True))
    if filters.salary_min is not None:
        conditions.append(Job.salary_max >= filters.salary_min)

    total = db.scalar(
        select(func.count())
        .select_from(Job)
        .join(Company, Job.company_id == Company.id)
        .where(*conditions)
    )

    rows = db.execute(
        select(Job, Company)
        .join(Company, Job.company_id == Company.id)
        .where(*conditions)
        .order_by(Job.is_featured.desc(), Job.published_at.desc())
        .limit(page_size)
        .offset((page - 1) * page_size)
    ).all()

    items = [_to_list_item(job, company) for job, company in rows]
    return {"items": items, "total": total or 0, "page": page, "page_size": page_size}


def _to_list_item(job: Job, company: Company) -> dict:
    return {
        "id": job.id,
        "title": job.title,
        "slug": job.slug,
        "city": job.city,
        "is_remote": job.is_remote,
        "employment_type": job.employment_type,
        "experience_level": job.experience_level,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "salary_currency": job.salary_currency,
        "salary_hidden": job.salary_hidden,
        "is_featured": job.is_featured,
        "published_at": job.published_at,
        "company_name": company.name,
        "company_slug": company.slug,
        "company_logo": company.logo_url,
    }


def latest_jobs(db: Session, limit: int = 6):
    return list_jobs(db, JobFilters(page=1, page_size=limit))["items"]


def get_job_by_slug(db: Session, slug: str):
    row = db.execute(
        select(Job, Company, Category)
        .join(Company, Job.company_id == Company.id)
        .outerjoin(Category, Job.category_id == Category.id)
        .where(Job.slug == slug)
        .limit(1)
    ).first()
    return row


def increment_job_view(db: Session, job_id: str) -> None:
    db.execute(
        Job.__table__.update().where(Job.id == job_id).values(view_count=Job.view_count + 1)
    )
    db.commit()


def create_job(db: Session, *, company_id: str, posted_by_id: str, data: dict) -> Job:
    slug = f"{slugify(data['title'])}-{nanoid(6)}"
    now = datetime.now(timezone.utc)
    job = Job(
        company_id=company_id,
        posted_by_id=posted_by_id,
        category_id=data.get("category_id") or None,
        title=data["title"],
        slug=slug,
        description=data["description"],
        responsibilities=data.get("responsibilities") or None,
        requirements=data.get("requirements") or None,
        employment_type=data["employment_type"],
        experience_level=data.get("experience_level") or None,
        city=data.get("city") or None,
        is_remote=bool(data.get("is_remote")),
        salary_min=data.get("salary_min"),
        salary_max=data.get("salary_max"),
        salary_hidden=bool(data.get("salary_hidden")),
        skills=data.get("skills") or [],
        status="active",
        is_featured=False,
        published_at=now,
        expires_at=now + timedelta(days=30),
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def jobs_by_company(db: Session, company_id: str):
    return db.scalars(
        select(Job).where(Job.company_id == company_id).order_by(Job.created_at.desc())
    ).all()


def get_job_for_owner(db: Session, job_id, owner_id):
    return db.execute(
        select(Job, Company, Category)
        .join(Company, Job.company_id == Company.id)
        .outerjoin(Category, Job.category_id == Category.id)
        .where(Job.id == job_id, Job.posted_by_id == owner_id)
        .limit(1)
    ).first()


def update_job(db: Session, job_id, owner_id, data: dict) -> bool:
    job = db.get(Job, job_id)
    if not job or str(job.posted_by_id) != str(owner_id):
        return False
    job.title = data["title"]
    job.category_id = data.get("category_id") or None
    job.description = data["description"]
    job.responsibilities = data.get("responsibilities") or None
    job.requirements = data.get("requirements") or None
    job.employment_type = data["employment_type"]
    job.experience_level = data.get("experience_level") or None
    job.city = data.get("city") or None
    job.is_remote = bool(data.get("is_remote"))
    job.salary_min = data.get("salary_min")
    job.salary_max = data.get("salary_max")
    job.salary_hidden = bool(data.get("salary_hidden"))
    job.skills = data.get("skills") or []
    db.commit()
    return True


def set_job_status(db: Session, job_id: str, status: str) -> None:
    job = db.get(Job, job_id)
    if not job:
        return
    job.status = status
    if status == "active":
        job.published_at = datetime.now(timezone.utc)
    db.commit()


def toggle_save_job(db: Session, *, user_id, job_id) -> bool:
    existing = db.get(SavedJob, {"user_id": user_id, "job_id": job_id})
    if existing:
        db.delete(existing)
        db.commit()
        return False
    db.add(SavedJob(user_id=user_id, job_id=job_id))
    db.commit()
    return True


def saved_jobs_full(db: Session, user_id):
    rows = db.execute(
        select(Job, Company)
        .join(SavedJob, SavedJob.job_id == Job.id)
        .join(Company, Job.company_id == Company.id)
        .where(SavedJob.user_id == user_id)
        .order_by(SavedJob.created_at.desc())
    ).all()
    return [_to_list_item(job, company) for job, company in rows]
