from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import DbDep, get_current_user
from app.models import User
from app.schemas import DashboardStats
from app.services import dashboard as dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def stats(user: User = Depends(get_current_user), db: Session = DbDep):
    if user.role in ("admin", "moderator"):
        return {"role": user.role, "data": dashboard_service.staff_stats(db)}
    if user.role == "employer":
        return {"role": user.role, "data": dashboard_service.employer_stats(db, user.id)}
    return {"role": user.role, "data": dashboard_service.candidate_stats(db, user.id)}
