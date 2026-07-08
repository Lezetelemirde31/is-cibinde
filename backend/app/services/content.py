from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import BlogPost, Category, Company, ContactMessage, Faq, Job


def list_categories(db: Session):
    return db.scalars(
        select(Category).order_by(Category.sort_order.asc(), Category.name_az.asc())
    ).all()


def list_published_posts(db: Session):
    return db.scalars(
        select(BlogPost).where(BlogPost.published.is_(True)).order_by(BlogPost.published_at.desc())
    ).all()


def get_published_post(db: Session, slug: str):
    return db.scalar(select(BlogPost).where(BlogPost.slug == slug, BlogPost.published.is_(True)))


def list_faqs(db: Session):
    return db.scalars(select(Faq).order_by(Faq.sort_order.asc())).all()


def create_contact_message(db: Session, *, name: str, email: str, subject: str | None, message: str) -> None:
    db.add(ContactMessage(name=name, email=email, subject=subject, message=message))
    db.commit()


def sitemap_data(db: Session) -> dict:
    jobs = db.execute(
        select(Job.slug, Job.updated_at).where(Job.status == "active")
    ).all()
    companies = db.execute(select(Company.slug).where(Company.status == "verified")).all()
    posts = db.execute(
        select(BlogPost.slug, BlogPost.created_at).where(BlogPost.published.is_(True))
    ).all()
    return {
        "jobs": [{"slug": s, "updated_at": u} for s, u in jobs],
        "companies": [{"slug": s} for (s,) in companies],
        "posts": [{"slug": s, "updated_at": u} for s, u in posts],
    }
