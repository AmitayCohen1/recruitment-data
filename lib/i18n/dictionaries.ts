import type { Locale } from "@/lib/i18n/config";

/** The Hebrew dictionary is the canonical shape; `en` must match it exactly.
 *  Strings that interpolate runtime values are stored as functions so each
 *  locale controls word order. Keys/data values (sectors, regions, gender,
 *  school names) live in the data layer — see lib/i18n/labels.ts. */
const he = {
  meta: {
    title: "מפת גיוס לפי בתי ספר ומגזרים | נתוני צה״ל",
    description:
      "דשבורד אינטראקטיבי להשוואת שיעורי גיוס, שירות קרבי, קצונה ושירות משמעותי לפי בתי ספר, מגזרים, אזורים, שנים ומגדר.",
  },
  nav: {
    switchLanguage: "החלפת שפה",
    otherLanguage: "EN",
  },
  hero: {
    imageAlt: "נתוני גיוס לפי בתי ספר ומגזרים",
    title: "מפת גיוס לפי בתי ספר, מגזרים ואזורים",
    subtitle: (total: string) =>
      `השוואה אינטראקטיבית של ${total} בתי ספר: שיעורי גיוס, שירות קרבי, קצונה ושירות משמעותי לפי מגזר, מגדר ושנה. הממוצעים משוקללים לפי מספר תלמידי י״ב.`,
    feedback: "הערות? כתבו לי",
  },
  tabs: {
    sectors: "מבט-על",
    gaps: "פערים",
    breakdowns: "פילוחים",
    cities: "אזורים וערים",
    search: "חיפוש בתי ספר",
    sources: "מקורות נתונים",
    lab: "ניסויים",
    three: "תלת-ממד",
    d3: "D3",
  },
  citiesTab: {
    title: "גיוס לפי אזור ועיר",
    subtitle:
      "מהאזור הגאוגרפי ועד הרשות המקומית — דירוג אזורים למעלה, ואחריו השוואת הערים והרשויות.",
  },
  searchTab: {
    title: "חיפוש והשוואת בתי ספר",
    subtitle:
      "מצאו בית ספר או רשות והשוו שיעורי גיוס, קרבי, קצונה ושירות משמעותי לפי שנה ומגדר.",
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
  d3Tab: {
    title: "D3 ו-Visx",
    subtitle:
      "אותם נתונים, דרך מנוע הויזואליזציה של D3: סימולציית כוחות, מפות צפיפות, היררכיות וזרמים. ניסיוני.",
  },
  d3: {
    beeTitle: "נחיל כוחות: כל בית ספר נמצא את מקומו",
    beeSubtitle:
      "כל נקודה היא בית ספר, צבועה לפי מגזר. סימולציית כוחות (d3-force) דוחפת כל נקודה לעבר השיעור שלה על הציר ומונעת חפיפה — הצפיפות האמיתית מתגלה מעצמה.",
    contourTitle: "מפת צפיפות: גיוס מול קרבי",
    contourSubtitle:
      "במקום נקודות בודדות, שדה צפיפות חלק (d3-contour) מראה היכן באמת מתרכזים בתי הספר במרחב הגיוס×קרבי. אזורים בהירים = ריכוז גבוה.",
    voronoiTitle: "פיזור עם וורונוי: ריחוף בכל מקום",
    voronoiSubtitle:
      "כל רשות היא נקודה. רשת וורונוי (d3-delaunay) מחלקת את כל השטח לתאים, כך שריחוף בכל מקום קופץ לרשות הקרובה ביותר — אין צורך לכוון לנקודה זעירה.",
    treemapTitle: "מפת עץ: המגזרים והערים שלהם",
    treemapSubtitle:
      "כל מלבן הוא רשות, מקובצת לפי מגזר. גודל = מספר בתי הספר; עוצמת הצבע = שיעור הקרבי. מבנה הצבא במבט אחד.",
    packTitle: "אריזת מעגלים: אותה היררכיה, צורה אחרת",
    packSubtitle:
      "אותם נתונים כמו מפת העץ, אבל כמעגלים מקוננים. גודל = מספר בתי הספר; עוצמת הצבע = שיעור הקרבי.",
    streamTitle: "זרם: מי ממלא את הצבא לאורך הזמן",
    streamSubtitle:
      "מספר הלוחמים (משוקלל) מכל מגזר בכל שנה, כזרם רציף (d3-shape). עובי הזרם = מספר הלוחמים מאותו מגזר באותה שנה.",
    densityLow: "צפיפות נמוכה",
    densityHigh: "צפיפות גבוהה",
  },
  three: {
    barTitle: "השוואת המגזרים בתלת-ממד",
    barSubtitle:
      "אותו סיפור מרכזי — שיעורי גיוס, קרבי וקצונה לכל מגזר — כמערך עמודות תלת-ממדי. גובה העמודה = השיעור. גררו לסובב.",
    barHint: "גררו לסובב · גלגלו לזום · רחפו על עמודה לפרטים",
    donutTitle: "מי ממלא את הצבא? פילוח לוחמים",
    donutSubtitle:
      "חלקו של כל מגזר מתוך כלל הלוחמים בשנה האחרונה (לפי המספרים המשוקללים), כעוגה תלת-ממדית.",
    donutHint: "גררו לסובב · גלגלו לזום · רחפו על פלח לפרטים",
    shareTip: (share: number | string, count: number | string) =>
      `${share}% · ${count} לוחמים`,
    cloudTitle: "כל בית ספר כנקודה במרחב",
    cloudSubtitle:
      "כל נקודה היא בית ספר בשנה האחרונה, צבועה לפי מגזר. הצירים: ימינה = שיעור גיוס, למעלה = שיעור קרבי, לעומק = שיעור קצונה. גררו לסובב את הענן.",
    cloudHint: "גררו לסובב · גלגלו לזום · רחפו על נקודה לפרטים",
    axisEnlist: "גיוס →",
    axisCombat: "קרבי ↑",
    axisOfficer: "קצונה ↗",
    skylineTitle: "קו הרקיע של הגיוס",
    skylineSubtitle:
      "כל מגדל הוא רשות עם 3+ בתי ספר, מסודרים לפי שיעור הגיוס. גובה המגדל = שיעור הקרבי; שטח הבסיס = מספר בתי הספר. הערים הגדולות מודגשות.",
    skylineHint: "גררו לסובב · גלגלו לזום · רחפו על מגדל לפרטים",
    schools: (n: number | string) => `${n} בתי ספר`,
    enlistLabel: "גיוס",
    combatLabel: "קרבי",
    officerLabel: "קצונה",
    webglError: "הדפדפן לא תומך ב-WebGL, ולכן אי אפשר להציג את התצוגה התלת-ממדית.",
    loading: "טוען תצוגה תלת-ממדית…",
  },
  lab: {
    waffleTitle: "מה קורה מתוך 100 בני נוער?",
    waffleSubtitle:
      "בכל מגזר, כל ריבוע מייצג בן או בת נוער מתוך 100. כחול מלא = שירתו בקרבי, סגול = קצינים (פלח נפרד מתוך המתגייסים, לא חלק מהקרביים), כחול חלש = התגייסו אך לא קרבי/קצונה.",
    per100: "מתוך 100 בני נוער",
    enlisted: "גויסו",
    combat: "קרביים",
    officer: "קצינים",
    histTitle: "כל בית ספר כנקודה",
    histSubtitle:
      "כל נקודה היא בית ספר אחד בשנה האחרונה, צבועה לפי מגזר. ימינה = שיעור קרבי גבוה יותר; טור גבוה = הרבה בתי ספר סביב אותו שיעור.",
    scatterTitle: "גיוס מול שירות קרבי ברשויות",
    scatterSubtitle:
      "כל נקודה היא רשות עם 3+ בתי ספר. ימינה = יותר מתגייסים מתוך המחזור; למעלה = יותר קרביים מתוך המתגייסים. הקווים המקווקווים מסמנים את החציון, ולחיצה על נקודה מציגה או מסתירה את שם הרשות.",
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
      `דירוג הערים הגדולות לאורך זמן: ${a}–${b}`,
    bumpSubtitle:
      "בכל שנה הערים הגדולות מדורגות לפי שיעור השירות הקרבי שלהן מול כל הרשויות עם מספיק נתונים. קו גבוה יותר = דירוג טוב יותר.",
    moversTitle: (a: number | string, b: number | string) =>
      `איפה שיעור הקרבי השתנה הכי הרבה? ${a}–${b}`,
    moversSubtitle:
      "הרשויות עם העלייה או הירידה הגדולה ביותר בשיעור השירות הקרבי בין השנה הראשונה לאחרונה.",
    moversNote:
      "ממוצע בתי ספר לא משוקלל; מוצגות רק רשויות עם 4+ בתי ספר. חלק מהשינוי עשוי לנבוע גם משינוי בהרכב בתי הספר המדווחים בין השנים.",
    unweightedNote:
      "מבוסס על ממוצע בתי הספר ברשות (כל בית ספר במשקל שווה), ולא על שקלול לפי מספר מתגייסים כמו בתצוגות המגזר והאזור — אין נתוני מספרים ברמת בית הספר.",
    risers: "העלייה הגדולה ביותר",
    fallers: "הירידה הגדולה ביותר",
    points: "נק׳",
    raceTitle: "מרוץ הרשויות לאורך השנים",
    raceSubtitle:
      "כל בועה היא רשות עם 3+ בתי ספר; הגודל לפי מספר בתי הספר. לחצו על נגן וצפו איך כל רשות נעה במרחב גיוס×קרבי משנה לשנה. הערים הגדולות מודגשות בכחול.",
    racePlay: "נגן",
    racePause: "השהה",
    compTitle: "מי באמת ממלא את הצבא?",
    compSubtitle:
      "חלקו של כל מגזר מתוך כלל הלוחמים בכל שנה (לפי המספרים המוחלטים המשוקללים). השיעורים מספרים סיפור אחד — ראשי הנפשות מספרים אחר.",
    compNote:
      "ערימה ל־100%: גובה הרצועה = אחוז הלוחמים מאותו מגזר באותה שנה, לא המספר המוחלט.",
    ridgeTitle: "התפלגות השירות הקרבי, שנה אחר שנה",
    ridgeSubtitle:
      "כל רכס הוא שנה אחת: ההתפלגות של שיעור השירות הקרבי על פני כל בתי הספר. הפסגה = השיעור הנפוץ ביותר; הסימן הלבן והמספר = החציון של אותה שנה. הקו המקווקו מחבר את החציונים, כך רואים לאן מרכז ההתפלגות נע (אצל בנות הוא מטפס בבירור).",
    ridgeAxis: "שיעור קרבי מתוך המתגייסים",
    ridgeCount: (nn: number | string) => `${nn} בי״ס`,
    sankeyTitle: "הצינור: מהמחזור ללחימה ולקצונה",
    sankeySubtitle:
      "מתוך כלל המחזור (משוקלל), כמה מתגייסים. מתוך המתגייסים — כמה משרתים בקרבי וכמה מגיעים לקצונה, כשני זרמים מקבילים (לא זה אחרי זה). בפילוח לפי מגזר; רוחב הזרם יחסי למספר האנשים.",
    sankeyStages: {
      cohort: "מחזור",
      enlist: "מתגייסים",
      combat: "קרביים",
      officer: "קצינים",
    },
    sankeyOfficerLegend: "קצינים (מתוך המתגייסים)",
    sankeyNote:
      "קרבי וקצונה נמדדים שניהם מתוך המתגייסים, ולכן הם שני זרמים מקבילים — לא שלב אחרי שלב. ייתכן חפיפה קלה (קצינים קרביים נכללים בשניהם).",
    outlierTitle: "מי חורג מהמגמה?",
    outlierSubtitle:
      "הקו המקווקו הוא הקשר הצפוי בין שיעור הגיוס לשיעור הקרבי בכל הרשויות. רשויות הרחק מעל הקו מפיקות הרבה יותר קרביים ממה שהגיוס שלהן מנבא; הרחק מתחת — הרבה פחות.",
    outlierOver: "הרבה מעל הצפוי",
    outlierUnder: "הרבה מתחת לצפוי",
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
    title: "פערי מגדר לפי מגזר",
    subtitle: "הפרש נקודות האחוז בין בנים לבנות בכל מגזר.",
    gap: (g: number | string) => `פער ${g} נק׳`,
    footnote:
      "ערך חיובי מציין שהמדד גבוה יותר אצל בנים; ערך שלילי מציין יתרון לבנות.",
  },
  sectorDonuts: {
    title: "מדד נבחר לפי מגזר",
    subtitle: "השוואה מהירה של כל מגזר במדד שנבחר.",
  },
  leaderboards: {
    unclassified: "לא מסווג",
    title: "בתי ספר בקצוות המדד",
    subtitle: "עשרת בתי הספר עם הערכים הגבוהים והנמוכים ביותר במדד שנבחר.",
    topTitle: "עשרת הערכים הגבוהים ביותר",
    bottomTitle: "עשרת הערכים הנמוכים ביותר",
    legend: "הנקודה הצבעונית מציינת את המגזר:",
  },
  regionView: {
    title: "דירוג אזורים לפי מדד",
    subtitle: (label: string) => `השוואה בין אזורים גאוגרפיים · ${label}`,
    footnote: "רוחב העמודה יחסי לערך הגבוה ביותר בתצוגה הנוכחית.",
  },
  subgroups: {
    title: "תת-קבוצות בתוך כל מגזר",
    subtitle:
      "השוואה בין תתי-הקבוצות בתוך כל מגזר לפי מדדי הגיוס המרכזיים.",
    noData: "אין מספיק תת-קבוצות להצגה עבור צירוף זה.",
    schools: (n: number | string) => `${n} בתי ספר`,
    footnote:
      "רוחב העמודה יחסי לערך הגבוה ביותר בתת-הקבוצות שמוצגות כעת.",
  },
  effectiveRate: {
    title: "לוחמים וקצינים מתוך 100 בני נוער",
    subtitle:
      "כמה מכל 100 בני נוער מגיעים בפועל לשירות קרבי או לקצונה בכל מגזר.",
    footnote:
      "חישוב המדד: שיעור גיוס מתוך המחזור × שיעור התפקיד מתוך המתגייסים.",
  },
  sectorFunnel: {
    title: "מסלול הגיוס בכל מגזר",
    subtitle:
      "כמה מתוך 100 בני נוער עוברים מגיוס ללחימה ולקצונה בכל מגזר.",
    footnote:
      "כל שלב מוצג ביחס ל־100 בני נוער במחזור, לא רק ביחס למתגייסים.",
  },
  combatParadox: {
    tipEnlist: "שיעור גיוס",
    tipCombat: "שיעור קרבי",
    tipFighters: "לוחמים בפועל",
    title: "גיוס מול שירות קרבי",
    subtitle:
      "כל בועה היא מגזר — מיקום לפי שיעור גיוס (אופקי) ושיעור קרבי (אנכי), וגודל הבועה לפי מספר הלוחמים בפועל.",
    axisEnlist: "שיעור גיוס",
    axisCombat: "שיעור קרבי",
    footnote:
      "מגזר יכול להציג שיעור קרבי גבוה אך לתרום מעט לוחמים בפועל (בועה קטנה), ולהפך — שיעור בינוני עם תרומה גדולה (בועה גדולה).",
  },
  contribution: {
    title: "תרומה בפועל במספרים מוחלטים",
    subtitle: (noun: string) =>
      `חלקו של כל מגזר מכלל ה${noun} בארץ — שיעור גבוה אינו בהכרח תרומה גדולה.`,
    ofEnlistees: (rate: number | string) => `(${rate}% מהמתגייסים)`,
    footnote:
      "מגזר גדול עם שיעור בינוני עשוי לספק יותר לוחמים ממגזר קטן עם שיעור גבוה. המספרים המוחלטים מוערכים לפי גודל המחזור ושיעור המדד.",
  },
  heatmap: {
    title: "מפת מדדים לפי מגזר ומגדר",
    subtitle:
      "שיעור גיוס, שירות קרבי וקצונה לכל מגזר ולכל מגדר. צבע כהה יותר מציין ערך גבוה יותר.",
    sectorHeader: "מגזר",
    footnote:
      "הצבע מחושב בנפרד לכל מדד, כדי להבליט מי גבוה או נמוך בתוך אותה עמודה.",
  },
  trend: {
    title: "מ‑2018 ל‑2024",
    subtitle: (label: string, gender: string) =>
      `המגמה בכל מגזר לאורך התקופה · ${label} · ${gender}`,
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
  },
  cities: {
    colCouncil: "רשות",
    colCount: "בתי ספר",
    colCountShort: "בת״ס",
    colMeaning: "שירות משמעותי",
    colMeaningShort: "משמעותי",
    title: "השוואת רשויות",
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
  panel: {
    exportFallback: "תרשים",
  },
};

export type Dictionary = typeof he;

const en: Dictionary = {
  meta: {
    title: "Enlistment Map by School and Sector | IDF Data",
    description:
      "An interactive dashboard comparing enlistment, combat, officer and meaningful-service rates by school, sector, region, year and gender.",
  },
  nav: {
    switchLanguage: "Switch language",
    otherLanguage: "עב",
  },
  hero: {
    imageAlt: "Enlistment data by school and sector",
    title: "Enlistment Map by School, Sector and Region",
    subtitle: (total: string) =>
      `An interactive comparison of ${total} schools: enlistment, combat, officer and meaningful-service rates by sector, gender and year. Averages are weighted by the number of 12th-grade students.`,
    feedback: "Feedback? Message me",
  },
  tabs: {
    sectors: "Overview",
    gaps: "Gaps",
    breakdowns: "Breakdowns",
    cities: "Regions & Cities",
    search: "School Search",
    sources: "Data Sources",
    lab: "Lab",
    three: "3D",
    d3: "D3",
  },
  citiesTab: {
    title: "Enlistment by Region & City",
    subtitle:
      "From the geographic region down to the local municipality — regions ranked first, then a comparison of cities and municipalities.",
  },
  searchTab: {
    title: "Search & Compare Schools",
    subtitle:
      "Find a school or municipality and compare enlistment, combat, officer and meaningful-service rates by year and gender.",
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
  d3Tab: {
    title: "D3 & Visx",
    subtitle:
      "The same data through D3's visualization engine: a force simulation, density fields, hierarchies and streams. Experimental.",
  },
  d3: {
    beeTitle: "Force swarm: every school finds its place",
    beeSubtitle:
      "Each dot is a school, colored by sector. A force simulation (d3-force) pushes every dot toward its rate on the axis while preventing overlap — the real density emerges on its own.",
    contourTitle: "Density field: enlistment vs combat",
    contourSubtitle:
      "Instead of scattered dots, a smooth density field (d3-contour) shows where schools actually cluster in enlist×combat space. Brighter regions = higher concentration.",
    voronoiTitle: "Voronoi scatter: hover anywhere",
    voronoiSubtitle:
      "Each municipality is a dot. A Voronoi mesh (d3-delaunay) tiles the whole area into cells, so hovering anywhere snaps to the nearest city — no need to aim at a tiny dot.",
    treemapTitle: "Treemap: sectors and their cities",
    treemapSubtitle:
      "Each rectangle is a municipality, grouped by sector. Size = number of schools; color intensity = combat rate. The army's composition at a glance.",
    packTitle: "Circle packing: same hierarchy, another shape",
    packSubtitle:
      "The same data as the treemap, but as nested circles. Size = number of schools; color intensity = combat rate.",
    streamTitle: "Stream: who fills the army over time",
    streamSubtitle:
      "The (weighted) number of combat soldiers from each sector per year, as a flowing stream (d3-shape). Stream thickness = soldiers from that sector that year.",
    densityLow: "Lower density",
    densityHigh: "Higher density",
  },
  three: {
    barTitle: "Sectors compared, in 3D",
    barSubtitle:
      "The same core story — enlistment, combat and officer rates per sector — as a 3D bar matrix. Bar height = the rate. Drag to rotate.",
    barHint: "Drag to rotate · scroll to zoom · hover a bar for details",
    donutTitle: "Who fills the army? Soldier breakdown",
    donutSubtitle:
      "Each sector's share of all combat soldiers in the latest year (weighted counts), as a 3D pie.",
    donutHint: "Drag to rotate · scroll to zoom · hover a slice for details",
    shareTip: (share: number | string, count: number | string) =>
      `${share}% · ${count} fighters`,
    cloudTitle: "Every school as a point in space",
    cloudSubtitle:
      "Each point is a school in the latest year, colored by sector. Axes: right = enlistment rate, up = combat rate, depth = officer rate. Drag to rotate the cloud.",
    cloudHint: "Drag to rotate · scroll to zoom · hover a point for details",
    axisEnlist: "Enlist →",
    axisCombat: "Combat ↑",
    axisOfficer: "Officer ↗",
    skylineTitle: "The skyline of recruitment",
    skylineSubtitle:
      "Each tower is a municipality with 3+ schools, ordered by enlistment rate. Tower height = combat rate; footprint = number of schools. Big cities are highlighted.",
    skylineHint: "Drag to rotate · scroll to zoom · hover a tower for details",
    schools: (n: number | string) => `${n} schools`,
    enlistLabel: "Enlist",
    combatLabel: "Combat",
    officerLabel: "Officer",
    webglError: "Your browser doesn't support WebGL, so the 3D view can't render.",
    loading: "Loading 3D view…",
  },
  lab: {
    waffleTitle: "What happens out of 100 young people?",
    waffleSubtitle:
      "In each sector, every square is one young person out of 100. Solid blue = served in combat, purple = officers (a separate slice of enlistees, not part of combat), faint blue = enlisted but neither.",
    per100: "of 100 youth",
    enlisted: "enlisted",
    combat: "combat",
    officer: "officers",
    histTitle: "Every school as a dot",
    histSubtitle:
      "Each dot is one school in the latest year, colored by sector. Right = higher combat rate; a tall column = many schools around that rate.",
    scatterTitle: "Enlistment vs. combat service, by municipality",
    scatterSubtitle:
      "Each dot is a municipality with 3+ schools. Right = more enlist out of the cohort; up = more combat out of enlistees. Dashed lines mark the medians; click a dot to show or hide its name.",
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
      `Ranking of the largest cities over time: ${a}–${b}`,
    bumpSubtitle:
      "Each year the largest cities are ranked by their combat-service rate against all municipalities with enough data. A higher line = a better rank.",
    moversTitle: (a: number | string, b: number | string) =>
      `Where did the combat rate change most? ${a}–${b}`,
    moversSubtitle:
      "The municipalities with the biggest rise or fall in combat-service rate between the first and last year.",
    moversNote:
      "Unweighted school average; only municipalities with 4+ schools are shown. Part of a change may also come from which schools reported in each year.",
    unweightedNote:
      "Based on the plain average of the municipality's schools (each school weighted equally), not enlistee-weighted like the sector and region views — there are no per-school head-counts.",
    risers: "Biggest rise",
    fallers: "Biggest drop",
    points: "pts",
    raceTitle: "The municipality race over the years",
    raceSubtitle:
      "Each bubble is a municipality with 3+ schools; size = number of schools. Hit play and watch each one move through enlist×combat space year by year. The largest cities are highlighted in blue.",
    racePlay: "Play",
    racePause: "Pause",
    compTitle: "Who actually fills the army?",
    compSubtitle:
      "Each sector's share of all combat soldiers, year by year (from the weighted absolute counts). The rates tell one story — the head-counts tell another.",
    compNote:
      "100%-stacked: a band's height is that sector's share of combat soldiers that year, not the absolute number.",
    ridgeTitle: "The combat-service distribution, year by year",
    ridgeSubtitle:
      "Each ridge is one year: the distribution of combat-service rate across all schools. The peak = the most common rate; the white marker and number = that year's median. The dashed line connects the medians, so you can see where the center moves (for girls it climbs clearly).",
    ridgeAxis: "Combat rate (of enlistees)",
    ridgeCount: (nn: number | string) => `${nn} schools`,
    sankeyTitle: "The pipeline: from cohort to combat & officers",
    sankeySubtitle:
      "Out of the whole (weighted) cohort, how many enlist. Of the enlistees — how many serve in combat and how many become officers, shown as two parallel streams (not one after the other). Split by sector; stream width is proportional to head-count.",
    sankeyStages: {
      cohort: "Cohort",
      enlist: "Enlisted",
      combat: "Combat",
      officer: "Officers",
    },
    sankeyOfficerLegend: "Officers (of enlistees)",
    sankeyNote:
      "Combat and officers are both measured out of enlistees, so they're two parallel streams — not sequential stages. They can overlap slightly (combat officers count in both).",
    outlierTitle: "Who bucks the trend?",
    outlierSubtitle:
      "The dashed line is the expected link between enlistment and combat rate across all municipalities. Municipalities far above it produce far more combat soldiers than their enlistment predicts; far below, far fewer.",
    outlierOver: "Far above expected",
    outlierUnder: "Far below expected",
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
    title: "Gender Gaps by Sector",
    subtitle:
      "The percentage-point difference between boys and girls in each sector.",
    gap: (g: number | string) => `${g} pt gap`,
    footnote:
      "A positive value means the metric is higher for boys; a negative value means an advantage for girls.",
  },
  sectorDonuts: {
    title: "Selected Metric by Sector",
    subtitle: "A quick comparison of each sector on the selected metric.",
  },
  leaderboards: {
    unclassified: "Unclassified",
    title: "Schools at the Extremes",
    subtitle:
      "The ten schools with the highest and lowest values on the selected metric.",
    topTitle: "Top ten values",
    bottomTitle: "Bottom ten values",
    legend: "The colored dot indicates the sector:",
  },
  regionView: {
    title: "Region Ranking by Metric",
    subtitle: (label: string) => `Comparison across geographic regions · ${label}`,
    footnote: "Bar width is relative to the highest value in the current view.",
  },
  subgroups: {
    title: "Subgroups Within Each Sector",
    subtitle:
      "Comparing the subgroups within each sector on the main enlistment metrics.",
    noData: "Not enough subgroups to display for this combination.",
    schools: (n: number | string) => `${n} schools`,
    footnote:
      "Bar width is relative to the highest value among the subgroups shown.",
  },
  effectiveRate: {
    title: "Combat Soldiers and Officers per 100 Youth",
    subtitle:
      "How many of every 100 youth actually reach combat service or officer rank in each sector.",
    footnote:
      "How it's computed: enlistment rate of the cohort × the role's rate among enlistees.",
  },
  sectorFunnel: {
    title: "The Enlistment Path in Each Sector",
    subtitle:
      "How many of every 100 youth move from enlistment to combat to officer rank in each sector.",
    footnote:
      "Each stage is shown relative to 100 youth in the cohort, not just relative to enlistees.",
  },
  combatParadox: {
    tipEnlist: "Enlistment rate",
    tipCombat: "Combat rate",
    tipFighters: "Actual combat soldiers",
    title: "Enlistment vs. Combat Service",
    subtitle:
      "Each bubble is a sector — positioned by enlistment rate (horizontal) and combat rate (vertical), with bubble size by the actual number of combat soldiers.",
    axisEnlist: "Enlistment rate",
    axisCombat: "Combat rate",
    footnote:
      "A sector can show a high combat rate yet contribute few actual combat soldiers (a small bubble), and vice versa — a moderate rate with a large contribution (a big bubble).",
  },
  contribution: {
    title: "Actual Contribution in Absolute Numbers",
    subtitle: (noun: string) =>
      `Each sector's share of all ${noun} in the country — a high rate isn't necessarily a large contribution.`,
    ofEnlistees: (rate: number | string) => `(${rate}% of enlistees)`,
    footnote:
      "A large sector with a moderate rate may supply more combat soldiers than a small sector with a high rate. Absolute numbers are estimated from cohort size and the metric rate.",
  },
  heatmap: {
    title: "Metrics Map by Sector and Gender",
    subtitle:
      "Enlistment, combat and officer rates for each sector and gender. A darker color indicates a higher value.",
    sectorHeader: "Sector",
    footnote:
      "Color is computed separately per metric, to highlight who is high or low within the same column.",
  },
  trend: {
    title: "From 2018 to 2024",
    subtitle: (label: string, gender: string) =>
      `The trend per sector over time · ${label} · ${gender}`,
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
  },
  cities: {
    colCouncil: "Municipality",
    colCount: "Schools",
    colCountShort: "Schools",
    colMeaning: "Meaningful service",
    colMeaningShort: "Meaningful",
    title: "Compare Municipalities",
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
  panel: {
    exportFallback: "chart",
  },
};

const dictionaries: Record<Locale, Dictionary> = { he, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
