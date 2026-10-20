"use client";

import { useState } from "react";
import type { WorkEntry } from "@/lib/content-schema";
import type { ProjectSummary } from "./ProjectCard";
import { ProjectList } from "./ProjectList";
import { WorkCollection } from "./WorkCollection";
import { AccentText } from "./AccentText";

export function PortfolioWorks({ projects, collections }: {
  projects: ProjectSummary[];
  collections: { experience: WorkEntry[]; inProgress: WorkEntry[] };
}) {
  const [tag, setTag] = useState<string | null>(null);
  const tags = [...new Set([
    ...projects.flatMap((project) => project.tags),
    ...collections.experience.flatMap((entry) => entry.tags),
    ...collections.inProgress.flatMap((entry) => entry.tags),
  ])];
  function toggleTag(value: string) {
    setTag((current) => current === value ? null : value);
  }

  return (
    <>
        <section
          id="works"
          className="shell py-16 sm:py-24"
          aria-labelledby="works-title"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="works-title" className="section-title">
              Selected works<span className="text-[#61754a]">.</span>
            </h2>
            <p className="text-xs text-stone-500">
              <AccentText>遊べるもの、使えるもの。</AccentText>
            </p>
          </div>
          <ProjectList
            projects={projects}
            tags={tags}
            tag={tag}
            onTagSelect={toggleTag}
          />
        </section>
        <section
          id="experience"
          className="shell pb-20"
          aria-labelledby="experience-title"
        >
          <h2 id="experience-title" className="section-title">
            More works<span className="text-[#61754a]">.</span>
          </h2>
          <p className="mt-5 text-sm leading-8 text-stone-500">
            <AccentText>
              ソースや作品本体は一般公開していませんが、制作した内容を紹介します。
            </AccentText>
          </p>
          <WorkCollection
            entries={collections.experience}
            label="制作実績"
            tag={tag}
            onTagSelect={toggleTag}
          />
        </section>
        <section
          id="in-progress"
          className="shell pb-20"
          aria-labelledby="progress-title"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="progress-title" className="section-title">
              On the workbench<span className="text-[#61754a]">.</span>
            </h2>
            <p className="text-xs text-stone-500">
              <AccentText>ただいま制作中。</AccentText>
            </p>
          </div>
          <WorkCollection
            entries={collections.inProgress}
            label="制作中の作品"
            tag={tag}
            onTagSelect={toggleTag}
          />
        </section>
    </>
  );
}
