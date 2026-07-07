from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import DbDep, require_roles
from app.models import User
from app.schemas import ApplicationStatusIn
from app.services import applications as applications_service

router = APIRouter(prefix="/applications", tags=["applications"])


@router.patch("/{application_id}/status")
def update_status(
    application_id: UUID,
    payload: ApplicationStatusIn,
    user: User = Depends(require_roles("employer")),
    db: Session = DbDep,
):
    result = applications_service.update_application_status(
        db, application_id=application_id, status=payload.status, acting_employer_id=user.id
    )
    if not result["ok"]:
        raise HTTPException(status_code=403, detail="İcazə yoxdur")
    return result
