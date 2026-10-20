import { listArticles, localOnly } from "../../../lib/store";
export async function GET(request: Request) {
  try {
    localOnly(request);
    return Response.json(await listArticles());
  } catch {
    return Response.json(
      { error: "記事一覧を取得できませんでした" },
      { status: 400 },
    );
  }
}
