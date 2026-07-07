from sqlalchemy import Text, cast, or_, select
from sqlalchemy.orm import Session

from app.models import CandidateProfile, SavedCandidate, User


def search_candidates(
    db: Session, *, q: str | None = None, city: str | None = None, page: int = 1, page_size: int = 12
):
    page = max(1, page)
    page_size = min(48, page_size or 12)

    stmt = (
        select(CandidateProfile, User)
        .join(User, CandidateProfile.user_id == User.id)
        .where(CandidateProfile.open_to_work.is_(True), User.status == "active")
    )
    if q:
        term = f"%{q}%"
        stmt = stmt.where(
            or_(
                CandidateProfile.full_name.ilike(term),
                CandidateProfile.headline.ilike(term),
                cast(CandidateProfile.skills, Text).ilike(term),
            )
        )
    if city:
        stmt = stmt.where(CandidateProfile.city.ilike(f"%{city}%"))

    rows = db.execute(
        stmt.order_by(CandidateProfile.updated_at.desc()).limit(page_size).offset((page - 1) * page_size)
    ).all()

    return [
        {
            "user_id": profile.user_id,
            "full_name": profile.full_name,
            "headline": profile.headline,
            "city": profile.city,
            "skills": profile.skills,
            "experience_level": profile.experience_level,
            "email": user.email,
            "cv_url": profile.cv_url,
        }
        for profile, user in rows
    ]


def saved_candidate_ids(db: Session, employer_id) -> set:
    rows = db.scalars(
        select(SavedCandidate.candidate_id).where(SavedCandidate.employer_id == employer_id)
    ).all()
    return set(rows)


def toggle_save_candidate(db: Session, *, employer_id, candidate_id) -> bool:
    existing = db.get(SavedCandidate, {"employer_id": employer_id, "candidate_id": candidate_id})
    if existing:
        db.delete(existing)
        db.commit()
        return False
    db.add(SavedCandidate(employer_id=employer_id, candidate_id=candidate_id))
    db.commit()
    return True


def get_candidate_profile(db: Session, user_id) -> CandidateProfile | None:
    return db.get(CandidateProfile, user_id)


def update_candidate_profile(db: Session, *, user_id, data: dict) -> CandidateProfile:
    profile = db.get(CandidateProfile, user_id)
    skills = [s.strip() for s in (data.get("skills") or "").split(",") if s.strip()]
    if profile is None:
        profile = CandidateProfile(user_id=user_id, full_name=data["full_name"])
        db.add(profile)
    profile.full_name = data["full_name"]
    profile.headline = data.get("headline") or None
    profile.phone = data.get("phone") or None
    profile.city = data.get("city") or None
    profile.about = data.get("about") or None
    profile.skills = skills
    profile.open_to_work = data.get("open_to_work", True)
    db.commit()
    db.refresh(profile)
    return profile


def save_cv_url(db: Session, *, user_id, url: str) -> CandidateProfile:
    profile = db.get(CandidateProfile, user_id)
    if profile is None:
        profile = CandidateProfile(user_id=user_id, full_name="")
        db.add(profile)
    profile.cv_url = url
    db.commit()
    db.refresh(profile)
    return profile


def save_avatar_url(db: Session, *, user_id, url: str) -> CandidateProfile:
    profile = db.get(CandidateProfile, user_id)
    if profile is None:
        profile = CandidateProfile(user_id=user_id, full_name="")
        db.add(profile)
    profile.avatar_url = url
    db.commit()
    db.refresh(profile)
    return profile
