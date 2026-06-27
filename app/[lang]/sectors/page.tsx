import type { Metadata } from "next";
import { SectorOverview } from "@/components/sectors/sector-overview";
import { SectorHeatmap } from "@/components/sectors/sector-heatmap";
import { ArmyStream } from "@/components/sectors/army-stream";
import { SectorBars3D } from "@/components/sectors/sector-bars-3d";
import { sectionMetadata } from "@/lib/section-meta";

type Props = { params: Promise<{ lang: string }> };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  sectionMetadata(params, "sectors");

export default function Page() {
  return (
    <>
      <SectorOverview />
      <SectorHeatmap />
      <ArmyStream />
      <SectorBars3D />
    </>
  );
}
