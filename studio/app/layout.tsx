import "./studio.css";
export const viewport = { interactiveWidget: "resizes-content" as const };
export const metadata = {
  title: "記事を書く — cotore-game",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
