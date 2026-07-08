from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

# ------------------------------------------------------------------ #
# Users / auth                                                        #
# ------------------------------------------------------------------ #


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str
    role: str
    status: str
    preferred_locale: str
    onboarding_completed_at: datetime | None
    created_at: datetime


class OnboardingIn(BaseModel):
    role: str
    full_name: str = Field(min_length=1, max_length=160)
    company_name: str | None = Field(default=None, max_length=200)


# ------------------------------------------------------------------ #
# Jobs                                                                 #
# ------------------------------------------------------------------ #


class JobListItem(BaseModel):
    id: UUID
    title: str
    slug: str
    city: str | None
    is_remote: bool
    employment_type: str
    experience_level: str | None
    salary_min: int | None
    salary_max: int | None
    salary_currency: str
    salary_hidden: bool
    is_featured: bool
    published_at: datetime | None
    company_name: str
    company_slug: str
    company_logo: str | None


class JobListResponse(BaseModel):
    items: list[JobListItem]
    total: int
    page: int
    page_size: int


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    name_az: str
    name_ru: str | None
    name_en: str | None


class CompanySummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    logo_url: str | None
    website: str | None
    industry: str | None
    size_range: str | None
    city: str | None
    about: str | None
    status: str


class JobDetail(BaseModel):
    id: UUID
    title: str
    slug: str
    description: str
    responsibilities: str | None
    requirements: str | None
    employment_type: str
    experience_level: str | None
    city: str | None
    is_remote: bool
    salary_min: int | None
    salary_max: int | None
    salary_currency: str
    salary_hidden: bool
    skills: list[str]
    status: str
    is_featured: bool
    published_at: datetime | None
    expires_at: datetime | None
    created_at: datetime
    company: CompanySummary
    category: CategoryOut | None


class JobCreateIn(BaseModel):
    title: str = Field(min_length=4, max_length=220)
    category_id: UUID | None = None
    description: str = Field(min_length=30, max_length=20000)
    responsibilities: str | None = Field(default=None, max_length=5000)
    requirements: str | None = Field(default=None, max_length=5000)
    employment_type: str
    experience_level: str | None = None
    city: str | None = Field(default=None, max_length=120)
    is_remote: bool = False
    salary_min: int | None = Field(default=None, ge=0)
    salary_max: int | None = Field(default=None, ge=0)
    salary_hidden: bool = False
    skills: str | None = Field(default=None, max_length=500)


class JobStatusIn(BaseModel):
    close: bool


class EmployerJobRow(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    slug: str
    status: str
    employment_type: str
    application_count: int
    created_at: datetime


# ------------------------------------------------------------------ #
# Applications                                                         #
# ------------------------------------------------------------------ #


class ApplyIn(BaseModel):
    cover_letter: str | None = Field(default=None, max_length=4000)


class CandidateApplicationRow(BaseModel):
    id: UUID
    status: str
    created_at: datetime
    job_title: str
    job_slug: str
    company_name: str


class EmployerApplicationRow(BaseModel):
    id: UUID
    status: str
    created_at: datetime
    cover_letter: str | None
    job_id: UUID
    job_title: str
    candidate_id: UUID
    candidate_name: str | None
    candidate_headline: str | None
    candidate_city: str | None
    candidate_email: str


class ApplicationStatusIn(BaseModel):
    status: str


# ------------------------------------------------------------------ #
# Companies                                                            #
# ------------------------------------------------------------------ #


class CompanyListItem(BaseModel):
    id: UUID
    name: str
    slug: str
    logo_url: str | None
    industry: str | None
    city: str | None
    open_jobs: int


class CompanyListResponse(BaseModel):
    items: list[CompanyListItem]
    page: int
    page_size: int


class CompanyDetail(BaseModel):
    company: CompanySummary
    open_jobs: list[JobListItem]


# ------------------------------------------------------------------ #
# Candidates (employer-facing search)                                  #
# ------------------------------------------------------------------ #


class CandidateSearchRow(BaseModel):
    user_id: UUID
    full_name: str
    headline: str | None
    city: str | None
    skills: list[str]
    experience_level: str | None
    email: str
    cv_url: str | None


class CandidateProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    full_name: str
    headline: str | None
    phone: str | None
    city: str | None
    about: str | None
    skills: list[str]
    open_to_work: bool
    cv_url: str | None
    avatar_url: str | None


class CandidateProfileIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=160)
    headline: str | None = Field(default=None, max_length=200)
    phone: str | None = Field(default=None, max_length=32)
    city: str | None = Field(default=None, max_length=120)
    about: str | None = Field(default=None, max_length=3000)
    skills: str | None = Field(default=None, max_length=500)
    open_to_work: bool = True


class UrlIn(BaseModel):
    url: str


# ------------------------------------------------------------------ #
# Messaging                                                            #
# ------------------------------------------------------------------ #


class ConversationRow(BaseModel):
    id: UUID
    last_message_at: datetime
    unread: int
    other_name: str


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    sender_id: UUID
    body: str
    created_at: datetime


class ConversationThread(BaseModel):
    conversation_id: UUID
    messages: list[MessageOut]


class StartConversationIn(BaseModel):
    candidate_id: UUID
    job_id: UUID | None = None


class SendMessageIn(BaseModel):
    body: str = Field(min_length=1, max_length=4000)


# ------------------------------------------------------------------ #
# Notifications                                                        #
# ------------------------------------------------------------------ #


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    type: str
    title: str
    body: str | None
    href: str | None
    read_at: datetime | None
    created_at: datetime


# ------------------------------------------------------------------ #
# Admin                                                                 #
# ------------------------------------------------------------------ #


class ActivityEvent(BaseModel):
    type: str
    title: str
    meta: str | None = None
    at: datetime
    href: str | None = None


class AdminJobRow(BaseModel):
    id: UUID
    title: str
    slug: str
    status: str
    created_at: datetime
    company_name: str


class AdminCompanyRow(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    status: str
    industry: str | None
    created_at: datetime


class AdminUserRow(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str
    role: str
    status: str
    created_at: datetime


class ModerateJobIn(BaseModel):
    status: str


class SetCompanyStatusIn(BaseModel):
    status: str


class SetUserRoleIn(BaseModel):
    role: str


# ------------------------------------------------------------------ #
# Uploads                                                              #
# ------------------------------------------------------------------ #


class UploadPresignIn(BaseModel):
    kind: str
    content_type: str
    size: int = Field(gt=0)
    ext: str = Field(min_length=1, max_length=8)


class UploadPresignOut(BaseModel):
    upload_url: str
    public_url: str
    key: str


# ------------------------------------------------------------------ #
# Contact / content                                                    #
# ------------------------------------------------------------------ #


class ContactIn(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    email: EmailStr
    subject: str | None = Field(default=None, max_length=200)
    message: str = Field(min_length=10, max_length=4000)


class BlogPostListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    title: str
    excerpt: str | None
    published_at: datetime | None


class BlogPostDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    title: str
    body: str
    excerpt: str | None
    published_at: datetime | None


class FaqOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    question: str
    answer: str
    audience: str


class SitemapJobRow(BaseModel):
    slug: str
    updated_at: datetime


class SitemapCompanyRow(BaseModel):
    slug: str


class SitemapPostRow(BaseModel):
    slug: str
    updated_at: datetime


class SitemapData(BaseModel):
    jobs: list[SitemapJobRow]
    companies: list[SitemapCompanyRow]
    posts: list[SitemapPostRow]


# ------------------------------------------------------------------ #
# Dashboard stats                                                      #
# ------------------------------------------------------------------ #


class DashboardStats(BaseModel):
    role: str
    data: dict[str, Any]
