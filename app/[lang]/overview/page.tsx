import type { Metadata } from "next";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { ServicePipelinePanels } from "@/components/lab/lab";
import { GapsOverview } from "@/components/sectors/gaps-overview";
import { SectorOverview } from "@/components/sectors/sector-overview";
import { SectorBars3D } from "@/components/sectors/sector-bars-3d";
import { ArmyStream } from "@/components/sectors/army-stream";
import { SectorHeatmap } from "@/components/sectors/sector-heatmap";
import { GenderGap } from "@/components/sectors/gender-gap";
import { SchoolTerrain } from "@/components/schools/school-terrain";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { sectionMetadata } from "@/lib/section-meta";

type Props = { params: Promise<{ lang: string }> };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  sectionMetadata(params, "overview");

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "he";
  const t = getDictionary(locale);

  return (
    <div>
      <SectionHeading title={t.overviewTab.title} subtitle={t.overviewTab.subtitle} />
      <div className="space-y-6">
        <ArmyStream />
        <SectorOverview />
        <SectorBars3D />
        <SectorHeatmap />
        <GenderGap />
        <GapsOverview />
        <ServicePipelinePanels />
        <SchoolTerrain />
      </div>
    </div>
  );
}
