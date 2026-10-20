import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { root, localOnly } from "../../../lib/store";
import { slugSchema } from "../../../../src/lib/content-schema";
const extensions: Record<string, string[]> = {
  ".png": ["image/png"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".gif": ["image/gif"],
  ".webp": ["image/webp"],
  ".avif": ["image/avif"],
  ".mp4": ["video/mp4"],
  ".webm": ["video/webm"],
  ".mp3": ["audio/mpeg"],
  ".wav": ["audio/wav", "audio/x-wav"],
};
export async function POST(request: Request) {
  try {
    localOnly(request);
    const data = await request.formData();
    const slug = slugSchema.parse(data.get("slug"));
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("ファイルを選んでください");
    const extension = path.extname(file.name).toLowerCase();
    if (!extensions[extension]?.includes(file.type))
      throw new Error(
        "PNG / JPEG / GIF / WebP / AVIF / MP4 / WebM / MP3 / WAVを使ってください",
      );
    if (file.size > 100 * 1024 * 1024)
      throw new Error("1ファイル100MBまでです");
    const directory = path.join(root, "public/media", slug);
    await mkdir(directory, { recursive: true });
    const name = `${randomUUID()}${extension}`;
    await writeFile(
      path.join(directory, name),
      Buffer.from(await file.arrayBuffer()),
      { flag: "wx" },
    );
    return Response.json({ url: `/portfolio/media/${slug}/${name}` });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "アップロードできませんでした",
      },
      { status: 400 },
    );
  }
}
