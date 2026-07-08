from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.deps import DbDep, get_current_user, get_optional_user, require_roles
from app.models import Company, Job, User
from app.schemas import (
    ApplyIn,
    JobCreateIn,
    JobDetail,
    JobListItem,
    JobListResponse,
    JobStatusIn,
)
from app.services import applications as applications_service
from app.services import jobs as jobs_service

router = APIRouter(tags=["jobs"])


def _job_detail_dict(job, company, category) -> dict:
    return {
        "id": job.id,
        "title": job.title,
        "slug": job.slug,
        "description": job.description,
        "responsibilities": job.responsibilities,
        "requirements": job.requirements,
        "employment_type": job.employment_type,
        "experience_level": job.experience_level,
        "city": job.city,
        "is_remote": job.is_remote,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "salary_currency": job.salary_currency,
        "salary_hidden": job.salary_hidden,
        "skills": job.skills,
        "status": job.status,
        "is_featured": job.is_featured,
        "published_at": job.published_at,
        "expires_at": job.expires_at,
        "created_at": job.created_at,
        "company": company,
        "category": category,
    }


@router.get("/jobs", response_model=JobListResponse)
def list_jobs(
    db: Session = DbDep,
    q: str | None = None,
    category_id: str | None = None,
    employment_type: str | None = None,
    city: str | None = None,
    remote: bool = False,
    experience_level: str | None = None,
    salary_min: int | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50),
):
    filters = jobs_service.JobFilters(
        q=q,
        category_id=category_id,
        employment_type=employment_type,
        city=city,
        remote=remote,
        experience_level=experience_level,
        salary_min=salary_min,
        page=page,
        page_size=page_size,
    )
    return jobs_service.list_jobs(db, filters)


@router.get("/jobs/latest", response_model=list[JobListItem])
def latest_jobs(db: Session = DbDep, limit: int = 6):
    return jobs_service.latest_jobs(db, limit)


@router.get("/jobs/{slug}", response_model=JobDetail)
def get_job(slug: str, db: Session = DbDep):
    row = jobs_service.get_job_by_slug(db, slug)
    if not row:
        raise HTTPException(status_code=404, detail="Vakansiya tapılmadı")
    return _job_detail_dict(*row)


@router.post("/jobs/{job_id}/view", status_code=204)
def view_job(job_id: UUID, db: Session = DbDep):
    jobs_service.increment_job_view(db, str(job_id))


@router.post("/jobs", response_model=JobDetail)
def create_job(
    payload: JobCreateIn, user: User = Depends(require_roles("employer")), db: Session = DbDep
):
    company = db.scalar(select(Company).where(Company.owner_id == user.id))
    if not company:
        raise HTTPException(status_code=422, detail="Əvvəlcə şirkət profilini yaradın.")

    skills = [s.strip() for s in (payload.skills or "").split(",") if s.strip()]
    job = jobs_service.create_job(
        db,
        company_id=company.id,
        posted_by_id=user.id,
        data={**payload.model_dump(), "skills": skills},
    )
    row = jobs_service.get_job_by_slug(db, job.slug)
    return _job_detail_dict(*row)


@router.patch("/jobs/{job_id}/status")
def change_job_status(
    job_id: UUID,
    payload: JobStatusIn,
    user: User = Depends(require_roles("employer")),
    db: Session = DbDep,
):
    job = db.get(Job, job_id)
    if not job or job.posted_by_id != user.id:
        raise HTTPException(status_code=403, detail="İcazə yoxdur")
    jobs_service.set_job_status(db, str(job_id), "closed" if payload.close else "active")
    return {"ok": True}


@router.post("/jobs/{job_id}/apply")
def apply_to_job(
    job_id: UUID,
    payload: ApplyIn,
    user: User = Depends(require_roles("job_seeker")),
    db: Session = DbDep,
):
    result = applications_service.apply_to_job(
        db, job_id=job_id, candidate_id=user.id, cover_letter=payload.cover_letter
    )
    if not result["ok"]:
        messages = {
            "already_applied": "Bu vakansiyaya artıq müraciət etmisən.",
            "job_unavailable": "Bu vakansiya artıq aktiv deyil.",
        }
        raise HTTPException(status_code=409, detail=messages.get(result["reason"], "Müraciət alınmadı."))
    return {"ok": True}


@router.get("/jobs/{job_id}/has-applied")
def has_applied(job_id: UUID, user: User | None = Depends(get_optional_user), db: Session = DbDep):
    if not user or user.role != "job_seeker":
        return {"applied": False}
    return {"applied": applications_service.has_applied(db, job_id=job_id, candidate_id=user.id)}


@router.post("/jobs/{job_id}/save")
def save_job(job_id: UUID, user: User = Depends(get_current_user), db: Session = DbDep):
    saved = jobs_service.toggle_save_job(db, user_id=user.id, job_id=job_id)
    return {"saved": saved}


@router.get("/jobs/{job_id}/edit", response_model=JobDetail)
def get_job_for_edit(job_id: UUID, user: User = Depends(require_roles("employer")), db: Session = DbDep):
    row = jobs_service.get_job_for_owner(db, job_id, user.id)
    if not row:
        raise HTTPException(status_code=404, detail="Vakansiya tapılmadı")
    return _job_detail_dict(*row)


@router.patch("/jobs/{job_id}", response_model=JobDetail)
def update_job(
    job_id: UUID,
    payload: JobCreateIn,
    user: User = Depends(require_roles("employer")),
    db: Session = DbDep,
):
    skills = [s.strip() for s in (payload.skills or "").split(",") if s.strip()]
    ok = jobs_service.update_job(db, job_id, user.id, {**payload.model_dump(), "skills": skills})
    if not ok:
        raise HTTPException(status_code=403, detail="İcazə yoxdur")
    row = jobs_service.get_job_for_owner(db, job_id, user.id)
    return _job_detail_dict(*row)
