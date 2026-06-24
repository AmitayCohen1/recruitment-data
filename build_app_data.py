"""
Regenerate every app/data/*.json so the live dashboard is ALIGNED WITH THE
PUBLISHED FILE  public/full-recruitment-data.xlsx  ("נתוני גיוס מלאים").

That file is the source of truth: its combat/officer rates are correctly weighted
by ENLISTEES (שיעור קרבי = Σלוחמים / Σמתגייסים), and it bakes in the right cohort
weights (2024 → תלמידי יב 2021, 2018 → 2015). We therefore read the headline
aggregates straight from it instead of recomputing them — guaranteeing the site
and the download show identical numbers.

What comes from where:
  - sectors.json / regions.json, years 2018 & 2024 : taken directly from the file.
  - sectors.json byYearSector, years 2019-2023      : computed (same enlistee-weighting
        method; reproduces the file's 2018 numbers), only used by the trend chart.
  - recruitment.json / zero-schools.json            : raw per-school rows (no weighting,
        no bug) rebuilt from Recruitment-data-by-school.xlsx.

Inputs (repo root): נתוני גיוס מלאים.xlsx, Recruitment-data-by-school.xlsx,
                    full_data_with_classification.csv, תלמידי יב 2015.xlsx
Run:  python build_app_data.py
"""
import json
import os
import openpyxl
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "app", "data")
PUBLISHED = os.path.join(HERE, "public", "full-recruitment-data.xlsx")  # the source-of-truth download ("נתוני גיוס מלאים")
RECRUIT = os.path.join(HERE, "Recruitment-data-by-school.xlsx")
CLASS_CSV = os.path.join(HERE, "full_data_with_classification.csv")
STUDENTS = os.path.join(HERE, "תלמידי יב 2015.xlsx")

YEARS = list(range(2018, 2025))
FILE_YEARS = [2018, 2024]            # years present in the published file
COMPUTED_YEARS = [2019, 2020, 2021, 2022, 2023]
SECTORS = ["חילוני", "דתי לאומי", "חרדי", "דרוזי וערבי"]
REGIONS = ["מרכז", "פריפריה", "כפרי/קיבוצים", "התנחלויות", "ירושלים"]
R_SECTORS = ["הכל", "חילוני", "דתי לאומי", "חרדי"]
GENDERS = [("ז", "בנים", "m"), ("נ", "בנות", "f")]
ALL = "— הכל —"


def r1(x):
    return None if x is None else round(x, 1)


# ---------------------------------------------------------------------------
# 1) Parse the published file
# ---------------------------------------------------------------------------
def read_published():
    """Return {year: [ {sector, azor, gender, enlist, combat, officer,
    schools, cohort, enlistees, fighters, officers_abs}, ... ]}."""
    wb = openpyxl.load_workbook(PUBLISHED, read_only=True, data_only=True)
    out = {}
    for sheet in wb.sheetnames:
        try:
            year = int(sheet)
        except ValueError:
            continue
        rows = []
        for r in wb[sheet].iter_rows(values_only=True):
            if r[0] not in SECTORS or r[2] not in ("בנים", "בנות"):
                continue
            rows.append({
                "sector": r[0], "azor": r[1], "gender": r[2],
                "enlist": r[3], "combat": r[4], "officer": r[5],
                "schools": int(r[6]) if r[6] is not None else 0,
                "cohort": float(r[7] or 0), "enlistees": float(r[8] or 0),
                "fighters": float(r[9] or 0), "officers_abs": float(r[10] or 0),
            })
        out[year] = rows
    return out


def canonical_region(azor):
    if azor in ("ערי מרכז", "מרכז"):
        return "מרכז"
    if azor in ("ערי פריפריה", "פריפריה"):
        return "פריפריה"
    if azor in ("קיבוצים/כפרי", "פריפריה/כפרי"):
        return "כפרי/קיבוצים"
    if azor == "התנחלויות":
        return "התנחלויות"
    if azor == "ירושלים":
        return "ירושלים"
    return None  # ערי חרדים / ערים מעורבות / אחר → not a geographic region


def group_label(sector, azor):
    """Subgroup label matching the dashboard's convention."""
    if sector == "דרוזי וערבי":
        return "דרוזי וערבי"
    return f"{sector} - {azor}"


# ---------------------------------------------------------------------------
# 2) Source data for the computed middle years + raw per-school output
# ---------------------------------------------------------------------------
def sector_of(group):
    g = str(group)
    if g.startswith("חרדי"):
        return "חרדי"
    if g.startswith("דתי לאומי"):
        return "דתי לאומי"
    if g.startswith("חילוני"):
        return "חילוני"
    if g in ("דרוזי", "ערבי", "בדואי"):
        return "דרוזי וערבי"   # the published file merges Druze + Arab
    return None


def load_sources():
    csv = pd.read_csv(CLASS_CSV)
    csv["school_key"] = csv["school_key"].astype(int)
    cls = csv.drop_duplicates("school_key")[["school_key", "קבוצה"]].copy()
    cls["sector"] = cls["קבוצה"].map(sector_of)

    yb = pd.read_excel(STUDENTS, engine="openpyxl")
    w = (yb.groupby("סמל מוסד")
           .agg(boys=("מספר בנים", "sum"), girls=("מספר בנות", "sum"))
           .reset_index().rename(columns={"סמל מוסד": "school_key"}))
    w["school_key"] = w["school_key"].astype(int)

    frames = []
    for yr in YEARS:
        for he, glabel, gcode in GENDERS:
            sheet = f"{yr} {'גברים' if he == 'ז' else 'נשים'}"
            d = pd.read_excel(RECRUIT, sheet_name=sheet, engine="openpyxl").rename(columns={
                "מוסד": "school", "מועצה": "council", "גיוס": "enlist",
                "לחימה": "combat", "קצונה": "officer", "משמעותי": "meaning"})
            d["year"] = yr
            d["gender"] = gcode
            d["gender_he"] = glabel
            d["school_key"] = d["school_key"].astype(int)
            frames.append(d[["year", "gender", "gender_he", "school_key", "school",
                             "council", "enlist", "combat", "officer", "meaning"]])
    rec = pd.concat(frames, ignore_index=True)
    return cls, w, rec


def wmean(df, col, weight):
    v = df[[col, weight]].dropna()
    v = v[v[weight] > 0]
    if v.empty or v[weight].sum() == 0:
        return None
    return round((v[col] * v[weight]).sum() / v[weight].sum(), 1)


def computed_sector_row(m, year, sector, glabel):
    """File-method aggregate for one sector/gender from school rows:
    enlist weighted by cohort, combat/officer/meaning weighted by enlistees."""
    sub = m[(m["year"] == year) & (m["sector"] == sector) &
            (m["gender_he"] == glabel) & (m["w"] > 0) & m["enlist"].notna()]
    if sub.empty:
        return None
    return {
        "year": year, "sector": sector, "gender": glabel,
        "n": int(sub["school_key"].nunique()),
        "enlist": wmean(sub, "enlist", "w"),
        "combat": wmean(sub, "combat", "enlistees"),
        "officer": wmean(sub, "officer", "enlistees"),
        "meaning": wmean(sub, "meaning", "enlistees"),
    }


# ---------------------------------------------------------------------------
# 3) Build
# ---------------------------------------------------------------------------
def main():
    pub = read_published()
    cls, weights, rec = load_sources()

    # ---- recruitment.json / zero-schools.json (raw, disjoint) ---------------
    recruitment = [
        {"year": int(r.year), "gender": r.gender, "key": int(r.school_key),
         "school": r.school, "council": r.council,
         "enlist": round(float(r.enlist), 2),
         "combat": None if pd.isna(r.combat) else round(float(r.combat), 2),
         "officer": None if pd.isna(r.officer) else round(float(r.officer), 2),
         "meaning": None if pd.isna(r.meaning) else round(float(r.meaning), 2)}
        for r in rec.itertuples(index=False)
        if not pd.isna(r.enlist) and float(r.enlist) > 0
    ]
    zero = [
        {"y": int(r.year), "g": r.gender, "k": int(r.school_key),
         "s": r.school, "c": r.council}
        for r in rec.itertuples(index=False)
        if not pd.isna(r.enlist) and float(r.enlist) == 0
    ]

    # school rows tagged for the computed middle years
    m = rec.merge(cls, on="school_key", how="left").merge(weights, on="school_key", how="left")
    m["w"] = m.apply(lambda r: r["boys"] if r["gender"] == "m" else r["girls"], axis=1)
    m["enlistees"] = m["w"] * m["enlist"] / 100.0

    # ---- sectors.json :: byYearSector ---------------------------------------
    by_year_sector = []
    for year in YEARS:
        if year in pub:  # 2018 & 2024 — straight from the published file
            for row in pub[year]:
                if row["azor"] != ALL:
                    continue
                by_year_sector.append({
                    "year": year, "sector": row["sector"], "gender": row["gender"],
                    "n": row["schools"], "enlist": r1(row["enlist"]),
                    "combat": r1(row["combat"]), "officer": r1(row["officer"]),
                    "meaning": None,
                })
        else:            # 2019-2023 — computed (trend line only)
            for sector in SECTORS:
                for _, glabel, _ in GENDERS:
                    # the file has Druze+Arab for boys only; mirror that
                    if sector == "דרוזי וערבי" and glabel == "בנות":
                        continue
                    row = computed_sector_row(m, year, sector, glabel)
                    if row:
                        by_year_sector.append(row)

    # ---- sectors.json :: subgroups (2024, from the file) --------------------
    subgroups = []
    for row in pub[2024]:
        if row["azor"] == ALL:
            continue
        subgroups.append({
            "group": group_label(row["sector"], row["azor"]),
            "sector": row["sector"], "gender": row["gender"], "n": row["schools"],
            "enlist": r1(row["enlist"]), "combat": r1(row["combat"]),
            "officer": r1(row["officer"]), "meaning": None,
        })

    # ---- sectors.json :: schoolSector ---------------------------------------
    school_sector = {
        str(int(r.school_key)): r.sector
        for r in cls.itertuples(index=False)
        if r.sector in SECTORS
    }

    sectors_json = {
        "sectors": SECTORS, "years": YEARS,
        "byYearSector": by_year_sector, "subgroups": subgroups,
        "schoolSector": school_sector,
        "weighted": True, "weightBase": "2018→2015, 2024→2021",
    }

    # ---- regions.json (2018 & 2024, from the file) --------------------------
    region_rows = []
    for year in FILE_YEARS:
        for _, glabel, _ in GENDERS:
            grows = [r for r in pub[year] if r["gender"] == glabel and r["azor"] != ALL]
            # per-sector rows that map to a geographic region
            for r in grows:
                region = canonical_region(r["azor"])
                if region is None or r["sector"] not in ("חילוני", "דתי לאומי", "חרדי"):
                    continue
                region_rows.append({
                    "year": year, "region": region, "sector": r["sector"], "gender": glabel,
                    "n": r["schools"], "enlist": r1(r["enlist"]),
                    "combat": r1(r["combat"]), "officer": r1(r["officer"]), "meaning": None,
                })
            # "הכל" = pool the Jewish sectors within each region using absolutes
            for region in REGIONS:
                cells = [r for r in grows
                         if canonical_region(r["azor"]) == region
                         and r["sector"] in ("חילוני", "דתי לאומי", "חרדי")]
                if not cells:
                    continue
                cohort = sum(c["cohort"] for c in cells)
                enl = sum(c["enlistees"] for c in cells)
                fig = sum(c["fighters"] for c in cells)
                off = sum(c["officers_abs"] for c in cells)
                region_rows.append({
                    "year": year, "region": region, "sector": "הכל", "gender": glabel,
                    "n": sum(c["schools"] for c in cells),
                    "enlist": r1(100 * enl / cohort) if cohort else None,
                    "combat": r1(100 * fig / enl) if enl else None,
                    "officer": r1(100 * off / enl) if enl else None,
                    "meaning": None,
                })
    regions_json = {
        "regions": REGIONS, "sectors": R_SECTORS, "years": FILE_YEARS, "rows": region_rows,
    }

    # ---- validation: computed engine vs the file's 2018 (same 2015 cohort) --
    print("Validation — computed engine vs published file, 2018 (should match):")
    pub2018 = {(r["sector"], r["gender"]): r for r in pub[2018] if r["azor"] == ALL}
    for sector in SECTORS:
        for _, glabel, _ in GENDERS:
            if sector == "דרוזי וערבי" and glabel == "בנות":
                continue
            comp = computed_sector_row(m, 2018, sector, glabel)
            f = pub2018.get((sector, glabel))
            if comp and f:
                dc = None if f["combat"] is None else round((comp["combat"] or 0) - f["combat"], 1)
                print(f"  {sector:12s} {glabel:5s}  combat computed={comp['combat']:>5} "
                      f"file={f['combat']:>5}  Δ={dc}")

    # ---- write --------------------------------------------------------------
    def dump(name, obj):
        path = os.path.join(OUT, name)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
        print(f"  wrote {name:22s} ({os.path.getsize(path):,} bytes)")

    print("\nWriting app/data/:")
    dump("recruitment.json", recruitment)
    dump("zero-schools.json", zero)
    dump("sectors.json", sectors_json)
    dump("regions.json", regions_json)
    print(f"\nrecruitment: {len(recruitment):,} | zero: {len(zero):,} | "
          f"byYearSector: {len(by_year_sector)} | subgroups: {len(subgroups)} | "
          f"regions: {len(region_rows)} | schools: {len(school_sector)}")


if __name__ == "__main__":
    main()
