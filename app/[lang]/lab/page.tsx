import type { Metadata } from "next";
import { Lab } from "@/components/lab/lab";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { sectionMetadata } from "@/lib/section-meta";

type Props = { params: Promise<{ lang: string }> };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  sectionMetadata(params, "lab");

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "he";
  const t = getDictionary(locale);
  return (
    <div>
      <SectionHeading title={t.labTab.title} subtitle={t.labTab.subtitle} />
      <Lab />
    </div>
  );
}
