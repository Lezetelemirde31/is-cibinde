// Lightweight dictionary-based i18n. AZ is the default and complete locale;
// RU is provided as a second launch locale. Add TR/EN by extending `dictionaries`.

export const locales = ["az", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "az";

type Dict = Record<string, string>;

const az: Dict = {
  "nav.jobs": "Vakansiyalar",
  "nav.companies": "Şirkətlər",
  "nav.blog": "Bloq",
  "nav.about": "Haqqımızda",
  "nav.contact": "Əlaqə",
  "nav.login": "Daxil ol",
  "nav.register": "Qeydiyyat",
  "nav.dashboard": "Panel",
  "nav.logout": "Çıxış",
  "hero.title": "İş cibində",
  "hero.subtitle": "Azərbaycanda karyeranı bir toxunuşla idarə et — axtar, müraciət et, işə düzəl.",
  "hero.searchPlaceholder": "Vəzifə, açar söz və ya şirkət",
  "hero.cityPlaceholder": "Şəhər",
  "hero.searchButton": "Axtar",
  "jobs.title": "Vakansiyalar",
  "jobs.empty": "Bu meyarlara uyğun vakansiya tapılmadı. Filtri dəyişib yenidən yoxlayın.",
  "jobs.apply": "Müraciət et",
  "jobs.applied": "Müraciət olunub",
  "jobs.save": "Yadda saxla",
  "common.remote": "Uzaqdan",
  "common.viewAll": "Hamısına bax"
};

const ru: Dict = {
  "nav.jobs": "Вакансии",
  "nav.companies": "Компании",
  "nav.blog": "Блог",
  "nav.about": "О нас",
  "nav.contact": "Контакты",
  "nav.login": "Войти",
  "nav.register": "Регистрация",
  "nav.dashboard": "Панель",
  "nav.logout": "Выход",
  "hero.title": "Работа в кармане",
  "hero.subtitle": "Управляйте карьерой в Азербайджане в одно касание — ищите, откликайтесь, устраивайтесь.",
  "hero.searchPlaceholder": "Должность, ключевое слово или компания",
  "hero.cityPlaceholder": "Город",
  "hero.searchButton": "Искать",
  "jobs.title": "Вакансии",
  "jobs.empty": "По этим критериям вакансий не найдено. Измените фильтр и попробуйте снова.",
  "jobs.apply": "Откликнуться",
  "jobs.applied": "Отклик отправлен",
  "jobs.save": "Сохранить",
  "common.remote": "Удалённо",
  "common.viewAll": "Смотреть все"
};

const dictionaries: Record<Locale, Dict> = { az, ru };

export function getDictionary(locale: Locale = defaultLocale) {
  const dict = dictionaries[locale] ?? az;
  return (key: string): string => dict[key] ?? az[key] ?? key;
}
