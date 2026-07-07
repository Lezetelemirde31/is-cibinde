from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.models import Application, CandidateProfile, Company, Job, User
from app.services.notifications import create_notification

STATUS_LABEL: dict[str, str] = {
    "submitted": "Göndərildi",
    "viewed": "Baxıldı",
    "shortlisted": "Seçilmişlər",
    "interview": "Müsahibə",
    "offer": "Təklif",
    "hired": "İşə qəbul",
    "rejected": "İmtina",
    "withdrawn": "Geri çəkildi",
}


def has_applied(db: Session, *, job_id, candidate_id) -> bool:
    return (
        db.scalar(
            select(Application.id).where(
                Application.job_id == job_id, Application.candidate_id == candidate_id
            )
        )
        is not None
    )


def apply_to_job(db: Session, *, job_id, candidate_id, cover_letter: str | None = None) -> dict:
    if has_applied(db, job_id=job_id, candidate_id=candidate_id):
        return {"ok": False, "reason": "already_applied"}

    job = db.get(Job, job_id)
    if not job or job.status != "active":
        return {"ok": False, "reason": "job_unavailable"}

    application = Application(job_id=job_id, candidate_id=candidate_id, cover_letter=cover_letter)
    db.add(application)
    job.application_count = job.application_count + 1
    db.commit()

    create_notification(
        db,
        user_id=job.posted_by_id,
        type="new_application",
        title="Yeni müraciət",
        body=f'"{job.title}" vakansiyasına yeni müraciət daxil oldu.',
        href="/dashboard/employer/applications",
    )
    return {"ok": True}


def applications_for_candidate(db: Session, candidate_id):
    rows = db.execute(
        select(Application, Job, Company)
        .join(Job, Application.job_id == Job.id)
        .join(Company, Job.company_id == Company.id)
        .where(Application.candidate_id == candidate_id)
        .order_by(Application.created_at.desc())
    ).all()
    return [
        {
            "id": app.id,
            "status": app.status,
            "created_at": app.created_at,
            "job_title": job.title,
            "job_slug": job.slug,
            "company_name": company.name,
        }
        for app, job, company in rows
    ]


def applications_for_employer(db: Session, employer_id):
    rows = db.execute(
        select(Application, Job, User, CandidateProfile)
        .join(Job, Application.job_id == Job.id)
        .join(User, Application.candidate_id == User.id)
        .outerjoin(CandidateProfile, Application.candidate_id == CandidateProfile.user_id)
        .where(Job.posted_by_id == employer_id)
        .order_by(Application.created_at.desc())
    ).all()
    return [
        {
            "id": app.id,
            "status": app.status,
            "created_at": app.created_at,
            "cover_letter": app.cover_letter,
            "job_id": job.id,
            "job_title": job.title,
            "candidate_id": app.candidate_id,
            "candidate_name": profile.full_name if profile else None,
            "candidate_headline": profile.headline if profile else None,
            "candidate_city": profile.city if profile else None,
            "candidate_email": user.email,
        }
        for app, job, user, profile in rows
    ]


def update_application_status(db: Session, *, application_id, status: str, acting_employer_id) -> dict:
    row = db.execute(
        select(Application, Job)
        .join(Job, Application.job_id == Job.id)
        .where(Application.id == application_id)
    ).first()
    if not row or row.Job.posted_by_id != acting_employer_id:
        return {"ok": False, "reason": "forbidden"}

    application, job = row
    application.status = status
    db.commit()

    create_notification(
        db,
        user_id=application.candidate_id,
        type="application_status",
        title="Müraciətinizin statusu dəyişdi",
        body=f'"{job.title}" — {STATUS_LABEL.get(status, status)}',
        href="/dashboard/candidate/applications",
    )
    return {"ok": True}
