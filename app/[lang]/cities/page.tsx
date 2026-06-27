import type { Metadata } from "next";
import { RegionView } from "@/components/sectors/region-view";
import { Cities } from "@/components/dashboard/cities";
import { CityCharts } from "@/components/cities/city-charts";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { compactRows } from "@/lib/data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { sectionMetadata } from "@/lib/section-meta";

type Props = { params: Promise<{ lang: string }> };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  sectionMetadata(params, "cities");

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "he";
  const t = getDictionary(locale);
  const rows = compactRows();
  return (
    <div>
      <SectionHeading title={t.citiesTab.title} subtitle={t.citiesTab.subtitle} />
      <div className="space-y-6">
        <RegionView />
        <CityCharts />
        <Cities rows={rows} />
      </div>
    </div>
  );
}
