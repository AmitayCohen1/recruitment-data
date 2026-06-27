import type { Locale } from "@/lib/i18n/config";

/** The Hebrew dictionary is the canonical shape; `en` must match it exactly.
 *  Strings that interpolate runtime values are stored as functions so each
 *  locale controls word order. Keys/data values (sectors, regions, gender,
 *  school names) live in the data layer — see lib/i18n/labels.ts. */
const he = {
  meta: {
    title: "מפת גיוס לפי בתי ספר ומגזרים | נתוני צה״ל",
    description:
      "דשבורד אינטראקטיבי להשוואת שיעורי גיוס, שירות קרבי וקצונה לפי בתי ספר, מגזרים, אזורים, שנים ומגדר.",
  },
  nav: {
    switchLanguage: "החלפת שפה",
    otherLanguage: "EN",
  },
  hero: {
    imageAlt: "נתוני גיוס לפי בתי ספר ומגזרים",
    title: "מפת גיוס לפי בתי ספר, מגזרים ואזורים",
    subtitle: (total: string) =>
      `השוואה אינטראקטיבית של ${total} בתי ספר: שיעורי גיוס, שירות קרבי וקצונה לפי מגזר, מגדר ושנה. הממוצעים משוקללים לפי מספר תלמידי י״ב.`,
    feedback: "הערות? כתבו לי",
  },
  tabs: {
    sectors: "מבט-על",
    gaps: "פערים",
    breakdowns: "פילוחים",
    cities: "אזורים וערים",
    search: "בתי ספר",
    sources: "מקורות נתונים",
    lab: "ניסויים",
    three: "תלת-ממד",
  },
  delta: {
    vs: (y: number | string) => `מול ${y}`,
    legend: (y: number | string) =>
      `החיצים: שינוי בנקודות האחוז מול ${y} · ירוק = עלייה, אדום = ירידה`,
  },
  citiesTab: {
    title: "גיוס לפי אזור ועיר",
    subtitle:
      "מהאזור הגאוגרפי ועד הרשות המקומית — דירוג אזורים למעלה, ואחריו השוואת הערים והרשויות.",
  },
  searchTab: {
    title: "חיפוש והשוואת בתי ספר",
    subtitle:
      "מצאו בית ספר או רשות והשוו שיעורי גיוס, קרבי וקצונה לפי שנה ומגדר.",
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
  labTab: {
    title: "זירת ניסויים",
    subtitle:
      "דרכים לא שגרתיות להסתכל על אותם נתונים. ניסיוני — דברים נשברים פה לפעמים.",
  },
  threeTab: {
    title: "הנתונים במרחב",
    subtitle:
      "אותם נתונים, בשלושה ממדים. גררו לסובב, גלגלו לזום. ניסיוני וכבד — דורש דפדפן עם WebGL.",
  },
  armyStream: {
    title: (a: number | string, b: number | string) =>
      `מספר הלוחמים לפי מגזר: ${a} מול ${b}`,
    subtitle:
      "שתי עמודות משוות את מספר הלוחמים המשוקלל בכל שנה. גובה העמודה הוא סך הלוחמים, וכל צבע מציג את חלקו של מגזר.",
    shareTitle: "חלקו של כל מגזר מכלל הלוחמים",
    shareSubtitle:
      "חלקו של כל מגזר מתוך כלל הלוחמים בכל שנה, לפי המספרים המוחלטים המשוקללים. התצוגה מראה תרומה במספר אנשים, לא רק שיעורים.",
    shareNote:
      "ערימה ל־100%: גובה הרצועה = אחוז הלוחמים מאותו מגזר באותה שנה, לא המספר המוחלט.",
    viewCount: "עמודות",
    viewShare: "הרכב לאורך זמן",
  },
  three: {
    barTitle: "שיעורי גיוס, קרבי וקצונה לפי מגזר",
    barSubtitle:
      "כל עמודה מציגה את שיעור הגיוס, השירות הקרבי או הקצונה במגזר אחד. גובה העמודה הוא השיעור באחוזים.",
    barHint: "גררו לסובב · גלגלו לזום · רחפו על עמודה לפרטים",
    cloudTitle: "בתי ספר לפי גיוס, קרבי וקצונה",
    cloudSubtitle: (n: number | string) =>
      `כל נקודה היא בית ספר בשנה אחת בין 2018 ל־2024, ולכן אותו בית ספר יכול להופיע כמה פעמים. ${n} נקודות בסך הכל, צבועות לפי מגזר. הצירים: ימינה = גיוס, למעלה = קרבי, לעומק = קצונה.`,
    cloudHint: "גררו לסובב · גלגלו לזום · רחפו על נקודה · לחצו לנעיצה",
    cloudSearch: "חיפוש בית ספר…",
    cloudNoResults: "אין תוצאות",
    cloudYearTip: (y: number | string) => `שנת ${y}`,
    axisEnlist: "גיוס →",
    axisCombat: "קרבי ↑",
    axisOfficer: "קצונה ↗",
    terrainTitle: "כמה בתי ספר חולקים אותו שילוב גיוס×קרבי",
    terrainSubtitle:
      "כל בית ספר ממוקם על הקרקע לפי שני מספרים: שיעור הגיוס שלו (ציר אחד) ושיעור הקרבי שלו (ציר שני). הגובה בכל נקודה סופר כמה בתי ספר נופלים על אותו שילוב — פסגה = שילוב נפוץ (הרבה בתי ספר), עמק = שילוב נדיר.",
    terrainHint: "גררו לסובב · גלגלו לזום",
    densityLow: "מעט בתי ספר",
    densityHigh: "הרבה בתי ספר",
    sectorTerrainTitle: "יש למגזר “בית ספר טיפוסי”? פסגה אחת מול שטח מפוזר",
    sectorTerrainSubtitle:
      "אותו נוף, מופרד לפי מגזר (גובה = מספר בתי הספר על כל שילוב גיוס×קרבי, מנורמל לכל מגזר בנפרד). פסגה גבוהה וצרה = המגזר אחיד, יש “בית ספר טיפוסי”; שטח נמוך ומרוח = בתי הספר מפוזרים, בלי דפוס אחד. חילוני, דתי-לאומי ודרוזי הם פסגות חדות בגיוס גבוה — חרדי הוא מישור נמוך ומפוזר. כלומר המגזר קובע לא רק כמה מתגייסים, אלא כמה אחידים בתי הספר.",
    terrainViewSingle: "כל בתי הספר",
    terrainViewGrid: "זה לצד זה",
    terrainViewOverlay: "יחד (שכבות)",
    terrainPeakLabel: "כאן מצטופפים רוב בתי הספר",
    schools: (n: number | string) => `${n} בתי ספר`,
    enlistLabel: "גיוס",
    combatLabel: "קרבי",
    officerLabel: "קצונה",
    webglError: "הדפדפן לא תומך ב-WebGL, ולכן אי אפשר להציג את התצוגה התלת-ממדית.",
    loading: "טוען תצוגה תלת-ממדית…",
  },
  lab: {
    waffleTitle: "מתוך 100 בני נוער: גיוס, קרבי וקצונה",
    waffleSubtitle:
      "בכל מגזר, כל ריבוע מייצג בן או בת נוער אחד מתוך 100. כחול מלא = שירות קרבי, סגול = קצונה, כחול חלש = התגייסו אך לא לקרבי או לקצונה.",
    per100: "מתוך 100 בני נוער",
    enlisted: "גויסו",
    combat: "קרביים",
    officer: "קצינים",
    histTitle: "בתי ספר לפי שיעור שירות קרבי",
    histSubtitle:
      "כל נקודה היא בית ספר בשנה האחרונה, צבועה לפי מגזר. המיקום האופקי הוא שיעור השירות הקרבי; העובי האנכי מראה כמה בתי ספר נמצאים סביב אותו שיעור.",
    scatterTitle: "רשויות: גיוס מול שירות קרבי",
    scatterSubtitle:
      "כל נקודה היא רשות עם לפחות 3 בתי ספר. ימינה = שיעור גיוס גבוה יותר מתוך המחזור; למעלה = שיעור קרבי גבוה יותר מתוך המתגייסים. הקווים המקווקווים מסמנים את החציון.",
    qTopRight: "גיוס גבוה · קרבי גבוה",
    qTopLeft: "גיוס נמוך · קרבי גבוה",
    qBottomRight: "גיוס גבוה · קרבי נמוך",
    qBottomLeft: "גיוס נמוך · קרבי נמוך",
    axisEnlist: "שיעור גיוס מתוך המחזור",
    axisCombat: "שיעור קרבי מתוך המתגייסים",
    rank: "מקום",
    scatterTip: (e: number | string, c: number | string) =>
      `גיוס ${e}% · קרבי ${c}%`,
    schools: (n: number | string) => `${n} בתי ספר`,
    bumpTitle: (a: number | string, b: number | string) =>
      `דירוג הערים הגדולות בשירות קרבי: ${a}–${b}`,
    bumpSubtitle:
      "בכל שנה הערים הגדולות מדורגות לפי שיעור השירות הקרבי מול כל הרשויות עם מספיק נתונים. קו גבוה יותר מציין דירוג טוב יותר.",
    moversTitle: (a: number | string, b: number | string) =>
      `השינוי הגדול ביותר בשיעור הקרבי: ${a}–${b}`,
    moversSubtitle:
      "הרשויות שבהן שיעור השירות הקרבי עלה או ירד הכי הרבה בין השנה הראשונה לשנה האחרונה.",
    moversNote:
      "ממוצע בתי ספר לא משוקלל; מוצגות רק רשויות עם 4+ בתי ספר. חלק מהשינוי עשוי לנבוע גם משינוי בהרכב בתי הספר המדווחים בין השנים.",
    unweightedNote:
      "מבוסס על ממוצע בתי הספר ברשות (כל בית ספר במשקל שווה), ולא על שקלול לפי מספר מתגייסים כמו בתצוגות המגזר והאזור — אין נתוני מספרים ברמת בית הספר.",
    risers: "העלייה הגדולה ביותר",
    fallers: "הירידה הגדולה ביותר",
    points: "נק׳",
    raceTitle: "רשויות לאורך זמן: גיוס מול קרבי",
    raceSubtitle:
      "כל בועה היא רשות עם לפחות 3 בתי ספר; גודל הבועה מציג מספר בתי ספר. לחצו על נגן כדי לראות איך הרשויות זזות במרחב גיוס×קרבי משנה לשנה.",
    racePlay: "נגן",
    racePause: "השהה",
    ridgeTitle: "התפלגות שיעור השירות הקרבי לפי שנה",
    ridgeSubtitle:
      "כל רכס הוא שנה אחת ומראה איך שיעור השירות הקרבי מתפלג בין בתי הספר. הפסגה היא הטווח הנפוץ ביותר; הסימן הלבן מציג את החציון.",
    ridgeAxis: "שיעור קרבי מתוך המתגייסים",
    ridgeCount: (nn: number | string) => `${nn} בי״ס`,
    sankeyTitle: "מהמחזור לגיוס, לקרבי ולקצונה",
    sankeySubtitle:
      "מתוך כלל המחזור המשוקלל, כמה מתגייסים; ומתוך המתגייסים, כמה משרתים בקרבי וכמה מגיעים לקצונה. קרבי וקצונה מוצגים כזרמים מקבילים לפי מגזר.",
    sankeyStages: {
      cohort: "מחזור",
      enlist: "מתגייסים",
      combat: "קרביים",
      officer: "קצינים",
    },
    sankeyOfficerLegend: "קצינים (מתוך המתגייסים)",
    sankeyNote:
      "קרבי וקצונה נמדדים שניהם מתוך המתגייסים, ולכן הם שני זרמים מקבילים — לא שלב אחרי שלב. ייתכן חפיפה קלה (קצינים קרביים נכללים בשניהם).",
    outlierTitle: "רשויות מעל ומתחת למגמה",
    outlierSubtitle:
      "הקו המקווקו מראה את הקשר הצפוי בין שיעור הגיוס לשיעור הקרבי. רשויות מעל הקו מפיקות יותר קרביים מהצפוי לפי שיעור הגיוס שלהן; מתחת לקו — פחות.",
    outlierOver: "הרבה מעל הצפוי",
    outlierUnder: "הרבה מתחת לצפוי",
    parallelTitle: "פרופיל בית ספר בשלושה מדדי גיוס",
    parallelSubtitle:
      "כל קו הוא בית ספר בשנה האחרונה, צבוע לפי מגזר, ועובר דרך שלושה צירים: גיוס, קרבי וקצונה. רחפו על קו כדי להדגיש בית ספר.",
    trajTitle: "מסלול הערים בגיוס מול קרבי",
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
      long: "⚔️ שירות קרבי מתוך המתגייסים",
    },
    officer: {
      short: "🎖️ קצונה",
      label: "קצונה מתוך מתגייסים",
      long: "🎖️ קצונה מתוך המתגייסים",
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
    enlist: "מתגייסים",
    combat: "קרביים",
    officer: "קצינים",
  },
  genderGap: {
    title: "פער בין בנים לבנות לפי מגזר",
    subtitle: "הפרש נקודות האחוז בין בנים לבנות בכל מגזר, עבור המדד שנבחר.",
    gap: (g: number | string) => `פער ${g} נק׳`,
    footnote:
      "ערך חיובי מציין שהמדד גבוה יותר אצל בנים; ערך שלילי מציין יתרון לבנות.",
  },
  sectorDonuts: {
    title: "השוואת המדד הנבחר לפי מגזר",
    subtitle: "הערך של כל מגזר במדד ובמגדר שנבחרו.",
  },
  leaderboards: {
    unclassified: "לא מסווג",
    title: "בתי ספר עם הערכים הגבוהים והנמוכים",
    subtitle: "עשרת בתי הספר עם הערכים הגבוהים והנמוכים ביותר במדד שנבחר.",
    topTitle: "10 הערכים הגבוהים ביותר",
    bottomTitle: "10 הערכים הנמוכים ביותר",
    legend: "הנקודה הצבעונית מציינת את המגזר:",
  },
  regionView: {
    title: "אזורים לפי המדד הנבחר",
    subtitle: (label: string) => `דירוג אזורים גאוגרפיים לפי ${label}`,
    footnote: "רוחב העמודה יחסי לערך הגבוה ביותר בתצוגה הנוכחית.",
  },
  subgroups: {
    title: "תת־קבוצות בתוך מגזרים",
    subtitle:
      "השוואה בין תתי־קבוצות בתוך כל מגזר לפי מדדי הגיוס המרכזיים.",
    noData: "אין מספיק תת-קבוצות להצגה עבור צירוף זה.",
    schools: (n: number | string) => `${n} בתי ספר`,
    footnote:
      "רוחב העמודה יחסי לערך הגבוה ביותר בתת-הקבוצות שמוצגות כעת.",
  },
  effectiveRate: {
    title: "כמה מגיעים לקרבי או לקצונה מתוך 100",
    subtitle:
      "בכל מגזר, כמה מכל 100 בני נוער מגיעים בפועל לשירות קרבי או לקצונה.",
    footnote:
      "חישוב המדד: שיעור גיוס מתוך המחזור × שיעור התפקיד מתוך המתגייסים.",
  },
  sectorFunnel: {
    title: "מתוך 100 בני נוער: גיוס, קרבי וקצונה",
    subtitle:
      "בכל מגזר, כמה מתוך 100 בני נוער מתגייסים, כמה מגיעים לשירות קרבי וכמה לקצונה.",
    footnote:
      "כל שלב מוצג ביחס ל־100 בני נוער במחזור, לא רק ביחס למתגייסים.",
  },
  combatParadox: {
    tipEnlist: "שיעור גיוס",
    tipCombat: "שיעור קרבי",
    tipFighters: "לוחמים בפועל",
    title: "שיעור גיוס מול שיעור קרבי",
    subtitle:
      "כל בועה היא מגזר: הציר האופקי מציג שיעור גיוס, הציר האנכי מציג שיעור קרבי, וגודל הבועה מציג את מספר הלוחמים בפועל.",
    axisEnlist: "שיעור גיוס",
    axisCombat: "שיעור קרבי",
    footnote:
      "מגזר יכול להציג שיעור קרבי גבוה אך לתרום מעט לוחמים בפועל (בועה קטנה), ולהפך — שיעור בינוני עם תרומה גדולה (בועה גדולה).",
  },
  contribution: {
    title: "חלקו של כל מגזר במספרים מוחלטים",
    subtitle: (noun: string) =>
      `חלקו של כל מגזר מכלל ה${noun} בארץ. כאן מודדים מספר אנשים, ולכן שיעור גבוה לא תמיד אומר תרומה גדולה.`,
    ofEnlistees: (rate: number | string) => `(${rate}% מהמתגייסים)`,
    footnote:
      "מגזר גדול עם שיעור בינוני עשוי לספק יותר לוחמים ממגזר קטן עם שיעור גבוה. המספרים המוחלטים מוערכים לפי גודל המחזור ושיעור המדד.",
  },
  heatmap: {
    title: "שיעורי גיוס, קרבי וקצונה לפי מגזר ומגדר",
    subtitle:
      "כל תא מציג שיעור באחוזים עבור מגזר ומגדר. צבע כהה יותר מציין ערך גבוה יותר בתוך אותו מדד.",
    sectorHeader: "מגזר",
    footnote:
      "הצבע מחושב בנפרד לכל מדד, כדי להבליט מי גבוה או נמוך בתוך אותה עמודה.",
  },
  trend: {
    title: "מגמה לאורך זמן, 2018–2024",
    subtitle: (label: string, gender: string) =>
      `שינוי המדד בכל מגזר לאורך השנים · ${label} · ${gender}`,
  },
  notes: {
    title: "הערות, מקורות והבהרות",
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
    title: "הורדת קובצי הנתונים",
    subtitle: "קובצי Excel להמשך בדיקה, הצלבה או ניתוח עצמאי של הנתונים.",
    footnote:
      "הנתונים התקבלו מצה״ל במסגרת חוק חופש המידע, באדיבות התנועה לחופש המידע.",
    items: [
      {
        title: "קובץ נתונים מצרפי מלא",
        desc: "פילוח לפי מגזר, תת-קבוצה, אזור ומגדר — כולל שיעורי גיוס, קרבי, קצונה ומספרים מוחלטים לשנים 2018 ו־2024.",
      },
      {
        title: "קובץ נתונים ברמת בית ספר",
        desc: "נתוני המקור לכל בית ספר בנפרד, כולל רשות, שנה, מגדר ומדדי הגיוס הזמינים.",
      },
    ],
  },
  explorer: {
    colSchool: "בית ספר",
    colMeaning: "שירות משמעותי",
    colMeaningShort: "משמעותי",
    title: "טבלת השוואה לפי בית ספר",
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
    title: "רשויות לפי המדד הנבחר",
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
    analysisTitle: "מה אפשר ללמוד",
  },
};

export type Dictionary = typeof he;

const en: Dictionary = {
  meta: {
    title: "Enlistment Map by School and Sector | IDF Data",
    description:
      "An interactive dashboard comparing enlistment, combat and officer rates by school, sector, region, year and gender.",
  },
  nav: {
    switchLanguage: "Switch language",
    otherLanguage: "עב",
  },
  hero: {
    imageAlt: "Enlistment data by school and sector",
    title: "Enlistment Map by School, Sector and Region",
    subtitle: (total: string) =>
      `An interactive comparison of ${total} schools: enlistment, combat and officer rates by sector, gender and year. Averages are weighted by the number of 12th-grade students.`,
    feedback: "Feedback? Message me",
  },
  tabs: {
    sectors: "Overview",
    gaps: "Gaps",
    breakdowns: "Breakdowns",
    cities: "Regions & Cities",
    search: "Schools",
    sources: "Data Sources",
    lab: "Lab",
    three: "3D",
  },
  delta: {
    vs: (y: number | string) => `vs ${y}`,
    legend: (y: number | string) =>
      `Arrows: change in percentage points vs ${y} · green = up, red = down`,
  },
  citiesTab: {
    title: "Enlistment by Region & City",
    subtitle:
      "From the geographic region down to the local municipality — regions ranked first, then a comparison of cities and municipalities.",
  },
  searchTab: {
    title: "Search & Compare Schools",
    subtitle:
      "Find a school or municipality and compare enlistment, combat and officer rates by year and gender.",
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
  labTab: {
    title: "The Lab",
    subtitle:
      "Unconventional ways to look at the same data. Experimental — things break here sometimes.",
  },
  threeTab: {
    title: "The Data in Space",
    subtitle:
      "The same data, in three dimensions. Drag to rotate, scroll to zoom. Experimental and heavy — needs a WebGL-capable browser.",
  },
  armyStream: {
    title: (a: number | string, b: number | string) =>
      `Combat soldiers by sector: ${a} vs ${b}`,
    subtitle:
      "Two stacked bars compare the weighted number of combat soldiers in each year. Bar height is the total, and each color shows one sector's share.",
    shareTitle: "Each Sector's Share of Combat Soldiers",
    shareSubtitle:
      "Each sector's share of all combat soldiers, year by year, based on weighted absolute counts. This shows contribution by people, not just rates.",
    shareNote:
      "100%-stacked: a band's height is that sector's share of combat soldiers that year, not the absolute number.",
    viewCount: "Bars",
    viewShare: "Composition over time",
  },
  three: {
    barTitle: "Enlistment, Combat and Officer Rates by Sector",
    barSubtitle:
      "Each bar shows one sector's enlistment, combat-service or officer rate. Bar height is the percentage rate.",
    barHint: "Drag to rotate · scroll to zoom · hover a bar for details",
    cloudTitle: "Schools by Enlistment, Combat and Officers",
    cloudSubtitle: (n: number | string) =>
      `Each point is one school in one year from 2018 to 2024, so the same school may appear more than once. ${n} points in total, colored by sector. Axes: right = enlistment, up = combat, depth = officers.`,
    cloudHint: "Drag to rotate · scroll to zoom · hover a point · click to pin",
    cloudSearch: "Search a school…",
    cloudNoResults: "No matches",
    cloudYearTip: (y: number | string) => `Year ${y}`,
    axisEnlist: "Enlist →",
    axisCombat: "Combat ↑",
    axisOfficer: "Officer ↗",
    terrainTitle: "How many schools share the same enlist×combat mix",
    terrainSubtitle:
      "Each school is placed on the ground by two numbers: its enlistment rate (one axis) and its combat rate (the other). The height at any point counts how many schools land on that combination — a peak = a common mix (many schools), a valley = a rare one.",
    terrainHint: "Drag to rotate · scroll to zoom",
    densityLow: "Fewer schools",
    densityHigh: "More schools",
    sectorTerrainTitle: "Does a sector have a “typical school”? One spike vs a scattered plain",
    sectorTerrainSubtitle:
      "The same landscape, split by sector (height = number of schools at each enlist×combat mix, normalized per sector). A tall, narrow spike = the sector is uniform — there's a “typical school”; a low, spread-out sheet = schools are all over the place, with no single pattern. Secular, national-religious and Druze are sharp spikes at high enlistment — Haredi is a low, sprawling plain. So sector predicts not just how much schools enlist, but how consistent they are.",
    terrainViewSingle: "All schools",
    terrainViewGrid: "Side by side",
    terrainViewOverlay: "Together (layers)",
    terrainPeakLabel: "Most schools cluster here",
    schools: (n: number | string) => `${n} schools`,
    enlistLabel: "Enlist",
    combatLabel: "Combat",
    officerLabel: "Officer",
    webglError: "Your browser doesn't support WebGL, so the 3D view can't render.",
    loading: "Loading 3D view…",
  },
  lab: {
    waffleTitle: "Out of 100 Youth: Enlistment, Combat and Officers",
    waffleSubtitle:
      "In each sector, every square represents one young person out of 100. Solid blue = combat service, purple = officers, faint blue = enlisted but not combat or officer.",
    per100: "of 100 youth",
    enlisted: "enlisted",
    combat: "combat",
    officer: "officers",
    histTitle: "Schools by Combat-Service Rate",
    histSubtitle:
      "Each dot is one school in the latest year, colored by sector. The horizontal position is the combat-service rate; vertical thickness shows how many schools cluster around that rate.",
    scatterTitle: "Municipalities: Enlistment vs. Combat Service",
    scatterSubtitle:
      "Each dot is a municipality with at least 3 schools. Right = a higher enlistment rate out of the cohort; up = a higher combat-service rate among enlistees. Dashed lines mark the medians.",
    qTopRight: "High enlist · high combat",
    qTopLeft: "Low enlist · high combat",
    qBottomRight: "High enlist · low combat",
    qBottomLeft: "Low enlist · low combat",
    axisEnlist: "Enlistment rate (of cohort)",
    axisCombat: "Combat rate (of enlistees)",
    rank: "rank",
    scatterTip: (e: number | string, c: number | string) =>
      `Enlist ${e}% · combat ${c}%`,
    schools: (n: number | string) => `${n} schools`,
    bumpTitle: (a: number | string, b: number | string) =>
      `Largest Cities Ranked by Combat Service: ${a}–${b}`,
    bumpSubtitle:
      "Each year, the largest cities are ranked by combat-service rate against all municipalities with enough data. A higher line means a better rank.",
    moversTitle: (a: number | string, b: number | string) =>
      `Biggest Changes in Combat-Service Rate: ${a}–${b}`,
    moversSubtitle:
      "The municipalities where combat-service rate rose or fell the most between the first and latest year.",
    moversNote:
      "Unweighted school average; only municipalities with 4+ schools are shown. Part of a change may also come from which schools reported in each year.",
    unweightedNote:
      "Based on the plain average of the municipality's schools (each school weighted equally), not enlistee-weighted like the sector and region views — there are no per-school head-counts.",
    risers: "Biggest rise",
    fallers: "Biggest drop",
    points: "pts",
    raceTitle: "Municipalities Over Time: Enlistment vs. Combat",
    raceSubtitle:
      "Each bubble is a municipality with at least 3 schools; bubble size shows school count. Press play to see municipalities move through enlistment×combat space year by year.",
    racePlay: "Play",
    racePause: "Pause",
    ridgeTitle: "Combat-Service Rate Distribution by Year",
    ridgeSubtitle:
      "Each ridge is one year and shows how combat-service rates are distributed across schools. The peak is the most common range; the white marker shows that year's median.",
    ridgeAxis: "Combat rate (of enlistees)",
    ridgeCount: (nn: number | string) => `${nn} schools`,
    sankeyTitle: "From Cohort to Enlistment, Combat and Officers",
    sankeySubtitle:
      "Out of the weighted cohort, this shows how many enlist; and out of enlistees, how many serve in combat and how many become officers. Combat and officers are parallel streams by sector.",
    sankeyStages: {
      cohort: "Cohort",
      enlist: "Enlisted",
      combat: "Combat",
      officer: "Officers",
    },
    sankeyOfficerLegend: "Officers (of enlistees)",
    sankeyNote:
      "Combat and officers are both measured out of enlistees, so they're two parallel streams — not sequential stages. They can overlap slightly (combat officers count in both).",
    outlierTitle: "Municipalities Above and Below the Trend",
    outlierSubtitle:
      "The dashed line shows the expected link between enlistment rate and combat-service rate. Municipalities above it produce more combat soldiers than their enlistment rate predicts; below it, fewer.",
    outlierOver: "Far above expected",
    outlierUnder: "Far below expected",
    parallelTitle: "School Profile Across Three Enlistment Metrics",
    parallelSubtitle:
      "Each line is one school in the latest year, colored by sector, crossing three axes: enlistment, combat and officers. Hover a line to highlight a school.",
    trajTitle: "City Paths Through Enlistment vs. Combat",
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
    enlist: "Enlistees",
    combat: "Combat",
    officer: "Officers",
  },
  genderGap: {
    title: "Boys-Girls Gap by Sector",
    subtitle:
      "The percentage-point difference between boys and girls in each sector for the selected metric.",
    gap: (g: number | string) => `${g} pt gap`,
    footnote:
      "A positive value means the metric is higher for boys; a negative value means an advantage for girls.",
  },
  sectorDonuts: {
    title: "Selected Metric Compared by Sector",
    subtitle: "Each sector's value for the selected metric and gender.",
  },
  leaderboards: {
    unclassified: "Unclassified",
    title: "Schools With the Highest and Lowest Values",
    subtitle:
      "The ten schools with the highest and lowest values on the selected metric.",
    topTitle: "10 highest values",
    bottomTitle: "10 lowest values",
    legend: "The colored dot indicates the sector:",
  },
  regionView: {
    title: "Regions by Selected Metric",
    subtitle: (label: string) => `Geographic regions ranked by ${label}`,
    footnote: "Bar width is relative to the highest value in the current view.",
  },
  subgroups: {
    title: "Subgroups Within Sectors",
    subtitle:
      "Comparing subgroups within each sector on the main enlistment metrics.",
    noData: "Not enough subgroups to display for this combination.",
    schools: (n: number | string) => `${n} schools`,
    footnote:
      "Bar width is relative to the highest value among the subgroups shown.",
  },
  effectiveRate: {
    title: "How Many Reach Combat or Officer Rank out of 100",
    subtitle:
      "For each sector, how many of every 100 youth actually reach combat service or officer rank.",
    footnote:
      "How it's computed: enlistment rate of the cohort × the role's rate among enlistees.",
  },
  sectorFunnel: {
    title: "Out of 100 Youth: Enlistment, Combat and Officers",
    subtitle:
      "For each sector, how many of every 100 youth enlist, reach combat service and reach officer rank.",
    footnote:
      "Each stage is shown relative to 100 youth in the cohort, not just relative to enlistees.",
  },
  combatParadox: {
    tipEnlist: "Enlistment rate",
    tipCombat: "Combat rate",
    tipFighters: "Actual combat soldiers",
    title: "Enlistment Rate vs. Combat-Service Rate",
    subtitle:
      "Each bubble is a sector: the horizontal axis shows enlistment rate, the vertical axis shows combat-service rate, and bubble size shows the actual number of combat soldiers.",
    axisEnlist: "Enlistment rate",
    axisCombat: "Combat rate",
    footnote:
      "A sector can show a high combat rate yet contribute few actual combat soldiers (a small bubble), and vice versa — a moderate rate with a large contribution (a big bubble).",
  },
  contribution: {
    title: "Each Sector's Share in Absolute Numbers",
    subtitle: (noun: string) =>
      `Each sector's share of all ${noun} in the country. This counts people, so a high rate is not always a large contribution.`,
    ofEnlistees: (rate: number | string) => `(${rate}% of enlistees)`,
    footnote:
      "A large sector with a moderate rate may supply more combat soldiers than a small sector with a high rate. Absolute numbers are estimated from cohort size and the metric rate.",
  },
  heatmap: {
    title: "Enlistment, Combat and Officer Rates by Sector and Gender",
    subtitle:
      "Each cell shows a percentage rate for one sector and gender. Darker color means a higher value within that metric.",
    sectorHeader: "Sector",
    footnote:
      "Color is computed separately per metric, to highlight who is high or low within the same column.",
  },
  trend: {
    title: "Trend Over Time, 2018–2024",
    subtitle: (label: string, gender: string) =>
      `How the metric changed in each sector over time · ${label} · ${gender}`,
  },
  notes: {
    title: "Notes, Sources & Clarifications",
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
    title: "Download the Data Files",
    subtitle:
      "Excel files for further checking, cross-referencing or independent analysis of the data.",
    footnote:
      "The data was obtained from the IDF under the Freedom of Information Act, courtesy of the Movement for Freedom of Information.",
    items: [
      {
        title: "Full aggregate data file",
        desc: "Broken down by sector, subgroup, region and gender — including enlistment, combat and officer rates and absolute numbers for 2018 and 2024.",
      },
      {
        title: "School-level data file",
        desc: "The source data for each school individually, including municipality, year, gender and the available enlistment metrics.",
      },
    ],
  },
  explorer: {
    colSchool: "School",
    colMeaning: "Meaningful service",
    colMeaningShort: "Meaningful",
    title: "School Comparison Table",
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
    title: "Municipalities by Selected Metric",
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
    analysisTitle: "What This Suggests",
  },
};

const dictionaries: Record<Locale, Dictionary> = { he, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
