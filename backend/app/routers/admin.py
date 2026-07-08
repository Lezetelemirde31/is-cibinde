from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import DbDep, require_roles
from app.models import User
from app.schemas import (
    ActivityEvent,
    AdminCompanyRow,
    AdminJobRow,
    AdminUserRow,
    ModerateJobIn,
    SetCompanyStatusIn,
    SetUserRoleIn,
)
from app.services import admin as admin_service

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/activity", response_model=list[ActivityEvent])
def activity(user: User = Depends(require_roles("admin", "moderator")), db: Session = DbDep):
    return admin_service.recent_activity(db)


@router.get("/jobs", response_model=list[AdminJobRow])
def list_jobs(user: User = Depends(require_roles("admin", "moderator")), db: Session = DbDep):
    return admin_service.list_jobs_for_moderation(db)


@router.post("/jobs/{job_id}/moderate")
def moderate_job(
    job_id: UUID,
    payload: ModerateJobIn,
    user: User = Depends(require_roles("admin", "moderator")),
    db: Session = DbDep,
):
    result = admin_service.moderate_job(db, staff_id=user.id, job_id=job_id, status=payload.status)
    if not result["ok"]:
        raise HTTPException(status_code=404, detail=result.get("error"))
    return result


@router.get("/companies", response_model=list[AdminCompanyRow])
def list_companies(user: User = Depends(require_roles("admin", "moderator")), db: Session = DbDep):
    return admin_service.list_companies_for_moderation(db)


@router.post("/companies/{company_id}/status")
def set_company_status(
    company_id: UUID,
    payload: SetCompanyStatusIn,
    user: User = Depends(require_roles("admin", "moderator")),
    db: Session = DbDep,
):
    result = admin_service.set_company_status(db, staff_id=user.id, company_id=company_id, status=payload.status)
    if not result["ok"]:
        raise HTTPException(status_code=404, detail=result.get("error"))
    return result


@router.get("/users", response_model=list[AdminUserRow])
def list_users(user: User = Depends(require_roles("admin")), db: Session = DbDep):
    return admin_service.list_users_for_admin(db)


@router.post("/users/{user_id}/role")
def set_user_role(
    user_id: UUID, payload: SetUserRoleIn, staff: User = Depends(require_roles("admin")), db: Session = DbDep
):
    result = admin_service.set_user_role(db, staff_id=staff.id, user_id=user_id, role=payload.role)
    if not result["ok"]:
        raise HTTPException(status_code=422, detail=result.get("error"))
    return result


@router.post("/users/{user_id}/toggle-status")
def toggle_user_status(
    user_id: UUID, staff: User = Depends(require_roles("admin")), db: Session = DbDep
):
    result = admin_service.toggle_user_status(db, staff_id=staff.id, user_id=user_id)
    if not result["ok"]:
        raise HTTPException(status_code=422, detail=result.get("error"))
    return result
