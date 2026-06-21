"""
Classify schools by joining recruitment data with Ministry of Education
School List (פיקוח field) via סמל מוסד = school_key.
Then combine פיקוח + municipality/geography into sociological groups.
"""
import pandas as pd

# =============================================================
# Load School List (Ministry of Education classification)
# =============================================================
sl = pd.read_excel('c338378e-93ef-4261-ac66-8d0c487f4b01.xlsx', engine='openpyxl')
classification = sl[['סמל מוסד', 'פיקוח', 'מגזר', 'מחוז גיאוגרפי לחינוך',
                      'רשות לימודים', 'ישוב לימודים', 'סוג מוסד',
                      'שלב חינוך במוסד']].copy()
classification = classification.rename(columns={
    'סמל מוסד': 'school_key',
    'מחוז גיאוגרפי לחינוך': 'מחוז',
    'רשות לימודים': 'רשות',
    'ישוב לימודים': 'ישוב',
})

# =============================================================
# Load 12th-grade student counts (תלמידי יב) - by gender
# =============================================================
yb = pd.read_excel('תלמידי יב.xlsx', engine='openpyxl')
yb_agg = yb.groupby('סמל מוסד').agg(
    תלמידים_בנים=('מספר בנים', 'sum'),
    תלמידים_בנות=('מספר בנות', 'sum'),
    תלמידים=('מספר תלמידים', 'sum'),
).reset_index().rename(columns={'סמל מוסד': 'school_key'})
classification = classification.merge(yb_agg, on='school_key', how='left')
classification['school_key'] = classification['school_key'].astype(int)
classification = classification.drop_duplicates(subset='school_key', keep='first')

# =============================================================
# Manual classification for schools not in the School List
# =============================================================
manual_pikuach = {
    # Military/vocational schools (מועצה=0) - secular
    42919: 'ממלכתי',   # עתיד פלמחים
    44050: 'ממלכתי',   # TECHin עמל
    45001: 'ממלכתי',   # אורט תעשיה אוירית
    45002: 'ממלכתי',   # אורט תל-נוף
    45005: 'ממלכתי',   # אורט אורמת
    46101: 'ממלכתי דתי',  # נו"ע הדתי - נחלים (religious Zionist youth movement)
    54017: 'ממלכתי',   # עמל רמת דוד
    54021: 'ממלכתי',   # אנרג'י טק - עמל
    54108: 'ממלכתי',   # סכנין-טכנולוגי כסרא-סמיע
    65007: 'ממלכתי',   # אורט בית הערבה
    55013: 'ממלכתי',   # אורט צפת
    # Haredi yeshivot
    757591: 'חרדי',    # אורייתא (ירושלים)
    144170: 'חרדי',    # ישיבת בני יוסף (ירושלים)
    166488: 'חרדי',    # מבוא התלמוד (ירושלים)
    288126: 'חרדי',    # תפארת יוחנן (ביתר עילית)
    184085: 'חרדי',    # נתיבות חכמה (ביתר עילית)
}

manual_magar = {
    54108: 'ערבי',     # סכנין-טכנולוגי כסרא-סמיע (Arab village)
}

manual_rashut = {
    46101: 'חבל מודיעין',  # נו"ע הדתי - נחלים (located in Nachlim moshava)
}

# =============================================================
# Load recruitment data (2024 only)
# =============================================================
df_m = pd.read_excel('Recruitment-data-by-school.xlsx', sheet_name='2024 גברים', engine='openpyxl')
df_f = pd.read_excel('Recruitment-data-by-school.xlsx', sheet_name='2024 נשים', engine='openpyxl')
df = pd.concat([df_m, df_f], ignore_index=True)
df['school_key'] = df['school_key'].astype(int)

# =============================================================
# Join
# =============================================================
merged = df.merge(classification, on='school_key', how='left')

# Fill unmatched with manual classifications
for key, pikuach in manual_pikuach.items():
    mask = (merged['school_key'] == key) & (merged['פיקוח'].isna())
    merged.loc[mask, 'פיקוח'] = pikuach

for key, magar in manual_magar.items():
    mask = (merged['school_key'] == key) & (merged['מגזר'].isna())
    merged.loc[mask, 'מגזר'] = magar

for key, rashut in manual_rashut.items():
    mask = merged['school_key'] == key
    merged.loc[mask, 'רשות'] = rashut

# =============================================================
# Override פיקוח for schools misclassified by MoE as חרדי
# These are Religious Zionist schools under Haredi supervision
# =============================================================
pikuach_overrides = {
    # Haredi → Religious Zionist
    472555: 'ממלכתי דתי',  # אמי"ת מנורת המאור פ"ת - AMIT network = RZ
    641365: 'ממלכתי דתי',  # ישיבה תיכונית נווה (אשכול) - ישיבה תיכונית = RZ, 92% combat
    441204: 'ממלכתי דתי',  # ישיבת דרכי נעם (פ"ת) - 89% recruitment, 70% combat
    440206: 'ממלכתי דתי',  # תיכון דתי באר יעקב - name says "תיכון דתי" (religious HS)
    # Religious Zionist → Haredi
    140954: 'חרדי',        # ישיבת מערבא (מטה בנימין) - 13.9% recruitment, known Haredi yeshiva
    640631: 'חרדי',        # חבד בית חנה (קרית גת) - Chabad girls school, 0% recruitment
}

for key, pikuach in pikuach_overrides.items():
    mask = merged['school_key'] == key
    merged.loc[mask, 'פיקוח'] = pikuach

# =============================================================
# SOCIOLOGICAL CLASSIFICATION
# Combine פיקוח + מגזר + geography into sociological groups
# =============================================================

# --- Geographic sets ---
# West Bank settlements (regional councils and cities)
settlement_councils = {
    'מטה בנימין', 'גוש עציון', 'שומרון', 'הר חברון',
    'אפרת', 'בית אל', 'קדומים', 'אלקנה', 'קרני שומרון',
    'אריאל', 'מעלה אדומים', 'ביתר עילית', 'מודיעין עילית',
    'עמנואל', 'גבעת זאב', 'קרית ארבע', 'אורנית',
    'מגדל עוז', 'כוכב יעקב', 'עלי', 'חשמונאים',
    'אלפי מנשה', 'בית אריה', 'עפרה', 'שילה',
}

# Kibbutz regional councils
kibbutz_councils = {
    'עמק יזרעאל', 'עמק חפר', 'עמק הירדן', 'חוף הכרמל',
    'חוף השרון', 'שדות דן', 'הגליל העליון', 'מנשה',
    'הגלבוע', 'מגידו', 'מטה אשר', 'הגליל התחתון',
    'חבל יבנה', 'באר טוביה', 'גזר', 'ברנר', 'יואב',
    'שפיר', 'חוף אשקלון', 'שער הנגב', 'אשכול',
    'שדות נגב עזתה', 'מרחבים', 'בני שמעון',
    'נחל שורק', 'מטה יהודה', 'חבל מודיעין',
    'משגב', 'מרום הגליל', 'גולן', 'קצרין',
    'עמק המעיינות', 'הערבה התיכונה', 'חבל אילות',
    'רמת נגב', 'דרום השרון', 'לב השרון', 'חוף השרון',
    'גן רווה',
}

# Major central Israel cities
central_cities = {
    'תל אביב-יפו', 'תלאביב יפו',
    'ראשון לציון', 'ראשוןלציון',
    'פתח תקוה', 'פתח תקווה',
    'חולון', 'בת ים', 'רמת גן', 'גבעתיים',
    'הרצליה', 'רעננה', 'כפר סבא', 'הוד השרון',
    'רמת השרון', 'נס ציונה', 'רחובות', 'נתניה',
    'מודיעין מכבים רעות', 'מודיעין-מכבים-רעות',
    'גבעת שמואל', 'יהוד נווה אפרים', 'יהוד-מונוסון', 'אור יהודה',
    'גני תקווה', 'שוהם', 'באר יעקב',
    'חדרה', 'זכרון יעקב', 'בנימינה גבעת עדה',
    'פרדס חנה-כרכור', 'כפר יונה',
    'צורן קדימה', 'תל מונד', 'אבן יהודה',
    'חיפה', 'קרית אונו',
    'מזכרת בתיה', 'גדרה', 'גן יבנה', 'יבנה',
    'ראש העין', 'קרית עקרון',
    'מבשרת ציון',
    'בני ברק', 'אלעד',  # for non-Haredi (RZ) schools located there
}

# Periphery cities
periphery_cities = {
    'באר שבע', 'אשדוד', 'אשקלון', 'לוד', 'רמלה', 'בית שמש',
    'נתיבות', 'אופקים', 'שדרות', 'קרית גת', 'קרית מלאכי',
    'דימונה', 'ירוחם', 'מצפה רמון', 'ערד', 'אילת',
    'עכו', 'נהריה', 'כרמיאל', 'מעלות-תרשיחא',
    'צפת', 'טבריה', 'קרית שמונה', 'חצור הגלילית',
    'עפולה', 'בית שאן', 'מגדל העמק', 'נוף הגליל',
    'יקנעם עילית', 'אור עקיבא',
    'מיתר', 'עומר',
    'טירת כרמל', 'נשר', 'קרית ביאליק', 'קרית מוצקין',
    'קרית אתא', 'קרית ים', 'קרית טבעון', 'זבולון',
    'כפר ורדים', 'מעלה יוסף',
}

# Haredi cities (where nearly all schools are Haredi)
haredi_cities = {
    'בני ברק', 'ביתר עילית', 'מודיעין עילית', 'מודיעין על',
    'אלעד', 'עמנואל', 'רכסים',
}

def classify_sociological(row):
    """Assign a sociological group based on פיקוח + מגזר + geography."""
    pikuach = row.get('פיקוח', '')
    magar = row.get('מגזר', '')
    rashut = str(row.get('רשות', '') or '')
    moatza = str(row.get('מועצה', '') or '')
    yishuv = str(row.get('ישוב', '') or '')

    # Use רשות from school list if available, fall back to מועצה from recruitment data
    location = rashut if rashut else moatza

    # 1. Arab / Druze / Bedouin
    if magar in ('ערבי', 'דרוזי', 'בדואי'):
        if magar == 'דרוזי':
            return 'דרוזי'
        if magar == 'בדואי':
            return 'בדואי'
        return 'ערבי'

    # 2. Haredi
    if pikuach == 'חרדי':
        if location in haredi_cities or moatza in haredi_cities:
            return 'חרדי - ערי חרדים'
        if location == 'ירושלים' or moatza == 'ירושלים':
            return 'חרדי - ירושלים'
        if any(location == s or moatza == s for s in settlement_councils):
            return 'חרדי - התנחלויות'
        return 'חרדי - ערים מעורבות'

    # 3. Religious Zionist (ממלכתי דתי)
    if pikuach == 'ממלכתי דתי':
        if any(location == s or moatza == s for s in settlement_councils):
            return 'דתי לאומי - התנחלויות'
        if location == 'ירושלים' or moatza == 'ירושלים':
            return 'דתי לאומי - ירושלים'
        if any(location == s or moatza == s for s in kibbutz_councils):
            return 'דתי לאומי - פריפריה/כפרי'
        if any(location == s or moatza == s for s in periphery_cities):
            return 'דתי לאומי - פריפריה'
        if any(location == s or moatza == s for s in central_cities):
            return 'דתי לאומי - מרכז'
        return 'דתי לאומי - אחר'

    # 4. Secular (ממלכתי, Jewish)
    if pikuach == 'ממלכתי':
        if location == 'ירושלים' or moatza == 'ירושלים':
            return 'חילוני - ירושלים'
        if any(location == s or moatza == s for s in kibbutz_councils):
            return 'חילוני - קיבוצים/כפרי'
        if any(location == s or moatza == s for s in settlement_councils):
            return 'חילוני - התנחלויות'
        if any(location == s or moatza == s for s in central_cities):
            return 'חילוני - ערי מרכז'
        if any(location == s or moatza == s for s in periphery_cities):
            return 'חילוני - ערי פריפריה'
        # Military/vocational schools (מועצה=0)
        if moatza == '0' or moatza == '':
            return 'חילוני - צבאי/מקצועי'
        return 'חילוני - אחר'

    return 'לא מסווג'

# Apply classification
merged['קבוצה'] = merged.apply(classify_sociological, axis=1)

# =============================================================
# Report
# =============================================================
total = merged['school_key'].nunique()
matched = merged[merged['פיקוח'].notna()]['school_key'].nunique()
print(f"Total unique schools: {total}")
print(f"Classified (פיקוח): {matched} / {total}")

still_missing = merged[merged['פיקוח'].isna()][['school_key', 'מוסד', 'מועצה']].drop_duplicates('school_key')
if len(still_missing) > 0:
    print(f"\nStill unclassified ({len(still_missing)}):")
    for _, row in still_missing.iterrows():
        print(f"  {row['school_key']}: {row['מוסד']} ({row['מועצה']})")

print(f"\n{'='*60}")
print(f"SOCIOLOGICAL GROUP DISTRIBUTION (unique schools)")
print(f"{'='*60}")
group_counts = merged.groupby('קבוצה')['school_key'].nunique().sort_values(ascending=False)
for group, count in group_counts.items():
    print(f"  {group:30s}  {count:4d}")
print(f"  {'TOTAL':30s}  {group_counts.sum():4d}")

def weighted_mean(group_df, col, weight_col='תלמידים_יב'):
    """Compute weighted mean, falling back to simple mean if no weights."""
    valid = group_df[[col, weight_col]].dropna()
    if valid[weight_col].sum() > 0:
        return (valid[col] * valid[weight_col]).sum() / valid[weight_col].sum()
    return group_df[col].mean()

# Add gender-specific 12th-grade weight column for each row
merged['תלמידים_יב'] = merged.apply(
    lambda r: r['תלמידים_בנים'] if r.get('מין') == 'ז' else r['תלמידים_בנות'], axis=1)

print(f"\n{'='*60}")
print(f"WEIGHTED MEAN RECRUITMENT RATE (גיוס) BY GROUP & GENDER")
print(f"{'='*60}")
stats_rows = []
for group in sorted(merged['קבוצה'].dropna().unique()):
    g = merged[merged['קבוצה'] == group]
    for gender in ['ז', 'נ']:
        gg = g[g['מין'] == gender]
        if len(gg) > 0:
            stats_rows.append({
                'קבוצה': group,
                'מין': gender,
                'schools': gg['school_key'].nunique(),
                'תלמידים_יב': gg.drop_duplicates('school_key')['תלמידים_יב'].sum(),
                'גיוס': weighted_mean(gg, 'גיוס'),
                'לחימה': weighted_mean(gg, 'לחימה'),
                'קצונה': weighted_mean(gg, 'קצונה'),
                'משמעותי': weighted_mean(gg, 'משמעותי'),
            })
group_stats = pd.DataFrame(stats_rows).sort_values('גיוס', ascending=False)

for _, row in group_stats.iterrows():
    gender_label = 'M' if row['מין'] == 'ז' else 'F'
    students_yb = int(row['תלמידים_יב']) if pd.notna(row['תלמידים_יב']) else 0
    print(f"  {row['קבוצה']:30s} ({gender_label})  n={int(row['schools']):3d}  students_yb={students_yb:6d}  "
          f"גיוס={row['גיוס']:5.1f}%  "
          f"לחימה={row['לחימה']:5.1f}%  "
          f"קצונה={row['קצונה']:5.1f}%  "
          f"משמעותי={row['משמעותי']:5.1f}%")

# Check for "אחר" schools to verify nothing is wrongly bucketed
print(f"\n{'='*60}")
print(f"SCHOOLS IN 'אחר' CATEGORIES (verify)")
print(f"{'='*60}")
for group in sorted(group_counts.index):
    if 'אחר' in group:
        subset = merged[merged['קבוצה'] == group].drop_duplicates('school_key')
        print(f"\n  --- {group} ({len(subset)} schools) ---")
        for _, row in subset.iterrows():
            loc = row.get('רשות', '') or row.get('מועצה', '')
            print(f"    {row['school_key']}: {row['מוסד']} ({loc})")

# =============================================================
# Save output
# =============================================================
# Full data with classification
merged.to_csv('output/full_data_with_classification.csv', index=False, encoding='utf-8-sig')

# One row per school, with separate columns for men (ז) and women (נ)
men = merged[merged['מין'] == 'ז'][['school_key', 'גיוס', 'לחימה', 'קצונה', 'משמעותי']].rename(
    columns={'גיוס': 'גיוס_ז', 'לחימה': 'לחימה_ז', 'קצונה': 'קצונה_ז', 'משמעותי': 'משמעותי_ז'})
women = merged[merged['מין'] == 'נ'][['school_key', 'גיוס', 'לחימה', 'קצונה', 'משמעותי']].rename(
    columns={'גיוס': 'גיוס_נ', 'לחימה': 'לחימה_נ', 'קצונה': 'קצונה_נ', 'משמעותי': 'משמעותי_נ'})

class_info = merged[['school_key', 'מוסד', 'מועצה', 'פיקוח', 'מגזר', 'מחוז', 'רשות', 'ישוב',
                      'תלמידים', 'תלמידים_בנים', 'תלמידים_בנות', 'קבוצה']].drop_duplicates('school_key')

school_detail = class_info.merge(men, on='school_key', how='left').merge(women, on='school_key', how='left')
school_detail = school_detail.sort_values(['קבוצה', 'מוסד'])

school_detail.to_csv('output/schools_classified.csv', index=False, encoding='utf-8-sig')

# Excel with one sheet per sociological group
with pd.ExcelWriter('output/schools_classified_v2.xlsx', engine='openpyxl') as writer:
    school_detail.to_excel(writer, sheet_name='כל בתי הספר', index=False)
    for group in sorted(merged['קבוצה'].dropna().unique()):
        sheet_name = group.replace('/', '-')[:31]
        subset = school_detail[school_detail['קבוצה'] == group]
        subset.to_excel(writer, sheet_name=sheet_name, index=False)

    # Summary stats sheet - by group AND gender (weighted by student count)
    summary_rows = []
    for group in sorted(merged['קבוצה'].dropna().unique()):
        g = merged[merged['קבוצה'] == group]
        for gender in ['ז', 'נ']:
            gg = g[g['מין'] == gender]
            if len(gg) > 0:
                summary_rows.append({
                    'קבוצה': group, 'מין': gender,
                    'בתי ספר': gg['school_key'].nunique(),
                    'תלמידי יב': gg.drop_duplicates('school_key')['תלמידים_יב'].sum(),
                    'גיוס (משוקלל)': weighted_mean(gg, 'גיוס'),
                    'לחימה (משוקלל)': weighted_mean(gg, 'לחימה'),
                    'קצונה (משוקלל)': weighted_mean(gg, 'קצונה'),
                    'משמעותי (משוקלל)': weighted_mean(gg, 'משמעותי'),
                    'גיוס (פשוט)': gg['גיוס'].mean(),
                    'לחימה (פשוט)': gg['לחימה'].mean(),
                    'קצונה (פשוט)': gg['קצונה'].mean(),
                    'משמעותי (פשוט)': gg['משמעותי'].mean(),
                })
    summary = pd.DataFrame(summary_rows)
    summary.to_excel(writer, sheet_name='סיכום לפי קבוצה', index=False)

print(f"\nSaved:")
print(f"  output/full_data_with_classification.csv")
print(f"  output/schools_classified.csv")
print(f"  output/schools_classified_v2.xlsx")
