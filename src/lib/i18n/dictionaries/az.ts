// Azerbaijani — the default and canonical dictionary. The shape of this object
// is the type all other locales must satisfy (see dictionaries/index.ts).
export const az = {
  nav: {
    jobs: "Vakansiyalar",
    companies: "Şirkətlər",
    blog: "Bloq",
    about: "Haqqımızda",
    signIn: "Daxil ol",
    signUp: "Qeydiyyat",
    dashboard: "Panel"
  },
  home: {
    badge: "Azərbaycanın iş platforması",
    heroTitle: "İş cibində.",
    heroSubtitle:
      "Karyeranı bir toxunuşla idarə et — axtar, müraciət et, işə düzəl. İşəgötürənlər üçün vakansiya yerləşdirmə və namizəd axtarışı.",
    searchPlaceholder: "Vəzifə, açar söz və ya şirkət",
    cityPlaceholder: "Şəhər",
    searchButton: "Axtar",
    startAsSeeker: "İş axtaran kimi başla",
    postJob: "Vakansiya yerləşdir",
    prop1Title: "Ağıllı axtarış",
    prop1Text: "Vəzifə, şəhər, iş növü və maaşa görə filtrlə.",
    prop2Title: "Anlıq bildirişlər",
    prop2Text: "Müraciətinin statusu dəyişəndə xəbərdar ol.",
    prop3Title: "Yoxlanılmış şirkətlər",
    prop3Text: "Yalnız təsdiqlənmiş işəgötürənlər vakansiya yerləşdirir.",
    latestJobs: "Son vakansiyalar",
    viewAll: "Hamısına bax",
    emptyJobs: "Hələ aktiv vakansiya yoxdur. İlk vakansiyanı sən yerləşdir."
  },
  jobs: {
    title: "Vakansiyalar",
    found: "aktiv vakansiya tapıldı",
    emptyTitle: "Vakansiya tapılmadı",
    emptyText: "Bu meyarlara uyğun vakansiya tapılmadı. Filtri dəyişib yenidən yoxlayın.",
    searchPlaceholder: "Axtar",
    typeAll: "İş növü — hamısı",
    experienceAll: "Təcrübə — hamısı",
    cityAll: "Şəhər — hamısı",
    categoryAll: "Kateqoriya — hamısı",
    negotiable: "Razılaşma ilə",
    remote: "Uzaqdan",
    featured: "Seçilmiş"
  },
  companies: {
    title: "Şirkətlər",
    subtitle: "Yoxlanılmış işəgötürənləri kəşf et.",
    empty: "Hələ yoxlanılmış şirkət yoxdur.",
    openJobs: "vakansiya"
  },
  footer: {
    seekers: "İş axtaranlar",
    employers: "İşəgötürənlər",
    company: "Şirkət",
    legal: "Hüquqi",
    createProfile: "Profil yarat",
    findCandidates: "Namizəd axtar",
    howItWorks: "Necə işləyir",
    contact: "Əlaqə",
    privacy: "Məxfilik siyasəti",
    terms: "İstifadə şərtləri",
    cookies: "Kuki siyasəti",
    rights: "Bütün hüquqlar qorunur."
  },
  auth: {
    signInTitle: "Xoş gəldin",
    signInSubtitle: "Hesabına daxil ol və işə davam et.",
    signUpTitle: "Hesab yarat",
    signUpSubtitle: "Bir neçə saniyədə başla.",
    panelHeading: "Karyeranı bir toxunuşla idarə et.",
    panelText:
      "Minlərlə vakansiya, yoxlanılmış şirkətlər və müraciətlərini bir yerdən izləmək imkanı."
  },
  notifications: {
    title: "Bildirişlər",
    markAllRead: "Hamısını oxundu işarələ",
    empty: "Hələ bildiriş yoxdur",
    ariaLabel: "Bildirişlər"
  },
  common: {
    languageLabel: "Dil",
    themeLabel: "Rejimi dəyiş"
  }
};

/** The canonical translation shape; en/ru must satisfy this. */
export type Dictionary = typeof az;
