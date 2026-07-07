"""Seeds reference data (job categories and FAQs). Idempotent.

    python seed.py
"""
from sqlalchemy import select

from app.database import SessionLocal
from app.models import Category, Faq
from app.utils import slugify

CATEGORIES = [
    "İnformasiya texnologiyaları",
    "Marketinq və reklam",
    "Satış",
    "Maliyyə və mühasibatlıq",
    "İnsan resursları",
    "Dizayn",
    "Mühəndislik",
    "Təhsil",
    "Səhiyyə",
    "Hüquq",
    "Logistika və nəqliyyat",
    "Müştəri xidmətləri",
    "İnzibati işlər",
    "Turizm və qonaqpərvərlik",
    "İnşaat",
]

FAQS = [
    {
        "question": "İş Cibində istifadəsi pulludur?",
        "answer": "İş axtaranlar üçün qeydiyyat, profil yaratma və vakansiyalara müraciət tamamilə pulsuzdur.",
        "audience": "seeker",
        "sort_order": 1,
    },
    {
        "question": "Vakansiyaya necə müraciət edə bilərəm?",
        "answer": "Hesab yaradıb profilini doldurduqdan sonra istənilən vakansiyanın səhifəsində "
        "“Müraciət et” düyməsinə bas.",
        "audience": "seeker",
        "sort_order": 2,
    },
    {
        "question": "Müraciətimin statusunu haradan izləyə bilərəm?",
        "answer": "Panel > Müraciətlərim bölməsində bütün müraciətlərinin statusunu real vaxtda görə bilərsən.",
        "audience": "seeker",
        "sort_order": 3,
    },
    {
        "question": "Vakansiyanı necə yerləşdirə bilərəm?",
        "answer": "İşəgötürən kimi qeydiyyatdan keç, şirkət profilini yarat və Panel > Vakansiya yerləşdir "
        "bölməsindən elan dərc et.",
        "audience": "employer",
        "sort_order": 4,
    },
    {
        "question": "Namizədlərlə necə əlaqə saxlaya bilərəm?",
        "answer": "Müraciətlər bölməsində hər namizədin profilinə baxa, statusunu dəyişə və e-poçt vasitəsilə "
        "əlaqə saxlaya bilərsən.",
        "audience": "employer",
        "sort_order": 5,
    },
]


def main() -> None:
    db = SessionLocal()
    try:
        for name in CATEGORIES:
            slug = slugify(name)
            if not db.scalar(select(Category).where(Category.slug == slug)):
                db.add(Category(slug=slug, name_az=name))
        for f in FAQS:
            if not db.scalar(select(Faq).where(Faq.question == f["question"])):
                db.add(Faq(**f))
        db.commit()
        print(f"Seeded {len(CATEGORIES)} categories and {len(FAQS)} FAQs.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
