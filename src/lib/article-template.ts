import type { PartialBlock } from "@blocknote/core";

export const articleSections = [
  "概要", "制作の目的", "担当したこと", "工夫した点",
] as const;

export function createArticleBlocks(): PartialBlock[] {
  return articleSections.flatMap((content): PartialBlock[] => [
    { type: "heading", props: { level: 2 }, content },
    { type: "paragraph", content: "" },
  ]);
}
