interface Translations {
  trending_services: string;
  recommended_for_you: string;
  recently_listed: string;
  all_services: string;
  search_placeholder: string;
  select_category: string;
  search_cities: string;
  search_services: string;
  login: string;
  signup: string;
  duration: string;
  additional_filters: string;
  search: string;
  price_range: string;
  condition: string;
  any: string;
  new: string;
  used: string;
  refurbished: string;
  min: string;
  max: string;
}

type TranslationKey = keyof Translations;

export function getTranslation(language: string, key: TranslationKey): string {
  return translations[language]?.[key] || translations['en'][key];
}

const translations: Record<string, Translations> = {
  en: {
    trending_services: 'Trending',
    recommended_for_you: 'Recommended for You',
    recently_listed: 'Recently Listed',
    all_services: 'All Listings',
    search_placeholder: 'Search for products or services...',
    select_category: 'Select Category',
    search_cities: 'Search Cities',
    search_services: 'Search',
    login: 'Login',
    signup: 'Sign Up',
    duration: 'Duration',
    additional_filters: 'Additional Filters',
    search: 'Search',
    price_range: 'Price Range',
    condition: 'Condition',
    any: 'Any',
    new: 'New',
    used: 'Used',
    refurbished: 'Refurbished',
    min: 'Min',
    max: 'Max'
  },
  fr: {
    trending_services: 'Tendances',
    recommended_for_you: 'Recommandé pour vous',
    recently_listed: 'Récemment ajouté',
    all_services: 'Toutes les annonces',
    search_placeholder: 'Rechercher des produits ou services...',
    select_category: 'Sélectionner une catégorie',
    search_cities: 'Rechercher des villes',
    search_services: 'Rechercher',
    login: 'Connexion',
    signup: "S'inscrire",
    duration: 'Durée',
    additional_filters: 'Filtres supplémentaires',
    search: 'Rechercher',
    price_range: 'Fourchette de prix',
    condition: 'État',
    any: 'Tous',
    new: 'Neuf',
    used: 'Occasion',
    refurbished: 'Reconditionné',
    min: 'Min',
    max: 'Max'
  },
  es: {
    trending_services: 'Tendencias',
    recommended_for_you: 'Recomendado para ti',
    recently_listed: 'Recién publicado',
    all_services: 'Todos los anuncios',
    search_placeholder: 'Buscar productos o servicios...',
    select_category: 'Seleccionar categoría',
    search_cities: 'Buscar ciudades',
    search_services: 'Buscar',
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    duration: 'Duración',
    additional_filters: 'Filtros adicionales',
    search: 'Buscar',
    price_range: 'Rango de precio',
    condition: 'Condición',
    any: 'Cualquiera',
    new: 'Nuevo',
    used: 'Usado',
    refurbished: 'Reacondicionado',
    min: 'Mín',
    max: 'Máx'
  },
  hi: {
    trending_services: 'ट्रेंडिंग',
    recommended_for_you: 'आपके लिए अनुशंसित',
    recently_listed: 'हाल ही में सूचीबद्ध',
    all_services: 'सभी लिस्टिंग',
    search_placeholder: 'उत्पाद या सेवाएं खोजें...',
    select_category: 'श्रेणी चुनें',
    search_cities: 'शहर खोजें',
    search_services: 'खोजें',
    login: 'लॉग इन',
    signup: 'साइन अप',
    duration: 'अवधि',
    additional_filters: 'अतिरिक्त फ़िल्टर',
    search: 'खोजें',
    price_range: 'मूल्य सीमा',
    condition: 'स्थिति',
    any: 'कोई भी',
    new: 'नया',
    used: 'इस्तेमाल किया हुआ',
    refurbished: 'नवीनीकृत',
    min: 'न्यूनतम',
    max: 'अधिकतम'
  },
  ar: {
    trending_services: 'الرائج',
    recommended_for_you: 'موصى به لك',
    recently_listed: 'أضيف مؤخراً',
    all_services: 'جميع القوائم',
    search_placeholder: 'البحث عن المنتجات أو الخدمات...',
    select_category: 'اختر الفئة',
    search_cities: 'البحث عن المدن',
    search_services: 'بحث',
    login: 'تسجيل الدخول',
    signup: 'اشتراك',
    duration: 'المدة',
    additional_filters: 'فلاتر إضافية',
    search: 'بحث',
    price_range: 'نطاق السعر',
    condition: 'الحالة',
    any: 'أي',
    new: 'جديد',
    used: 'مستعمل',
    refurbished: 'مجدد',
    min: 'الحد الأدنى',
    max: 'الحد الأقصى'
  },
  pt: {
    trending_services: 'Em alta',
    recommended_for_you: 'Recomendado para você',
    recently_listed: 'Listado recentemente',
    all_services: 'Todas as listagens',
    search_placeholder: 'Procurar produtos ou serviços...',
    select_category: 'Selecionar categoria',
    search_cities: 'Procurar cidades',
    search_services: 'Procurar',
    login: 'Entrar',
    signup: 'Cadastrar',
    duration: 'Duração',
    additional_filters: 'Filtros adicionais',
    search: 'Procurar',
    price_range: 'Faixa de preço',
    condition: 'Condição',
    any: 'Qualquer',
    new: 'Novo',
    used: 'Usado',
    refurbished: 'Recondicionado',
    min: 'Mín',
    max: 'Máx'
  },
  de: {
    trending_services: 'Im Trend',
    recommended_for_you: 'Für Sie empfohlen',
    recently_listed: 'Kürzlich eingestellt',
    all_services: 'Alle Anzeigen',
    search_placeholder: 'Produkte oder Dienstleistungen suchen...',
    select_category: 'Kategorie auswählen',
    search_cities: 'Städte suchen',
    search_services: 'Suchen',
    login: 'Anmelden',
    signup: 'Registrieren',
    duration: 'Dauer',
    additional_filters: 'Zusätzliche Filter',
    search: 'Suchen',
    price_range: 'Preisbereich',
    condition: 'Zustand',
    any: 'Alle',
    new: 'Neu',
    used: 'Gebraucht',
    refurbished: 'Generalüberholt',
    min: 'Min',
    max: 'Max'
  },
  et: {
    trending_services: 'Populaarne',
    recommended_for_you: 'Sulle soovitatud',
    recently_listed: 'Hiljuti lisatud',
    all_services: 'Kõik kuulutused',
    search_placeholder: 'Otsi tooteid või teenuseid...',
    select_category: 'Vali kategooria',
    search_cities: 'Otsi linnu',
    search_services: 'Otsi',
    login: 'Logi sisse',
    signup: 'Registreeru',
    duration: 'Kestus',
    additional_filters: 'Lisafiltrid',
    search: 'Otsi',
    price_range: 'Hinnavahemik',
    condition: 'Seisukord',
    any: 'Kõik',
    new: 'Uus',
    used: 'Kasutatud',
    refurbished: 'Renoveeritud',
    min: 'Min',
    max: 'Max'
  }
}; 