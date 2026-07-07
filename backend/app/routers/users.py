from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from svix.webhooks import Webhook, WebhookVerificationError

from app.config import settings
from app.deps import DbDep, get_current_user
from app.models import User
from app.schemas import OnboardingIn, UserOut
from app.services.users import OnboardingError, complete_onboarding, delete_local_user, ensure_local_user

router = APIRouter(tags=["users"])


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.post("/onboarding", response_model=UserOut)
def onboarding(
    payload: OnboardingIn, user: User = Depends(get_current_user), db: Session = DbDep
):
    if user.onboarding_completed_at:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Onboarding artıq tamamlanıb")
    try:
        return complete_onboarding(
            db,
            user=user,
            role=payload.role,
            full_name=payload.full_name,
            company_name=payload.company_name,
        )
    except OnboardingError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=exc.field_errors) from exc


@router.post("/webhooks/clerk", include_in_schema=False)
async def clerk_webhook(request: Request, db: Session = DbDep):
    if not settings.clerk_webhook_secret:
        raise HTTPException(status_code=500, detail="Webhook secret not configured")

    payload = await request.body()
    try:
        event = Webhook(settings.clerk_webhook_secret).verify(payload, dict(request.headers))
    except WebhookVerificationError as exc:
        raise HTTPException(status_code=400, detail="Invalid signature") from exc

    event_type = event.get("type")
    data = event.get("data", {})

    if event_type in ("user.created", "user.updated"):
        clerk_id = data.get("id")
        email_addresses = data.get("email_addresses", [])
        primary_id = data.get("primary_email_address_id")
        primary = next((e for e in email_addresses if e.get("id") == primary_id), None) or (
            email_addresses[0] if email_addresses else None
        )
        if clerk_id and primary:
            ensure_local_user(db, clerk_id=clerk_id, email=primary.get("email_address"))
    elif event_type == "user.deleted":
        clerk_id = data.get("id")
        if clerk_id:
            delete_local_user(db, clerk_id=clerk_id)

    return {"ok": True}
