import path from "node:path";
import {
  root,
  localOnly,
  readDocument,
  saveDocument,
  skillsSchema,
} from "../../../lib/store";
export async function GET(request: Request) {
  try {
    localOnly(request);
    return Response.json(
      await readDocument(path.join(root, "content/skills.json")),
    );
  } catch {
    return Response.json({ error: "取得できませんでした" }, { status: 400 });
  }
}
export async function PUT(request: Request) {
  try {
    localOnly(request);
    const data = await request.json();
    const document = skillsSchema.parse(data.document);
    const saved = await saveDocument(
      path.join(root, "content/skills.json"),
      document,
      data.revision ?? null,
    );
    return saved
      ? Response.json(saved)
      : Response.json(
          { error: "別の画面で変更されています。再読み込みしてください。" },
          { status: 409 },
        );
  } catch {
    return Response.json(
      { error: "スキルを保存できませんでした" },
      { status: 400 },
    );
  }
}
