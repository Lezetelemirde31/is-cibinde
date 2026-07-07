"""Promotes an existing user (by email) to the admin role.
The user must have signed up via Clerk at least once.

    python promote_admin.py you@example.com
"""
import sys
from datetime import datetime, timezone

from sqlalchemy import select

from app.database import SessionLocal
from app.models import User


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python promote_admin.py <email>")
        sys.exit(1)

    email = sys.argv[1]
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == email))
        if not user:
            print(f"No user found with email {email}. Have them sign in first.")
            sys.exit(1)
        user.role = "admin"
        user.onboarding_completed_at = datetime.now(timezone.utc)
        db.commit()
        print(f"Promoted {user.email} to admin.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
