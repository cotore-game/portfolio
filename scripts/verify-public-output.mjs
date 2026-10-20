import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../out",
);
for (const directory of ["api", "studio"]) {
  if (
    await stat(path.join(out, directory)).catch((error) => {
      if (error.code === "ENOENT") return null;
      throw error;
    })
  )
    throw new Error(`開発用のルートが公開出力に含まれています: ${directory}`);
}
const forbidden = [
  "localhost:3002",
  "127.0.0.1:3002",
  "記事を書く",
  "この記事を編集する",
];
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await inspect(file);
      continue;
    }
    if (!/\.(html|js|json|txt)$/.test(entry.name)) continue;
    const text = await readFile(file, "utf8");
    for (const marker of forbidden)
      if (text.includes(marker))
        throw new Error(
          `開発用の表示が公開出力に含まれています: ${path.relative(out, file)} (${marker})`,
        );
  }
}
await inspect(out);
console.log("公開出力を確認: 編集リンク・編集画面・保存APIなし");
