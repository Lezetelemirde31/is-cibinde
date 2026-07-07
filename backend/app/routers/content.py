from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import DbDep
from app.schemas import BlogPostDetail, BlogPostListItem, ContactIn, FaqOut, SitemapData
from app.services import content as content_service

router = APIRouter(tags=["content"])


@router.get("/content/blog", response_model=list[BlogPostListItem])
def list_blog_posts(db: Session = DbDep):
    return content_service.list_published_posts(db)


@router.get("/content/blog/{slug}", response_model=BlogPostDetail)
def get_blog_post(slug: str, db: Session = DbDep):
    post = content_service.get_published_post(db, slug)
    if not post:
        raise HTTPException(status_code=404, detail="Məqalə tapılmadı")
    return post


@router.get("/content/faqs", response_model=list[FaqOut])
def list_faqs(db: Session = DbDep):
    return content_service.list_faqs(db)


@router.get("/content/sitemap", response_model=SitemapData)
def sitemap(db: Session = DbDep):
    return content_service.sitemap_data(db)


@router.post("/contact")
def send_contact(payload: ContactIn, db: Session = DbDep):
    content_service.create_contact_message(
        db, name=payload.name, email=payload.email, subject=payload.subject, message=payload.message
    )
    return {"ok": True}
