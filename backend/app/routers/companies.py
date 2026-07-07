from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import DbDep, require_roles
from app.models import User
from app.schemas import CompanyDetail, CompanyListResponse, CompanySummary
from app.services import companies as companies_service

router = APIRouter(tags=["companies"])


@router.get("/companies", response_model=CompanyListResponse)
def list_companies(db: Session = DbDep, q: str | None = None, page: int = 1):
    return companies_service.list_companies(db, q=q, page=page)


@router.get("/companies/mine", response_model=CompanySummary | None)
def company_for_owner(user: User = Depends(require_roles("employer")), db: Session = DbDep):
    return companies_service.company_for_owner(db, user.id)


@router.get("/companies/{slug}", response_model=CompanyDetail)
def get_company(slug: str, db: Session = DbDep):
    data = companies_service.get_company_by_slug(db, slug)
    if not data:
        raise HTTPException(status_code=404, detail="Şirkət tapılmadı")

    company = data["company"]
    open_jobs = [
        {
            "id": j.id,
            "title": j.title,
            "slug": j.slug,
            "city": j.city,
            "is_remote": j.is_remote,
            "employment_type": j.employment_type,
            "experience_level": j.experience_level,
            "salary_min": j.salary_min,
            "salary_max": j.salary_max,
            "salary_currency": j.salary_currency,
            "salary_hidden": j.salary_hidden,
            "is_featured": j.is_featured,
            "published_at": j.published_at,
            "company_name": company.name,
            "company_slug": company.slug,
            "company_logo": company.logo_url,
        }
        for j in data["open_jobs"]
    ]
    return {"company": company, "open_jobs": open_jobs}
