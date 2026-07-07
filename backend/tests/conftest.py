"""Sets the minimal environment the app's pydantic-settings config requires so
that importing `app.*` modules doesn't fail during unit tests. No real database
or Clerk instance is contacted by the tests in this suite.
"""
import os

os.environ.setdefault("DATABASE_URL", "postgresql+psycopg://test:test@localhost:5432/test")
os.environ.setdefault("CLERK_SECRET_KEY", "sk_test_dummy")
os.environ.setdefault("CLERK_ISSUER", "https://example.clerk.accounts.dev")
os.environ.setdefault("FRONTEND_ORIGIN", "http://localhost:3000")
