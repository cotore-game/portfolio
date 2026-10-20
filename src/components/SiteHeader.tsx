import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="shell flex items-center justify-between border-b border-stone-300 py-7">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        cotore-game
        <span className="ml-1 align-top text-xs text-[#61754a]">●</span>
      </Link>
      <nav
        aria-label="メイン"
        className="flex flex-wrap gap-4 text-xs sm:gap-7"
      >
        <Link href="/#works">作品</Link>
        <Link href="/skills/">スキル</Link>
        <a href="https://github.com/cotore-game">GitHub ↗</a>
      </nav>
    </header>
  );
}
