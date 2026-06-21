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
    "לוח מחוונים אינטראקטיבי לנתוני גיוס, לחימה, קצונה ושירות משמעותי לפי בתי ספר, מועצות, שנים ומגדר.",
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
