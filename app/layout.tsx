import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "גיוס לפי בתי ספר | נתוני צה״ל",
  description:
    "לוח מחוונים אינטראקטיבי לנתוני גיוס, שירות קרבי, קצונה ושירות משמעותי לפי בתי ספר, מועצות, שנים ומגדר.",
  openGraph: {
    title: "גיוס לפי בתי ספר | נתוני צה״ל",
    description:
      "לוח מחוונים אינטראקטיבי לנתוני גיוס, שירות קרבי, קצונה ושירות משמעותי לפי בתי ספר, מועצות, שנים ומגדר.",
    images: [{ url: "/og.jpg", width: 1200, height: 669 }],
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "גיוס לפי בתי ספר | נתוני צה״ל",
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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
