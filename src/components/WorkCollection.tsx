"use client";
import type { WorkEntry } from "@/lib/content-schema";
import { AccentText } from "./AccentText";
import { WorkImage } from "./WorkImage";

export function WorkCollection({
  entries,
  label,
  tag,
  onTagSelect,
}: {
  entries: WorkEntry[];
  label: string;
  tag: string | null;
  onTagSelect: (tag: string) => void;
}) {
  const visible = entries.filter((entry) => !tag || entry.tags.includes(tag));
  return (
    <>
      <p className="sr-only" aria-live="polite">
        {visible.length}件の{label}
      </p>
      {visible.length === 0 && (
        <p className="mt-7 text-sm text-stone-500">該当する作品はありません。</p>
      )}
      <div className="mt-7 grid gap-x-10 md:grid-cols-2">
        {visible.map((entry) => (
          <article key={entry.id} className="border-t border-stone-300 py-7">
            {entry.image && <WorkImage media={entry.image} />}
            <h3 className="mb-4 text-xl font-medium tracking-tight">
              {entry.title}
            </h3>
            <div className="mb-5 flex flex-wrap gap-2" aria-label="使用技術">
              {entry.tags.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`tag ${tag === value ? "tag-selected" : ""}`}
                  aria-pressed={tag === value}
                  onClick={() => onTagSelect(value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className="text-sm leading-8 text-stone-600">
              <AccentText>{entry.description}</AccentText>
            </p>
            {entry.detail && (
              <p className="mt-3 text-sm leading-8 text-stone-500">
                <AccentText>{entry.detail}</AccentText>
              </p>
            )}
            {entry.links && (
              <div className="mt-5 flex flex-wrap gap-5 text-xs">
                {entry.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="border-b border-stone-300 pb-1"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
