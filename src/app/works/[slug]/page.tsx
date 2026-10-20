import { WorkImage } from "@/components/WorkImage";
import { AccentText } from "@/components/AccentText";
import { accentPunctuation } from "@/lib/punctuation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServerBlockNoteEditor } from "@blocknote/server-util";
import { SiteHeader } from "@/components/SiteHeader";
import { getProjects } from "@/lib/content";
import type { Metadata } from "next";

export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getProjects()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjects()).find(
    (project) => project.slug === slug,
  );
  return {
    title: project ? `${project.title} — cotore-game` : "作品が見つかりません",
    description: project?.description,
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = (await getProjects()).find(
    (project) => project.slug === slug,
  );
  if (!project) notFound();
  const editor = ServerBlockNoteEditor.create();
  const html = await editor.blocksToHTMLLossy(
    accentPunctuation(project.blocks),
  );

  return (
    <>
      <SiteHeader />
      <main className="shell py-14 sm:py-20">
        <Link href="/#works" className="text-sm text-stone-500 hover:underline">
          ← 作品一覧
        </Link>
        <header className="my-10 max-w-3xl">
          <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <div className="my-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <p className="text-base leading-8 text-stone-600">
            <AccentText>{project.description}</AccentText>
          </p>
          <dl className="mt-8 grid gap-4 border-y border-stone-300 py-6 text-sm">
            {[
              ["担当", project.role.replace(/^担当：/, "")],
              ["制作体制", project.team],
              ["制作期間", project.period],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="grid grid-cols-[80px_1fr] gap-4">
                  <dt className="text-stone-500">{label}</dt>
                  <dd>
                    <AccentText>{value}</AccentText>
                  </dd>
                </div>
              ))}
          </dl>
          <div className="mt-7 flex flex-wrap gap-6 text-sm">
            {project.links.map((link) => (
              <a
                href={link.href}
                key={link.href}
                className="border-b border-stone-400 pb-1"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </header>
        {project.cover && (
          <div className="max-w-3xl">
            <WorkImage media={project.cover} hero />
          </div>
        )}
        <article
          className="article-body max-w-3xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {process.env.NODE_ENV === "development" && (
          <a
            className="mt-12 inline-block text-sm underline"
            href={`http://localhost:3002/?slug=${project.slug}`}
          >
            この記事を編集する ↗
          </a>
        )}
      </main>
    </>
  );
}
