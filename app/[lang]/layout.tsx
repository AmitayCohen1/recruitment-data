import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heebo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Image from "next/image";
import {
  PieChart,
  Scale,
  Search,
  Download,
  Building2,
  FlaskConical,
  Boxes,
  Spline,
} from "lucide-react";
import "../globals.css";
import cover from "@/public/cover.png";
import {
  locales,
  isLocale,
  dirOf,
  htmlLang,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { TabNav, type NavItem } from "@/components/dashboard/tab-nav";
import { Notes } from "@/components/dashboard/notes";
import { TOTAL_SCHOOLS } from "@/lib/data";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "he";
  const dict = getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      images: [{ url: "/og.jpg", width: 1200, height: 669 }],
      locale: htmlLang(locale).replace("-", "_"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      images: ["/og.jpg"],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  const navItems: NavItem[] = [
    { id: "sectors", label: t.tabs.sectors, icon: <PieChart className="size-4" /> },
    { id: "gaps", label: t.tabs.gaps, icon: <Scale className="size-4" /> },
    { id: "cities", label: t.tabs.cities, icon: <Building2 className="size-4" /> },
    { id: "schools", label: t.tabs.search, icon: <Search className="size-4" /> },
    { id: "lab", label: t.tabs.lab, icon: <FlaskConical className="size-4" /> },
    { id: "three", label: t.tabs.three, icon: <Boxes className="size-4" /> },
    { id: "d3", label: t.tabs.d3, icon: <Spline className="size-4" /> },
    { id: "sources", label: t.tabs.sources, icon: <Download className="size-4" /> },
  ];

  return (
    <html
      lang={htmlLang(lang)}
      dir={dirOf(lang)}
      className={`${heebo.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <LocaleProvider locale={lang}>
          <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 sm:pb-10">
            {/* hero — contained width, touching the top, rounded only at bottom */}
            <header className="relative -mx-4 mb-8 h-[32vh] min-h-[240px] overflow-hidden border-b border-white/10 sm:mx-0 sm:h-[36vh] sm:rounded-b-2xl sm:border-x">
              <Image
                src={cover}
                alt={t.hero.imageAlt}
                fill
                priority
                placeholder="blur"
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/65 to-black/10" />
              <div className="absolute end-4 top-4 z-10">
                <LanguageToggle />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <h1 className="max-w-3xl text-2xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
                  {t.hero.title}
                </h1>
                <p className="mt-2.5 max-w-2xl text-sm leading-6 text-white/80 drop-shadow-md sm:text-base sm:leading-7">
                  {t.hero.subtitle(TOTAL_SCHOOLS.toLocaleString(htmlLang(lang)))}
                </p>
                <p className="mt-3.5 text-sm font-medium text-white drop-shadow-md sm:text-base">
                  {t.hero.feedback}{" "}
                  <a
                    href="https://x.com/messages/compose?recipient_id=1926622482"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-white/15 px-2 py-0.5 font-semibold text-white underline decoration-white/60 underline-offset-2 ring-1 ring-white/20 transition-colors hover:bg-white/25 hover:decoration-white"
                  >
                    amitay1599@
                  </a>
                </p>
              </div>
            </header>

            <TabNav lang={lang} items={navItems} />

            <main className="space-y-6">{children}</main>

            <Notes />

            <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-muted-foreground">
              <div className="space-y-1 text-center leading-5">
                <p>
                  built by{" "}
                  <a
                    href="https://x.com/amitay1599"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 underline-offset-2 hover:underline"
                  >
                    Amitay Cohen
                  </a>{" "}
                  ·{" "}
                  <a
                    href="https://x.com/Idaneretz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 underline-offset-2 hover:underline"
                  >
                    Idan Erez
                  </a>
                </p>
              </div>
            </footer>
          </div>
          <Analytics />
        </LocaleProvider>
      </body>
    </html>
  );
}
