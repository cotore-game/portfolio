"use client";
import { useState } from "react";
import type { WorkEntry } from "@/lib/content-schema";
import { AccentText } from "./AccentText";
import { WorkImage } from "./WorkImage";

export function WorkCollection({
  entries,
  label,
}: {
  entries: WorkEntry[];
  label: string;
}) {
  const [tag, setTag] = useState<string | null>(null);
  const tags = [...new Set(entries.flatMap((entry) => entry.tags))];
  const visible = entries.filter((entry) => !tag || entry.tags.includes(tag));
  function toggle(value: string) {
    setTag((current) => (current === value ? null : value));
  }
  return (
    <>
      <div
        className="my-7 flex flex-wrap items-center gap-2"
        role="group"
        aria-label={`${label}の技術タグ`}
      >
        <button
          type="button"
          className={`tag ${tag === null ? "tag-selected" : ""}`}
          aria-pressed={tag === null}
          onClick={() => setTag(null)}
        >
          すべて
        </button>
        {tags.map((value) => (
          <button
            type="button"
            key={value}
            className={`tag ${tag === value ? "tag-selected" : ""}`}
            aria-pressed={tag === value}
            onClick={() => toggle(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length}件の{label}
      </p>
      <div className="grid gap-x-10 md:grid-cols-2">
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
                  onClick={() => toggle(value)}
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
