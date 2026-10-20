"use client";

import { useState } from "react";
import { ProjectCard, type ProjectSummary } from "./ProjectCard";

export function ProjectList({ projects, tags, tag, onTagSelect }: {
  projects: ProjectSummary[];
  tags: string[];
  tag: string | null;
  onTagSelect: (tag: string) => void;
}) {
  const [category, setCategory] = useState("all");
  const visible = projects.filter(
    (project) =>
      (category === "all" || project.category === category) &&
      (!tag || project.tags.includes(tag)),
  );

  return (
    <>
      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="作品の種類"
      >
        {[
          { value: "all", label: "すべて" },
          { value: "game", label: "ゲーム" },
          { value: "tool", label: "ツール・Web" },
        ].map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={category === value}
            onClick={() => {
              setCategory(value);
            }}
            className={`cursor-pointer rounded-full border px-5 py-2 text-sm ${category === value ? "border-stone-800 bg-stone-800 text-white" : "border-stone-300"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        className="mt-4 mb-7 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="すべての作品を技術タグで絞り込み"
      >
        {tags.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={tag === value}
            onClick={() => onTagSelect(value)}
            className={`tag ${tag === value ? "tag-selected" : ""}`}
          >
            {value}
          </button>
        ))}
        {tag && (
          <button
            type="button"
            onClick={() => tag && onTagSelect(tag)}
            className="ml-2 text-xs underline underline-offset-4"
          >
            解除
          </button>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length}件の作品
      </p>
      {visible.length === 0 && (
        <p className="py-7 text-sm text-stone-500">該当する作品はありません。</p>
      )}
      <div className="grid gap-x-10 md:grid-cols-2">
        {visible.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            selectedTag={tag}
            onTagSelect={onTagSelect}
          />
        ))}
      </div>
    </>
  );
}
