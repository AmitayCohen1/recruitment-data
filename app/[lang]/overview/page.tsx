import type { Metadata } from "next";
import { ServicePipelinePanels } from "@/components/lab/lab";
import { GapsOverview } from "@/components/sectors/gaps-overview";
import { SectorOverview } from "@/components/sectors/sector-overview";
import { SectorBars3D } from "@/components/sectors/sector-bars-3d";
import { ArmyStream } from "@/components/sectors/army-stream";
import { SectorHeatmap } from "@/components/sectors/sector-heatmap";
import { GenderGap } from "@/components/sectors/gender-gap";
import { SchoolTerrain } from "@/components/schools/school-terrain";
import { sectionMetadata } from "@/lib/section-meta";

type Props = { params: Promise<{ lang: string }> };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  sectionMetadata(params, "overview");

export default function Page() {
  return (
    <div>
      <div className="space-y-8">
        <ArmyStream />
        <SectorOverview />
        <SectorBars3D />
        <ServicePipelinePanels />
        <SectorHeatmap />
        <GenderGap />
        <GapsOverview />
        <SchoolTerrain />
      </div>
    </div>
  );
}
