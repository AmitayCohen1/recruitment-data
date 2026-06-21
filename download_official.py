"""
Download the official MoE school list from the data.gov.il datastore API
(no manual download needed) and write mosdot.xlsx with one row per school
(latest year), holding the columns verify_classification.py expects.
"""
import json
import urllib.parse
import urllib.request
import openpyxl

RESOURCE = "5548fd63-5868-4053-ad81-98caddc5e232"
BASE = "https://data.gov.il/api/3/action/datastore_search"
FIELDS = ["סמל מוסד", "שנה", "פיקוח", "מגזר", "מחוז גאוגרפי",
          "שם רשות", "שם ישוב", "סוג מוסד"]
PAGE = 32000


def fetch(offset):
    params = {
        "resource_id": RESOURCE,
        "limit": PAGE,
        "offset": offset,
        "fields": ",".join(FIELDS),
    }
    url = BASE + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)["result"]


def main():
    first = fetch(0)
    total = first["total"]
    print(f"total records: {total:,}")
    records = list(first["records"])
    off = PAGE
    while off < total:
        records.extend(fetch(off)["records"])
        print(f"  fetched {min(off+PAGE,total):,}/{total:,}")
        off += PAGE

    # keep the latest year per school_key
    best = {}
    for rec in records:
        try:
            k = int(rec["סמל מוסד"])
        except (TypeError, ValueError, KeyError):
            continue
        yr = rec.get("שנה") or 0
        try:
            yr = int(yr)
        except (TypeError, ValueError):
            yr = 0
        if k not in best or yr > best[k][0]:
            best[k] = (yr, rec)

    years = sorted({v[0] for v in best.values()})
    print(f"unique schools: {len(best):,}   years present: {years}")

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "mosdot"
    headers = ["סמל מוסד", "פיקוח", "מגזר", "מחוז גאוגרפי לחינוך",
               "רשות לימודים", "ישוב לימודים", "סוג מוסד", "שנה"]
    ws.append(headers)
    for k, (yr, rec) in sorted(best.items()):
        ws.append([
            k, rec.get("פיקוח"), rec.get("מגזר"), rec.get("מחוז גאוגרפי"),
            rec.get("שם רשות"), rec.get("שם ישוב"), rec.get("סוג מוסד"), yr,
        ])
    wb.save("mosdot.xlsx")
    print("saved mosdot.xlsx")


if __name__ == "__main__":
    main()
