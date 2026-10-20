import {
  articlePath,
  localOnly,
  readDocument,
  saveDocument,
  projectSchema,
} from "../../../../lib/store";
import { ServerBlockNoteEditor } from "@blocknote/server-util";
import type { PartialBlock } from "@blocknote/core";
type Context = { params: Promise<{ slug: string }> };
export async function GET(request: Request, { params }: Context) {
  try {
    localOnly(request);
    const { slug } = await params;
    const result = await readDocument(articlePath(slug));
    return result
      ? Response.json(result)
      : Response.json({ error: "記事がありません" }, { status: 404 });
  } catch {
    return Response.json(
      { error: "記事を取得できませんでした" },
      { status: 400 },
    );
  }
}
export async function PUT(request: Request, { params }: Context) {
  try {
    localOnly(request);
    const { slug } = await params;
    const payload = await request.json();
    const project = projectSchema.parse(payload.document);
    if (project.slug !== slug) throw new Error("slugが一致しません");
    await ServerBlockNoteEditor.create().blocksToHTMLLossy(
      project.blocks as PartialBlock[],
    );
    const saved = await saveDocument(
      articlePath(slug),
      project,
      payload.revision ?? null,
    );
    if (!saved)
      return Response.json(
        {
          error:
            "別の画面かファイルで変更されています。本文をコピーしてから再読み込みしてください。",
        },
        { status: 409 },
      );
    return Response.json(saved);
  } catch {
    return Response.json(
      {
        error:
          "保存できませんでした。URL・記事名・本文などの入力を確認してください。",
      },
      { status: 400 },
    );
  }
}
