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
        <Link
          href={`/works/${project.slug}/`}
          aria-label={`${project.title}の制作記事を読む`}
          className="relative block transition-opacity hover:opacity-90"
        >
          <WorkImage media={project.cover} />
          <span className="absolute right-3 bottom-3 rounded-full bg-stone-800 px-4 py-2 text-xs text-white">
            制作記事を読む →
          </span>
        </Link>
      )}
      <h3 className="mb-4 text-2xl font-medium tracking-tight">
        <Link
          href={`/works/${project.slug}/`}
          className="inline-flex items-center gap-3 decoration-stone-400 underline-offset-4 hover:underline"
        >
          {project.title}
          <span aria-hidden="true" className="text-lg text-[#61754a]">↗</span>
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
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs">
        <Link
          href={`/works/${project.slug}/`}
          className="inline-flex items-center rounded-full bg-[#61754a] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4e603b]"
          aria-label={`${project.title}の制作記事を読む`}
        >
          制作記事を読む →
        </Link>
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900"
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    </article>
  );
}
