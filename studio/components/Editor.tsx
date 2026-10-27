"use client";
import { useEffect, useRef, useState } from "react";
import type { PartialBlock } from "@blocknote/core";
import { createArticleBlocks } from "../../src/lib/article-template";
import { getArticleHeadings } from "../../src/lib/article-headings";
import { ja } from "@blocknote/core/locales";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {
  levels,
  type Project,
  type Skills,
} from "../../src/lib/content-schema";

type Article = { document: Project; revision: string | null };
async function api(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "処理できませんでした");
  return data;
}

function ArticleForm({
  initial,
  onSaved,
  onDirty,
}: {
  initial: Article;
  onSaved: (article: Article) => void;
  onDirty: (dirty: boolean) => void;
}) {
  const [project, setProject] = useState(initial.document);
  const [revision, setRevision] = useState(initial.revision);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const editor = useCreateBlockNote({
    dictionary: ja,
    initialContent: project.blocks as PartialBlock[],
    uploadFile: async (file) => {
      const data = new FormData();
      data.set("file", file);
      data.set("slug", project.slug);
      const result = await api("/api/upload", { method: "POST", body: data });
      return result.url;
    },
  });
  const [outline, setOutline] = useState(() => getArticleHeadings(project.blocks));
  function change<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((current) => ({ ...current, [key]: value }));
    onDirty(true);
    setMessage("");
  }
  async function save() {
    setBusy(true);
    setMessage("");
    try {
      const saved = await api(`/api/articles/${project.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: {
            ...project,
            tags: project.tags.filter(Boolean),
            blocks: editor.document,
          },
          revision,
        }),
      });
      setRevision(saved.revision);
      onSaved(saved);
      onDirty(false);
      setMessage("リポジトリ内に保存しました");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "保存できませんでした",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="toolbar">
        <h1>{project.title || "新しい記事"}</h1>
        <div>
          <button type="button" onClick={() => setPreview(!preview)}>
            {preview ? "編集に戻る" : "本文をプレビュー"}
          </button>
          <button
            className="primary"
            type="button"
            onClick={save}
            disabled={busy}
          >
            {busy ? "保存中…" : "保存"}
          </button>
        </div>
      </div>
      <p role="status" className="message">
        {message}
      </p>
      {!preview && (
        <div className="fields">
          <label>
            記事名
            <input
              value={project.title}
              onChange={(e) => change("title", e.target.value)}
            />
          </label>
          <label>
            記事URL
            <input value={project.slug} disabled />
            <small>作成時に決めたURLは変更しません。</small>
          </label>
          <label className="full">
            カバー画像
            {project.cover && (
              <img
                src={project.cover.src}
                alt={project.cover.alt}
                style={{ maxWidth: 260, maxHeight: 160, objectFit: "contain" }}
              />
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                setBusy(true);
                try {
                  const data = new FormData();
                  data.set("file", file);
                  data.set("slug", project.slug);
                  const result = await api("/api/upload", {
                    method: "POST",
                    body: data,
                  });
                  change("cover", { src: result.url, alt: project.title });
                } catch (error) {
                  setMessage((error as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            />
            {project.cover && (
              <button type="button" onClick={() => change("cover", undefined)}>
                カバーを外す
              </button>
            )}
          </label>
          <label className="full">
            短い紹介
            <textarea
              value={project.description}
              onChange={(e) => change("description", e.target.value)}
            />
          </label>
          <label>
            作品の種類
            <select
              value={project.category}
              onChange={(e) =>
                change("category", e.target.value as Project["category"])
              }
            >
              <option value="game">ゲーム</option>
              <option value="tool">ツール・Web</option>
            </select>
          </label>
          <label>
            技術タグ（カンマ区切り）
            <input
              value={project.tags.join(", ")}
              onChange={(e) =>
                change(
                  "tags",
                  e.target.value.split(",").map((tag) => tag.trim()),
                )
              }
            />
          </label>
          <label className="full">
            担当内容
            <input
              value={project.role}
              onChange={(e) => change("role", e.target.value)}
            />
          </label>
          <label>
            制作体制
            <input
              placeholder="記載する場合だけ入力"
              value={project.team}
              onChange={(e) => change("team", e.target.value)}
            />
          </label>
          <label>
            制作期間
            <input
              placeholder="記載する場合だけ入力"
              value={project.period}
              onChange={(e) => change("period", e.target.value)}
            />
          </label>
          <label>
            作品の最終更新日
            <input
              placeholder="制作期間と分けて記載する場合だけ入力"
              value={project.lastUpdated ?? ""}
              onChange={(e) => change("lastUpdated", e.target.value)}
            />
          </label>
          <label className="checkbox full">
            <input
              type="checkbox"
              checked={project.published}
              onChange={(e) => change("published", e.target.checked)}
            />
            公開する（オフの記事は静的ビルドに含めません）
          </label>
          <fieldset className="full">
            <legend>外部リンク</legend>
            {project.links.map((link, index) => (
              <div className="link-row" key={index}>
                <input
                  aria-label="リンク名"
                  placeholder="リンク名"
                  value={link.label}
                  onChange={(e) =>
                    change(
                      "links",
                      project.links.map((item, i) =>
                        i === index ? { ...item, label: e.target.value } : item,
                      ),
                    )
                  }
                />
                <input
                  aria-label="リンクURL"
                  placeholder="https://…"
                  value={link.href}
                  onChange={(e) =>
                    change(
                      "links",
                      project.links.map((item, i) =>
                        i === index ? { ...item, href: e.target.value } : item,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    change(
                      "links",
                      project.links.filter((_, i) => i !== index),
                    )
                  }
                >
                  削除
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                change("links", [...project.links, { label: "", href: "" }])
              }
            >
              リンクを追加
            </button>
          </fieldset>
        </div>
      )}
      <details className="editor-outline" open>
        <summary>目次（見出しから自動生成）</summary>
        <ol>
          {outline.map(({ id, text, level }) => (
            <li key={id} style={{ marginLeft: level > 2 ? "1.25rem" : 0 }}>{text}</li>
          ))}
        </ol>
      </details>
      <div className="editor-paper">
        <BlockNoteView
          editor={editor}
          theme="light"
          editable={!preview}
          onChange={() => {
            onDirty(true);
            setOutline(getArticleHeadings(editor.document));
          }}
        />
      </div>
      <p className="hint">
        概要・制作の目的・担当したこと・工夫した点を入口に、その後は自由に追記できます。目次は見出しに追従します。「/」で見出し・リスト・画像・動画などを追加できます。画像や動画はリポジトリのpublic/mediaへ保存します。
      </p>
      {project.published && (
        <a
          className="hint"
          href={`http://localhost:3000/portfolio/works/${project.slug}/`}
          target="_blank"
          rel="noreferrer"
        >
          サイトで見る ↗
        </a>
      )}
    </>
  );
}

function SkillsForm({ onDirty }: { onDirty: (dirty: boolean) => void }) {
  const [data, setData] = useState<{
    document: Skills;
    revision: string;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    api("/api/skills")
      .then(setData)
      .catch((e) => setMessage(e.message));
  }, []);
  useEffect(() => {
    function warn(event: BeforeUnloadEvent) {
      if (dirty) event.preventDefault();
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  if (!data) return <p role="status">{message || "読み込み中…"}</p>;
  function change(document: Skills) {
    setData((current) => current && { ...current, document });
    setDirty(true);
    onDirty(true);
  }
  async function save() {
    setBusy(true);
    try {
      setData(
        await api("/api/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
      );
      setDirty(false);
      onDirty(false);
      setMessage("保存しました");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="toolbar">
        <h1>得意分野とスキル</h1>
        <button
          type="button"
          className="primary"
          onClick={save}
          disabled={busy}
        >
          保存
        </button>
      </div>
      <p role="status">{message}</p>
      <h2>取り組んでいること</h2>
      {data.document.strengths.map((item, index) => (
        <div className="fields" key={index}>
          <label>
            見出し
            <input
              value={item.title}
              onChange={(e) =>
                change({
                  ...data.document,
                  strengths: data.document.strengths.map((row, i) =>
                    i === index ? { ...row, title: e.target.value } : row,
                  ),
                })
              }
            />
          </label>
          <label>
            説明
            <textarea
              value={item.description}
              onChange={(e) =>
                change({
                  ...data.document,
                  strengths: data.document.strengths.map((row, i) =>
                    i === index ? { ...row, description: e.target.value } : row,
                  ),
                })
              }
            />
          </label>
        </div>
      ))}
      <h2>習熟度</h2>
      <p className="hint">習熟度と、使った場面・現在の状態を編集できます。</p>
      {data.document.skills.map((skill, index) => (
        <div className="skill-row" key={index}>
          <label className="skill-note">
            {skill.name}
            <textarea
              aria-label={`${skill.name}の補足`}
              value={skill.note}
              onChange={(e) =>
                change({
                  ...data.document,
                  skills: data.document.skills.map((row, i) =>
                    i === index ? { ...row, note: e.target.value } : row,
                  ),
                })
              }
            />
          </label>
          <span>{skill.category}</span>
          <select
            aria-label={`${skill.name}の習熟度`}
            value={skill.level ?? ""}
            onChange={(e) =>
              change({
                ...data.document,
                skills: data.document.skills.map((row, i) =>
                  i === index
                    ? {
                        ...row,
                        level: e.target.value ? Number(e.target.value) : null,
                      }
                    : row,
                ),
              })
            }
          >
            <option value="">未設定</option>
            {levels.slice(1).map((label, i) => (
              <option key={label} value={i + 1}>
                {label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </>
  );
}

export default function Editor() {
  const [articles, setArticles] = useState<Project[]>([]);
  const [current, setCurrent] = useState<Article | null>(null);
  const [tab, setTab] = useState("articles");
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty;
  async function loadList() {
    setArticles(await api("/api/articles"));
  }
  async function open(slug: string) {
    if (
      dirtyRef.current &&
      !window.confirm("未保存の内容があります。破棄して別の記事を開きますか？")
    )
      return;
    try {
      setCurrent(await api(`/api/articles/${slug}`));
      setDirty(false);
      setTab("articles");
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  useEffect(() => {
    loadList().catch((e) => setMessage(e.message));
    const slug = new URLSearchParams(window.location.search).get("slug");
    if (slug) void open(slug);
  }, []);
  useEffect(() => {
    function warn(event: BeforeUnloadEvent) {
      if (dirtyRef.current) event.preventDefault();
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  function create() {
    if (dirty && !window.confirm("未保存の内容を破棄しますか？")) return;
    const slug = window.prompt(
      "記事URLを半角英小文字・数字・ハイフンで入力してください",
    );
    if (!slug) return;
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
      articles.some((item) => item.slug === slug)
    ) {
      setMessage("URLの形式が正しくないか、すでに使われています");
      return;
    }
    setCurrent({
      revision: null,
      document: {
        slug,
        title: "新しい記事",
        category: "game",
        description: "",
        role: "",
        tags: [],
        links: [],
        team: "",
        period: "",
        published: false,
        blocks: createArticleBlocks(),
      },
    });
    setDirty(true);
    setTab("articles");
  }
  return (
    <div className="studio">
      <aside>
        <a className="brand" href="http://localhost:3000/portfolio/">
          cotore-game ↗
        </a>
        <p className="hint">ローカル記事編集</p>
        <button type="button" className="primary" onClick={create}>
          新しい記事
        </button>
        <nav aria-label="記事一覧">
          {articles.map((article) => (
            <button
              key={article.slug}
              type="button"
              className={
                current?.document.slug === article.slug && tab === "articles"
                  ? "selected"
                  : ""
              }
              onClick={() => void open(article.slug)}
            >
              {article.title}
              {!article.published && "（下書き）"}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => {
            if (dirty && !window.confirm("未保存の内容を破棄しますか？"))
              return;
            setTab("skills");
            setDirty(false);
          }}
        >
          スキルを編集
        </button>
      </aside>
      <main>
        <p role="alert">{message}</p>
        {tab === "skills" ? (
          <SkillsForm onDirty={setDirty} />
        ) : current ? (
          <ArticleForm
            key={current.document.slug}
            initial={current}
            onDirty={setDirty}
            onSaved={(saved) => {
              setCurrent(saved);
              void loadList();
            }}
          />
        ) : (
          <div className="welcome">
            <h1>制作の話を、少し詳しく。</h1>
            <p>記事を選ぶか、新しい記事を作成してください。</p>
            <p>
              本文はJSON、画像・動画はpublic/mediaへ保存します。保存した変更はGitで確認できます。
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
