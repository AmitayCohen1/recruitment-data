import { Download, FileSpreadsheet } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/panel";

type FileItem = {
  href: string;
  title: string;
  desc: string;
};

const FILES: FileItem[] = [
  {
    href: "/full-recruitment-data.xlsx",
    title: "קובץ נתונים מצרפי מלא",
    desc: "פילוח לפי מגזר, תת-קבוצה, אזור ומגדר — כולל שיעורי גיוס, קרבי, קצונה ומספרים מוחלטים לשנים 2018 ו־2024.",
  },
  {
    href: "/Recruitment-data-by-school.xlsx",
    title: "קובץ נתונים ברמת בית ספר",
    desc: "נתוני המקור לכל בית ספר בנפרד, כולל רשות, שנה, מגדר ומדדי הגיוס הזמינים.",
  },
];

export function FullData() {
  return (
    <Panel>
      <PanelHeader
        title="הורדת קובצי הנתונים"
        noExport
        subtitle="קובצי Excel להמשך בדיקה, הצלבה או ניתוח עצמאי של הנתונים."
      />

      <ul className="space-y-3">
        {FILES.map((f) => (
          <li key={f.href}>
            <a
              href={f.href}
              download
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] sm:items-center sm:gap-4"
            >
              <FileSpreadsheet className="size-7 shrink-0 text-emerald-300" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground">{f.title}</p>
                  <Download className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                </div>
                <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <p className="pt-4 text-xs leading-5 text-muted-foreground">
        הנתונים התקבלו מצה״ל במסגרת חוק חופש המידע, באדיבות התנועה לחופש המידע.
      </p>
    </Panel>
  );
}
