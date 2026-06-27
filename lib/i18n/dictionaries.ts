import type { Locale } from "@/lib/i18n/config";

/** The Hebrew dictionary is the canonical shape; `en` must match it exactly.
 *  Chart/page titles and subtitles stay constant. Other strings that
 *  interpolate runtime values are stored as functions so each locale controls
 *  word order. Keys/data values (sectors, regions, gender, school names) live
 *  in the data layer — see lib/i18n/labels.ts. */
const he = {
  meta: {
    title: "מפת השירות הצבאי לפי בתי ספר ומגזרים | נתוני צה״ל",
    description:
      "דשבורד אינטראקטיבי להשוואת שיעורי גיוס, שירות קרבי וקצונה לפי בתי ספר, מגזרים, אזורים, שנים ומגדר.",
  },
  nav: {
    switchLanguage: "החלפת שפה",
    otherLanguage: "EN",
  },
  hero: {
    imageAlt: "נתוני גיוס לפי בתי ספר ומגזרים",
    title: "נתוני גיוס ושירות לפי בתי ספר",
    subtitle:
      "האתר מציג שיעורי גיוס, שירות קרבי וקצונה לפי בית ספר, מגזר, אזור, מגדר ושנה.",
    feedback: "הערות? כתבו לי",
  },
  tabs: {
    overview: "סקירה",
    sectors: "מגזרים",
    gaps: "פערים",
    breakdowns: "פילוחים",
    cities: "אזורים",
    search: "בתי ספר",
    sources: "מקורות נתונים",
    lab: "ניתוחים",
    three: "תלת-ממד",
  },
  delta: {
    vs: (y: number | string) => `מול ${y}`,
    legend: (y: number | string) =>
      `החיצים: שינוי בנקודות האחוז מול ${y} · ירוק = עלייה, אדום = ירידה`,
  },
  overviewTab: {
    title: "סקירה כללית",
    subtitle:
      "כאן רואים את התמונה המרכזית לפני שנכנסים לפילוחים מפורטים.",
  },
  sectorsTab: {
    title: "השוואה בין מגזרים",
    subtitle:
      "השוואה של גיוס, שירות קרבי וקצונה לפי מגזר, מגדר ושנה.",
  },
  citiesTab: {
    title: "השוואה בין אזורים ורשויות",
    subtitle:
      "כאן רואים איך המדדים משתנים בין אזורים, ערים ורשויות מקומיות.",
  },
  searchTab: {
    title: "חיפוש בתי ספר",
    subtitle:
      "חפשו בית ספר וראו את נתוני הגיוס, השירות הקרבי והקצונה שלו.",
  },
  schoolFilter: {
    add: "הוסיפו בית ספר…",
    noResults: "לא נמצאו בתי ספר",
    allSectors: "כל המגזרים",
    clear: "נקה",
    selectedLabel: "בתי ספר מסומנים",
  },
  cityFilter: {
    add: "הוסיפו עיר או רשות…",
    noResults: "לא נמצאו רשויות",
    clear: "נקה",
    selectedLabel: "רשויות מסומנות",
  },
  threeTab: {
    title: "תצוגת תלת-ממד",
    subtitle:
      "תצוגה ניסיונית שמראה את אותם נתונים במרחב תלת-ממדי. גררו לסובב וגלגלו לזום.",
  },
  armyStream: {
    title: "מי ממלא את השורות בפועל",
    subtitle:
      "השוואה במספרים מוחלטים ובהרכב מתוך כלל הקבוצה שנבחרה. כאן מודדים אנשים, לא רק שיעורים.",
    shareTitle: "הרכב הקבוצה שנבחרה",
    shareSubtitle:
      "חלקו של כל מגזר מתוך כלל הקבוצה שנבחרה, לפי המספרים המוחלטים המשוקללים.",
    pieSubtitle:
      "תרשים עוגה של חלקו של כל מגזר מתוך כלל הקבוצה שנבחרה, לפי המספרים המוחלטים המשוקללים.",
    shareNote: (noun: string) =>
      `ערימה ל־100%: גובה הרצועה = אחוז ה${noun} מאותו מגזר באותה שנה, לא המספר המוחלט.`,
    pieNote: (noun: string, year: number | string) =>
      `עוגה לשנת ${year}: כל פרוסה מציגה את חלקו של המגזר מכלל ה${noun}.`,
    axisLabel: (noun: string) => `מספר ${noun}`,
    viewCount: "עמודות",
    viewShare: "הרכב לאורך זמן",
    viewPie: "עוגה",
  },
  three: {
    barTitle: "שלושה מדדי שירות, מגזר אחר מגזר",
    barSubtitle:
      "כל עמודה מציגה את שיעור הגיוס, השירות הקרבי או הקצונה במגזר אחד. גובה העמודה הוא השיעור באחוזים.",
    barHint: "גררו לסובב · גלגלו לזום · רחפו על עמודה לפרטים",
    cloudTitle: "בתי ספר במרחב גיוס-קרבי-קצונה",
    cloudSubtitle:
      "כל נקודה היא בית ספר בשנה אחת, ולכן אותו בית ספר יכול להופיע כמה פעמים. הנקודות צבועות לפי מגזר. הצירים: ימינה = גיוס, למעלה = קרבי, לעומק = קצונה.",
    cloudHint: "גררו לסובב · גלגלו לזום · רחפו על נקודה · לחצו לנעיצה",
    cloudSearch: "חיפוש בית ספר…",
    cloudNoResults: "אין תוצאות",
    cloudYearTip: (y: number | string) => `שנת ${y}`,
    axisEnlist: "🪖 גיוס →",
    axisCombat: "⚔️ קרבי ↑",
    axisOfficer: "🎖️ קצונה ↗",
    terrainTitle: "האשכולות שמאחורי הממוצעים",
    terrainSubtitle:
      "כל בית ספר ממוקם על הקרקע לפי שני מספרים: שיעור הגיוס שלו (ציר אחד) ושיעור הקרבי שלו (ציר שני). הגובה בכל נקודה סופר כמה בתי ספר נופלים על אותו שילוב — פסגה = שילוב נפוץ (הרבה בתי ספר), עמק = שילוב נדיר.",
    terrainHint: "גררו לסובב · גלגלו לזום",
    densityLow: "מעט בתי ספר",
    densityHigh: "הרבה בתי ספר",
    sectorTerrainTitle: "כמה אחיד כל מגזר מבפנים",
    sectorTerrainSubtitle:
      "אותו נוף, מופרד לפי מגזר (גובה = מספר בתי הספר על כל שילוב גיוס×קרבי, מנורמל לכל מגזר בנפרד). פסגה גבוהה וצרה = המגזר אחיד, יש “בית ספר טיפוסי”; שטח נמוך ומרוח = בתי הספר מפוזרים, בלי דפוס אחד. חילוני, דתי-לאומי ודרוזי הם פסגות חדות בגיוס גבוה — חרדי הוא מישור נמוך ומפוזר. כלומר המגזר קובע לא רק כמה מתגייסים, אלא כמה אחידים בתי הספר.",
    terrainViewSingle: "כל בתי הספר",
    terrainViewGrid: "זה לצד זה",
    terrainViewOverlay: "יחד (שכבות)",
    terrainPeakLabel: "כאן מצטופפים רוב בתי הספר",
    schools: (n: number | string) => `${n} בתי ספר`,
    enlistLabel: "🪖 גיוס",
    combatLabel: "⚔️ קרבי",
    officerLabel: "🎖️ קצונה",
    webglError: "הדפדפן לא תומך ב-WebGL, ולכן אי אפשר להציג את התצוגה התלת-ממדית.",
    loading: "טוען תצוגה תלת-ממדית…",
  },
  lab: {
    waffleTitle: "מה נשאר מתוך 100 בני נוער",
    waffleSubtitle:
      "בכל מגזר, כל ריבוע מייצג בן או בת נוער אחד מתוך 100. כחול מלא = שירות קרבי, סגול = קצונה, כחול חלש = התגייסו אך לא לקרבי או לקצונה.",
    per100: "מתוך 100 בני נוער",
    enlisted: "🪖 גויסו",
    combat: "⚔️ קרביים",
    officer: "🎖️ קצינים",
    histTitle: "איפה בתי הספר מתרכזים בקרבי",
    histSubtitle:
      "כל נקודה היא בית ספר בשנה האחרונה, צבועה לפי מגזר. המיקום האופקי הוא שיעור השירות הקרבי; העובי האנכי מראה כמה בתי ספר נמצאים סביב אותו שיעור.",
    scatterTitle: "רשויות בין גיוס רחב לקרבי גבוה",
    scatterSubtitle:
      "כל נקודה היא רשות עם לפחות 3 בתי ספר. ימינה = שיעור גיוס גבוה יותר מתוך המחזור; למעלה = שיעור קרבי גבוה יותר מתוך המתגייסים. הקווים המקווקווים מסמנים את החציון.",
    qTopRight: "🪖 גיוס גבוה · ⚔️ קרבי גבוה",
    qTopLeft: "🪖 גיוס נמוך · ⚔️ קרבי גבוה",
    qBottomRight: "🪖 גיוס גבוה · ⚔️ קרבי נמוך",
    qBottomLeft: "🪖 גיוס נמוך · ⚔️ קרבי נמוך",
    axisEnlist: "שיעור 🪖 גיוס מתוך המחזור",
    axisCombat: "שיעור ⚔️ קרבי מתוך ה־🪖 מתגייסים",
    rank: "מקום",
    scatterTip: (e: number | string, c: number | string) =>
      `🪖 גיוס ${e}% · ⚔️ קרבי ${c}%`,
    schools: (n: number | string) => `${n} בתי ספר`,
    bumpTitle: "הערים הגדולות: מי נשארת גבוה",
    bumpSubtitle:
      "בכל שנה הערים הגדולות מדורגות לפי שיעור השירות הקרבי מול כל הרשויות עם מספיק נתונים. קו גבוה יותר מציין דירוג טוב יותר.",
    moversTitle: "הקפיצות הגדולות",
    moversSubtitle:
      "הרשויות שבהן המדד הנבחר עלה או ירד הכי הרבה בין השנה הראשונה לשנה האחרונה.",
    moversNote:
      "ממוצע בתי ספר לא משוקלל; מוצגות רק רשויות עם 4+ בתי ספר. חלק מהשינוי עשוי לנבוע גם משינוי בהרכב בתי הספר המדווחים בין השנים.",
    unweightedNote:
      "מבוסס על ממוצע בתי הספר ברשות (כל בית ספר במשקל שווה), ולא על שקלול לפי מספר מתגייסים כמו בתצוגות המגזר והאזור — אין נתוני מספרים ברמת בית הספר.",
    risers: "העלייה הגדולה ביותר",
    fallers: "הירידה הגדולה ביותר",
    points: "נק׳",
    raceTitle: "מסע הרשויות משנה לשנה",
    raceSubtitle:
      "כל בועה היא רשות עם לפחות 3 בתי ספר; גודל הבועה מציג מספר בתי ספר. לחצו על נגן כדי לראות איך הרשויות זזות במרחב גיוס×קרבי משנה לשנה.",
    racePlay: "נגן",
    racePause: "השהה",
    ridgeTitle: "איך מרכז ההתפלגות זז",
    ridgeSubtitle:
      "בחרו מדד. כל רכס הוא שנה: הגובה מראה איפה הרבה בתי ספר מרוכזים, והסמן הלבן הוא החציון.",
    ridgeAxis: "שיעור המדד",
    ridgeCount: (nn: number | string) => `${nn} בי״ס`,
    sankeyTitle: "צווארי הבקבוק במסלול השירות",
    sankeySubtitle:
      "מתוך כלל המחזור המשוקלל, כמה מתגייסים; ומתוך המתגייסים, כמה משרתים בקרבי וכמה מגיעים לקצונה. קרבי וקצונה מוצגים כזרמים מקבילים לפי מגזר.",
    sankeyStages: {
      cohort: "מחזור",
      enlist: "🪖 מתגייסים",
      combat: "⚔️ קרביים",
      officer: "🎖️ קצינים",
    },
    sankeyOfficerLegend: "🎖️ קצינים (מתוך ה־🪖 מתגייסים)",
    sankeyNote:
      "קרבי וקצונה נמדדים שניהם מתוך המתגייסים, ולכן הם שני זרמים מקבילים — לא שלב אחרי שלב. ייתכן חפיפה קלה (קצינים קרביים נכללים בשניהם).",
    outlierTitle: "רשויות שמכות את התחזית",
    outlierSubtitle:
      "הקו המקווקו מראה את הקשר הצפוי בין שיעור הגיוס למדד הנבחר. רשויות מעל הקו מגיעות למדד גבוה מהצפוי לפי שיעור הגיוס שלהן; מתחת לקו — נמוך מהצפוי.",
    outlierOver: "הרבה מעל הצפוי",
    outlierUnder: "הרבה מתחת לצפוי",
    parallelTitle: "פרופיל השירות של כל בית ספר",
    parallelSubtitle:
      "כל קו הוא בית ספר בשנה האחרונה, צבוע לפי מגזר, ועובר דרך שלושה צירים: גיוס, קרבי וקצונה. רחפו על קו כדי להדגיש בית ספר.",
    trajTitle: "המסלול הרב-שנתי של הערים",
    trajSubtitle:
      "כל קו עוקב אחרי עיר גדולה במרחב גיוס×קרבי לאורך השנים. נקודה קטנה מסמנת את השנה הראשונה, ונקודה מלאה מסמנת את השנה האחרונה.",
  },
  common: {
    noData: "אין נתונים מספיקים עבור צירוף זה.",
    fieldGender: "מגדר",
    fieldMetric: "מדד",
    fieldSector: "מגזר",
  },
  metrics: {
    enlist: { short: "🪖 גיוס", label: "שיעור גיוס", long: "🪖 שיעור גיוס" },
    combat: {
      short: "⚔️ קרבי",
      label: "שירות קרבי מתוך מתגייסים",
      long: "⚔️ שירות קרבי מתוך ה־🪖 מתגייסים",
    },
    officer: {
      short: "🎖️ קצונה",
      label: "קצונה מתוך מתגייסים",
      long: "🎖️ קצונה מתוך ה־🪖 מתגייסים",
    },
    meaning: { short: "משמעותי", label: "שירות משמעותי", long: "שירות משמעותי" },
  },
  absMetrics: {
    nFighters: "⚔️ לוחמים",
    nOfficers: "🎖️ קצינים",
    nEnlistees: "🪖 מתגייסים",
  },
  absNoun: {
    nFighters: "לוחמים",
    nOfficers: "קצינים",
    nEnlistees: "מתגייסים",
  },
  funnel: {
    enlist: "🪖 מתגייסים",
    combat: "⚔️ קרביים",
    officer: "🎖️ קצינים",
  },
  genderGap: {
    title: "פערי מגדר: איפה הם נפתחים",
    subtitle: "הפרש נקודות האחוז בין בנים לבנות בכל מגזר, עבור המדד שנבחר.",
    gap: (g: number | string) => `פער ${g} נק׳`,
    footnote:
      "ערך חיובי מציין שהמדד גבוה יותר אצל בנים; ערך שלילי מציין יתרון לבנות.",
  },
  sectorDonuts: {
    title: "מי מוביל במדד שנבחר",
    subtitle: "הערך של כל מגזר במדד ובמגדר שנבחרו.",
  },
  leaderboards: {
    unclassified: "לא מסווג",
    title: "קצות הטבלה: בתי ספר חריגים",
    subtitle: "עשרת בתי הספר עם הערכים הגבוהים והנמוכים ביותר במדד שנבחר.",
    topTitle: "10 הגבוהים",
    bottomTitle: "10 הנמוכים",
    legend: "הנקודה הצבעונית מציינת את המגזר:",
  },
  regionView: {
    title: "איפה האזור משנה",
    subtitle: "דירוג אזורים גאוגרפיים לפי המדד, המגדר והמגזר שנבחרו.",
    footnote: "רוחב העמודה יחסי לערך הגבוה ביותר בתצוגה הנוכחית.",
  },
  subgroups: {
    title: "המגזר לא תמיד מקשה אחת",
    subtitle:
      "השוואה בין תתי־קבוצות בתוך כל מגזר לפי מדדי הגיוס המרכזיים.",
    noData: "אין מספיק תת-קבוצות להצגה עבור צירוף זה.",
    schools: (n: number | string) => `${n} בתי ספר`,
    footnote:
      "רוחב העמודה יחסי לערך הגבוה ביותר בתת-הקבוצות שמוצגות כעת.",
  },
  effectiveRate: {
    title: "כמה באמת מגיעים לקרבי או לקצונה",
    subtitle:
      "בכל מגזר, כמה מכל 100 בני נוער מגיעים בפועל לשירות קרבי או לקצונה.",
    footnote:
      "חישוב המדד: שיעור גיוס מתוך המחזור × שיעור התפקיד מתוך המתגייסים.",
  },
  sectorFunnel: {
    title: "מה נשאר אחרי כל שלב",
    subtitle:
      "בכל מגזר, כמה מתוך 100 בני נוער מתגייסים, כמה מגיעים לשירות קרבי וכמה לקצונה.",
    footnote:
      "כל שלב מוצג ביחס ל־100 בני נוער במחזור, לא רק ביחס למתגייסים.",
  },
  combatParadox: {
    tipEnlist: "🪖 שיעור גיוס",
    tipCombat: "⚔️ שיעור קרבי",
    tipFighters: "⚔️ לוחמים בפועל",
    title: "שיעור גבוה, תרומה קטנה?",
    subtitle:
      "כל בועה היא מגזר: הציר האופקי מציג שיעור גיוס, הציר האנכי מציג שיעור קרבי, וגודל הבועה מציג את מספר הלוחמים בפועל.",
    axisEnlist: "🪖 שיעור גיוס",
    axisCombat: "⚔️ שיעור קרבי",
    footnote:
      "מגזר יכול להציג שיעור קרבי גבוה אך לתרום מעט לוחמים בפועל (בועה קטנה), ולהפך — שיעור בינוני עם תרומה גדולה (בועה גדולה).",
  },
  contribution: {
    title: "מי סוחב את המספרים הארציים",
    subtitle:
      "חלקו של כל מגזר מכלל הקבוצה שנבחרה בארץ. כאן מודדים מספר אנשים, ולכן שיעור גבוה לא תמיד אומר תרומה גדולה.",
    ofEnlistees: (rate: number | string) => `(${rate}% מה־🪖 מתגייסים)`,
    footnote:
      "מגזר גדול עם שיעור בינוני עשוי לספק יותר לוחמים ממגזר קטן עם שיעור גבוה. המספרים המוחלטים מוערכים לפי גודל המחזור ושיעור המדד.",
  },
  heatmap: {
    title: "כל הפערים במקום אחד",
    subtitle:
      "כל תא מציג שיעור באחוזים עבור מגזר ומגדר. צבע כהה יותר מציין ערך גבוה יותר בתוך אותו מדד.",
    sectorHeader: "מגזר",
    footnote:
      "הצבע מחושב בנפרד לכל מדד, כדי להבליט מי גבוה או נמוך בתוך אותה עמודה.",
  },
  trend: {
    title: "האם הפער נסגר או נפתח",
    subtitle: "שינוי המדד שנבחר בכל מגזר לאורך השנים.",
  },
  notes: {
    title: "מה חשוב לדעת לפני שמשווים",
    subtitle:
      "הגדרות המדדים, מקור הנתונים וההסתייגויות שחשוב להכיר לפני השוואה.",
    items: [
      {
        label: "שנתון",
        text: "נתוני 2024 מתייחסים לבוגרי כיתה י״ב משנתון 2002–2003, כלומר כשלוש שנים לאחר סיום הלימודים.",
      },
      {
        label: "מקור הנתונים",
        text: "נתוני הגיוס התקבלו מצה״ל (מערכת מוסדות וערים, לשכת רחט) במסגרת חוק חופש המידע, באדיבות התנועה לחופש המידע.",
      },
      {
        label: "שיטת חישוב",
        text: "שיעור הגיוס מחושב מתוך מחזור תלמידי י״ב. שיעורי קרבי וקצונה מחושבים מתוך המתגייסים בלבד: סך הלוחמים או הקצינים חלקי סך המתגייסים. הנתונים המצרפיים תואמים לקובץ ״נתוני גיוס מלאים״ שבלשונית ״מקורות נתונים״.",
      },
      {
        label: "בתי ספר ללא גיוס",
        text: "בתי ספר שמהם לא התגייס איש (142 ב־2024) אינם נכללים בממוצעים המרכזיים; הכללתם הייתה מורידה את שיעור הגיוס, בעיקר במגזר החרדי. אפשר להציג אותם בטבלת בתי הספר והם מופיעים גם בקובץ המלא להורדה.",
      },
      {
        label: "מגזר חרדי",
        text: "שיעור הגיוס במגזר החרדי מוערך ביתר, בשל בתי ספר רבים שצה״ל אינו מכיר. בהנחה שמהם לא מתגייסים כלל, שיעור הגיוס לגברים עומד על כ־8.5% (2024).",
      },
      {
        label: "דרוזי",
        text: "קבוצת ׳דרוזי׳ כוללת גם בתי ספר ערביים ומעורבים (נוצרים ומוסלמים), ולא רק דרוזים.",
      },
    ],
  },
  fullData: {
    title: "הנתונים להורדה",
    subtitle: "קובצי Excel להמשך בדיקה, הצלבה או ניתוח עצמאי של הנתונים.",
    footnote:
      "הנתונים התקבלו מצה״ל במסגרת חוק חופש המידע, באדיבות התנועה לחופש המידע.",
    items: [
      {
        title: "הקובץ המצרפי",
        desc: "פילוח לפי מגזר, תת-קבוצה, אזור ומגדר — כולל שיעורי גיוס, קרבי, קצונה ומספרים מוחלטים לשנים 2018 ו־2024.",
      },
      {
        title: "קובץ בתי הספר",
        desc: "נתוני המקור לכל בית ספר בנפרד, כולל רשות, שנה, מגדר ומדדי הגיוס הזמינים.",
      },
    ],
  },
  explorer: {
    colSchool: "בית ספר",
    colMeaning: "שירות משמעותי",
    colMeaningShort: "משמעותי",
    title: "מצאו בית ספר והשוו אותו",
    subtitle:
      "חיפוש וסינון בתי ספר לפי שנה, מגדר, רשות ומדדי הגיוס המרכזיים.",
    searchPlaceholder: "חיפוש לפי שם בית ספר או רשות…",
    genderAll: "הכל",
    genderBoys: "👨 בנים",
    genderGirls: "👩 בנות",
    moreFilters: "עוד מסננים",
    showZero: "הצגת בתי ספר ללא מתגייסים",
    genderHeader: "מגדר",
    resultsNote: (limit: number | string, total: number | string) =>
      `מוצגים ${limit} מתוך ${total} תוצאות. צמצמו באמצעות חיפוש, שנה או מגדר.`,
    colorLegend: "צבע לפי רמת השיעור בשנה הנבחרת",
  },
  cities: {
    colCouncil: "רשות",
    colCount: "בתי ספר",
    colCountShort: "בת״ס",
    colMeaning: "שירות משמעותי",
    colMeaningShort: "משמעותי",
    title: "הרשויות לפי המדד שנבחר",
    featuredHeading: "הערים הגדולות בישראל",
    restHeading: "כל שאר הרשויות",
    schoolsCount: (n: number | string) => `${n} בת״ס`,
    noData: "אין נתונים",
    trendCaption: "מגמת גיוס לאורך השנים",
    trendHeading: "מגמת הערים הגדולות לאורך השנים",
    clickHint: "לחצו על עיר בתרשים לפילוח לפי מגזר",
    addCity: "הוסף עיר…",
    removeCity: "הסר מהמועדפות",
    reset: "איפוס",
    breakdownToggle: "פילוח לפי מגזר",
    sectorOther: "אחר / לא מסווג",
    searchPlaceholder: "חיפוש לפי שם רשות…",
    resultsNote: (limit: number | string, total: number | string) =>
      `מוצגות ${limit} מתוך ${total} רשויות. צמצמו באמצעות חיפוש או שנה.`,
    countNote: (total: number | string) => `${total} רשויות.`,
  },
  chartExport: {
    shareText: "נתוני גיוס לפי בתי ספר ומגזרים",
    ariaLabel: "שיתוף וייצוא",
    downloadPng: "הורדה כתמונה (PNG)",
    share: "שיתוף…",
    shareX: "שיתוף ב‑X",
    copied: "התמונה הועתקה — פתחו את X והדביקו אותה (⌘/Ctrl+V)",
  },
  analysis: {
    sectorDonuts:
      "אפשר ללמוד שהמגזר הוא גורם חזק מאוד במדד הזה. הפערים בין המגזרים גדולים מספיק כדי לא להיראות כמו רעש של בתי ספר בודדים.",
    heatmap:
      "הפער אינו רק בין מגזרים. ברגע שמפרידים בין בנים לבנות, רואים שהמגדר משנה מאוד את תמונת השירות הקרבי והקצונה.",
    armyStream:
      "המסקנה כאן היא ששיעור גבוה לבדו לא מספר מי ממלא את השורות. בגלל גודל האוכלוסייה, המגזר החילוני מספק את רוב הלוחמים בפועל.",
    sectorBars:
      "אפשר לראות שאין “מגזר מוביל” אחד בכל המדדים. גיוס, קרבי וקצונה מתנהגים אחרת, ולכן צריך להיזהר ממסקנה אחת גורפת.",
    contribution:
      "המסקנה היא שתרומה לאומית נוצרת משילוב של שיעור וגודל קבוצה. מגזר קטן עם שיעור גבוה עדיין יכול להשפיע פחות ממגזר גדול עם שיעור בינוני.",
    combatParadox:
      "זה מפריד בין איכות יחסית לבין משקל בפועל. מגזר יכול להיות גבוה בציר הקרבי, אבל אם הבועה קטנה התרומה המספרית שלו מוגבלת.",
    genderGap:
      "הפערים מלמדים שהדיון על מגזר לא מספיק בלי מגדר. במיוחד בקרבי, בנים ובנות חווים מציאות שירות שונה מאוד.",
    regionView:
      "אפשר ללמוד שהמקום הגאוגרפי משקף גם הרכב חברתי. אזור נמוך יותר לא בהכרח “מתפקד פחות”, אלא כולל אוכלוסיות עם דפוסי גיוס שונים.",
    cities:
      "ההשוואה בין רשויות מראה שאין מסלול עירוני אחד. עיר יכולה להצליח בגיוס כללי, אבל זה לא מבטיח שיעור קרבי או קצונה גבוה.",
    cityScatter:
      "הרשויות בפינה הימנית־עליונה הן המודל החזק ביותר: גם בסיס גיוס רחב וגם שיעור קרבי גבוה. זה שילוב נדיר יותר משני המדדים בנפרד.",
    cityRank:
      "מה שחשוב כאן הוא עקביות. רשות שנשארת גבוה לאורך שנים מספרת סיפור חזק יותר מרשות שקופצת לשנה אחת ונעלמת.",
    movers:
      "השינויים החדים מסמנים איפה כדאי לשאול שאלות המשך. לא כל קפיצה היא שינוי אמיתי בהתנהגות; לפעמים זו גם תוצאה של מי נכנס למדידה.",
    cityRace:
      "התנועה מלמדת אם עיר משתפרת באותו כיוון או מחליפה דפוס. ימינה בלי עלייה אומר יותר גיוס, אבל לא בהכרח יותר קרבי.",
    cityTrajectories:
      "המסלול עוזר להבדיל בין מגמה לבין תנודה. קו חלק מצביע על שינוי הדרגתי; קו שבור יותר מצביע על חוסר יציבות בין שנים.",
    schoolBeeswarm:
      "הצפיפות מלמדת איפה נמצא “בית הספר הטיפוסי”. נקודות רחוקות מהאשכול המרכזי הן החריגים שכדאי לבדוק בנפרד.",
    schoolProfile:
      "אין פרופיל אחד של בית ספר חזק. בית ספר יכול להיות מצוין בגיוס אבל חלש בקצונה, ולכן דירוג חד־ממדי מפספס חלק מהתמונה.",
    schoolCloud:
      "המרחב מלמד שדמיון בין בתי ספר נוצר משילוב מדדים. שני בתי ספר עם אותו גיוס יכולים להיות שונים מאוד בקרבי או בקצונה.",
    leaderboards:
      "הקצוות טובים למציאת חריגים, לא להבנת הכלל. אם הרבה בתי ספר מאותו מגזר מופיעים בקצה, אז כבר מתחיל להיווצר דפוס.",
    waffle:
      "כשמתרגמים אחוזים ל־100 בני נוער, הפער נהיה מוחשי. ההבדל בין “מתגייסים” ל“מגיעים לקרבי או לקצונה” הוא המקום שבו הרבה מהסיפור קורה.",
    sankey:
      "הצוואר המרכזי הוא המעבר מהמחזור לגיוס. אחרי שמישהו התגייס, קרבי וקצונה הם כבר שתי תוצאות שונות, לא שלבים באותו סולם.",
    armyComposition:
      "הרכב הלוחמים לאורך שנים מזכיר שהצבא מושפע ממספרים מוחלטים. גם שינוי יפה בשיעור של מגזר קטן לא בהכרח משנה את התמונה הארצית.",
    ridge:
      "אפשר ללמוד אם השינוי רחב או נקודתי. אם החציון זז, מרכז המערכת משתנה; אם רק הצורה משתנה, ייתכן שהשינוי קורה בקצוות.",
    outliers:
      "הרשויות מעל הקו מעניינות כי הן עושות יותר ממה שהגיוס שלהן מנבא. אלה המקומות שבהם כדאי לחפש הסבר מקומי.",
    sectorTerrain:
      "הצורה של הנוף מלמדת על אחידות. פסגה חדה אומרת שהרבה בתי ספר דומים זה לזה; שטח מפוזר אומר שהמגזר פחות צפוי מבפנים.",
  },
  panel: {
    exportFallback: "תרשים",
  },
};

export type Dictionary = typeof he;

const en: Dictionary = {
  meta: {
    title: "Military Service Map by School and Sector | IDF Data",
    description:
      "An interactive dashboard comparing enlistment, combat and officer rates by school, sector, region, year and gender.",
  },
  nav: {
    switchLanguage: "Switch language",
    otherLanguage: "עב",
  },
  hero: {
    imageAlt: "Enlistment data by school and sector",
    title: "Where Students Enlist, Reach Combat and Become Officers",
    subtitle:
      "An interactive school comparison: enlistment, combat and officer rates by sector, gender and year. Averages are weighted by the number of 12th-grade students.",
    feedback: "Feedback? Message me",
  },
  tabs: {
    overview: "Main Picture",
    sectors: "Sectors",
    gaps: "Gender Gaps",
    breakdowns: "Breakdowns",
    cities: "Regions",
    search: "Schools",
    sources: "Data Sources",
    lab: "Deep Dives",
    three: "3D Space",
  },
  delta: {
    vs: (y: number | string) => `vs ${y}`,
    legend: (y: number | string) =>
      `Arrows: change in percentage points vs ${y} · green = up, red = down`,
  },
  overviewTab: {
    title: "The Starting Picture",
    subtitle:
      "A short entry point: sector picture and gender gaps before the deeper views.",
  },
  sectorsTab: {
    title: "Sectors: Rates vs Real Numbers",
    subtitle:
      "Why groups differ: rates, absolute contribution, change over time and the service pipeline.",
  },
  citiesTab: {
    title: "Geography and Municipalities",
    subtitle:
      "From macro region to municipality: rankings, comparisons, change over time and outliers.",
  },
  searchTab: {
    title: "Schools: Search and Outliers",
    subtitle:
      "Find a school, compare the extremes, and see how schools distribute across enlistment, combat and officers.",
  },
  schoolFilter: {
    add: "Add a school…",
    noResults: "No schools found",
    allSectors: "All sectors",
    clear: "Clear",
    selectedLabel: "Highlighted schools",
  },
  cityFilter: {
    add: "Add a city or municipality…",
    noResults: "No municipalities found",
    clear: "Clear",
    selectedLabel: "Highlighted municipalities",
  },
  threeTab: {
    title: "The Same Data, in Space",
    subtitle:
      "The same data, in three dimensions. Drag to rotate, scroll to zoom. Experimental and heavy — needs a WebGL-capable browser.",
  },
  armyStream: {
    title: "Who Fills the Ranks",
    subtitle:
      "A comparison of absolute counts and composition within the selected group. This counts people, not just rates.",
    shareTitle: "The Selected Group by Sector",
    shareSubtitle:
      "Each sector's share of the selected group, based on weighted absolute counts.",
    pieSubtitle:
      "A pie chart of each sector's share of the selected group, based on weighted absolute counts.",
    shareNote: (noun: string) =>
      `100%-stacked: a band's height is that sector's share of ${noun} that year, not the absolute number.`,
    pieNote: (noun: string, year: number | string) =>
      `Pie for ${year}: each slice shows that sector's share of all ${noun}.`,
    axisLabel: (noun: string) =>
      `${noun.charAt(0).toUpperCase()}${noun.slice(1)}`,
    viewCount: "Bars",
    viewShare: "Composition over time",
    viewPie: "Pie",
  },
  three: {
    barTitle: "Three Service Metrics, Sector by Sector",
    barSubtitle:
      "Each bar shows one sector's enlistment, combat-service or officer rate. Bar height is the percentage rate.",
    barHint: "Drag to rotate · scroll to zoom · hover a bar for details",
    cloudTitle: "Schools in Enlistment-Combat-Officer Space",
    cloudSubtitle:
      "Each point is one school in one year, so the same school may appear more than once. Points are colored by sector. Axes: right = enlistment, up = combat, depth = officers.",
    cloudHint: "Drag to rotate · scroll to zoom · hover a point · click to pin",
    cloudSearch: "Search a school…",
    cloudNoResults: "No matches",
    cloudYearTip: (y: number | string) => `Year ${y}`,
    axisEnlist: "🪖 Enlist →",
    axisCombat: "⚔️ Combat ↑",
    axisOfficer: "🎖️ Officer ↗",
    terrainTitle: "The Clusters Behind the Averages",
    terrainSubtitle:
      "Each school is placed on the ground by two numbers: its enlistment rate (one axis) and its combat rate (the other). The height at any point counts how many schools land on that combination — a peak = a common mix (many schools), a valley = a rare one.",
    terrainHint: "Drag to rotate · scroll to zoom",
    densityLow: "Fewer schools",
    densityHigh: "More schools",
    sectorTerrainTitle: "How Uniform Each Sector Is Inside",
    sectorTerrainSubtitle:
      "The same landscape, split by sector (height = number of schools at each enlist×combat mix, normalized per sector). A tall, narrow spike = the sector is uniform — there's a “typical school”; a low, spread-out sheet = schools are all over the place, with no single pattern. Secular, national-religious and Druze are sharp spikes at high enlistment — Haredi is a low, sprawling plain. So sector predicts not just how much schools enlist, but how consistent they are.",
    terrainViewSingle: "All schools",
    terrainViewGrid: "Side by side",
    terrainViewOverlay: "Together (layers)",
    terrainPeakLabel: "Most schools cluster here",
    schools: (n: number | string) => `${n} schools`,
    enlistLabel: "🪖 Enlist",
    combatLabel: "⚔️ Combat",
    officerLabel: "🎖️ Officer",
    webglError: "Your browser doesn't support WebGL, so the 3D view can't render.",
    loading: "Loading 3D view…",
  },
  lab: {
    waffleTitle: "What Remains Out of 100 Youth",
    waffleSubtitle:
      "In each sector, every square represents one young person out of 100. Solid blue = combat service, purple = officers, faint blue = enlisted but not combat or officer.",
    per100: "of 100 youth",
    enlisted: "🪖 enlisted",
    combat: "⚔️ combat",
    officer: "🎖️ officers",
    histTitle: "Where Schools Cluster on Combat Service",
    histSubtitle:
      "Each dot is one school in the latest year, colored by sector. The horizontal position is the combat-service rate; vertical thickness shows how many schools cluster around that rate.",
    scatterTitle: "Municipalities Between Broad Enlistment and High Combat",
    scatterSubtitle:
      "Each dot is a municipality with at least 3 schools. Right = a higher enlistment rate out of the cohort; up = a higher combat-service rate among enlistees. Dashed lines mark the medians.",
    qTopRight: "High 🪖 enlist · high ⚔️ combat",
    qTopLeft: "Low 🪖 enlist · high ⚔️ combat",
    qBottomRight: "High 🪖 enlist · low ⚔️ combat",
    qBottomLeft: "Low 🪖 enlist · low ⚔️ combat",
    axisEnlist: "🪖 Enlistment rate (of cohort)",
    axisCombat: "⚔️ Combat rate (of 🪖 enlistees)",
    rank: "rank",
    scatterTip: (e: number | string, c: number | string) =>
      `🪖 Enlist ${e}% · ⚔️ combat ${c}%`,
    schools: (n: number | string) => `${n} schools`,
    bumpTitle: "Largest Cities: Who Stays High",
    bumpSubtitle:
      "Each year, the largest cities are ranked by combat-service rate against all municipalities with enough data. A higher line means a better rank.",
    moversTitle: "The Biggest Jumps",
    moversSubtitle:
      "The municipalities where the selected metric rose or fell the most between the first and latest year.",
    moversNote:
      "Unweighted school average; only municipalities with 4+ schools are shown. Part of a change may also come from which schools reported in each year.",
    unweightedNote:
      "Based on the plain average of the municipality's schools (each school weighted equally), not enlistee-weighted like the sector and region views — there are no per-school head-counts.",
    risers: "Biggest rise",
    fallers: "Biggest drop",
    points: "pts",
    raceTitle: "Municipalities Moving Year by Year",
    raceSubtitle:
      "Each bubble is a municipality with at least 3 schools; bubble size shows school count. Press play to see municipalities move through enlistment×combat space year by year.",
    racePlay: "Play",
    racePause: "Pause",
    ridgeTitle: "How the Center of the Distribution Moves",
    ridgeSubtitle:
      "Choose a metric. Each ridge is one year: height shows where many schools cluster, and the white marker is the median.",
    ridgeAxis: "Metric rate",
    ridgeCount: (nn: number | string) => `${nn} schools`,
    sankeyTitle: "The Bottlenecks in the Service Path",
    sankeySubtitle:
      "Out of the weighted cohort, this shows how many enlist; and out of enlistees, how many serve in combat and how many become officers. Combat and officers are parallel streams by sector.",
    sankeyStages: {
      cohort: "Cohort",
      enlist: "🪖 Enlisted",
      combat: "⚔️ Combat",
      officer: "🎖️ Officers",
    },
    sankeyOfficerLegend: "🎖️ Officers (of 🪖 enlistees)",
    sankeyNote:
      "Combat and officers are both measured out of enlistees, so they're two parallel streams — not sequential stages. They can overlap slightly (combat officers count in both).",
    outlierTitle: "Municipalities Beating the Forecast",
    outlierSubtitle:
      "The dashed line shows the expected link between enlistment rate and the selected metric. Municipalities above it land higher than their enlistment rate predicts; below it, lower.",
    outlierOver: "Far above expected",
    outlierUnder: "Far below expected",
    parallelTitle: "Each School's Service Profile",
    parallelSubtitle:
      "Each line is one school in the latest year, colored by sector, crossing three axes: enlistment, combat and officers. Hover a line to highlight a school.",
    trajTitle: "The Multi-Year Path of the Cities",
    trajSubtitle:
      "Each line follows a large city through enlistment×combat space over time. A small node marks the first year, and a filled node marks the latest year.",
  },
  common: {
    noData: "Not enough data for this combination.",
    fieldGender: "Gender",
    fieldMetric: "Metric",
    fieldSector: "Sector",
  },
  metrics: {
    enlist: {
      short: "🪖 Enlist",
      label: "Enlistment rate",
      long: "🪖 Enlistment rate",
    },
    combat: {
      short: "⚔️ Combat",
      label: "Combat service among enlistees",
      long: "⚔️ Combat service among enlistees",
    },
    officer: {
      short: "🎖️ Officers",
      label: "Officers among enlistees",
      long: "🎖️ Officers among enlistees",
    },
    meaning: {
      short: "Meaningful",
      label: "Meaningful service",
      long: "Meaningful service",
    },
  },
  absMetrics: {
    nFighters: "⚔️ Combat soldiers",
    nOfficers: "🎖️ Officers",
    nEnlistees: "🪖 Enlistees",
  },
  absNoun: {
    nFighters: "combat soldiers",
    nOfficers: "officers",
    nEnlistees: "enlistees",
  },
  funnel: {
    enlist: "🪖 Enlistees",
    combat: "⚔️ Combat",
    officer: "🎖️ Officers",
  },
  genderGap: {
    title: "Gender Gaps: Where They Open Up",
    subtitle:
      "The percentage-point difference between boys and girls in each sector for the selected metric.",
    gap: (g: number | string) => `${g} pt gap`,
    footnote:
      "A positive value means the metric is higher for boys; a negative value means an advantage for girls.",
  },
  sectorDonuts: {
    title: "Who Leads on the Selected Metric",
    subtitle: "Each sector's value for the selected metric and gender.",
  },
  leaderboards: {
    unclassified: "Unclassified",
    title: "The Edges of the Table: Outlier Schools",
    subtitle:
      "The ten schools with the highest and lowest values on the selected metric.",
    topTitle: "Top 10",
    bottomTitle: "Bottom 10",
    legend: "The colored dot indicates the sector:",
  },
  regionView: {
    title: "Where Region Starts to Matter",
    subtitle: "Geographic regions ranked by the selected metric, gender and sector.",
    footnote: "Bar width is relative to the highest value in the current view.",
  },
  subgroups: {
    title: "Sectors Are Not Always One Block",
    subtitle:
      "Comparing subgroups within each sector on the main enlistment metrics.",
    noData: "Not enough subgroups to display for this combination.",
    schools: (n: number | string) => `${n} schools`,
    footnote:
      "Bar width is relative to the highest value among the subgroups shown.",
  },
  effectiveRate: {
    title: "How Many Actually Reach Combat or Officer Rank",
    subtitle:
      "For each sector, how many of every 100 youth actually reach combat service or officer rank.",
    footnote:
      "How it's computed: enlistment rate of the cohort × the role's rate among enlistees.",
  },
  sectorFunnel: {
    title: "What Remains After Each Step",
    subtitle:
      "For each sector, how many of every 100 youth enlist, reach combat service and reach officer rank.",
    footnote:
      "Each stage is shown relative to 100 youth in the cohort, not just relative to enlistees.",
  },
  combatParadox: {
    tipEnlist: "🪖 Enlistment rate",
    tipCombat: "⚔️ Combat rate",
    tipFighters: "Actual ⚔️ combat soldiers",
    title: "High Rate, Small Contribution?",
    subtitle:
      "Each bubble is a sector: the horizontal axis shows enlistment rate, the vertical axis shows combat-service rate, and bubble size shows the actual number of combat soldiers.",
    axisEnlist: "🪖 Enlistment rate",
    axisCombat: "⚔️ Combat rate",
    footnote:
      "A sector can show a high combat rate yet contribute few actual combat soldiers (a small bubble), and vice versa — a moderate rate with a large contribution (a big bubble).",
  },
  contribution: {
    title: "Who Carries the National Numbers",
    subtitle:
      "Each sector's share of the selected national group. This counts people, so a high rate is not always a large contribution.",
    ofEnlistees: (rate: number | string) => `(${rate}% of 🪖 enlistees)`,
    footnote:
      "A large sector with a moderate rate may supply more combat soldiers than a small sector with a high rate. Absolute numbers are estimated from cohort size and the metric rate.",
  },
  heatmap: {
    title: "All the Gaps in One Place",
    subtitle:
      "Each cell shows a percentage rate for one sector and gender. Darker color means a higher value within that metric.",
    sectorHeader: "Sector",
    footnote:
      "Color is computed separately per metric, to highlight who is high or low within the same column.",
  },
  trend: {
    title: "Is the Gap Closing or Opening?",
    subtitle: "How the selected metric changed in each sector over time.",
  },
  notes: {
    title: "What to Know Before Comparing",
    subtitle:
      "Metric definitions, the data source and the caveats worth knowing before comparing.",
    items: [
      {
        label: "Cohort year",
        text: "The 2024 data refers to 12th-grade graduates from the 2002–2003 cohort — roughly three years after finishing school.",
      },
      {
        label: "Data source",
        text: "The enlistment data was obtained from the IDF (the institutions-and-cities system, Chief Manpower Officer's bureau) under the Freedom of Information Act, courtesy of the Movement for Freedom of Information.",
      },
      {
        label: "Calculation method",
        text: "The enlistment rate is calculated out of the 12th-grade cohort. Combat and officer rates are calculated out of enlistees only: total combat soldiers or officers divided by total enlistees. The aggregate figures match the “Full Enlistment Data” file in the “Data Sources” tab.",
      },
      {
        label: "Schools with no enlistment",
        text: "Schools from which no one enlisted (142 in 2024) are not included in the main averages; including them would lower the enlistment rate, mainly in the Haredi sector. You can show them in the schools table and they also appear in the full downloadable file.",
      },
      {
        label: "Haredi sector",
        text: "The enlistment rate in the Haredi sector is overestimated, because of many schools the IDF does not recognize. Assuming no one enlists from them, the male enlistment rate stands at about 8.5% (2024).",
      },
      {
        label: "Druze",
        text: "The ‘Druze’ group also includes Arab and mixed schools (Christian and Muslim), not only Druze.",
      },
    ],
  },
  fullData: {
    title: "Download the Data",
    subtitle:
      "Excel files for further checking, cross-referencing or independent analysis of the data.",
    footnote:
      "The data was obtained from the IDF under the Freedom of Information Act, courtesy of the Movement for Freedom of Information.",
    items: [
      {
        title: "Aggregate Data File",
        desc: "Broken down by sector, subgroup, region and gender — including enlistment, combat and officer rates and absolute numbers for 2018 and 2024.",
      },
      {
        title: "School-Level File",
        desc: "The source data for each school individually, including municipality, year, gender and the available enlistment metrics.",
      },
    ],
  },
  explorer: {
    colSchool: "School",
    colMeaning: "Meaningful service",
    colMeaningShort: "Meaningful",
    title: "Find a School and Compare It",
    subtitle:
      "Search and filter schools by year, gender, municipality and the main enlistment metrics.",
    searchPlaceholder: "Search by school or municipality name…",
    genderAll: "All",
    genderBoys: "👨 Boys",
    genderGirls: "👩 Girls",
    moreFilters: "More filters",
    showZero: "Show schools with no enlistees",
    genderHeader: "Gender",
    resultsNote: (limit: number | string, total: number | string) =>
      `Showing ${limit} of ${total} results. Narrow down with search, year or gender.`,
    colorLegend: "Colored by level in the selected year",
  },
  cities: {
    colCouncil: "Municipality",
    colCount: "Schools",
    colCountShort: "Schools",
    colMeaning: "Meaningful service",
    colMeaningShort: "Meaningful",
    title: "Municipalities by the Selected Metric",
    featuredHeading: "Israel's Largest Cities",
    restHeading: "All Other Municipalities",
    schoolsCount: (n: number | string) => `${n} schools`,
    noData: "No data",
    trendCaption: "Enlistment trend over the years",
    trendHeading: "Biggest cities over time",
    clickHint: "Click a city in the chart to break it down by sector",
    addCity: "Add city…",
    removeCity: "Remove from featured",
    reset: "Reset",
    breakdownToggle: "Break down by sector",
    sectorOther: "Other / unclassified",
    searchPlaceholder: "Search by municipality name…",
    resultsNote: (limit: number | string, total: number | string) =>
      `Showing ${limit} of ${total} municipalities. Narrow down with search or year.`,
    countNote: (total: number | string) => `${total} municipalities.`,
  },
  chartExport: {
    shareText: "Enlistment data by school and sector",
    ariaLabel: "Share and export",
    downloadPng: "Download as image (PNG)",
    share: "Share…",
    shareX: "Share on X",
    copied: "Image copied — open X and paste it (⌘/Ctrl+V)",
  },
  analysis: {
    sectorDonuts:
      "The takeaway is that sector is a strong signal for this metric. The gaps are large enough that they do not look like noise from a few individual schools.",
    heatmap:
      "The gap is not only between sectors. Once boys and girls are separated, gender changes the picture sharply for combat service and officer rates.",
    armyStream:
      "A high rate alone does not tell us who fills the ranks. Because of population size, the secular sector supplies most combat soldiers in actual numbers.",
    sectorBars:
      "There is no single sector that leads on every metric. Enlistment, combat and officers behave differently, so one broad conclusion would be too simple.",
    contribution:
      "National contribution is rate multiplied by group size. A small sector with a high rate can still matter less than a large sector with a moderate rate.",
    combatParadox:
      "This separates relative performance from real weight. A sector can sit high on combat rate, but if the bubble is small its actual contribution is limited.",
    genderGap:
      "Sector alone is not enough without gender. In combat service especially, boys and girls are moving through very different service patterns.",
    regionView:
      "Geography is also a proxy for social mix. A lower region is not necessarily performing worse; it may include groups with different enlistment patterns.",
    cities:
      "Municipalities do not follow one path. A city can be strong on general enlistment without being equally strong on combat or officer rates.",
    cityScatter:
      "The upper-right corner is the strongest model: broad enlistment plus high combat service. That combination is rarer than either metric on its own.",
    cityRank:
      "Consistency is the key signal here. A municipality that stays high over time tells a stronger story than one that jumps for a single year.",
    movers:
      "The sharp movers are places for follow-up questions. Not every jump is a true behavior change; some movement can come from which schools entered the data.",
    cityRace:
      "The movement shows whether a city is improving in the same direction or changing pattern. Moving right without moving up means more enlistment, but not necessarily more combat service.",
    cityTrajectories:
      "The path separates trend from volatility. A smooth line suggests gradual change; a broken path suggests instability between years.",
    schoolBeeswarm:
      "The dense area is the typical school pattern. Points far away from that cluster are the schools worth checking individually.",
    schoolProfile:
      "There is no single profile for a strong school. A school can be excellent on enlistment but weaker on officers, so one-dimensional ranking misses part of the story.",
    schoolCloud:
      "Similarity between schools comes from a mix of metrics. Two schools with the same enlistment rate can still differ sharply on combat or officers.",
    leaderboards:
      "The edges are good for finding outliers, not for understanding the whole system. If many schools from one sector appear at an edge, then it starts to look like a real pattern.",
    waffle:
      "Turning rates into 100 youth makes the gap concrete. The drop from “enlisted” to “combat or officers” is where much of the story happens.",
    sankey:
      "The main bottleneck is the step from the cohort into enlistment. After someone enlists, combat and officers are two different outcomes, not steps on one ladder.",
    armyComposition:
      "The long-run composition is a reminder that the army runs on absolute numbers. A strong rate change in a small sector may still barely move the national picture.",
    ridge:
      "This tells us whether change is broad or isolated. If the median moves, the center of the system moved; if only the shape changes, the action may be at the edges.",
    outliers:
      "Municipalities above the line are interesting because they outperform what their enlistment rate predicts. Those are the places to look for local explanations.",
    sectorTerrain:
      "The shape of the surface teaches us about consistency. A sharp peak means many schools behave alike; a spread-out surface means the sector is less predictable from within.",
  },
  panel: {
    exportFallback: "chart",
  },
};

const dictionaries: Record<Locale, Dictionary> = { he, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
