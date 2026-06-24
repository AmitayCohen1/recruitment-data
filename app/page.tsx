import Image from "next/image";
import cover from "@/public/cover.png";
import { SectorHeatmap } from "@/components/sectors/sector-heatmap";
import { SectorOverview } from "@/components/sectors/sector-overview";
import { GenderGap } from "@/components/sectors/gender-gap";
import { GapsOverview } from "@/components/sectors/gaps-overview";
import { BreakdownOverview } from "@/components/sectors/breakdown-overview";
import { FullData } from "@/components/sectors/full-data";
import { Explorer } from "@/components/dashboard/explorer";
import { Notes } from "@/components/dashboard/notes";
import { DashboardTabs } from "@/components/dashboard/tabs";
import { compactRows, zeroRows, TOTAL_SCHOOLS } from "@/lib/data";

export default function Home() {
  const rows = compactRows();
  const zeros = zeroRows();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 sm:pb-10">
      {/* hero — contained width, touching the top, rounded only at bottom */}
      <header className="relative mb-8 h-[32vh] min-h-[240px] w-full overflow-hidden rounded-b-2xl border-x border-b border-white/10 sm:h-[36vh]">
        <Image
          src={cover}
          alt="נתוני גיוס לפי בתי ספר ומגזרים"
          fill
          priority
          placeholder="blur"
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <h1 className="max-w-3xl text-2xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
            מפת גיוס לפי בתי ספר, מגזרים ואזורים
          </h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-6 text-white/80 drop-shadow-md sm:text-base sm:leading-7">
            השוואה אינטראקטיבית של {TOTAL_SCHOOLS.toLocaleString("he")} בתי
            ספר: שיעורי גיוס, שירות קרבי, קצונה ושירות משמעותי לפי מגזר, מגדר
            ושנה. הממוצעים משוקללים לפי מספר תלמידי י״ב.
          </p>
        </div>
      </header>

      {/* narrative sections, organized into tabs */}
      <DashboardTabs
        tabs={[
          {
            id: "sectors",
            label: "מפת מגזרים",
            content: (
              <>
                <SectorOverview />
                <SectorHeatmap />
              </>
            ),
          },
          {
            id: "gaps",
            label: "פערים והשוואות",
            content: (
              <>
                <GapsOverview />
                <GenderGap />
              </>
            ),
          },
          {
            id: "breakdown",
            label: "פילוחים ואזורים",
            content: <BreakdownOverview />,
          },
          {
            id: "schools",
            label: "חיפוש בתי ספר",
            content: (
              <div>
                <h2 className="mb-1 text-xl font-bold tracking-tight sm:text-2xl">
                  חיפוש והשוואת בתי ספר
                </h2>
                <p className="mb-5 text-sm text-muted-foreground">
                  מצאו בית ספר או רשות והשוו שיעורי גיוס, קרבי, קצונה ושירות
                  משמעותי לפי שנה ומגדר.
                </p>
                <Explorer rows={rows} zeroRows={zeros} />
              </div>
            ),
          },
          {
            id: "downloads",
            label: "מקורות נתונים",
            content: <FullData />,
          },
        ]}
      />

      <Notes />

      <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-muted-foreground">
        <div className="space-y-1 text-center leading-5">
          <p>
            built by{" "}
            <a
              href="https://www.linkedin.com/in/amitay-cohen-461481168/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 underline-offset-2 hover:underline"
            >
              Amitay Cohen
            </a>{" "}
            ·{" "}
            <a
              href="https://x.com/Idaneretz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 underline-offset-2 hover:underline"
            >
              Idan Erez
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
