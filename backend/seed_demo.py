"""Seeds realistic *sample* job listings so the site doesn't look empty during
development / demos.

FICTIONAL companies and jobs with placeholder (sample) contact numbers — NOT
scraped from real sites and NOT real people's data. Idempotent; also backfills
the category on jobs that were created before categories existed.

    python seed_demo.py
"""
from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.database import SessionLocal
from app.models import Category, Company, EmployerProfile, Job, User
from app.utils import nanoid, slugify

DEMO_CLERK_ID = "demo_seed_employer"

COMPANIES = [
    {"name": "AzTech Solutions", "industry": "İnformasiya texnologiyaları", "city": "Bakı", "size_range": "51-200", "about": "Proqram təminatı və rəqəmsal həllər üzrə texnologiya şirkəti."},
    {"name": "Bakı Ticarət MMC", "industry": "Satış", "city": "Bakı", "size_range": "11-50", "about": "Pərakəndə və topdan ticarət şirkəti."},
    {"name": "LogiStar", "industry": "Logistika və nəqliyyat", "city": "Sumqayıt", "size_range": "11-50", "about": "Anbar və daşınma xidmətləri."},
    {"name": "Kaspi Marketinq", "industry": "Marketinq və reklam", "city": "Bakı", "size_range": "11-50", "about": "Rəqəmsal marketinq və reklam agentliyi."},
    {"name": "Şəfa Klinikası", "industry": "Səhiyyə", "city": "Bakı", "size_range": "51-200", "about": "Özəl tibb mərkəzi."},
    {"name": "Innova Dizayn", "industry": "Dizayn", "city": "Bakı", "size_range": "1-10", "about": "Brendinq və qrafik dizayn studiyası."},
]


def _contact(n: str) -> str:
    return f"\n\nƏlaqə: {n} (nümunə nömrə)"


JOBS = [
    {"company": "Bakı Ticarət MMC", "title": "Satış Meneceri", "category": "Satış", "employment_type": "full_time", "experience_level": "mid", "city": "Bakı", "salary_min": 800, "salary_max": 1400, "featured": True, "skills": ["Satış", "Müştəri münasibətləri", "Danışıqlar", "CRM"], "description": "Müştəri bazasının genişləndirilməsi və satış hədəflərinə çatmaq üçün təcrübəli Satış Meneceri axtarırıq." + _contact("(050) 111-11-11"), "requirements": "Ən azı 2 il satış təcrübəsi; ünsiyyət bacarığı; MS Office."},
    {"company": "AzTech Solutions", "title": "Frontend Developer", "category": "İnformasiya texnologiyaları", "employment_type": "full_time", "experience_level": "mid", "city": "Bakı", "is_remote": True, "salary_min": 1200, "salary_max": 2000, "skills": ["React", "TypeScript", "CSS", "Git"], "description": "Müasir veb tətbiqlərin hazırlanması üçün Frontend Developer. Uzaqdan iş imkanı." + _contact("(055) 222-22-22"), "requirements": "React və TypeScript təcrübəsi; responsiv dizayn."},
    {"company": "AzTech Solutions", "title": "Backend Developer", "category": "İnformasiya texnologiyaları", "employment_type": "full_time", "experience_level": "senior", "city": "Bakı", "is_remote": True, "salary_min": 1800, "salary_max": 2800, "skills": ["Python", "PostgreSQL", "API", "Docker"], "description": "Server tərəfi sistemlərin qurulması üçün təcrübəli Backend Developer axtarırıq." + _contact("(055) 223-23-23"), "requirements": "Python/FastAPI təcrübəsi; verilənlər bazası biliyi."},
    {"company": "Bakı Ticarət MMC", "title": "Mühasib", "category": "Maliyyə və mühasibatlıq", "employment_type": "full_time", "experience_level": "mid", "city": "Bakı", "salary_min": 700, "salary_max": 1100, "skills": ["1C", "Excel", "Vergi uçotu"], "description": "Şirkətin maliyyə əməliyyatlarını aparacaq Mühasib. 1C biliyi vacibdir." + _contact("(070) 333-33-33"), "requirements": "Mühasibatlıq təhsili; 1C və Excel."},
    {"company": "LogiStar", "title": "Anbar müdiri", "category": "Logistika və nəqliyyat", "employment_type": "full_time", "experience_level": "junior", "city": "Sumqayıt", "salary_min": 600, "salary_max": 900, "skills": ["Anbar idarəçiliyi", "Logistika"], "description": "Anbar əməliyyatlarını idarə edəcək məsul şəxs. Məhsulların qəbulu və göndərilməsi." + _contact("(051) 444-44-44"), "requirements": "Anbar təcrübəsi üstünlükdür; məsuliyyətlilik."},
    {"company": "LogiStar", "title": "Sürücü-ekspeditor", "category": "Logistika və nəqliyyat", "employment_type": "full_time", "experience_level": "junior", "city": "Sumqayıt", "salary_min": 550, "salary_max": 800, "skills": ["Sürücülük", "Ekspeditor"], "description": "Yüklərin çatdırılması üçün B kateqoriyalı sürücü-ekspeditor axtarırıq." + _contact("(051) 445-45-45"), "requirements": "B sürücülük vəsiqəsi; Bakı və ətraf rayonları tanımaq."},
    {"company": "Kaspi Marketinq", "title": "Marketinq mütəxəssisi", "category": "Marketinq və reklam", "employment_type": "full_time", "experience_level": "mid", "city": "Bakı", "salary_min": 900, "salary_max": 1400, "skills": ["Marketinq", "Analitika", "Kampaniya"], "description": "Rəqəmsal marketinq kampaniyalarını planlaşdıracaq və idarə edəcək mütəxəssis." + _contact("(050) 555-55-55"), "requirements": "Marketinq təcrübəsi; analitik düşüncə."},
    {"company": "Kaspi Marketinq", "title": "SMM Menecer", "category": "Marketinq və reklam", "employment_type": "full_time", "experience_level": "junior", "city": "Bakı", "is_remote": True, "salary_min": 700, "salary_max": 1100, "skills": ["Instagram", "Kontent", "Copywriting"], "description": "Sosial media hesablarını idarə edəcək SMM Menecer. Uzaqdan iş mümkündür." + _contact("(050) 556-56-56"), "requirements": "Sosial media təcrübəsi; kontent yaratma bacarığı."},
    {"company": "Innova Dizayn", "title": "Qrafik Dizayner", "category": "Dizayn", "employment_type": "full_time", "experience_level": "mid", "city": "Bakı", "salary_min": 800, "salary_max": 1300, "skills": ["Photoshop", "Illustrator", "Figma"], "description": "Brend materialları və rəqəmsal məhsullar üçün Qrafik Dizayner axtarırıq." + _contact("(077) 666-66-66"), "requirements": "Portfolio; Adobe proqramları biliyi."},
    {"company": "Bakı Ticarət MMC", "title": "Müştəri Xidmətləri Operatoru", "category": "Müştəri xidmətləri", "employment_type": "full_time", "experience_level": "entry", "city": "Bakı", "salary_min": 500, "salary_max": 700, "skills": ["Ünsiyyət", "Telefon", "Səbirlilik"], "description": "Müştərilərlə telefon və onlayn əlaqə saxlayacaq operator. Təcrübəsizlər üçün uyğundur." + _contact("(070) 334-34-34"), "requirements": "Yaxşı ünsiyyət; Azərbaycan və rus dili."},
    {"company": "Şəfa Klinikası", "title": "Tibb bacısı", "category": "Səhiyyə", "employment_type": "full_time", "experience_level": "junior", "city": "Bakı", "salary_min": 600, "salary_max": 900, "skills": ["Tibb", "Xəstə qayğısı"], "description": "Klinikamıza diqqətli və məsuliyyətli tibb bacısı axtarırıq." + _contact("(012) 777-77-77"), "requirements": "Tibb təhsili; sertifikat; komandada işləmək."},
    {"company": "AzTech Solutions", "title": "İnsan Resursları mütəxəssisi", "category": "İnsan resursları", "employment_type": "full_time", "experience_level": "mid", "city": "Bakı", "salary_min": 900, "salary_max": 1300, "skills": ["İşə qəbul", "HR", "Müsahibə"], "description": "İşə qəbul və kadr proseslərini idarə edəcək İR mütəxəssisi." + _contact("(055) 224-24-24"), "requirements": "HR təcrübəsi; ünsiyyət bacarığı."},
]


def main() -> None:
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.clerk_id == DEMO_CLERK_ID))
        if not user:
            user = User(clerk_id=DEMO_CLERK_ID, email="demo@iscibinde.az", role="employer", onboarding_completed_at=datetime.now(timezone.utc))
            db.add(user)
            db.flush()
            db.add(EmployerProfile(user_id=user.id, full_name="Demo İşəgötürən"))

        now = datetime.now(timezone.utc)
        cat_map = {c.name_az: c for c in db.scalars(select(Category)).all()}

        company_map: dict[str, Company] = {}
        for c in COMPANIES:
            existing = db.scalar(select(Company).where(Company.name == c["name"]))
            if existing:
                company_map[c["name"]] = existing
                continue
            comp = Company(owner_id=user.id, name=c["name"], slug=f"{slugify(c['name'])}-{nanoid(6)}", industry=c["industry"], city=c["city"], size_range=c["size_range"], about=c["about"], status="verified", verified_at=now)
            db.add(comp)
            db.flush()
            company_map[c["name"]] = comp

        created = 0
        for j in JOBS:
            comp = company_map[j["company"]]
            cat = cat_map.get(j["category"])
            existing = db.scalar(select(Job).where(Job.title == j["title"], Job.company_id == comp.id))
            if existing:
                if cat and existing.category_id is None:  # backfill category
                    existing.category_id = cat.id
                continue
            db.add(Job(
                company_id=comp.id, posted_by_id=user.id, category_id=cat.id if cat else None,
                title=j["title"], slug=f"{slugify(j['title'])}-{nanoid(6)}",
                description=j["description"], requirements=j.get("requirements"),
                employment_type=j["employment_type"], experience_level=j.get("experience_level"),
                city=j.get("city"), is_remote=j.get("is_remote", False),
                salary_min=j.get("salary_min"), salary_max=j.get("salary_max"),
                skills=j.get("skills", []), status="active", is_featured=j.get("featured", False),
                published_at=now, expires_at=now + timedelta(days=30),
            ))
            created += 1

        db.commit()
        print(f"Seeded {len(company_map)} companies, {created} new jobs (categories backfilled).")
    finally:
        db.close()


if __name__ == "__main__":
    main()
