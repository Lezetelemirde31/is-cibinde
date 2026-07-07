from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app import clerk
from app.models import CandidateProfile, Company, EmployerProfile, User
from app.utils import nanoid, slugify


def ensure_local_user(db: Session, *, clerk_id: str, email: str | None = None) -> User:
    """Get-or-create the local `users` row for a Clerk identity.

    Called just-in-time from get_current_user() and from the Clerk webhook, so
    the app never depends on webhook delivery timing to have a usable user row.
    """
    user = db.scalar(select(User).where(User.clerk_id == clerk_id))
    if user:
        if email and user.email != email:
            user.email = email
            db.commit()
            db.refresh(user)
        return user

    if not email:
        clerk_user = clerk.fetch_clerk_user(clerk_id)
        email = clerk.primary_email_for(clerk_user)

    user = User(clerk_id=clerk_id, email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def delete_local_user(db: Session, *, clerk_id: str) -> None:
    user = db.scalar(select(User).where(User.clerk_id == clerk_id))
    if user:
        db.delete(user)
        db.commit()


def touch_last_login(db: Session, user: User) -> None:
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()


class OnboardingError(Exception):
    def __init__(self, field_errors: dict[str, str]) -> None:
        self.field_errors = field_errors


def complete_onboarding(
    db: Session, *, user: User, role: str, full_name: str, company_name: str | None
) -> User:
    full_name = full_name.strip()
    if len(full_name) < 2:
        raise OnboardingError({"fullName": "Ad-soyad daxil edin"})
    if role not in ("job_seeker", "employer"):
        raise OnboardingError({"role": "Yanlış rol"})
    if role == "employer" and (not company_name or len(company_name.strip()) < 2):
        raise OnboardingError({"companyName": "Şirkət adı daxil edin"})

    user.role = role
    user.onboarding_completed_at = datetime.now(timezone.utc)

    if role == "job_seeker":
        existing = db.get(CandidateProfile, user.id)
        if not existing:
            db.add(CandidateProfile(user_id=user.id, full_name=full_name))
    else:
        company = Company(
            owner_id=user.id,
            name=company_name.strip(),  # type: ignore[union-attr]
            slug=f"{slugify(company_name) or 'sirket'}-{nanoid(6)}",  # type: ignore[arg-type]
        )
        db.add(company)
        db.flush()
        existing = db.get(EmployerProfile, user.id)
        if not existing:
            db.add(EmployerProfile(user_id=user.id, full_name=full_name, company_id=company.id))

    db.commit()
    db.refresh(user)

    clerk.update_public_metadata(user.clerk_id, {"role": role, "onboardingComplete": True})

    return user
