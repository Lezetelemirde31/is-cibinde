from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import DbDep, require_roles
from app.models import User
from app.schemas import (
    CandidateApplicationRow,
    CandidateProfileIn,
    CandidateProfileOut,
    JobListItem,
    UrlIn,
)
from app.services import applications as applications_service
from app.services import candidates as candidates_service
from app.services import jobs as jobs_service

router = APIRouter(prefix="/candidate", tags=["candidate"])


@router.get("/applications", response_model=list[CandidateApplicationRow])
def my_applications(user: User = Depends(require_roles("job_seeker")), db: Session = DbDep):
    return applications_service.applications_for_candidate(db, user.id)


@router.get("/saved-jobs", response_model=list[JobListItem])
def my_saved_jobs(user: User = Depends(require_roles("job_seeker")), db: Session = DbDep):
    return jobs_service.saved_jobs_full(db, user.id)


@router.get("/profile", response_model=CandidateProfileOut | None)
def my_profile(user: User = Depends(require_roles("job_seeker")), db: Session = DbDep):
    return candidates_service.get_candidate_profile(db, user.id)


@router.patch("/profile", response_model=CandidateProfileOut)
def update_profile(
    payload: CandidateProfileIn, user: User = Depends(require_roles("job_seeker")), db: Session = DbDep
):
    return candidates_service.update_candidate_profile(db, user_id=user.id, data=payload.model_dump())


@router.patch("/profile/cv-url", response_model=CandidateProfileOut)
def update_cv_url(payload: UrlIn, user: User = Depends(require_roles("job_seeker")), db: Session = DbDep):
    if not payload.url.startswith(("http://", "https://")):
        raise HTTPException(status_code=422, detail="Yanlış URL")
    return candidates_service.save_cv_url(db, user_id=user.id, url=payload.url)


@router.patch("/profile/avatar-url", response_model=CandidateProfileOut)
def update_avatar_url(
    payload: UrlIn, user: User = Depends(require_roles("job_seeker")), db: Session = DbDep
):
    if not payload.url.startswith(("http://", "https://")):
        raise HTTPException(status_code=422, detail="Yanlış URL")
    return candidates_service.save_avatar_url(db, user_id=user.id, url=payload.url)
