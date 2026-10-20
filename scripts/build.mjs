import { spawnSync } from "node:child_process";
import { readFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const result = spawnSync(
  process.execPath,
  [path.join(root, "node_modules/next/dist/bin/next"), "build"],
  { cwd: root, stdio: "inherit" },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

// The public directory is copied by Next.js. Remove media belonging to drafts.
const published = new Set();
for (const name of await readdir(path.join(root, "content/projects"))) {
  if (!name.endsWith(".json")) continue;
  const project = JSON.parse(
    await readFile(path.join(root, "content/projects", name), "utf8"),
  );
  if (project.published) published.add(project.slug);
}
const collections = JSON.parse(
  await readFile(path.join(root, "content/collections.json"), "utf8"),
);
for (const entry of [...collections.experience, ...collections.inProgress])
  published.add(entry.id);
const media = path.join(root, "out/media");
for (const entry of await readdir(media, { withFileTypes: true }).catch(
  (error) => {
    if (error.code === "ENOENT") return [];
    throw error;
  },
)) {
  if (entry.isDirectory() && !published.has(entry.name)) {
    const target = path.resolve(media, entry.name);
    if (path.dirname(target) !== media)
      throw new Error("Unexpected media path");
    await rm(target, { recursive: true });
  }
}

await import("./verify-public-output.mjs");
