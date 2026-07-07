from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import DbDep, require_roles
from app.models import User
from app.schemas import EmployerApplicationRow, EmployerJobRow
from app.services import applications as applications_service
from app.services import companies as companies_service
from app.services import jobs as jobs_service

router = APIRouter(prefix="/employer", tags=["employer"])


@router.get("/jobs", response_model=list[EmployerJobRow])
def my_jobs(user: User = Depends(require_roles("employer")), db: Session = DbDep):
    company = companies_service.company_for_owner(db, user.id)
    if not company:
        return []
    return jobs_service.jobs_by_company(db, company.id)


@router.get("/applications", response_model=list[EmployerApplicationRow])
def my_applications(user: User = Depends(require_roles("employer")), db: Session = DbDep):
    return applications_service.applications_for_employer(db, user.id)
