import test from "node:test";
import assert from "node:assert/strict";
import { getArticleHeadings, prepareArticleHtml } from "../src/lib/article-headings.ts";
import { createArticleBlocks } from "../src/lib/article-template.ts";

test("nested and duplicate rich-text headings have distinct, resolvable anchors", () => {
  const headings = getArticleHeadings([
    { type: "heading", props: { level: 2 }, content: [
      { type: "text", text: "A & ", styles: { bold: true } },
      { type: "link", href: "https://example.com", content: [{ type: "text", text: "B", styles: {} }] },
    ], children: [{ type: "heading", props: { level: 3 }, content: "A & B" }] },
  ]);
  assert.deepEqual(headings.map(h => h.text), ["A & B", "A & B"]);
  assert.equal(new Set(headings.map(h => h.id)).size, 2);
  const html = prepareArticleHtml('<h2>A &amp; B</h2><h3>A &amp; B</h3>', headings);
  for (const heading of headings) assert(html.includes(`id="${heading.id}"`));
});

test("video is playable without autoplay and keeps its source and caption", () => {
  const html = prepareArticleHtml('<figure><video src="/portfolio/media/demo/play.mp4"></video><figcaption>動画</figcaption></figure>', []);
  assert.match(html, /controls playsinline preload="metadata"/);
  assert.match(html, /src="\/portfolio\/media\/demo\/play.mp4"/);
  assert.match(html, /<figcaption>動画<\/figcaption>/);
  assert(!html.includes("autoplay"));
});

test("mismatched export headings fail instead of silently breaking navigation", () => {
  const headings = getArticleHeadings([{ type: "heading", props: { level: 2 }, content: "概要" }]);
  assert.throws(() => prepareArticleHtml("<p>概要</p>", headings));
  assert.throws(() => prepareArticleHtml("<h3>概要</h3>", headings));
});

test("new article templates do not share mutable blocks", () => {
  const first = createArticleBlocks();
  const second = createArticleBlocks();
  first[0].content = "変更";
  assert.equal(second[0].content, "概要");
});
