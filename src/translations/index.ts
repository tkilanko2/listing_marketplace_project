interface Translations {
  [key: string]: {
    trending_services: string;
    recommended_for_you: string;
    recently_listed: string;
    all_services: string;
    search_placeholder: string;
    select_category: string;
    search_cities: string;
    duration: string;
    search_services: string;
    login: string;
    signup: string;
    search_languages: string;
    detect_location: string;
    detecting: string;
  };
}

const translations: Translations = {
  en: {
    trending_services: "Trending Services",
    recommended_for_you: "Recommended for You",
    recently_listed: "Recently Listed",
    all_services: "All Services",
    search_placeholder: "What service are you looking for?",
    select_category: "Select Category",
    search_cities: "Search cities (max 5)",
    duration: "Duration",
    search_services: "Search Services",
    login: "Login",
    signup: "Sign up",
    search_languages: "Search languages...",
    detect_location: "Detect my location",
    detecting: "Detecting..."
  },
  fr: {
    trending_services: "Services Tendance",
    recommended_for_you: "Recommandé pour Vous",
    recently_listed: "Récemment Listés",
    all_services: "Tous les Services",
    search_placeholder: "Quel service recherchez-vous ?",
    select_category: "Sélectionner une Catégorie",
    search_cities: "Rechercher des villes (max 5)",
    duration: "Durée",
    search_services: "Rechercher des Services",
    login: "Connexion",
    signup: "S'inscrire",
    search_languages: "Rechercher des langues...",
    detect_location: "Détecter ma position",
    detecting: "Détection..."
  },
  es: {
    trending_services: "Servicios Populares",
    recommended_for_you: "Recomendado para Ti",
    recently_listed: "Listados Recientemente",
    all_services: "Todos los Servicios",
    search_placeholder: "¿Qué servicio estás buscando?",
    select_category: "Seleccionar Categoría",
    search_cities: "Buscar ciudades (máx. 5)",
    duration: "Duración",
    search_services: "Buscar Servicios",
    login: "Iniciar Sesión",
    signup: "Registrarse",
    search_languages: "Buscar idiomas...",
    detect_location: "Detectar mi ubicación",
    detecting: "Detectando..."
  },
  hi: {
    trending_services: "ट्रेंडिंग सेवाएं",
    recommended_for_you: "आपके लिए अनुशंसित",
    recently_listed: "हाल ही में सूचीबद्ध",
    all_services: "सभी सेवाएं",
    search_placeholder: "आप कौन सी सेवा ढूंढ रहे हैं?",
    select_category: "श्रेणी चुनें",
    search_cities: "शहर खोजें (अधिकतम 5)",
    duration: "अवधि",
    search_services: "सेवाएं खोजें",
    login: "लॉग इन",
    signup: "साइन अप",
    search_languages: "भाषाएं खोजें...",
    detect_location: "मेरा स्थान पता करें",
    detecting: "पता लगा रहा है..."
  },
  ar: {
    trending_services: "الخدمات الرائجة",
    recommended_for_you: "موصى به لك",
    recently_listed: "المدرجة حديثاً",
    all_services: "جميع الخدمات",
    search_placeholder: "ما هي الخدمة التي تبحث عنها؟",
    select_category: "اختر الفئة",
    search_cities: "البحث عن المدن (حد أقصى 5)",
    duration: "المدة",
    search_services: "البحث عن الخدمات",
    login: "تسجيل الدخول",
    signup: "التسجيل",
    search_languages: "البحث عن اللغات...",
    detect_location: "اكتشف موقعي",
    detecting: "جاري الكشف..."
  },
  pt: {
    trending_services: "Serviços em Alta",
    recommended_for_you: "Recomendado para Você",
    recently_listed: "Listados Recentemente",
    all_services: "Todos os Serviços",
    search_placeholder: "Qual serviço você está procurando?",
    select_category: "Selecionar Categoria",
    search_cities: "Buscar cidades (máx. 5)",
    duration: "Duração",
    search_services: "Buscar Serviços",
    login: "Entrar",
    signup: "Cadastrar",
    search_languages: "Buscar idiomas...",
    detect_location: "Detectar minha localização",
    detecting: "Detectando..."
  },
  de: {
    trending_services: "Beliebte Dienste",
    recommended_for_you: "Für Sie empfohlen",
    recently_listed: "Kürzlich eingestellt",
    all_services: "Alle Dienste",
    search_placeholder: "Welchen Service suchen Sie?",
    select_category: "Kategorie auswählen",
    search_cities: "Städte suchen (max. 5)",
    duration: "Dauer",
    search_services: "Services suchen",
    login: "Anmelden",
    signup: "Registrieren",
    search_languages: "Sprachen suchen...",
    detect_location: "Meinen Standort erkennen",
    detecting: "Erkennung..."
  },
  et: {
    trending_services: "Populaarsed Teenused",
    recommended_for_you: "Sulle Soovitatud",
    recently_listed: "Hiljuti Lisatud",
    all_services: "Kõik Teenused",
    search_placeholder: "Millist teenust otsite?",
    select_category: "Vali Kategooria",
    search_cities: "Otsi linnu (max 5)",
    duration: "Kestus",
    search_services: "Otsi Teenuseid",
    login: "Logi sisse",
    signup: "Registreeru",
    search_languages: "Otsi keeli...",
    detect_location: "Tuvasta minu asukoht",
    detecting: "Tuvastamine..."
  }
};

export const getTranslation = (language: string, key: keyof Translations['en']) => {
  return translations[language]?.[key] || translations.en[key];
};

export default translations; 