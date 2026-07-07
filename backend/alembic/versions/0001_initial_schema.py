"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-01-01 00:00:00

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def _enum(name: str, *values: str) -> postgresql.ENUM:
    return postgresql.ENUM(*values, name=name, create_type=False)


USER_ROLE = _enum("user_role", "job_seeker", "employer", "moderator", "admin")
USER_STATUS = _enum("user_status", "active", "suspended", "pending_verification")
EMPLOYMENT_TYPE = _enum(
    "employment_type", "full_time", "part_time", "contract", "internship", "temporary", "remote"
)
EXPERIENCE_LEVEL = _enum("experience_level", "entry", "junior", "mid", "senior", "lead", "executive")
JOB_STATUS = _enum("job_status", "draft", "pending_review", "active", "closed", "rejected", "expired")
APPLICATION_STATUS = _enum(
    "application_status",
    "submitted",
    "viewed",
    "shortlisted",
    "interview",
    "offer",
    "hired",
    "rejected",
    "withdrawn",
)
COMPANY_STATUS = _enum(
    "company_status", "unverified", "pending_verification", "verified", "rejected"
)
INTERVIEW_STATUS = _enum("interview_status", "scheduled", "completed", "cancelled", "no_show")
NOTIFICATION_TYPE = _enum(
    "notification_type",
    "application_status",
    "new_application",
    "new_message",
    "interview_scheduled",
    "job_approved",
    "company_verified",
    "system",
)
LOCALE = _enum("locale", "az", "ru", "tr", "en")

ALL_ENUMS = [
    USER_ROLE,
    USER_STATUS,
    EMPLOYMENT_TYPE,
    EXPERIENCE_LEVEL,
    JOB_STATUS,
    APPLICATION_STATUS,
    COMPANY_STATUS,
    INTERVIEW_STATUS,
    NOTIFICATION_TYPE,
    LOCALE,
]


def upgrade() -> None:
    bind = op.get_bind()
    for enum_type in ALL_ENUMS:
        enum_type.create(bind, checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("clerk_id", sa.String(64), nullable=False),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("role", USER_ROLE, nullable=False, server_default="job_seeker"),
        sa.Column("status", USER_STATUS, nullable=False, server_default="active"),
        sa.Column("preferred_locale", LOCALE, nullable=False, server_default="az"),
        sa.Column("onboarding_completed_at", sa.DateTime(timezone=True)),
        sa.Column("last_login_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("users_clerk_idx", "users", ["clerk_id"], unique=True)
    op.create_index("users_email_idx", "users", ["email"], unique=True)
    op.create_index("users_role_idx", "users", ["role"])

    op.create_table(
        "candidate_profiles",
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("full_name", sa.String(160), nullable=False),
        sa.Column("headline", sa.String(200)),
        sa.Column("phone", sa.String(32)),
        sa.Column("city", sa.String(120)),
        sa.Column("about", sa.Text),
        sa.Column("cv_url", sa.Text),
        sa.Column("cv_data", postgresql.JSONB),
        sa.Column("skills", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("experience_level", EXPERIENCE_LEVEL),
        sa.Column("open_to_work", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column("avatar_url", sa.Text),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("candidate_city_idx", "candidate_profiles", ["city"])
    op.create_index("candidate_open_idx", "candidate_profiles", ["open_to_work"])

    op.create_table(
        "companies",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "owner_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("slug", sa.String(220), nullable=False),
        sa.Column("logo_url", sa.Text),
        sa.Column("website", sa.String(300)),
        sa.Column("industry", sa.String(120)),
        sa.Column("size_range", sa.String(40)),
        sa.Column("city", sa.String(120)),
        sa.Column("about", sa.Text),
        sa.Column("status", COMPANY_STATUS, nullable=False, server_default="unverified"),
        sa.Column("verified_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("companies_slug_idx", "companies", ["slug"], unique=True)
    op.create_index("companies_owner_idx", "companies", ["owner_id"])
    op.create_index("companies_status_idx", "companies", ["status"])

    op.create_table(
        "employer_profiles",
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id", ondelete="SET NULL")
        ),
        sa.Column("full_name", sa.String(160), nullable=False),
        sa.Column("job_title", sa.String(120)),
        sa.Column("phone", sa.String(32)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    op.create_table(
        "categories",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("parent_id", postgresql.UUID(as_uuid=True)),
        sa.Column("slug", sa.String(140), nullable=False),
        sa.Column("name_az", sa.String(140), nullable=False),
        sa.Column("name_ru", sa.String(140)),
        sa.Column("name_en", sa.String(140)),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
    )
    op.create_index("categories_slug_idx", "categories", ["slug"], unique=True)
    op.create_index("categories_parent_idx", "categories", ["parent_id"])

    op.create_table(
        "jobs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "company_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("companies.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "posted_by_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "category_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("categories.id", ondelete="SET NULL"),
        ),
        sa.Column("title", sa.String(220), nullable=False),
        sa.Column("slug", sa.String(260), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("responsibilities", sa.Text),
        sa.Column("requirements", sa.Text),
        sa.Column("employment_type", EMPLOYMENT_TYPE, nullable=False, server_default="full_time"),
        sa.Column("experience_level", EXPERIENCE_LEVEL),
        sa.Column("city", sa.String(120)),
        sa.Column("is_remote", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("salary_min", sa.Integer),
        sa.Column("salary_max", sa.Integer),
        sa.Column("salary_currency", sa.String(3), nullable=False, server_default="AZN"),
        sa.Column("salary_hidden", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("skills", postgresql.JSONB, nullable=False, server_default="[]"),
        sa.Column("status", JOB_STATUS, nullable=False, server_default="pending_review"),
        sa.Column("is_featured", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("view_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("application_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("published_at", sa.DateTime(timezone=True)),
        sa.Column("expires_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("jobs_slug_idx", "jobs", ["slug"], unique=True)
    op.create_index("jobs_company_idx", "jobs", ["company_id"])
    op.create_index("jobs_status_published_idx", "jobs", ["status", "published_at"])
    op.create_index("jobs_category_idx", "jobs", ["category_id"])
    op.create_index("jobs_city_idx", "jobs", ["city"])

    op.create_table(
        "saved_jobs",
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "job_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("jobs.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("saved_jobs_job_idx", "saved_jobs", ["job_id"])

    op.create_table(
        "applications",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "job_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False
        ),
        sa.Column(
            "candidate_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("cover_letter", sa.Text),
        sa.Column("cv_url", sa.Text),
        sa.Column("status", APPLICATION_STATUS, nullable=False, server_default="submitted"),
        sa.Column("employer_note", sa.Text),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index(
        "applications_job_candidate_idx", "applications", ["job_id", "candidate_id"], unique=True
    )
    op.create_index("applications_candidate_idx", "applications", ["candidate_id"])
    op.create_index("applications_job_status_idx", "applications", ["job_id", "status"])

    op.create_table(
        "saved_candidates",
        sa.Column(
            "employer_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "candidate_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("note", sa.Text),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    op.create_table(
        "interviews",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "application_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("applications.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("scheduled_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("duration_minutes", sa.Integer, nullable=False, server_default="45"),
        sa.Column("location", sa.Text),
        sa.Column("is_online", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column("status", INTERVIEW_STATUS, nullable=False, server_default="scheduled"),
        sa.Column("notes", sa.Text),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("interviews_application_idx", "interviews", ["application_id"])
    op.create_index("interviews_scheduled_idx", "interviews", ["scheduled_at"])

    op.create_table(
        "conversations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("job_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("jobs.id", ondelete="SET NULL")),
        sa.Column(
            "employer_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "candidate_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "last_message_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index(
        "conversations_pair_idx", "conversations", ["employer_id", "candidate_id", "job_id"], unique=True
    )
    op.create_index("conversations_candidate_idx", "conversations", ["candidate_id"])
    op.create_index("conversations_employer_idx", "conversations", ["employer_id"])

    op.create_table(
        "messages",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "conversation_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("conversations.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "sender_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("body", sa.Text, nullable=False),
        sa.Column("read_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("messages_conversation_idx", "messages", ["conversation_id", "created_at"])

    op.create_table(
        "notifications",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("type", NOTIFICATION_TYPE, nullable=False),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("body", sa.Text),
        sa.Column("href", sa.Text),
        sa.Column("read_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("notifications_user_read_idx", "notifications", ["user_id", "read_at"])

    op.create_table(
        "blog_posts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "author_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL")
        ),
        sa.Column("slug", sa.String(260), nullable=False),
        sa.Column("title", sa.String(260), nullable=False),
        sa.Column("excerpt", sa.Text),
        sa.Column("body", sa.Text, nullable=False),
        sa.Column("cover_url", sa.Text),
        sa.Column("published", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("published_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("blog_slug_idx", "blog_posts", ["slug"], unique=True)
    op.create_index("blog_published_idx", "blog_posts", ["published", "published_at"])

    op.create_table(
        "faqs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("question", sa.Text, nullable=False),
        sa.Column("answer", sa.Text, nullable=False),
        sa.Column("audience", sa.String(20), nullable=False, server_default="all"),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
    )

    op.create_table(
        "contact_messages",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(160), nullable=False),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("subject", sa.String(200)),
        sa.Column("message", sa.Text, nullable=False),
        sa.Column("handled", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    op.create_table(
        "audit_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "actor_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL")
        ),
        sa.Column("action", sa.String(80), nullable=False),
        sa.Column("entity_type", sa.String(60)),
        sa.Column("entity_id", sa.String(80)),
        sa.Column("metadata", postgresql.JSONB),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("audit_actor_idx", "audit_logs", ["actor_id"])
    op.create_index("audit_entity_idx", "audit_logs", ["entity_type", "entity_id"])


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("contact_messages")
    op.drop_table("faqs")
    op.drop_table("blog_posts")
    op.drop_table("notifications")
    op.drop_table("messages")
    op.drop_table("conversations")
    op.drop_table("interviews")
    op.drop_table("saved_candidates")
    op.drop_table("applications")
    op.drop_table("saved_jobs")
    op.drop_table("jobs")
    op.drop_table("categories")
    op.drop_table("employer_profiles")
    op.drop_table("companies")
    op.drop_table("candidate_profiles")
    op.drop_table("users")

    bind = op.get_bind()
    for enum_type in reversed(ALL_ENUMS):
        enum_type.drop(bind, checkfirst=True)
