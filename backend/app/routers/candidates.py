from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import DbDep, require_roles
from app.models import User
from app.schemas import CandidateSearchRow
from app.services import candidates as candidates_service

router = APIRouter(tags=["candidates"])


@router.get("/candidates", response_model=list[CandidateSearchRow])
def search_candidates(
    q: str | None = None,
    city: str | None = None,
    page: int = 1,
    user: User = Depends(require_roles("employer")),
    db: Session = DbDep,
):
    return candidates_service.search_candidates(db, q=q, city=city, page=page)


@router.get("/candidates/saved-ids", response_model=list[UUID])
def saved_candidate_ids(user: User = Depends(require_roles("employer")), db: Session = DbDep):
    return list(candidates_service.saved_candidate_ids(db, user.id))


@router.post("/candidates/{candidate_id}/save")
def toggle_save_candidate(
    candidate_id: UUID, user: User = Depends(require_roles("employer")), db: Session = DbDep
):
    saved = candidates_service.toggle_save_candidate(db, employer_id=user.id, candidate_id=candidate_id)
    return {"saved": saved}
