import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "מפת גיוס לפי בתי ספר ומגזרים | נתוני צה״ל",
  description:
    "דשבורד אינטראקטיבי להשוואת שיעורי גיוס, שירות קרבי, קצונה ושירות משמעותי לפי בתי ספר, מגזרים, אזורים, שנים ומגדר.",
  openGraph: {
    title: "מפת גיוס לפי בתי ספר ומגזרים | נתוני צה״ל",
    description:
      "דשבורד אינטראקטיבי להשוואת שיעורי גיוס, שירות קרבי, קצונה ושירות משמעותי לפי בתי ספר, מגזרים, אזורים, שנים ומגדר.",
    images: [{ url: "/og.jpg", width: 1200, height: 669 }],
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "מפת גיוס לפי בתי ספר ומגזרים | נתוני צה״ל",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
