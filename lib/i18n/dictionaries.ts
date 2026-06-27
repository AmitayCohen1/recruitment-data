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
      "מבט-על על נתוני הגיוס והשירות בצה״ל, מחולקים לפי מגזר. מתחילים מהתמונה הגדולה — כמה מתגייסים, כמה מגיעים לשירות קרבי וכמה לקצונה בכל מגזר — ומשם אפשר לרדת לפילוחים לפי אזור ולפי בית ספר בלשוניות הבאות.",
  },
  sectorsTab: {
    title: "השוואה בין מגזרים",
    subtitle:
      "השוואה של גיוס, שירות קרבי וקצונה לפי מגזר, מגדר ושנה.",
  },
  citiesTab: {
    title: "השוואה בין אזורים ורשויות",
    subtitle:
      "אותם נתונים, אבל לפי מקום מגורים. כאן רואים איך שיעורי הגיוס, השירות הקרבי והקצונה משתנים בין אזורים גאוגרפיים, ערים ורשויות מקומיות — ואפשר להשוות בין יישובים ולגלות מי בולט לכאן או לכאן.",
  },
  searchTab: {
    title: "חיפוש בתי ספר",
    subtitle:
      "כאן יורדים לרמת בית הספר הבודד. חפשו בית ספר מסוים וראו את נתוני הגיוס, השירות הקרבי והקצונה שלו, השוו בין כמה בתי ספר זה לזה, וסננו לפי שנה, מגדר ורשות.",
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
    title: "סך הכל לפי מגזר",
    subtitle:
      "כאן רואים מספרים מוחלטים — כמה מתגייסים, לוחמים או קצינים יוצאים בפועל מכל מגזר, ולא רק אחוזים. זה חשוב כי מגזר עם שיעור גבוה לא בהכרח זה שממלא את רוב השורות: גם גודל האוכלוסייה קובע כמה אנשים עומדים מאחורי האחוז.",
    shareTitle: "חלוקה לפי מגזר",
    shareSubtitle:
      "כל חלק מציג את חלקו של מגזר מתוך כלל הקבוצה שנבחרה.",
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
    barTitle: "מדדי השירות לפי מגזר",
    barSubtitle:
      "כל עמודה היא מגזר אחד, וגובהה הוא השיעור שלו — גיוס, שירות קרבי או קצונה. ככל שהעמודה גבוהה יותר, השיעור גבוה יותר, וכך אפשר להשוות בין כל המגזרים במבט אחד.",
    barHint: "גררו לסובב · גלגלו לזום · רחפו על עמודה לפרטים",
    cloudTitle: "בתי ספר לפי גיוס, קרבי וקצונה",
    cloudSubtitle:
      "כל נקודה היא בית ספר, והמיקום שלה במרחב נקבע לפי שלושת השיעורים יחד: גיוס, קרבי וקצונה. בתי ספר עם דפוס דומה מתקבצים זה לצד זה, כך שאפשר לראות אילו צירופים חוזרים על עצמם ומי יוצא דופן.",
    cloudHint: "גררו לסובב · גלגלו לזום · רחפו על נקודה · לחצו לנעיצה",
    cloudSearch: "חיפוש בית ספר…",
    cloudNoResults: "אין תוצאות",
    cloudYearTip: (y: number | string) => `שנת ${y}`,
    axisEnlist: "🪖 גיוס →",
    axisCombat: "⚔️ קרבי ↑",
    axisOfficer: "🎖️ קצונה ↗",
    terrainTitle: "ריכוז בתי ספר לפי גיוס וקרבי",
    terrainSubtitle:
      "מפת גובה של כל בתי הספר על שני צירים: שיעור גיוס ושיעור קרבי. ככל שאזור גבוה ובהיר יותר, כך יותר בתי ספר חולקים בו את אותו שילוב — הפסגות מסמנות איפה יושב 'מרכז הכובד' של בתי הספר.",
    terrainHint: "גררו לסובב · גלגלו לזום",
    densityLow: "מעט בתי ספר",
    densityHigh: "הרבה בתי ספר",
    sectorTerrainTitle: "טביעת אצבע של כל מגזר",
    sectorTerrainSubtitle:
      "כל משטח הוא מגזר, וכל נקודה בו היא בית ספר לפי שיעורי הגיוס והקרבי שלו. פסגה אחת וצרה אומרת שבתי הספר במגזר דומים מאוד זה לזה; משטח רחב ומרוח אומר שהם מפוזרים ושונים. כך אפשר לראות במבט אחד אילו מגזרים אחידים ואילו מגוונים בפנים.",
    terrainViewSingle: "כל בתי הספר",
    terrainViewGrid: "זה לצד זה",
    terrainViewOverlay: "יחד (שכבות)",
    terrainPeakLabel: "כאן מצטופפים רוב בתי הספר",
    schools: (n: number | string) => `${n} בתי ספר`,
    webglError: "הדפדפן לא תומך ב-WebGL, ולכן אי אפשר להציג את התצוגה התלת-ממדית.",
    loading: "טוען תצוגה תלת-ממדית…",
  },
  lab: {
    waffleTitle: "מתוך 100 בני נוער",
    waffleSubtitle:
      "מדמיינים 100 בני נוער: כל ריבוע הוא אדם אחד, והצבעים מראים כמה מהם התגייסו, כמה הגיעו לשירות קרבי וכמה לקצונה. זו דרך פשוטה לתרגם את האחוזים לאנשים ולהרגיש את הסדר גודל האמיתי.",
    per100: "מתוך 100 בני נוער",
    histTitle: "התפלגות בתי הספר",
    histSubtitle:
      "כל נקודה היא בית ספר, ממוקמת על הציר לפי השיעור שלה במדד שנבחר — נמוך משמאל, גבוה מימין. הצפיפות לאורך הציר מראה היכן מצטופפים רוב בתי הספר ומי החריגים שיושבים בקצוות.",
    scatterTitle: "גיוס וקרבי לפי רשות",
    scatterSubtitle:
      "כל נקודה היא רשות מקומית. ככל שהיא ימינה יותר שיעור הגיוס שלה גבוה יותר, וככל שהיא גבוהה יותר שיעור השירות הקרבי גבוה יותר. הרשויות בפינה הימנית-עליונה חזקות בשני המדדים יחד — שילוב נדיר יחסית.",
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
    bumpTitle: "דירוג הערים הגדולות בשירות קרבי",
    bumpSubtitle:
      "כל קו הוא עיר גדולה, ומראה את מקומה בדירוג השירות הקרבי בכל שנה. קו שמטפס כלפי מעלה השתפר ביחס לערים האחרות, וקו שיורד נסוג בדירוג — כך רואים מי עלה ומי ירד לאורך הזמן.",
    moversTitle: "השינוי הגדול ביותר במדד",
    moversSubtitle:
      "הרשויות שבהן המדד שנבחר עלה או ירד הכי הרבה לאורך השנים. במקום מי גבוה או נמוך כרגע, כאן רואים היכן חל השינוי הגדול ביותר — לטובה או לרעה.",
    moversNote:
      "ממוצע בתי ספר לא משוקלל; מוצגות רק רשויות עם 4+ בתי ספר. חלק מהשינוי עשוי לנבוע גם משינוי בהרכב בתי הספר המדווחים בין השנים.",
    unweightedNote:
      "מבוסס על ממוצע בתי הספר ברשות (כל בית ספר במשקל שווה), ולא על שקלול לפי מספר מתגייסים כמו בתצוגות המגזר והאזור — אין נתוני מספרים ברמת בית הספר.",
    risers: "העלייה הגדולה ביותר",
    fallers: "הירידה הגדולה ביותר",
    points: "נק׳",
    raceTitle: "שינוי גיוס וקרבי לאורך השנים",
    raceSubtitle:
      "כל בועה היא רשות מקומית. לחצו על 'נגן' כדי לראות איך שיעורי הגיוס והקרבי שלה זזים משנה לשנה, ולעקוב אחרי המגמה — מי מטפס, מי נסוג ומי נשאר במקום לאורך הזמן.",
    racePlay: "נגן",
    racePause: "השהה",
    sankeyTitle: "מהמחזור לגיוס, קרבי וקצונה",
    sankeySubtitle:
      "מעקב אחרי הדרך מהמחזור כולו אל הגיוס, ומשם אל השירות הקרבי והקצונה. רוחב כל זרם הוא מספר האנשים, כך שרואים בבירור כמה 'נושרים' בכל שלב וכמה ממשיכים עד הסוף.",
    sankeyStages: {
      cohort: "מחזור",
      enlist: "🪖 מתגייסים",
      combat: "⚔️ קרביים",
      officer: "🎖️ קצינים",
    },
    sankeyOfficerLegend: "🎖️ קצינים (מתוך ה־🪖 מתגייסים)",
    sankeyNote:
      "קרבי וקצונה נמדדים שניהם מתוך המתגייסים, ולכן הם שני זרמים מקבילים — לא שלב אחרי שלב. ייתכן חפיפה קלה (קצינים קרביים נכללים בשניהם).",
    outlierTitle: "רשויות מעל ומתחת לצפוי",
    outlierSubtitle:
      "הקו מסמן את הערך הצפוי לפי שיעור הגיוס של כל רשות. נקודות מעל הקו מצליחות יותר מהמצופה לרמת הגיוס שלהן, ונקודות מתחתיו פחות מהצפוי — כך מזהים מי חורג מהמגמה הכללית, לכאן או לכאן.",
    outlierOver: "הרבה מעל הצפוי",
    outlierUnder: "הרבה מתחת לצפוי",
    parallelTitle: "גיוס, קרבי וקצונה בכל בית ספר",
    parallelSubtitle:
      "כל קו הוא בית ספר, והוא עובר דרך שלושת השיעורים: גיוס, קרבי וקצונה. צורת הקו חושפת את הפרופיל של בית הספר — למשל גיוס גבוה אך קרבי נמוך, או להפך — ומאפשרת להשוות בין בתי ספר במבט אחד.",
    trajTitle: "גיוס וקרבי בערים לאורך השנים",
    trajSubtitle:
      "כל קו הוא עיר גדולה, ומראה איך שיעורי הגיוס והקרבי שלה נעו יחד לאורך השנים. הכיוון של הקו מספר אם העיר השתפרה, נסוגה או נשארה יציבה בשני המדדים.",
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
    title: "פער בין בנים לבנות",
    subtitle:
      "ההפרש בנקודות האחוז בין בנים לבנות בכל מגזר, עבור המדד שנבחר. ככל שהעמודה ארוכה יותר הפער גדול יותר — וזה מראה שאי אפשר לדבר על מגזר בלי להפריד בין בנים לבנות, כי לרוב הם חווים מציאות שירות שונה.",
    gap: (g: number | string) => `פער ${g} נק׳`,
    footnote:
      "ערך חיובי מציין שהמדד גבוה יותר אצל בנים; ערך שלילי מציין יתרון לבנות.",
  },
  sectorDonuts: {
    title: "אחוז לפי מגזר",
    subtitle:
      "הערך של כל מגזר במדד ובמגדר שנבחרו, זה לצד זה. השוואה ישירה ופשוטה שמראה כמה רחוקים המגזרים זה מזה במדד הנבחר, ומי מוביל ומי מפגר בו.",
  },
  leaderboards: {
    unclassified: "לא מסווג",
    title: "קצות הטבלה: בתי ספר חריגים",
    subtitle:
      "הקצה העליון והתחתון של המדד שנבחר. הקצוות טובים לאיתור חריגים, לא להבנת הכלל — ערכי הקצה נשענים לרוב על בתי ספר קטנים או מיוחדים.",
    topTitle: "10 הגבוהים",
    bottomTitle: "10 הנמוכים",
    legend: "הנקודה הצבעונית מציינת את המגזר:",
  },
  regionView: {
    title: "המדד שנבחר לפי אזור",
    subtitle:
      "דירוג של אזורים גאוגרפיים לפי המדד, המגדר והמגזר שנבחרו, מהגבוה לנמוך. כך רואים אילו אזורים בולטים למעלה או למטה, ואיך מקום המגורים קשור לדפוסי הגיוס והשירות.",
    footnote: "רוחב העמודה יחסי לערך הגבוה ביותר בתצוגה הנוכחית.",
  },
  subgroups: {
    title: "תת-קבוצות בתוך כל מגזר",
    subtitle:
      "השוואה בין תת-הקבוצות שבתוך כל מגזר, לפי מדדי הגיוס המרכזיים. זה מראה שגם בתוך מגזר אחד יש שונות גדולה, ולא תמיד נכון להתייחס אליו כגוש אחיד.",
    noData: "אין מספיק תת-קבוצות להצגה עבור צירוף זה.",
    schools: (n: number | string) => `${n} בתי ספר`,
    footnote:
      "רוחב העמודה יחסי לערך הגבוה ביותר בתת-הקבוצות שמוצגות כעת.",
  },
  effectiveRate: {
    title: "קרבי וקצונה — לכל 100 בני נוער",
    subtitle:
      "בכל מגזר, כמה מתוך כל 100 בני נוער מגיעים בפועל לשירות קרבי או לקצונה. המדד משלב את שיעור הגיוס עם שיעור התפקיד, ולכן הוא משקף את התרומה האמיתית של המגזר — ולא רק אחוז מתוך אלה שכבר התגייסו.",
    footnote:
      "חישוב המדד: שיעור גיוס מתוך המחזור × שיעור התפקיד מתוך המתגייסים.",
  },
  sectorFunnel: {
    title: "מהמחזור לגיוס, קרבי וקצונה",
    subtitle:
      "בכל מגזר, כמה מתגייסים, כמה מגיעים לשירות קרבי וכמה לקצונה — מתוך 100 בני נוער במחזור. המשפך מראה כמה 'מסתננים' החוצה בכל שלב בדרך, מהמחזור המלא ועד לתפקידים הקרביים והקצונה.",
    footnote:
      "כל שלב מוצג ביחס ל־100 בני נוער במחזור, לא רק ביחס למתגייסים.",
  },
  combatParadox: {
    tipEnlist: "🪖 שיעור גיוס",
    tipCombat: "⚔️ שיעור קרבי",
    tipFighters: "⚔️ לוחמים בפועל",
    title: "גיוס, קרבי ומספר לוחמים לפי מגזר",
    subtitle:
      "כל בועה היא מגזר: ככל שהיא ימינה יותר שיעור הגיוס גבוה יותר, ככל שהיא גבוהה יותר שיעור הקרבי גבוה יותר, וגודל הבועה הוא מספר הלוחמים בפועל. כך רואים שמגזר יכול להיות גבוה בשיעור הקרבי אך לתרום מעט לוחמים, ולהפך.",
    axisEnlist: "🪖 שיעור גיוס",
    axisCombat: "⚔️ שיעור קרבי",
    footnote:
      "מגזר יכול להציג שיעור קרבי גבוה אך לתרום מעט לוחמים בפועל (בועה קטנה), ולהפך — שיעור בינוני עם תרומה גדולה (בועה גדולה).",
  },
  contribution: {
    title: "שיעור וגודל קבוצה — שני צירים שונים",
    subtitle:
      "חלקו של כל מגזר מתוך כלל הקבוצה שנבחרה בארץ. זה מבהיר ששיעור גבוה לבדו לא קובע את התרומה הלאומית — מגזר גדול עם שיעור בינוני יכול לספק יותר אנשים ממגזר קטן עם שיעור גבוה.",
    ofEnlistees: (rate: number | string) => `(${rate}% מה־🪖 מתגייסים)`,
    footnote:
      "מגזר גדול עם שיעור בינוני עשוי לספק יותר לוחמים ממגזר קטן עם שיעור גבוה. המספרים המוחלטים מוערכים לפי גודל המחזור ושיעור המדד.",
  },
  heatmap: {
    title: "כל המדדים לפי מגזר ומגדר",
    subtitle:
      "טבלת צבע שבה כל תא הוא שילוב של מגזר ומגדר, וצבעו מציג את השיעור באחוזים — ככל שהצבע כהה יותר, הערך גבוה יותר בתוך אותו מדד. כך אפשר לסרוק את כל המדדים יחד במבט אחד ולראות מי בולט והיכן.",
    sectorHeader: "מגזר",
    footnote:
      "הצבע מחושב בנפרד לכל מדד, כדי להבליט מי גבוה או נמוך בתוך אותה עמודה.",
  },
  trend: {
    title: "שינוי המדד לאורך זמן",
    subtitle:
      "איך המדד שנבחר השתנה בכל מגזר לאורך השנים. כך רואים אם הפערים בין המגזרים מצטמצמים, נשארים יציבים או מתרחבים עם הזמן — ולא רק את התמונה של שנה אחת.",
  },
  notes: {
    title: "הערות ומקורות",
    subtitle:
      "כאן מופיעים מקור הנתונים, שיטת החישוב והערות חשובות על המדדים.",
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
    subtitle:
      "כל הנתונים שמאחורי האתר, להורדה כקובצי Excel — כדי שתוכלו לבדוק, לנתח ולהצליב אותם בעצמכם.",
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
    title: "חיפוש והשוואה בין בתי ספר",
    subtitle:
      "הטבלה המלאה של כל בתי הספר. חפשו וסננו לפי שנה, מגדר, רשות ומדדי גיוס, מיינו לפי כל עמודה, וירדו לנתוני המקור המדויקים של כל בית ספר בנפרד.",
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
    title: "המדד שנבחר לפי רשות",
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
    title: "Enlistment and Service Data by School",
    subtitle:
      "This site shows enlistment, combat-service and officer rates by school, sector, region, gender and year.",
    feedback: "Feedback? Message me",
  },
  tabs: {
    overview: "Overview",
    sectors: "Sectors",
    gaps: "Gaps",
    breakdowns: "Breakdowns",
    cities: "Regions",
    search: "Schools",
    sources: "Data Sources",
    lab: "Analysis",
    three: "3D",
  },
  delta: {
    vs: (y: number | string) => `vs ${y}`,
    legend: (y: number | string) =>
      `Arrows: change in percentage points vs ${y} · green = up, red = down`,
  },
  overviewTab: {
    title: "Overview",
    subtitle:
      "A bird's-eye view of IDF enlistment and service data, broken down by sector. Start with the big picture — how many enlist, reach combat service and become officers in each sector — then drill into regions and individual schools in the tabs that follow.",
  },
  sectorsTab: {
    title: "Compare Sectors",
    subtitle:
      "Compare enlistment, combat service and officer rates by sector, gender and year.",
  },
  citiesTab: {
    title: "Compare Regions and Municipalities",
    subtitle:
      "The same data, but by place of residence. See how enlistment, combat-service and officer rates shift between geographic regions, cities and local municipalities — and compare towns to find who stands out, in either direction.",
  },
  searchTab: {
    title: "Search Schools",
    subtitle:
      "This is where you get down to the individual school. Search for a specific school to see its enlistment, combat-service and officer data, compare several schools side by side, and filter by year, gender and municipality.",
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
    title: "3D View",
    subtitle:
      "An experimental view of the same data in 3D. Drag to rotate and scroll to zoom.",
  },
  armyStream: {
    title: "Totals by Sector",
    subtitle:
      "Here you see absolute numbers — how many enlistees, combat soldiers or officers each sector actually produces, not just percentages. It matters because a sector with a high rate isn't necessarily the one filling most of the ranks: population size decides how many people stand behind each percentage.",
    shareTitle: "Breakdown by Sector",
    shareSubtitle:
      "Each part shows one sector's share of the selected group.",
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
    barTitle: "Service Metrics by Sector",
    barSubtitle:
      "Each bar is one sector, and its height is that sector's rate — enlistment, combat service or officers. The taller the bar, the higher the rate, so you can compare every sector at a glance.",
    barHint: "Drag to rotate · scroll to zoom · hover a bar for details",
    cloudTitle: "Schools by Enlistment, Combat and Officers",
    cloudSubtitle:
      "Each point is one school, placed in space by all three rates together: enlistment, combat and officers. Schools with a similar pattern cluster together, so you can see which combinations recur and which schools are outliers.",
    cloudHint: "Drag to rotate · scroll to zoom · hover a point · click to pin",
    cloudSearch: "Search a school…",
    cloudNoResults: "No matches",
    cloudYearTip: (y: number | string) => `Year ${y}`,
    axisEnlist: "🪖 Enlist →",
    axisCombat: "⚔️ Combat ↑",
    axisOfficer: "🎖️ Officer ↗",
    terrainTitle: "School Clusters by Enlistment and Combat",
    terrainSubtitle:
      "A height map of all schools across two axes: enlistment rate and combat-service rate. The higher and brighter an area, the more schools share that same mix — the peaks mark where the 'center of gravity' of schools sits.",
    terrainHint: "Drag to rotate · scroll to zoom",
    densityLow: "Fewer schools",
    densityHigh: "More schools",
    sectorTerrainTitle: "Each Sector's Fingerprint",
    sectorTerrainSubtitle:
      "Each surface is one sector, and every point on it is a school placed by its enlistment and combat rates. A single narrow peak means the sector's schools are very much alike; a wide, spread-out surface means they vary. So at a glance you can see which sectors are uniform inside and which are diverse.",
    terrainViewSingle: "All schools",
    terrainViewGrid: "Side by side",
    terrainViewOverlay: "Together (layers)",
    terrainPeakLabel: "Most schools cluster here",
    schools: (n: number | string) => `${n} schools`,
    webglError: "Your browser doesn't support WebGL, so the 3D view can't render.",
    loading: "Loading 3D view…",
  },
  lab: {
    waffleTitle: "Out of 100 Youth",
    waffleSubtitle:
      "Picture 100 young people: each square is one person, and the colors show how many of them enlisted, reached combat service and became officers. It's a simple way to turn the percentages into people and feel the real scale.",
    per100: "of 100 youth",
    histTitle: "School Distribution",
    histSubtitle:
      "Each dot is a school, placed on the axis by its rate for the selected metric — low on the left, high on the right. The density along the axis shows where most schools pile up and which outliers sit at the edges.",
    scatterTitle: "Enlistment and Combat by Municipality",
    scatterSubtitle:
      "Each dot is a municipality. The further right it sits the higher its enlistment rate, and the higher up it sits the higher its combat-service rate. Municipalities in the top-right corner are strong on both at once — a relatively rare combination.",
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
    bumpTitle: "Largest Cities Ranked by Combat Service",
    bumpSubtitle:
      "Each line is a large city, showing its rank in combat service each year. A line climbing upward improved relative to the other cities, and a line dropping fell in the ranking — so you can see who rose and who fell over time.",
    moversTitle: "Largest Change in the Metric",
    moversSubtitle:
      "The municipalities where the selected metric rose or fell the most over the years. Instead of who's high or low right now, this highlights where the biggest change happened — for better or worse.",
    moversNote:
      "Unweighted school average; only municipalities with 4+ schools are shown. Part of a change may also come from which schools reported in each year.",
    unweightedNote:
      "Based on the plain average of the municipality's schools (each school weighted equally), not enlistee-weighted like the sector and region views — there are no per-school head-counts.",
    risers: "Biggest rise",
    fallers: "Biggest drop",
    points: "pts",
    raceTitle: "Enlistment and Combat Over Time",
    raceSubtitle:
      "Each bubble is a municipality. Press 'Play' to watch its enlistment and combat rates move year by year, and follow the trend — who climbs, who slips and who stays put over time.",
    racePlay: "Play",
    racePause: "Pause",
    sankeyTitle: "From Cohort to Enlistment, Combat and Officers",
    sankeySubtitle:
      "Tracing the path from the whole cohort to enlistment, and from there to combat service and officers. The width of each stream is the number of people, so you can clearly see how many 'drop off' at each step and how many make it all the way through.",
    sankeyStages: {
      cohort: "Cohort",
      enlist: "🪖 Enlisted",
      combat: "⚔️ Combat",
      officer: "🎖️ Officers",
    },
    sankeyOfficerLegend: "🎖️ Officers (of 🪖 enlistees)",
    sankeyNote:
      "Combat and officers are both measured out of enlistees, so they're two parallel streams — not sequential stages. They can overlap slightly (combat officers count in both).",
    outlierTitle: "Municipalities Above and Below Expected",
    outlierSubtitle:
      "The line marks the value expected from each municipality's enlistment rate. Points above the line do better than expected for their enlistment level, and points below do worse — so you can spot who breaks from the overall trend, in either direction.",
    outlierOver: "Far above expected",
    outlierUnder: "Far below expected",
    parallelTitle: "Enlistment, Combat and Officers in Each School",
    parallelSubtitle:
      "Each line is a school, passing through all three rates: enlistment, combat and officers. The shape of the line reveals the school's profile — say, high enlistment but low combat, or the reverse — and lets you compare schools at a glance.",
    trajTitle: "Enlistment and Combat in Cities Over Time",
    trajSubtitle:
      "Each line is a large city, showing how its enlistment and combat rates moved together over the years. The direction of the line tells you whether the city improved, slipped or held steady on both.",
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
    title: "Gap Between Boys and Girls",
    subtitle:
      "The percentage-point difference between boys and girls in each sector, for the selected metric. The longer the bar, the bigger the gap — showing you can't talk about a sector without separating boys from girls, since they usually experience very different service.",
    gap: (g: number | string) => `${g} pt gap`,
    footnote:
      "A positive value means the metric is higher for boys; a negative value means an advantage for girls.",
  },
  sectorDonuts: {
    title: "Percentage by Sector",
    subtitle:
      "Each sector's value for the selected metric and gender, side by side. A direct, simple comparison that shows how far apart the sectors are on the chosen metric, and who leads and who trails.",
  },
  leaderboards: {
    unclassified: "Unclassified",
    title: "Edges of the Table: Outlier Schools",
    subtitle:
      "The top and bottom of the selected metric. The edges are good for spotting outliers, not for understanding the typical school — extreme values often rest on small or unusual schools.",
    topTitle: "Top 10",
    bottomTitle: "Bottom 10",
    legend: "The colored dot indicates the sector:",
  },
  regionView: {
    title: "Selected Metric by Region",
    subtitle:
      "Geographic regions ranked by the selected metric, gender and sector, from highest to lowest. You can see which regions stand out at the top or bottom, and how place of residence ties into patterns of enlistment and service.",
    footnote: "Bar width is relative to the highest value in the current view.",
  },
  subgroups: {
    title: "Subgroups Within Each Sector",
    subtitle:
      "Comparing the subgroups within each sector on the main enlistment metrics. It shows that even within a single sector there's wide variation, and it isn't always right to treat it as one uniform bloc.",
    noData: "Not enough subgroups to display for this combination.",
    schools: (n: number | string) => `${n} schools`,
    footnote:
      "Bar width is relative to the highest value among the subgroups shown.",
  },
  effectiveRate: {
    title: "Combat and Officers — per 100 Youth",
    subtitle:
      "For each sector, how many out of every 100 youth actually reach combat service or officer rank. The metric combines the enlistment rate with the role rate, so it reflects a sector's real contribution — not just a percentage of those who already enlisted.",
    footnote:
      "How it's computed: enlistment rate of the cohort × the role's rate among enlistees.",
  },
  sectorFunnel: {
    title: "From Cohort to Enlistment, Combat and Officers",
    subtitle:
      "For each sector, how many enlist, how many reach combat service and how many become officers — out of 100 youth in the cohort. The funnel shows how many 'leak out' at each step along the way, from the full cohort down to combat roles and officers.",
    footnote:
      "Each stage is shown relative to 100 youth in the cohort, not just relative to enlistees.",
  },
  combatParadox: {
    tipEnlist: "🪖 Enlistment rate",
    tipCombat: "⚔️ Combat rate",
    tipFighters: "Actual ⚔️ combat soldiers",
    title: "Enlistment, Combat and Number of Combat Soldiers by Sector",
    subtitle:
      "Each bubble is a sector: the further right the higher its enlistment rate, the higher up the higher its combat rate, and the bubble's size is the actual number of combat soldiers. So you can see that a sector can be high on combat rate yet contribute few soldiers, and vice versa.",
    axisEnlist: "🪖 Enlistment rate",
    axisCombat: "⚔️ Combat rate",
    footnote:
      "A sector can show a high combat rate yet contribute few actual combat soldiers (a small bubble), and vice versa — a moderate rate with a large contribution (a big bubble).",
  },
  contribution: {
    title: "Rate and Group Size — Two Different Axes",
    subtitle:
      "Each sector's share of the selected national group. It makes clear that a high rate alone doesn't determine national contribution — a large sector with a moderate rate can supply more people than a small sector with a high rate.",
    ofEnlistees: (rate: number | string) => `(${rate}% of 🪖 enlistees)`,
    footnote:
      "A large sector with a moderate rate may supply more combat soldiers than a small sector with a high rate. Absolute numbers are estimated from cohort size and the metric rate.",
  },
  heatmap: {
    title: "All Metrics by Sector and Gender",
    subtitle:
      "A color table where each cell is a sector-and-gender combination, colored by its percentage rate — the darker the color, the higher the value within that metric. So you can scan all the metrics together at a glance and see who stands out and where.",
    sectorHeader: "Sector",
    footnote:
      "Color is computed separately per metric, to highlight who is high or low within the same column.",
  },
  trend: {
    title: "Selected Metric Over Time",
    subtitle:
      "How the selected metric changed in each sector over the years. You can see whether the gaps between sectors are narrowing, holding steady or widening over time — not just a single year's snapshot.",
  },
  notes: {
    title: "Notes and Sources",
    subtitle:
      "This section explains the data source, the calculation method and important notes.",
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
      "All the data behind the site, downloadable as Excel files — so you can check, analyze and cross-reference it yourself.",
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
    title: "Search and Compare Schools",
    subtitle:
      "The full table of every school. Search and filter by year, gender, municipality and enlistment metrics, sort by any column, and drill down to the exact source data for each individual school.",
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
    title: "Selected Metric by Municipality",
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
