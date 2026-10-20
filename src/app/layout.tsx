import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "cotore-game — Portfolio",
  description:
    "Unity / C#を中心に制作したゲームと開発支援ツール。せっかくなので、ゆっくり見ていってください。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
