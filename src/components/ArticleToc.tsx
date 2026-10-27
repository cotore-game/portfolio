"use client";

import { useEffect, useState } from "react";
import type { ArticleHeading } from "@/lib/article-headings";

export function ArticleToc({ headings }: { headings: ArticleHeading[] }) {
  const [active, setActive] = useState(headings[0]?.id);
  useEffect(() => {
    function update() {
      const current = headings.filter(({ id }) => {
        const element = document.getElementById(id);
        return element && element.getBoundingClientRect().top <= 140;
      }).at(-1);
      setActive(current?.id ?? headings[0]?.id);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [headings]);
  if (!headings.length) return null;
  const baseLevel = Math.min(...headings.map(({ level }) => level));
  return (
    <nav aria-label="記事の目次" className="article-toc">
      <details open>
        <summary className="cursor-pointer text-sm font-medium">目次</summary>
        <ol className="mt-4 space-y-1 border-l border-stone-300">
          {headings.map(({ id, text, level }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "location" : undefined}
                onClick={() => setActive(id)}
                style={{ paddingLeft: `${1 + (level - baseLevel) * 0.85}rem` }}
                className={`block border-l-2 py-1.5 pr-2 text-sm leading-6 transition-colors hover:text-[#61754a] ${active === id ? "border-[#61754a] font-medium text-[#61754a]" : "border-transparent text-stone-500"}`}
              >
                {text}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
