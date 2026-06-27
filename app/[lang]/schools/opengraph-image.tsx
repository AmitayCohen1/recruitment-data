import { OG_SIZE, OG_CONTENT_TYPE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image({ params }: { params: Promise<{ lang: string }> }) {
  return renderOg(params, "schools");
}
