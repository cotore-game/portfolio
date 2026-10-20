import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  projectSchema,
  skillsSchema,
  collectionsSchema,
  type Project,
} from "./content-schema";

export async function getProjects(): Promise<Project[]> {
  const directory = path.join(process.cwd(), "content/projects");
  const names = (await readdir(directory))
    .filter((name) => name.endsWith(".json"))
    .sort();
  const projects = await Promise.all(
    names.map(async (name) => {
      const project = projectSchema.parse(
        JSON.parse(await readFile(path.join(directory, name), "utf8")),
      );
      if (name !== `${project.slug}.json`)
        throw new Error(`記事のファイル名とslugが一致しません: ${name}`);
      return project as Project;
    }),
  );
  return projects
    .filter((project) => project.published)
    .sort(
      (a, b) => Number(b.category === "game") - Number(a.category === "game"),
    );
}
export async function getSkills() {
  return skillsSchema.parse(
    JSON.parse(
      await readFile(path.join(process.cwd(), "content/skills.json"), "utf8"),
    ),
  );
}

export async function getCollections() {
  return collectionsSchema.parse(
    JSON.parse(
      await readFile(
        path.join(process.cwd(), "content/collections.json"),
        "utf8",
      ),
    ),
  );
}
