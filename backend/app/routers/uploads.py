from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import DbDep, get_current_user
from app.models import User
from app.schemas import UploadPresignIn, UploadPresignOut
from app.services import uploads as uploads_service

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/presign", response_model=UploadPresignOut)
def presign_upload(
    payload: UploadPresignIn, user: User = Depends(get_current_user), db: Session = DbDep
):
    result = uploads_service.create_upload_url(
        kind=payload.kind,
        owner_id=user.id,
        content_type=payload.content_type,
        size=payload.size,
        ext=payload.ext,
    )
    if not result["ok"]:
        raise HTTPException(status_code=422, detail=result["error"])
    return result
