"""Seeds a few realistic *sample* job listings so the site doesn't look empty
during development / demos.

These are FICTIONAL companies and jobs with placeholder (sample) contact
numbers — NOT scraped from real sites and NOT real people's data. Replace them
with genuine listings once real employers sign up. Idempotent.

    python seed_demo.py
"""
from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.database import SessionLocal
from app.models import Company, EmployerProfile, Job, User
from app.utils import nanoid, slugify

DEMO_CLERK_ID = "demo_seed_employer"

COMPANIES = [
    {
        "name": "AzTech Solutions",
        "industry": "İnformasiya texnologiyaları",
        "city": "Bakı",
        "size_range": "51-200",
        "about": "Azərbaycanda proqram təminatı və rəqəmsal həllər üzrə ixtisaslaşmış texnologiya şirkəti.",
    },
    {
        "name": "Bakı Ticarət MMC",
        "industry": "Satış",
        "city": "Bakı",
        "size_range": "11-50",
        "about": "Pərakəndə və topdan ticarət sahəsində fəaliyyət göstərən şirkət.",
    },
    {
        "name": "LogiStar",
        "industry": "Logistika və nəqliyyat",
        "city": "Sumqayıt",
        "size_range": "11-50",
        "about": "Anbar və daşınma xidmətləri təqdim edən logistika şirkəti.",
    },
]

# Mid-budget AZN salaries. Contact lines use obviously-placeholder sample numbers.
JOBS = [
    {
        "company": "AzTech Solutions",
        "title": "Satış Meneceri",
        "employment_type": "full_time",
        "experience_level": "mid",
        "city": "Bakı",
        "salary_min": 800,
        "salary_max": 1400,
        "skills": ["Satış", "Müştəri münasibətləri", "Danışıqlar", "CRM"],
        "description": (
            "Komandamıza təcrübəli Satış Meneceri axtarırıq. Müştəri bazasının "
            "genişləndirilməsi və satış hədəflərinə çatmaq əsas vəzifədir.\n\n"
            "Əlaqə: (050) 111-11-11 (nümunə nömrə)"
        ),
        "requirements": "Ən azı 2 il satış təcrübəsi; ünsiyyət bacarığı; MS Office biliyi.",
    },
    {
        "company": "AzTech Solutions",
        "title": "Frontend Developer",
        "employment_type": "full_time",
        "experience_level": "mid",
        "city": "Bakı",
        "is_remote": True,
        "salary_min": 1200,
        "salary_max": 2000,
        "skills": ["React", "TypeScript", "CSS", "Git"],
        "description": (
            "Müasir veb tətbiqlərin hazırlanması üçün Frontend Developer axtarırıq. "
            "Uzaqdan iş imkanı mövcuddur.\n\n"
            "Əlaqə: (055) 222-22-22 (nümunə nömrə)"
        ),
        "requirements": "React və TypeScript təcrübəsi; responsiv dizayn; komanda işi.",
    },
    {
        "company": "Bakı Ticarət MMC",
        "title": "Mühasib",
        "employment_type": "full_time",
        "experience_level": "mid",
        "city": "Bakı",
        "salary_min": 700,
        "salary_max": 1100,
        "skills": ["1C", "Excel", "Vergi uçotu"],
        "description": (
            "Şirkətin maliyyə əməliyyatlarını aparacaq Mühasib axtarılır. "
            "1C proqramı biliyi vacibdir.\n\n"
            "Əlaqə: (070) 333-33-33 (nümunə nömrə)"
        ),
        "requirements": "Mühasibatlıq üzrə təhsil; 1C və Excel biliyi; diqqətlilik.",
    },
    {
        "company": "LogiStar",
        "title": "Anbar müdiri",
        "employment_type": "full_time",
        "experience_level": "junior",
        "city": "Sumqayıt",
        "salary_min": 600,
        "salary_max": 900,
        "skills": ["Anbar idarəçiliyi", "Logistika", "MS Office"],
        "description": (
            "Anbar əməliyyatlarını idarə edəcək məsul şəxs axtarırıq. "
            "Məhsulların qəbulu, saxlanması və göndərilməsinə nəzarət.\n\n"
            "Əlaqə: (051) 444-44-44 (nümunə nömrə)"
        ),
        "requirements": "Anbar işi təcrübəsi üstünlükdür; məsuliyyətlilik; komandada işləmək.",
    },
]


def main() -> None:
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.clerk_id == DEMO_CLERK_ID))
        if not user:
            user = User(
                clerk_id=DEMO_CLERK_ID,
                email="demo@iscibinde.az",
                role="employer",
                onboarding_completed_at=datetime.now(timezone.utc),
            )
            db.add(user)
            db.flush()
            db.add(EmployerProfile(user_id=user.id, full_name="Demo İşəgötürən"))

        now = datetime.now(timezone.utc)

        company_map: dict[str, Company] = {}
        for c in COMPANIES:
            existing = db.scalar(select(Company).where(Company.name == c["name"]))
            if existing:
                company_map[c["name"]] = existing
                continue
            comp = Company(
                owner_id=user.id,
                name=c["name"],
                slug=f"{slugify(c['name'])}-{nanoid(6)}",
                industry=c["industry"],
                city=c["city"],
                size_range=c["size_range"],
                about=c["about"],
                status="verified",
                verified_at=now,
            )
            db.add(comp)
            db.flush()
            company_map[c["name"]] = comp

        created = 0
        for j in JOBS:
            comp = company_map[j["company"]]
            exists = db.scalar(
                select(Job).where(Job.title == j["title"], Job.company_id == comp.id)
            )
            if exists:
                continue
            db.add(
                Job(
                    company_id=comp.id,
                    posted_by_id=user.id,
                    title=j["title"],
                    slug=f"{slugify(j['title'])}-{nanoid(6)}",
                    description=j["description"],
                    requirements=j.get("requirements"),
                    employment_type=j["employment_type"],
                    experience_level=j.get("experience_level"),
                    city=j.get("city"),
                    is_remote=j.get("is_remote", False),
                    salary_min=j.get("salary_min"),
                    salary_max=j.get("salary_max"),
                    skills=j.get("skills", []),
                    status="active",
                    is_featured=j is JOBS[0],  # feature the first one for variety
                    published_at=now,
                    expires_at=now + timedelta(days=30),
                )
            )
            created += 1

        db.commit()
        print(f"Seeded {len(company_map)} companies and {created} sample jobs.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
