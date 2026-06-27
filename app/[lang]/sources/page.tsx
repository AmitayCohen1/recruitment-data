import type { Metadata } from "next";
import { FullData } from "@/components/sectors/full-data";
import { sectionMetadata } from "@/lib/section-meta";

type Props = { params: Promise<{ lang: string }> };

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  sectionMetadata(params, "sources");

export default function Page() {
  return <FullData />;
}
