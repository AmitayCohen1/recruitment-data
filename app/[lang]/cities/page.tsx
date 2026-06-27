import type { Metadata } from "next";
import { CityOutliersPanel } from "@/components/lab/lab";
import { RegionView } from "@/components/sectors/region-view";
import { Cities } from "@/components/dashboard/cities";
import { CityCharts } from "@/components/cities/city-charts";
import { compactRows } from "@/lib/data";
import { sectionMetadata } from "@/lib/section-meta";

type Props = { params: Promise<{ lang: string }> };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  sectionMetadata(params, "cities");

export default function Page() {
  const rows = compactRows();
  return (
    <div>
      <div className="space-y-8">
        <CityCharts />
        <RegionView />
        <CityOutliersPanel />
        <Cities rows={rows} />
      </div>
    </div>
  );
}
