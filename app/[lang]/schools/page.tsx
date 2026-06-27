import type { Metadata } from "next";
import { Explorer } from "@/components/dashboard/explorer";
import { Leaderboards } from "@/components/sectors/leaderboards";
import { SchoolCharts } from "@/components/schools/school-charts";
import { SchoolCloud } from "@/components/schools/school-cloud";
import { compactRows, zeroRows } from "@/lib/data";
import { sectionMetadata } from "@/lib/section-meta";

type Props = { params: Promise<{ lang: string }> };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  sectionMetadata(params, "search");

export default function Page() {
  const rows = compactRows();
  const zeros = zeroRows();
  return (
    <div>
      <div className="space-y-8">
        <SchoolCharts />
        <SchoolCloud />
        {/* extremes + lookup table stay last: tell the story first, then let
            people inspect the edges and drill into the raw rows */}
        <Leaderboards />
        <Explorer rows={rows} zeroRows={zeros} />
      </div>
    </div>
  );
}
