import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

/** Receives a chart PNG from the client and stores it in Vercel Blob, returning
 *  the public URL. That URL becomes the `twitter:image` of a `/share` page, so a
 *  tweet linking to it unfurls with the chart as its card image.
 *
 *  Requires a connected Blob store (BLOB_READ_WRITE_TOKEN). Without it `put`
 *  throws and we return 503 — the client treats that as "no card" and still
 *  opens the X composer, just without the chart preview. */
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "blob-not-configured" }, { status: 503 });
  }

  const body = await request.arrayBuffer();
  // Guard against empty / oversized uploads (X caps card images at 5MB).
  if (body.byteLength === 0 || body.byteLength > 5_000_000) {
    return NextResponse.json({ error: "bad-size" }, { status: 400 });
  }

  try {
    const blob = await put(`share/${crypto.randomUUID()}.png`, body, {
      access: "public",
      contentType: "image/png",
    });
    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json({ error: "upload-failed" }, { status: 502 });
  }
}
