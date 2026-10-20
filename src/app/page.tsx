import { ProjectList } from "@/components/ProjectList";
import { SiteHeader } from "@/components/SiteHeader";
import { AccentText } from "@/components/AccentText";
import { WorkCollection } from "@/components/WorkCollection";
import { getCollections, getProjects } from "@/lib/content";

export default async function Home() {
  const [projects, collections] = await Promise.all([
    getProjects(),
    getCollections(),
  ]);
  return (
    <>
      <a
        href="#works"
        className="sr-only focus:not-sr-only focus:absolute focus:bg-white focus:p-4"
      >
        作品へスキップ
      </a>
      <SiteHeader />
      <main>
        <section className="shell pt-16 sm:pt-24" aria-labelledby="title">
          <h1
            id="title"
            className="my-8 text-[clamp(3.3rem,8vw,7rem)] leading-[1.05] font-medium tracking-[-0.06em]"
          >
            Oh, you found
            <br />
            this place<span className="text-[#61754a]">…</span>
          </h1>
          <div className="flex items-center justify-between gap-5">
            <p className="text-xs leading-8 text-stone-600 sm:text-sm">
              <AccentText>
                ゲームをつくる。つくるための道具もつくる。
              </AccentText>
              <br />
              <AccentText>
                せっかくなので、ゆっくり見ていってください。
              </AccentText>
            </p>
            <a
              href="#works"
              aria-label="作品を見る"
              className="grid size-14 shrink-0 place-items-center rounded-full border text-2xl transition-colors hover:bg-stone-800 hover:text-white"
            >
              ↓
            </a>
          </div>
        </section>
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
            projects={projects.map(
              ({ blocks: _blocks, ...project }) => project,
            )}
          />
        </section>
        <section
          id="experience"
          className="shell pb-20"
          aria-labelledby="experience-title"
        >
          <h2 id="experience-title" className="section-title">
            制作実績<span className="text-[#61754a]">。</span>
          </h2>
          <p className="mt-5 text-sm leading-8 text-stone-500">
            <AccentText>
              ソースや作品本体は一般公開していませんが、制作した内容を紹介します。
            </AccentText>
          </p>
          <WorkCollection entries={collections.experience} label="制作実績" />
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
          />
        </section>
        <section
          id="about"
          className="shell border-t border-stone-800 pt-8 pb-20"
          aria-labelledby="about-title"
        >
          <div className="mt-9 grid gap-8 md:grid-cols-2 md:gap-16">
            <h2
              id="about-title"
              className="text-3xl leading-relaxed font-medium tracking-tight"
            >
              つくることと、
              <br />
              <AccentText>つくりやすくすること。</AccentText>
            </h2>
            <div className="space-y-4 text-sm leading-8 text-stone-600">
              <p>
                <AccentText>
                  cotore-gameです。Unity /
                  C#を中心に、ゲームと開発支援ツールを制作しています。
                </AccentText>
              </p>
              <p>
                <AccentText>
                  ゲームの仕組みや演出の実装から、データを扱うライブラリ、繰り返す作業を減らす道具まで。作品と、その制作を支える仕組みの両方に取り組んでいます。
                </AccentText>
              </p>
              <a
                className="inline-block border-b border-stone-500 text-xs text-stone-800"
                href="https://github.com/cotore-game"
              >
                More on GitHub ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="shell flex flex-wrap items-center justify-between gap-5 border-t border-stone-300 py-8 text-xs">
        <span className="text-base font-semibold">
          cotore-game<span className="text-[#61754a]">.</span>
        </span>
        <p className="text-stone-500">Thanks for looking around.</p>
        <a href="#">Back to top ↑</a>
      </footer>
    </>
  );
}
