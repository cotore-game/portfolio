import { AccentText } from "./AccentText";
import { WorkImage } from "./WorkImage";
import Link from "next/link";
import type { Project } from "@/lib/content-schema";

export type ProjectSummary = Omit<Project, "blocks">;
export function ProjectCard({
  project,
  selectedTag,
  onTagSelect,
}: {
  project: ProjectSummary;
  selectedTag: string | null;
  onTagSelect: (tag: string) => void;
}) {
  return (
    <article className="border-t border-stone-300 py-7">
      {project.cover && (
        <Link href={`/works/${project.slug}/`}>
          <WorkImage media={project.cover} />
        </Link>
      )}
      <h3 className="mb-4 text-2xl font-medium tracking-tight">
        <Link
          href={`/works/${project.slug}/`}
          className="hover:underline decoration-stone-400 underline-offset-4"
        >
          {project.title}
        </Link>
      </h3>
      <div className="mb-5 flex flex-wrap gap-2" aria-label="使用技術">
        {project.tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagSelect(tag)}
            aria-pressed={selectedTag === tag}
            className={`tag ${selectedTag === tag ? "tag-selected" : ""}`}
          >
            {tag}
          </button>
        ))}
      </div>
      <p className="text-sm leading-8 text-stone-600">
        <AccentText>{project.description}</AccentText>
      </p>
      {project.role && (
        <p className="mt-3 text-xs leading-6 text-stone-500">
          <AccentText>{project.role}</AccentText>
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs">
        <Link
          href={`/works/${project.slug}/`}
          className="border-b border-stone-600 pb-1"
        >
          詳しく見る →
        </Link>
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="border-b border-stone-300 pb-1 hover:border-stone-900"
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    </article>
  );
}
