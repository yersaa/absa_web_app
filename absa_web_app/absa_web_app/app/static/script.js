const ASPECT_NAMES = {
  FQ: "Food Quality",
  SS: "Staff Service",
  OA: "Order Accuracy",
  CL: "Cleanliness/Hygiene",
  PV: "Price/Value",
  WS: "Wait/Speed",
  AM: "Ambience",
  LO: "Location",
};

const DEFAULT_WEIGHTS = {
  "Food Quality": 0.25,
  "Staff Service": 0.20,
  "Wait/Speed": 0.15,
  "Order Accuracy": 0.10,
  "Cleanliness/Hygiene": 0.10,
  "Price/Value": 0.10,
  "Ambience": 0.05,
  "Location": 0.05,
};

const I18N = {
  en: {
    appEyebrow: "Managerial analytics",
    appTitle: "Welcome Back, Restaurant Manager",
    appSubtitle: "Service Quality Analytics Dashboard",
    controlsTitle: "Controls",
    modelLabel: "Model",
    thresholdLabel: "Aspect threshold",
    weightsTitle: "SQI weights",
    singleTitle: "Analyze Single Review",
    uploadEyebrow: "Upload Excel",
    uploadTitle: "Upload Review Dataset",
    uploadSubtitle: "Upload an .xlsx file with review text. Rating, branch, date, platform, response, and address columns are optional.",
    manualColumnText: "Review text column was not detected. Select it manually and run again.",
    emptyTitle: "No analysis yet",
    emptySubtitle: "Upload an Excel file and click Run Analysis to unlock the dashboard.",
    tabOverview: "Overview",
    tabPraise: "What Customers Praise",
    tabProblems: "Problems",
    tabBranches: "Branches",
    tabReviews: "Reviews",
    tabActions: "What To Do",
    tabBranchAnalysis: "Branch Analysis",
    runAnalysis: "Run Analysis",
    clear: "Clear",
    analyzeReview: "Analyze Review",
    theme: "Theme",
    analyzing: "Uploading file and running local model inference...",
    analyzingShort: "Analyzing...",
    noData: "No data available",
    missingFile: "Please choose an .xlsx file first.",
    backendOk: "Backend OK",
    backendUnavailable: "Backend unavailable",
  },
  ru: {
    appEyebrow: "MVP управленческой аналитики",
    appTitle: "ABSA-дашборд отзывов ресторанов",
    appSubtitle: "Аспектный анализ тональности для ресторанов, кафе и fast-food заведений",
    controlsTitle: "Настройки",
    modelLabel: "Модель",
    thresholdLabel: "Порог аспектов",
    weightsTitle: "Веса SQI",
    singleTitle: "Проверка одного отзыва",
    uploadEyebrow: "Загрузка Excel",
    uploadTitle: "Преобразуйте отзывы в аспекты, тональность, SQI, NPS и аналитику филиалов",
    uploadSubtitle: "Загрузите .xlsx файл с колонкой отзывов. Рейтинг, филиал, дата, платформа и ответ компании необязательны.",
    manualColumnText: "Колонка с текстом отзыва не найдена. Выберите ее вручную и запустите анализ снова.",
    emptyTitle: "Анализ еще не запущен",
    emptySubtitle: "Загрузите Excel-файл и нажмите «Запустить анализ», чтобы открыть дашборд.",
    tabOverview: "Обзор",
    tabPraise: "Что хвалят",
    tabProblems: "Проблемы",
    tabBranches: "Филиалы",
    tabReviews: "Отзывы",
    tabActions: "Что делать",
    tabBranchAnalysis: "Анализ филиала",
    runAnalysis: "Запустить анализ",
    clear: "Очистить",
    analyzeReview: "Анализировать отзыв",
    theme: "Сменить тему",
    analyzing: "Загружаем файл и выполняем локальный инференс модели...",
    analyzingShort: "Анализируем...",
    noData: "Нет данных",
    missingFile: "Сначала выберите .xlsx файл.",
    backendOk: "Backend работает",
    backendUnavailable: "Backend недоступен",
  },
  kk: {
    appEyebrow: "Басқарушылық аналитика MVP",
    appTitle: "Мейрамхана пікірлеріне арналған ABSA дашборды",
    appSubtitle: "Мейрамхана, кафе және fast-food бизнесі үшін аспектілік тоналдық талдау",
    controlsTitle: "Баптаулар",
    modelLabel: "Модель",
    thresholdLabel: "Аспект шегі",
    weightsTitle: "SQI салмақтары",
    singleTitle: "Бір пікірді тексеру",
    uploadEyebrow: "Excel жүктеу",
    uploadTitle: "Пікірлерді аспект, тоналдық, SQI, NPS және филиал аналитикасына айналдырыңыз",
    uploadSubtitle: ".xlsx файл жүктеңіз. Пікір бағаны міндетті, рейтинг, филиал, күн, платформа және жауап бағандары қосымша.",
    manualColumnText: "Пікір мәтіні бар баған табылмады. Оны қолмен таңдап, талдауды қайта іске қосыңыз.",
    emptyTitle: "Әзірге талдау жоқ",
    emptySubtitle: "Дашбордты ашу үшін Excel файлын жүктеп, «Талдауды бастау» батырмасын басыңыз.",
    tabOverview: "Шолу",
    tabPraise: "Клиенттер нені мақтайды",
    tabProblems: "Мәселелер",
    tabBranches: "Филиалдар",
    tabReviews: "Пікірлер",
    tabActions: "Не істеу керек",
    tabBranchAnalysis: "Филиал талдауы",
    runAnalysis: "Талдауды бастау",
    clear: "Тазарту",
    analyzeReview: "Пікірді талдау",
    theme: "Тақырыпты ауыстыру",
    analyzing: "Файл жүктеліп, жергілікті модель инференсі орындалып жатыр...",
    analyzingShort: "Талдау жүріп жатыр...",
    noData: "Дерек жоқ",
    missingFile: "Алдымен .xlsx файл таңдаңыз.",
    backendOk: "Backend жұмыс істеп тұр",
    backendUnavailable: "Backend қолжетімсіз",
  },
};

const UI_TEXT = {
  en: {
    mvpDashboard: "MVP Dashboard",
    managerViewTitle: "Manager view: aspects, sentiment, SQI, branches and trends",
    managerViewSubtitle: "Model: {model} · Reviews: {reviews} · Columns: {columns}",
    textOnly: "text only",
    aspectClassificationFeature: "Aspect-based classification",
    aspectClassificationFeatureText: "One row per review-aspect prediction with probabilities.",
    sentimentFeature: "Sentiment analytics",
    sentimentFeatureText: "Positive, neutral and negative shares by aspect and branch.",
    sqiFeature: "Service Quality Index",
    sqiFeatureText: "Weighted SQI from aspect-level sentiment confidence.",
    exportFeature: "Export-ready outputs",
    exportFeatureText: "CSV predictions and multi-sheet Excel report.",
    averageRating: "Average rating",
    totalReviews: "Total reviews",
    aspectMentions: "Aspect mentions",
    responseRate: "Response rate",
    overallSqi: "Overall SQI",
    negativeShare: "Negative share",
    positiveShare: "Positive share",
    mainProblem: "Most problematic aspect",
    strongestAspect: "Strongest aspect",
    branchAnalytics: "Branch analytics",
    timeTrends: "Time trends",
    available: "Available",
    noBranchColumn: "No branch column",
    noDateColumn: "No valid date column",
    downloadPredictionsCsv: "Download predictions CSV",
    downloadExcelReport: "Download Excel report",
    downloadFilteredCsv: "Download filtered CSV",
    coreAnalytics: "Core analytics",
    coreAnalyticsText: "Interactive Canvas charts rendered in the browser without external chart libraries.",
    aspectDistribution: "Aspect mention distribution",
    sentimentDistribution: "Sentiment distribution",
    sentimentByAspect: "Sentiment by aspect",
    sqiByAspect: "SQI by aspect",
    negativeShareByAspect: "Negative share by aspect",
    ratingDistribution: "Star rating distribution",
    ratingTrend: "Rating trend by month",
    sqiTrend: "SQI trend over time",
    venueComparison: "Venue / branch comparison",
    aspectClassificationResults: "Aspect-based classification results",
    reviewLevelTable: "Review-level prediction table",
    positiveStrengths: "Positive strengths",
    positiveStrengthsText: "These strengths are based on model predictions, not keyword rules.",
    positiveRanked: "Positive aspects ranked by positive share",
    positiveKeywordCloud: "Positive keyword cloud",
    positiveShareByAspect: "Positive share by aspect",
    positiveMentionsByAspect: "Positive mentions by aspect",
    positiveQuotes: "Representative positive customer quotes",
    problematicAspects: "Problematic aspects",
    problematicAspectsText: "Priorities combine negative share and mention volume so rare one-off complaints do not dominate.",
    negativeRanked: "Negative aspects ranked by severity",
    negativeKeywordCloud: "Negative keyword cloud",
    negativeMentionsByAspect: "Negative mentions by aspect",
    negativeQuotes: "Negative customer quotes",
    branchAnalyticsTitle: "Venue-level / branch-level analytics",
    branchAnalyticsText: "Use this table to compare service quality and risk by restaurant, branch or location.",
    sqiByBranch: "SQI by branch",
    negativeShareByBranch: "Negative share by branch",
    sortableBranchTable: "Sortable branch table",
    branchUnavailableTitle: "Branch analytics unavailable",
    branchUnavailableText: "Branch analytics is available when your Excel file contains a branch, venue or restaurant column.",
    reviewExplorerTitle: "Review-level prediction table",
    reviewExplorerText: "Explore original reviews with detected aspects, aspect sentiment and confidence values.",
    searchReview: "Search review text",
    minRating: "Min rating",
    maxRating: "Max rating",
    sqiMin: "SQI min",
    lowConfidenceOnly: "Low confidence only",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    whatToDoTitle: "What to do next",
    whatToDoText: "Business recommendations are generated from the most negative aspect-level patterns.",
    noUrgentProblems: "No urgent problem areas detected.",
    whyItMatters: "Why it matters",
    recommendedAction: "Recommended action",
    exampleQuote: "Example quote",
    suggestedResponse: "Suggested response",
    branchSelect: "Select branch",
    branchRequiresTitle: "Branch-level analysis requires a branch column",
    branchRequiresText: "Upload a file with venue, restaurant or branch information to unlock this section.",
    weakestAspect: "Weakest aspect",
    positiveReviews: "Representative positive reviews",
    negativeReviews: "Representative negative reviews",
    branchRecommendations: "Concrete recommendations for this branch",
    reviewId: "Review ID",
    rating: "Rating",
    confidence: "Confidence",
    branch: "Branch",
    tendency: "Tendency",
    all: "All",
    cards: "Cards",
    reviewTable: "Review table",
    aspectTable: "Aspect table",
    yes: "yes",
    no: "no",
  },
  ru: {
    mvpDashboard: "MVP-дашборд",
    managerViewTitle: "Вид менеджера: аспекты, тональность, SQI, филиалы и тренды",
    managerViewSubtitle: "Модель: {model} · Отзывы: {reviews} · Колонки: {columns}",
    textOnly: "только текст",
    aspectClassificationFeature: "Классификация аспектов",
    aspectClassificationFeatureText: "Одна строка на пару отзыв-аспект с вероятностями.",
    sentimentFeature: "Аналитика тональности",
    sentimentFeatureText: "Доли позитивных, нейтральных и негативных упоминаний по аспектам и филиалам.",
    sqiFeature: "Индекс качества сервиса",
    sqiFeatureText: "Взвешенный SQI на основе тональности и уверенности модели.",
    exportFeature: "Готовые выгрузки",
    exportFeatureText: "CSV с предсказаниями и многостраничный Excel-отчет.",
    averageRating: "Средний рейтинг",
    totalReviews: "Всего отзывов",
    aspectMentions: "Упоминания аспектов",
    responseRate: "Доля ответов",
    overallSqi: "Общий SQI",
    negativeShare: "Доля негатива",
    positiveShare: "Доля позитива",
    mainProblem: "Главная проблема",
    strongestAspect: "Сильнейший аспект",
    branchAnalytics: "Аналитика филиалов",
    timeTrends: "Временные тренды",
    available: "Доступно",
    noBranchColumn: "Нет колонки филиала",
    noDateColumn: "Нет корректной даты",
    downloadPredictionsCsv: "Скачать CSV предсказаний",
    downloadExcelReport: "Скачать Excel-отчет",
    downloadFilteredCsv: "Скачать отфильтрованный CSV",
    coreAnalytics: "Основная аналитика",
    coreAnalyticsText: "Интерактивные Canvas-графики в браузере без внешних библиотек.",
    aspectDistribution: "Распределение аспектов",
    sentimentDistribution: "Распределение тональности",
    sentimentByAspect: "Тональность по аспектам",
    sqiByAspect: "SQI по аспектам",
    negativeShareByAspect: "Доля негатива по аспектам",
    ratingDistribution: "Распределение рейтингов",
    ratingTrend: "Тренд рейтинга по месяцам",
    sqiTrend: "Тренд SQI во времени",
    venueComparison: "Сравнение заведений / филиалов",
    aspectClassificationResults: "Результаты классификации аспектов",
    reviewLevelTable: "Таблица предсказаний по отзывам",
    positiveStrengths: "Позитивные сильные стороны",
    positiveStrengthsText: "Сильные стороны рассчитаны по предсказаниям модели, а не по ключевым словам.",
    positiveRanked: "Позитивные аспекты по доле позитива",
    positiveKeywordCloud: "Облако позитивных слов",
    positiveShareByAspect: "Доля позитива по аспектам",
    positiveMentionsByAspect: "Позитивные упоминания по аспектам",
    positiveQuotes: "Примеры позитивных отзывов",
    problematicAspects: "Проблемные аспекты",
    problematicAspectsText: "Приоритет учитывает долю негатива и объем упоминаний, чтобы единичные жалобы не доминировали.",
    negativeRanked: "Негативные аспекты по серьезности",
    negativeKeywordCloud: "Облако негативных слов",
    negativeMentionsByAspect: "Негативные упоминания по аспектам",
    negativeQuotes: "Негативные отзывы",
    branchAnalyticsTitle: "Аналитика заведений / филиалов",
    branchAnalyticsText: "Используйте таблицу для сравнения качества сервиса и рисков по ресторанам, филиалам или точкам.",
    sqiByBranch: "SQI по филиалам",
    negativeShareByBranch: "Доля негатива по филиалам",
    sortableBranchTable: "Таблица филиалов",
    branchUnavailableTitle: "Аналитика филиалов недоступна",
    branchUnavailableText: "Аналитика филиалов появится, если в Excel есть колонка филиала, заведения или ресторана.",
    reviewExplorerTitle: "Таблица предсказаний по отзывам",
    reviewExplorerText: "Просматривайте исходные отзывы, найденные аспекты, тональность и уверенность модели.",
    searchReview: "Поиск по тексту отзыва",
    minRating: "Мин. рейтинг",
    maxRating: "Макс. рейтинг",
    sqiMin: "Мин. SQI",
    lowConfidenceOnly: "Только низкая уверенность",
    previous: "Назад",
    next: "Далее",
    page: "Страница",
    of: "из",
    whatToDoTitle: "Что делать дальше",
    whatToDoText: "Рекомендации формируются на основе самых негативных аспектных паттернов.",
    noUrgentProblems: "Срочных проблемных зон не найдено.",
    whyItMatters: "Почему это важно",
    recommendedAction: "Рекомендуемое действие",
    exampleQuote: "Пример отзыва",
    suggestedResponse: "Шаблон ответа",
    branchSelect: "Выберите филиал",
    branchRequiresTitle: "Для анализа филиала нужна колонка филиала",
    branchRequiresText: "Загрузите файл с колонкой заведения, ресторана или филиала, чтобы открыть этот раздел.",
    weakestAspect: "Слабейший аспект",
    positiveReviews: "Примеры позитивных отзывов",
    negativeReviews: "Примеры негативных отзывов",
    branchRecommendations: "Конкретные рекомендации для филиала",
    reviewId: "ID отзыва",
    rating: "Рейтинг",
    confidence: "Уверенность",
    branch: "Филиал",
    tendency: "Тенденция",
    all: "Все",
    cards: "Карточки",
    reviewTable: "Таблица отзывов",
    aspectTable: "Таблица аспектов",
    yes: "да",
    no: "нет",
  },
  kk: {
    mvpDashboard: "MVP дашборд",
    managerViewTitle: "Менеджер көрінісі: аспектілер, тоналдық, SQI, филиалдар және трендтер",
    managerViewSubtitle: "Модель: {model} · Пікірлер: {reviews} · Бағандар: {columns}",
    textOnly: "тек мәтін",
    aspectClassificationFeature: "Аспектілерді жіктеу",
    aspectClassificationFeatureText: "Әр пікір-аспект жұбы үшін ықтималдықтары бар жеке жол.",
    sentimentFeature: "Тоналдық аналитикасы",
    sentimentFeatureText: "Аспект және филиал бойынша позитив, бейтарап және негатив үлестері.",
    sqiFeature: "Қызмет сапасы индексі",
    sqiFeatureText: "Аспект тоналдығы мен модель сенімділігіне негізделген салмақталған SQI.",
    exportFeature: "Дайын экспорттар",
    exportFeatureText: "Болжамдар CSV және бірнеше беттен тұратын Excel есебі.",
    averageRating: "Орташа рейтинг",
    totalReviews: "Барлық пікірлер",
    aspectMentions: "Аспект упоминаниялары",
    responseRate: "Жауап беру үлесі",
    overallSqi: "Жалпы SQI",
    negativeShare: "Негатив үлесі",
    positiveShare: "Позитив үлесі",
    mainProblem: "Негізгі мәселе",
    strongestAspect: "Ең күшті аспект",
    branchAnalytics: "Филиал аналитикасы",
    timeTrends: "Уақыт трендтері",
    available: "Қолжетімді",
    noBranchColumn: "Филиал бағаны жоқ",
    noDateColumn: "Дұрыс күн бағаны жоқ",
    downloadPredictionsCsv: "Болжамдар CSV жүктеу",
    downloadExcelReport: "Excel есепті жүктеу",
    downloadFilteredCsv: "Сүзілген CSV жүктеу",
    coreAnalytics: "Негізгі аналитика",
    coreAnalyticsText: "Сыртқы кітапханасыз браузерде салынатын интерактивті Canvas графиктері.",
    aspectDistribution: "Аспектілер таралуы",
    sentimentDistribution: "Тоналдық таралуы",
    sentimentByAspect: "Аспект бойынша тоналдық",
    sqiByAspect: "Аспект бойынша SQI",
    negativeShareByAspect: "Аспект бойынша негатив үлесі",
    ratingDistribution: "Рейтингтер таралуы",
    ratingTrend: "Ай бойынша рейтинг тренді",
    sqiTrend: "Уақыт бойынша SQI тренді",
    venueComparison: "Заведение / филиал салыстыру",
    aspectClassificationResults: "Аспект жіктеу нәтижелері",
    reviewLevelTable: "Пікір деңгейіндегі болжамдар кестесі",
    positiveStrengths: "Позитивті күшті жақтар",
    positiveStrengthsText: "Күшті жақтар кілт сөздермен емес, модель болжамдарымен есептеледі.",
    positiveRanked: "Позитив үлесі бойынша аспектілер",
    positiveKeywordCloud: "Позитив сөздер бұлты",
    positiveShareByAspect: "Аспект бойынша позитив үлесі",
    positiveMentionsByAspect: "Аспект бойынша позитив упоминаниялар",
    positiveQuotes: "Позитив пікір мысалдары",
    problematicAspects: "Проблемалық аспектілер",
    problematicAspectsText: "Приоритет негатив үлесі мен упоминания көлемін ескереді, сондықтан бір реттік шағымдар басым болмайды.",
    negativeRanked: "Маңыздылығы бойынша негатив аспектілер",
    negativeKeywordCloud: "Негатив сөздер бұлты",
    negativeMentionsByAspect: "Аспект бойынша негатив упоминаниялар",
    negativeQuotes: "Негатив пікірлер",
    branchAnalyticsTitle: "Заведение / филиал деңгейіндегі аналитика",
    branchAnalyticsText: "Бұл кесте мейрамхана, филиал немесе нүкте бойынша сервис сапасы мен тәуекелді салыстыруға арналған.",
    sqiByBranch: "Филиал бойынша SQI",
    negativeShareByBranch: "Филиал бойынша негатив үлесі",
    sortableBranchTable: "Филиалдар кестесі",
    branchUnavailableTitle: "Филиал аналитикасы қолжетімсіз",
    branchUnavailableText: "Excel файлында филиал, заведение немесе ресторан бағаны болса, филиал аналитикасы ашылады.",
    reviewExplorerTitle: "Пікір деңгейіндегі болжамдар кестесі",
    reviewExplorerText: "Бастапқы пікірлерді, табылған аспектілерді, тоналдықты және модель сенімділігін қараңыз.",
    searchReview: "Пікір мәтінінен іздеу",
    minRating: "Мин. рейтинг",
    maxRating: "Макс. рейтинг",
    sqiMin: "Мин. SQI",
    lowConfidenceOnly: "Тек төмен сенімділік",
    previous: "Артқа",
    next: "Келесі",
    page: "Бет",
    of: "ішінен",
    whatToDoTitle: "Келесі әрекеттер",
    whatToDoText: "Ұсынымдар ең негативті аспектілік паттерндер негізінде жасалады.",
    noUrgentProblems: "Шұғыл проблемалық аймақтар табылмады.",
    whyItMatters: "Неліктен маңызды",
    recommendedAction: "Ұсынылатын әрекет",
    exampleQuote: "Пікір мысалы",
    suggestedResponse: "Жауап үлгісі",
    branchSelect: "Филиалды таңдаңыз",
    branchRequiresTitle: "Филиал талдауы үшін филиал бағаны қажет",
    branchRequiresText: "Бұл бөлімді ашу үшін заведение, ресторан немесе филиал бағаны бар файл жүктеңіз.",
    weakestAspect: "Ең әлсіз аспект",
    positiveReviews: "Позитив пікір мысалдары",
    negativeReviews: "Негатив пікір мысалдары",
    branchRecommendations: "Осы филиалға нақты ұсынымдар",
    reviewId: "Пікір ID",
    rating: "Рейтинг",
    confidence: "Сенімділік",
    branch: "Филиал",
    tendency: "Тенденция",
    all: "Барлығы",
    cards: "Карточкалар",
    reviewTable: "Пікірлер кестесі",
    aspectTable: "Аспектілер кестесі",
    yes: "иә",
    no: "жоқ",
  },
};

const ASPECT_DISPLAY = {
  en: {
    FQ: "Food Quality",
    SS: "Staff Service",
    OA: "Order Accuracy",
    CL: "Cleanliness/Hygiene",
    PV: "Price/Value",
    WS: "Wait/Speed",
    AM: "Ambience",
    LO: "Location",
  },
  ru: {
    FQ: "Качество еды",
    SS: "Обслуживание персонала",
    OA: "Точность заказа",
    CL: "Чистота/гигиена",
    PV: "Цена/ценность",
    WS: "Ожидание/скорость",
    AM: "Атмосфера",
    LO: "Локация",
  },
  kk: {
    FQ: "Тағам сапасы",
    SS: "Қызметкерлер қызметі",
    OA: "Тапсырыс дәлдігі",
    CL: "Тазалық/гигиена",
    PV: "Баға/құндылық",
    WS: "Күту/жылдамдық",
    AM: "Атмосфера",
    LO: "Орналасу",
  },
};

const ASPECT_NAME_TO_ID = Object.fromEntries(Object.entries(ASPECT_NAMES).map(([id, name]) => [name, id]));

const LOCAL_RECOMMENDATIONS = {
  en: {
    FQ: "Review menu consistency, freshness, taste, temperature, and portion quality.",
    SS: "Improve staff training, politeness, communication, and complaint handling.",
    OA: "Check order assembly, POS communication, packaging, and final order verification.",
    CL: "Increase cleaning frequency and make hygiene control more visible to customers.",
    PV: "Review portion-to-price ratio, promotions, and perceived value for money.",
    WS: "Improve queue management, kitchen preparation speed, and staff scheduling during peak hours.",
    AM: "Check seating comfort, noise level, lighting, music, and interior atmosphere.",
    LO: "Improve signage, navigation information, parking information, and delivery zone clarity.",
  },
  ru: {
    FQ: "Проверьте стабильность меню, свежесть, вкус, температуру подачи и размер порций.",
    SS: "Усилите обучение персонала, вежливость, коммуникацию и работу с жалобами.",
    OA: "Проверьте сборку заказа, коммуникацию через POS, упаковку и финальную проверку.",
    CL: "Увеличьте частоту уборки и сделайте контроль гигиены более заметным для гостей.",
    PV: "Пересмотрите соотношение порции и цены, акции и воспринимаемую ценность.",
    WS: "Улучшите управление очередью, скорость кухни и расписание персонала в часы пик.",
    AM: "Проверьте комфорт посадки, шум, освещение, музыку и общую атмосферу.",
    LO: "Улучшите навигацию, вывески, информацию о парковке и доступности филиала.",
  },
  kk: {
    FQ: "Мәзір тұрақтылығын, балғындықты, дәмді, ұсыну температурасын және порция көлемін тексеріңіз.",
    SS: "Қызметкерлерді оқытуды, сыпайылықты, коммуникацияны және шағыммен жұмысты күшейтіңіз.",
    OA: "Тапсырыс жинауды, POS коммуникациясын, қаптаманы және соңғы тексеруді бақылаңыз.",
    CL: "Тазалау жиілігін арттырып, гигиена бақылауын клиенттерге көрінетін етіңіз.",
    PV: "Порция мен баға арақатынасын, акцияларды және клиент сезінетін құндылықты қайта қараңыз.",
    WS: "Кезекті басқаруды, асүй жылдамдығын және қарбалас уақытта персонал кестесін жақсартыңыз.",
    AM: "Орындық жайлылығын, шуды, жарықты, музыканы және жалпы атмосфераны тексеріңіз.",
    LO: "Навигацияны, маңдайшаларды, тұрақ туралы ақпаратты және филиалға қолжетімділікті жақсартыңыз.",
  },
};

const LOCAL_RESPONSE_TEMPLATES = {
  en: {
    FQ: "Thank you for sharing your experience. We are sorry that the food quality did not meet your expectations. We will review this with our kitchen team and check consistency, freshness, and serving standards.",
    SS: "Thank you for your feedback. We are sorry for the service experience you described. We will address this with our team and strengthen staff communication and customer care standards.",
    OA: "Thank you for letting us know. We apologize for the mistake in your order. We are checking our order assembly and verification process to prevent this from happening again.",
    CL: "Thank you for your comment. Cleanliness is very important to us, and we are sorry for this experience. We will review cleaning frequency and hygiene control at this branch.",
    PV: "Thank you for your feedback. We understand your concern about value for money. We will review pricing, portion size, and current offers.",
    WS: "Thank you for your feedback. We are sorry that your order took longer than expected. We are reviewing our preparation process and staff scheduling during busy hours to improve waiting time.",
    AM: "Thank you for your feedback. We are sorry that the atmosphere was not comfortable. We will review seating comfort, noise level, lighting, and the general environment.",
    LO: "Thank you for your feedback. We understand that location and accessibility are important. We will work on clearer navigation information and branch accessibility details.",
  },
  ru: {
    FQ: "Спасибо, что поделились опытом. Нам жаль, что качество еды не оправдало ожидания. Мы обсудим это с кухней и проверим стабильность, свежесть и стандарты подачи.",
    SS: "Спасибо за отзыв. Нам жаль, что обслуживание оставило такое впечатление. Мы разберем ситуацию с командой и усилим стандарты коммуникации и заботы о гостях.",
    OA: "Спасибо, что сообщили нам. Приносим извинения за ошибку в заказе. Мы проверим процесс сборки и контроля заказов, чтобы не допустить повторения.",
    CL: "Спасибо за комментарий. Чистота очень важна для нас, и нам жаль за этот опыт. Мы пересмотрим частоту уборки и контроль гигиены в этом филиале.",
    PV: "Спасибо за отзыв. Мы понимаем ваше замечание о соотношении цены и ценности. Мы пересмотрим цены, порции и текущие предложения.",
    WS: "Спасибо за отзыв. Нам жаль, что заказ пришлось ждать дольше ожидаемого. Мы проверим процесс приготовления и расписание персонала в часы пик.",
    AM: "Спасибо за отзыв. Нам жаль, что атмосфера была некомфортной. Мы проверим посадку, шум, освещение и общую обстановку.",
    LO: "Спасибо за отзыв. Мы понимаем, что расположение и доступность важны. Мы улучшим навигацию и информацию о доступности филиала.",
  },
  kk: {
    FQ: "Пікіріңізге рахмет. Тағам сапасы күткеніңізге сай болмағанына өкінеміз. Біз мұны асүй командасымен қарап, тұрақтылықты, балғындықты және ұсыну стандарттарын тексереміз.",
    SS: "Пікіріңізге рахмет. Қызмет көрсету тәжірибеңіз көңілден шықпағанына өкінеміз. Біз бұл жағдайды командамен талқылап, коммуникация және клиентке қамқорлық стандарттарын күшейтеміз.",
    OA: "Хабарлағаныңызға рахмет. Тапсырыстағы қате үшін кешірім сұраймыз. Біз тапсырыс жинау және тексеру процесін қайта қарап жатырмыз.",
    CL: "Пікіріңізге рахмет. Тазалық біз үшін өте маңызды, бұл тәжірибе үшін кешірім сұраймыз. Осы филиалда тазалау жиілігі мен гигиена бақылауын қайта қараймыз.",
    PV: "Пікіріңізге рахмет. Баға мен құндылық туралы ескертуіңізді түсінеміз. Бағаны, порция көлемін және ұсыныстарды қайта қараймыз.",
    WS: "Пікіріңізге рахмет. Тапсырысты күткеніңіз ұзақ болғанына өкінеміз. Біз дайындау процесін және қарбалас уақыттағы персонал кестесін тексереміз.",
    AM: "Пікіріңізге рахмет. Атмосфера жайлы болмағанына өкінеміз. Орындық жайлылығын, шуды, жарықты және жалпы ортаны тексереміз.",
    LO: "Пікіріңізге рахмет. Орналасу және қолжетімділік маңызды екенін түсінеміз. Навигация мен филиалға қолжетімділік ақпаратын жақсартамыз.",
  },
};

const SENTIMENT_DISPLAY = {
  en: { positive: "positive", neutral: "neutral", negative: "negative", mixed: "mixed" },
  ru: { positive: "позитив", neutral: "нейтрально", negative: "негатив", mixed: "смешанная" },
  kk: { positive: "позитив", neutral: "бейтарап", negative: "негатив", mixed: "аралас" },
};

const PRIORITY_DISPLAY = {
  en: { Critical: "Critical", Important: "Important", Moderate: "Moderate", Recommended: "Recommended" },
  ru: { Critical: "Критично", Important: "Важно", Moderate: "Средне", Recommended: "Рекомендуется" },
  kk: { Critical: "Критикалық", Important: "Маңызды", Moderate: "Орташа", Recommended: "Ұсынылады" },
};

const SQI_STATUS_DISPLAY = {
  en: { Critical: "Critical", "Needs Improvement": "Needs Improvement", Good: "Good", Excellent: "Excellent", "Not available": "Not available" },
  ru: { Critical: "Критично", "Needs Improvement": "Требует улучшения", Good: "Хорошо", Excellent: "Отлично", "Not available": "Нет данных" },
  kk: { Critical: "Критикалық", "Needs Improvement": "Жақсарту қажет", Good: "Жақсы", Excellent: "Өте жақсы", "Not available": "Дерек жоқ" },
};

const COLUMN_LABELS = {
  en: {},
  ru: {
    review_id: "ID отзыва",
    original_review: "Текст отзыва",
    star_rating: "Рейтинг",
    venue: "Филиал",
    date: "Дата",
    platform: "Платформа",
    aspect_id: "ID аспекта",
    aspect_name: "Аспект",
    aspect_confidence: "Уверенность аспекта",
    sentiment: "Тональность",
    sentiment_confidence: "Уверенность тональности",
    low_confidence_flag: "Низкая уверенность",
    detected_aspects: "Найденные аспекты",
    dominant_sentiment: "Главная тональность",
    negative_aspects: "Негативные аспекты",
    positive_aspects: "Позитивные аспекты",
    average_aspect_confidence: "Средняя уверенность аспекта",
    average_sentiment_confidence: "Средняя уверенность тональности",
    total_mentions: "Всего упоминаний",
    positive_share: "Доля позитива",
    neutral_share: "Доля нейтрала",
    negative_share: "Доля негатива",
    positive_count: "Позитив",
    neutral_count: "Нейтрально",
    negative_count: "Негатив",
    aspect_sqi: "SQI аспекта",
    sample_quote: "Пример отзыва",
    priority: "Приоритет",
    recommendation: "Рекомендация",
    response_template: "Шаблон ответа",
    branch_name: "Филиал",
    branch_names: "Филиалы",
    address: "Адрес",
    average_rating: "Средний рейтинг",
    review_count: "Отзывы",
    aspect_mentions: "Упоминания аспектов",
    overall_sqi: "Общий SQI",
    response_rate: "Доля ответов",
    nps: "NPS",
    most_problematic_aspect: "Главная проблема",
    strongest_aspect: "Сильнейший аспект",
  },
  kk: {
    review_id: "Пікір ID",
    original_review: "Пікір мәтіні",
    star_rating: "Рейтинг",
    venue: "Филиал",
    date: "Күні",
    platform: "Платформа",
    aspect_id: "Аспект ID",
    aspect_name: "Аспект",
    aspect_confidence: "Аспект сенімділігі",
    sentiment: "Тоналдық",
    sentiment_confidence: "Тоналдық сенімділігі",
    low_confidence_flag: "Төмен сенімділік",
    detected_aspects: "Табылған аспектілер",
    dominant_sentiment: "Негізгі тоналдық",
    negative_aspects: "Негатив аспектілер",
    positive_aspects: "Позитив аспектілер",
    average_aspect_confidence: "Орташа аспект сенімділігі",
    average_sentiment_confidence: "Орташа тоналдық сенімділігі",
    total_mentions: "Барлық упоминаниялар",
    positive_share: "Позитив үлесі",
    neutral_share: "Бейтарап үлесі",
    negative_share: "Негатив үлесі",
    positive_count: "Позитив",
    neutral_count: "Бейтарап",
    negative_count: "Негатив",
    aspect_sqi: "Аспект SQI",
    sample_quote: "Пікір мысалы",
    priority: "Приоритет",
    recommendation: "Ұсыным",
    response_template: "Жауап үлгісі",
    branch_name: "Филиал",
    branch_names: "Филиалдар",
    address: "Мекенжай",
    average_rating: "Орташа рейтинг",
    review_count: "Пікірлер",
    aspect_mentions: "Аспект упоминаниялары",
    overall_sqi: "Жалпы SQI",
    response_rate: "Жауап үлесі",
    nps: "NPS",
    most_problematic_aspect: "Негізгі мәселе",
    strongest_aspect: "Ең күшті аспект",
  },
};

const state = {
  analysis: null,
  selectedTab: "upload",
  currentFile: null,
  manualTextColumn: null,
  reviewPage: 1,
  reviewMode: "cards",
  language: localStorage.getItem("absa-language") || "en",
  health: null,
  branchFilters: { ratingMin: 0, sqiMin: 0, negMax: 1, minReviews: 0 },
};

const ANALYSIS_TABS = new Set([
  "overview", "performance", "trends", "aspects", "praise", "problems",
  "branches", "reviews", "actions", "branchAnalysis", "nps", "export",
]);
const STANDALONE_TABS = new Set(["singleReview", "upload", "settings"]);

const $ = (id) => document.getElementById(id);

function t(key) {
  return I18N[state.language]?.[key] || I18N.en[key] || key;
}

function u(key, params = {}) {
  let text = UI_TEXT[state.language]?.[key] || UI_TEXT.en[key] || key;
  Object.entries(params).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, value ?? "");
  });
  return text;
}

function aspectDisplay(value) {
  const raw = String(value ?? "");
  const aspectId = ASPECT_NAMES[raw] ? raw : ASPECT_NAME_TO_ID[raw];
  return aspectId ? (ASPECT_DISPLAY[state.language]?.[aspectId] || ASPECT_DISPLAY.en[aspectId]) : raw;
}

function localizeAspectList(value) {
  let text = String(value ?? "");
  Object.entries(ASPECT_NAME_TO_ID).forEach(([englishName, aspectId]) => {
    text = text.replaceAll(englishName, aspectDisplay(aspectId));
  });
  return text;
}

function sentimentDisplay(value) {
  const key = String(value ?? "").toLowerCase();
  return SENTIMENT_DISPLAY[state.language]?.[key] || SENTIMENT_DISPLAY.en[key] || value;
}

function priorityDisplay(value) {
  const key = String(value ?? "");
  return PRIORITY_DISPLAY[state.language]?.[key] || PRIORITY_DISPLAY.en[key] || value;
}

function sqiStatusDisplay(value) {
  const key = String(value ?? "");
  return SQI_STATUS_DISPLAY[state.language]?.[key] || SQI_STATUS_DISPLAY.en[key] || value;
}

function localizedRecommendation(aspectId, fallback = "") {
  return LOCAL_RECOMMENDATIONS[state.language]?.[aspectId] || LOCAL_RECOMMENDATIONS.en[aspectId] || fallback;
}

function localizedResponseTemplate(aspectId, fallback = "") {
  return LOCAL_RESPONSE_TEMPLATES[state.language]?.[aspectId] || LOCAL_RESPONSE_TEMPLATES.en[aspectId] || fallback;
}

function localizedWhyItMatters(aspectId, aspectName = "") {
  if (state.language === "ru") {
    return `Негатив по аспекту «${aspectDisplay(aspectId || aspectName)}» напрямую влияет на воспринимаемое качество сервиса и повторные визиты.`;
  }
  if (state.language === "kk") {
    return `«${aspectDisplay(aspectId || aspectName)}» аспектісіндегі негатив қызмет сапасын қабылдауға және қайта келуге тікелей әсер етеді.`;
  }
  return `Negative feedback about ${aspectDisplay(aspectId || aspectName)} directly affects perceived service quality and repeat visits.`;
}

function recommendationBranchNames(aspectId) {
  const rows = state.analysis?.predictions || [];
  const branches = unique(
    rows
      .filter((row) => row.aspect_id === aspectId && row.sentiment === "negative" && row.venue)
      .map((row) => row.venue)
  );
  return branches;
}

function recommendationSampleBranch(aspectId, sampleQuote = "") {
  const rows = state.analysis?.predictions || [];
  const exact = rows.find((row) =>
    row.aspect_id === aspectId &&
    row.sentiment === "negative" &&
    row.venue &&
    sampleQuote &&
    String(row.original_review) === String(sampleQuote)
  );
  if (exact?.venue) return exact.venue;
  return rows.find((row) => row.aspect_id === aspectId && row.sentiment === "negative" && row.venue)?.venue || "";
}

function columnLabel(column) {
  return COLUMN_LABELS[state.language]?.[column] || COLUMN_LABELS.en[column] || column;
}

function fmt(value, digits = 1) {
  if (value === null || value === undefined || value === "" || Number.isNaN(Number(value))) return "N/A";
  return Number(value).toFixed(digits);
}

function pct(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "N/A";
  return `${(Number(value) * 100).toFixed(1)}%`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCell(value, column = "", row = {}) {
  if (column === "aspect_name" || column === "most_problematic_aspect" || column === "strongest_aspect") return aspectDisplay(value);
  if (["detected_aspects", "negative_aspects", "positive_aspects", "aspect_sentiments"].includes(column)) return localizeAspectList(value);
  if (column === "sentiment" || column === "dominant_sentiment") return sentimentDisplay(value);
  if (column === "priority") return priorityDisplay(value);
  if (column === "sqi_status" || column === "status") return sqiStatusDisplay(value);
  if (column === "recommendation") return localizedRecommendation(row.aspect_id, value);
  if (column === "response_template") return localizedResponseTemplate(row.aspect_id, value);
  if (column === "why_it_matters") return localizedWhyItMatters(row.aspect_id, row.aspect_name);
  if (column === "branch_names") return recommendationBranchNames(row.aspect_id).join(", ");
  if (typeof value === "number" && column.includes("share")) return pct(value);
  if (typeof value === "number" && column.toLowerCase().includes("sqi")) return fmt(value, 1);
  if (typeof value === "number" && column.toLowerCase().includes("confidence")) return fmt(value, 3);
  if (typeof value === "number" && column.toLowerCase().includes("rating")) return fmt(value, 2);
  if (typeof value === "number") return Number.isInteger(value) ? value : value.toFixed(3);
  if (typeof value === "boolean") return value ? u("yes") : u("no");
  return value ?? "";
}

function currentTextColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
}

function mutedColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--muted").trim();
}

function panelColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--panel-solid").trim();
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("absa-theme", theme);
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  [
    "appEyebrow", "appTitle", "appSubtitle", "controlsTitle", "modelLabel", "thresholdLabel",
    "weightsTitle", "singleTitle", "uploadEyebrow", "uploadTitle", "uploadSubtitle",
    "manualColumnText", "emptyTitle", "emptySubtitle",
  ].forEach((id) => {
    const el = $(id);
    if (el) el.textContent = t(id);
  });
  document.querySelectorAll("[data-i18n-key]").forEach((el) => {
    if (el.classList.contains("nav-item")) {
      const icon = el.querySelector(".nav-icon")?.outerHTML || "";
      el.innerHTML = `${icon}${escapeHtml(t(el.dataset.i18nKey))}`;
    } else {
      el.textContent = t(el.dataset.i18nKey);
    }
  });
  $("themeToggle").textContent = t("theme");
  $("analyzeFileBtn").textContent = t("runAnalysis");
  $("clearBtn").textContent = t("clear");
  $("singleAnalyzeBtn").textContent = t("analyzeReview");
  $("singleRating").placeholder = state.language === "en" ? "Optional star rating" : state.language === "ru" ? "Рейтинг, если есть" : "Рейтинг болса";
  if (state.health) updateHealthBadge(state.health);
  if (state.analysis) renderAll();
}

function getWeights() {
  const weights = {};
  document.querySelectorAll("[data-weight-name]").forEach((input) => {
    weights[input.dataset.weightName] = Number(input.value);
  });
  return weights;
}

function renderWeights() {
  const box = $("weightsContainer");
  box.innerHTML = Object.entries(DEFAULT_WEIGHTS).map(([name, value]) => {
    const safeId = name.replaceAll(" ", "-").replaceAll("/", "-");
    return `
      <div class="weight-control">
        <label><span>${name}</span><span id="weight-${safeId}" class="control-value">${value.toFixed(2)}</span></label>
        <input type="range" min="0" max="0.5" step="0.01" value="${value}" data-weight-name="${name}">
      </div>
    `;
  }).join("");
  box.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      const safeId = input.dataset.weightName.replaceAll(" ", "-").replaceAll("/", "-");
      const span = $(`weight-${safeId}`);
      if (span) span.textContent = Number(input.value).toFixed(2);
      if (state.analysis) renderCurrentTab();
    });
  });
}

function setLoading(isLoading, message = t("analyzing")) {
  $("loadingBox").classList.toggle("hidden", !isLoading);
  $("loadingText").textContent = message;
}

function showError(message) {
  const box = $("errorBox");
  box.textContent = typeof message === "string" ? message : JSON.stringify(message);
  box.classList.remove("hidden");
}

function clearError() {
  $("errorBox").classList.add("hidden");
  $("errorBox").textContent = "";
}

function updateHealthBadge(data) {
  const badge = $("healthBadge");
  if (badge) badge.textContent = `${t("backendOk")} - ${data.device}`;
}

async function checkHealth() {
  try {
    const response = await fetch("/health");
    const data = await response.json();
    state.health = data;
    updateHealthBadge(data);
  } catch {
    const badge = $("healthBadge");
    if (badge) badge.textContent = t("backendUnavailable");
  }
}

async function analyzeSingle() {
  clearError();
  const text = $("singleText").value.trim();
  if (!text) return;
  $("singleResult").innerHTML = `<p class="muted">${escapeHtml(t("analyzingShort"))}</p>`;
  const payload = {
    text,
    star_rating: $("singleRating").value ? Number($("singleRating").value) : null,
    model_name: $("modelSelect").value,
    aspect_threshold: Number($("thresholdInput").value),
  };
  try {
    const response = await fetch("/api/analyze-single", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Single review analysis failed");
    $("singleResult").innerHTML = `
      <div class="review-meta">${data.predictions.map((p) => `<span class="aspect-pill">${p.aspect_id} · ${escapeHtml(aspectDisplay(p.aspect_name))}</span>`).join("")}</div>
      <p><strong>${escapeHtml(u("tendency"))}:</strong> ${escapeHtml(sentimentDisplay(data.summary.overall_tendency))}</p>
      <p class="muted">${escapeHtml(data.summary.business_insight)}</p>
      ${tableHtml(data.predictions, ["aspect_id", "aspect_name", "aspect_confidence", "sentiment", "sentiment_confidence", "low_confidence_flag"])}
    `;
  } catch (error) {
    $("singleResult").innerHTML = `<p class="error-box">${escapeHtml(error.message)}</p>`;
  }
}

async function analyzeFile() {
  clearError();
  const file = $("fileInput").files[0] || state.currentFile;
  if (!file) {
    showError(t("missingFile"));
    return;
  }

  state.currentFile = file;
  const form = new FormData();
  form.append("file", file);
  form.append("model_name", $("modelSelect").value);
  form.append("aspect_threshold", $("thresholdInput").value);
  form.append("sqi_weights", JSON.stringify(getWeights()));
  if (state.manualTextColumn) form.append("text_column", state.manualTextColumn);

  setLoading(true);
  $("analyzeFileBtn").disabled = true;
  try {
    const response = await fetch("/api/analyze-file", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok) {
      if (data.error_code === "missing_text_column" || data.detail?.columns) {
        const columns = data.columns || data.detail.columns || [];
        renderManualColumnSelect(columns);
        throw new Error(data.message || data.detail.message || "Select the review text column manually.");
      }
      throw new Error(typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail || data));
    }
    state.analysis = data;
    state.reviewPage = 1;
    $("manualColumnBox").classList.add("hidden");
    renderColumnPreview(data.meta?.detected_columns || {});
    setActiveTab("performance", { instant: true });
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
    $("analyzeFileBtn").disabled = false;
  }
}

function renderColumnPreview(columns) {
  const box = $("uploadColumnPreview");
  if (!box) return;
  const entries = Object.entries(columns).filter(([, value]) => value);
  if (!entries.length) {
    box.classList.add("hidden");
    box.innerHTML = "";
    return;
  }
  box.innerHTML = entries.map(([key, value]) => `<span>${escapeHtml(key)}: ${escapeHtml(value)}</span>`).join("");
  box.classList.remove("hidden");
}

function renderManualColumnSelect(columns) {
  const box = $("manualColumnBox");
  const select = $("manualTextColumn");
  select.innerHTML = columns.map((col) => `<option>${escapeHtml(col)}</option>`).join("");
  select.onchange = () => { state.manualTextColumn = select.value; };
  state.manualTextColumn = columns[0] || null;
  box.classList.remove("hidden");
}

function tableHtml(rows, columns) {
  if (!rows || !rows.length) return `<p class="muted">${t("noData")}</p>`;
  return `<div class="table-wrap"><table><thead><tr>${columns.map((c) => `<th>${escapeHtml(columnLabel(c))}</th>`).join("")}</tr></thead><tbody>
    ${rows.map((row) => `<tr>${columns.map((c) => `<td>${formatCellHtml(row[c], c, row)}</td>`).join("")}</tr>`).join("")}
  </tbody></table></div>`;
}

function formatCellHtml(value, column = "", row = {}) {
  const text = escapeHtml(formatCell(value, column, row));
  if (column === "sentiment" || column === "dominant_sentiment") {
    return `<span class="badge ${String(value).toLowerCase()}">${text}</span>`;
  }
  if (column === "priority") {
    const tone = String(value) === "Critical" || String(value) === "Important" ? "negative" : "neutral";
    return `<span class="badge ${tone}">${text}</span>`;
  }
  if (column === "trend") {
    const tone = String(value) === "Risk" ? "negative" : String(value) === "Improving" ? "positive" : "neutral";
    return `<span class="badge ${tone}">${text}</span>`;
  }
  if (column === "aspect_name" || column === "most_problematic_aspect" || column === "strongest_aspect") {
    return `<span class="aspect-pill">${text}</span>`;
  }
  if (typeof value === "boolean") {
    return `<span class="badge ${value ? "neutral" : "positive"}">${text}</span>`;
  }
  return text;
}

function kpiHtml(label, value, sub = "", tone = "") {
  return `<div class="kpi-card ${tone}"><span>${label}</span><strong>${value}</strong>${sub ? `<p class="muted">${sub}</p>` : ""}</div>`;
}

function featureCard(title, text) {
  return `<div class="feature-card"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span></div>`;
}

function metricBadge(text, tone = "") {
  return `<span class="metric-badge ${tone}">${escapeHtml(text)}</span>`;
}

function kpiBlock(label, value, badge, description, tone = "") {
  return `<div class="kpi-block">
    <span>${escapeHtml(label)}</span>
    <strong class="kpi-value" data-counter="${escapeHtml(String(value).replace(/[^0-9.-]/g, ""))}">${escapeHtml(String(value))}</strong>
    ${badge ? metricBadge(badge, tone) : ""}
    ${description ? `<p>${escapeHtml(description)}</p>` : ""}
  </div>`;
}

function sqiTone(score) {
  const value = Number(score);
  if (Number.isNaN(value)) return "neutral";
  if (value >= 80) return "positive";
  if (value >= 60) return "neutral";
  return "negative";
}

function countProblemAreas() {
  return (state.analysis?.problem_areas || []).filter((item) => Number(item.negative_share || 0) > 0).length;
}

function exportPanelHtml() {
  return `<section id="exportPanel" class="export-panel">
    <div>
      <h2>${escapeHtml(u("exportFeature"))}</h2>
      <p>${escapeHtml(u("exportFeatureText"))}</p>
    </div>
    <div class="actions-row">
      <button class="primary-button" id="downloadCsvBtn">${escapeHtml(u("downloadPredictionsCsv"))}</button>
      <button class="ghost-button" id="downloadFilteredCsvOverviewBtn">${escapeHtml(u("downloadFilteredCsv"))}</button>
      <button class="primary-button" id="downloadExcelBtn">${escapeHtml(u("downloadExcelReport"))}</button>
    </div>
  </section>`;
}

function dashboardSelect(id, options, selected) {
  return `<select id="${id}">${options.map((option) => `<option value="${escapeHtml(option)}" ${String(option) === String(selected) ? "selected" : ""}>${escapeHtml(optionText(option))}</option>`).join("")}</select>`;
}

function branchCardsHtml(branches) {
  if (!branches.length) return "";
  return `<div class="branch-card-grid">${branches.slice(0, 6).map((branch) => {
    const sqi = Number(branch.overall_sqi || 0);
    const positive = Math.max(0.01, Number(branch.positive_share || 0));
    const negative = Math.max(0.01, Number(branch.negative_share || 0));
    const neutral = Math.max(0.01, 1 - positive - negative);
    return `<article class="branch-card">
      <h3>${escapeHtml(branch.branch_name || "Branch")}</h3>
      <p class="muted">${escapeHtml(branch.address || `${branch.review_count || 0} reviews`)}</p>
      <div class="review-meta">
        <span class="aspect-pill">SQI ${fmt(branch.overall_sqi, 1)}</span>
        <span class="aspect-pill">NPS ${branch.nps == null ? "N/A" : fmt(branch.nps, 0)}</span>
        <span class="aspect-pill">${branch.review_count || 0} reviews</span>
      </div>
      <div class="progress-bar"><span style="width:${Math.max(3, Math.min(100, sqi))}%"></span></div>
      <p><strong>${escapeHtml(u("mainProblem"))}:</strong> ${escapeHtml(aspectDisplay(branch.most_problematic_aspect || "N/A"))}</p>
      <p><strong>${escapeHtml(u("strongestAspect"))}:</strong> ${escapeHtml(aspectDisplay(branch.strongest_aspect || "N/A"))}</p>
      <div class="sentiment-strip" style="--positive:${positive}fr; --neutral:${neutral}fr; --negative:${negative}fr;"><span></span><span></span><span></span></div>
    </article>`;
  }).join("")}</div>`;
}

function problemStrengthCardsHtml(problems, strengths) {
  const problemHtml = problems.slice(0, 3).map((item) => `<div class="problem-card">
    <div class="review-meta">
      <span class="badge negative">${escapeHtml(priorityDisplay(item.priority))}</span>
      <span class="aspect-pill">${escapeHtml(aspectDisplay(item.aspect_name))}</span>
      <span class="badge negative">${pct(item.negative_share)}</span>
    </div>
    <p><strong>${escapeHtml(u("exampleQuote"))}:</strong> ${escapeHtml(item.sample_quote || "N/A")}</p>
    <p class="muted">${escapeHtml(localizedRecommendation(item.aspect_id, item.recommendation))}</p>
  </div>`).join("") || `<p class="muted">${escapeHtml(u("noUrgentProblems"))}</p>`;

  const strengthsHtml = strengths.slice(0, 3).map((item) => `<div class="strength-card">
    <div class="review-meta">
      <span class="badge positive">${pct(item.positive_share)}</span>
      <span class="aspect-pill">${escapeHtml(aspectDisplay(item.aspect_name))}</span>
    </div>
    <p><strong>${escapeHtml(u("exampleQuote"))}:</strong> ${escapeHtml(item.sample_quote || "N/A")}</p>
    <p class="muted">This aspect helps protect repeat visits and brand trust.</p>
  </div>`).join("") || `<p class="muted">${t("noData")}</p>`;

  return `<div class="problem-strength-grid">
    <section class="dashboard-card">
      <h2>${escapeHtml(u("problematicAspects"))}</h2>
      ${problemHtml}
    </section>
    <section class="dashboard-card">
      <h2>${escapeHtml(u("positiveStrengths"))}</h2>
      ${strengthsHtml}
    </section>
  </div>`;
}

function animateCounters() {
  document.querySelectorAll("[data-counter]").forEach((node) => {
    const target = Number(node.dataset.counter);
    if (!Number.isFinite(target)) return;
    const original = node.textContent || "";
    const suffix = original.includes("%") ? "%" : "";
    const decimals = original.includes(".") ? 1 : 0;
    const start = performance.now();
    const duration = 650;
    const render = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(render);
      else node.textContent = original;
    };
    requestAnimationFrame(render);
  });
}

function renderAll() {
  renderCurrentTab();
}

function renderCurrentTab() {
  if (!state.analysis || !ANALYSIS_TABS.has(state.selectedTab)) return;
  ({
    overview: renderOverview,
    performance: renderPerformance,
    trends: renderTrends,
    aspects: renderAspects,
    praise: renderPraise,
    problems: renderProblems,
    branches: renderBranches,
    reviews: renderReviews,
    actions: renderActions,
    branchAnalysis: renderBranchAnalysis,
    nps: renderNps,
    export: renderExport,
  }[state.selectedTab] || renderOverview)();
}

function renderOverview() {
  const area = $("overview");
  const summary = state.analysis.dashboard.summary;
  const problems = state.analysis.problem_areas || [];
  const strengths = state.analysis.strengths || [];
  const hasTrend = Boolean(state.analysis.time_trend?.length);
  const detected = state.analysis.meta?.detected_columns || {};
  const detectedColumnsText = Object.entries(detected).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(", ") || u("textOnly");

  area.innerHTML = `
    <section id="kpiStrip" class="kpi-strip">
      ${kpiBlock(u("totalReviews"), summary.total_reviews ?? 0, hasTrend ? "+ trend" : "live", "Reviews analyzed from uploaded data", "positive")}
      ${kpiBlock("SQI", `${fmt(summary.overall_sqi, 1)}%`, sqiStatusDisplay(state.analysis.sqi?.status || ""), "Weighted service quality index", sqiTone(summary.overall_sqi))}
      ${kpiBlock("NPS", summary.nps == null ? "N/A" : fmt(summary.nps, 0), summary.nps >= 0 ? "healthy" : "risk", "Promoters minus detractors", summary.nps >= 0 ? "positive" : "negative")}
      ${kpiBlock(u("positiveShare"), pct(summary.positive_aspect_share), "strength", aspectDisplay(summary.strongest_aspect || "N/A"), "positive")}
      ${kpiBlock(u("negativeShare"), pct(summary.negative_aspect_share), "watch", aspectDisplay(summary.most_problematic_aspect || "N/A"), "negative")}
      ${kpiBlock("Problem Areas", countProblemAreas(), "priority", `${summary.total_aspect_mentions ?? 0} aspect mentions`, countProblemAreas() > 0 ? "neutral" : "positive")}
    </section>

    <section class="dashboard-card">
      <div class="section-title compact-title">
        <div>
          <h2>${escapeHtml(u("managerViewTitle"))}</h2>
          <p class="muted">${escapeHtml(u("managerViewSubtitle", { model: state.analysis.meta?.model_name || $("modelSelect").value, reviews: summary.total_reviews ?? 0, columns: detectedColumnsText }))}</p>
        </div>
      </div>
      <div class="dashboard-grid overview-summary-grid">
        <article class="summary-tile">
          <span>${escapeHtml(u("aspectMentions"))}</span>
          <strong>${escapeHtml(summary.total_aspect_mentions ?? 0)}</strong>
          <p>${escapeHtml(u("aspectClassificationResults"))}</p>
        </article>
        <article class="summary-tile">
          <span>${escapeHtml(u("averageRating"))}</span>
          <strong>${escapeHtml(fmt(summary.average_rating, 2))}</strong>
          <p>${escapeHtml(u("ratingDistribution"))}</p>
        </article>
        <article class="summary-tile">
          <span>${escapeHtml(u("responseRate"))}</span>
          <strong>${escapeHtml(pct(summary.response_rate))}</strong>
          <p>Company response coverage</p>
        </article>
        <article class="summary-tile">
          <span>${escapeHtml(u("sentimentDistribution"))}</span>
          <strong>${escapeHtml(pct(summary.positive_aspect_share))}</strong>
          <p>${escapeHtml(sentimentDisplay("positive"))}</p>
        </article>
      </div>
    </section>

    ${problemStrengthCardsHtml(problems.slice(0, 3), strengths.slice(0, 3))}
  `;
  animateCounters();
}

function renderPerformance() {
  const summary = state.analysis.dashboard.summary;
  const aspectRows = state.analysis.aspect_analytics || [];
  const detected = state.analysis.meta?.detected_columns || {};
  const detectedColumnsText = Object.entries(detected).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(", ") || u("textOnly");
  const branches = unique((state.analysis.predictions || []).map((row) => row.venue).filter(Boolean));

  $("performance").innerHTML = `
    <section class="analytics-stage">
      <article id="aspectPerformanceCard" class="dashboard-card aspect-performance">
        <div class="chart-toolbar">
          <div>
            <h2>Aspect Performance</h2>
            <p class="muted">${escapeHtml(u("managerViewSubtitle", { model: state.analysis.meta?.model_name || $("modelSelect").value, reviews: summary.total_reviews ?? 0, columns: detectedColumnsText }))}</p>
          </div>
          <div class="chart-controls">
            ${dashboardSelect("trendMetricSelect", ["SQI", "Rating", "Positive", "Neutral", "Negative", "Reviews"], "SQI")}
            ${dashboardSelect("aspectFilter", ["All", ...aspectRows.map((row) => row.aspect_name)], "All")}
            ${dashboardSelect("branchFilter", ["All", ...branches], "All")}
            ${dashboardSelect("periodSelect", ["Daily", "Weekly", "Monthly"], "Monthly")}
          </div>
        </div>
        <div class="chart-legend">
          <span class="legend-dot" style="--dot:#2563EB">SQI trend</span>
          <span class="legend-dot" style="--dot:#22C55E">Positive</span>
          <span class="legend-dot" style="--dot:#EF4444">Negative</span>
        </div>
        <canvas id="performanceTrendChart" class="performance-canvas"></canvas>
      </article>

      <aside class="floating-sqi-card">
        <div class="card-header">
          <h2>Service Quality Index</h2>
          <span class="mini-badge">${escapeHtml(sqiStatusDisplay(state.analysis.sqi?.status || ""))}</span>
        </div>
        <div class="gauge-wrap">
          <canvas id="sqiGauge"></canvas>
          <div class="gauge-value">
            <strong>${fmt(summary.overall_sqi, 1)}%</strong>
            <span>${escapeHtml(sqiStatusDisplay(state.analysis.sqi?.status || ""))}</span>
          </div>
        </div>
        <p>Overall quality based on aspect-level sentiment confidence</p>
        <button id="viewSqiBtn" class="primary-button" type="button">View SQI Details</button>
        <div class="sqi-legend">
          <span class="legend-dot" style="--dot:#22C55E">${escapeHtml(sentimentDisplay("positive"))}</span>
          <span class="legend-dot" style="--dot:#EAB308">${escapeHtml(sentimentDisplay("neutral"))}</span>
          <span class="legend-dot" style="--dot:#EF4444">${escapeHtml(sentimentDisplay("negative"))}</span>
        </div>
      </aside>
    </section>
  `;
  $("viewSqiBtn").onclick = () => setActiveTab("branchAnalysis");
  ["trendMetricSelect", "aspectFilter", "branchFilter", "periodSelect"].forEach((id) => {
    const el = $(id);
    if (el) el.onchange = redrawPerformanceChart;
  });
  redrawPerformanceChart();
  drawGaugeChart("sqiGauge", summary.overall_sqi || 0);
}

function renderTrends() {
  const aspectRows = state.analysis.aspect_analytics || [];
  $("trends").innerHTML = `
    <div class="section-title">
      <h2>${escapeHtml(u("coreAnalytics"))}</h2>
      <p class="muted">${escapeHtml(u("coreAnalyticsText"))}</p>
    </div>
    <div id="trendSection" class="chart-grid">
      ${chartCard("aspectDistribution", u("aspectDistribution"))}
      ${chartCard("sentimentDistribution", u("sentimentDistribution"))}
      ${chartCard("sentimentByAspectOverview", u("sentimentByAspect"))}
      ${chartCard("sqiByAspectOverview", u("sqiByAspect"))}
      ${chartCard("negativeShareOverview", u("negativeShareByAspect"))}
      ${chartCard("positiveShareOverview", u("positiveShareByAspect"))}
      ${chartCard("ratingDistribution", u("ratingDistribution"))}
      ${chartCard("ratingTrend", u("ratingTrend"))}
      ${chartCard("venueComparisonOverview", u("sqiByBranch"))}
      ${chartCard("venueNegativeOverview", u("negativeShareByBranch"))}
    </div>
  `;
  drawBarChart("aspectDistribution", state.analysis.dashboard.aspect_distribution || [], { label: "aspect_name", value: "count", color: "#3b82f6" });
  drawDonutChart("sentimentDistribution", state.analysis.dashboard.sentiment_distribution || [], { label: "sentiment", value: "count" });
  drawStackedBarChart("sentimentByAspectOverview", pivotSentimentByAspect(state.analysis.dashboard.sentiment_by_aspect || []), { label: "aspect_name" });
  drawBarChart("sqiByAspectOverview", state.analysis.sqi.by_aspect || [], { label: "aspect_name", value: "sqi", color: "#3b82f6", maxY: 100 });
  drawBarChart("negativeShareOverview", aspectRows, { label: "aspect_name", value: "negative_share", color: "#ef4444", maxY: 1, percent: true });
  drawBarChart("positiveShareOverview", aspectRows, { label: "aspect_name", value: "positive_share", color: "#22c55e", maxY: 1, percent: true });
  drawHorizontalBarChart("ratingDistribution", state.analysis.dashboard.rating_distribution || [], { label: "rating", value: "count", color: "#3b82f6" });
  drawLineChart("ratingTrend", state.analysis.dashboard.rating_trend || [], { x: "month", y: "average_rating", color: "#3b82f6", maxY: 5 });
  drawHorizontalBarChart("venueComparisonOverview", state.analysis.venue_analytics || [], { label: "branch_name", value: "overall_sqi", color: "#3b82f6", maxY: 100 });
  drawHorizontalBarChart("venueNegativeOverview", state.analysis.venue_analytics || [], { label: "branch_name", value: "negative_share", color: "#ef4444", maxY: 1, percent: true });
}

function renderAspects() {
  const aspectRows = state.analysis.aspect_analytics || [];
  const aspectTableRows = aspectRows.map((row) => ({
    ...row,
    trend: Number(row.negative_share || 0) >= 0.25 ? "Risk" : Number(row.positive_share || 0) >= 0.60 ? "Improving" : "Stable",
  }));
  $("aspects").innerHTML = `
    <section class="dashboard-card">
      <div class="section-title compact-title">
        <div>
          <h2>${escapeHtml(u("aspectClassificationResults"))}</h2>
          <p class="muted">Aspect mentions, sentiment mix, confidence, and SQI by managerial service category.</p>
        </div>
      </div>
      ${tableHtml(aspectTableRows, ["aspect_name", "total_mentions", "positive_share", "neutral_share", "negative_share", "aspect_sqi", "average_aspect_confidence", "trend"])}
    </section>
    <div class="grid-2">
      ${chartCard("aspectSqiPage", u("sqiByAspect"))}
      ${chartCard("aspectSentimentPage", u("sentimentByAspect"))}
    </div>
  `;
  drawBarChart("aspectSqiPage", state.analysis.sqi.by_aspect || [], { label: "aspect_name", value: "sqi", color: "#3b82f6", maxY: 100 });
  drawStackedBarChart("aspectSentimentPage", pivotSentimentByAspect(state.analysis.dashboard.sentiment_by_aspect || []), { label: "aspect_name" });
}

function renderNps() {
  const summary = state.analysis.dashboard.summary;
  $("nps").innerHTML = `
    <section class="kpi-grid">
      ${kpiHtml("NPS", summary.nps == null ? "N/A" : fmt(summary.nps, 0), "Promoters minus detractors", summary.nps >= 0 ? "success" : "danger")}
      ${kpiHtml(u("positiveShare"), pct(summary.positive_aspect_share), aspectDisplay(summary.strongest_aspect || "N/A"), "success")}
      ${kpiHtml("Neutral share", pct(summary.neutral_aspect_share), sentimentDisplay("neutral"))}
      ${kpiHtml(u("negativeShare"), pct(summary.negative_aspect_share), aspectDisplay(summary.most_problematic_aspect || "N/A"), "danger")}
    </section>
    <div class="grid-2">
      ${chartCard("npsSentimentDistribution", u("sentimentDistribution"))}
      ${chartCard("npsRatingDistribution", u("ratingDistribution"))}
    </div>
    <section class="dashboard-card">
      <h2>${escapeHtml(u("reviewLevelTable"))}</h2>
      ${tableHtml((state.analysis.review_level || []).slice(0, 10), ["review_id", "detected_aspects", "dominant_sentiment", "negative_aspects", "positive_aspects", "average_aspect_confidence"])}
    </section>
  `;
  drawDonutChart("npsSentimentDistribution", state.analysis.dashboard.sentiment_distribution || [], { label: "sentiment", value: "count" });
  drawHorizontalBarChart("npsRatingDistribution", state.analysis.dashboard.rating_distribution || [], { label: "rating", value: "count", color: "#3b82f6" });
}

function renderExport() {
  $("export").innerHTML = `
    ${exportPanelHtml()}
    <section class="dashboard-card">
      <h2>${escapeHtml(u("reviewLevelTable"))}</h2>
      ${tableHtml((state.analysis.predictions || []).slice(0, 12), ["review_id", "aspect_name", "sentiment", "aspect_confidence", "sentiment_confidence", "venue", "star_rating"])}
    </section>
  `;
  $("downloadCsvBtn").onclick = downloadCsv;
  $("downloadExcelBtn").onclick = downloadExcel;
  $("downloadFilteredCsvOverviewBtn").onclick = () => downloadRowsCsv(state.analysis?.predictions || [], "absa_filtered_predictions.csv");
}

function redrawPerformanceChart() {
  if (!state.analysis) return;
  const metric = $("trendMetricSelect")?.value || "SQI";
  const filteredTrend = buildFilteredTrend();
  const trend = filteredTrend.length ? filteredTrend : (state.analysis.time_trend || []);
  const ratingTrend = filteredTrend.length ? filteredTrend : (state.analysis.dashboard?.rating_trend || []);
  const config = {
    SQI: { data: trend, x: "month", y: "sqi", color: "#2563EB", maxY: 100 },
    Rating: { data: ratingTrend, x: "month", y: "average_rating", color: "#2563EB", maxY: 5 },
    Positive: { data: trend, x: "month", y: "positive_share", color: "#22C55E", maxY: 1, percent: true },
    Neutral: { data: trend, x: "month", y: "neutral_share", color: "#EAB308", maxY: 1, percent: true },
    Negative: { data: trend, x: "month", y: "negative_share", color: "#EF4444", maxY: 1, percent: true },
    Reviews: { data: trend.length ? trend : ratingTrend, x: "month", y: "review_count", color: "#2563EB" },
  }[metric];
  drawLineChart("performanceTrendChart", config.data || [], config);
}

function buildFilteredTrend() {
  const rows = state.analysis?.predictions || [];
  if (!rows.length) return [];
  const aspect = $("aspectFilter")?.value || "All";
  const branch = $("branchFilter")?.value || "All";
  const shouldFilter = aspect !== "All" || branch !== "All";
  if (!shouldFilter && (state.analysis.time_trend || []).length) return [];
  let filtered = rows;
  if (aspect !== "All") filtered = filtered.filter((row) => row.aspect_name === aspect);
  if (branch !== "All") filtered = filtered.filter((row) => String(row.venue) === String(branch));
  const groups = {};
  filtered.forEach((row) => {
    const rawDate = row.date || row.date_parsed || "";
    const key = rawDate ? String(rawDate).slice(0, 7) : "Uploaded";
    groups[key] ||= [];
    groups[key].push(row);
  });
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).map(([month, group]) => {
    const reviewIds = unique(group.map((row) => row.review_id));
    const sentiments = { positive: 0, neutral: 0, negative: 0 };
    group.forEach((row) => { sentiments[row.sentiment] = (sentiments[row.sentiment] || 0) + 1; });
    const total = group.length || 1;
    const ratings = Object.values(group.reduce((map, row) => {
      if (row.star_rating != null && map[row.review_id] == null) map[row.review_id] = Number(row.star_rating);
      return map;
    }, {})).filter((value) => Number.isFinite(value));
    const sqiValues = group.map((row) => ({ positive: 100, neutral: 60, negative: 20 }[row.sentiment] || 60) * (Number(row.sentiment_confidence) || 0));
    return {
      month,
      review_count: reviewIds.length,
      average_rating: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null,
      sqi: sqiValues.length ? sqiValues.reduce((a, b) => a + b, 0) / sqiValues.length : null,
      positive_share: sentiments.positive / total,
      neutral_share: sentiments.neutral / total,
      negative_share: sentiments.negative / total,
    };
  });
}

function renderPraise() {
  const positives = state.analysis.strengths || [];
  const quotes = state.analysis.predictions.filter((p) => p.sentiment === "positive").slice(0, 10);
  $("praise").innerHTML = `
    <div class="section-title">
      <h2>${escapeHtml(u("positiveStrengths"))}</h2>
      <p class="muted">${escapeHtml(u("positiveStrengthsText"))}</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <h2>${escapeHtml(u("positiveRanked"))}</h2>
        ${tableHtml(positives, ["aspect_name", "positive_share", "positive_count", "total_mentions", "sample_quote"])}
      </div>
      <div class="card">
        <h2>${escapeHtml(u("positiveKeywordCloud"))}</h2>
        <div class="word-cloud">${keywordCloudHtml(state.analysis.keyword_clouds?.positive || [])}</div>
      </div>
      ${chartCard("positiveShareChart", u("positiveShareByAspect"))}
      ${chartCard("positiveCountChart", u("positiveMentionsByAspect"))}
    </div>
    <div class="card">
      <h2>${escapeHtml(u("positiveQuotes"))}</h2>
      ${reviewQuoteHtml(quotes)}
    </div>
  `;
  drawBarChart("positiveShareChart", state.analysis.aspect_analytics || [], { label: "aspect_name", value: "positive_share", color: "#22c55e", maxY: 1, percent: true });
  drawBarChart("positiveCountChart", positives, { label: "aspect_name", value: "positive_count", color: "#22c55e" });
}

function renderProblems() {
  const problems = state.analysis.problem_areas || [];
  const quotes = state.analysis.predictions.filter((p) => p.sentiment === "negative").slice(0, 12);
  $("problems").innerHTML = `
    <div class="section-title">
      <h2>${escapeHtml(u("problematicAspects"))}</h2>
      <p class="muted">${escapeHtml(u("problematicAspectsText"))}</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <h2>${escapeHtml(u("negativeRanked"))}</h2>
        ${tableHtml(problems, ["aspect_name", "negative_share", "negative_count", "total_mentions", "priority", "recommendation"])}
      </div>
      <div class="card">
        <h2>${escapeHtml(u("negativeKeywordCloud"))}</h2>
        <div class="word-cloud negative-cloud">${keywordCloudHtml(state.analysis.keyword_clouds?.negative || [])}</div>
      </div>
      ${chartCard("problemNegativeShare", u("negativeShareByAspect"))}
      ${chartCard("problemNegativeCount", u("negativeMentionsByAspect"))}
    </div>
    <div class="card">
      <h2>${escapeHtml(u("negativeQuotes"))}</h2>
      ${reviewQuoteHtml(quotes)}
    </div>
  `;
  drawBarChart("problemNegativeShare", state.analysis.aspect_analytics || [], { label: "aspect_name", value: "negative_share", color: "#ef4444", maxY: 1, percent: true });
  drawBarChart("problemNegativeCount", problems, { label: "aspect_name", value: "negative_count", color: "#ef4444" });
}

function renderBranches() {
  const branches = state.analysis.venue_analytics || [];
  if (!branches.length) {
    $("branches").innerHTML = `<section class="card empty-state"><h2>${escapeHtml(u("branchUnavailableTitle"))}</h2><p>${escapeHtml(u("branchUnavailableText"))}</p></section>`;
    return;
  }
  const f = state.branchFilters;
  const filtered = branches.filter((b) =>
    (b.average_rating == null || b.average_rating >= f.ratingMin) &&
    (b.overall_sqi == null || b.overall_sqi >= f.sqiMin) &&
    (b.negative_share == null || b.negative_share <= f.negMax) &&
    (b.review_count || 0) >= f.minReviews
  );
  $("branches").innerHTML = `
    <div class="section-title">
      <h2>${escapeHtml(u("branchAnalyticsTitle"))}</h2>
      <p class="muted">${escapeHtml(u("branchAnalyticsText"))}</p>
    </div>
    <div class="grid-2">
      ${chartCard("branchSqiChart", u("sqiByBranch"))}
      ${chartCard("branchNegativeChart", u("negativeShareByBranch"))}
    </div>
    <div class="card">
      <h2>${escapeHtml(u("sortableBranchTable"))}</h2>
      <div class="filters">
        ${numberInput(u("minRating"), "branchRatingMin", f.ratingMin, 0, 5, 0.5)}
        ${numberInput(u("sqiMin"), "branchSqiMin", f.sqiMin, 0, 100, 5)}
        ${numberInput(u("negativeShare"), "branchNegMax", f.negMax, 0, 1, 0.05)}
        ${numberInput(u("totalReviews"), "branchMinReviews", f.minReviews, 0, 1000, 1)}
      </div>
      ${tableHtml(filtered, ["branch_name", "address", "average_rating", "review_count", "aspect_mentions", "overall_sqi", "negative_share", "positive_share", "response_rate", "nps", "most_problematic_aspect", "strongest_aspect"])}
    </div>
  `;
  bindBranchFilters();
  drawHorizontalBarChart("branchSqiChart", filtered, { label: "branch_name", value: "overall_sqi", color: "#3b82f6", maxY: 100 });
  drawHorizontalBarChart("branchNegativeChart", filtered, { label: "branch_name", value: "negative_share", color: "#ef4444", maxY: 1, percent: true });
}

function renderReviews() {
  const rows = filteredReviews();
  const grouped = groupByReview(rows);
  const totalPages = Math.max(1, Math.ceil(grouped.length / 20));
  state.reviewPage = Math.min(state.reviewPage, totalPages);
  const pageItems = grouped.slice((state.reviewPage - 1) * 20, state.reviewPage * 20);
  $("reviews").innerHTML = `
    <div class="section-title">
      <h2>${escapeHtml(u("reviewExplorerTitle"))}</h2>
      <p class="muted">${escapeHtml(u("reviewExplorerText"))}</p>
    </div>
    <div class="card">
      <div class="filters">
        <input id="reviewSearch" placeholder="${escapeHtml(u("searchReview"))}" value="${escapeHtml($("reviewSearch")?.value || "")}">
        <select id="reviewAspect">${optionList(["All", ...unique(state.analysis.predictions.map((p) => p.aspect_name))], $("reviewAspect")?.value || "All")}</select>
        <select id="reviewSentiment">${optionList(["All", "positive", "neutral", "negative"], $("reviewSentiment")?.value || "All")}</select>
        <select id="reviewBranch">${optionList(["All", ...unique(state.analysis.predictions.map((p) => p.venue).filter(Boolean))], $("reviewBranch")?.value || "All")}</select>
        <input id="reviewRatingMin" type="number" min="0" max="5" step="0.5" placeholder="${escapeHtml(u("minRating"))}" value="${escapeHtml($("reviewRatingMin")?.value || "")}">
        <input id="reviewRatingMax" type="number" min="0" max="5" step="0.5" placeholder="${escapeHtml(u("maxRating"))}" value="${escapeHtml($("reviewRatingMax")?.value || "")}">
        <select id="reviewMode">${optionList(["cards", "review table", "aspect table"], state.reviewMode)}</select>
        <label class="inline-check"><input id="reviewLowConfidence" type="checkbox" ${$("reviewLowConfidence")?.checked ? "checked" : ""}> ${escapeHtml(u("lowConfidenceOnly"))}</label>
      </div>
      <div class="actions-row">
        <button class="ghost-button" id="prevPage">${escapeHtml(u("previous"))}</button>
        <span>${escapeHtml(u("page"))} ${state.reviewPage} ${escapeHtml(u("of"))} ${totalPages}</span>
        <button class="ghost-button" id="nextPage">${escapeHtml(u("next"))}</button>
        <button class="primary-button" id="downloadFilteredCsvBtn">${escapeHtml(u("downloadFilteredCsv"))}</button>
      </div>
      <div id="reviewList">${reviewExplorerHtml(rows, pageItems)}</div>
    </div>
  `;
  bindReviewFilters();
  $("downloadFilteredCsvBtn").onclick = () => downloadRowsCsv(rows, "absa_filtered_predictions.csv");
}

function reviewExplorerHtml(rows, pageItems) {
  if (state.reviewMode === "aspect table") {
    return tableHtml(rows.slice(0, 400), ["review_id", "original_review", "star_rating", "venue", "date", "aspect_id", "aspect_name", "aspect_confidence", "sentiment", "sentiment_confidence", "low_confidence_flag"]);
  }
  if (state.reviewMode === "review table") {
    return tableHtml((state.analysis.review_level || []).slice(0, 400), ["review_id", "original_review", "star_rating", "venue", "date", "detected_aspects", "dominant_sentiment", "negative_aspects", "positive_aspects", "average_aspect_confidence"]);
  }
  return pageItems.map(reviewCardHtml).join("") || `<p class="muted">${t("noData")}</p>`;
}

function renderActions() {
  const recs = state.analysis.recommendations || [];
  $("actions").innerHTML = `
    <div class="section-title">
      <h2>${escapeHtml(u("whatToDoTitle"))}</h2>
      <p class="muted">${escapeHtml(u("whatToDoText"))}</p>
    </div>
    <div class="card action-list">
      ${recs.length ? recs.map((r) => {
        const sampleBranch = recommendationSampleBranch(r.aspect_id, r.sample_quote);
        const branches = recommendationBranchNames(r.aspect_id);
        const branchText = sampleBranch || branches.join(", ");
        return `
        <div class="action-card">
          <div class="review-meta">
            <span class="badge negative">${escapeHtml(priorityDisplay(r.priority))}</span>
            <span class="aspect-pill">${escapeHtml(aspectDisplay(r.aspect_name))}</span>
            ${branchText ? `<span class="aspect-pill">${escapeHtml(u("branch"))}: ${escapeHtml(branchText)}</span>` : ""}
          </div>
          <h3>${escapeHtml(aspectDisplay(r.aspect_name))}</h3>
          <p><strong>${escapeHtml(u("whyItMatters"))}:</strong> ${escapeHtml(localizedWhyItMatters(r.aspect_id, r.aspect_name))}</p>
          <p><strong>${escapeHtml(u("recommendedAction"))}:</strong> ${escapeHtml(localizedRecommendation(r.aspect_id, r.recommendation))}</p>
          <p><strong>${escapeHtml(u("exampleQuote"))}:</strong> ${escapeHtml(r.sample_quote || "N/A")}</p>
          ${sampleBranch ? `<p><strong>${escapeHtml(u("branch"))}:</strong> ${escapeHtml(sampleBranch)}</p>` : ""}
          <div class="response-template"><strong>${escapeHtml(u("suggestedResponse"))}:</strong><br>${escapeHtml(localizedResponseTemplate(r.aspect_id, r.response_template))}</div>
        </div>
      `;
      }).join("") : `<p class='muted'>${escapeHtml(u("noUrgentProblems"))}</p>`}
    </div>
  `;
}

function renderBranchAnalysis() {
  const branches = state.analysis.venue_analytics || [];
  if (!branches.length) {
    $("branchAnalysis").innerHTML = `<section class="card empty-state"><h2>${escapeHtml(u("branchRequiresTitle"))}</h2><p>${escapeHtml(u("branchRequiresText"))}</p></section>`;
    return;
  }
  const current = $("branchSelect")?.value || branches[0].branch_name;
  const branch = branches.find((b) => String(b.branch_name) === String(current)) || branches[0];
  const branchPredictions = state.analysis.predictions.filter((p) => String(p.venue) === String(branch.branch_name));
  const branchProblems = (state.analysis.problem_areas || []).filter((p) => branchPredictions.some((row) => row.aspect_id === p.aspect_id));
  const positive = branchPredictions.filter((p) => p.sentiment === "positive").slice(0, 5);
  const negative = branchPredictions.filter((p) => p.sentiment === "negative").slice(0, 5);
  $("branchAnalysis").innerHTML = `
    <div class="card">
      <label>${escapeHtml(u("branchSelect"))}</label>
      <select id="branchSelect">${branches.map((b) => `<option ${b.branch_name === branch.branch_name ? "selected" : ""}>${escapeHtml(b.branch_name)}</option>`).join("")}</select>
    </div>
    <div class="kpi-grid branch-kpi-grid">
      ${kpiHtml(u("averageRating"), fmt(branch.average_rating, 2))}
      ${kpiHtml(u("totalReviews"), branch.review_count)}
      ${kpiHtml("SQI", fmt(branch.overall_sqi, 1))}
      ${kpiHtml(u("negativeShare"), pct(branch.negative_share), "", "danger")}
      ${kpiHtml(u("strongestAspect"), aspectDisplay(branch.strongest_aspect || "N/A"), "", "success")}
      ${kpiHtml(u("weakestAspect"), aspectDisplay(branch.most_problematic_aspect || "N/A"), "", "danger")}
    </div>
    <div class="grid-2">
      ${chartCard("branchSentiment", u("sentimentByAspect"))}
      ${chartCard("branchSqi", u("sqiByAspect"))}
    </div>
    <div class="grid-2">
      <div class="card"><h2>${escapeHtml(u("positiveReviews"))}</h2>${reviewQuoteHtml(positive)}</div>
      <div class="card"><h2>${escapeHtml(u("negativeReviews"))}</h2>${reviewQuoteHtml(negative)}</div>
    </div>
    <div class="card">
      <h2>${escapeHtml(u("branchRecommendations"))}</h2>
      ${tableHtml(branchProblems.slice(0, 6), ["aspect_name", "negative_share", "negative_count", "priority", "branch_names", "recommendation", "response_template"])}
    </div>
  `;
  $("branchSelect").onchange = renderBranchAnalysis;
  drawStackedBarChart("branchSentiment", aggregateSentimentByAspect(branchPredictions), { label: "aspect_name" });
  drawBarChart("branchSqi", branchAspectSqi(branchPredictions), { label: "aspect_name", value: "sqi", color: "#3b82f6", maxY: 100 });
}

function chartCard(id, title) {
  return `<div class="card chart-card"><h2>${escapeHtml(title)}</h2><canvas id="${id}"></canvas></div>`;
}

function keywordCloudHtml(words) {
  if (!words.length) return `<p class="muted">${t("noData")}</p>`;
  const max = Math.max(...words.map((w) => w.count || 1), 1);
  return words.map((w) => {
    const size = 0.8 + ((w.count || 1) / max) * 1.35;
    return `<span style="font-size:${size.toFixed(2)}rem">${escapeHtml(w.keyword)}</span>`;
  }).join("");
}

function reviewQuoteHtml(rows) {
  if (!rows.length) return `<p class="muted">${t("noData")}</p>`;
  return rows.map((r) => `<div class="review-card">
    <p>${escapeHtml(r.original_review)}</p>
    <div class="review-meta">
      <span class="badge ${r.sentiment}">${escapeHtml(sentimentDisplay(r.sentiment))}</span>
      <span>${escapeHtml(aspectDisplay(r.aspect_name))}</span>
      <span>${escapeHtml(u("rating"))}: ${escapeHtml(r.star_rating ?? "N/A")}</span>
      <span>${escapeHtml(u("confidence"))}: ${fmt(r.sentiment_confidence, 2)}</span>
    </div>
  </div>`).join("");
}

function reviewCardHtml(group) {
  const first = group[0];
  return `<div class="review-card">
    <p>${escapeHtml(first.original_review)}</p>
    <div class="review-meta">
      <span>${escapeHtml(u("reviewId"))}: ${escapeHtml(first.review_id)}</span>
      <span>${escapeHtml(u("rating"))}: ${escapeHtml(first.star_rating ?? "N/A")}</span>
      <span>${escapeHtml(first.venue ?? "")}</span>
      <span>${escapeHtml(first.date ?? "")}</span>
      <span>${escapeHtml(first.platform ?? "")}</span>
    </div>
    <div class="review-meta">${group.map((p) => `<span class="aspect-pill">${escapeHtml(p.aspect_id)} · ${escapeHtml(aspectDisplay(p.aspect_name))} · ${fmt(p.aspect_confidence, 2)}</span><span class="badge ${p.sentiment}">${escapeHtml(sentimentDisplay(p.sentiment))} ${fmt(p.sentiment_confidence, 2)}</span>`).join("")}</div>
  </div>`;
}

function aggregateSentimentByAspect(rows) {
  const map = {};
  rows.forEach((r) => {
    map[r.aspect_name] ||= { aspect_name: r.aspect_name, positive: 0, neutral: 0, negative: 0 };
    map[r.aspect_name][r.sentiment] += 1;
  });
  return Object.values(map);
}

function pivotSentimentByAspect(rows) {
  const map = {};
  rows.forEach((r) => {
    map[r.aspect_name] ||= { aspect_name: r.aspect_name, positive: 0, neutral: 0, negative: 0 };
    map[r.aspect_name][r.sentiment] = (map[r.aspect_name][r.sentiment] || 0) + (r.count || 0);
  });
  return Object.values(map);
}

function branchAspectSqi(rows) {
  const map = {};
  rows.forEach((r) => {
    const score = ({ positive: 100, neutral: 60, negative: 20 }[r.sentiment] || 60) * (r.sentiment_confidence || 0);
    map[r.aspect_name] ||= [];
    map[r.aspect_name].push(score);
  });
  return Object.entries(map).map(([aspect_name, values]) => ({ aspect_name, sqi: values.reduce((a, b) => a + b, 0) / values.length }));
}

function filteredReviews() {
  let rows = [...state.analysis.predictions];
  const search = $("reviewSearch")?.value?.toLowerCase() || "";
  const aspect = $("reviewAspect")?.value || "All";
  const sentiment = $("reviewSentiment")?.value || "All";
  const branch = $("reviewBranch")?.value || "All";
  const minRating = $("reviewRatingMin")?.value === "" ? null : Number($("reviewRatingMin")?.value);
  const maxRating = $("reviewRatingMax")?.value === "" ? null : Number($("reviewRatingMax")?.value);
  const lowOnly = $("reviewLowConfidence")?.checked || false;
  if (search) rows = rows.filter((r) => String(r.original_review).toLowerCase().includes(search));
  if (aspect !== "All") rows = rows.filter((r) => r.aspect_name === aspect);
  if (sentiment !== "All") rows = rows.filter((r) => r.sentiment === sentiment);
  if (branch !== "All") rows = rows.filter((r) => String(r.venue) === String(branch));
  if (minRating !== null) rows = rows.filter((r) => Number(r.star_rating) >= minRating);
  if (maxRating !== null) rows = rows.filter((r) => Number(r.star_rating) <= maxRating);
  if (lowOnly) rows = rows.filter((r) => r.low_confidence_flag);
  return rows;
}

function groupByReview(rows) {
  const map = {};
  rows.forEach((row) => {
    map[row.review_id] ||= [];
    map[row.review_id].push(row);
  });
  return Object.values(map);
}

function unique(values) {
  return [...new Set(values.filter((v) => v !== null && v !== undefined && v !== ""))].sort();
}

function optionText(value) {
  if (value === "All") return u("all");
  if (value === "cards") return u("cards");
  if (value === "review table") return u("reviewTable");
  if (value === "aspect table") return u("aspectTable");
  if (["positive", "neutral", "negative", "mixed"].includes(String(value))) return sentimentDisplay(value);
  return aspectDisplay(value);
}

function optionList(options, selected) {
  return options.map((o) => `<option value="${escapeHtml(o)}" ${String(o) === String(selected) ? "selected" : ""}>${escapeHtml(optionText(o))}</option>`).join("");
}

function numberInput(label, id, value, min, max, step) {
  return `<label>${label}<input id="${id}" type="number" value="${value}" min="${min}" max="${max}" step="${step}"></label>`;
}

function chartLabel(row, key) {
  const value = row?.[key];
  if (key === "aspect_name") return aspectDisplay(value);
  if (key === "sentiment") return sentimentDisplay(value);
  if (key === "rating") return `${u("rating")} ${value}`;
  return String(value ?? "");
}

function truncateText(text, maxChars) {
  const clean = String(text ?? "");
  if (clean.length <= maxChars) return clean;
  return `${clean.slice(0, Math.max(1, maxChars - 1))}…`;
}

function formatChartValue(value, options = {}) {
  const number = Number(value) || 0;
  if (options.percent) return `${(number * 100).toFixed(0)}%`;
  if (number > 0 && number < 1) return number.toFixed(2);
  return number.toFixed(number >= 10 ? 0 : 1);
}

function bindBranchFilters() {
  const mapping = [
    ["branchRatingMin", "ratingMin"],
    ["branchSqiMin", "sqiMin"],
    ["branchNegMax", "negMax"],
    ["branchMinReviews", "minReviews"],
  ];
  mapping.forEach(([id, key]) => {
    const el = $(id);
    if (el) el.oninput = () => { state.branchFilters[key] = Number(el.value); renderBranches(); };
  });
}

function bindReviewFilters() {
  ["reviewSearch", "reviewAspect", "reviewSentiment", "reviewBranch", "reviewRatingMin", "reviewRatingMax", "reviewLowConfidence"].forEach((id) => {
    const el = $(id);
    if (el) el.oninput = () => { state.reviewPage = 1; renderReviews(); };
  });
  const mode = $("reviewMode");
  if (mode) mode.onchange = () => { state.reviewMode = mode.value; renderReviews(); };
  $("prevPage").onclick = () => { state.reviewPage = Math.max(1, state.reviewPage - 1); renderReviews(); };
  $("nextPage").onclick = () => { state.reviewPage += 1; renderReviews(); };
}

function downloadCsv() {
  downloadRowsCsv(state.analysis?.predictions || [], "absa_predictions.csv");
}

function downloadRowsCsv(rows, filename) {
  if (!rows.length) return;
  const columns = Object.keys(rows[0]);
  const csv = [columns.join(",")].concat(rows.map((row) => columns.map((c) => `"${String(row[c] ?? "").replaceAll('"', '""')}"`).join(","))).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}

async function downloadExcel() {
  if (!state.analysis) return;
  const response = await fetch("/api/export-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state.analysis),
  });
  const blob = await response.blob();
  downloadBlob(blob, "absa_manager_report.xlsx");
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function syncPageVisibility() {
  const isStandalone = STANDALONE_TABS.has(state.selectedTab);
  const isAnalysisTab = ANALYSIS_TABS.has(state.selectedTab);
  const canShowAnalysis = Boolean(state.analysis && isAnalysisTab);
  const workGrid = $("workGrid");
  const settingsPanel = $("settingsPanel");

  settingsPanel?.classList.toggle("hidden", state.selectedTab !== "settings");
  if (workGrid) {
    const showWorkGrid = state.selectedTab === "singleReview" || state.selectedTab === "upload";
    workGrid.classList.toggle("hidden", !showWorkGrid);
    workGrid.classList.toggle("single-review-only", state.selectedTab === "singleReview");
    workGrid.classList.toggle("upload-only", state.selectedTab === "upload");
  }

  $("dashboardArea")?.classList.toggle("hidden", !canShowAnalysis);
  $("emptyState")?.classList.toggle("hidden", Boolean(state.analysis) || isStandalone);

  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", canShowAnalysis && panel.id === state.selectedTab);
  });
}

function setActiveTab(tab, options = {}) {
  const nextTab = ANALYSIS_TABS.has(tab) || STANDALONE_TABS.has(tab) ? tab : "upload";
  state.selectedTab = nextTab;
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === nextTab);
  });
  syncPageVisibility();
  if (options.render !== false) renderCurrentTab();
  window.scrollTo({ top: 0, behavior: options.instant ? "auto" : "smooth" });
}

function setupTabs() {
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveTab(btn.dataset.tab);
    });
  });
}

function setupShellInteractions() {
  const sidebar = $("sidebar");
  const backdrop = $("sidebarBackdrop");
  const closeSidebar = () => {
    sidebar?.classList.remove("open");
    backdrop?.classList.remove("open");
  };
  $("sidebarToggle")?.addEventListener("click", () => {
    sidebar?.classList.add("open");
    backdrop?.classList.add("open");
  });
  backdrop?.addEventListener("click", closeSidebar);

  document.querySelectorAll(".nav-scroll").forEach((button) => {
    button.addEventListener("click", () => {
      closeSidebar();
      const target = $(button.dataset.scrollTarget);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", closeSidebar);
  });

  const fileInput = $("fileInput");
  const dropzone = $("uploadDropzone");
  const fileName = $("fileName");
  const updateFileName = () => {
    if (fileInput?.files?.[0] && fileName) fileName.textContent = fileInput.files[0].name;
  };
  fileInput?.addEventListener("change", updateFileName);
  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone?.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add("drag-over");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    dropzone?.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.remove("drag-over");
    });
  });
  dropzone?.addEventListener("drop", (event) => {
    const file = event.dataTransfer?.files?.[0];
    if (!file || !fileInput) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    fileInput.files = transfer.files;
    updateFileName();
  });

  $("topExportBtn")?.addEventListener("click", downloadExcel);
}

function canvasSetup(id) {
  const canvas = $(id);
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, rect.width * dpr);
  canvas.height = Math.max(1, rect.height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.font = "12px system-ui";
  ctx.fillStyle = currentTextColor();
  return { canvas, ctx, width: rect.width, height: rect.height };
}

function drawAxes(ctx, width, height, bottom = 38, left = 42) {
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--line");
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(left, 16);
  ctx.lineTo(left, height - bottom);
  ctx.lineTo(width - 12, height - bottom);
  ctx.stroke();
}

function drawYAxisTicks(ctx, width, height, max, bottom = 38, left = 42, options = {}) {
  const ticks = options.ticks || 4;
  const top = options.top || 18;
  const chartHeight = height - bottom - top;
  ctx.save();
  ctx.font = "11px system-ui";
  ctx.fillStyle = mutedColor();
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--line");
  ctx.lineWidth = 0.7;
  ctx.textAlign = "right";
  for (let i = 0; i <= ticks; i += 1) {
    const value = (max / ticks) * i;
    const y = height - bottom - (chartHeight * i / ticks);
    ctx.beginPath();
    ctx.moveTo(left - 4, y);
    ctx.lineTo(width - 12, y);
    ctx.stroke();
    ctx.fillText(formatChartValue(value, options), left - 8, y + 4);
  }
  ctx.restore();
}

function drawCategoryXAxisNumbers(ctx, data, left, slotWidth, barWidth, axisY) {
  ctx.save();
  ctx.font = "11px system-ui";
  ctx.fillStyle = mutedColor();
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--line");
  ctx.textAlign = "center";
  data.forEach((_, i) => {
    const x = left + i * slotWidth + barWidth / 2;
    ctx.beginPath();
    ctx.moveTo(x, axisY);
    ctx.lineTo(x, axisY + 5);
    ctx.stroke();
    ctx.fillText(String(i + 1), x, axisY + 17);
  });
  ctx.restore();
}

function drawXAxisTicks(ctx, width, height, max, labelWidth, options = {}) {
  const ticks = options.ticks || 4;
  const chartWidth = width - labelWidth - 78;
  const y = height - 12;
  ctx.save();
  ctx.font = "11px system-ui";
  ctx.fillStyle = mutedColor();
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--line");
  ctx.lineWidth = 0.7;
  ctx.textAlign = "center";
  for (let i = 0; i <= ticks; i += 1) {
    const value = (max / ticks) * i;
    const x = labelWidth + (chartWidth * i / ticks);
    ctx.beginPath();
    ctx.moveTo(x, 12);
    ctx.lineTo(x, height - 26);
    ctx.stroke();
    ctx.fillText(formatChartValue(value, options), x, y);
  }
  ctx.restore();
}

function drawBarChart(canvasId, data, options = {}) {
  const setup = canvasSetup(canvasId);
  if (!setup) return;
  const { ctx, width, height } = setup;
  if (!data.length) return drawEmpty(ctx, width, height);
  const bottom = 82;
  const left = 50;
  const max = options.maxY || Math.max(...data.map((d) => Number(d[options.value]) || 0), 1);
  drawAxes(ctx, width, height, bottom, left);
  drawYAxisTicks(ctx, width, height, max, bottom, left, options);
  const slotWidth = (width - left - 34) / data.length;
  const barWidth = slotWidth * 0.68;
  drawCategoryXAxisNumbers(ctx, data, left + 12, slotWidth, barWidth, height - bottom);
  data.forEach((d, i) => {
    const value = Number(d[options.value]) || 0;
    const x = left + 12 + i * slotWidth;
    const h = (height - bottom - 18) * value / max;
    ctx.fillStyle = options.color || "#3b82f6";
    roundRect(ctx, x, height - bottom - h, barWidth, h, 8);
    ctx.fill();
    ctx.fillStyle = mutedColor();
    ctx.textAlign = "center";
    ctx.fillText(formatChartValue(value, options), x + barWidth / 2, height - bottom - h - 6);
    ctx.save();
    ctx.translate(x + barWidth / 2, height - bottom + 34);
    ctx.rotate(-0.35);
    ctx.fillStyle = mutedColor();
    ctx.fillText(truncateText(chartLabel(d, options.label), Math.max(7, Math.floor(barWidth / 5))), 0, 0);
    ctx.restore();
  });
  ctx.textAlign = "left";
}

function drawHorizontalBarChart(canvasId, data, options = {}) {
  const setup = canvasSetup(canvasId);
  if (!setup) return;
  const { ctx, width, height } = setup;
  if (!data.length) return drawEmpty(ctx, width, height);
  const visible = data.slice(0, options.limit || 12);
  const max = options.maxY || Math.max(...visible.map((d) => Number(d[options.value]) || 0), 1);
  const labelWidth = Math.min(240, Math.max(118, width * 0.34));
  drawXAxisTicks(ctx, width, height, max, labelWidth, options);
  const rowH = Math.min(38, Math.max(24, (height - 42) / visible.length));
  visible.forEach((d, i) => {
    const y = 16 + i * rowH;
    const value = Number(d[options.value]) || 0;
    const w = Math.max(2, (width - labelWidth - 78) * value / max);
    ctx.fillStyle = currentTextColor();
    ctx.fillText(truncateText(chartLabel(d, options.label), Math.floor(labelWidth / 7)), 8, y + 16);
    ctx.fillStyle = options.color || "#3b82f6";
    roundRect(ctx, labelWidth, y, w, rowH * 0.58, 8);
    ctx.fill();
    ctx.fillStyle = mutedColor();
    ctx.fillText(formatChartValue(value, options), labelWidth + w + 8, y + 16);
  });
}

function drawLineChart(canvasId, data, options = {}) {
  const setup = canvasSetup(canvasId);
  if (!setup) return;
  const { canvas, ctx, width, height } = setup;
  const clean = data.filter((d) => d[options.y] !== null && d[options.y] !== undefined);
  if (!clean.length) return drawEmpty(ctx, width, height);
  const bottom = 44;
  const left = 50;
  const max = options.maxY || Math.max(...clean.map((d) => Number(d[options.y]) || 0), 1);
  const top = 22;
  const chartHeight = height - bottom - top;
  const chartWidth = width - left - 22;
  drawAxes(ctx, width, height, bottom, left);
  drawYAxisTicks(ctx, width, height, max, bottom, left, options);
  const points = clean.map((d, i) => {
    const x = left + i * (chartWidth / Math.max(1, clean.length - 1));
    const y = height - bottom - (Number(d[options.y]) / (max || 1)) * chartHeight;
    return { x, y, row: d, value: Number(d[options.y]) || 0 };
  });
  const gradient = ctx.createLinearGradient(0, top, 0, height - bottom);
  gradient.addColorStop(0, `${options.color || "#3b82f6"}26`);
  gradient.addColorStop(1, `${options.color || "#3b82f6"}00`);
  ctx.beginPath();
  points.forEach((point, i) => {
    if (i === 0) ctx.moveTo(point.x, point.y);
    else {
      const previous = points[i - 1];
      const midX = (previous.x + point.x) / 2;
      ctx.bezierCurveTo(midX, previous.y, midX, point.y, point.x, point.y);
    }
  });
  ctx.lineTo(points[points.length - 1].x, height - bottom);
  ctx.lineTo(points[0].x, height - bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = options.color || "#3b82f6";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  points.forEach((point, i) => {
    if (i === 0) ctx.moveTo(point.x, point.y);
    else {
      const previous = points[i - 1];
      const midX = (previous.x + point.x) / 2;
      ctx.bezierCurveTo(midX, previous.y, midX, point.y, point.x, point.y);
    }
  });
  ctx.stroke();
  points.forEach((point) => {
    ctx.fillStyle = options.color || "#3b82f6";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = panelColor();
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  clean.forEach((d, i) => {
    const point = points[i];
    ctx.fillStyle = mutedColor();
    ctx.fillText(String(d[options.x] ?? "").slice(-5), point.x - 13, height - 18);
  });
  bindChartTooltip(canvas, points, options);
}

function bindChartTooltip(canvas, points, options = {}) {
  const tooltip = $("chartTooltip");
  if (!tooltip) return;
  canvas.onmousemove = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const nearest = points.reduce((best, point) => {
      const distance = Math.hypot(point.x - x, point.y - y);
      return distance < best.distance ? { point, distance } : best;
    }, { point: null, distance: Infinity });
    if (!nearest.point || nearest.distance > 26) {
      tooltip.classList.add("hidden");
      return;
    }
    tooltip.innerHTML = `<strong>${escapeHtml(String(nearest.point.row[options.x] ?? ""))}</strong><span>${escapeHtml(formatChartValue(nearest.point.value, options))}</span>`;
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
    tooltip.classList.remove("hidden");
  };
  canvas.onmouseleave = () => tooltip.classList.add("hidden");
}

function drawStackedBarChart(canvasId, data, options = {}) {
  const setup = canvasSetup(canvasId);
  if (!setup) return;
  const { ctx, width, height } = setup;
  if (!data.length) return drawEmpty(ctx, width, height);
  const bottom = 88;
  const left = 54;
  const top = 46;
  const chartHeight = height - bottom - top;
  const chartWidth = width - left - 28;
  const max = options.maxY || Math.max(...data.map((d) => (d.positive || 0) + (d.neutral || 0) + (d.negative || 0)), 1);
  drawAxes(ctx, width, height, bottom, left);
  drawYAxisTicks(ctx, width, height, max, bottom, left, { ...options, top });
  drawLegend(ctx, width, [["positive", "#22c55e"], ["neutral", "#eab308"], ["negative", "#ef4444"]].map(([label, color]) => [sentimentDisplay(label), color]));

  const slotWidth = chartWidth / data.length;
  const barWidth = Math.min(58, slotWidth * 0.58);
  drawCategoryXAxisNumbers(ctx, data, left, slotWidth, barWidth, height - bottom);
  data.forEach((d, i) => {
    const total = (d.positive || 0) + (d.neutral || 0) + (d.negative || 0);
    const x = left + i * slotWidth + (slotWidth - barWidth) / 2;
    let y = height - bottom;
    [["positive", "#22c55e"], ["neutral", "#eab308"], ["negative", "#ef4444"]].forEach(([key, color]) => {
      const h = chartHeight * (d[key] || 0) / max;
      y -= h;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, Math.max(0, h));
    });
    ctx.fillStyle = mutedColor();
    ctx.textAlign = "center";
    ctx.fillText(formatChartValue(total, options), x + barWidth / 2, y - 7);
    ctx.save();
    ctx.translate(x + barWidth / 2, height - bottom + 34);
    ctx.rotate(-0.32);
    ctx.fillStyle = mutedColor();
    ctx.fillText(truncateText(chartLabel(d, options.label), Math.max(8, Math.floor(slotWidth / 6))), 0, 0);
    ctx.restore();
  });
  ctx.textAlign = "left";
}

function drawDonutChart(canvasId, data, options = {}) {
  const setup = canvasSetup(canvasId);
  if (!setup) return;
  const { ctx, width, height } = setup;
  if (!data.length) return drawEmpty(ctx, width, height);
  const colors = { positive: "#22c55e", neutral: "#eab308", negative: "#ef4444" };
  const orderedKeys = ["positive", "neutral", "negative"];
  const normalized = orderedKeys
    .map((key) => data.find((item) => String(item[options.label]).toLowerCase() === key))
    .filter(Boolean)
    .concat(data.filter((item) => !orderedKeys.includes(String(item[options.label]).toLowerCase())));
  const total = normalized.reduce((sum, d) => sum + (Number(d[options.value]) || 0), 0) || 1;
  let start = -Math.PI / 2;
  const cx = width / 2;
  const cy = height / 2 + 8;
  const r = Math.min(width, height) * 0.25;
  const ringWidth = Math.max(24, Math.min(34, Math.min(width, height) * 0.12));

  ctx.save();
  ctx.lineWidth = ringWidth;
  ctx.lineCap = "butt";
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--line-soft");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  normalized.forEach((d) => {
    const val = Number(d[options.value]) || 0;
    if (val <= 0) return;
    const rawKey = String(d[options.label] ?? "").toLowerCase();
    const color = colors[rawKey] || "#3b82f6";
    const sweep = (val / total) * Math.PI * 2;
    const gap = Math.min(0.026, sweep * 0.18);
    const end = start + sweep;
    const drawStart = start + gap;
    const drawEnd = end - gap;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.arc(cx, cy, r, drawStart, drawEnd);
    ctx.stroke();

    const mid = start + sweep / 2;
    const lineStart = r + ringWidth / 2 + 2;
    const lineEnd = lineStart + 13;
    const labelRadius = lineEnd + 12;
    const sx = cx + Math.cos(mid) * lineStart;
    const sy = cy + Math.sin(mid) * lineStart;
    const ex = cx + Math.cos(mid) * lineEnd;
    const ey = cy + Math.sin(mid) * lineEnd;
    const lx = cx + Math.cos(mid) * labelRadius;
    const ly = cy + Math.sin(mid) * labelRadius;
    const align = lx >= cx ? "left" : "right";

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.font = "700 13px system-ui";
    ctx.fillText(formatChartValue(val, options), lx, ly - 7);
    ctx.fillStyle = mutedColor();
    ctx.font = "12px system-ui";
    ctx.fillText(sentimentDisplay(rawKey), lx, ly + 8);
    ctx.restore();

    start = end;
  });
  ctx.restore();
}

function drawGaugeChart(canvasId, value = 0) {
  const setup = canvasSetup(canvasId);
  if (!setup) return;
  const { ctx, width, height } = setup;
  const score = Math.max(0, Math.min(100, Number(value) || 0));
  const cx = width / 2;
  const cy = height * 0.86;
  const radius = Math.min(width * 0.36, height * 0.72);
  const lineWidth = 22;
  const start = Math.PI;
  const end = Math.PI * 2;
  const progressEnd = start + (score / 100) * Math.PI;

  ctx.lineCap = "butt";
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--line-soft");
  ctx.beginPath();
  ctx.arc(cx, cy, radius, start, end);
  ctx.stroke();

  const segments = [
    [0.00, 0.28, "#2563EB"],
    [0.36, 0.58, "#E8ECF7"],
    [0.66, 0.83, "#E8ECF7"],
    [0.89, 1.00, "#5ED9D1"],
  ];
  segments.forEach(([a, b, color]) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, start + a * Math.PI, start + b * Math.PI);
    ctx.stroke();
  });

  ctx.lineCap = "round";
  ctx.lineWidth = 7;
  ctx.strokeStyle = score >= 80 ? "#22C55E" : score >= 60 ? "#EAB308" : "#EF4444";
  ctx.beginPath();
  ctx.arc(cx, cy, radius - lineWidth * 0.74, start, progressEnd);
  ctx.stroke();
}

function drawLegend(ctx, width, items) {
  let x = 12;
  const y = 16;
  items.forEach(([label, color]) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y - 8, 10, 10);
    ctx.fillStyle = mutedColor();
    ctx.fillText(label, x + 14, y);
    x += Math.min(120, String(label).length * 7 + 34);
    if (x > width - 100) x = 12;
  });
}

function drawEmpty(ctx, width, height) {
  ctx.fillStyle = mutedColor();
  ctx.fillText(t("noData"), width / 2 - 36, height / 2);
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, Math.abs(height) / 2, Math.abs(width) / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function init() {
  const savedTheme = localStorage.getItem("absa-theme") || "light";
  setTheme(savedTheme);
  $("languageSelect").value = state.language;
  renderWeights();
  setupTabs();
  setupShellInteractions();
  applyLanguage();
  setActiveTab(state.selectedTab, { render: false, instant: true });
  checkHealth();
  $("languageSelect").onchange = () => {
    state.language = $("languageSelect").value;
    localStorage.setItem("absa-language", state.language);
    applyLanguage();
  };
  $("themeToggle").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  $("thresholdInput").oninput = () => {
    $("thresholdValue").textContent = Number($("thresholdInput").value).toFixed(2);
  };
  $("singleAnalyzeBtn").onclick = analyzeSingle;
  $("analyzeFileBtn").onclick = analyzeFile;
  $("clearBtn").onclick = () => {
    state.analysis = null;
    state.currentFile = null;
    state.manualTextColumn = null;
    $("fileInput").value = "";
    const fileName = $("fileName");
    if (fileName) fileName.textContent = "Drop .xlsx file here or browse";
    $("uploadColumnPreview")?.classList.add("hidden");
    if ($("uploadColumnPreview")) $("uploadColumnPreview").innerHTML = "";
    setActiveTab("upload", { render: false, instant: true });
    clearError();
  };
}

window.addEventListener("resize", () => { if (state.analysis) renderAll(); });
document.addEventListener("DOMContentLoaded", init);
