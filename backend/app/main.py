from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import (
    admin,
    applications,
    candidate,
    candidates,
    companies,
    content,
    dashboard,
    employer,
    health,
    jobs,
    messaging,
    notifications,
    uploads,
    users,
)

app = FastAPI(title="İş Cibində API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(users.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(companies.router)
app.include_router(candidates.router)
app.include_router(candidate.router)
app.include_router(employer.router)
app.include_router(messaging.router)
app.include_router(notifications.router)
app.include_router(admin.router)
app.include_router(uploads.router)
app.include_router(content.router)
app.include_router(dashboard.router)
