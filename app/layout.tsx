import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ベビトク｜子育て世代のおトクを増やす",
  description:
    "紙おむつ・粉ミルク・おしりふきなど、ベビー用品の価格を比較して、おトクな商品を探せるサイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}