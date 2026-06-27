import type { Metadata } from "next";
import { Explorer } from "@/components/dashboard/explorer";
import { Leaderboards } from "@/components/sectors/leaderboards";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { compactRows, zeroRows } from "@/lib/data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { sectionMetadata } from "@/lib/section-meta";

type Props = { params: Promise<{ lang: string }> };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  sectionMetadata(params, "search");

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "he";
  const t = getDictionary(locale);
  const rows = compactRows();
  const zeros = zeroRows();
  return (
    <div>
      <SectionHeading title={t.searchTab.title} subtitle={t.searchTab.subtitle} />
      <div className="space-y-6">
        <Explorer rows={rows} zeroRows={zeros} />
        <Leaderboards />
      </div>
    </div>
  );
}
