import { AccentText } from "@/components/AccentText";
import { SiteHeader } from "@/components/SiteHeader";
import { SkillList } from "@/components/SkillList";
import { getSkills } from "@/lib/content";

export const metadata = { title: "得意分野とスキル — cotore-game" };
export default async function SkillsPage() {
  const data = await getSkills();
  return (
    <>
      <SiteHeader />
      <main className="shell py-16">
        <h1 className="text-4xl font-medium tracking-tight">
          得意分野とスキル
        </h1>
        <section aria-labelledby="strengths-title" className="mt-16">
          <h2 id="strengths-title" className="section-title">
            取り組んでいること
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {data.strengths.map((strength) => (
              <div
                key={strength.title}
                className="border-t border-stone-300 pt-5"
              >
                <h3 className="mb-4 text-lg">{strength.title}</h3>
                <p className="text-sm leading-8 text-stone-600">
                  <AccentText>{strength.description}</AccentText>
                </p>
              </div>
            ))}
          </div>
        </section>
        <section aria-labelledby="skills-title" className="mt-20">
          <h2 id="skills-title" className="section-title">
            言語・ツール・フレームワーク
          </h2>
          <p className="mt-5 text-sm leading-7 text-stone-500">
            <AccentText>
              習熟度は自己評価です。未設定の項目は並び順にかかわらず末尾に表示します。
            </AccentText>
          </p>
          <SkillList skills={data.skills} />
        </section>
      </main>
    </>
  );
}
