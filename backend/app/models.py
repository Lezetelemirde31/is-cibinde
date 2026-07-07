import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import ENUM as PgEnum
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

# ------------------------------------------------------------------ #
# Enums                                                               #
# ------------------------------------------------------------------ #

user_role_enum = PgEnum(
    "job_seeker", "employer", "moderator", "admin", name="user_role", create_type=True
)
user_status_enum = PgEnum(
    "active", "suspended", "pending_verification", name="user_status", create_type=True
)
employment_type_enum = PgEnum(
    "full_time",
    "part_time",
    "contract",
    "internship",
    "temporary",
    "remote",
    name="employment_type",
    create_type=True,
)
experience_level_enum = PgEnum(
    "entry", "junior", "mid", "senior", "lead", "executive", name="experience_level", create_type=True
)
job_status_enum = PgEnum(
    "draft", "pending_review", "active", "closed", "rejected", "expired", name="job_status", create_type=True
)
application_status_enum = PgEnum(
    "submitted",
    "viewed",
    "shortlisted",
    "interview",
    "offer",
    "hired",
    "rejected",
    "withdrawn",
    name="application_status",
    create_type=True,
)
company_status_enum = PgEnum(
    "unverified",
    "pending_verification",
    "verified",
    "rejected",
    name="company_status",
    create_type=True,
)
interview_status_enum = PgEnum(
    "scheduled", "completed", "cancelled", "no_show", name="interview_status", create_type=True
)
notification_type_enum = PgEnum(
    "application_status",
    "new_application",
    "new_message",
    "interview_scheduled",
    "job_approved",
    "company_verified",
    "system",
    name="notification_type",
    create_type=True,
)
locale_enum = PgEnum("az", "ru", "tr", "en", name="locale", create_type=True)


def uuid_pk() -> Mapped[uuid.UUID]:
    return mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


def created_at_col() -> Mapped[datetime]:
    return mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())


def updated_at_col() -> Mapped[datetime]:
    return mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )


# ------------------------------------------------------------------ #
# Identity                                                            #
# ------------------------------------------------------------------ #


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = uuid_pk()
    clerk_id: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False, index=True)
    role: Mapped[str] = mapped_column(user_role_enum, nullable=False, default="job_seeker", index=True)
    status: Mapped[str] = mapped_column(user_status_enum, nullable=False, default="active")
    preferred_locale: Mapped[str] = mapped_column(locale_enum, nullable=False, default="az")
    onboarding_completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = created_at_col()
    updated_at: Mapped[datetime] = updated_at_col()

    candidate_profile: Mapped["CandidateProfile"] = relationship(back_populates="user", uselist=False)
    employer_profile: Mapped["EmployerProfile"] = relationship(back_populates="user", uselist=False)


# ------------------------------------------------------------------ #
# Candidate side                                                     #
# ------------------------------------------------------------------ #


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    full_name: Mapped[str] = mapped_column(String(160), nullable=False)
    headline: Mapped[str | None] = mapped_column(String(200))
    phone: Mapped[str | None] = mapped_column(String(32))
    city: Mapped[str | None] = mapped_column(String(120), index=True)
    about: Mapped[str | None] = mapped_column(Text)
    cv_url: Mapped[str | None] = mapped_column(Text)
    cv_data: Mapped[dict | None] = mapped_column(JSONB)
    skills: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    experience_level: Mapped[str | None] = mapped_column(experience_level_enum)
    open_to_work: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, index=True)
    avatar_url: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = created_at_col()
    updated_at: Mapped[datetime] = updated_at_col()

    user: Mapped["User"] = relationship(back_populates="candidate_profile")


# ------------------------------------------------------------------ #
# Employer side                                                      #
# ------------------------------------------------------------------ #


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[uuid.UUID] = uuid_pk()
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(220), unique=True, nullable=False, index=True)
    logo_url: Mapped[str | None] = mapped_column(Text)
    website: Mapped[str | None] = mapped_column(String(300))
    industry: Mapped[str | None] = mapped_column(String(120))
    size_range: Mapped[str | None] = mapped_column(String(40))
    city: Mapped[str | None] = mapped_column(String(120))
    about: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(company_status_enum, nullable=False, default="unverified", index=True)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = created_at_col()
    updated_at: Mapped[datetime] = updated_at_col()

    owner: Mapped["User"] = relationship()
    jobs: Mapped[list["Job"]] = relationship(back_populates="company")


class EmployerProfile(Base):
    __tablename__ = "employer_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    company_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id", ondelete="SET NULL")
    )
    full_name: Mapped[str] = mapped_column(String(160), nullable=False)
    job_title: Mapped[str | None] = mapped_column(String(120))
    phone: Mapped[str | None] = mapped_column(String(32))
    created_at: Mapped[datetime] = created_at_col()
    updated_at: Mapped[datetime] = updated_at_col()

    user: Mapped["User"] = relationship(back_populates="employer_profile")


# ------------------------------------------------------------------ #
# Taxonomy                                                            #
# ------------------------------------------------------------------ #


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[uuid.UUID] = uuid_pk()
    parent_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), index=True)
    slug: Mapped[str] = mapped_column(String(140), unique=True, nullable=False, index=True)
    name_az: Mapped[str] = mapped_column(String(140), nullable=False)
    name_ru: Mapped[str | None] = mapped_column(String(140))
    name_en: Mapped[str | None] = mapped_column(String(140))
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


# ------------------------------------------------------------------ #
# Jobs                                                                #
# ------------------------------------------------------------------ #


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[uuid.UUID] = uuid_pk()
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True
    )
    posted_by_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    category_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), index=True
    )
    title: Mapped[str] = mapped_column(String(220), nullable=False)
    slug: Mapped[str] = mapped_column(String(260), unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    responsibilities: Mapped[str | None] = mapped_column(Text)
    requirements: Mapped[str | None] = mapped_column(Text)
    employment_type: Mapped[str] = mapped_column(employment_type_enum, nullable=False, default="full_time")
    experience_level: Mapped[str | None] = mapped_column(experience_level_enum)
    city: Mapped[str | None] = mapped_column(String(120), index=True)
    is_remote: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    salary_min: Mapped[int | None] = mapped_column(Integer)
    salary_max: Mapped[int | None] = mapped_column(Integer)
    salary_currency: Mapped[str] = mapped_column(String(3), nullable=False, default="AZN")
    salary_hidden: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    skills: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    status: Mapped[str] = mapped_column(job_status_enum, nullable=False, default="pending_review")
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    view_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    application_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = created_at_col()
    updated_at: Mapped[datetime] = updated_at_col()

    company: Mapped["Company"] = relationship(back_populates="jobs")
    category: Mapped["Category | None"] = relationship()
    posted_by: Mapped["User"] = relationship()


class SavedJob(Base):
    __tablename__ = "saved_jobs"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), primary_key=True, index=True
    )
    created_at: Mapped[datetime] = created_at_col()


# ------------------------------------------------------------------ #
# Applications                                                        #
# ------------------------------------------------------------------ #


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (UniqueConstraint("job_id", "candidate_id", name="applications_job_candidate_idx"),)

    id: Mapped[uuid.UUID] = uuid_pk()
    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True
    )
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    cover_letter: Mapped[str | None] = mapped_column(Text)
    cv_url: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(application_status_enum, nullable=False, default="submitted")
    employer_note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = created_at_col()
    updated_at: Mapped[datetime] = updated_at_col()

    job: Mapped["Job"] = relationship()
    candidate: Mapped["User"] = relationship()


class SavedCandidate(Base):
    __tablename__ = "saved_candidates"

    employer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = created_at_col()


# ------------------------------------------------------------------ #
# Interviews                                                          #
# ------------------------------------------------------------------ #


class Interview(Base):
    __tablename__ = "interviews"

    id: Mapped[uuid.UUID] = uuid_pk()
    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True
    )
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=45)
    location: Mapped[str | None] = mapped_column(Text)
    is_online: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    status: Mapped[str] = mapped_column(interview_status_enum, nullable=False, default="scheduled")
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = created_at_col()

    application: Mapped["Application"] = relationship()


# ------------------------------------------------------------------ #
# Messaging                                                           #
# ------------------------------------------------------------------ #


class Conversation(Base):
    __tablename__ = "conversations"
    __table_args__ = (
        UniqueConstraint("employer_id", "candidate_id", "job_id", name="conversations_pair_idx"),
    )

    id: Mapped[uuid.UUID] = uuid_pk()
    job_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="SET NULL")
    )
    employer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    last_message_at: Mapped[datetime] = created_at_col()
    created_at: Mapped[datetime] = created_at_col()


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = uuid_pk()
    conversation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    sender_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    body: Mapped[str] = mapped_column(Text, nullable=False)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = created_at_col()


# ------------------------------------------------------------------ #
# Notifications                                                       #
# ------------------------------------------------------------------ #


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = uuid_pk()
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    type: Mapped[str] = mapped_column(notification_type_enum, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    body: Mapped[str | None] = mapped_column(Text)
    href: Mapped[str | None] = mapped_column(Text)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = created_at_col()


# ------------------------------------------------------------------ #
# Content: blog, FAQ, contact                                         #
# ------------------------------------------------------------------ #


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id: Mapped[uuid.UUID] = uuid_pk()
    author_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )
    slug: Mapped[str] = mapped_column(String(260), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(260), nullable=False)
    excerpt: Mapped[str | None] = mapped_column(Text)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    cover_url: Mapped[str | None] = mapped_column(Text)
    published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = created_at_col()


class Faq(Base):
    __tablename__ = "faqs"

    id: Mapped[uuid.UUID] = uuid_pk()
    question: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    audience: Mapped[str] = mapped_column(String(20), nullable=False, default="all")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[uuid.UUID] = uuid_pk()
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    subject: Mapped[str | None] = mapped_column(String(200))
    message: Mapped[str] = mapped_column(Text, nullable=False)
    handled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = created_at_col()


# ------------------------------------------------------------------ #
# Audit                                                               #
# ------------------------------------------------------------------ #


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[uuid.UUID] = uuid_pk()
    actor_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True
    )
    action: Mapped[str] = mapped_column(String(80), nullable=False)
    entity_type: Mapped[str | None] = mapped_column(String(60), index=True)
    entity_id: Mapped[str | None] = mapped_column(String(80))
    log_metadata: Mapped[dict | None] = mapped_column("metadata", JSONB)
    created_at: Mapped[datetime] = created_at_col()
