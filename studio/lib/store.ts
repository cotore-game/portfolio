import { readFile, readdir, mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import {
  projectSchema,
  slugSchema,
  skillsSchema,
} from "../../src/lib/content-schema";

export const root = path.resolve(
  process.cwd(),
  path.basename(process.cwd()) === "studio" ? ".." : ".",
);
export function localOnly(request: Request) {
  if (process.env.NODE_ENV !== "development")
    throw new Error("開発環境でのみ利用できます");
  const host = request.headers.get("host") ?? "";
  if (!/^(localhost|127\.0\.0\.1):3002$/.test(host))
    throw new Error("ローカルホストで開いてください");
  const origin = request.headers.get("origin");
  if (
    origin &&
    !["http://localhost:3002", "http://127.0.0.1:3002"].includes(origin)
  )
    throw new Error("許可されていないアクセスです");
}
export function articlePath(slug: string) {
  return path.join(root, "content/projects", `${slugSchema.parse(slug)}.json`);
}
export async function readDocument(file: string) {
  try {
    const text = await readFile(file, "utf8");
    return {
      document: JSON.parse(text),
      revision: createHash("sha256").update(text).digest("hex"),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
export async function saveDocument(
  file: string,
  document: unknown,
  revision: string | null,
) {
  const current = await readDocument(file);
  if ((current?.revision ?? null) !== revision) return null;
  await mkdir(path.dirname(file), { recursive: true });
  const text = JSON.stringify(document, null, 2) + "\n";
  const temporary = `${file}.${randomUUID()}.tmp`;
  await writeFile(temporary, text, "utf8");
  await rename(temporary, file);
  return {
    document,
    revision: createHash("sha256").update(text).digest("hex"),
  };
}
export async function listArticles() {
  const names = (await readdir(path.join(root, "content/projects"))).filter(
    (name) => name.endsWith(".json"),
  );
  return Promise.all(
    names.map(async (name) =>
      projectSchema.parse(
        (await readDocument(path.join(root, "content/projects", name)))!
          .document,
      ),
    ),
  );
}
export { projectSchema, skillsSchema };
