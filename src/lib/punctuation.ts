import type { PartialBlock } from "@blocknote/core";

function inline(content: unknown): unknown[] {
  const items = Array.isArray(content) ? content : [content];
  return items.flatMap((item) => {
    const text =
      typeof item === "string"
        ? item
        : item?.type === "text"
          ? item.text
          : null;
    if (typeof text === "string") {
      return text
        .split(/(。)/)
        .filter(Boolean)
        .map((part) => ({
          type: "text",
          text: part,
          styles: {
            ...(typeof item === "object" ? item.styles : {}),
            ...(part === "。" ? { textColor: "#61754a" } : {}),
          },
        }));
    }
    if (item?.type === "link")
      return [{ ...item, content: inline(item.content) }];
    return [item];
  });
}
export function accentPunctuation(blocks: PartialBlock[]): PartialBlock[] {
  return blocks.map((block) => ({
    ...block,
    ...(typeof block.content === "string" || Array.isArray(block.content)
      ? { content: inline(block.content) as PartialBlock["content"] }
      : {}),
    ...(block.children ? { children: accentPunctuation(block.children) } : {}),
  })) as PartialBlock[];
}
