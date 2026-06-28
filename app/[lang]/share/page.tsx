import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Vercel Blob public URLs live on this host. We only ever advertise an image
 *  as our own `twitter:image` if it actually came from our store — otherwise a
 *  crafted `?img=` could make our domain render an arbitrary preview. */
const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

function safeImage(raw?: string | string[]): string | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (!v) return null;
  try {
    const u = new URL(v);
    if (u.protocol === "https:" && u.hostname.endsWith(BLOB_HOST_SUFFIX)) {
      return u.toString();
    }
  } catch {
    /* not a URL */
  }
  return null;
}

function firstParam(raw?: string | string[]): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { lang } = await params;
  const sp = await searchParams;
  const locale: Locale = isLocale(lang) ? lang : "he";
  const dict = getDictionary(locale);
  const image = safeImage(sp.img);
  const title = firstParam(sp.t) ?? dict.meta.title;

  // Ephemeral share permalinks shouldn't land in search indexes.
  const base: Metadata = { title, robots: { index: false, follow: true } };
  if (!image) return { ...base, description: dict.meta.description };

  return {
    ...base,
    description: dict.meta.description,
    openGraph: {
      title,
      description: dict.meta.description,
      images: [image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dict.meta.description,
      images: [image],
    },
  };
}

export default async function SharePage({ params, searchParams }: Props) {
  const { lang } = await params;
  const sp = await searchParams;
  const locale: Locale = isLocale(lang) ? lang : "he";
  const dict = getDictionary(locale);
  const image = safeImage(sp.img);
  const title = firstParam(sp.t) ?? dict.meta.title;

  return (
    <section className="space-y-5">
      {image ? (
        <>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="w-full rounded-2xl border border-white/10 shadow-xl shadow-black/30"
          />
        </>
      ) : (
        <p className="text-muted-foreground">{dict.meta.description}</p>
      )}

      <Link
        href={`/${locale}/overview`}
        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-white/15"
      >
        {dict.tabs.overview}
      </Link>
    </section>
  );
}
