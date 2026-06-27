import type { Metadata } from "next";
import { GapsOverview } from "@/components/sectors/gaps-overview";
import { GenderGap } from "@/components/sectors/gender-gap";
import { sectionMetadata } from "@/lib/section-meta";

type Props = { params: Promise<{ lang: string }> };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  sectionMetadata(params, "gaps");

export default function Page() {
  return (
    <>
      <GapsOverview />
      <GenderGap />
    </>
  );
}
