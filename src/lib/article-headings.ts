import type { PartialBlock } from "@blocknote/core";

export type ArticleHeading = { id: string; text: string; level: number };

function inlineText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map(inlineText).join("");
  if (content && typeof content === "object") {
    if ("text" in content && typeof content.text === "string") return content.text;
    if ("content" in content) return inlineText(content.content);
  }
  return "";
}

export function getArticleHeadings(blocks: PartialBlock[]): ArticleHeading[] {
  const headings: ArticleHeading[] = [];
  function visit(items: PartialBlock[]) {
    for (const block of items) {
      if (block.type === "heading") {
        headings.push({
          id: `article-heading-${headings.length + 1}`,
          text: inlineText(block.content).trim() || "見出し",
          level: block.props?.level ?? 2,
        });
      }
      if (block.children) visit(block.children);
    }
  }
  visit(blocks);
  return headings;
}

// The input is the HTML produced by BlockNote, not arbitrary page HTML.
export function prepareArticleHtml(html: string, headings: ArticleHeading[]) {
  let index = 0;
  const anchored = html.replace(/<h([1-6])\b([^>]*)>/g, (_, level, attributes) => {
    const heading = headings[index++];
    if (!heading || heading.level !== Number(level))
      throw new Error("記事の見出しと目次が一致しません");
    return `<h${level}${attributes.replace(/\s+id="[^"]*"/g, "")} id="${heading.id}">`;
  });
  if (index !== headings.length) throw new Error("記事の見出しを出力できませんでした");
  // BlockNote's external HTML serializer does not add playback controls.
  return anchored.replace(/<video\b([^>]*)>/g, (_, attributes) =>
    `<video${attributes} controls playsinline preload="metadata">`,
  );
}
